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
  selector: 'app-actor',
  templateUrl: './subscription-success.component.html',
  styleUrls: ['./subscription-success.component.css']
})
export class SubscriptionSuccessComponent implements OnInit {

  user_id;
  access_token;
  site_settings;
  sessionStorage;
  login_bg;
  video_id;
  admin_video_id;
  profile;
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
      
			this.login_bg = (this.site_settings) ? ((this.site_settings[47] != undefined) ? this.site_settings[47].value  : '' ): '';

			this.video_id = this.route.snapshot.paramMap['params'].id;

      this.admin_video_id = this.sessionStorage.saved_subscription_video_id > 0 ? this.sessionStorage.saved_subscription_video_id : '';
      
      this.apiService.getUserDetail({ id: this.user_id, token: this.access_token })
        .subscribe(data=>{
          if(data.success){
            this.profile = data;

						this.sessionStorage.access_token = data.token;

						this.sessionStorage.user_id = data.id;

						this.sessionStorage.user_type = data.user_type;

						this.sessionStorage.login_by = data.login_by;
						
						this.sessionStorage.user_picture = data.picture;

						this.sessionStorage.user_name = data.name;

						this.sessionStorage.sub_profile_id = data.sub_profile_id;

						this.sessionStorage.one_time_subscription = data.one_time_subscription;

						this.sessionStorage.saved_subscription_video_id = "";

						localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));

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

}
