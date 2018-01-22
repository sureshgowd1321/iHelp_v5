import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app'; 

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private profileData: ProfileDataProvider,
              private afs: AngularFirestore,
              public phpService: PhpServiceProvider ) {
    
    this.user = firebase.auth().currentUser; 

  }

  // Add post method
  addPost(postDesc: string ) {
      this.phpService.addPost(postDesc);

      // this.afs.collection('posts').add({
      //             'post': postDesc,
      //             'postedDate': new Date().toISOString(),
      //             'postedById': this.user.uid,
      //             'count': 15
      // });
      
      this.navCtrl.pop();
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
