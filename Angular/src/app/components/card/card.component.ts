import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppSettings } from '../../app-settings';
import { componentHostSyntheticProperty } from '@angular/core/src/render3';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AppGlobal } from 'src/app/app-global';
import { ActivatedRoute } from "@angular/router";
import { Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { subscribeOn } from 'rxjs/operators';
import { flushModuleScopingQueueAsMuchAsPossible } from '@angular/core/src/render3/jit/module';

declare var $: any;
declare var UIkit: any;

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  user_id;
  access_token;
  sessionStorage;
  sub_profile_id;
  site_settings;
  stripe_publishable_key;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sessionStorage = JSON.parse(localStorage.sessionStorage);
    this.site_settings = AppSettings.settings;
    this.sub_profile_id = this.route.snapshot.paramMap['params'].id;
    this.user_id = (this.sessionStorage['user_id'] != '' && this.sessionStorage['user_id'] != undefined ) ? this.sessionStorage['user_id'] : false;
    this.access_token = (this.sessionStorage['access_token'] != undefined && this.sessionStorage['access_token'] != '') ? this.sessionStorage['access_token'] : '';
    if (this.user_id && this.access_token) {
        var stripe_publishable_key = $.grep(this.site_settings, function(e){ return e.key == 'stripe_publishable_key'; });
        var stripe_publish_key = "";
        if (stripe_publishable_key.length == 0) {

          console.log("not found");
          
      } else if (stripe_publishable_key.length == 1) {
        stripe_publish_key = stripe_publishable_key[0].value;

        if (stripe_publish_key != '' || stripe_publish_key != null || stripe_publish_key != undefined) {
          
        } else {

          stripe_publish_key = '';

        }
      }
      else{
        stripe_publish_key = "";
      }
      this.stripe_publishable_key = stripe_publish_key;
      if (this.stripe_publishable_key) {
			//	Stripe.setPublishableKey(this.stripe_publishable_key);
        $('#payment-form').submit(function (e) {

          if ($('#stripeToken').length == 0)
          {
              var $form = $(this);

              // Disable the submit button to prevent repeated clicks
              $('#save_card_btn').attr('disabled', true);

              console.log($form);

            //  Stripe.card.createToken($form, stripeResponseHandler);

              // Prevent the form from submitting with the default action
              return false;
          }
      
      });
      }
    }
  }

}
