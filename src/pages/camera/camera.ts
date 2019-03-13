import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {Logger} from "../../app/logger";
import {AppConfig} from "../../app/app.config";
import {
  CameraPreview, CameraPreviewOptions,
  CameraPreviewPictureOptions
} from "@ionic-native/camera-preview";
import {Storage} from "@ionic/storage";
import {HttpClient} from "@angular/common/http";
import {Insomnia} from "@ionic-native/insomnia";
import {ScreenOrientation} from '@ionic-native/screen-orientation';


/**
 * This class represents the camera page.
 */
@IonicPage()
@Component({
  selector: "page-camera",
  templateUrl: "camera.html"
})
export class CameraPage {

  private uploadUrl: string;
  private updateInterval: number;

  private intervalTimer: any;

  /**
   * This variable gets used instead of calling "this.cameraPreview.stopCamera()" as only then it is gurantee that
   * the camera does not get stopped while it actually gets used to take a photo!
   */
  private stopCamera: boolean;

  private cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 50,
    width: window.screen.height,
    height: window.screen.width - 50,
    camera: this.cameraPreview.CAMERA_DIRECTION.BACK,
    toBack: false,
    tapPhoto: false,
    previewDrag: false
  };

  private pictureOpts: CameraPreviewPictureOptions = {
    width: 600,
    height: 600,
    quality: 30
  };


  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, private cameraPreview: CameraPreview, private storage: Storage, private insomnia: Insomnia, private screenOrientation: ScreenOrientation) {
    this.uploadUrl = this.navParams.get(AppConfig.STORAGE_UPLOAD_URL);
    this.updateInterval = this.navParams.get(AppConfig.STORAGE_KEY_UPDATE_INTERVAL);

    this.stopCamera = false;
  }

  /**
   * This method gets called as soon as the page got loaded.
   * The method performs the following steps:
   * 1. Keep device awake
   * 2. Start camera
   * 3. Once camera started take and send pictures in a specific interval
   */
  private ionViewDidLoad() {
    // set to landscape
    this.screenOrientation.lock("landscape").then(
      () => Logger.log("Locked to Landscape!"),
      (error) => Logger.error(error)
    );

    // let the app stay awake
    this.insomnia.keepAwake().then(
      () => Logger.log('Stays awake.'),
      (error) => Logger.error(error)
    );

    // start the camera preview and wait until it opened
    Logger.log("Trys to open up the camera preview.");
    this.cameraPreview.startCamera(this.cameraPreviewOpts).then((response) => {
      console.log("camera running!" + response);

      // wait just a little bit longer in order to give the camera enough time to start
      // this is needed because of a bug in the "cordova-plugin-camera-preview" plugin
      setTimeout(() => {
        // start taking pictures
        Logger.log("Start taking pictures.");

        // take a picture in a specified time interval
        this.intervalTimer = setInterval(() => {
          this.takeAndUploadPicture();
        }, this.updateInterval);

      }, 5000);
    }).catch(error => {
      console.log("Could not access camera: " + error);
    });
  }

  /**
   * This method gets called once the page gets closed.
   * The method performs the following steps:
   * 1. stop keeping the device awake
   * 2. cancel the camera data collecting interval
   * 3. stop the camera
   */
  private ionViewWillLeave() {
    // stop camera (!!while this does not look nice it works much more reliable!!)
    this.stopCamera = true;

    // allow the phone to sleep
    this.insomnia.allowSleepAgain().then(
      () => Logger.log('Allowed to sleep.'),
      (error) => Logger.error(error)
    );


    // allow user rotate device
    this.screenOrientation.unlock();
  }


  /**
   * This method takes a picture and uploads it to the HTTP interface configured.
   *
   * This method uses the camera-preview plugin to automatically take a picture with the device camera.
   * https://github.com/cordova-plugin-camera-preview/
   */
  private takeAndUploadPicture() {
    // ############# 1. Take the picture #############
    Logger.log("HALLO");
    Logger.log(this.updateInterval);
    this.cameraPreview.takePicture(this.pictureOpts).then((base64PictureData) => {
      Logger.log("Took picture successfully.");
      // save the  picture as base64 encoded string
      let image = "data:image/jpeg;base64," + base64PictureData;

      // ############# 2. Upload the picture #############
      this.http.post(this.uploadUrl, {
        "image": image
      }).subscribe(
        // Successful responses call the first callback.
        (data) => {
          Logger.log("Image uploaded successfully.")
        },
        // Errors will call this callback instead:
        (err) => {
          Logger.error('Something went wrong while uploading the image!' + JSON.stringify(err));
        }
      );

      // ############# 3. check if camera should be stopped #############
      if (this.stopCamera) {
        // end update interval
        clearInterval(this.intervalTimer);
        Logger.log("Ended Camera Recording!");

        // stop the camera preview
        this.cameraPreview.stopCamera().then(
          () => Logger.log('Stopped Camera.'),
          (error) => Logger.error(error)
        );
      }
    }, (error: any) => {
      Logger.error(error);
    });
  }
}
