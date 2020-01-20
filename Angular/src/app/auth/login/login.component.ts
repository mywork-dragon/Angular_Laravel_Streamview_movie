import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AppSettings } from '../../app-settings';
import {Title} from "@angular/platform-browser";
import { AppGlobal } from 'src/app/app-global';
declare var UIkit: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loadStatus: boolean;
  //private AppSettings: AppSettings[];
  private AppSettings;
  private footerPages;
  private loginBy = 'manual';
  private deviceType = 'web';
  private deviceToken = '123456';
  private email = '';
  private password = '';
  private sendData = {};
  private localSessionData = {};


  constructor(
    private apiService: ApiService,
    private router: Router,
    private titleService: Title
  ) { this.titleService.setTitle(AppGlobal.title+' | Login')}

  ngOnInit() {
    this.loadStatus = false;
    this.AppSettings = AppSettings.settings;
    this.apiService.getAppSettingInfo().subscribe(data => {
      
      //this.AppSettings = data;
      this.loadStatus = true;
    });
  }

  signin(formData) {
    this.email = formData.value.email;
    this.password = formData.value.password;
    this.sendData = {
      email: this.email,
      password: this.password,
      login_by: this.loginBy,
      device_type: this.deviceType,
      device_token: this.deviceToken
    };

    this.apiService.signIn(this.sendData).subscribe(res => {
      if (res.success) {
        this.localSessionData = {
          access_token: res.token,
          user_id: res.id,
          login_by: res.login_by,
          user_picture: res.picture,
          user_name: res.name,
          user_type: res.user_type,
          one_time_subscription: res.one_time_subscription,
          sub_profile_id: res.sub_profile_id
        };
        localStorage.setItem('logged_in', 'true');
        localStorage.setItem('sessionStorage', JSON.stringify(this.localSessionData));console.log(JSON.stringify(localStorage.sessionStorage))
        UIkit.notify({message : 'Your account has been successfully LoggedIn', timeout : 3000, pos : 'top-center', status : 'success'});
        this.router.navigateByUrl('/view-profiles');
      } else {
        UIkit.notify({message : res.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
      }
    });
  }

}
