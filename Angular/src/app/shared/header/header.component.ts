import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ActivatedRoute } from "@angular/router";
import {Title} from "@angular/platform-browser";
import { ApiService } from '../../services/api.service';
import { AppSettings } from '../../app-settings';
import { ElementRef} from '@angular/core';
import { AppGlobal } from '../../app-global';

declare var $: any;
declare var UIkit: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  AppSettings;
  ActiveCategories;
  loadStatus: boolean;
  sessionStorage = {};
  user_id;
  site_icon;
  access_token;
  site_logo;
  appSettingLoaded;
  sub_profile_id;
  user_picture;
  user_name;
  datas;
  sub_profile = {};
  profiles = [];
  notifications = [];
  notifications_count;
  search_key;
  logoutFnCalled;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {
    this.loadStatus = false;
    this.sessionStorage = JSON.parse(localStorage.getItem('sessionStorage'));
    //this.sub_profile = JSON.parse(localStorage.getItem('sub_profile'));
    
  }

  ngOnInit() {
    this.sessionStorage =  JSON.parse(localStorage.getItem('sessionStorage'));
    this.sub_profile_id = (this.sessionStorage['sub_profile_id'] != '' && this.sessionStorage['sub_profile_id'] != undefined ) ? this.sessionStorage['sub_profile_id'] : false;
    this.user_id = (this.sessionStorage['user_id'] != '' && this.sessionStorage['user_id'] != undefined ) ? this.sessionStorage['user_id'] : false;
    this.access_token = (this.sessionStorage['access_token'] != undefined && this.sessionStorage['access_token'] != '') ? this.sessionStorage['access_token'] : '';
    this.getAllsetting();
    this.sub_profile = JSON.parse(localStorage.getItem('sub_profile'));
    this.sub_profile_data(this.sessionStorage['sub_profile_id']);
    
    //this.notifications_method();console.log(this.notifications);
    this.apiService.notifications({ id: this.user_id, token: this.access_token, sub_profile_id: this.sub_profile_id})
      .subscribe(data=>{
        if(data.success){
          
          this.notifications = data.data;

          this.notifications_count = data.count;

        }
        else{
          UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });

          return false;
        }
      })
    //setTimeout(this.notifications_method, 5000);
    this.activeProfiles(this.sessionStorage['sub_profile_id']);
  }

  getAllsetting() { 
    this.apiService.getAppSettingInfo().subscribe(data => {
      this.AppSettings = data;
      this.appSettingLoaded = true;
      this.user_id = (this.sessionStorage['user_id'] != '' && this.sessionStorage['user_id'] != undefined) ? this.sessionStorage['user_id'] : false;
      this.access_token = (this.sessionStorage['access_token'] != undefined && this.sessionStorage['access_token'] != '') ? this.sessionStorage['access_token'] : '';

      if(this.user_id&&this.access_token){
        
         var site_logo = $.grep(this.AppSettings, function(e){ return e.key == "site_logo"; });
         var logo = "";
				if (site_logo.length == 0) {
					
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
        var site_icon = $.grep(this.AppSettings, function (e) { return e.key == 'site_icon'; });
				var icon = "";
				if (site_icon.length == 0) {


				} else if (site_icon.length == 1) {

					// access the foo property using result[0].foo

					icon = site_icon[0].	value;

					if (icon != '' || icon != null || icon != undefined) {

					} else {

						icon = '';

					}

				} else {

					// multiple items found
					icon = "";

        }
        this.site_icon = icon;
        this.user_id = (this.sessionStorage['user_id'] != '' && this.sessionStorage['user_id'] != undefined) ? true : false;
        if (!this.user_id) {

          this.router.navigateByUrl('/index');

        }
        var sub_profile_id = this.route.snapshot.params.id;
        if(sub_profile_id==undefined||sub_profile_id==""){
          this.sub_profile_id = this.sessionStorage['sub_profile_id'];
        }
        else{
          this.sessionStorage['sub_profile_id'] = sub_profile_id;
          this.sub_profile_id = this.sessionStorage['sub_profile_id'];
          localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));
        }
        this.user_picture = (this.sessionStorage['user_picture'] != '' && this.sessionStorage['user_picture'] != undefined) ? this.sessionStorage['user_picture'] : 'img/model3.jpg';

        this.user_name = (this.sessionStorage['user_name'] != '' && this.sessionStorage['user_name'] != undefined) ? this.sessionStorage['user_name'] : '';
        
        this.apiService.getSingleSubscription({id: this.sessionStorage['user_id'], token: this.sessionStorage['access_token'], sub_profile_id: this.sub_profile_id })

          .subscribe(data => {

            if(data.success){

                this.sub_profile = data.data;

                window.localStorage.setItem('sub_profile', JSON.stringify(data.data));}

            else {

              if (data.error_code == 101 || data.error_code == 103 || data.error_code == 104) {

                window.localStorage.setItem('logged_in', 'false');

                this.sessionStorage = {};

                localStorage.removeItem("sessionStorage");

                localStorage.clear();

                this.router.navigateByUrl('/index');

              } else {

                UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });
               
                this.router.navigateByUrl('/view-profile');
               
                return false;
               
              }
            
            }
          
          })

        this.activeProfiles(this.sub_profile_id);
      }
    });

      this.apiService.getActiveCategories({id: this.sessionStorage['user_id'], token: this.sessionStorage['access_token'] }).subscribe(data => {console.log(data)
        
        if(data.success){
        this.ActiveCategories = data.data[0];
        }
          this.loadStatus = true;
          if(!data.success){
            this.router.navigateByUrl('/index');
          }
    });
  }
 
  searchShow  () {
    // alert("showing");
    $('#header-section').slideUp();
    $('#top-search-section').slideDown();
  };

  hideSearch () {
    // alert("Hiding");
    $('#header-section').slideDown();
    $('#top-search-section').slideUp();
  };
 
  sub_profile_data = function (sub_profile_id) {

					var sub_profile_id = sub_profile_id ? sub_profile_id : this.sub_profile_id;
          this.apiService.getSingleSubscription({ id: this.sessionStorage.user_id, token: this.sessionStorage.access_token, sub_profile_id: sub_profile_id })
            .subscribe(data=>{
              if(data.success){
                this.sub_profile = data.data;
                window.localStorage.setItem('sub_profile', JSON.stringify(data.data));
              }
              else{
                if (data.error_code == 101 || data.error_code == 103 || data.error_code == 104) {

									window.localStorage.setItem('logged_in', 'false');

									this.sessionStorage = {};

									localStorage.removeItem("sessionStorage");

									localStorage.clear();

                 // this.router.navigateByUrl('/');

								} else {

									UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });
                  this.router.navigateByUrl('/view-profile');
									return false;

								}
              }
            }) 
   }
        

  activeProfiles = function (sub_profile_id) {

					var sub_profile_id = sub_profile_id ? sub_profile_id : this.sub_profile_id;
          this.apiService.getProfiles({id: this.sessionStorage.user_id, token: this.sessionStorage.access_token, sub_profile_id: sub_profile_id})
            .subscribe(data=>{
                if(data.success){
                  this.profiles = data.data;
                }
                else{
                  if (data.error_code == 101 || data.error_code == 103 || data.error_code == 104) {

                    window.localStorage.setItem('logged_in', 'false');
  
                    this.sessionStorage = {};
  
                    localStorage.removeItem("sessionStorage");
  
                    localStorage.clear();
  
                    
                    this.router.navigateByUrl('/index');
  
                  } else {
  
                    UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });
  
                    return false;
  
                  }
                }
            })
				
        }
        
  logout = function () {

					var details = {id:'', token:''};

					details.id = this.sessionStorage.user_id;

					details.token = this.sessionStorage.access_token;

					this.signoutAllDevice(details);
  }


  signoutAllDevice = function(data) {
    this.logoutFn();
  }

  logoutFn = function () {

    if (!this.logoutFnCalled) {

      this.apiService.Logout({id: this.sessionStorage.user_id, token: this.sessionStorage.access_token })
        .subscribe(data=>{
          if(data.success){
            window.localStorage.setItem('logged_in', 'false');

            this.sessionStorage = {};

            localStorage.removeItem("sessionStorage");

            localStorage.clear();

            UIkit.notify({ message: "Logged Out Successfully", status: 'success', timeout: 3000, pos: 'top-center' });

            this.logoutFnCalled = 1;

            this.router.navigateByUrl('/');
          }
          else{

            UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });

            return false;
          }
        })
    }

  };

 notifications_method = function() {
  setTimeout(()=>{
    this.apiService.notifications({ id: this.user_id, token: this.access_token, sub_profile_id: this.sub_profile_id})
      .subscribe(data=>{
        if(data.success){
          this.notifications = data.data;

          this.notifications_count = data.count;

        }
        else{
          UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });

          return false;
        }
      })
  }, 5000)
  }

  getSearchModel = function () {
    if (this.search_key != '' &&  this.search_key != undefined) {
      window.location.href = "/search/"+ this.search_key;
    } else {
      window.location.href = "/home/"+this.sessionStorage.sub_profile_id;
    }
  }

  changeSearch = function(data){
    this.search_key = data;
  }


  redNotification = function () {

    $.ajax({

      type: "post",

      url: AppGlobal.apiBase + "userApi/red-notifications",

      data: { id: this.user_id, token: this.access_token, sub_profile_id: this.sub_profile_id },

      async: false,

      success: function (data) {

        this.notifications_count = 0;

        if (data.error_code == 101 || data.error_code == 103 || data.error_code == 104) {

          window.localStorage.setItem('logged_in', 'false');

          this.sessionStorage = {};

          localStorage.removeItem("sessionStorage");

          localStorage.clear();

         this.router.navigateByUrl('/');


        }

      },
      error: function (data) {

        UIkit.notify({ message: 'Something Went Wrong, Please Try again later', timeout: 1000, pos: 'top-center', status: 'danger' });

      },
    });
  }


}
