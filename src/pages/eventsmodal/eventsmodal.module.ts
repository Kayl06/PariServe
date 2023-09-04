import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsmodalPage } from './eventsmodal';

@NgModule({
  declarations: [
    EventsmodalPage,
  ],
  imports: [
    IonicPageModule.forChild(EventsmodalPage),
  ],
})
export class EventsmodalPageModule {}
