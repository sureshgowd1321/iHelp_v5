import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

import * as firebase from 'firebase/app';

//Constants
import { constants } from '../../constants/constants';

// Providers
import { PhpServiceProvider } from '../../providers/php-service/php-service';
import { ProfileDataProvider } from '../../providers/profile-data/profile-data';

// Interfaces
import { IUser } from '../../providers/interfaces/interface';
import { ICountries } from '../../providers/interfaces/interface';

// Native Plugins
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  user;
  //public userObj : IUser;
  //public locationObj: any;

  allLocations: ICountries[] = [];
  countries: any = [];
  selectedStates: any = [];
  selectedCities: any = [];
 // public userInt: IUser;

  public userCountry: string;
  public userState: string;
  public userCity: string;
  public userProfilePic: string;

  public selectedCountry: string;
  public selectedState: string;
  public selectedCity: string;
  public updatedName: string;

  private baseURI   : string  = "http://"+constants.IPAddress+"/ionic-php-mysql/";

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http : Http,
              public phpService: PhpServiceProvider,
              private transfer: FileTransfer,
              private camera: Camera,
              public loadingCtrl: LoadingController,
              private profileData: ProfileDataProvider) {

    this.user = firebase.auth().currentUser; 
    
    
  }

  ionViewWillEnter()
  {  

    this.phpService.getUserInfo(this.user.uid).subscribe(userinfo => {
      this.phpService.getLocationInfo(userinfo.PostalCode).subscribe(locationinfo => {
        this.phpService.getUserProfilePic(this.user.uid).subscribe(userProfilePic => {

          this.updatedName = userinfo.name;
          this.userCountry = locationinfo.Country;
          this.userState = locationinfo.State;
          this.userCity = locationinfo.City;
          this.userProfilePic = this.baseURI + userProfilePic.images_path;

          this.selectedCountry = locationinfo.Country;
          this.selectedState = locationinfo.State;
          this.selectedCity = locationinfo.City;

        });
      }); 
    });
   
    this.phpService.getAllCountries().subscribe(countriesInfo => {
      countriesInfo.forEach(countryObj=>{

        this.allLocations.push({
              country   : countryObj.Country,
              state     : countryObj.State,
              city      : countryObj.City
        });  

        var index = this.countries.findIndex(item => item === countryObj.Country);
                
        if (index > -1){
        } else {

          this.countries.push(countryObj.Country);   
        }
      });
    }); 
  }

  // Set State values based on selected country
  setStateValues() {
      this.selectedStates.length = 0;
      this.selectedCities.length = 0;
      this.selectedState = '';
      this.selectedCity = '';

      this.allLocations.forEach(stateObj => {
        if(stateObj.country === this.selectedCountry.trim()){

          var index = this.selectedStates.findIndex(item => item === stateObj.state);

          if (index > -1){
          } else {  
            this.selectedStates.push(stateObj.state);   
          }          
        }
      });     
  }

  // Set Cities based in selected state
  setCityValues() {
    this.selectedCities.length = 0;
    this.selectedCity = '';

    this.allLocations.forEach(cityObj => {
      if(cityObj.state === this.selectedState.trim()){

        var index = this.selectedCities.findIndex(item => item === cityObj.city);

        if (index > -1){
        } else {  
          this.selectedCities.push(cityObj.city);   
        }          
      }
    });     
  }

  goToProfilePage(): void {
    this.phpService.getLocationId(this.selectedCity, this.selectedState, this.selectedCountry).subscribe(locationInfo => {
        this.phpService.updateUserData(this.user.uid, this.updatedName, locationInfo.ID).subscribe(locationInfo => {
          this.navCtrl.pop();
        });
    });
	  
  }

  // Upload Picture From Camera
  public base64Image: string;

  takePicture(){

    this.camera.getPicture({
        sourceType: this.camera.PictureSourceType.CAMERA,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000,
        quality: 50
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;

        let loader = this.loadingCtrl.create({
          content: "Uploading..."
        });
        loader.present();

        const fileTransfer: FileTransferObject = this.transfer.create();

        let options_file: FileUploadOptions = {
          fileKey: 'file',
          fileName: 'name.jpg',
          params : {'userUid': this.user.uid},
          headers: {}
        }

        fileTransfer.upload(this.base64Image, this.baseURI+'saveimage.php', options_file)
        .then((data) => {
          this.currentUserProfilePicture();
          loader.dismiss();
        }, (err) => {
          loader.dismiss();
        });
    }, (err) => {
        console.log(err);
    });
  }

  // Method to select Profile Picture from Gallery
	selectFromGallery() {

    let options = {
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
			destinationType: this.camera.DestinationType.DATA_URL,
			targetWidth: 1000,
			targetHeight: 1000
    };

		this.camera.getPicture(options).then((imageData) => {
        
        this.base64Image = "data:image/jpeg;base64," + imageData;

        let loader = this.loadingCtrl.create({
          content: "Uploading..."
        });
        loader.present();

        const fileTransfer: FileTransferObject = this.transfer.create();
        
        let options_file: FileUploadOptions = {
          fileKey: 'file',
          fileName: 'name.jpg',
          params : {'userUid': this.user.uid},
          headers: {}
        }

        console.log('Entered Gallery: '+ imageData);
        fileTransfer.upload(this.base64Image, this.baseURI+'saveimage.php', options_file)
          .then((data) => {
          // success
          this.currentUserProfilePicture();
          loader.dismiss();
          console.log("success Camera: "+data.response);
        }, (err) => {
          // error
          loader.dismiss();
          alert("error"+JSON.stringify(err));
        });
		}, (error) => {
			console.log("ERROR -> " + JSON.stringify(error));
		});
  }

  //Get Current User Profile Picture
  currentUserProfilePicture()
  {
    this.phpService.getUserProfilePic(this.user.uid)
    .subscribe(userProfilePic => {
      this.userProfilePic = this.baseURI + userProfilePic.images_path;
    });
  }

  // Display Image in Full Screen  
	displayImageFullScreen(imageToView) {
		this.profileData.displayImageInFullScreen(imageToView);
  }

}
