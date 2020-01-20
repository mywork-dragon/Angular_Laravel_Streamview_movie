import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Title} from "@angular/platform-browser";
import { ApiService } from '../../services/api.service';
import { AppSettings } from '../../app-settings';
import { AppGlobal } from 'src/app/app-global';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  AppSettings;
  loadStatus: boolean;
  sessionStorage;
  

  constructor(
    private apiService: ApiService,
    private router: Router,
    private titleService: Title
  ) {
    this.loadStatus = true;
    this.sessionStorage = JSON.parse(localStorage.getItem('sessionStorage'));
    this.titleService.setTitle(AppGlobal.title+' | Landing')
  }

  ngOnInit() {
    if (AppSettings.settings) {
      this.AppSettings = AppSettings.settings;
      this.loadStatus = true;  
    }
  }
}
