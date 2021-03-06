import { NgModule } from '@angular/core';

import { PhotoFormModule } from './photo-form/photo-form.module';
import { PhotoListModule } from './photo-list/photo-list.module';
import { PhotoModule } from './photo/photo.module';
import { PhotoDetailModule } from 'src/app/photos/photo-details/photo-details.module';

@NgModule({
  imports: [
    PhotoFormModule,
    PhotoListModule,
    PhotoModule,
    PhotoDetailModule
  ]
})
export class PhotosModule { }
