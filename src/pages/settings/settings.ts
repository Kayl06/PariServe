import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, Slides, ToastController, ActionSheetController, ModalController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { TabsPage } from '../tabs/tabs';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  truncating = true;
  @ViewChild(Slides) slides: Slides;
  isUserLoggedIn: any = false;
  isRegistration: any = false;
  isNew: any = false;
  userInfo: any = {};
  changePasswordInfo = {
    old_pass: '',
    new_pass: '',
    veripass: ''
  };
  id: any;
  history = [];
  hs: boolean = false;
  hide: boolean = true;
  ionTitle = "Edit Profile";
  err = "";
  changePassword: boolean = false;
  passwordlength: boolean = false;
  image_data: any = '';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private app: App,
    public loadingCtrl: LoadingController,
    public http: HttpClient,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController,
    public pbookService: AuthenticationProvider,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    public tabPage: TabsPage) {
    if (localStorage.getItem('accessToken')) {
      this.getData();
      this.isUserLoggedIn = true;
    } else if (localStorage.getItem('userData') == null) {
      this.isNew = true;
    }
    else {
      this.isRegistration = true;
      this.otherUser();
    }
    // this.tabPage.userCheck();
  }

  register() {
    let loading = this.loadingCtrl.create({
      content: ``,
      cssClass: 'lodi',
      spinner: 'ios',
      duration: 2000
    });

    loading.present();
    setTimeout(() => {
      let newRootNav = <NavController>this.app.getRootNavById('n4');
      newRootNav.setRoot('RegisterPage');
    }, 2000)

  }

  itemSelected(item: any) {
    console.log(item);
  }

  back() {
    this.loadingController(800)
    setTimeout(() => {
      this.otherUser();
      this.hide = true;
      this.changePassword = false;
      this.ionTitle = "Edit Profile";
      this.changePasswordInfo = {
        old_pass: '',
        new_pass: '',
        veripass: ''
      };
      let tabs = document.querySelectorAll('.tabbar');
      if (tabs !== null) {
        Object.keys(tabs).map((key) => {
          tabs[key].style.transform = 'translateY(0)';
        });
      }
    }, 1000);
  }

  ionViewWillEnter() {
    if (this.isNew === false && localStorage.getItem('userData') !== null) {
      this.loadhis();
      if (this.userInfo.userData.img_path === '') {
        this.image_data = 'https://www.gcccsbsit.xyz/_pabookApi/requirements_images_from_users/profile.jpg';
      } else {
        this.image_data = `https://www.gcccsbsit.xyz/_pabookApi/requirements_images_from_users/${this.userInfo.userData.img_path}`;
      }
    }
    if (localStorage.getItem('accessToken')) {
      console.log('facebook');
    }
  }

  loadhis() {
    this.history = this.resHistory();
  }

  ActionSheet(param1, param2, param3, param4) {
    if (param3 === 'Rejected' || param3 === 'Cancelled') {
      return false;
    } else {
      let actionSheet = this.actionSheetCtrl.create({
        title: ` ${param1} - ${param2} (${param3})`,
        cssClass: 'eventAction',
        enableBackdropDismiss: true,
        buttons: [
          {
            icon: 'ios-swap',
            role: 'destructive',
            text: 'Change Schedule',
            cssClass: 'eventActionChange',
            handler: () => {
              this.navCtrl.push('ChurchPage', { fromSettings: 'ChangeSched', id: param4 });
            }
          },
          {
            text: 'Cancel Schedule',
            role: 'destructive',
            icon: 'ios-remove-circle-outline',
            cssClass: 'eventActionCancel',
            handler: () => {
              // this.navCtrl.push('ChurchPage', { fromSettings: 'ReSched', id: param4 });
              this.pbookService.getMassSched('pabook_reservations', 'pbr_id', param4).subscribe(data => {
                let modal = this.modalCtrl.create('PabookModalPage', { info: data, resched: "resched" });
                modal.present()
              })
            },

          }]
      })
      actionSheet.present();
    }
  }

  openGallery() {
    // this.toasCtrls("You can't change your avatar now", 3000, "top", "error")
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      this.image_data = 'data:image/jpeg;base64,' + imageData;
    });
    console.log(this.image_data);
  }

  editprofile(event) {
    this.loadingController(800)
    if (event === "editprofile") {
      setTimeout(() => {
        this.hide = false;
        let tabs = document.querySelectorAll('.tabbar');
        if (tabs !== null) {
          Object.keys(tabs).map((key) => {
            tabs[key].style.transform = 'translateY(56px)';
          });
        }
      }, 1000);
    } else {
      setTimeout(() => {
        this.hide = false;
        this.changePassword = true;
        this.ionTitle = "Change Password";
        let tabs = document.querySelectorAll('.tabbar');
        if (tabs !== null) {
          Object.keys(tabs).map((key) => {
            tabs[key].style.transform = 'translateY(56px)';
          });
        }
      }, 1000);
    }

  }

  done(event) {
    if (event !== 'changepassword') {
      let image_info = {
        image_file: this.image_data,
        image_file_name: `${this.userInfo.userData.user_id}_dp`,
        change_dp: "change_dp",
        user_id: parseInt(this.userInfo.userData.user_id)
      }

      this.pbookService.uploadImage(image_info).subscribe((data) => {
      })

      this.pbookService.updateProfile(this.userInfo.userData.fname, this.userInfo.userData.lname, this.userInfo.userData.email, this.userInfo.userData.mobile, this.userInfo.userData.user_id).subscribe(data => {
        if (data) {
          this.userInfo.userData.img_path = image_info.image_file_name + '.jpg';
          localStorage.setItem('userData', btoa(JSON.stringify(this.userInfo)));
          console.log(this.userInfo);
          this.loadingController(2000)
          setTimeout(() => {
            this.toasCtrls("Your profile information has been Updated Successfully!", 1500, "top", "success")
            this.hide = true;
            this.changePassword = false;
            this.ionTitle = "Edit Profile";
            let tabs = document.querySelectorAll('.tabbar');
            if (tabs !== null) {
              Object.keys(tabs).map((key) => {
                tabs[key].style.transform = 'translateY(0)';
              });
            }
          }, 3000);
        }
      });
    } else {
      if (this.password() && this.changePasswordInfo.old_pass !== '') {
        switch (true) {
          case (this.changePasswordInfo.new_pass !== this.changePasswordInfo.veripass):
            this.toasCtrls('The password you entered do no match.', 2000, 'top', 'error');
            break;
          default:
            let changePass = {
              new_pass: this.changePasswordInfo.veripass,
              user_id: this.userInfo.userData.user_id,
              old_pass: this.changePasswordInfo.old_pass
            }
            this.pbookService.checkPassword(changePass).subscribe((rs) => {
              if (rs.Status === 'Incorrect') {
                this.toasCtrls('The old password you have entered is incorrect', 2000, 'top', 'error');
              } else {
                this.loadingController(2000)
                setTimeout(() => {
                  this.toasCtrls('Success! Your Password has been changed!', 2000, 'top', 'success');
                  this.hide = true;
                  this.changePassword = false;
                  this.ionTitle = "Edit Profile";
                  this.changePasswordInfo = {
                    old_pass: '',
                    new_pass: '',
                    veripass: ''
                  };
                  let tabs = document.querySelectorAll('.tabbar');
                  if (tabs !== null) {
                    Object.keys(tabs).map((key) => {
                      tabs[key].style.transform = 'translateY(0)';
                    });
                  }
                }, 3000);
              }
            })
            break;
        }
      } else if (this.changePasswordInfo.old_pass == '' ||
        this.changePasswordInfo.new_pass == '' ||
        this.changePasswordInfo.veripass == '') {
        this.toasCtrls('All fields are required', 2000, 'top', 'default');
      } else {
        this.err = "error-password";
      }
    }
  }

  password() {
    if (this.changePasswordInfo.new_pass.length < 6 || this.changePasswordInfo.veripass.length < 6) {
      this.passwordlength = true;
      return false;
    } else {
      this.passwordlength = false;
      return true;
    }
  }

  isEmpty(obj) {

    for (var key in obj) {
      if (obj[key] == "")
        return true;
    }
    return false;
  }

  getData() {
    let t = JSON.parse(localStorage.getItem('accessToken'));
    if (t !== '') {
      let url = "https://graph.facebook.com/me?fields=id,name,first_name,last_name,email&access_token=" + t;
      this.http.get(url).subscribe(data => {
        this.userInfo = data;
        localStorage.setItem('userInfoFromFB', this.userInfo);
        this.userInfo.img = 'http://graph.facebook.com/' + this.userInfo.id + '/picture?type=square';
        this.isUserLoggedIn = true;
      });
    } else {
      console.log(this.isUserLoggedIn);
    }
  }

  otherUser() {
    var a = JSON.parse(atob(localStorage.getItem('userData')));
    this.userInfo = a;
  }

  backtoLoginPage() {
    let newRootNav = <NavController>this.app.getRootNavById('n4');
    newRootNav.setRoot('LoginPage');
  }


  logout() {

    this.pbookService.logout(this.userInfo.userData.user_id).subscribe(res => {
      console.log(res);
    })

    let loading = this.loadingCtrl.create({
      content: ``,
      cssClass: 'lodi',
      spinner: 'ios',
      duration: 3000
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
      localStorage.removeItem('userData');
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('selectIndex');
      this.backtoLoginPage()
    }, 1000);
  }


  resHistory() {
    var hs = [];
    let id = this.userInfo.userData.user_id;
    this.pbookService.getMassSched("pabook_reservations", "hs_id", id).subscribe(data => {
      let a = data
      if (!Array.isArray(a) || !a.length) {
      } else {
        this.hs = true;
        // let reserve = moment(a[0].reserve_at).calendar();  
        for (let i = 0; i < a.length; i++) {
          hs.push({
            reserve_at: a[i].pbr_evDate,
            evName: a[i].pbr_evName,
            status: a[i].status,
            id: a[i].pbr_id
          });
        }

        hs.sort();
        hs.reverse();
      }
    });
    return hs;
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

  loadingController(duration: any) {
    let loading = this.loadingCtrl.create({
      content: ``,
      cssClass: 'lodi',
      spinner: 'ios',
      duration: duration
    });

    loading.present();
  }

}
