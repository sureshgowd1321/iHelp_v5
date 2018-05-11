import { Component } from '@angular/core';

import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { MyWishlistPage } from '../my-wishlist/my-wishlist';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MyWishlistPage;
  tab3Root = ProfilePage;

  constructor() {

  }
}
