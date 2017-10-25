import { Component, OnInit } from '@angular/core';
import { AppPaths } from '../app.paths';
import { AuthenticationService } from "../authentication/authentication.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  errorMessage: string = null;
  confirmationCode: string = null;
  username: string;
  subscription: any;

  constructor(public appPaths: AppPaths,
              public authenticationService: AuthenticationService,
              public router: Router,
              public activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.subscription = this.activatedRoute.params.subscribe(params => {
      this.username = params['username'];
    });

  }

  onConfirm(): void {

    this.errorMessage = null;
    this.authenticationService.confirmRegistration(this.username, this.confirmationCode, (error: any, result: any) => {
      if (error) {
        this.errorMessage = error;
      } else {
        this.router.navigate([this.appPaths.signin]);
      }
    });

  }

  ngOnDestroy(): void {

    this.subscription.unsubscribe();

  }

}
