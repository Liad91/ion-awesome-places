import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PlacesService } from './../provisers/places';

@Component({
  template: '<ion-nav root="HomePage" #content swipeBackEnabled="false"></ion-nav>'
})
export class MyApp {

  constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private placesService: PlacesService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.placesService.fetchPlaces();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
