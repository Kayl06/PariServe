import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController, ActionSheetController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-church',
  templateUrl: 'church.html',
})
export class ChurchPage {
  fixedEvent = {
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    title: 'Baptism'
  };
  isToday: boolean;
  eventSource = [];
  viewTitle: any;
  selectedDay = new Date();
  oCdate: any;
  lockSwipeToPrev: any;
  calendar = {
    mode: 'month',
    currentDate: this.selectedDay,
  }
  items: any = ['Wedding', 'Burial', 'Baptism', 'Blessings']

  getChangeMonth: any;
  markDisabled = (date: Date) => {
    var current = new Date();
    return date < current;
  };
  counts: any = 0;
  selectedWeek: any;
  actionSheet: any;
  ionFab: boolean = true;
  id: number;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public pbookService: AuthenticationProvider) {
    this.loadEvents();
    this.today();
    if (this.navParams.get('fromSettings')) {
      // console.log()
      this.id = parseInt(this.navParams.get('id'));
      this.ionFab = false;
      let tabs = document.querySelectorAll('.tabbar');
      if (tabs !== null) {
        Object.keys(tabs).map((key) => {
          tabs[key].style.transform = 'translateY(56px)';
        });
      }
    }
  }

  ionViewWillEnter() {
    this.calendar.currentDate = new Date();
  }

  ionViewDidLeave() {
    this.counts = 0;
    this.ionFab = true;
    let tabs = document.querySelectorAll('.tabbar');
    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        tabs[key].style.transform = 'translateY(0)';
      });
    }
  }

  loadEvents() {
    this.eventSource = this.createRandomEvents();
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate() - 1;
  }

  changeAction() {

  }

  presentActionSheet(param1) {
    if (localStorage.getItem('userData') !== null || localStorage.getItem('accessToken') !== null) {
      var current = new Date();
      if (this.selectedDay < current) {
        return false;
      } else {

      }

      if (param1 !== 'ChangeSched') {
        let actionSheet = this.actionSheetCtrl.create({
          title: `What Event? ${moment(this.selectedDay).format('ll')}`,
          cssClass: 'eventAction',
          enableBackdropDismiss: true,
          buttons: [
            {
              text: 'Wedding',
              role: 'destructive',
              handler: () => {
                let date = new Date();
                let currentMonth = date.getMonth() + 1
                let currentMonthYear = currentMonth.toString() + " " + date.getFullYear().toString()
                if (currentMonthYear == this.getChangeMonth) {
                  this.toasCtrls("Reminder : If 'WEDDING', the system allowed reservation 1 month or greater before the wedding date", "top", "confirm");
                  return false;
                } else {
                  this.addEvent('Wedding');
                }
              }
            }, {
              text: 'Baptism',
              role: 'destructive',
              handler: () => {
                let curr = new Date();
                let week = []

                for (let i = 1; i <= 7; i++) {
                  let first = curr.getDate() - curr.getDay() + i
                  let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
                  week.push(day)
                }
                if (week[6] == this.selectedWeek[6]) {
                  this.toasCtrls("Reminder : If Special 'Baptismal', the system allowed reservation 1 week before the baptismal date", "top", "confirm");
                  return false;
                }
                else {
                  this.addEvent('Baptismal');
                }
              }
            }, {
              text: 'Burial',
              handler: () => {
                this.addEvent('Burial');
              }
            }, {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
        });
        actionSheet.present();

        this.actionSheet = actionSheet;

      }
      else {

        if (this.checkCurrent() == this.oCdate) {
          return this.toasCtrls("Warning: This is Current Date", "middle", "confirm")
        } else {
          this.pbookService.getMassSched('pabook_reservations', 'pbr_id', this.id).subscribe(res => {
            let a = res;
            switch (a[0].pbr_evName) {
              case "Wedding":
                if (this.checkCurrentMonth() == this.getChangeMonth) {
                  return this.toasCtrls("The system allowed reservation 1 month or greater before the wedding date", "middle", "confirm")
                } else {
                  // this.navCtrl.push('PabookModalPage', { info: a, selectedDay: this.selectedDay })
                  let modal = this.modalCtrl.create('PabookModalPage', { info: a, selectedDay: this.selectedDay })
                  modal.present()
                }
                break;
              default:
                // this.navCtrl.push('PabookModalPage', { info: a, selectedDay: this.selectedDay })
                let modal = this.modalCtrl.create('PabookModalPage', { info: a, selectedDay: this.selectedDay })
                modal.present()
                break;
            }
          });
        }
      }
    } else {
      this.toasCtrls("You need to login first", "top", "error");
    }

  }
  checkCurrent() {
    let currents = new Date();
    let current = currents.toLocaleDateString("en-US")
    return current
  }
  checkCurrentMonth() {
    let date = new Date();
    let currentMonth = date.getMonth() + 1
    let currentMonthYear = currentMonth.toString() + " " + date.getFullYear().toString()
    return currentMonthYear
  }

  addEvent(type: any) {
    if (this.checkCurrent() == this.oCdate) {
      return this.toasCtrls("Ooopss! You are not allowed to reserve this date. Atleast 1 or more days before!", "middle", "confirm")
    } else {
      let modal = this.modalCtrl.create('PabookModalPage', { selectedDay: this.selectedDay, type: type });
      modal.present();

      return modal;

    }

  }
  onCurrentDateChanged(event) {
    this.oCdate = new Date(event);
    let mth = this.oCdate.getMonth() + 1;
    this.getChangeMonth = mth.toString() + " " + this.oCdate.getFullYear().toString()
    this.oCdate = this.oCdate.toLocaleDateString("en-US");
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
    this.counts = 0;
  }
  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;

    let curr = new Date(this.selectedDay)
    let week = []
    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i
      let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
      week.push(day)
    }
    this.selectedWeek = week;

    var current = new Date();
    if (this.selectedDay < current) {
      return false;
    } else {
      this.counts += 1;
      setTimeout(() => {
        this.counts = 0;
      }, 200);
      if (this.counts >= 2) {
        switch (true) {
          case (!this.navParams.get('fromSettings')):
            this.presentActionSheet('Default');
            break;
          default:
            this.presentActionSheet('ChangeSched');
            break;
        }
      } else {
        return false;
      }
      // this.presentActionSheet();
    }
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onEventSelected(bookingData) {
    let start = moment(bookingData.startTime).format('LLLL');
    // let end = moment(bookingData.endTime).format('LLLL');

    let alert = this.alertCtrl.create({
      title: '' + bookingData.title,
      subTitle: 'Time: ' + start,
      buttons: ['Ok']
    });
    alert.present();
  }

  toasCtrls(messages: any, position: any, classy: any) {
    let toast = this.toastCtrl.create({
      cssClass: classy,
      message: messages,
      // duration: duration,
      position: position,
      showCloseButton: true,
      closeButtonText: "Ok"
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  createRandomEvents() {
    var events = [];

    this.pbookService.allEvents().subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        var title;
        if (data[i].status == "Temporary Accepted") {
          title = `${data[i].title} - ${moment(data[i].start).format('LT')} Temporary Accepted`;
        } else {
          title = `${data[i].title} - ${moment(data[i].start).format('LT')}`;
        }
        events.push({
          title: title,
          startTime: new Date(moment(new Date(data[i].start)).format()),
          endTime: new Date(moment(new Date(data[i].end)).format()),
          // allDay: true
        });
      }
    })
    return events;
  }

}
