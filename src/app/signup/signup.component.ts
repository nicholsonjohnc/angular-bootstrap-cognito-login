import { Component, OnInit } from '@angular/core';
import { AppPaths } from '../app.paths';
import { AuthenticationService } from "../authentication/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'abc-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  errorMessage: string = null;
  email: string = null;
  password: string = null;
  confirmPassword: string = null;

  constructor(public appPaths: AppPaths,
              public authenticationService: AuthenticationService,
              public router: Router) { }

  ngOnInit() {
  }

  onSignup(): void {

    this.errorMessage = null;
    this.authenticationService.registerUser(this.email, this.password, (error: any, result: any) => {
      if (error) {
        this.errorMessage = error;
      } else {
        this.router.navigate([this.appPaths.confirm, result.user.username]);
      }
    });

  }

}
