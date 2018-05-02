/**
 * Generated class for the AddPostPage page.
 */
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import * as firebase from 'firebase/app'; 

//Constants
import { constants } from '../../constants/constants';

// Providers
import { PhpServiceProvider } from '../../providers/php-service/php-service';
import { ProfileDataProvider } from '../../providers/profile-data/profile-data';

//Pages
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {

  user;
  private baseURI   : string  = "http://"+constants.IPAddress+"/ionic-php-mysql/";
  public userObj : any;
  public locationObj : any;
  public profilePic : string;
  public userCity : string;
  public userState : string;
  public userCountry : string;
  selectedLocation;

  constructor(public navCtrl: NavController, 
              private profileData: ProfileDataProvider,
              public phpService: PhpServiceProvider) {
    
    this.user = firebase.auth().currentUser; 

    this.phpService.getUserInfo(this.user.uid).subscribe(userinfo => {
      this.phpService.getUserProfilePic(this.user.uid).subscribe(userProfilePic => {
        this.phpService.getLocationInfo(userinfo.PostalCode).subscribe(locationInfo => {
          
          this.locationObj = locationInfo;
          this.userObj = userinfo;
          this.profilePic = this.baseURI + userProfilePic.images_path;

        });
      });
    });
  }

  ionViewWillEnter()
  {  
    this.selectedLocation = 'CT';
  }
  
  // Add post method
  addPost(postDesc: string) {

    this.phpService.addPost(postDesc, this.user.uid, this.selectedLocation, this.userObj.PostalCode,
                            this.locationObj.City, this.locationObj.State, this.locationObj.Country).subscribe(res => { 
      
      this.navCtrl.setRoot(TabsPage);

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
