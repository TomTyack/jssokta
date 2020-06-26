import { Component } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  isAuthenticated: boolean;

  constructor(public oktaAuth: OktaAuthService,public router: Router) {
    // Subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean)  => {
        this.isAuthenticated = isAuthenticated;
      }
    );
  }

  async ngOnInit() {
    // Get the authentication state for immediate use
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
  }

  login() {
    this.oktaAuth.loginRedirect(environment.okta.portalRoute);
  }

  loginEmbedded() {
    this.router.navigate([environment.okta.loginRoute]);
  }

  logout() {
    this.oktaAuth.logout(environment.okta.logoutRoute);
  }
}
