import { Component, } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { OneSignal } from '@ionic-native/onesignal';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  isUserLoggedIn: any = true;
  userInfo: any = {};
  id: any;
  eventData: any = {};
  numItems: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController,
    public pbookService: AuthenticationProvider, private oneSignal: OneSignal,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController
  ) {
    if (localStorage.getItem('userData') !== null) {
      let userData = JSON.parse(atob(localStorage.getItem('userData')));
      this.toasCtrls(`Logged in as ${userData.userData.email}`,3000,"bottom","welcometoast");
    }
    // this.pariServeNotif();
  }

  pariServeNotif() {

    this.oneSignal.startInit('2f10ac43-cdb4-4fbe-9f88-bce5f163ba89', '1057829669183');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe(() => {
      this.numItems += 1;
      alert(this.numItems);
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      console.log("Notification Opened");
      this.numItems += 1;
      alert(this.numItems);
    });

    this.oneSignal.endInit();
  }

  imageClicked(id, eType, img) {
    this.eventData = {
      id: id,
      eType: eType,
      img: img,
    }
    this.modalControler("EventsmodalPage", this.eventData);
  }
  weekly() {
    this.modalControler("MassSchedulesPage", {});
  }


  anotherPage(id, title) {
    var scheduleData = {
      id: id,
      title: title,
    }
    this.modalControler1("SchedulesPage", scheduleData);
  }

  modalControler(page, data: any) {
    let modal = this.modalCtrl.create(page, { eventData: data });
    modal.present();
  }

  modalControler1(page, data: any) {
    let modal = this.modalCtrl.create(page, { scheduleData: data });
    modal.present();
  }

  imgUrl = "https://www.gcccsbsit.xyz/_pabookAdmin/assets/images/";

  items = [
    {
      id: 1,
      img: this.imgUrl + '2.jpg',
      title: 'Daily Mass Schedules',
    },
  ]
  slider = [
    {
      img: this.imgUrl + 'c5.jpg',
      title: 'St. Columban Parish Church',
    },
  ];

  events = [
    {
      id: 1,
      img: this.imgUrl + 'wedding.jpg',
      title: 'St. Joseph Parish Church',
      type: 'Wedding'
    },
    {
      id: 2,
      img: this.imgUrl + 'Baptism_photo_1.jpg',
      title: 'St. Columban Parish Church',
      type: 'Baptismal'
    },
    {
      id: 3,
      img: this.imgUrl + 'burial.jpg',
      title: 'Sta. Rita Catholic Church',
      type: 'Burial Mass'
    },
  ];
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
}
