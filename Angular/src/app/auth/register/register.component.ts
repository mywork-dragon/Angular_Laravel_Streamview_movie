import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AppSettings } from '../../app-settings';
import {Title} from "@angular/platform-browser";
import { AppGlobal } from 'src/app/app-global';

declare var UIkit: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private AppSettings;
  private footerPages;
  private loginBy = 'manual';
  private deviceType = 'web';
  private deviceToken = '123456';
  private email = '';
  private password = '';
  private name = '';
  private sendData = {};
  private localSessionData = {};

  constructor(
    private apiService: ApiService,
    private router: Router,
    private titleService: Title
  ) { 
    this.titleService.setTitle(AppGlobal.title+' | Register')    
  }

  ngOnInit() {
    this.AppSettings = AppSettings.settings;
  }

  signup(formData){
    this.email = formData.value.email;
    this.password = formData.value.password;
    this.name = formData.value.name;
    this.sendData = {
      email: this.email,
      password: this.password,
      name: this.name,
      login_by: this.loginBy,
      device_type: this.deviceType,
      device_token: this.deviceToken
    }
  
      this.apiService.signUp(this.sendData).subscribe(res => {   
        if (res.success) {
          if(res.verification_control == 1)
          {
            UIkit.notify({message : 'Your account has been successfully Registered, Please Verify your email and Sign In', timeout : 3000, pos : 'top-center', status : 'success'});
            this.router.navigateByUrl('/signin');
          }
          else
          {
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
                localStorage.setItem('sessionStorage', JSON.stringify(this.localSessionData));
                UIkit.notify({message : 'Your account has been successfully Registered', timeout : 3000, pos : 'top-center', status : 'success'});
                this.router.navigateByUrl('/view-profiles');
          }
          
        } else {
          if(res.error_code != 3001)
            {
              UIkit.notify({message : res.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
              this.router.navigateByUrl('/signin');
            }
          else
          {
            UIkit.notify({message : "Your account has been successfully Registered, Please Verify your email and Sign In", timeout : 3000, pos : 'top-center', status : 'danger'});
            this.router.navigateByUrl('/signin');
          }
        }
      });
  };
}
