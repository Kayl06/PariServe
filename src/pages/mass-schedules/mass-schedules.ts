import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';


@IonicPage()
@Component({
  selector: 'page-mass-schedules',
  templateUrl: 'mass-schedules.html',
})
export class MassSchedulesPage {


  constructor(public navCtrl: NavController,
    public navParams: NavParams, public viewCtrl: ViewController,
    public pbookService: AuthenticationProvider,
    public modalCtrl: ModalController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MassSchedulesPage');

  }

  back() {
    this.viewCtrl.dismiss();
  }


  anotherPage(id, title) {
    var scheduleData = {
      id: id,
      title: title,
    }
    this.modalControler("SchedulesPage", scheduleData);
  }

  modalControler(page, data: any) {
    let modal = this.modalCtrl.create(page, { scheduleData: data });
    modal.present();
  }

  imgUrl = "https://www.gcccsbsit.xyz/_pabookAdmin/assets/images/";

  slider = [
    {
      img: this.imgUrl + 'col5.jpg',
      title: 'St. Joseph Parish Church',
    },
    {
      img: this.imgUrl + 'col1.jpg',
      title: 'St. Columban Parish Church',
    },
    {
      img: this.imgUrl + 'col2.jpg',
      title: 'Sta. Rita Catholic Church',
    },
    {
      img: this.imgUrl + 'col3.jpg',
      title: 'San Roque Chapel',
    }
  ];
  // items = [
  //   {
  //     id: 1,
  //     img: this.imgUrl+'2.jpg',
  //     title: 'Daily Mass Schedules',
  //   },
  //   {
  //     id: 2,
  //     img: '../../assets/imgs/2.jpg',
  //     title: 'Other Church Service',
  //   },
  //   {
  //     id: 3,
  //     img: this.imgUrl+'2.jpg',
  //     title: 'Marriage Requirements',
  //   },
  //   {
  //     id: 4,
  //     img: this.imgUrl+'2.jpg',
  //     title: 'Baptism Requirements',
  //   }
  // ]



}
