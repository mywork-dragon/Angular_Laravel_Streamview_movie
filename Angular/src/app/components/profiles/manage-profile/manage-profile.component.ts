import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AppSettings } from '../../../app-settings';

declare var UIkit: any;
declare var $: any;
@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.css']
})
export class ManageProfileComponent implements OnInit {

  AppSettings;
  loadStatus;
  sessionStorage;
  profiles;
  noOfAccount;
  user_id;
  access_token;
  sub_profile_id;
  site_settings;
  login_bg;
  site_logo;
  site_icon;
  site_name;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    if (localStorage.getItem('logged_in') === 'false') {
      this.router.navigateByUrl('/signin');
    } else {
      this.loadStatus = false;
      this.sessionStorage = JSON.parse(localStorage.getItem('sessionStorage'));
    }
  }

  ngOnInit() {

    this.sessionStorage = JSON.parse(localStorage.sessionStorage);
    this.site_settings = AppSettings.settings;console.log(this.site_settings);
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

		    
			var site_logo = $.grep(this.site_settings, function(e){ return e.key == 'site_logo'; });

		    var logo = "";

		    if (site_logo.length == 0) {

		        console.log("not found");
		        
		    } else if (site_logo.length == 1) {

		      // access the foo property using result[0].foo

		      logo = site_logo[0].value;

		      if (logo != '' || logo != null || logo != undefined) {
		        
		      } else {

		        logo = '';

		      }

		    } else {

		      // multiple items found
		      logo = "";

		    }

		    this.site_logo = logo;

		    var site_icon = $.grep(this.site_settings, function(e){ return e.key == 'site_icon'; });

		    var icon = "";

		    if (site_icon.length == 0) {

		        console.log("not found");
		        
		    } else if (site_icon.length == 1) {

		      // access the foo property using result[0].foo

		      icon = site_icon[0].value;

		      if (icon != '' || icon != null || icon != undefined) {
		        
		      } else {

		        icon = '';

		      }

		    } else {

		      // multiple items found
		      icon = "";

		    }

		    this.site_icon = icon;


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

      this.sub_profile_id = (this.sessionStorage.sub_profile_id != undefined && this.sessionStorage.sub_profile_id != '') ? this.sessionStorage.sub_profile_id : '';
      this.apiService.getProfiles({ id: this.user_id, token: this.access_token })
        .subscribe(data=>{
          if(data.success){
            this.profiles = data.data;console.log(data);
            this.sessionStorage.active_profiles_length = this.profiles.length;
						localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));
          }
          else{
            if(data.error != undefined && data.error != '') {
							UIkit.notify({message : data.error, timeout : 3000, pos : 'top-center', status : 'danger'});
							window.localStorage.setItem('logged_in', 'false');
							this.sessionStorage = {};
							localStorage.removeItem("sessionStorage");
							localStorage.clear();
  						this.router.navigateByUrl('/');
							return false;
						} else {
							UIkit.notify({message : data.message, timeout : 3000, pos : 'top-center', status : 'danger'});
							return false;
						}	
          }
        })

		} else {

			window.localStorage.setItem('logged_in', 'false');

			this.sessionStorage = {};
			
			localStorage.removeItem("sessionStorage");

			localStorage.clear();

			this.router.navigateByUrl('/');

		}

  }
}
