import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AppSettings } from '../../app-settings';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  loadStatus: boolean;
  AppSettings;
  footerPages = {};
  alpages = {};
  facebook_link;
  linkedin_link;
  twitter_link;
  pinterest_link;
  google_plus_link;
  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.loadStatus = false;
    if (AppSettings.settings) {
      this.AppSettings = AppSettings.settings;
      this.facebook_link = AppSettings['facebook_link'];
      this.linkedin_link = AppSettings['linked_link'];
      this.twitter_link = AppSettings['twitter_link'];
      this.pinterest_link = AppSettings['pinterest_link'];
      this.google_plus_link = AppSettings['google_plus_link'];
      this.apiService.getAllPages().subscribe(data => {
        this.footerPages = (data);console.log(this.footerPages);
        this.alpages = this.footerPages[0];
        this.loadStatus = true;
      });
      
    }
  }

}
