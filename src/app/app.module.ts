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
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { ProfilePage } from '../pages/profile/profile';
import { AddPostPage } from '../pages/add-post/add-post';
import { EditPostPage } from '../pages/edit-post/edit-post';
import { CommentsPage } from '../pages/comments/comments';
import { FilterPostsPage } from '../pages/filter-posts/filter-posts';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { UserPostsPage } from '../pages/user-posts/user-posts';
import { MyWishlistPage } from '../pages/my-wishlist/my-wishlist';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { DisplayPostLikesPage } from '../pages/display-post-likes/display-post-likes';

// Native plugins
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';

// Providers
import { PhpServiceProvider } from '../providers/php-service/php-service';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { ProfileDataProvider } from '../providers/profile-data/profile-data';

import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    SignUpPage,
    ResetPasswordPage,
    ProfilePage,
    AddPostPage,
    EditPostPage,
    CommentsPage,
    FilterPostsPage,
    EditProfilePage,
    UserPostsPage,
    MyWishlistPage,
    UserProfilePage,
    DisplayPostLikesPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    IonicImageViewerModule,
    OrderModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    SignUpPage,
    ResetPasswordPage,
    ProfilePage,
    AddPostPage,
    EditPostPage,
    CommentsPage,
    FilterPostsPage,
    EditProfilePage,
    UserPostsPage,
    MyWishlistPage,
    UserProfilePage,
    DisplayPostLikesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileTransfer,
    Camera,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    PhpServiceProvider,
    AuthServiceProvider,
    ProfileDataProvider
  ]
})
export class AppModule { }
