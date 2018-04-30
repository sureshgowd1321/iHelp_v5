/**
 * Generated class for the CommentsPage page.
 */
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';

import { Http } from '@angular/http'; // , Headers, RequestOptions
import * as firebase from 'firebase/app'; 

//Constants
import { constants } from '../../constants/constants';

// Providers
import { PhpServiceProvider } from '../../providers/php-service/php-service';
import { ProfileDataProvider } from '../../providers/profile-data/profile-data';

// Interfaces
import { IPosts } from '../../providers/interfaces/interface';
import { IComment } from '../../providers/interfaces/interface';

// Pages
import { UserProfilePage } from '../user-profile/user-profile';
import { DisplayPostLikesPage } from '../display-post-likes/display-post-likes';
import { HomePage } from '../../pages/home/home';

// Order Pipe
import { OrderPipe } from 'ngx-order-pipe';

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  user;
  postId: any;
  posts:  IPosts[] = [];
  postItem: any;
  isIndexed: string;
  isRemoveFromSlice: string;

  public postObj : any;
  public userObj : any;
  public profilePic : string;
  public isPostInWishlist: boolean;
  public likesCount : number;
  public isPostLiked : boolean;
  public commentsCount : number;

  public comments: IComment[] = [];

  // Order By Variables
  order: string = 'id';
  reverse: boolean = false;

  commentInput: string;

  private baseURI   : string  = "http://"+constants.IPAddress+"/ionic-php-mysql/";

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http,
              private profileData: ProfileDataProvider,
              public phpService: PhpServiceProvider,
              public alertCtrl: AlertController,
              public actionSheetCtrl: ActionSheetController,
              private orderPipe: OrderPipe ) {
    
    this.user = firebase.auth().currentUser; 
    
    this.postId = this.navParams.get('postId');
    this.posts = this.navParams.get('posts');
    this.postItem = this.navParams.get('postItem');
    this.isIndexed = this.navParams.get('updateIndex');
    this.isRemoveFromSlice = this.navParams.get('removeFromList');
  }

  ionViewWillEnter()
  {   
    this.loadpostInfo();
    this.loadAllComments(this.postId);
  }

  loadpostInfo(){
    this.phpService.getPostInfo(this.postId).subscribe(postInfo =>{ 
      this.phpService.getUserInfo(postInfo.CreatedById).subscribe(userinfo => {
        this.phpService.getUserProfilePic(postInfo.CreatedById).subscribe(userProfilePic => {
          this.phpService.getWishlistFromUserId(this.user.uid).subscribe(wishlistInfo => {   
            this.phpService.getlikesCount(postInfo.ID).subscribe(likesCount => {
              this.phpService.getlikeInfoPerUser(this.user.uid, this.postId).subscribe(userLikeInfo => {
                this.phpService.getCountOfComments(postInfo.ID).subscribe(commentsCount => {

                  // Check post is liked by loggedin User or not
                  let isLiked = false;
                  if( userLikeInfo === 0 ){
                  }else{
                    isLiked = true;
                  }

                  // Get Wishlist information
                  let isInWishlist = false;

                  if( wishlistInfo.length === 0 ){
                  } else {
                    wishlistInfo.forEach(wishObj=>{
          
                      if(wishObj.PostId === this.postId){
                        isInWishlist = true;
                      }    
                    });
                  }

                  this.postObj = postInfo;
                  this.userObj = userinfo;
                  this.profilePic = this.baseURI + userProfilePic.images_path;
                  this.isPostInWishlist = isInWishlist;
                  this.likesCount = likesCount;
                  this.isPostLiked = isLiked;
                  this.commentsCount = commentsCount;
                });
              });
            });
          });
        });
      });
    });
  }

  // Retrieve the JSON encoded data from the remote server
  // Using Angular's Http class and an Observable - then
  // assign this to the items array for rendering to the HTML template
  loadAllComments(postId)
  {
    this.comments = [];

   this.phpService.getAllComments(postId).subscribe(commentsInfo => {

        if( commentsInfo.length === 0 ){
          console.log('***Empty Comments');
        } else {
          commentsInfo.forEach(commentObj=>{

            this.phpService.getUserInfo(commentObj.commentedBy).subscribe(userinfo => {
              this.phpService.getUserProfilePic(commentObj.commentedBy).subscribe(userProfilePic => {

                this.comments.push({
                  "id"            : commentObj.ID,
                  "postId"        : commentObj.postId,
                  "comment"       : commentObj.comment,
                  "commentedBy"   : commentObj.commentedBy,
                  "commentedDate" : commentObj.commentedDate,
                  "name"          : userinfo.name,
                  "nickname"      : userinfo.nickname,
                  "profilePic"    : this.baseURI + userProfilePic.images_path
                });
              });      
            });     
          });
          this.comments = this.orderPipe.transform(this.comments, 'id');
        }
      });
  }

  // Add Comments
  postComment(commentDesc: string) {

    this.phpService.addComments(this.postId, commentDesc, this.user.uid)
    .subscribe(res => {
      this.commentInput = '';
      this.loadAllComments(this.postId);

      this.commentsCount += 1;

      if(this.isIndexed === 'UpdateIndex'){
        var index = this.posts.indexOf(this.postItem);
        this.posts[index].commentsCount += 1;
      }

    });
  }

  // Edit Comments
  editComment(commentId: string, commentDesc: string): void {
    let alert = this.alertCtrl.create({
      message: "Update your comment",
      inputs: [
        {
          name: 'editPostDesc',
          value: commentDesc
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.loadAllComments(this.postId);
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.phpService.updateComment(commentId, data.editPostDesc)
                .subscribe(res => {
                  this.loadAllComments(this.postId);
                });
          }
        }
      ]
    });
    alert.present();
  }

  // Delete Comments
  deleteComment(commentId: string): void {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure, you want to Delete?',
      buttons: [
        {
          text: "No",
          role: 'cancel',
          handler: () => {
            this.loadAllComments(this.postId);
          }
        },
        {
          text: "Yes",
          handler: () => {  
            this.phpService.deleteComment(commentId)
                .subscribe(res => {
                  this.loadAllComments(this.postId);

                  this.commentsCount -= 1;

                  if(this.isIndexed === 'UpdateIndex'){
                    var index = this.posts.indexOf(this.postItem);
                    this.posts[index].commentsCount -= 1;
                  }
                });
          }
        }
      ]
    })
    alert.present();
  }

  // Pull to Refresh functionality
  dorefresh(refresher) {
    this.loadpostInfo();
    this.loadAllComments(this.postId);
    if(refresher != 0)
      refresher.complete();
  
  }

  // Display Image in Full Screen  
  displayImageFullScreen(imageToView) {
    this.profileData.displayImageInFullScreen(imageToView);
  }

  // Goto Comments Page
  gotoUsersPage(userId: any) {
    this.navCtrl.push(UserProfilePage, {
      userId
    });
  }

  // Add Wishlist
  addToWishlist(){
    this.phpService.addWishlist(this.user.uid, this.postId).subscribe(wishlistInfo => {
      this.isPostInWishlist = true;

      if(this.isIndexed === 'UpdateIndex'){
        var index = this.posts.indexOf(this.postItem);
        this.posts[index].addedToWishlist = true;
      }
    });
  }

  // Remove Wishlist
  removeFromWishlist(){
    this.phpService.deleteWishlist(this.user.uid, this.postId).subscribe(wishlistInfo => {
      this.isPostInWishlist = false;

      if(this.isIndexed === 'UpdateIndex'){
        var index = this.posts.indexOf(this.postItem);
        this.posts[index].addedToWishlist = false;

        if(this.isRemoveFromSlice === 'RemoveSlice'){
          if (index !== -1) {
            this.posts.splice(index, 1);
          }
        }
      }
    });
  }

  // Add Like
  addLike(){
    
    this.phpService.addLike(this.user.uid, this.postId).subscribe(likeInfo => {
      this.likesCount += 1;
      this.isPostLiked = true;  

      if(this.isIndexed === 'UpdateIndex'){
        var index = this.posts.indexOf(this.postItem);
        this.posts[index].likesCount += 1;
        this.posts[index].isPostLiked = true;
      }

    });
  }

  // Remove Like
  removeLike(){
    this.phpService.deleteLike(this.user.uid, this.postId).subscribe(likeInfo => {
      this.likesCount -= 1;
      this.isPostLiked = false;

      if(this.isIndexed === 'UpdateIndex'){
        var index = this.posts.indexOf(this.postItem);
        this.posts[index].likesCount -= 1;
        this.posts[index].isPostLiked = false;
      }

    });
  }

  // Go to Edit Post Page to update the post
  gotoLikesPage(postId: any) {
    this.navCtrl.push(DisplayPostLikesPage, {
      postId
    });
  }

}
