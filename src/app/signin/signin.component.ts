import { Component, OnInit } from '@angular/core';
import { AppPaths } from '../app.paths';
import { AuthenticationService } from "../authentication/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  errorMessage: string = null;
  email: string = null;
  password: string = null;

  constructor(public appPaths: AppPaths,
              public authenticationService: AuthenticationService,
              public router: Router) { }

  ngOnInit() {

    // Check if user is signed in.
    this.authenticationService.isAuthenticated((authenticated: boolean) => {
      if (authenticated) {
        this.router.navigate([this.appPaths.secure]);
      }
    });

  }

  onSignin(): void {

    this.errorMessage = null;
    this.authenticationService.authenticate(this.email, this.password, (error: any) => {
      if (error) {
        this.errorMessage = error;
      } else {
        this.router.navigate([this.appPaths.secure]);
      }
    });

  }

}
