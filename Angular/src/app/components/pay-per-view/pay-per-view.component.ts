import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppSettings } from '../../app-settings';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AppGlobal } from 'src/app/app-global';
import { ActivatedRoute } from "@angular/router";

declare var $: any;
declare var UIkit: any;

@Component({
  selector: 'app-pay-per-view',
  templateUrl: './pay-per-view.component.html',
  styleUrls: ['./pay-per-view.component.css']
})
export class PayPerViewComponent implements OnInit {

  sessionStorage = {};
  user_id;
  access_token;
  site_settings;
  login_bg;
  site_name;
  video = {};
  coupon_amount;
  coupon_code;
  remaining_amount;
  original_coupon_amount;
  type_of_payment;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.sessionStorage = JSON.parse(localStorage.sessionStorage);
    this.site_settings = AppSettings.settings;
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
      this.user_id = (this.sessionStorage['user_id'] != undefined && this.sessionStorage['user_id'] != '') ? this.sessionStorage['user_id'] : '';
      var id = this.route.snapshot.paramMap['params'].id;
      this.apiService.getSingleVideo({id : this.user_id, token : this.access_token, admin_video_id : id})
      .subscribe(data=>{
        if(data.success){
          this.video = data.video;
          var videos = data.video;
						if (data.pay_per_view_status) {

							UIkit.notify({message : 'Already you paid the amount for the particular video', timeout : 3000, pos : 'top-center', status : 'success'});
              // this.openPopup();
              this.router.navigateByUrl('/video/'+this.video['admin_video_id']);
            }
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
			
			window.localStorage.removeItem("sessionStorage");

			window.localStorage.clear();

			this.router.navigateByUrl('/');
    }
  }

  apply_coupon_ppv = function(coupon_code) {

    if (coupon_code == undefined || coupon_code == '') {

      UIkit.notify({message : "Promo Code is required", timeout : 3000, pos : 'top-center', status : 'danger'});

      return false;

    }

    var id = this.route.snapshot.paramMap['params'].id;
    
    this.apiService.ApplyCouponPpv( {id : this.user_id, token : this.access_token, admin_video_id : id, coupon_code : coupon_code})
    .subscribe(data=>{
      if(data.success){

          this.coupon_amount = data.data.coupon_amount;

          this.remaining_amount = data.data.remaining_amount;

          this.coupon_code = coupon_code;

          this.original_coupon_amount = data.data.original_coupon_amount;	

          $(".showPay").show();
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
    });
   
  }
  
  sendToPaypal = function(id) {

    this.type_of_payment = $("input[name='type_of_payment']:checked").val();

    var amt = 1;

    if (this.coupon_code != '' && typeof(this.coupon_code) != undefined) {

      amt = this.remaining_amount;

    }

    if (amt <= 0) {

      this.apiService.Payppv({ id: this.user_id, token: this.access_token, admin_video: id, coupon_code: this.coupon_code })
        .subscribe(data=>{
          $("#payment_ppv_button").html("Pay Now");

          $("#payment_ppv_button").attr('disabled', false);
          if(data.success){
            this.router.navigateByUrl('/pay-per-view-success/'+id);
          }
          else{
            
            UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});

            return false;
          }
        });

    } else {

      if (confirm('Are you sure want to proceed to see the video ?')) {

        $("#payment_ppv_button").html("Request Sending...");

        $("#payment_ppv_button").attr('disabled', true);

        if (this.type_of_payment == 1) {

          if (this.coupon_code != '') {

            window.location.href=AppGlobal.apiBase+"videoPaypal/"+id+'/'+this.user_id+'/'+this.coupon_code;

          } else {

            window.location.href=AppGlobal.apiBase+"videoPaypal/"+id+'/'+this.user_id;
          }


        } else {

          this.apiService.Stripeppv({ id: this.user_id, token: this.access_token, admin_video_id: id, coupon_code: this.coupon_code })
            .subscribe(data=>{
              $("#payment_ppv_button").html("Pay Now");

              $("#payment_ppv_button").attr('disabled', false);
              if(data.success){
                this.router.navigateByUrl('/pay_per_view_success'+id );
              }
              else{
                
                  UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});

                  return false;
              }
            })
        }

      } else {

        // $state.go('profile.home', {sub_profile_id : memoryStorage.sub_profile_id}, {reload:true});

      }

    }

  }

  openPopup = function(){
    window.open('/video/'+this.video['admin_video_id'],"",'width=' + '1000px' + ', height=' + '650px' + ', top=' + '300px' + ', left=' + '700px');
  };	

}
