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
/**
 * Generated class for the UserPostsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private profileData: ProfileDataProvider,
              public actionSheetCtrl: ActionSheetController,
              public phpService: PhpServiceProvider,
              public alertCtrl: AlertController) {

    this.loggedInUser = firebase.auth().currentUser.uid; 
    
    this.userUId = this.navParams.get('userId');
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
      this.phpService.getPostsFromUserId(this.userUId, minCount, loadType).subscribe(data => { 
        if( data.length === 0 ){
        // this.hasData = false;
        }else {
          data.forEach(item=>{ 
              var index = this.checkUniqueId(item.ID);
              
              if (index > -1){
              } else {
                
                this.phpService.getUserInfo(item.CreatedById).subscribe(userinfo => {

                  this.phpService.getUserProfilePic(item.CreatedById).subscribe(userProfilePic => {
                    
                    this.phpService.getLocationInfo(userinfo.PostalCode).subscribe(userLocationInfo => {
                      
                      this.phpService.getlikesCount(item.ID).subscribe(likesCount => {
                        
                        this.phpService.getlikeInfoPerUser(this.userUId, item.ID).subscribe(userLikeInfo => {

                          this.phpService.getWishlistFromUserId(this.userUId).subscribe(wishlistInfo => {   

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
                    
                                if(wishObj.PostId === item.ID){
                                  isPostInWishlist = true;
                                }    
                              });
                            }

                            this.posts.push(
                              {
                                "id"           : item.ID,
                                "post"         : item.post,
                                "createdDate"  : item.CreatedDate,
                                "createdById"  : item.CreatedById,
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
                                "isPostLiked"  : isPostLiked
                              }
                            );
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

    checkUniqueId(id) {

      // check whether id exists
      var index = this.posts.findIndex(item => item.id === id);
      
      return index;
    }

    // Infinite scroll functionality
    doInfinite(): Promise<any> {

      return new Promise((resolve) => {
          setTimeout(() => {
            
            let latestId = this.posts[this.posts.length-1].id;

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
    gotoCommentsPage(postId: any) {
      this.navCtrl.push(CommentsPage, {
        postId
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
    modifyCardActionSheet(postId: any) {
      let actionSheet = this.actionSheetCtrl.create({
        //title: 'Modify your album',
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

    // Go to Edit Post Page to update the post
    gotoEditPostPage(postId: any) {
      this.navCtrl.push(EditPostPage, {
        postId
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

    // Add Like
    addLike(postId: any, postItem: any){
      this.phpService.addLike(this.userUId, postId).subscribe(likeInfo => {
        var index = this.posts.indexOf(postItem);
        this.posts[index].likesCount += 1;
        this.posts[index].isPostLiked = true;
      });
    }

    // Remove Like
    removeLike(postId: any, postItem: any){
      this.phpService.deleteLike(this.userUId, postId).subscribe(likeInfo => {
        var index = this.posts.indexOf(postItem);
        this.posts[index].likesCount -= 1;
        this.posts[index].isPostLiked = false;
      });
    }
}
