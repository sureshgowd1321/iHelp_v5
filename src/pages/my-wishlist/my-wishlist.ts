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
/**
 * Generated class for the MyWishlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-wishlist',
  templateUrl: 'my-wishlist.html',
})
export class MyWishlistPage {

  user;
  public posts: IPosts[] = [];
  private baseURI   : string  = "http://"+constants.IPAddress+"/ionic-php-mysql/";
  public isWishListEmpty: boolean;

  postId: any;
  postItem: any;

  constructor(public navCtrl: NavController,
              public phpService: PhpServiceProvider,
              public alertCtrl: AlertController,
              public actionSheetCtrl: ActionSheetController,
              private profileData: ProfileDataProvider) {

    this.user = firebase.auth().currentUser;
    this.isWishListEmpty = false;
  }

    ionViewWillEnter()
    {  
      this.posts = [];
      this.load(0, 'initialload');
    }

    // Retrieve the JSON encoded data from the remote server
    // Using Angular's Http class and an Observable - then
    // assign this to the items array for rendering to the HTML template
    load(minCount, loadType)
    {
      this.phpService.getMyWishlist(this.user.uid, minCount, loadType).subscribe(wishlist => {

        if( wishlist.length === 0 ){
         // this.isWishListEmpty = true;
        } else {
        //  this.isWishListEmpty = false;
          wishlist.forEach(wishObj=>{

            var index = this.checkUniqueId(wishObj.id);

            if (index > -1){
            } else {

              this.phpService.getPostInfo(wishObj.PostId).subscribe(postInfo => {
                this.phpService.getUserInfo(postInfo.CreatedById).subscribe(userinfo => {
                  this.phpService.getUserProfilePic(postInfo.CreatedById).subscribe(userProfilePic => {
                    this.phpService.getlikesCount(postInfo.ID).subscribe(likesCount => {
                      this.phpService.getLocationInfo(userinfo.PostalCode).subscribe(userLocationInfo => {
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
            } 
          });
        }
      });
    }

    checkUniqueId(wishid) {

      // check whether id exists
      var index = this.posts.findIndex(item => item.wishId === wishid);
      
      return index;
    }

    // Infinite scroll functionality
    doInfinite(): Promise<any> {

      return new Promise((resolve) => {
          setTimeout(() => {
            
            let latestId = this.posts[this.posts.length-1].wishId;

            this.load(latestId, 'scroll');

            resolve();
          }, 500);
        })
    }  

    // Pull to Refresh functionality
    dorefresh(refresher) {
      this.posts.length = 0;
      this.load(0, 'initialload');
      if(refresher != 0)
        refresher.complete();
    
    }

    // Goto Comments Page
    gotoCommentsPage(postId: any, posts: IPosts[], postItem: any) {
      let updateIndex = 'NoIndex';
      this.navCtrl.push(CommentsPage, {
        postId, posts, postItem, updateIndex
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
    removeFromWishlist(postId: any, postItem: any){
      this.phpService.deleteWishlist(this.user.uid, postId).subscribe(wishlistInfo => {
       // var index = this.posts.indexOf(postItem);
       // this.posts[index].addedToWishlist = false;
      });
    }

    // Action sheet on each post to modify/delete your post
    modifyCardActionSheet(postId: any) {
      let actionSheet = this.actionSheetCtrl.create({
        //title: 'Modify your album',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.deleteFromWishlist(postId);
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

    deleteFromWishlist(postId: any) {
      this.phpService.deleteWishlist(this.user.uid, postId).subscribe(wishlistInfo => {
        this.load(0, 'initialload');
      });
    }

}
