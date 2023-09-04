import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, LoadingController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';


@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  items = [];
  userInfo: any = {};
  notif: boolean = false;
  isNew: any = false;
  checkConnection: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public pbookService: AuthenticationProvider,
    private modalCtrl: ModalController, public loadingCtrl: LoadingController,
  ) {

    if (localStorage.getItem('userData') == null) {
      this.isNew = true;
      this.checkConnection = true;
    } else {
      this.otherUser();
      this.finalItemF();
    }
  }


  itemSelected(item) {
    this.loadingController(1800)
    setTimeout(() => {
      var x = localStorage.getItem('notifCount');
      let res = parseInt(x) - 1;
      if (res < 0) {
        localStorage.setItem('notifCount', JSON.stringify(0));
      } else {
        localStorage.setItem('notifCount', JSON.stringify(res));
      }
      let modal = this.modalCtrl.create('NotifDetailsPage', { details: item });
      modal.present();
    }, 1500);
  }

  loadingController(duration: any) {
    let loading = this.loadingCtrl.create({
      content: ``,
      cssClass: 'lodi',
      spinner: 'ios',
      duration: duration
    });

    loading.present();

  }
  finalItemF() {
    this.items = this.loadNotif();
  }

  ionViewWillEnter() {
    localStorage.removeItem('notifCount');

    if (this.isNew == false) {
      this.finalItemF();
    }
  }

  ionViewWillLeave() {
    localStorage.setItem('notifCount', JSON.stringify(0));
  }

  loadNotif() {
    var item = [];

    this.pbookService.join("pabook_reservations", "pbr_id", "tbl_notifications", "pbr_id").subscribe((data) => {
      let a = data;
      if (!Array.isArray(a) || !a.length) {
        this.notif = false;
      }
      else {
        a.map(result => {
          var id = this.userInfo.userData.user_id;
          console.log(id)
          if (result.user_id !== id) {
            console.log('walang kaparehas');
            this.checkConnection = true;
            this.notif = false;

          } else {
            this.notif = true;
            this.checkConnection = true;
            item.push({
              // reserve_at: reserve,
              pbr_id: result.pbr_id,
              evName: result.pbr_evName,
              status: result.notificationState,
              rej_reason: result.message,
              evDate: result.pbr_evDate,
              startTime: result.pbr_startTime,
              endTime: result.pbr_endTime,
              baptismal_img: result.baptismal_img,
              wedding_img1: result.wedding_img1,
              wedding_img2: result.wedding_img2,
            });

            item.sort();
            item.reverse();
          }
        });
      }
    }, (err) => {
      this.checkConnection = false;
    });
    return item;
    // this.pbookService.getMassSched("pabook_reservations", "hs_id", id).subscribe(data => {
    //   let a = data
    //   if (!Array.isArray(a) || !a.length) {
    //     return false;
    //   } else {
    //     this.notif = true;
    //     this.checkConnection = true;
    //     // let reserve = moment(a[0].reserve_at).calendar();
    //     for (var i = 0; i < a.length; i++) {
    //       item.push({
    //         // reserve_at: reserve,
    //         pbr_id: a[i].pbr_id,
    //         evName: a[i].pbr_evName,
    //         status: a[i].status,
    //         rej_reason: a[i].rej_reason,
    //         evDate: a[i].pbr_evDate,
    //         startTime: a[i].pbr_startTime,
    //         endTime: a[i].pbr_endTime,
    //         baptismal_img: a[i].baptismal_img,
    //         wedding_img1: a[i].wedding_img1,
    //         wedding_img2: a[i].wedding_img2,
    //       });
    //     }

    //     item.sort();
    //     item.reverse();
    //   }
    // }, (err) => {
    //   console.log("Check your Internet Conncetion", err);
    //   this.checkConnection = false;
    // });
  }

  otherUser() {
    var a = JSON.parse(atob(localStorage.getItem('userData')));
    this.userInfo = a;
  }

}
