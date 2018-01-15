import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { LoadingController, AlertController } from 'ionic-angular';

import * as firebase from 'firebase/app'; 
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';

import { PhpServiceProvider } from '../../providers/php-service/php-service';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  nickName?: string;
  favoriteColor?: string;
  totalStars?: number;
  createdDate?: string;
  displayPostsFrom?: string;
  city?: string;
  country?: string;
  birthDate?: Date;
}

@Injectable()
export class AuthServiceProvider {

  user: Observable<User>;
  todaysDate: String = new Date().toISOString();
  loading: any;

  constructor(private afAuth: AngularFireAuth, 
              private afs: AngularFirestore, 
              public loadingCtrl: LoadingController, 
              public alertCtrl: AlertController,
              public phpService: PhpServiceProvider) {
        
    // Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState
    .switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
      } else {
        return Observable.of(null)
      }
    })
  }

}
