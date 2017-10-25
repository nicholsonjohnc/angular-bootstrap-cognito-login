import { Injectable } from '@angular/core';

@Injectable()
export class AppPaths {

    signin: string = "/signin";
    signup: string = "/signup";
    confirm: string = "/confirm";
    forgotPassword: string = "/forgot-password";
    resend: string = "/resend";
    resetPassword: string = "/reset-password";
    signout: string = "/signout";
    secure: string = "/secure";

    constructor() { }

}