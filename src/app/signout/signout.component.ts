import { Component, OnInit } from '@angular/core';
import { AppPaths } from '../app.paths';
import { AuthenticationService } from "../authentication/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css']
})
export class SignoutComponent implements OnInit {

  constructor(public appPaths: AppPaths,
              public authenticationService: AuthenticationService,
              public router: Router) { }

  ngOnInit() {

    // Check if user is signed in.
    this.authenticationService.isAuthenticated((authenticated: boolean) => {
      if (authenticated) {
        this.authenticationService.signout();
        this.router.navigate([this.appPaths.signin]);
      } else {
        this.router.navigate([this.appPaths.signin]);
      }
    });

  }

}
