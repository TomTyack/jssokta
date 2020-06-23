import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import OktaSignIn from '@okta/okta-signin-widget';
import { environment } from './../../../environments/environment';
import { OktaAuthService } from '@okta/okta-angular';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-okta-sign-in',
  templateUrl: './okta-sign-in.component.html',
  styleUrls: ['./okta-sign-in.component.css']
})
export class OktaSignInComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  signIn;
  widget: any;
  constructor(oktaAuth: OktaAuthService, router: Router) { 

    if (typeof window === 'undefined') {
      return;
      // it's safe to use window now
    }
    this.widget = new OktaSignIn({
      baseUrl: environment.okta.baseDomain,
      authParams: {
        pkce: true
      }
    });

    this.signIn = oktaAuth;

    // Show the widget when prompted, otherwise remove it from the DOM.
    router.events.forEach(event => {
      if (event instanceof NavigationStart) {
        switch(event.url) {
          case environment.okta.loginRoute:
            break;
          case environment.okta.portalRoute:
            break;
          default:
            this.widget.remove();
            break;
        }
      }
    });
  }

  ngOnInit() {
    if (typeof window === 'undefined') {
      return;
      // it's safe to use window now
    }
    this.widget.renderEl({
      el: '#okta-signin-container'},
      (res) => {
        if (res.status === 'SUCCESS') {
          this.signIn.loginRedirect('/', { sessionToken: res.session.token });
          // Hide the widget
          this.widget.hide();
        }
      },
      (err) => {
        throw err;
      }
    );
  }
}
