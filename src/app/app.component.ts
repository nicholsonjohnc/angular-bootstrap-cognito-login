import { Component, OnInit } from '@angular/core';
import { AppPaths } from './app.paths';
import { AuthenticationService } from "./authentication/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public appPaths: AppPaths,
              public authenticationService: AuthenticationService,
              public router: Router) { }

  ngOnInit() {

    this.authenticationService.isAuthenticated(this.isAuthenticatedCallback.bind(this));

  }

  isAuthenticatedCallback(authenticated: boolean): void {

    // If authenticated get jwt token.
    if (authenticated) {
      this.authenticationService.getJwtToken(this.getJwtTokenCallback.bind(this));
    }

  }

  getJwtTokenCallback(jwtToken: string) {

    // If jwt token retrieved initialize credentials.
    if (jwtToken) {
      this.authenticationService.initializeCognitoCredentials(jwtToken, () => {});
    }

  }

}
