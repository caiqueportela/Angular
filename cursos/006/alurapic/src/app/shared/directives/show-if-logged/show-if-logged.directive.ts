import { Directive, OnInit, ElementRef, Renderer2, Input } from '@angular/core';

import { UserService } from 'src/app/core/user/user.service';

@Directive({
  selector: '[showIfLogged]'
})
export class ShowIfLoggedDirective implements OnInit {

  @Input() rootNode;

  constructor(
    private element: ElementRef<any>,
    private renderer: Renderer2,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    if (!this.userService.isLogged()) {
      this.renderer.removeChild(this.rootNode, this.element.nativeElement);
      //this.renderer.setStyle(this.element, 'display', 'none');
    }
  }

}
