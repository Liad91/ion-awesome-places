import { Component, OnDestroy } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { Place } from './../../models/place';
import { PlacesService } from './../../provisers/places';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnDestroy {
  places: Place[] = [];
  subscription: Subscription;

  constructor(private modalCtrl: ModalController, private placesService: PlacesService) {
    this.subscription = this.placesService.getPlaces.subscribe(
      (places: Place[]) => this.places = places
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSelectPlace(place: Place, i: number) {
    this.modalCtrl.create('PlacePage', { place: place, index: i }).present();
  }
}
