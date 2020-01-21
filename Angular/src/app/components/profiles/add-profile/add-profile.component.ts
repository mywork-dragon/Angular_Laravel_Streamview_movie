import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AppSettings } from '../../../app-settings';
import { AppGlobal } from '../../../app-global';

declare var UIkit: any;
declare var jQuery: any;

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.css']
})
export class AddProfileComponent implements OnInit {

  AppSettings;
  private loadStatus;
  private sessionStorage;
  private noOfAccount;
  reader: FileReader;
  file: File;

  private profileDetail = {
    imgsrc: '',
    id: '',
    token: '',
    sub_profile_id: '',
    name: ''
  };

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    if (localStorage.getItem('logged_in') === 'false') {
      this.router.navigateByUrl('/signin');
    } else {
      this.loadStatus = false;
      this.sessionStorage = JSON.parse(localStorage.getItem('sessionStorage'));
    }
  }

  ngOnInit() {
    if (this.sessionStorage.noOfAccount === this.sessionStorage.active_profiles_length) {
      UIkit.notify({
        message: 'Already you added ' + this.sessionStorage.active_profiles_length
        + ' profiles in your account. If you want more subscribe and get to Add More Profile.',
        timeout: 3000, pos: 'top-center', status: 'warning'
      });
      this.router.navigateByUrl('/view-profiles');
    } else {
      this.profileDetail.imgsrc = AppGlobal.apiBase + 'placeholder.png';
      this.profileDetail.id = this.sessionStorage.user_id;
      this.profileDetail.token = this.sessionStorage.access_token;
      if (AppSettings.settings) {
        this.AppSettings = AppSettings.settings;
        this.loadStatus = true;
      }
    }
  }

  openBrowse() {
    jQuery('#picture').click();
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.reader = new FileReader();
      this.reader.onload = (ev: any) => {
        document.getElementById('preview_picture').setAttribute('src', ev.target.result);
      };
      this.reader.readAsDataURL(this.file);
    }
  }

  onAddProfile() {
    if (this.profileDetail.name === '') {
      UIkit.notify({message : 'Name should not be an empty', timeout : 3000, pos : 'top-center', status : 'danger'});
    } else {
      const formData = new FormData();
      if (this.file !== undefined) {
        formData.append('picture', this.file);
      }
      formData.append('name', this.profileDetail.name);
      formData.append('id', this.profileDetail.id);
      formData.append('token', this.profileDetail.token);
      console.log(this.file);
      this.apiService.addNewProfile(formData).subscribe(res => {
        if (res.success) {
          UIkit.notify({message : 'Successfully added profile into your account', timeout : 3000, pos : 'top-center', status : 'success'});
          this.router.navigateByUrl('/view-profiles');
        } else {
          UIkit.notify({message : res.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
        }
      });
    }
  }

}
