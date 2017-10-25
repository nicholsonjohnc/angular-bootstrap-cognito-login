import { AngularBootstrapCognitoLoginPage } from './app.po';

describe('angular-bootstrap-cognito-login App', () => {
  let page: AngularBootstrapCognitoLoginPage;

  beforeEach(() => {
    page = new AngularBootstrapCognitoLoginPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
