import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-schedules',
  templateUrl: 'schedules.html',
})
export class SchedulesPage {

  responseData: any;
  date = [];

  scheduleData: any = {
    id: '',
    title: '',
    type: '',
  }


  loadReq = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public pbookService: AuthenticationProvider
  ) {

    this.scheduleData = this.navParams.get('scheduleData');
    if (this.scheduleData) {
      switch (this.scheduleData.id) {
        case 1:
          this.scheduleData.type = "Mass"
          this.loadSched(this.scheduleData.type);
          break;
        case 2:
          this.scheduleData.type = "Church Events"
          this.loadSched(this.scheduleData.type);
          break;
        case 3:
          this.loadReq = true;
          break;
        case 4:
          this.loadReq = true;
          break;
        default:
          break;
      }
    }

  }

  back() {
    this.viewCtrl.dismiss();
  }

  loadSched(type) {
    this.pbookService.getMassSched("tbl_schedules", "fld_name", type).subscribe(data => {
      this.responseData = data;
      for (var i = 0; i < this.responseData.length; i++) {
        // console.log(this.responseData[i].fld_date);
        this.date.push({
          dates: moment(this.responseData[i].fld_date).format("(dddd)")
        });
      }
    });
  }

  massSchedule() {
    // console.log(this.responseData);

  }

}
