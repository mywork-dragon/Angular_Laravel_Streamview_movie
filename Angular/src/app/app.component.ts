import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ApiService } from './services/api.service';
import { AppSettings } from './app-settings';
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  appSettingLoaded = false; // App init setting information
  layoutStatus: boolean; // Layout status for header
  loading = true; // Loading spinner

  userId: string;
  accessToken: string;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.appSettingLoaded = false;
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event)
    });
  }

  ngOnInit() {

    this.apiService.getAppSettingInfo().subscribe(data => {
      var BG_url = "";
      var Common_url = "";
      var middleData = [];
      data.map((value, key)=>{
        middleData[value.key] = value.value;
      })
      AppSettings.settings = middleData;
      BG_url = AppSettings.settings["home_page_bg_image"].replace('public/','');
      Common_url = AppSettings.settings["common_bg_image"].replace('public/','');
      AppSettings.settings["home_page_bg_image"] = BG_url;
      AppSettings.settings["common_bg_image"] = Common_url;
      this.appSettingLoaded = true;
    });
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true
    }
    if (event instanceof NavigationEnd) {
      this.layoutStatus = true;
      console.log(this.router.url);
      let URL = this.router.url;
      if(URL.includes('view-profiles')){
        this.layoutStatus = false;
      }
      if(URL.includes('manage-profiles')){
        this.layoutStatus = false;
      }
      if(URL.includes('edit-profile')){
        this.layoutStatus = false;
      }
      if(URL.includes('signin')){
        this.layoutStatus = false;
      }
      if(URL.includes('register')){
        this.layoutStatus = false;
      }
      if(this.router.url === '/') {
        this.layoutStatus = false;
      }
      this.loading = false
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false
    }
    if (event instanceof NavigationError) {
      this.loading = false
    }
  }

  checkAuth() {
    console.log(localStorage);
    if (localStorage.getItem('logged_in') && localStorage.getItem('logged_in') === 'true') {
      this.router.navigateByUrl('/view-profiles');
    } else {
      this.router.navigateByUrl('/');
    }
  }

  ngAfterViewInit() {
    console.log('App Loaded');
  }
}
