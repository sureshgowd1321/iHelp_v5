import { Component } from '@angular/core';
import { IonicPage, App, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

//Constants
import { constants } from '../../constants/constants';

//Pages
import { LoginPage } from '../login/login';

// Native Plugins
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';

// Providers
import { PhpServiceProvider } from '../../providers/php-service/php-service';
import { ProfileDataProvider } from '../../providers/profile-data/profile-data';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface User {
  id: string;
  displayName: string;
  nickName: string;
  city: string;
  country: string;
  birthDate: Date;
  email: string;
}

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  userDoc: AngularFirestoreDocument<User>;
  userObj: Observable<User>;
  user;

  nickNameVar: string;
  cityVar: string;
  countryVar: string;
  birthDateVar: Date;
  emailVar: string;
  images_path: string;

  private baseURI   : string  = "http://"+constants.IPAddress+"/ionic-php-mysql/";

  constructor(public _app: App, 
              public http : Http,
              private afs: AngularFirestore, 
              private profileData: ProfileDataProvider, 
              private afAuth: AngularFireAuth, 
              public alertCtrl: AlertController,
              private transfer: FileTransfer,
              private camera: Camera,
              public phpService: PhpServiceProvider,
              public loadingCtrl: LoadingController ) {
    
    this.user = firebase.auth().currentUser; 
    console.log('**This User: '+ this.user.uid);

    this.userDoc = this.afs.doc('users/'+this.user.uid);
    this.userObj = this.userDoc.valueChanges();
    
    this.userObj.forEach(usr => {
      this.nickNameVar = usr.nickName;
      this.cityVar = usr.city;
      this.countryVar = usr.country;
      this.birthDateVar = usr.birthDate;
      this.emailVar = usr.email;
    });
  } 

  ionViewWillEnter()
  {  
    this.currentUserProfilePicture();
  }

  // loadImages() {
  //   this.phpService.loadImages(this.images_path);
  //   console.log('Load Images images_path: '+ this.images_path);
  // }

  // Get Current User Profile Picture
  currentUserProfilePicture()
  {
    this.phpService.getUserProfilePic(this.user.uid)
    .subscribe(userProfilePic => {
      this.images_path = this.baseURI + userProfilePic.images_path;
    });
  }

  // Update Full Name
  updateName(): void {
    let alert = this.alertCtrl.create({
      message: "Full Name",
      inputs: [
        {
          name: 'fullname',
          placeholder: 'Your Full Name',
          value: this.user.displayName
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateProfileName(data.fullname);
            this.profileData.updateName(data.fullname);
          }
        }
      ]
    });
    alert.present();
  }

  // Update Nick Name
  updateNickName(): void {
    let alert = this.alertCtrl.create({
      message: "Nick Name",
      inputs: [
        {
          name: 'nickName',
          placeholder: 'Your Nick Name',
          value: this.nickNameVar
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateNickName(data.nickName);
          }
        }
      ]
    });
    alert.present();
  }

  // Update Nick Name
  updateBirthDate(birthDate): void {
    this.profileData.updateDateOfBirth(birthDate);
  }

  // Update City
  updateCity(): void {
    let alert = this.alertCtrl.create({
      message: "City",
      inputs: [
        {
          name: 'city',
          placeholder: 'Your City',
          value: this.cityVar
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateCity(data.city);
          }
        }
      ]
    });
    alert.present();
  }

  // Update Nick Name
  updateCountry(): void {
    let alert = this.alertCtrl.create({
      message: "Country",
      inputs: [
        {
          name: 'country',
          placeholder: 'Your Country',
          value: this.countryVar
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateCountry(data.country);
          }
        }
      ]
    });
    alert.present();
  }

  // // Update Email
  // updateEmail(): void {
  //   let alert = this.alertCtrl.create({
  //     message: "Email",
  //     inputs: [
  //       {
  //         name: 'email',
  //         placeholder: 'Your Email',
  //         value: this.emailVar
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //       },
  //       {
  //         text: 'Save',
  //         handler: data => {
  //           this.profileData.updateUserEmail(data.email);
  //           this.profileData.updateEmail(data.email);
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  // Display Image in Full Screen  
	displayImageFullScreen(imageToView) {
		this.profileData.displayImageInFullScreen(imageToView);
	}

  // Logout
  logout() {
    this.afAuth
    .auth
    .signOut().then(value => {
      this._app.getRootNav().setRoot(LoginPage);
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
  
}
