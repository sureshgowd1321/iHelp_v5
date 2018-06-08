/**
 * Generated class for the Home page.
 */
import { Component } from '@angular/core';
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
//import { IPosts } from '../../providers/interfaces/interface';
import { IAllPosts } from '../../providers/interfaces/interface';

// Order Pipe
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    // LoggedIn User Info variables
    user;
    // userFilter;
    // userCity;
    // userState;
    // userCountry;

    // List of posts to display
    //public posts: IPosts[] = [];
    public allPosts: IAllPosts[] = [];

    // Order By Variables
    order: string = 'id';
    reverse: boolean = true;

    // Pagination Variables
    page = 1;
    maximumPages = 40;

    // Variables to pass comments page
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
        
        /*this.phpService.getUserInfo(this.user.uid).subscribe(loggedInUserInfo => {
          this.userFilter = loggedInUserInfo.PostFilter,
          this.userCity = loggedInUserInfo.City,
          this.userState = loggedInUserInfo.State,
          this.userCountry = loggedInUserInfo.Country
        });*/
    }

    ionViewDidLoad(){  
      this.allPosts.length = 0;
      this.page = 1;
      this.loadPosts();
    }

    // Load all posts to display
    loadPosts(infiniteScroll?){

      this.phpService.getAllPosts(this.user.uid, this.page).subscribe(postdata => {
        postdata.forEach(postInfo => {

          // Check each post has Image or not
          let postImage;
          if(postInfo.images_path != null){
            postImage = constants.baseURI + postInfo.images_path;
          }

          this.allPosts.push(
            {
              "id"            : postInfo.ID,
              "post"          : postInfo.post,
              "createdDate"   : postInfo.CreatedDate,
              "name"          : postInfo.name,
              "profilePic"    : constants.baseURI + postInfo.ProfilePicURL,
              "createdById"   : postInfo.CreatedById,
              "postImages"    : postImage,
              "likesCount"    : postInfo.likesCount,
              "dislikesCount" : postInfo.dislikesCount,
              "commentsCount" : postInfo.commentsCount,
              "isPostLiked"   : postInfo.isLiked,
              "isPostDisliked": postInfo.isdisLiked,
              "isWished"      : postInfo.isWished
            }
          );
        });
      });

      /*this.phpService.getUserInfo(this.user.uid).subscribe(loggedInUserInfo => {
        this.phpService.getLocationInfo(loggedInUserInfo.PostalCode).subscribe(userLocationInfo => {
          this.phpService.getPosts(this.page, loggedInUserInfo.PostFilter, userLocationInfo.City, 
                                    userLocationInfo.State, userLocationInfo.Country, this.user.uid, loggedInUserInfo.CreatedDate).subscribe(postdata => {
            console.log('***Get Posts Response 1: ' + postdata);                          
            postdata.forEach(postInfo => {
              console.log('***Get Posts Response postInfo 2: ' + postInfo);  
              this.phpService.getUserInfo(postInfo.CreatedById).subscribe(userinfo => {
                this.phpService.getUserProfilePic(postInfo.CreatedById).subscribe(userProfilePic => {                        
                  this.phpService.getLocationInfo(userinfo.PostalCode).subscribe(userLocationInfo => {                         
                    this.phpService.getlikesCount(postInfo.ID).subscribe(likesCount => {
                      this.phpService.getdislikesCount(postInfo.ID).subscribe(dislikesCount => {
                        this.phpService.getlikeInfoPerUser(this.user.uid, postInfo.ID).subscribe(userLikeInfo => {
                          this.phpService.getDislikeInfoPerUser(this.user.uid, postInfo.ID).subscribe(userDislikeInfo => {
                            this.phpService.getWishlistFromUserId(this.user.uid).subscribe(wishlistInfo => {                                
                              this.phpService.getCountOfComments(postInfo.ID).subscribe(commentsCount => {
                                this.phpService.getPostImages(postInfo.ID).subscribe(postImages => {

                                  // Check post is liked by loggedin User or not
                                  let isPostLiked = false;
                                  if( userLikeInfo === 0 ){
                                  }else{
                                    isPostLiked = true;
                                  }

                                  // Check post is Disliked by loggedin User or not
                                  let isPostDisliked = false;
                                  if( userDislikeInfo === 0 ){
                                  }else{
                                    isPostDisliked = true;
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
                                    postImage = constants.baseURI + postImages.images_path;
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
                                      "profilePic"   : constants.baseURI + userProfilePic.images_path,
                                      "wishId"       : wishlistInfo.id,
                                      "addedToWishlist" : isPostInWishlist,
                                      "likesCount"      : likesCount,
                                      "dislikesCount"   : dislikesCount,
                                      "isPostLiked"     : isPostLiked,
                                      "isPostDisliked"  : isPostDisliked,
                                      "commentsCount"   : commentsCount,
                                      "postImages"      : postImage
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
              });
            });
            this.posts = this.orderPipe.transform(this.posts, 'id');
            console.log('***Get Posts this.posts 3: ' + this.posts);
            if (infiniteScroll) {
              infiniteScroll.complete();
            }
          });
        });
      });*/
    }

    loadMore(infiniteScroll){
      this.page++;

      setTimeout(() => {
        this.loadPosts(infiniteScroll);
        infiniteScroll.complete();
      }, 500);

      if (this.page === this.maximumPages) {
        infiniteScroll.enable(false);
      }
    }

    // Pull to Refresh functionality
    loadrefresh(refresher) {
      this.allPosts.length = 0;
      this.allPosts = [];
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
    gotoEditPostPage(postId: any, posts: IAllPosts[], postItem: any) {
      this.navCtrl.push(EditPostPage, {
        postId, posts, postItem
      });
    }

    // Go to Filter Posts page
    gotoFilterPostPage() {
      this.navCtrl.push(FilterPostsPage);
    }

    // Goto Comments Page
    gotoCommentsPage(postId: any, posts: IAllPosts[], postItem: any) {
      let updateIndex = 'UpdateIndex';
      this.navCtrl.push(CommentsPage, {
        postId, posts, postItem, updateIndex
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

              // Delete Comments of this post
              this.phpService.deleteCommentsOfPost(postId).subscribe(res => {
                // Delete Likes of this post
                this.phpService.deleteLikesOfPost(postId).subscribe(res => {
                  // Delete Dislikes of this post
                  this.phpService.deleteDislikesOfPost(postId).subscribe(res => {
                    // Delete Wishlist of this post
                    this.phpService.deleteWishlistOfPost(postId).subscribe(res => {
                      // Delete Image of post
                      this.phpService.deleteImage(postId).subscribe(res => {
                        // Delete Post
                        this.phpService.deletePost(postId).subscribe(res => {

                          var index = this.allPosts.indexOf(postItem);
                          if (index !== -1) {
                            this.allPosts.splice(index, 1);
                          }

                        });
                      });      
                    });     
                  });
                }); 
              });
            }
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
    modifyCardActionSheet(postId: any, posts: IAllPosts[], postItem: any) {
      let actionSheet = this.actionSheetCtrl.create({
        //title: 'Modify your Post',
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

    // Add Wishlist
    addToWishlist(postId: any, postItem: any){
      this.phpService.addWishlist(this.user.uid, postId).subscribe(wishlistInfo => {
        var index = this.allPosts.indexOf(postItem);
        //this.allPosts[index].addedToWishlist = true;
      });
    }

    // Remove Wishlist
    removeFromWishlist(postId: any, postItem: any){
      this.phpService.deleteWishlist(this.user.uid, postId).subscribe(wishlistInfo => {
        var index = this.allPosts.indexOf(postItem);
        //this.allPosts[index].addedToWishlist = false;
      });
    }

    // Add Like
    addLike(postId: any, postItem: any){
      this.phpService.addLike(this.user.uid, postId).subscribe(likeInfo => {
        var index = this.allPosts.indexOf(postItem);
        this.allPosts[index].likesCount += 1;
        //this.allPosts[index].isPostLiked = true;

        this.removeDislike(postId, postItem);
      });
    }

    // Remove Like
    removeLike(postId: any, postItem: any){
      this.phpService.deleteLike(this.user.uid, postId).subscribe(likeInfo => {
        var index = this.allPosts.indexOf(postItem);
        // if( this.allPosts[index].likesCount > 0 && this.allPosts[index].isPostLiked === true ){
        //   this.allPosts[index].likesCount -= 1;
        //   this.allPosts[index].isPostLiked = false;
        // }     
      });
    }

    // Add Dislike
    addDislike(postId: any, postItem: any){
      this.phpService.addDislike(this.user.uid, postId).subscribe(dislikeInfo => {
        var index = this.allPosts.indexOf(postItem);
        this.allPosts[index].dislikesCount += 1;
        //this.allPosts[index].isPostDisliked = true;

        this.removeLike(postId, postItem);
      });
    }

    // Remove Dislike
    removeDislike(postId: any, postItem: any){
      this.phpService.deleteDislike(this.user.uid, postId).subscribe(dislikeInfo => {
        var index = this.allPosts.indexOf(postItem);
        // if( this.allPosts[index].dislikesCount > 0 && this.allPosts[index].isPostDisliked === true){
        //   this.allPosts[index].dislikesCount -= 1;
        //   this.allPosts[index].isPostDisliked = false;
        // }
      });
    }
} 
