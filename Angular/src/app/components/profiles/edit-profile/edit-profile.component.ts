import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from '../../../services/api.service';
import { AppSettings } from '../../../app-settings';
import { AppGlobal } from '../../../app-global';

declare var UIkit: any;
declare var jQuery: any;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  AppSettings;
  private loadStatus;
  private sessionStorage;
  private noOfAccount;
  private profile;
  reader: FileReader;
  file: File;
  private profileDetail = {
    imgsrc: '',
    id: '',
    token: '',
    sub_profile_id: ''
  };

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activateRouter: ActivatedRoute
  ) {
    if (localStorage.getItem('logged_in') === 'false') {
      this.router.navigateByUrl('/signin');
    } else {
      this.loadStatus = false;
      this.sessionStorage = JSON.parse(localStorage.getItem('sessionStorage'));
    }
  }

  ngOnInit() {
    this.sessionStorage = JSON.parse(localStorage.sessionStorage);
    this.profileDetail.imgsrc = AppGlobal.apiBase + 'placeholder.png';
    this.profileDetail.id = this.sessionStorage.user_id;
    this.profileDetail.token = this.sessionStorage.access_token;
    this.sessionStorage.profileId = this.activateRouter.snapshot.params.id;

    if (AppSettings.settings) {
      this.AppSettings = AppSettings.settings;
      this.apiService.getSingleSubscription({id: this.sessionStorage.user_id, token: this.sessionStorage.access_token, sub_profile_id: this.activateRouter.snapshot.params.id }).subscribe(res => {
        if (res.success) {console.log(res)
          this.profile = res.data;
        } else {
          UIkit.notify({message : res.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
        }
        this.loadStatus = true;
      });
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

  onEditProfile() {
    if (this.profile.name === '') {
      UIkit.notify({message : 'Name should not be an empty', timeout : 3000, pos : 'top-center', status : 'danger'});
    } else {
      const formData = new FormData();
      if (this.file !== undefined) {
        formData.append('picture', this.file);
      }
      formData.append('name', this.profile.name);
      formData.append('sub_profile_id', this.profile.id);
      formData.append('id', this.profileDetail.id);
      formData.append('token', this.profileDetail.token);
      this.apiService.sendProfileInfo(formData).subscribe(res => {
        if (res.success) {
          UIkit.notify({message : 'Successfully added profile into your account', timeout : 3000, pos : 'top-center', status : 'success'});
          this.router.navigateByUrl('/view-profiles');
        } else {
          UIkit.notify({message : res.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
        }
      });
    }
  }

  onDeleteProfile(profileId) {
    this.apiService.sendDeleteProfile(this.sessionStorage).subscribe(res => {
      console.log(res);
      if (res.success) {
        UIkit.notify({message : 'Successfully deleted profile from your account', timeout : 3000, pos : 'top-center', status : 'success'});
        this.router.navigateByUrl('/view-profiles');
      } else {
        UIkit.notify({message : res.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
      }
    });
  }

}
