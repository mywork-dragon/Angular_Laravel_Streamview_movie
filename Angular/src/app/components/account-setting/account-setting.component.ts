import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppSettings } from '../../app-settings';
import { componentHostSyntheticProperty } from '@angular/core/src/render3';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AppGlobal } from 'src/app/app-global';
import { ActivatedRoute } from "@angular/router";
import { Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import {Title} from "@angular/platform-browser";

declare var $: any;
declare var UIkit: any;


@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {

  sessionStorage;
  user_id;
  access_token;
  site_settings;
  login_bg;
  id;
  sub_profile_id;
  login_by;
  profile;
  active_plan;
  subprofile;
  
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) { 
    this.titleService.setTitle(AppGlobal.title+' | Account')
  }

  ngOnInit() {

    this.sessionStorage = JSON.parse(localStorage.sessionStorage);

    this.user_id = (this.sessionStorage.user_id != '' && this.sessionStorage.user_id != undefined ) ? this.sessionStorage.user_id : false;

    this.access_token = (this.sessionStorage.access_token != undefined && this.sessionStorage.access_token != '') ? this.sessionStorage.access_token : '';
    
    this.site_settings = AppSettings.settings;
    if( this.user_id && this.access_token )
    {
        var login_bg = $.grep(this.site_settings, function(e){ return e.key == 'common_bg_image'; });

        var bg_image = "";

        if (login_bg.length == 0) {

        console.log("not found");
        
        } else if (login_bg.length == 1) {

                bg_image = login_bg[0].value;

               if (bg_image != '' || bg_image != null || bg_image != undefined) {
        
               } else {

                   bg_image = '';

               }

        } else {

        bg_image = "";

        }
        
        this.login_bg = bg_image;


        this.id = this.sessionStorage.user_id;
  
        this.sub_profile_id = this.route.snapshot.paramMap['params'].id;
  
        this.login_by = this.sessionStorage.login_by;

        $("#before_loader").show();

        this.apiService.getUserDetail({ id: this.sessionStorage.user_id, token: this.sessionStorage.access_token })
          .subscribe(data=>{
              if(data.success)
              {
                this.profile = data;console.log(this.profile);

                $("#before_loader").hide();

              }
              else
              {
                UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});

                return false;
                
              }
        });

        this.apiService.AcitvePlan({ id: this.sessionStorage.user_id, token: this.sessionStorage.access_token })
          .subscribe(data=>{

            if(data.success){
            
              this.active_plan = data.subscription;console.log(this.active_plan);

            }
            else{
              return false;              
            }
          });
          
        $("#before_loader").fadeIn();

        this.apiService.getSingleSubscription({ id: this.sessionStorage.user_id, token: this.sessionStorage.access_token, sub_profile_id: this.sub_profile_id })
         .subscribe(data=>{

            if(data.success){
           
              this.subprofile = data.data;

              $("#before_loader").fadeOut();
           
            }
            else{

              UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});

             return false;
             
            }
         });

        console.log(this.profile)
    }
    else{

      window.localStorage.setItem('logged_in', 'false');

			this.sessionStorage = {};
			
			localStorage.removeItem("sessionStorage");

			localStorage.clear();

      this.router.navigateByUrl('/');
      
    }
  }

  emailNotification = function(id) {

    var notification = $("#"+id).is(':checked');

    notification = notification ? 1 : 0;

    this.apiService.EmailNotification({ id: this.sessionStorage.user_id, token: this.sessionStorage.access_token })
      .subscribe(data=>{
          if(data.success){

            UIkit.notify({message : data.message, timeout : 3000, position : 'top-center', status : 'success'});

            return false;
          
          }
          else{

            return false;

          }
    });

  }

}
