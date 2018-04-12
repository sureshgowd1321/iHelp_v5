import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//Constants
import { constants } from '../../constants/constants';

// Providers
import { PhpServiceProvider } from '../../providers/php-service/php-service';
import { ProfileDataProvider } from '../../providers/profile-data/profile-data';

//Pages
import { UserPostsPage } from '../user-posts/user-posts';

/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  nameVar: string;
  cityVar: string;
  stateVar: string;
  countryVar: string;
  emailVar: string;
  userProfilePic: string;
  userUid: string;
  private baseURI   : string  = "http://"+constants.IPAddress+"/ionic-php-mysql/";

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public phpService: PhpServiceProvider,
              private profileData: ProfileDataProvider) {

    this.userUid = this.navParams.get('userId');
    console.log('**User Id Profile: '+ this.userUid);            
  }

  ionViewWillEnter()
  {  
    this.phpService.getUserInfo(this.userUid).subscribe(userinfo => {
      this.phpService.getLocationInfo(userinfo.PostalCode).subscribe(locationinfo => {
        this.phpService.getUserProfilePic(this.userUid).subscribe(userProfilePic => {
          
          this.userUid = userinfo.userUid;
          this.nameVar = userinfo.name;
          this.emailVar = userinfo.email;
          this.countryVar = locationinfo.Country;
          this.stateVar = locationinfo.State;
          this.cityVar = locationinfo.City;
          this.userProfilePic = this.baseURI + userProfilePic.images_path;

        });
      }); 
    }); 
  }

  // Display Image in Full Screen  
	displayImageFullScreen(imageToView) {
		this.profileData.displayImageInFullScreen(imageToView);
  }

  // Goto Signup Page
  goToUserPosts(userId): void {
    this.navCtrl.push(UserPostsPage, {
      userId
    });
  }

}
