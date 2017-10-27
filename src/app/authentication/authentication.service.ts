import { Injectable } from '@angular/core';
import * as AWS from "aws-sdk/global";
import { AuthenticationDetails, CognitoUserAttribute, ICognitoUserPoolData, ICognitoUserAttributeData, ICognitoUserData, ISignUpResult, CognitoUser, CognitoUserPool, CognitoUserSession } from "amazon-cognito-identity-js";
import * as STS from "aws-sdk/clients/sts";
import * as CognitoIdentity from "aws-sdk/clients/cognitoidentity";
import { v4 as uuid } from "uuid";

export interface AwsConf {
  region: string;
}

export interface CognitoConf {
  userPoolId: string;
  clientId: string;
  identityPoolId: string;
}

let awsConf: AwsConf = require("../../../aws.conf.json");
let cognitoConf: CognitoConf = require("../../../cognito.conf.json");

type CognitoIdentityCredentials = AWS.CognitoIdentityCredentials;
type LoginsMap = CognitoIdentity.LoginsMap;

@Injectable()
export class AuthenticationService {

  userPoolId: string = cognitoConf.userPoolId;
  clientId: string = cognitoConf.clientId;
  identityPoolId: string = cognitoConf.identityPoolId;

  poolData: ICognitoUserPoolData = {
    UserPoolId: this.userPoolId,
    ClientId: this.clientId
  };

  constructor() {

    AWS.config.region = awsConf.region;

  }

  // Create a user pool object.
  createUserPool(): CognitoUserPool {

    return new CognitoUserPool(this.poolData);

  }

  // Get current user from local storage.
  getCurrentUser(): CognitoUser {

    return this.createUserPool().getCurrentUser();

  }

  // Get identityId.
  getCognitoIdentity(): string {
    
    let cognitoCredentials: CognitoIdentityCredentials = <CognitoIdentityCredentials> AWS.config.credentials;
    return cognitoCredentials.identityId;

  }

  // Check if user is authenticated.
  isAuthenticated(callback: any): void {

    let cognitoUser: CognitoUser = this.getCurrentUser();

    // If exists, get session. Else pass false to callback.
    if (cognitoUser) {
      cognitoUser.getSession(this.isAuthenticatedGetSessionCallback.bind(this, callback));
    } else {
      callback(false);
    }

  }

  // isAuthenticated getSession callback function.
  isAuthenticatedGetSessionCallback(callback: any, error: any, session: any): void {

    // If error, pass false to callback. Else pass session validity to callback. 
    if (error) {
      callback(false);
    }
    else {
      callback(session.isValid());
    }

  }

  // Get jwt token.
  getJwtToken(callback: any): void {

    let cognitoUser: CognitoUser = this.getCurrentUser();

    // If exists, get session. Else pass null to callback.
    if (cognitoUser) {
        cognitoUser.getSession(this.getJwtTokenGetSessionCallback.bind(this, callback));
    }
    else {
        callback(null);
    }

  }

  // getJwtToken getSession callback function.
  getJwtTokenGetSessionCallback(callback: any, error: any, session: any): void {

    // If error, pass null to callback. 
    // Else if session valid, pass jwt token to callback. 
    // Else session is not valid, pass null to callback. 
    if (error) {
        callback(null);
    }
    else if (session.isValid()) {
        callback(session.getIdToken().getJwtToken());
    }
    else {
        callback(null);
    }

  }

  // Authenticate a user.
  authenticate(username: string, password: string, callback: any): void {

    // Create authentication details object.
    let authenticationData: any = {
      Username: username,
      Password: password,
    };
    let authenticationDetails: AuthenticationDetails = new AuthenticationDetails(authenticationData);

    // Create user pool object.
    let userPool: CognitoUserPool = this.createUserPool();

    // Create user object.
    let userData: ICognitoUserData = {
      Username: username,
      Pool: userPool
    };
    let cognitoUser: CognitoUser = new CognitoUser(userData);

    // Authenticate user.
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session: CognitoUserSession) => {
        this.authenticateCallback(callback, null, session);
      },
      onFailure: (error: any) => {
        this.authenticateCallback(callback, error, null);
      }
    });

  }

  // authenticate callback function.
  authenticateCallback(callback: any, error: any, session: CognitoUserSession): void {

    // If error, pass error to callback. Else build, set, and prime credentials object. 
    if (error) {
      callback(error);
    }
    else {
      this.initializeCognitoCredentials(session.getIdToken().getJwtToken(), callback);
    }

  }

  // Build and set credentials.  Prime AWS SDK.
  initializeCognitoCredentials(jwtToken: string, callback: any) {

    // Build credentials object.
    let credentials: CognitoIdentityCredentials = this.buildCognitoCredentials(jwtToken);

    // Set credentials object.
    AWS.config.credentials = credentials;

    (<CognitoIdentityCredentials> AWS.config.credentials).get(function(error) {
      if (error) {
        console.log(error);
      }
    });

    // Prime AWS SDK by making innocuous API call so that identityId gets injected into credentials object.
    let sts: STS = new STS();
    sts.getCallerIdentity(function (error: any, result: any) {
      callback(null);

      if(error){
        console.log('Error priming AWS sdk.', error);
      } else {
        console.log('AWS sdk primed.');
      }
    });

  }

  // Build cognito identity credentials object.
  buildCognitoCredentials(jwtToken: string): CognitoIdentityCredentials {

    let url: string = "cognito-idp." + AWS.config.region.toLowerCase() + ".amazonaws.com/" + this.userPoolId;
    let logins: LoginsMap = {};
    logins[url] = jwtToken;
    let params: any = {
      IdentityPoolId: this.identityPoolId,
      Logins: logins
    };
    let credentials: CognitoIdentityCredentials = new AWS.CognitoIdentityCredentials(params);
    return credentials;

  }




  // Signout user.
  signout() {

    this.getCurrentUser().signOut();

  }

  // Register a new user.
  registerUser(email: string, password: string, callback: any): void {

    // Create user pool object.
    let userPool: CognitoUserPool = this.createUserPool();

    // Create attribute list.
    let attributeList: CognitoUserAttribute[] = [];
    let dataEmail: ICognitoUserAttributeData = {
      Name: 'email',
      Value: email
    };
    let attributeEmail: CognitoUserAttribute = new CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    // Generate random username.
    let username: string = uuid();

    //Register user.
    userPool.signUp(username, password, attributeList, null, (error: Error, result: ISignUpResult) => {
      if (error) {
        callback(error.message, null);
      } else {
        callback(null, result);
      }
    });

  }

  // Confirm registration.
  confirmRegistration(username: string, confirmationCode: string, callback: any): void {

    // Create user pool object.
    let userPool: CognitoUserPool = this.createUserPool();

    // Create user object.
    let userData: ICognitoUserData = {
      Username: username,
      Pool: userPool
    };
    let cognitoUser: CognitoUser = new CognitoUser(userData);

    // Confirm registration.
    cognitoUser.confirmRegistration(confirmationCode, true, (error: any, result: any) => {
      if (error) {
        callback(error.message, null);
      } else {
        callback(null, result);
      }
    });

  }

  // Resend confirmation code.
  resendCode(username: string, callback: any): void {

    // Create user pool object.
    let userPool: CognitoUserPool = this.createUserPool();

    // Create user object.
    let userData: ICognitoUserData = {
      Username: username,
      Pool: userPool
    };
    let cognitoUser: CognitoUser = new CognitoUser(userData);

    // Resend code.
    cognitoUser.resendConfirmationCode((error: any, result: "SUCCESS") => {
      if (error) {
        callback(error.message, null);
      } else {
        callback(null, result);
      }
    });

  }

  // Forgot password step 1.
  forgotPassword(username: string, callback: any): void {

    // Create user pool object.
    let userPool: CognitoUserPool = this.createUserPool();

    // Create user object.
    let userData: ICognitoUserData = {
      Username: username,
      Pool: userPool
    };
    let cognitoUser: CognitoUser = new CognitoUser(userData);

    // Resend code.
    cognitoUser.forgotPassword({
      onSuccess: (data: any) => {
        callback(null, data);
      },
      onFailure: (error: any) => {
        callback(error.message, null);
      },
      inputVerificationCode(): void {
        callback(null, null);
      }
    });

  }

  // Forgot password step 2.
  confirmNewPassword(username: string, verificationCode: string, newPassword: string, callback: any): void {

    // Create user pool object.
    let userPool: CognitoUserPool = this.createUserPool();
      
    // Create user object.
    let userData: ICognitoUserData = {
      Username: username,
      Pool: userPool
    };
    let cognitoUser: CognitoUser = new CognitoUser(userData);
      
      // Confirm password.
      cognitoUser.confirmPassword(verificationCode, newPassword, {
          onSuccess: () => {
            callback(null, "SUCCESS");
          },
          onFailure: (error: any) => {
            callback(error.message, null);
          }
      });

  }




}
