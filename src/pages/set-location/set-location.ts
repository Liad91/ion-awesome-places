import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { Loaction } from './../../models/location';

@IonicPage()
@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})
export class SetLocationPage {
  location: Loaction;
  marker: Loaction;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    this.location = this.navParams.get('location');
    if (this.navParams.get('isSet')) {
      this.marker = this.location;
    }
  }

  onSetMarket(event: any) {
    this.marker = new Loaction(event.coords.lat, event.coords.lng);
  }

  onConfirm() {
    this.viewCtrl.dismiss({ location: this.marker });
  }

  onCancel() {
    this.viewCtrl.dismiss();
  }
}
