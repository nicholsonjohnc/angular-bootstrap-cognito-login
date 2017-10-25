import { Component, OnInit } from '@angular/core';
import { AppPaths } from '../app.paths';
import { AuthenticationService } from "../authentication/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.css']
})
export class SecureComponent implements OnInit {

  constructor(public appPaths: AppPaths,
              public authenticationService: AuthenticationService,
              public router: Router) { }

  ngOnInit() {

    // Check if user is signed in.
    this.authenticationService.isAuthenticated((authenticated: boolean) => {
      if (!authenticated) {
        this.router.navigate([this.appPaths.signin]);
      }
    });

  }

}
