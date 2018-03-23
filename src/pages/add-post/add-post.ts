import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';

//import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app'; 

//Constants
import { constants } from '../../constants/constants';

// Providers
import { PhpServiceProvider } from '../../providers/php-service/php-service';
import { ProfileDataProvider } from '../../providers/profile-data/profile-data';

/**
 * Generated class for the AddPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {

  user;
  private baseURI   : string  = "http://"+constants.IPAddress+"/ionic-php-mysql/";
  public userObj : any;
  public profilePic : string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private profileData: ProfileDataProvider,
              //private afs: AngularFirestore,
              public phpService: PhpServiceProvider,
              public http : Http ) {
    
    this.user = firebase.auth().currentUser; 
    
    this.phpService.getUserInfo(this.user.uid).subscribe(userinfo => {
      this.phpService.getUserProfilePic(this.user.uid).subscribe(userProfilePic => {

        this.userObj = userinfo;
        this.profilePic = this.baseURI + userProfilePic.images_path;

      })
    });
  }

  ionViewWillEnter()
  {  
  }
  
  // Add post method
  addPost(postDesc: string, selectedLocation: string) {

    this.phpService.addPost(postDesc, this.user.uid, selectedLocation, this.userObj.PostalCode).subscribe(res => { 
      this.navCtrl.pop();
    });
  }

  // Display Image in Full Screen  
	displayImageFullScreen(imageToView) {
		this.profileData.displayImageInFullScreen(imageToView);
  }
  
  // Cancel the post and back to Home Page
  cancelPost() {
    this.navCtrl.pop();
  }

}
