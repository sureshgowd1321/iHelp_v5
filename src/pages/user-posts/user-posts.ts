import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';

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

  public posts: IPosts[] = [];
  userUId: string;
  private baseURI   : string  = "http://"+constants.IPAddress+"/ionic-php-mysql/";

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private profileData: ProfileDataProvider,
              public actionSheetCtrl: ActionSheetController,
              public phpService: PhpServiceProvider,
              public alertCtrl: AlertController) {

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
      
      //this.phpService.getUserInfo(this.userUId).subscribe(loggedInUserInfo => {

        //this.phpService.getLocationInfo(loggedInUserInfo.PostalCode).subscribe(userLocationInfo => {

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
                              "profilePic"   : this.baseURI + userProfilePic.images_path
                            }
                          );
                        });
                      });
                    });
                  }
              });
            }
          });
        //});
      //});
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
}
