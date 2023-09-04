import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { OneSignal } from '@ionic-native/onesignal';
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  responseData: any;
  userData = {
    // function:'registerAccount',
    fname: '',
    lname: '',
    email: '',
    mobile: '',
    password: '',
    vcode: '',
    player_id: '',
  };

  registerform: boolean = true;
  res: boolean = false;
  invalidEmail = false;
  sendText = "Send Verification Code";
  create: boolean = false;
  submit: boolean = false;
  isenabled: boolean = true;
  password1: any;
  timer;
  color: any;
  info: any = { mobile: '', code: '' };
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public pbookService: AuthenticationProvider,
    private toastCtrl: ToastController,
    private oneSignal: OneSignal
  ) {
    this.subscribe();
  }

  onChange() {
    this.userData.mobile = this.userData.mobile.replace(/^0+/, '');
  }
  setCode() {
    if (this.userData.fname == '' || this.userData.lname == '' || this.userData.email == '' || this.userData.mobile == '' || this.userData.password == '') {
      this.toasCtrls("You must fill in all of the fields!", 3000, "top", "def");
    } else if (this.userData.mobile.length < 10) {
      this.toasCtrls("Mobile number is Incomplete", 3000, "top", "def")
    } else if (!this.validateEmail(this.userData.email)) {
      this.toasCtrls("Invalid Email!", 3000, "top", "def")
    }
    else if (this.userData.password !== this.password1) {
      this.toasCtrls("The password you entered do no match.", 3000, "top", "def")
    } else if (this.userData.password.length < 6) {
      this.res = true;
    }
    else {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

      for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      let mobile = '63' + this.userData.mobile;
      this.info.mobile = mobile
      this.info.code = text
      this.pbookService.sendVerification(this.info, "registerCode").subscribe(res => {
        var response = res;
        if (response[0] === "Mobile Number already taken") {
          this.toasCtrls(response[0], 3000, "middle", "error")

        } else {
          sessionStorage.setItem('vCode', text);
          this.startTimer();
          this.timer = 90;
          this.registerform = false;
          this.submit = true;
          this.isenabled = false;
          this.sendText = "Send Again?"
          this.color = "s1";
          // this.pbookService
          setTimeout(() => {
            sessionStorage.clear();
            this.isenabled = true;
          }, 90000);
        }
      });
    }
  }

  confirmCode() {
    var vcodeStore = sessionStorage.getItem('vCode');
    var fnal = vcodeStore;
    if (this.userData.vcode === vcodeStore) {
      this.toasCtrls("Verification Successful!", 1000, "middle", "def")
      setTimeout(() => {
        this.userData.vcode = fnal;
        this.registerform = true;
        this.submit = false;
        this.create = true;
      }, 3000);
    } else {
      this.toasCtrls("Verification Failed!!", 3000, "middle", "error")
    }
  }

  startTimer() {
    var interval = setInterval(function () {
      this.timer--
      if (this.timer < 0) {
        clearInterval(interval);
        this.timer = 0;
      }
    }.bind(this), 1000);

  }

  subscribe() {
    this.oneSignal.startInit('2f10ac43-cdb4-4fbe-9f88-bce5f163ba89', '1057829669183');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.endInit();
    this.oneSignal.getIds().then((id) => {
      //player_id of phone
      this.userData.player_id = id.userId;
    });
  }

  registerAccount() {

    if (this.isEmpty(this.userData)) {
      this.toasCtrls("Required Field(s)!", 3000, "top", "def")
    } else if (this.userData.password.length < 6) {
      this.res = true;
    }
    else if (this.userData.password !== this.password1) {
      this.toasCtrls("Your password are not same!", 3000, "top", "def")
    }
    else {
      // this.userData.mobile = '63' + this.userData.mobile;
      this.pbookService.registerAccount(this.userData).subscribe(data => {
        this.responseData = data;
        if (this.responseData.password) {
          // let info = JSON.stringify(this.responseData);
          // localStorage.setItem('userData', info);

          this.toasCtrls("Your account has been Registered successfully", 3000, "middle", "def")
          setTimeout(() => {
            this.navCtrl.setRoot('LoginPage');
          }, 3000)
        } else if (this.responseData[0] === "Email has already taken") {
          this.toasCtrls("Email already taken!", 3000, "middle", "error")
        }
      }, (err) => {
        console.log(err);
      });
    }
  }

  loginPage() {
    this.navCtrl.push('LoginPage');
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj[key] == "")
        return true;
    }
    return false;
  }

  validateEmail(email) {
    var reg = /^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    var res = reg.test(email);
    if (!res) {
      this.invalidEmail = true;
      return false;
    } else {
      this.invalidEmail = false;
      return true;
    }
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
}
