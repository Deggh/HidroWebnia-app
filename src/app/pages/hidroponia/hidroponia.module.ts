import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HidroponiaPageRoutingModule } from './hidroponia-routing.module';

import { HidroponiaPage } from './hidroponia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HidroponiaPageRoutingModule
  ],
  declarations: [HidroponiaPage]
})
export class HidroponiaPageModule {}
