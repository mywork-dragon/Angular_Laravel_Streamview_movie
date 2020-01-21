import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppSettings } from '../../app-settings';
import { componentHostSyntheticProperty } from '@angular/core/src/render3';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AppGlobal } from 'src/app/app-global';
import { ActivatedRoute } from "@angular/router";
import { Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { subscribeOn } from 'rxjs/operators';
import { flushModuleScopingQueueAsMuchAsPossible } from '@angular/core/src/render3/jit/module';

declare var $: any;
declare var UIkit: any;

@Component({
  selector: 'app-paid-video',
  templateUrl: './paid-video.component.html',
  styleUrls: ['./paid-video.component.css']
})
export class PaidVideoComponent implements OnInit {

  user_id;
  access_token;
  sessionStorage;
  site_settings;
  sub_profile_id;
  paid_videos;
  profile;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sessionStorage = JSON.parse(localStorage.sessionStorage);
    this.site_settings = AppSettings.settings;
    this.sub_profile_id = this.route.snapshot.paramMap['params'].id;
    this.user_id = (this.sessionStorage['user_id'] != '' && this.sessionStorage['user_id'] != undefined ) ? this.sessionStorage['user_id'] : false;
    this.access_token = (this.sessionStorage['access_token'] != undefined && this.sessionStorage['access_token'] != '') ? this.sessionStorage['access_token'] : '';
    if (this.user_id && this.access_token) {
      this.apiService.PpvList({ id: this.user_id, token: this.access_token })
        .subscribe(data=>{
        if(data.success){
          console.log("pppppppppppppppppppppppppppppppppppp", data)
          this.paid_videos = data.data;
        }
        else{
          UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
          return false;
        }
      })
    }
    $("#before_loader").fadeIn();
    this.apiService.getSingleSubscription({ id: this.user_id, token: this.access_token, sub_profile_id: this.sub_profile_id })
      .subscribe(data=>{
        if(data.success){
          this.profile = data;
        }
        else{
          UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
          return false;
        }
        $("#before_loader").fadeOut();
      })
  }

}
