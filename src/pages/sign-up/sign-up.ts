import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AngularFireAuth } from 'angularfire2/auth';

import { TabsPage } from '../tabs/tabs';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  public signupForm;
  loading: any;

  constructor(public navCtrl: NavController, 
              public firebaseAuth: AngularFireAuth, 
              private afs: AngularFirestore,
              public formBuilder: FormBuilder, 
              public loadingCtrl: LoadingController, 
              public alertCtrl: AlertController, 
              private authService: AuthServiceProvider) {

      this.signupForm = formBuilder.group({
        name: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        nickName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        city: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        country: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      })
  }

  // Signup using Email And password
  signup() {
    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
      this.authService.signupWithEmailAndPassword(this.signupForm.value.email, 
                                                  this.signupForm.value.password, 
                                                  this.signupForm.value.name,
                                                  this.signupForm.value.nickName, 
                                                  this.signupForm.value.city, 
                                                  this.signupForm.value.country
                                                ).then(value => {
          this.loading.dismiss().then( () => {
            this.navCtrl.setRoot(TabsPage);
          });
    });

    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.signupForm.value.email = this.signupForm.value.password = '';

    }
  }

  goToLoginPage(): void {
	  this.navCtrl.pop();
  }
}
