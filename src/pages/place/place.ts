import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, AlertController } from 'ionic-angular';

import { Place } from './../../models/place';
import { PlacesService } from './../../provisers/places';

@IonicPage()
@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {
  place: Place;
  index: number;

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController,
              private placesService: PlacesService,
              private alertCtrl: AlertController) {
    this.index = this.navParams.get('index');
    this.place = this.navParams.get('place');
  }

  onGoBack() {
    this.viewCtrl.dismiss();
  }

  onDelete() {
    this.alertCtrl.create({
      title: `Delete ${this.place.title}?`,
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
            this.placesService.deletePlace(this.index);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();
  }
}
