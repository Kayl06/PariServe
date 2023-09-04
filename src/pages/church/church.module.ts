import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChurchPage } from './church';
import { NgCalendarModule } from 'ionic2-calendar';

@NgModule({
  declarations: [
    ChurchPage,
  ],
  imports: [
    NgCalendarModule,
    IonicPageModule.forChild(ChurchPage),
  ],
})
export class ChurchPageModule { }
