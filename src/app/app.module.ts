import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {CameraPage} from "../pages/camera/camera";
import {CameraPreview} from "@ionic-native/camera-preview";
import {IonicStorageModule} from "@ionic/storage";
import {HttpClientModule} from "@angular/common/http";
import {Insomnia} from "@ionic-native/insomnia";
import {ScreenOrientation} from '@ionic-native/screen-orientation';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CameraPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CameraPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CameraPreview,
    Insomnia,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
