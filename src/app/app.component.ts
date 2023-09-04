import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { timer } from 'rxjs/Observable/timer';


@Component({
  templateUrl: 'app.html',
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: string = 'TabsPage';

  showSplash = true;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      timer(2000).subscribe(() => this.showSplash = false);
      statusBar.backgroundColorByHexString('#f2f2f2');
    });

  }

}

