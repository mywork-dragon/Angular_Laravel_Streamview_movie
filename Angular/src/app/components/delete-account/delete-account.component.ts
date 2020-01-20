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
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {

  sessionStorage;
  user_id;
  access_token;
  site_settings;
  login_by;
  login_bg;
  password;

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
      this.login_by = this.sessionStorage.login_by;
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

    }

    else{
      window.localStorage.setItem('logged_in', 'false');
      this.sessionStorage = {};
      localStorage.removeItem("sessionStorage");
      localStorage.clear();
      this.router.navigateByUrl('/');
    }
  }

  deleteAccount = function(){
    this.password = this.sessionStorage.login_by == 'manual' ? this.password : '';
    if( this.sessionStorage.login_by == 'manual') {
      if (this.password == '' || this.password == undefined) {
        UIkit.notify({message :"Please fill the password field", timeout : 3000, pos : 'top-center', status : 'danger'});
        return false;
      }
    }
      $("#before_loader").fadeIn();
      this.apiService.DeleteAccount({ id: this.user_id, token: this.access_token, password: this.password })
        .subscribe(data=>{
            if(data.success){
              UIkit.notify({message : data.message, timeout : 3000, pos : 'top-center', status : 'success'});
							window.localStorage.setItem('logged_in', 'false');
							this.sessionStorage = {};
							localStorage.removeItem("sessionStorage");
							localStorage.clear();
							this.router.navigateByUrl('/');
            }
            else{
              UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
              return false;
            }
            $("#before_loader").fadeOut();
        })
    }
}
