import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public _app: App, public navCtrl: NavController, private afAuth: AngularFireAuth) {

  }

}
