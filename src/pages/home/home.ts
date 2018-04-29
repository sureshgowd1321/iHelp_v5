import { Component, Input } from '@angular/core'; // , OnInit
import { NavController, AlertController, ActionSheetController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as firebase from 'firebase/app'; 

//Pages
import { AddPostPage } from '../add-post/add-post';
import { EditPostPage } from '../edit-post/edit-post';
import { CommentsPage } from '../comments/comments';
import { FilterPostsPage } from '../filter-posts/filter-posts';
import { UserProfilePage } from '../user-profile/user-profile';

//Constants
import { constants } from '../../constants/constants';

// Providers
import { PhpServiceProvider } from '../../providers/php-service/php-service';
import { ProfileDataProvider } from '../../providers/profile-data/profile-data';

// Interfaces
import { IPosts } from '../../providers/interfaces/interface';

// Order Pipe
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    user;
    public posts: IPosts[] = [];

    // Order By Variables
    order: string = 'id';
    reverse: boolean = true;

    // HTTP Base URI 
    private baseURI   : string  = "http://"+constants.IPAddress+"/ionic-php-mysql/";

    // Pagination Variables
    page = 1;
    maximumPages = 40;

    postId: any;
    postItem: any;

    constructor(public http : Http, 
                public navCtrl: NavController,
                private profileData: ProfileDataProvider,
                public actionSheetCtrl: ActionSheetController,
                public phpService: PhpServiceProvider,
                public alertCtrl: AlertController,
                private orderPipe: OrderPipe) {
                
        this.user = firebase.auth().currentUser;  

    }

    ionViewDidLoad(){  
      this.posts.length = 0;
      this.page = 1;
      this.loadPosts();
    }

    loadPosts(infiniteScroll?){
      this.phpService.getPosts(this.page).subscribe(postdata => {

        postdata.forEach(postInfo => {

          this.phpService.getUserInfo(postInfo.CreatedById).subscribe(userinfo => {
            this.phpService.getUserProfilePic(postInfo.CreatedById).subscribe(userProfilePic => {                        
              this.phpService.getLocationInfo(userinfo.PostalCode).subscribe(userLocationInfo => {                         
                this.phpService.getlikesCount(postInfo.ID).subscribe(likesCount => {
                  this.phpService.getlikeInfoPerUser(this.user.uid, postInfo.ID).subscribe(userLikeInfo => {
                    this.phpService.getWishlistFromUserId(this.user.uid).subscribe(wishlistInfo => {                                
                      this.phpService.getCountOfComments(postInfo.ID).subscribe(commentsCount => {

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
                            "commentsCount": commentsCount
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

    // Go to Add post Page to add a post
    gotoAddPost() {
      this.navCtrl.push(AddPostPage);
    }

    // Go to Edit Post Page to update the post
    gotoEditPostPage(postId: any) {
      this.navCtrl.push(EditPostPage, {
        postId
      });
    }

    // Go to Filter Posts page
    gotoFilterPostPage() {
      this.navCtrl.push(FilterPostsPage);
    }

    // Goto Comments Page
    gotoCommentsPage(postId: any, posts: IPosts[], postItem: any) {
      let updateIndex = 'UpdateIndex';
      this.navCtrl.push(CommentsPage, {
        postId, posts, postItem, updateIndex
      });
    }
    
    // Delete the post
    deletePost(postId: any){
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
            handler: () => { this.phpService.deletePost(postId); }
          }
        ]
      })
      alert.present();
    }

    // Goto Comments Page
    gotoUsersPage(userId: any) {
      this.navCtrl.push(UserProfilePage, {
        userId
      });
    }

    // Display Image in Full Screen  
    displayImageFullScreen(imageToView) {
      this.profileData.displayImageInFullScreen(imageToView);
    }

    // Action sheet on each post to modify/delete your post
    modifyCardActionSheet(postId: any) {
      let actionSheet = this.actionSheetCtrl.create({
        //title: 'Modify your Post',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              console.log('Delete clicked: ' + postId);
              this.deletePost(postId);
            }
          },
          {
            text: 'Edit',
            handler: () => {
              console.log('Edit clicked: ' + postId);
              this.gotoEditPostPage(postId);
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

    // Add Wishlist
    addToWishlist(postId: any, postItem: any){
      this.phpService.addWishlist(this.user.uid, postId).subscribe(wishlistInfo => {
        var index = this.posts.indexOf(postItem);
        this.posts[index].addedToWishlist = true;
      });
    }

    // Remove Wishlist
    removeFromWishlist(postId: any, postItem: any){
      this.phpService.deleteWishlist(this.user.uid, postId).subscribe(wishlistInfo => {
        var index = this.posts.indexOf(postItem);
        this.posts[index].addedToWishlist = false;
      });
    }

    // Add Like
    addLike(postId: any, postItem: any){
      this.phpService.addLike(this.user.uid, postId).subscribe(likeInfo => {
        var index = this.posts.indexOf(postItem);
        this.posts[index].likesCount += 1;
        this.posts[index].isPostLiked = true;
      });
    }

    // Remove Like
    removeLike(postId: any, postItem: any){
      this.phpService.deleteLike(this.user.uid, postId).subscribe(likeInfo => {
        var index = this.posts.indexOf(postItem);
        this.posts[index].likesCount -= 1;
        this.posts[index].isPostLiked = false;
      });
    }
} 
