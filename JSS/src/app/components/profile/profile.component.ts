import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { OktaAuthService, 
 // OktaCallbackComponent 
} from '@okta/okta-angular';
import 'rxjs/Rx';

interface Message {
  date: String,
  text: String
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  messages: Array<Message> [];
  accessToken : string;
  isAuthenticated: boolean;
  user: any;
  constructor(private oktaAuth: OktaAuthService
    ) {
    this.messages = [];
    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  async ngOnInit() {
    const aOktaPromise = await this.oktaAuth.getAccessToken();
    this.accessToken = aOktaPromise;
    const idToken = await this.oktaAuth.getIdToken();
    console.log(idToken)

    this.user = await this.oktaAuth.getUser();

    console.log(this.user);
  }
}
