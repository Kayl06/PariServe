import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { Camera } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { HomePageModule } from '../pages/home/home.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { ChurchPageModule } from '../pages/church/church.module';
import { NotificationPageModule } from '../pages/notification/notification.module';
import { NgCalendarModule } from 'ionic2-calendar';
import { IonicStepperModule } from 'ionic-stepper';
import { OneSignal } from '@ionic-native/onesignal';
import { Keyboard } from '@ionic-native/keyboard';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    TabsPageModule,
    HomePageModule,
    SettingsPageModule,
    ChurchPageModule,
    NotificationPageModule,
    NgCalendarModule,
    IonicStepperModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: false,
      autoFocusAssist: false
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    AndroidPermissions,
    StatusBar,
    SplashScreen,
    Keyboard,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthenticationProvider,
    OneSignal,
    Camera,
  ]
})
export class AppModule { }
