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
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
user_id;
access_token;
title;
sessionStorage={};
items = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) { 
    this.titleService.setTitle(AppGlobal.title+' | Channel')
  }

  ngOnInit() {
    this.sessionStorage = JSON.parse(localStorage.sessionStorage);
    this.user_id = (this.sessionStorage['user_id'] != '' && this.sessionStorage['user_id'] != undefined ) ? this.sessionStorage['user_id'] : false;
    this.access_token = (this.sessionStorage['access_token'] != undefined && this.sessionStorage['access_token'] != '') ? this.sessionStorage['access_token'] : '';
    this.title = 'What are Premium Channels';

    if (this.user_id && this.access_token) {
      this.apiService.getAllChannels({id : this.sessionStorage['user_id'], token : this.sessionStorage['access_token']}).subscribe(data=>{
        if(data.success){
          this.items = data.channels;
        }
        else{
          UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
          return false;
        }
      })
      
    } else {
        window.localStorage.setItem('logged_in', 'false');
        this.sessionStorage = {};
        localStorage.removeItem("sessionStorage");
        localStorage.clear();
        this.router.navigateByUrl('/');
    }
  }

  openPopup = function(htmlPage, width, height){
		window.open('/video/'+htmlPage,"",'width=' + '1000px' + ', height=' + '650px' + ', top=' + '300px' + ', left=' + '700px');
 	};	

}
