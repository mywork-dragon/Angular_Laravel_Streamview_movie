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
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  sessionStorage;
  user_id;
  access_token;
  site_settings;
  one_time_subscription;
  login_bg;
  subscriptions;

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
      var bg_image = "";
      
      var login_bg = $.grep(this.site_settings, function(e){ return e.key == 'common_bg_image'; });
      
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
      this.one_time_subscription = this.sessionStorage.one_time_subscription;console.log(this.one_time_subscription)
      this.subscription_index();
    }
    else{
      window.localStorage.setItem('logged_in', 'false');
      this.sessionStorage = {};
      localStorage.removeItem("sessionStorage");
      localStorage.clear();
      this.router.navigateByUrl('/');
    }
  }

  subscription_index = function(){
    this.subscriptions = [];
    $("#before_loader").fadeIn();
    var data = new FormData;
    data.append('id', this.user_id);
    data.append('token', this.access_token);
    this.apiService.SubscriptionIndex(data)
      .subscribe(data=>{
        if(data.success){
          this.subscriptions = data.data;console.log(this.subscriptions);
        }
        else{

          if (data.error_code == 101) {

            this.router.navigateByUrl('/');

          } else {

            UIkit.notify({message: 'Something Went wrong, Please try again later', status : 'danger', pos : 'top-center', timeout : 5000});
          }
        }
        $("#before_loader").fadeOut();
      });

  }

}
