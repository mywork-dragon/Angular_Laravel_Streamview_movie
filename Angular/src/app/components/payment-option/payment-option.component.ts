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
  selector: 'app-payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.css']
})
export class PaymentOptionComponent implements OnInit {

  user_id;
  access_token;
  sessionStorage = {};
  sub_profile_id;
  user_type;
  site_settings;
  login_bg;
  video = {};
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.site_settings = AppSettings.settings;
    this.sessionStorage = JSON.parse(localStorage.sessionStorage);
    this.user_id = (this.sessionStorage['user_id'] != '' && this.sessionStorage['user_id'] != undefined) ? this.sessionStorage['user_id'] : false;
    this.access_token = (this.sessionStorage['access_token'] != undefined && this.sessionStorage['access_token'] != '') ? this.sessionStorage['access_token'] : '';

    if (this.user_id && this.access_token) {

      this.sub_profile_id = this.sessionStorage['sub_profile_id'];

      if (this.sessionStorage['user_type'] == 1) {

        var key = this.route.snapshot.paramMap['params'].id;
        this.sessionStorage['saved_subscription_video_id'] = key;
        localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));

        console.log('VideoId000000000000000000000000000000000000000000000000000000000000000000', key);
        this.watchCount(key);
        this.router.navigateByUrl('/pay-per-view/' + key);
        return false;

      }

      var login_bg = $.grep(this.site_settings, function (e) { return e.key == 'common_bg_image'; });

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

      var id = this.route.snapshot.paramMap['params'].id;

      console.log('VideoId', key);
      this.watchCount(key);

      this.apiService.getSingleVideo({ id: this.user_id, token: this.access_token, admin_video_id: id }).

        subscribe(data => {
          console.log('data', data);
          if (data.success) {

            this.video = data.video;

            this.sessionStorage['saved_subscription_video_id'] = this.route.snapshot.paramMap['params'].id;

            localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));

          }
          else {

            UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });

            return false;
          }
        })
      console.log('this.video', this.video);
    } else {

      window.localStorage.setItem('logged_in', 'false');

      this.sessionStorage = {};

      localStorage.removeItem("sessionStorage");

      localStorage.clear();

      this.router.navigateByUrl('/');

    }
  }

  watchCount(videoId) {
    this.apiService.setWatchCount({ id: this.user_id, token: this.access_token, admin_video_id: videoId }).
    subscribe(data => {
    })
  }

}
