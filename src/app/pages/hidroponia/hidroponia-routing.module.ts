import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HidroponiaPage } from './hidroponia.page';

const routes: Routes = [
  {
    path: '',
    component: HidroponiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HidroponiaPageRoutingModule {}
