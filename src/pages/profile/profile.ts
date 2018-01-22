import { Component } from '@angular/core';
import { IonicPage, App, AlertController } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
//import { Observable } from 'rxjs/Rx';
//import 'rxjs/Rx';
//import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app'; 
//import {Operator} from 'rxjs/Operator';

import { LoginPage } from '../login/login';

import { ProfileDataProvider } from '../../providers/profile-data/profile-data';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

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

  constructor(public _app: App, 
              private authService: AuthServiceProvider, 
              private afs: AngularFirestore, 
              private profileData: ProfileDataProvider, 
              private afAuth: AngularFireAuth, 
              public alertCtrl: AlertController) {
    
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

  ngOnInit() {
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
    // this.authService.logout().then(value => {
    //   this._app.getRootNav().setRoot(LoginPage);
    // });
  }

}
