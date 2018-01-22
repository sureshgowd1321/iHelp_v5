import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import * as firebase from 'firebase/app'; 

import { Observable } from 'rxjs/Observable';

import { ImageViewerController } from 'ionic-img-viewer';

/*
  Generated class for the ProfileDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

interface User {
  displayName?: string;
}

@Injectable()
export class ProfileDataProvider {

  user;

  constructor(private authService: AuthServiceProvider, 
              public imageViewerCtrl: ImageViewerController, 
              private afs: AngularFirestore) {

    this.user = firebase.auth().currentUser; 
  }

  // Update Name in User Profile
  updateProfileName(name: string) {
      this.user.updateProfile({
        displayName: name
      }).then(function() {
        console.log('**Updated Name Successfully');
      }).catch(function(error) {
        // An error happened.
      });
  }

  // Update Name in User data
  updateName(name: string) {
    this.afs.collection("users").doc(this.user.uid).update({
        "displayName": name
      }).then(function() {
        console.log("DisplayName updated successfully!");
      });
  }

  // // Update Name in User data
  // updateUserEmail(email: string) {
  //   this.user.updateEmail(email).then(function() {
  //     console.log("User Email updated successfully!");
  //   }).catch(function(error) {
  //     // An error happened.
  //   });
  // }

  // // Update Name in User data
  // updateEmail(email: string) {
  //   this.afs.collection("users").doc(this.user.uid).update({
  //       "email": email
  //     }).then(function() {
  //       console.log("Email updated successfully!");
  //     });
  // }

  // Update Nickname in User data
  updateNickName(nickName: string) {
    this.afs.collection("users").doc(this.user.uid).update({
        "nickName": nickName
      }).then(function() {
        console.log("NickName updated successfully!");
      });
  }

  // Update Date of Birth in User data
  updateDateOfBirth(birthDate: string) {
    this.afs.collection("users").doc(this.user.uid).update({
        "birthDate": birthDate
      }).then(function() {
        console.log("Date of Birth updated successfully!");
      });
  }

  // Update City in User data
  updateCity(city: string) {
    this.afs.collection("users").doc(this.user.uid).update({
        "city": city
      }).then(function() {
        console.log("City updated successfully!");
      });
  }

  // Update City in User data
  updateCountry(country: string) {
    this.afs.collection("users").doc(this.user.uid).update({
        "country": country
      }).then(function() {
        console.log("Country updated successfully!");
      });
  }

  // Display Image in Full Screen
  displayImageInFullScreen(imageToView) {
      const viewer = this.imageViewerCtrl.create(imageToView)
      viewer.present();
  }
}
