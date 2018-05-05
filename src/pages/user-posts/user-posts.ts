/**
 * Generated class for the UserPostsPage page.
 */
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import * as firebase from 'firebase/app'; 

// Interfaces
import { IPosts } from '../../providers/interfaces/interface';

// Providers
import { PhpServiceProvider } from '../../providers/php-service/php-service';
import { ProfileDataProvider } from '../../providers/profile-data/profile-data';

//Constants
import { constants } from '../../constants/constants';

//Pages
import { EditPostPage } from '../edit-post/edit-post';
import { CommentsPage } from '../comments/comments';

// Order Pipe
import { OrderPipe } from 'ngx-order-pipe';

@IonicPage()
@Component({
  selector: 'page-user-posts',
  templateUrl: 'user-posts.html',
})
export class UserPostsPage {

  public loggedInUser;
  public posts: IPosts[] = [];
  public userUId: string;
  private baseURI   : string  = "http://"+constants.IPAddress+"/ionic-php-mysql/";

  // Variables to pass comments page
  postId: any;
  postItem: any;

  // Order By Variables
  order: string = 'id';
  reverse: boolean = true;

  // Pagination Variables
  page = 1;
  maximumPages = 40;

  // Capture
  public base64Image: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private profileData: ProfileDataProvider,
              public actionSheetCtrl: ActionSheetController,
              public phpService: PhpServiceProvider,
              public alertCtrl: AlertController,
              private orderPipe: OrderPipe) {

    this.loggedInUser = firebase.auth().currentUser.uid; 
    
    this.userUId = this.navParams.get('userId');
  }

  ionViewDidLoad()
  {  
    this.posts = [];
    this.page = 1;
    this.loadPosts();
  }

  loadPosts(infiniteScroll?){
    this.phpService.getPostsFromUserId(this.page, this.userUId).subscribe(postdata => {

      postdata.forEach(postInfo => {

        this.phpService.getUserInfo(postInfo.CreatedById).subscribe(userinfo => {
          this.phpService.getUserProfilePic(postInfo.CreatedById).subscribe(userProfilePic => {                        
            this.phpService.getLocationInfo(userinfo.PostalCode).subscribe(userLocationInfo => {                         
              this.phpService.getlikesCount(postInfo.ID).subscribe(likesCount => {
                this.phpService.getlikeInfoPerUser(this.loggedInUser, postInfo.ID).subscribe(userLikeInfo => {
                  this.phpService.getWishlistFromUserId(this.loggedInUser).subscribe(wishlistInfo => {                                
                    this.phpService.getCountOfComments(postInfo.ID).subscribe(commentsCount => {
                      this.phpService.getPostImages(postInfo.ID).subscribe(postImages => {

                        // Check post is liked by loggedin User or not
                        let isPostLiked = false;
                        if( userLikeInfo === 0 ){
                        }else{
                          isPostLiked = true;
                        }

                        // Check post is added to wishlist or not
                        let isPostInWishlist = false;
                        if( wishlistInfo.length === 0 ){
                        } else {
                          wishlistInfo.forEach(wishObj=>{
                
                            if(wishObj.PostId === postInfo.ID){
                              isPostInWishlist = true;
                            }    
                          });
                        }

                        // Check each post has Image or not
                        let postImage;
                        if(postImages != false){
                          postImage = this.baseURI + postImages.images_path;
                        }

                        this.posts.push(
                          {
                            "id"           : postInfo.ID,
                            "post"         : postInfo.post,
                            "createdDate"  : postInfo.CreatedDate,
                            "createdById"  : postInfo.CreatedById,
                            "name"         : userinfo.name,
                            "email"        : userinfo.email,
                            "nickname"     : userinfo.nickname,
                            "city"         : userLocationInfo.City,
                            "state"        : userLocationInfo.State,
                            "country"      : userLocationInfo.Country,
                            "profilePic"   : this.baseURI + userProfilePic.images_path,
                            "wishId"       : wishlistInfo.id,
                            "addedToWishlist" : isPostInWishlist,
                            "likesCount"   : likesCount,
                            "isPostLiked"  : isPostLiked,
                            "commentsCount": commentsCount,
                            "postImages"   : postImage
                          }
                        );
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
      this.posts = this.orderPipe.transform(this.posts, 'id');

      if (infiniteScroll) {
        infiniteScroll.complete();
      }
    });
  }

  loadMore(infiniteScroll){
    this.page++;

    this.loadPosts(infiniteScroll);

    if (this.page === this.maximumPages) {
      infiniteScroll.enable(false);
    }
  }

  // Pull to Refresh functionality
  loadrefresh(refresher) {
    this.posts.length = 0;
    this.page = 1;
    this.loadPosts();
    if(refresher != 0)
      refresher.complete();
  
  }

    // Goto Comments Page
    gotoCommentsPage(postId: any, posts: IPosts[], postItem: any) {
      let updateIndex = 'UpdateIndex';
      this.navCtrl.push(CommentsPage, {
        postId, posts, postItem, updateIndex
      });
    }

    // Goto Signup Page
    goToUserPosts(userId): void {
      this.navCtrl.push(UserPostsPage, {
        userId
      });
    }

    // Display Image in Full Screen  
    displayImageFullScreen(imageToView) {
      this.profileData.displayImageInFullScreen(imageToView);
    }

    // Action sheet on each post to modify/delete your post
    modifyCardActionSheet(postId: any, posts: IPosts[], postItem: any) {
      let actionSheet = this.actionSheetCtrl.create({
        //title: 'Modify your album',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.deletePost(postId, postItem);
            }
          },
          {
            text: 'Edit',
            handler: () => {
              this.gotoEditPostPage(postId, posts, postItem);
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
  
      actionSheet.present();
    }

     // Go to Edit Post Page to update the post
    gotoEditPostPage(postId: any, posts: IPosts[], postItem: any) {
      this.navCtrl.push(EditPostPage, {
        postId, posts, postItem
      });
    }

    // Delete the post
    deletePost(postId: any, postItem: any){
      let alert = this.alertCtrl.create({
        title: 'Confirm',
        message: 'Are you sure, you want to Delete?',
        buttons: [
          {
            text: "No",
            role: 'cancel'
          },
          {
            text: "Yes",
            handler: () => { 
              // Delete Post
              this.phpService.deletePost(postId); 
              
              // Delete Image of post
              this.phpService.deleteImage(postId).subscribe(res => {});

              var index = this.posts.indexOf(postItem);
              if (index !== -1) {
                this.posts.splice(index, 1);
              }  
            }
          }
        ]
      })
      alert.present();
    }

    // Add Like
    addLike(postId: any, postItem: any){
      this.phpService.addLike(this.loggedInUser, postId).subscribe(likeInfo => {
        var index = this.posts.indexOf(postItem);
        this.posts[index].likesCount += 1;
        this.posts[index].isPostLiked = true;
      });
    }

    // Remove Like
    removeLike(postId: any, postItem: any){
      this.phpService.deleteLike(this.loggedInUser, postId).subscribe(likeInfo => {
        var index = this.posts.indexOf(postItem);
        this.posts[index].likesCount -= 1;
        this.posts[index].isPostLiked = false;
      });
    }

    // Add Wishlist
    addToWishlist(postId: any, postItem: any){
      this.phpService.addWishlist(this.loggedInUser, postId).subscribe(wishlistInfo => {
        var index = this.posts.indexOf(postItem);
        this.posts[index].addedToWishlist = true;
      });
    }

    // Remove Wishlist
    removeFromWishlist(postId: any, postItem: any){
      this.phpService.deleteWishlist(this.loggedInUser, postId).subscribe(wishlistInfo => {
        var index = this.posts.indexOf(postItem);
        this.posts[index].addedToWishlist = false;
      });
    }
}
