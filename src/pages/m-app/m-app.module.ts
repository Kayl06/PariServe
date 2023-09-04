import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MAppPage } from './m-app';
import { IonicStepperModule } from 'ionic-stepper';


@NgModule({
  declarations: [
    MAppPage,
  ],
  imports: [
    IonicPageModule.forChild(MAppPage),
    IonicStepperModule
  ],
})
export class MAppPageModule { }
