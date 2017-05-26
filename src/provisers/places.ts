import { Injectable } from '@angular/core';
import { ToastController, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { Subject } from 'rxjs/Subject';

import { Place } from './../models/place';

@Injectable()
export class PlacesService {
  private places: Place[] = [];
  getPlaces = new Subject<Place[]>();

  constructor(private storage: Storage,
              private toastCtrl: ToastController,
              private file: File,
              private appCtrl: App) {}

  private showToast() {
    this.toastCtrl.create({
      message: "Couldn't get access to the device storage",
      duration: 2500
    }).present();
  }

  private removeFile(place: Place) {
    const name = place.imgPath.replace(/^.*[\\\/]/, '');
    this.file.removeFile(this.file.dataDirectory, name)
      .then(() => {
        const currentView = this.appCtrl.getActiveNav().getActive();

        this.getPlaces.next(this.places.slice());
        this.appCtrl.getActiveNav().removeView(currentView);
      });
  }

  addPlace(place: Place) {
    this.places.push(place);
    this.storage.set('places', this.places)
      .then(() => {
        this.getPlaces.next(this.places.slice());
        this.appCtrl.getActiveNav().popToRoot();
      })
      .catch(error => {
        this.places.splice(this.places.indexOf(place), 1);
        this.showToast();
      });
  }

  fetchPlaces() {
    this.storage.get('places')
      .then((places: Place[]) => {
        this.places = places != null ? places : [];
        this.getPlaces.next(this.places);
      })
      .catch(error => {
        this.showToast();
      });
  }

  deletePlace(index: number) {
    const place = this.places[index];

    this.places.splice(index, 1);
    this.storage.set('places', this.places)
      .then(() => {
        this.removeFile(place);
      })
      .catch(error => {
        this.addPlace(place);
        this.showToast();
      });
  }
}
