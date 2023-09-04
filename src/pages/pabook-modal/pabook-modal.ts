import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

@IonicPage()
@Component({
  selector: 'page-pabook-modal',
  templateUrl: 'pabook-modal.html',
})

export class PabookModalPage {

  selectOptions = {
    title: 'Parish Events',
    cssClass: 'alert',
    subTitle: 'Select your Events',
    mode: 'md'
  };
  currentEvents = [{ year: 2018, month: 10, date: 25 }, { year: 2018, month: 10, date: 25 }];
  items: any = ['Wedding', 'Burial', 'Baptism', 'Blessings']
  hourValues: any = ["07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
  testRadioResult: any;
  testRadioOpen: boolean = true;
  bookingData: any = {
    title: '',
    startTime: '',
    endTime: '',
    cnumber: '',
    uname: '',
    email: '',
    id: '',
    vc: ''
  }
  vcode = '12345';
  evDate: any;
  bActive: boolean = false;
  vcActive: boolean = false;
  responseData: any;
  userInfoFromFb: any = {}
  fb: boolean = false;
  today: any;
  date: any;
  max: any;
  info: any = { mobile: '', code: '', date: '' };
  weddingDate: any;
  date1: any;
  time: any;
  reSched: any = {
    name: '',
    event: '',
    prevdate: '',
    req_for: '',
    reason: '',
    date_change_to: '',
    pbr_id: '',

  };
  isUserChange: boolean = false;
  changeSched: any;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController, private toastCtrl: ToastController,
    private pbookService: AuthenticationProvider
  ) {
    this.dateMin();
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.bookingData.endTime = preselectedDate;
    this.bookingData.startTime = preselectedDate;
    if (localStorage.getItem('userInfoFromFB')) {
      let b = JSON.parse(localStorage.getItem('userInfoFromFB'))
      this.bookingData.uname = b.userInfoFromFB.name
      this.fb = true;
    } else {
      var a = JSON.parse(atob(localStorage.getItem('userData')));
      this.bookingData.uname = a.userData.fname + " " + a.userData.lname
      this.bookingData.cnumber = a.userData.mobile;
      this.bookingData.email = a.userData.email;
      this.bookingData.id = a.userData.user_id;
    }

    if (this.navParams.get('info')) {
      this.isUserChange = true;
      let info = this.navParams.get('info');
      this.date1 = moment(this.navParams.get('selectedDay')).format();
      this.time = true;
      this.changeSched = true;
      info.map((data_info) => {
        this.reSched.name = data_info.pbr_cname;
        this.reSched.event = data_info.pbr_evName;
        this.reSched.prevdate = `${data_info.pbr_evDate} ${moment(data_info.pbr_startTime).format('LT')}`;
        this.reSched.pbr_id = data_info.pbr_id;
      })
    }

    if (this.navParams.get('resched') === "resched") {
      this.date1 = false;
      this.time = false;
      this.changeSched = false;
    }

  }

  back() {
    // this.navCtrl.push('TabsPage');
    this.navCtrl.pop();
  }

  ChangeSched(what: any) {
    switch (what) {
      case "changeSched":
        this.reSched.req_for = "Re-Schedule";
        this.reSched.date_change_to = `${moment(this.date1).format('YYYY-MM-DD')} ${this.time}`;
        if (!this.isEmpty(this.reSched)) {
          this.reSched.status = ''
          this.reSched.reject = ''
          this.pbookService.insert(this.reSched).subscribe(data => {
            this.toasCtrls("Your request to change schedule has been submitted successfully. Please wait for the confirmation", null, "middle", "success")
            this.navCtrl.setRoot('TabsPage');
          }, (err) => {
            console.log(err);
          })
        } else {
          this.toasCtrls("Please fill up all fields. Thank you", 3000, "bottom", "confirm");
        }
        break;

      default:
        if (this.reSched.reason !== '') {
          this.reSched.req_for = "Cancellation";
          this.reSched.status = ''
          this.reSched.reject = ''
          this.pbookService.insert(this.reSched).subscribe(data => {
            this.toasCtrls("Your request to cancel your schedule has been submitted successfully. Please wait for the confirmation", null, "middle", "success")
            setTimeout(() => {
              this.navCtrl.setRoot('TabsPage');
            }, 1500);
          }, (err) => {
            console.log(err);
          })
        } else {
          this.toasCtrls("Please write your reason in the given form. Thank you", 3000, "bottom", "confirm");
        }
        break;
    }

  }

  ionViewWillEnter() {
    this.bookingData.title = this.navParams.get('type');
    if (this.bookingData.title == 'Wedding') {
      this.weddingDate = this.sweddingDate();
    } else {
      this.weddingDate = this.sweddingDate();
    }
    // this.toasCtrls("Please insert the legitimate time", null, "top", "confirm");
  }

  book() {

    if (this.isEmpty(this.bookingData)) {
      this.toasCtrls("Required Field(s)!", 3000, "top", "error")
      console.log(this.bookingData);
    }
    else {
      var vcodeStore = sessionStorage.getItem('vCode');
      if (this.bookingData.vc !== vcodeStore) {
        this.toasCtrls("Incorrect Code!", 3000, "middle", "confirm");
      } else {
        this.bookingData.vc = vcodeStore;
        this.evDate = moment(this.bookingData.startTime).format();
        if (this.bookingData.title !== 'Wedding') {
          this.pbookService.bookEvent(this.bookingData).subscribe(data => {
            this.responseData = data;
            if (this.responseData.Status !== "Taken") {
              console.log(this.responseData);
              this.toasCtrls("Success! Please wait for confirmation", 3000, "middle", "confirm");
              setTimeout(() => {
                this.navCtrl.setRoot('TabsPage');
                this.empty();
                this.vcActive = false;
                this.bActive = false;
              }, 3000)
            } else {
              this.toasCtrls("This time is reserved for Mass. Please change the time of " + this.bookingData.title, 3000, "middle", "error");
            }
          }, (err) => {
            console.log(err)
          });
        } else {
          localStorage.setItem('bookingData', JSON.stringify(this.bookingData));
          this.navCtrl.push('MAppPage', { dom: this.bookingData.startTime });
        }

      }
    }
  }

  lastStep() {
    if (this.bookingData.email == '' || this.bookingData.title == '' || this.bookingData.cnumber == '') {
      this.toasCtrls("Required Field(s)!", 3000, "top", "error")
    } else {
      setTimeout(() => {

        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        sessionStorage.setItem('vCode', text);
        this.info.mobile = this.bookingData.cnumber
        this.info.code = text
        this.info.date = this.bookingData.startTime
        this.pbookService.sendVerification(this.info, "bookCode").subscribe(res => {
          let data: any = res;
          if (data.Status !== "Taken") {
            this.vcActive = true;
            this.bActive = true;
            this.toasCtrls("Check your mobile phone for Verification Code", 3000, "middle", "confirm");
          } else {
            this.toasCtrls("This time is reserved for Mass. Please change the time of " + this.bookingData.title, 5000, "middle", "error");
          }
        });
      }, 1000)
    }
  }

  isEmpty(obj) {

    for (var key in obj) {
      if (obj[key] == "")
        return true;
    }
    return false;
  }

  empty() {
    setTimeout(() => {
      this.bookingData = {
        event: '',
        date: '',
        sTime: '',
        eTime: '',
        cnumber: '',
        vc: ''
      }
    }, 1000);
  }

  toasCtrls(messages: any, duration: number, position: any, classy: any) {
    let toast = this.toastCtrl.create({
      cssClass: classy,
      message: messages,
      duration: duration,
      position: position,
      showCloseButton: true,
      closeButtonText: "Ok"
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  dateMin() {
    this.today = new Date();
    var year = this.today.getFullYear().toString();
    var mm = this.today.getMonth() + 1;
    var date = this.today.getDate() + 1;
    date = date.toString();
    if (date < 10) {
      date = '0' + date;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    this.date = year + '-' + mm + '-' + date;
  }

  sweddingDate() {
    moment.locale('en-ca');
    let minWedding = moment(this.navParams.get('selectedDay')).format('L');
    return minWedding;
  }



  itemSelected() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Parish Events');
    for (let i of this.items) {
      alert.addInput({
        type: 'radio',
        label: i,
        value: i,
        checked: false
      });
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Select',
      handler: items => {
        this.testRadioOpen = false;
        this.bookingData.event = items;
      }
    });
    alert.present();
  }
}
