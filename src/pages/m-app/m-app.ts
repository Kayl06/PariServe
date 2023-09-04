import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { IonicStepperComponent } from "ionic-stepper";
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-m-app',
  templateUrl: 'm-app.html',
  // template: ``
})
export class MAppPage {
  reception: any = ['Church', 'Chapel']
  cfees: any = ['Fees', 'Deposit', 'Balance']
  hourValues: any = ["07", "08", "09", "10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08"];
  date: any;
  today: any;
  mode: string = 'horizontal';
  selectedIndex = 0;
  _JSONString: string = '';
  disabled: boolean = false;
  applicationData: any = {
    //Groom
    user_id: '',
    user_cred: '',
    name: '',
    age: '',
    dob: '',
    pob: '',
    pobap: '',
    natio: '',
    status: '',
    occu: '',
    presAdd: '',
    sWhen: '',
    telNo: '',
    faname: '',
    fana: '',
    maname: '',
    mana: '',
    parentsAdd: '',
    venue: '',
    dom: '',
    //Bride
    name1: '',
    age1: '',
    dob1: '',
    pob1: '',
    pobap1: '',
    natio1: '',
    status1: '',
    occu1: '',
    presAdd1: '',
    sWhen1: '',
    telNo1: '',
    faname1: '',
    fana1: '',
    maname1: '',
    mana1: '',
    parentsAdd1: '',
    tom: '',
    fees: '',
    amountFees: '',
    //Sponsors
    ninong1: '',
    address1: '',
    ninong2: '',
    address2: '',
    ninong3: '',
    address3: '',
    ninong4: '',
    address4: '',
    ninang1: '',
    Naddress1: '',
    ninang2: '',
    Naddress2: '',
    ninang3: '',
    Naddress3: '',
    ninang4: '',
    Naddress4: '',
  }

  responseData: any;
  dom: any;
  tom: any;
  overview: any = []

  @ViewChild('stepper') stepper: IonicStepperComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams, public pbookService: AuthenticationProvider,
    public alertCtrl: AlertController, private toastCtrl: ToastController
  ) {
    this.dateMin();
    this.overview.push(this.applicationData);
    let a = JSON.parse(atob(localStorage.getItem('userData')));
    let full_name = a.userData.fname + " " + a.userData.lname;
    let user_id = a.userData.user_id;
    this.applicationData.user_cred = full_name;
    this.applicationData.user_id = user_id;
    this.applicationData.dom = this.navParams.get('dom');
    this.applicationData.tom = this.navParams.get('dom');
    this.dom = moment(this.navParams.get('dom')).format('LL');
    this.tom = moment(this.navParams.get('dom')).format('LT');
  }

  getAge(dateString, forAge) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    // return age;
    if (forAge === "age") {
      this.applicationData.age = age;
    } else {
      this.applicationData.age1 = age;
    }
  }

  selectChange(e) {
    console.log(e);
    if (e == 3) {
      this.disabledTrue();
      this.overview;
      localStorage.setItem('marriageApp', JSON.stringify(this.applicationData));
    }
  }

  mApp() {
    this.presentConfirm();
  }

  onReset() {
    this._JSONString = '';
    this.stepper.setStep(0)
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

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Reminder',
      cssClass: 'alertControl',
      message: 'Make sure you filled-up those important information.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: () => {
            this.applicationData.dom = moment(this.navParams.get('dom')).format('LL');
            this.applicationData.tom = moment(this.navParams.get('dom')).format('LT');
            this.pbookService.insertApplication(this.applicationData).subscribe(data => {
              this.responseData = data;
              console.log(this.responseData);
              this.sendBookingData();
              this.toasCtrls("Submitted! Please wait for confirm notification. For more information do visit us at #Sample Address", null, "middle", "confirm");
              this.navCtrl.setRoot('TabsPage');
            })
            return this.responseData;
          }
        }
      ]
    });
    alert.setMode('ios');
    alert.present();
  }

  sendBookingData() {
    let bookingData = JSON.parse(localStorage.getItem('bookingData'));
    console.log(bookingData);
    this.pbookService.bookEvent(bookingData).subscribe(data => {

    });
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

  isEmpty(obj) {

    for (var key in obj) {
      if (obj[key] == "")
        return true;
    }
    return false;
  }
  disabledTrue() {
    if (this.isEmpty(this.applicationData)) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }

}
