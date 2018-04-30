/**
 * Generated class for the Wishlist page.
 */
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ActionSheetController } from 'ionic-angular';
import * as firebase from 'firebase/app'; 

// Interfaces
import { IPosts } from '../../providers/interfaces/interface';

//Constants
import { constants } from '../../constants/constants';

//Pages
import { CommentsPage } from '../comments/comments';
import { UserProfilePage } from '../user-profile/user-profile';

// Providers
import { PhpServiceProvider } from '../../providers/php-service/php-service';
import { ProfileDataProvider } from '../../providers/profile-data/profile-data';

// Order Pipe
import { OrderPipe } from 'ngx-order-pipe';

@IonicPage()
@Component({
  selector: 'page-my-wishlist',
  templateUrl: 'my-wishlist.html',
})
export class MyWishlistPage {

  // LoggedIn User
  user;

  // List of posts to display
  public posts: IPosts[] = [];

  // HTTP Base URI 
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

  constructor(public navCtrl: NavController,
              public phpService: PhpServiceProvider,
              public alertCtrl: AlertController,
              public actionSheetCtrl: ActionSheetController,
              private profileData: ProfileDataProvider,
              private orderPipe: OrderPipe) {

    this.user = firebase.auth().currentUser;
  }

  ionViewDidLoad()
    {  
      this.posts = [];
      this.page = 1;
      this.loadPosts();
    }

    // Retrieve the JSON encoded data from the remote server
    // Using Angular's Http class and an Observable - then
    // assign this to the items array for rendering to the HTML template
    loadPosts(infiniteScroll?){
      this.phpService.getMyWishlist(this.page, this.user.uid).subscribe(wishlist => {
  
        wishlist.forEach(wishObj => {
          
          this.phpService.getPostInfo(wishObj.PostId).subscribe(postInfo => {
            this.phpService.getUserInfo(postInfo.CreatedById).subscribe(userinfo => {
              this.phpService.getUserProfilePic(postInfo.CreatedById).subscribe(userProfilePic => {                        
                this.phpService.getLocationInfo(userinfo.PostalCode).subscribe(userLocationInfo => {                         
                  this.phpService.getlikesCount(postInfo.ID).subscribe(likesCount => {
                    this.phpService.getlikeInfoPerUser(this.user.uid, postInfo.ID).subscribe(userLikeInfo => {
                      this.phpService.getCountOfComments(postInfo.ID).subscribe(commentsCount => {
  
                        // Check post is liked by loggedin User or not
                        let isPostLiked = false;
                        if( userLikeInfo === 0 ){
                        }else{
                          isPostLiked = true;
                        }
  
                        this.posts.push(
                          {
                            "id"           : wishObj.PostId,
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
                            "wishId"       : wishObj.id,
                            "addedToWishlist" : false,
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

    // Goto Comments Page
    gotoCommentsPage(postId: any, posts: IPosts[], postItem: any) {
      let updateIndex = 'UpdateIndex';
      let removeFromList = 'RemoveSlice';

      this.navCtrl.push(CommentsPage, {
        postId, posts, postItem, updateIndex, removeFromList
      });
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

    // Remove Wishlist
    // removeFromWishlist(postId: any, postItem: any){
    //   this.phpService.deleteWishlist(this.user.uid, postId).subscribe(wishlistInfo => {
    //    // var index = this.posts.indexOf(postItem);
    //    // this.posts[index].addedToWishlist = false;
    //   });
    // }

    // Action sheet on each post to modify/delete your post
    modifyCardActionSheet(postId: any, postItem: any) {
      let actionSheet = this.actionSheetCtrl.create({
        //title: 'Modify your album',
        buttons: [
          {
            text: 'Remove from Wishlist',
            role: 'destructive',
            handler: () => {
              this.deleteFromWishlist(postId, postItem);
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

    // Remove Wishlist
    deleteFromWishlist(postId: any, postItem: any) {
      this.phpService.deleteWishlist(this.user.uid, postId).subscribe(wishlistInfo => {
        var index = this.posts.indexOf(postItem);
        if (index !== -1) {
          this.posts.splice(index, 1);
        }
      });
    }

}
