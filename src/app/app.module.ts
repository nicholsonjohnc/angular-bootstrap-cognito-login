import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppPaths } from './app.paths';
import { AuthenticationService } from "./authentication/authentication.service";
import { ConfirmComponent } from './confirm/confirm.component';
import { SigninComponent } from './signin/signin.component';
import { SecureComponent } from './secure/secure.component';
import { SignoutComponent } from './signout/signout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResendComponent } from './resend/resend.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    ConfirmComponent,
    SigninComponent,
    SecureComponent,
    SignoutComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ResendComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: "signup", component: SignupComponent },
      { path: 'confirm/:username', component: ConfirmComponent },
      { path: "signin", component: SigninComponent },
      { path: "secure", component: SecureComponent },
      { path: "signout", component: SignoutComponent },
      { path: "forgot-password", component: ForgotPasswordComponent },
      { path: 'reset-password/:email', component: ResetPasswordComponent },
      { path: 'resend', component: ResendComponent }
    ])
  ],
  providers: [
    AppPaths,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
