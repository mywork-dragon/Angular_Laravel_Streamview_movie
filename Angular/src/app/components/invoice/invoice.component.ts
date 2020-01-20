import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppSettings } from '../../app-settings';
import { componentHostSyntheticProperty } from '@angular/core/src/render3';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AppGlobal } from 'src/app/app-global';
import { ActivatedRoute } from "@angular/router";
import { Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';


declare var $: any;
declare var UIkit: any;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  sessionStorage;
  user_id;
  access_token;
  site_settings;
  site_name;
  login_bg;
  coupon_amount;
  coupon_code;
  plan;
  remaining_amount;
  original_coupon_amount;
  one_time_subscription;
  user_type;
  no_of_account;
  type_of_payment;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sessionStorage = JSON.parse(localStorage.sessionStorage);
    this.site_settings = AppSettings.settings;
    this.user_id = (this.sessionStorage.user_id != '' && this.sessionStorage.user_id != undefined ) ? this.sessionStorage.user_id : false;
		this.access_token = (this.sessionStorage.access_token != undefined && this.sessionStorage.access_token != '') ? this.sessionStorage.access_token : '';
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

	    

		    var site_name = $.grep(this.site_settings, function(e){ return e.key == 'site_name'; });

		    var name = "";

		    if (site_name.length == 0) {

		        console.log("not found");
		        
		    } else if (site_name.length == 1) {

		      // access the foo property using result[0].foo

		      name = site_name[0].value;

		      if (name != '' || name != null || name != undefined) {
		        
		      } else {

		        name = '';

		      }

		    } else {

		      // multiple items found
		      name = "";

		    }

		    this.site_name = name;


			this.user_id = (this.sessionStorage.user_id != undefined && this.sessionStorage.user_id != '') ? this.sessionStorage.user_id : '';

      this.access_token = (this.sessionStorage.access_token != undefined && this.sessionStorage.access_token != '') ? this.sessionStorage.access_token : '';
      
      var id = this.route.snapshot.paramMap['params'].id;

      this.apiService.PlanDetail({ id: this.user_id, token: this.access_token, plan_id: id })
        .subscribe(data=>{
          if(data.success){
            this.plan = data.data;
          }
          else{
            UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
            return false;
          }
        });

      this.coupon_amount = 0;

			this.coupon_code = "";

    }
    else{
      window.localStorage.setItem('logged_in', 'false');
      this.sessionStorage = {};
      localStorage.removeItem("sessionStorage");
      localStorage.clear();
      this.router.navigateByUrl('/');
    }
  }

  apply_coupon_subscription = function(coupon_code){

    if (coupon_code == undefined || coupon_code == '') {

      UIkit.notify({message : "Promo Code is required", timeout : 3000, pos : 'top-center', status : 'danger'});

      return false;

    }
    var id = this.route.snapshot.paramMap['params'].id;

    this.apiService.ApplyCouponSubscription({ id: this.user_id, token: this.access_token, subscription_id: id, coupon_code: coupon_code})
      .subscribe(data=>{
        
        if(data.success){console.log(data);

              this.remaining_amount = data.data.remaining_amount;

							this.coupon_amount = data.data.coupon_amount;

							this.coupon_code = coupon_code;

							$(".showPay").show();

							this.original_coupon_amount = data.data.original_coupon_amount;

        }
        else{

              this.coupon_amount = 0;

							this.coupon_code = "";

							this.remaining_amount = 0;

							$(".showPay").hide();

							this.original_coupon_amount = 0;						

							UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});

							return false;
        }
      })
  }

  sendToPaypal = function(id, amt) {

				
    this.type_of_payment = $("input[name='type_of_payment']:checked").val();
    
    if (this.coupon_code != '' && typeof(this.coupon_code) != undefined) {

      amt = this.remaining_amount;

    }
    if (confirm('Are you sure want to subscribe the plan ?')) {console.log('Are you sure want to subscribe the plan ?');console.log(amt);

      if (amt == 0) {console.log('adfdfdfdsffff')

        var data = new FormData;
        data.append('id', this.user_id);
        data.append('token', this.access_token);
        data.append('coupon_code', this.coupon_code);
        data.append('plan_id', id);
        $("#pay_now_subscription").html("Request Sending...");
				$("#pay_now_subscription").attr('disabled', true);
       
        this.apiService.ZeroPlan(data)
          .subscribe(data=>{
            if (data.success == true) {console.log('dfdfddf')

              this.sessionStorage.one_time_subscription = 1;

              this.sessionStorage.user_type = 1;

              this.sessionStorage.no_of_account = data.plan.no_of_account;

              this.sessionStorage.access_token = data.user.token; 

              this.one_time_subscription = this.sessionStorage.one_time_subscription;

              localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));

              UIkit.notify({message : "Successfully, subscribed to view videos", timeout : 3000, pos : 'top-center', status : 'success'});

              this.router.navigateByUrl('/subscription-success');

            } 
            else{
             
              UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
            }

            $("#pay_now_subscription").html("Pay Now");

            $("#pay_now_subscription").attr('disabled', false);
            
          });
      }
      else{
        if (this.type_of_payment == 1) {console.log(this.type_of_payment)
  
          if (this.coupon_code != '') {
  
            window.location.href=AppGlobal.apiBase+"paypal/"+id+'/'+this.user_id+'/'+this.coupon_code;
  
          } else {
  
            window.location.href=AppGlobal.apiBase+"paypal/"+id+'/'+this.user_id;
          }
  
        }
        else{
          this.apiService.StripePayment({ id: this.user_id, token: this.access_token, sub_profile_id: this.sub_profile_id, sub_scription_id: id, coupon_code: this.coupon_code })
            .subscribe(data=>{
              if(data.success){
                this.router.navigateByUrl('/subscription-success');
              }
              else{
                UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
                return false;
              }
            })
        }
      }
    }
   

  }

  changeCouponCode = function(input){
    this.coupon_code = input;
  }
}
