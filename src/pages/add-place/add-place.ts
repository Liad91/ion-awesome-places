import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { IonicPage, NavController, ModalController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Diagnostic } from '@ionic-native/diagnostic';

import { Loaction } from './../../models/location';
import { PlacesService } from './../../provisers/places';
import { Place } from './../../models/place';

@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  form: FormGroup;
  location: Loaction = {
    lat: 40.7624324,
    lng: -73.9759827
  };
  locationIsSet = false;
  displayAlerts = false;
  imgPath;

  constructor(private navCtrl: NavController,
              private modalCtrl: ModalController,
              private geolocation: Geolocation,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private camera: Camera,
              private placesService: PlacesService,
              private file: File,
              private diagnostic: Diagnostic,
              private alertCtrl: AlertController) {
    this.initializeForm();
  }

  private initializeForm() {
    this.form = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required)
    });
  }

  private locate() {
    const loading = this.loadingCtrl.create({
      content: 'Getting Location'
    });

    loading.present();
    this.geolocation.getCurrentPosition()
      .then(response => {
        this.location.lat = response.coords.latitude;
        this.location.lng = response.coords.longitude;
        this.locationIsSet = true;
        loading.dismiss();
      })
      .catch(error => {
        this.showToast("Couldn't get your location, please pick it manually!");
        loading.dismiss();
      });
  }

  private locationEnableAlert() {
    this.alertCtrl.create({
      title: 'Enable location',
      message: 'Loaction is off, do you want to enable it?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.diagnostic.switchToLocationSettings();
          }
        },
        {
          text: 'Abort',
          role: 'cancel'
        }
      ]
    }).present();
  }

  private showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 2500
    }).present();
  }

  formErrorHandler(control: string) {
    return this.form.controls[control].invalid && (this.form.controls[control].dirty || this.form.controls[control].touched);
  }

  onLocate() {
    this.diagnostic.isLocationEnabled()
      .then(enable => {
        if (enable) {
          this.locate();
          return;
        }
        this.locationEnableAlert();
      })
      .catch(() => {
        this.showToast("Couldn't get access to the device GPS");
      });
  }

  onOpenMap() {
    const modal = this.modalCtrl.create('SetLocationPage', { location: this.location, isSet: this.locationIsSet });

    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.location = data.location;
        this.locationIsSet = true;
      }
    });
  }

  onTakePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options)
      .then(imageData => {
        const name = imageData.replace(/^.*[\\\/]/, '');
        const path = imageData.replace(/[^\/]*$/, '');
        const newName = `${new Date().getUTCMilliseconds()}.jpg`;

        this.file.moveFile(path, name, this.file.dataDirectory, newName)
          .then(data => {
            this.imgPath = data.nativeURL;
            this.camera.cleanup();
          })
          .catch(error => {
            this.imgPath = '';
            this.showToast("Couldn't save the image. Please try again");
            this.camera.cleanup();
          });
      })
      .catch(error => {
        this.showToast("Couldn't get access to the device camera!");
      });
  }

  onSubmit() {
    if (!this.locationIsSet || !this.imgPath ) {
      this.displayAlerts = true
      return;
    }
    const place = new Place(this.form.get('title').value, this.form.get('description').value, this.location, this.imgPath);

    this.placesService.addPlace(place);
  }
}
