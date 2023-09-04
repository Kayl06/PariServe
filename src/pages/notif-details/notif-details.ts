import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { IonicStepperComponent } from "ionic-stepper";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { DomSanitizer } from '@angular/platform-browser';
@IonicPage()
@Component({
  selector: 'page-notif-details',
  templateUrl: 'notif-details.html',
})
export class NotifDetailsPage {
  imgUrl = 'https://www.gcccsbsit.xyz/_pabookApi/requirements_images_from_users/';
  imgFile = ''
  notifDetails = {
    evName: '',
    rej_reason: '',
    reserve_at: '',
    status: '',
    evDate: '',
    startTime: '',
    endTime: '',
    baptismal_img: '',
    wedding_img1: '',
    wedding_img2: '',
  };

  details = {
    text: "Check your requirement(s)",
    icon: "eye"
  };
  mode: string = 'vertical';
  selectedIndex = 0;
  show: boolean = false;
  isHide: boolean = false;
  reqText = "View Requirements";
  base64Image: any = '';
  weddingImages: any = []
  showChooseFile: boolean = true;
  showAddButton: boolean = false;
  count = 0;
  info: any = {
    image_file: '',
    image_file_name: '',
    evName: '',
    senderName: '',
    user_id: '',
    pbr_id: ''
  }
  choose: any = 'Choose Photo';
  @ViewChild('stepper') stepper: IonicStepperComponent;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private alertCtrl: AlertController, private camera: Camera, public pabookService: AuthenticationProvider, public sanitizer: DomSanitizer) {
    var det = this.navParams.get('details');
    this.notifDetails.evName = det.evName;
    this.notifDetails.rej_reason = det.rej_reason;
    this.notifDetails.reserve_at = det.reserve_at;
    this.notifDetails.status = det.status;
    this.notifDetails.startTime = moment(det.startTime).format('dddd, MMMM D, h:mm a');
    this.notifDetails.endTime = moment(det.endTime).format('h:mm a');
    this.notifDetails.baptismal_img = det.baptismal_img;
    this.notifDetails.wedding_img1 = det.wedding_img1;
    this.notifDetails.wedding_img2 = det.wedding_img2;
    this.info.pbr_id = det.pbr_id;
    var a = JSON.parse(atob(localStorage.getItem('userData')));
    this.info.user_id = a.userData.user_id;
  }

  back() {
    this.viewCtrl.dismiss();
  }
  ionViewWillEnter() {
    localStorage.removeItem('notifCount');

    if (this.notifDetails.evName !== 'Wedding') {
      this.choose = 'Change Photo?';
      console.log(this.choose)
      this.base64Image = 'https://www.gcccsbsit.xyz/_pabookApi/requirements_images_from_users/' + this.notifDetails.baptismal_img;
    } else {
      this.choose = "Change Photo?";
      this.weddingImages = [
        'https://www.gcccsbsit.xyz/_pabookApi/requirements_images_from_users/' + this.notifDetails.wedding_img1, 'https://www.gcccsbsit.xyz/_pabookApi/requirements_images_from_users/' + this.notifDetails.wedding_img2
      ];
    }

  }
  getImgContent(imageFile) {
    return this.sanitizer.bypassSecurityTrustUrl(imageFile);
  }
  openGallery(eventType: any) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      if (eventType === 0 || eventType === 1) {
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        this.weddingImages.splice(eventType, 1, this.base64Image)
      }

      if (eventType !== 'Wedding') {
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
      } else {
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        this.weddingImages.push(this.base64Image);
        if (this.weddingImages.length < 2) {
          this.showChooseFile = false;
          this.showAddButton = true;
        } else {
          this.showAddButton = false;
        }
      }


    }, (err) => {
      this.toasCtrls(err, 3000, 'bottom', 'def')
    });
  }

  arrayReplace() {

  }

  selectChange(e) {
    console.log(e);
  }

  viewReq(params) {
    if (params === 'view') {
      if (this.show == false) {
        this.loadingController(500, '')
        setTimeout(() => {
          this.show = true;
          this.reqText = "Hide Requirements";
        }, 500)

      } else {
        this.loadingController(500, '')
        setTimeout(() => {
          this.show = false;
          this.reqText = "View Requirements";
        }, 500)
      }
    } else {
      if (this.isHide == false) {
        this.isHide = true;
        this.details.text = 'Hide';
        this.details.icon = 'eye-off';
      } else {
        this.isHide = false;
        this.details.text = 'Check your requirements';
        this.details.icon = 'eye';
      }
    }


  }

  submitFile(evName: any) {
    var a = JSON.parse(atob(localStorage.getItem('userData')));
    if (evName === 'Wedding') {
      if (this.weddingImages.length == 2) {
        this.info.image_file = this.weddingImages;
        this.info.image_file_name = `${evName}_Requirement_${a.userData.fname}_${a.userData.lname}_${moment().format('YYYYMMDD')}`;
        this.info.evName = evName;
        this.info.senderName = `${a.userData.fname} ${a.userData.lname}`;
        this.loadingController(2000, ' Please Wait...')
        this.pabookService.uploadImage(this.info).subscribe((res) => {
          setTimeout(() => {
            this.showAlert('Submitted', 'Successfuly submitted. Please wait for the confirmation', 'Okay');
            this.showChooseFile = true;
            // this.weddingImages = [];
          }, 1500)

        }, (err) => {
          this.toasCtrls(err, 3000, 'bottom', 'def')
        })

      } else {
        this.toasCtrls('Please complete the requirements!', 3000, 'bottom', 'def')
      }
    } else {
      if (this.base64Image !== '') {
        this.info.image_file = this.base64Image;
        this.info.image_file_name = `${evName}_Requirement_${a.userData.fname}_${a.userData.lname}_${moment().format('YYYYMMDD')}`;
        this.info.evName = evName;
        this.info.senderName = `${a.userData.fname} ${a.userData.lname}`;

        this.loadingController(2000, ' Please Wait...')
        this.pabookService.uploadImage(this.info).subscribe((res) => {
          setTimeout(() => {
            // this.base64Image = '';
            this.showAlert('Submitted', 'Successfuly submitted. Please wait for the confirmation', 'Okay');
          }, 1500)
        }, (err) => {
          this.toasCtrls(err, 3000, 'bottom', 'def')
        })

      } else {
        this.toasCtrls('Please Insert the Image(s)', 3000, 'bottom', 'def')
      }
    }


  }

  loadingController(duration: any, content: any) {
    let loading = this.loadingCtrl.create({
      content: `${content}`,
      cssClass: 'lodi',
      spinner: 'ios',
      duration: duration
    });
    loading.present();
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

  showAlert(title, subTitle, btnTxt) {
    const alert = this.alertCtrl.create({
      title: title,
      cssClass: 'alertControl',
      subTitle: subTitle,
      buttons: [btnTxt]
    });
    alert.present();
    alert.setMode('ios');
  }
}
