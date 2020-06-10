import { Directive, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';

import { UserService } from 'src/app/core/user/user.service';
import { Photo } from 'src/app/photos/photo/photo';

@Directive({
  selector: '[photoOwnerOnly]'
})
export class PhotoOwnerOnlyDirective implements OnInit {

  @Input() ownedPhoto: Photo;
  @Input() rootNode;

  constructor(
    private element: ElementRef<any>,
    private renderer: Renderer2,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      if (!user || user.id !== this.ownedPhoto.userId){
        this.renderer.removeChild(this.rootNode, this.element.nativeElement);
        //this.renderer.setStyle(this.element.nativeElement, 'display', 'none');
      }
    });
  }

}
