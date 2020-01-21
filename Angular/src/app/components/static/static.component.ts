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
  selector: 'app-writer',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.css']
})
export class StaticComponent implements OnInit {

  user_id;
  access_token;
  sessionStorage;
  site_settings;
  site_logo;
  login_bg;
  data;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.site_settings = AppSettings.settings;
	var login_bg = $.grep(this.site_settings, function(e){ return e == 'common_bg_image'; });
	login_bg = this.site_settings.common_bg_image;
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
		var site_logo = $.grep(this.site_settings, function(e){ return e == 'site_logo'; });
	    var logo = "";
	    if (site_logo.length == 0) {
	        console.log("not found");
	    } else if (site_logo.length == 1) {
	      logo = site_logo[0].value;
	      if (logo != '' || logo != null || logo != undefined) {
	      } else {
	        logo = '';
	      }
	    } else {
	      logo = "";
	    }
      this.site_logo = this.site_settings.site_logo;
      var id = this.route.snapshot.paramMap['params'].id;
      this.apiService.GetPage(id).subscribe(data=>{console.log(data);
          this.data = data;
      })
  }

}
