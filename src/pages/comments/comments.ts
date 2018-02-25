import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import * as firebase from 'firebase/app'; 

//Constants
import { constants } from '../../constants/constants';

// Providers
import { PhpServiceProvider } from '../../providers/php-service/php-service';
import { ProfileDataProvider } from '../../providers/profile-data/profile-data';

/**
 * Generated class for the CommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  user;
  postId: any;
  postObj: any;
  public comments: any = [];
  commentInput: string;
  images_path: string;

  private baseURI   : string  = "http://"+constants.IPAddress+"/ionic-php-mysql/";

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http,
              private profileData: ProfileDataProvider,
              public phpService: PhpServiceProvider,
              public alertCtrl: AlertController ) {
    
    this.user = firebase.auth().currentUser; 
    
    this.postId = this.navParams.get('postId');
    
    this.http.get(this.baseURI + 'getDataFromId.php?postId='+this.postId)
    .map(res => res.json())
    .subscribe(data =>
    { 
      console.log('Comments Page Data: '+ data);
        this.postObj = data;
    });
  }

  ionViewWillEnter()
  {   
    this.currentUserProfilePicture();
    this.loadAllComments(this.postId);
  }
  
  // Retrieve the JSON encoded data from the remote server
  // Using Angular's Http class and an Observable - then
  // assign this to the items array for rendering to the HTML template
  loadAllComments(postId)
  {
    this.comments.length = 0;

    this.http.get(this.baseURI + 'get-all-comments.php?postId='+postId )
    .map(res => res.json())
    .subscribe(data =>
    { 
      if( data.length === 0 ){
        //this.hasData = false;
        console.log('***Empty Comments');
      }else {
        console.log('***It has Comments');
        data.forEach(item=>{ 
            
          this.comments.push(
          {
            "Id"             : item.Id,
            "postId"         : item.postId,
            "comment"        : item.comment,
            "commentedBy"    : item.commentedBy,
            "commentedDate"  : item.commentedDate
          });
        });
      }
    });
  }

  // Add Comments
  postComment(commentDesc: string) {

    this.phpService.addComments(this.postId, commentDesc)
    .subscribe(res => {
      this.commentInput = '';
      this.loadAllComments(this.postId);
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
                });
          }
        }
      ]
    })
    alert.present();
  }

  // Pull to Refresh functionality
  dorefresh(refresher) {
    this.loadAllComments(this.postId);
    if(refresher != 0)
      refresher.complete();
  
  }

  // Display Image in Full Screen  
  displayImageFullScreen(imageToView) {
    this.profileData.displayImageInFullScreen(imageToView);
  }

  // Get Current User Profile Picture
  currentUserProfilePicture()
  {
    this.http.get(this.baseURI+'retrieve-images.php?userId='+this.user.uid)
    .map(res => res.json())
    .subscribe(data =>
    { 
      if( data.length === 0 ){
        //this.hasData = false;
      }else {
        data.forEach(item=>{             
            this.images_path = this.baseURI + item.images_path;
        });
      }
    });
  }

}
