import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { environment } from './../../../environments/environment';
import { OktaAuthService } from '@okta/okta-angular';
import { Router, NavigationStart } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-okta-sign-in',
  templateUrl: './okta-sign-in.component.html',
  styleUrls: ['./okta-sign-in.component.css']
})
export class OktaSignInComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  signIn;
  widget: any;
  isAuthenticated: boolean;
  router: Router;
  signInTitle: any;
  signInButtonText: any;
  constructor(oktaAuth: OktaAuthService, router: Router, private translate: TranslateService) { 

    if (typeof window === 'undefined') { // Service Side exit strategy
      return;
      // it's safe to use window now
    }
    
    this.signIn = oktaAuth;
    this.router = router;

    this.signIn.$authenticationState.subscribe(
      (isAuthenticated: boolean)  => this.isAuthenticated = isAuthenticated
    );
  }


  async ngOnInit() {
    if (typeof window === 'undefined') {
      return;
      // it's safe to use window now
    }

    this.isAuthenticated = await this.signIn.isAuthenticated();

    //const user = await this.signIn.getUser();
    if (this.isAuthenticated) {
      this.router.navigate([environment.okta.portalRoute]);
    } else {
      import('@okta/okta-signin-widget')
      .then((OktaSignIn) => {
        this.detectTranslationLoading(OktaSignIn, this.router);
      });
    }
  }

  private detectTranslationLoading(OktaSignIn: any, router) {
    this.translate.get('OKTA-primaryauth-title').subscribe((translated: string) => {
        console.log(translated);
    
        this.signInTitle = this.translate.instant('OKTA-primaryauth-title');
        this.signInButtonText = this.translate.instant('OKTA-primaryauth-submit');
        this.bootupSignin(OktaSignIn, this.router);
    });
  }

  private bootupSignin(OktaSignIn: any, router) {

    this.widget = new OktaSignIn({
      logo: '//logo.clearbit.com/jss.sitecore.com', // Try changing "okta.com" to other domains, like: "workday.com", "splunk.com", or "delmonte.com"
      language: 'en',                       // Try: [fr, de, es, ja, zh-CN] Full list: https://github.com/okta/okta-signin-widget#language-and-text
      i18n: {
        //Overrides default text when using English. Override other languages by adding additional sections.
        'en': {
          'primaryauth.title': this.signInTitle,   // Changes the sign in text
          'primaryauth.submit': this.signInButtonText,  // Changes the sign in button
          // More e.g. [primaryauth.username.placeholder,  primaryauth.password.placeholder, needhelp, etc.].
          // Full list here: https://github.com/okta/okta-signin-widget/blob/master/packages/@okta/i18n/dist/properties/login.properties
        }
      },
      baseUrl: environment.okta.baseDomain,
      authParams: {
        pkce: true
      }
    });


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

    this.injectWidgetPhase();
  }

  private injectWidgetPhase() {
    this.widget.renderEl({
      el: '#okta-signin-container'},
      (res) => {
        if (res.status === 'SUCCESS') {
          this.signIn.loginRedirect(environment.okta.portalRoute, { sessionToken: res.session.token });
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
