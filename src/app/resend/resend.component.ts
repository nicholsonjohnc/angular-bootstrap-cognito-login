import { Component, OnInit } from '@angular/core';
import { AppPaths } from '../app.paths';
import { AuthenticationService } from "../authentication/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-resend',
  templateUrl: './resend.component.html',
  styleUrls: ['./resend.component.css']
})
export class ResendComponent implements OnInit {

  errorMessage: string = null;
  email: string = null;

  constructor(public appPaths: AppPaths,
              public authenticationService: AuthenticationService,
              public router: Router) { }

  ngOnInit() {
  }

  onResend() {

    this.authenticationService.resendCode(this.email, (error: any, result: any) => {
      if (error) {
        this.errorMessage = error;
      } else {
        this.router.navigate([this.appPaths.confirm, this.email]);
      }
    });

  }

}
