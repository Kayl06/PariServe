import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';


@IonicPage()
@Component({
  selector: 'page-eventsmodal',
  templateUrl: 'eventsmodal.html',
})
export class EventsmodalPage {
  recievedEvent: {
    id: any,
    eType: any,
    img: any,
  };
  Wfees: any;
  bFees: any;
  wdays: any;
  burial: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public pbookService: AuthenticationProvider,
    public modalCtrl: ModalController
  ) {
    this.recievedEvent = this.navParams.get('eventData');
    if (this.recievedEvent) {
      switch (this.recievedEvent.id) {
        case 1:
          this.loadWedding();
          break;
        case 2:
          this.loadBaptismal();
          break;
        case 3:
          this.loadBurial();
          break;
        case 4:
          this.loadBlessings();
          break;
        default:
          break;
      }
    }
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


  back() {
    this.viewCtrl.dismiss();
  }

  pabookPage() {
    this.navCtrl.push('ChurchPage');
  }

  loadWedding() {
    this.Wfees = [];
    this.pbookService.selectAll("tbl_wfees").subscribe((data) => {
      data[0].total = parseInt(data[0].mrgFees) + parseInt(data[0].mrgWidMass) + parseInt(data[0].rCarpet) + parseInt(data[0].eUsage) + parseInt(data[0].seatCover)
      data[1].total = parseInt(data[1].mrgFees) + parseInt(data[1].mrgWidMass) + parseInt(data[1].eUsage) + parseInt(data[1].seatCover)
      this.Wfees = data;
    })
    // this.Wfees = [
    //   {
    //     tHeader: 'Marriage with Mass',
    //     title: 'Marriage Fees',
    //     sTtitle: 'Marriage with Mass',
    //     sTtitle2: 'Red Carpet',
    //     sTtitle3: 'Electric Usage',
    //     sTtitle4: 'Seat Covers',
    //     sTtitle5: 'Total',
    //     mrgFees: 500,
    //     mrgWidMass: 1000,
    //     rCarpet: 350,
    //     eUsage: 150,
    //     seatCover: 300,
    //     total: 2300
    //   },
    //   {
    //     tHeader: 'Marriage Blessing-No Mass',
    //     title: 'Marriage Fees',
    //     sTtitle: 'Marriage no Mass',
    //     sTtitle3: 'Electric Usage',
    //     sTtitle4: 'Seat Covers',
    //     sTtitle5: 'Total',
    //     mrgFees: 500,
    //     mrgWidMass: 1000,
    //     eUsage: 150,
    //     seatCover: 300,
    //     total: 1950
    //   }
    // ]
  }

  loadBaptismal() {
    this.pbookService.selectAll("tbl_bfees").subscribe(data => {
      this.wdays = [{
        pReservation: data[0].pReservation,
        parents: data[0].parents,
        rCert: data[0].rCert,
        sponsor: data[0].sponsor
      }]

      this.bFees = [
        {
          parentsFee: data[1].parentsFee,
          sponsorFee: data[1].sponsorFee,
        }
      ]
    })
    // this.bFees = [
    //   {
    //     parentsFee: 100,
    //     sponsorFee: 100,
    //   }
    // ]
    // this.wdays = [{
    //   pReservation: 1200,
    //   parents: 100,
    //   rCert: 50,
    //   sponsor: 112
    // }]
  }

  loadBurial() {
    this.pbookService.selectAll("tbl_bfees").subscribe(data => {
      this.burial = [
        {
          dC: 'Death Certificate',
          massFee: data[1].massFee,
          req: 'Mass Fee'
        }
      ]
    })
  }

  loadBlessings() {

  }



}
