import { Component } from '@angular/core'; // , OnInit
import { NavController, AlertController, ActionSheetController } from 'ionic-angular';
import { Http } from '@angular/http';

//import { AngularFireAuth } from 'angularfire2/auth';
//import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
//import { Observable } from 'rxjs/Observable';
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
import { IUser } from '../../providers/interfaces/interface';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    user;
    public posts: IPosts[] = [];
    private baseURI   : string  = "http://"+constants.IPAddress+"/ionic-php-mysql/";

    constructor(public http : Http, 
                public navCtrl: NavController,
                private profileData: ProfileDataProvider,
                public actionSheetCtrl: ActionSheetController,
                public phpService: PhpServiceProvider,
                public alertCtrl: AlertController ) {
                
        this.user = firebase.auth().currentUser;  
        
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
      
      this.phpService.getUserInfo(this.user.uid).subscribe(loggedInUserInfo => {

        this.phpService.getLocationInfo(loggedInUserInfo.PostalCode).subscribe(userLocationInfo => {

          this.phpService.getAllPosts(minCount, loadType, loggedInUserInfo.PostalCode, loggedInUserInfo.PostFilter, 
                                      userLocationInfo.City, userLocationInfo.State, userLocationInfo.Country )     
          .subscribe(data =>
          { 
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
                          
                          this.phpService.getWishlistFromUserId(this.user.uid).subscribe(wishlistInfo => {   

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
                                  "addedToWishlist" : isPostInWishlist
                                }
                              );
                          });
                        });
                      });
                    });
                  }
              });
            }
          });
        });
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
    gotoCommentsPage(postId: any) {
      this.navCtrl.push(CommentsPage, {
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
} 
