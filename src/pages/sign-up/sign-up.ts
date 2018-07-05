import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
//import { Http } from '@angular/http';

//import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
//import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AngularFireAuth } from 'angularfire2/auth';

import { TabsPage } from '../tabs/tabs';

// Interfaces
import { ICountries } from '../../providers/interfaces/interface';

// Providers
import { PhpServiceProvider } from '../../providers/php-service/php-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

//Pages
import { AddNewLocationPage } from '../add-new-location/add-new-location';

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

  countries: any = [];
  states: any = [];
  cities: any = [];

  constructor(public navCtrl: NavController, 
              public firebaseAuth: AngularFireAuth, 
              public formBuilder: FormBuilder, 
              public loadingCtrl: LoadingController, 
              public alertCtrl: AlertController, 
              private authService: AuthServiceProvider,
              public phpService: PhpServiceProvider ) {

      this.signupForm = formBuilder.group({
        name: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        //nickName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        gender: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        city: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        state: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        country: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      })
  }

  ionViewWillEnter()
  {  

    this.countries.length = 0;
    this.states.length = 0;
    this.cities.length = 0;

    this.phpService.getCountries()
      .subscribe(countries => {
      countries.forEach(countryObj=>{
        this.countries.push(countryObj.Country);
      });
    });

    if( this.signupForm.value.country != null ){
      this.phpService.getStates(this.signupForm.value.country.trim()).subscribe(states => {
        states.forEach(stateObj=>{
          this.states.push(stateObj.State);
        });
      });
    }

    if( this.signupForm.value.state != null ){
      this.phpService.getCities(this.signupForm.value.state.trim()).subscribe(cities => {
      cities.forEach(cityObj=>{
        this.cities.push(cityObj.City);
      });
    });
    }

    /*this.phpService.getAllCountries().subscribe(countriesInfo => {
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
    }); */
  }

  // Set State values based on selected country
  setStateValues() {

    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.cities.length = 0;

    this.phpService.getStates(this.signupForm.value.country.trim()).finally(() => this.loading.dismiss()).subscribe(states => {
      states.forEach(stateObj=>{
        this.states.push(stateObj.State);
      });
    });

    /*  this.allLocations.forEach(stateObj => {
        if(stateObj.country === this.signupForm.value.country.trim()){

          var index = this.selectedStates.findIndex(item => item === stateObj.state);

          if (index > -1){
          } else {  
            this.selectedStates.push(stateObj.state);   
          }          
        }
      });  */   
  }

  // Set Cities based in selected state
  setCityValues() {

    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.phpService.getCities(this.signupForm.value.state.trim()).finally(() => this.loading.dismiss()).subscribe(cities => {
      cities.forEach(cityObj=>{
        this.cities.push(cityObj.City);
      });
    });

    /*this.selectedCities.length = 0;

    this.allLocations.forEach(cityObj => {
      if(cityObj.state === this.signupForm.value.state.trim()){

        var index = this.selectedCities.findIndex(item => item === cityObj.city);

        if (index > -1){
        } else {  
          this.selectedCities.push(cityObj.city);   
        }          
      }
    });    */ 
  }

  // Signup using Email And password
  signup() {
    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
        let alert = this.alertCtrl.create({
          message: 'Please enter all the fields',
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        alert.present();

    } else {

        this.phpService.getLocationId(this.signupForm.value.city, this.signupForm.value.state, this.signupForm.value.country).subscribe(locationInfo => {
         
          this.authService.signupWithEmailAndPassword(this.signupForm.value.email, 
                                                      this.signupForm.value.password, 
                                                      this.signupForm.value.name,
                                                      locationInfo.ID,
                                                      this.signupForm.value.gender,
                                                    ).then(value => {
              this.loading.dismiss().then( () => {
                this.navCtrl.setRoot(TabsPage);
              });
          });

        this.loading = this.loadingCtrl.create();
        this.loading.present();

        this.signupForm.value.email = this.signupForm.value.password = '';
      });
    }
  }

  goToLoginPage(): void {
	  this.navCtrl.pop();
  }

  // Go to Add New Location Page to add new location
  gotoAddNewLocationPage() {
    this.navCtrl.push(AddNewLocationPage);
  }
}
