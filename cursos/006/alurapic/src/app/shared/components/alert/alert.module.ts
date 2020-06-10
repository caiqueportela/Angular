import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from 'src/app/shared/components/alert/alert.component';

@NgModule({
  declarations: [
    AlertComponent
  ],
  exports: [
    AlertComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AlertModule {

}
