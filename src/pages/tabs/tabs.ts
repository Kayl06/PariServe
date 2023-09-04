import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { OneSignal } from '@ionic-native/onesignal';
import { AuthenticationProvider } from '../../providers/authentication/authentication';


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  numItems: any = 0;
  pagenumber;
  churchRoot = 'ChurchPage'
  homeRoot = 'HomePage'
  notifRoot = 'NotificationPage'
  settingsRoot = 'SettingsPage'

  selectedIndex: any = 0;


  constructor(public navCtrl: NavController, public navParams: NavParams, private oneSignal: OneSignal, private pbookService: AuthenticationProvider, private alertCtrl: AlertController, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
    // this.pariServeNotif();
    if (localStorage.getItem('notifCount') === null || localStorage.getItem('notifCount') === "0") {
      this.numItems = 0;
    } else {
      this.numItems = JSON.parse(localStorage.getItem('notifCount'));
    }
    let selectIndex = parseInt(sessionStorage.getItem('selectIndex'));
    if (selectIndex !== 0 || selectIndex !== null) {
      this.selectedIndex = selectIndex;
    } else {
      this.selectedIndex = 3;
    }
  }

  ionViewWillEnter() {
    this.numItems = JSON.parse(localStorage.getItem('notifCount'));
  }
  ionViewWillLeave() {
  }

  pariServeNotif() {

    this.oneSignal.startInit('2f10ac43-cdb4-4fbe-9f88-bce5f163ba89', '1057829669183');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((data) => {
      if (data.payload.additionalData.send_later !== true) {
        console.log("Notification Received");
      } else {
        this.pbookService.update('pabook_reservations', `status="Rejected", rej_reason="${data.payload.body}"`,
          `notif_id="${data.payload.notificationID}"`).subscribe((data) => {
            console.log(data);
          }, (err) => {
            console.log(err);
          });
        this.pbookService.update('events', `start=null, end=null, status="Rejected"`, `pbr_id="${data.payload.additionalData.pbr_id}"`)
          .subscribe(res => {
          }, err => {
            console.log(err);
          })
      }

    });
    this.oneSignal.handleNotificationOpened().subscribe(() => {
      if (localStorage.getItem('userData') === null) {
        this.showPrompt();
      } else {
        this.numItems = this.numItems + 1;
        localStorage.setItem('notifCount', this.numItems);
        this.loading("TabsPage", 2, 1000);
      }
    });
    this.oneSignal.endInit();
  }

  ionViewDidLoad() {
    // this.userCheck();
  }

  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Login',
      cssClass: 'alertControl',
      message: "Login your account to see the new notification(s)",
      inputs: [
        {
          name: 'email',
          placeholder: 'johndoe@gmail.com'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: '********'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Continue',
          handler: data => {
            console.log('Saved clicked');
            if (data.email === '' || data.password === '') {
              this.toasCtrls("All fields should not be empty!", 2500, "top", "default");
              return false;
            } else {
              this.pbookService.loginAccount(data).subscribe(data => {
                let responseData = data;
                if (responseData.Status !== "404 Not Found") {
                  localStorage.setItem('userData', btoa(JSON.stringify(responseData)));
                  this.numItems = this.numItems + 1;
                  localStorage.setItem('notifCount', this.numItems);
                  this.loading("TabsPage", 3, 3000);
                } else {
                  this.toasCtrls("Invalid Username or Password", 3000, "top", "default");
                  this.showPrompt();
                }
              }, (err) => {
                this.toasCtrls(`Check your internet connection`, 3000, "top", "default");
                return false;
              });
            }
          }
        }
      ]
    });
    prompt.setMode('ios');
    prompt.present();
  }
  toasCtrls(messages: any, duration: number, position: any, classy: any) {
    let toast = this.toastCtrl.create({
      cssClass: classy,
      message: messages,
      duration: duration,
      position: position,
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  loading(page: any, index: any, duration: any) {
    let loading = this.loadingCtrl.create({
      content: ``,
      cssClass: 'lodi',
      spinner: 'ios',
      duration: duration
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
      this.navCtrl.setRoot(page);
      sessionStorage.setItem('selectIndex', JSON.stringify(index));
    }, 2000);
  }

  // userCheck() {
  //   if (localStorage.getItem('userData') == null || localStorage.getItem('accessToken') == null) {
  //     setTimeout(() => {
  //       this.navCtrl.setRoot('LoginPage');
  //     }, 1000)
  //   }
  // }

}
