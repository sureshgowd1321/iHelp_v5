// Angular directives
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

// Angular Fire Modules
import * as firebase from 'firebase/app'; 
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

// Environment
import { environment } from '../environments/environment';

// Pages
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { ProfilePage } from '../pages/profile/profile';
import { AddPostPage } from '../pages/add-post/add-post';
import { EditPostPage } from '../pages/edit-post/edit-post';
import { CommentsPage } from '../pages/comments/comments';

// Native plugins
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Providers
import { PhpServiceProvider } from '../providers/php-service/php-service';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { ProfileDataProvider } from '../providers/profile-data/profile-data';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    SignUpPage,
    ResetPasswordPage,
    ProfilePage,
    AddPostPage,
    EditPostPage,
    CommentsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    SignUpPage,
    ResetPasswordPage,
    ProfilePage,
    AddPostPage,
    EditPostPage,
    CommentsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PhpServiceProvider,
    AuthServiceProvider,
    ProfileDataProvider
  ]
})
export class AppModule {}
