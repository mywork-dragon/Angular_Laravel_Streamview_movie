import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AppSettings } from '../../../app-settings';
import {Title} from "@angular/platform-browser";
import { AppGlobal } from 'src/app/app-global';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  private logined: boolean;
  AppSettings;
  private loadStatus;
  private userDetails;
  sessionStorage;
  private profiles = [];
  private noOfAccount;
  user_id;
  access_token;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private titleService: Title
  ) {
    if (localStorage.getItem('logged_in') === 'false') {
      this.router.navigateByUrl('/signin');
    } else {
      this.logined = true;
      this.loadStatus = true;
      this.sessionStorage = JSON.parse(localStorage.getItem('sessionStorage'));
      this.noOfAccount = 0;
    }
    this.titleService.setTitle(AppGlobal.title+' | profile')
  }

  ngOnInit() {
    this.sessionStorage = JSON.parse(localStorage.sessionStorage);
    if (AppSettings.settings) {
      this.AppSettings = AppSettings.settings;
      this.apiService.getUserDetail({ id: this.sessionStorage.user_id, token: this.sessionStorage.access_token }).subscribe(res => {console.log(res)
        this.sessionStorage.access_token = res.token;
        this.sessionStorage.user_id = res.id;
        this.sessionStorage.user_type = res.user_type;
        this.sessionStorage.login_by = res.login_by;
        this.sessionStorage.user_picture = res.picture;
        this.sessionStorage.user_name = res.name;
        this.sessionStorage.sub_profile_id = res.sub_profile_id;
        this.sessionStorage.one_time_subscription = res.one_time_subscription;
       // localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));
      });
      this.getSubscription();
      this.getProfiles();
    }
  }

  getUserDetails() {
    this.apiService.getUserDetail(this.sessionStorage).subscribe(res => {console.log(res)
      this.sessionStorage.access_token = res.token;
      this.sessionStorage.user_id = res.id;
      this.sessionStorage.user_type = res.user_type;
      this.sessionStorage.login_by = res.login_by;
      this.sessionStorage.user_picture = res.picture;
      this.sessionStorage.user_name = res.name;
      this.sessionStorage.sub_profile_id = res.sub_profile_id;
      this.sessionStorage.one_time_subscription = res.one_time_subscription;
      localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));
    });
  }

  getSubscription() {
    this.apiService.getSubscription({ id: this.sessionStorage.user_id, token: this.sessionStorage.access_token }).subscribe(res => {console.log(res)
      if (res.success) {
        this.sessionStorage.noOfAccount = res.data;
        this.noOfAccount = res.data;
        //localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));
      }
    });
  }

  getProfiles() {
    this.apiService.getProfiles({ id: this.sessionStorage.user_id, token: this.sessionStorage.access_token }).subscribe(res => {console.log(res)
      if (res.success) {
        this.profiles = res.data;
        this.sessionStorage.active_profiles_length = res.data.length;
      //  localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));
        this.loadStatus = true;
      }
    });
  }
}
