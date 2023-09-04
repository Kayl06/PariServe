import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MassSchedulesPage } from './mass-schedules';

@NgModule({
  declarations: [
    MassSchedulesPage,
  ],
  imports: [
    IonicPageModule.forChild(MassSchedulesPage),
  ],
})
export class MassSchedulesPageModule {}
