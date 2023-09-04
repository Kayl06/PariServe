import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotifDetailsPage } from './notif-details';
import { IonicStepperModule } from 'ionic-stepper';

@NgModule({
  declarations: [
    NotifDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(NotifDetailsPage),
    IonicStepperModule

  ],
})
export class NotifDetailsPageModule {}
