import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-okta-sign-in',
  templateUrl: './okta-sign-in.component.html',
  styleUrls: ['./okta-sign-in.component.css']
})
export class OktaSignInComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('okta-sign-in component initialized with component data', this.rendering);
  }
}
