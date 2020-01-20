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
  selector: 'app-billing-details',
  templateUrl: './billing-details.component.html',
  styleUrls: ['./billing-details.component.css']
})
export class BillingDetailsComponent implements OnInit {

  user_id;
  access_token;
  sessionStorage;
  site_settings;
  sub_profile_id;
  login_bg;
  active_plan;
  subscribed_plans;
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
      var login_bg = $.grep(this.site_settings, function(e){ return e.key == 'common_bg_image'; });

		    var bg_image = "";

		    if (login_bg.length == 0) {

		        console.log("not found");
		        
		    } else if (login_bg.length == 1) {

		      // access the foo property using result[0].foo

		      bg_image = login_bg[0].value;

		      if (bg_image != '' || bg_image != null || bg_image != undefined) {
		        
		      } else {

		        bg_image = '';

		      }

		    } else {

		      // multiple items found
		      bg_image = "";

		    }

        this.login_bg = bg_image;
        this.apiService.AcitvePlan({ id: this.user_id, token: this.access_token })
          .subscribe(data=>{
            if(data.success){
              this.active_plan = data;
            }
            else{
              UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
						  return false;
            }
          })
        
        this.apiService.SubscribedPlans({ id: this.user_id, token: this.access_token })
            .subscribe(data=>{
              if(data.success){
                this.subscribed_plans = data;
              }
              else{
                UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
                return false;
              }
            })
      }
    else{
      window.localStorage.setItem('logged_in', 'false');

			this.sessionStorage = {};
			
			localStorage.removeItem("sessionStorage");

			localStorage.clear();

			this.router.navigateByUrl('/');
    }
  }

  cancel_subscription = function(cancel_reason) {

    if(confirm('If you are cancelled your subscription, automatic renewal wont happen. Do you want to cancel your subscription ?')) {

      this.apiService.CancelSubscription({ id: this.user_id, token: this.access_token, cancel_reason: cancel_reason })
        .subscribe(data=>{
          if(data.success){
            UIkit.notify({message : data.message, timeout : 3000, pos : 'top-center', status : 'success'});

            setTimeout(function(){window.location.reload()}, 1000);
          }
          else{
            UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
            return false;
          }
        })

 
    }
  }

  enable_subscription = function() {

    if(confirm('Do you want to enable Auto subscription ?')) {
    
    this.apiService.AutoRenewalEnable({ id: this.user_id, token: this.access_token })
      .subscribe(data=>{
        if(data.success){
          UIkit.notify({message : data.message, timeout : 3000, pos : 'top-center', status : 'success'});
        }
        else{
          UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
          return false;
        }
      })
   
	  }
  }
  
  
}
