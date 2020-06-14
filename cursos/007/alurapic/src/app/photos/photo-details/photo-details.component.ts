import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { PhotoService } from 'src/app/photos/photo/photo.service';
import { Photo } from 'src/app/photos/photo/photo';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { UserService } from 'src/app/core/user/user.service';

@Component({
  templateUrl: './photo-details.component.html'
})
export class PhotoDetailsComponent implements OnInit {

  photo$: Observable<Photo>;
  photoId: number;

  constructor(
    private activatedRouter: ActivatedRoute,
    private photoService: PhotoService,
    private router: Router,
    private alertService: AlertService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(params => {
      this.photoId = params.photoId;
      this.photo$ = this.photoService.findById(this.photoId);
      this.photo$.subscribe(() => {}, err => {
        console.log(err);
        this.router.navigate(['not-found']);
      });
    });
  }

  remove() {
    this.photoService
      .removePhoto(this.photoId)
      .subscribe(
        () => {
          this.alertService.success('Photo removed', true);
          this.router.navigate(['/user', this.userService.getUserName()], { replaceUrl: true });
        },
        err => {
          console.log(err);
          this.alertService.warning('Could not delete the photo!', true);
        }
      );
  }

  like(photo: Photo) {
    this.photoService
      .like(photo.id)
      .subscribe(liked => {
        if (liked) {
          this.photo$ = this.photoService.findById(photo.id);
        }
      });
  }

}
