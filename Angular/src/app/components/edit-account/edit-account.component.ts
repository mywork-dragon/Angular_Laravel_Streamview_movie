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
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {

  sessionStorage;
  user_id;
  access_token;
  site_settings;
  login_bg;
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
    if (this.user_id && this.access_token) 
     {
      var login_bg = $.grep(this.site_settings, function(e){ return e.key == 'common_bg_image'; });
      var bg_image = "";
      if (login_bg.length == 0)
      {
        console.log('not found');
      } 
      else if (login_bg.length == 1) 
      {
        bg_image = login_bg[0].value;
        if (bg_image != '' || bg_image != null || bg_image != undefined)
         {} 
        else 
        {
          bg_image = '';
        }
      } 
      else 
      {
        bg_image = "";
      }

      this.login_bg = bg_image;
      $("#before_loader").show();
      this.apiService.getUserDetail({ id: this.user_id, token: this.access_token })
        .subscribe(data=>{
            if(data.success){
              this.profile = data;
              $("#before_loader").hide();
            }
            else
            {
              UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
              return false;
            }
        });
    }
    else
    {
      window.localStorage.setItem('logged_in', 'false');

			this.sessionStorage = {};
			
			localStorage.removeItem("sessionStorage");

			localStorage.clear();

			this.router.navigateByUrl('/');
    }
  }

  editProfile = function() {

    $("#before_loader").fadeIn();console.log(this.user_id, this.access_token, this.profile)
    this.apiService.UpdateProfile({ id: this.user_id, token: this.access_token, email: this.profile.email, name: this.profile.name, mobile: this.profile.mobile, device_token: '123456'})
      .subscribe(data=>{
        if(data.success){
          UIkit.notify({message : "Your account has been successfully updated", timeout : 3000, pos : 'top-center', status : 'success'});
          this.router.navigateByUrl('/account-setting/'+this.sessionStorage.sub_profile_id);
        }
        else
        {
          UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
          return false;
        }
      });
  
  }

  onInputNameUpdate = function(input) {
    this.profile.name = input
    console.log(input);
  }

  onInputEmailUpdate = function(input) {
    this.profile.email = input
    console.log(input);
  }

  onInputMobileUpdate = function(input) {
    this.profile.mobile = input
    console.log(input);
  }
}
