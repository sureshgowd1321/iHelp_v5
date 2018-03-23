import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app'; 

//import { Injectable } from '@angular/core';
import { Http } from '@angular/http';  // , Headers, RequestOptions
import 'rxjs/add/operator/map';

//Constants
import { constants } from '../../constants/constants';

// Providers
import { PhpServiceProvider } from '../../providers/php-service/php-service';
import { ProfileDataProvider } from '../../providers/profile-data/profile-data';
//import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the EditPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-post',
  templateUrl: 'edit-post.html',
})
export class EditPostPage {

  postId: number;
  user;
  postDesc: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private profileData: ProfileDataProvider,
              //private afs: AngularFirestore,
              public phpService: PhpServiceProvider,
              public http: Http) {
    
    this.user = firebase.auth().currentUser;

    this.postId = this.navParams.get('postId');
    console.log('***Item Id: '+ this.postId);

   // this.postData = this.dataManipulateService.getPostFromId(this.postId);
   // console.log('**PostObj FROM Php:' + this.postData);console.log('**PostObj FROM Php:' + this.postData);

    this.http.get('http://'+constants.IPAddress+'/ionic-php-mysql/getDataFromId.php?postId='+this.postId)
    .map(res => res.json())
    .subscribe(data =>
    { 
        this.postDesc = data.post;
    });
  }

  // Edit post method
  updatePost(postDesc: string ) {
    this.phpService.updatePost(postDesc, this.postId);
    
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
