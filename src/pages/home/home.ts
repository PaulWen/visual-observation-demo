import {Component} from '@angular/core';
import {NavController} from "ionic-angular";
import {Logger} from "../../app/logger";
import {AppConfig} from "../../app/app.config";
import {Storage} from "@ionic/storage";
import {CameraPage} from "../camera/camera";

/**
 * This class represents the start screen of the app.
 * Via this app page the IoT device can be configured with the correct credentials in order to connect it to the
 * IBM Watson IoT Platform. This class does also make sure that the configuration gets saved persistently to the app storage.
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private uploadUrl: string;
  private updateInterval: string;

  constructor(public navCtrl: NavController, private storage: Storage) {
    // read configuration from the storage or set it to undefined
    this.storage.get(AppConfig.STORAGE_UPLOAD_URL).then((value: string) => {
      if (value != null) {
        this.uploadUrl = value;
      } else {
        this.uploadUrl = "https://container-tracker-dashboard.mybluemix.net/image-upload";
      }
    });
    this.storage.get(AppConfig.STORAGE_KEY_UPDATE_INTERVAL).then((value: string) => {
      if (value != null) {
        this.updateInterval = value;
      } else {
        this.updateInterval = "1000";
      }
    });
  }

  /**
   * This method opens the camera page and provides the camera page with the configuration data provided by the user
   * via this page.
   */
  private openCameraPage() {
    // store the configuration data to the local app storage
    this.storage.set(AppConfig.STORAGE_UPLOAD_URL, this.uploadUrl);
    this.storage.set(AppConfig.STORAGE_KEY_UPDATE_INTERVAL, this.updateInterval);


    // build up payload to pass to the camera page
    let payload: any = {};
    payload[AppConfig.STORAGE_UPLOAD_URL] = this.uploadUrl;
    payload[AppConfig.STORAGE_KEY_UPDATE_INTERVAL] = this.updateInterval;

    // call the camera page to start the tracking
    this.navCtrl.push(CameraPage, payload);
  }

}
