import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PabookModalPage } from './pabook-modal';

@NgModule({
  declarations: [
    PabookModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PabookModalPage),
  ],
})
export class PabookModalPageModule { }
