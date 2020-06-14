import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/core/auth/auth.service';
import { PlatformDetectorService } from 'src/app/core/platform-detector/platform-detector.service';

@Component({
  templateUrl: './signin.component.html',
})
export class SigninComponent implements OnInit, AfterViewInit {

  @ViewChild('userName') userNameInput: ElementRef<HTMLInputElement>;

  loginForm: FormGroup;
  fromUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private platformDetectorService: PlatformDetectorService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.activatedRoute.queryParams.subscribe(params => this.fromUrl = params.fromUrl);
  }

  ngAfterViewInit(): void {
    this.focusInputUserName();
  }

  login() {
    const userName = this.loginForm.get('userName').value;
    const password = this.loginForm.get('password').value;

    this.authService
      .authenticate(userName, password)
      .subscribe(
        () => this.fromUrl
            ? this.router.navigateByUrl(this.fromUrl)
            : this.router.navigate(['user', userName]),
        err => {
          console.log(err);
          this.loginForm.reset();
          this.focusInputUserName();
          alert('Invalid username or password');
        }
      );
  }

  focusInputUserName() {
    if(this.platformDetectorService.isPlatformBrowser()) {
      this.userNameInput.nativeElement.focus();
    }
  }

}
