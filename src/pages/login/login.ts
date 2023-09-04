import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, App, ToastController, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
// import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
//ionic cordova prepare android
//ionic cordova run android --livereload

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',

})
export class LoginPage {
  user: any = {}
  responseData: any;
  userData = {
    email: '',
    password: ''
  }
  click: boolean;
  container = "container";
  page: String = "TabsPage";
  type = "password";
  cardLogin: boolean = true;
  icon_eye = "ios-eye-off";
  passwordLength: boolean = false;
  isValidCode: boolean = false;
  verifdata = {
    verifCode: '',
    new_password: '',
    confirm_password: '',
    email: ''
  }

  headerMessage = "Enter Verification Code";
  headerSubtitle = "Please check your email address";
  buttonText = "Next";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    // private fb: Facebook,
    public http: HttpClient, public alertCtrl: AlertController,
    private pbookService: AuthenticationProvider,
    public loadingCtrl: LoadingController,
    public app: App,
    public platform: Platform,
    private toastCtrl: ToastController) {
  }

  // loginFb() {
  //   this.fb.login(['public_profile', 'email'])
  //     .then((res: FacebookLoginResponse) => {
  //       if (res.status === 'connected') {
  //         this.user.img = 'http://graph.facebook.com/' + res.authResponse.userID + '/picture?type=square';
  //         let token = JSON.stringify(res.authResponse.accessToken);
  //         localStorage.setItem('accessToken', token);
  //         // this.getData(res.authResponse.accessToken)
  //         this.loading(this.page);
  //       } else {
  //         console.log('Login error par!')
  //       }
  //     })
  //     .catch(e => console.log('Error logging into Facebook', e));
  // }

  viewPass() {
    if (this.icon_eye === "ios-eye-off") {
      this.icon_eye = "ios-eye";
      this.type = "text";
    } else {
      this.icon_eye = "ios-eye-off";
      this.type = "password";
    }
  }

  checkKeyboard() {

  }

  login() {
    if (this.isEmpty(this.userData)) {
      // this.alert("Warning", "Required Field(s)", "Ok")
      this.toasCtrls("Ooopss! Required Field(s)", 3000, "bottom", "default");
    } else {
      this.pbookService.loginAccount(this.userData).subscribe(data => {
        this.responseData = data;
        if (this.responseData.userData) {
          localStorage.setItem('userData', btoa(JSON.stringify(this.responseData)));
          this.loading(this.page);
        } else {
          this.toasCtrls("Invalid Username or Password", 3000, "bottom", "default");
        }
      }, (err) => {
        this.toasCtrls(`Check your internet connection`, 3000, "bottom", "default");
      });
    }
  }

  changePass() {
    if (this.verifdata.verifCode === '') {
      this.toasCtrls("Enter the verification code", 3000, "bottom", "default");
    } else {
      //backend code here before showing the change password form
      if (localStorage.getItem('verCode') !== this.verifdata.verifCode) {
        this.toasCtrls("Invalid Verification Code", 3000, "bottom", "default");
      } else if (this.verifdata.new_password !== this.verifdata.confirm_password) {
        this.toasCtrls("The password you entered do no match.", 3000, "bottom", "default");
      } else {
        let loading = this.loadingCtrl.create({
          spinner: 'crescent',
          content: ``,
          duration: 800
        });
        loading.onDidDismiss(() => {
          this.isValidCode = true;
          this.headerMessage = "Reset Password";
          this.headerSubtitle = "Enter your new password";
          this.buttonText = "Change Password";
        });
        loading.present();

        if (this.verifdata.new_password.length < 6 || this.verifdata.confirm_password.length < 6) {
          this.passwordLength = true;
        } else {
          let changePass = {
            new_pass: this.verifdata.confirm_password,
            email: this.verifdata.email
          }
          this.pbookService.changePass(changePass).subscribe((data) => {
            if (data.Status === "UPDATED") {
              this.toasCtrls("Your password has been changed successfully! Thank you", 2000, "bottom", "success");
              setTimeout(() => {
                this.navCtrl.setRoot("LoginPage");
              }, 2000)
            }
          })
        }
      }


    }
  }

  alert(ttle: any, sTtle: any, bTxt: any) {
    let alert = this.alertCtrl.create({
      title: ttle,
      subTitle: sTtle,
      buttons: [
        {
          text: bTxt,
          cssClass: 'icon-color',
          handler: () => {
            console.log('Ok!');
          }
        }
      ]
    });
    alert.present();
  }

  findAccount() {
    var mes = "Enter your Email address and click Next button";
    const prompt = this.alertCtrl.create({
      title: 'Find your Account',
      cssClass: 'alertControl',
      message: mes,
      inputs: [
        {
          name: 'email',
          placeholder: 'johndoe@gmail.com'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Next',
          handler: data => {
            if (data.email !== '' && this.pbookService.validateEmail(data.email)) {
              this.pbookService.getMassSched("users", "email", data.email).subscribe((res) => {
                if (!Array.isArray(res) || !res.length) {
                  this.toasCtrls("No account found with that email address!", 3000, "top", "default");
                } else {
                  this.verifdata.email = res[0].email;
                  var verCode = this.setCode();
                  localStorage.setItem('verCode', verCode);
                  let jsonData = {
                    email: this.verifdata.email,
                    message: `${verCode} is your verification code to Reset your PariServe Password. It will expire 10 minutes.
                    Do not share under any circumstances!`,
                  }
                  this.pbookService.sendEmail(jsonData).subscribe((res) => {
                    if (res.Status === "Reset Code has been sent") {
                      this.normalLoad();
                      setTimeout(() => {
                        prompt.dismiss();
                        this.cardLogin = false;
                        this.toasCtrls("Verification code has been sent to your email.", 3000, "top", "default");
                      }, 1000);
                    } else {
                      this.toasCtrls(`${res.Status}. We have problem in sending email now`, 3000, "top", "error");
                    }
                  });
                }
              });
              return false;
            }
            else {
              this.toasCtrls("Invalid email address.", 2000, "top", "default");
              return false;
            }
          }
        }
      ]
    });

    prompt.setMode('ios');
    prompt.present();
  }

  normalLoad() {
    let loading = this.loadingCtrl.create({
      content: ``,
      cssClass: 'lodi',
      spinner: 'crescent',
      duration: 500
    });
    loading.present();
  }

  setCode() {
    var text = "";
    var possible = "0123456789";

    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  registerPage() {
    this.navCtrl.push('RegisterPage')
  }

  back() {
    this.cardLogin = true;
    this.isValidCode = false;
    this.verifdata = {
      verifCode: '',
      new_password: '',
      confirm_password: '',
      email: ''
    }
    this.headerMessage = "Enter Verification Code";
    this.headerSubtitle = "Please check your email address";
    this.buttonText = "Next";
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj[key] == "")
        return true;
    }
    return false;
  }

  loading(page: any) {
    let loading = this.loadingCtrl.create({
      content: ``,
      cssClass: 'lodi',
      spinner: 'ios',
      duration: 3000
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
      this.navCtrl.setRoot(page);
    }, 2000);
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



  // getData(accessToken:string){
  //   let url = 'https://graph.facebook.com/me?fields=id,name,first_name,last_name,email&access_token=' + accessToken;
  //   this.http.get(url).subscribe(data => {
  //     this.userdata = data;
  //   });
  // }
}
