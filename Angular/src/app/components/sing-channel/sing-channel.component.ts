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
  selector: 'app-sing-channel',
  templateUrl: './sing-channel.component.html',
  styleUrls: ['./sing-channel.component.css']
})
export class SingChannelComponent implements OnInit {

  window_width;
  media_height;
  user_id;
  access_token;
  sessionStorage={};
  title;
  picture;
  description;
  videos = [];
  epdisode_slide_to_show = 6;
  epdisode_slide_to_scroll = 1;
  slideConfig;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) { this.titleService.setTitle(AppGlobal.title+' | channel') }

  ngOnInit() {
    $("#page_preloader").show();
    var show_count = 6;
    this.sessionStorage = JSON.parse(localStorage.getItem('sessionStorage'));

    if(this.sessionStorage == null){
      this.router.navigateByUrl('/');
      return false;
    }
    this.window_width = window.innerWidth;
    if(this.window_width > 1200){
        this.media_height = {
            "height": Math.round((this.window_width - 200)) / 6 * 1.5 + "px"
        }
        show_count = 6;
    }
    if( this.window_width>991 && this.window_width < 1200){
        this.media_height = {
            "height": Math.round((this.window_width - 200)) / 4 * 1.5 + "px"
        }
        show_count = 4;
    }
    if( this.window_width>768 && this.window_width < 991){
        this.media_height = {
            "height": Math.round((this.window_width - 150)) / 3 * 1.5 + "px"
        }
        show_count = 3;
    }
    if( this.window_width<768){
        this.media_height = {
            "height": Math.round((this.window_width - 100)) / 2 * 1.5 + "px"
        }
        show_count = 2;
    }

   $(window).bind('resize', function () {
        this.window_width = window.innerWidth;
        if(this.window_width > 1200){
            this.media_height = {
                "height": Math.round((this.window_width - 200)) / 6 * 1.5 + "px"
            }
            show_count = 6;
        }
        if( this.window_width>991 && this.window_width < 1200){
            this.media_height = {
                "height": Math.round((this.window_width - 250)) / 4 * 1.5 + "px"
            }
            show_count = 4;
        }
        if( this.window_width>768 && this.window_width < 991){
            this.media_height = {
                "height": Math.round((this.window_width - 200)) / 3 * 1.5 + "px"
            }
            show_count = 3;
        }
        if( this.window_width<768){
            this.media_height = {
                "height": Math.round((this.window_width - 150)) / 2 * 1.5 + "px"
            }
            show_count = 2;
        }
       // this.$apply();
    });
    this.slideConfig = {
      "slidesToShow": this.epdisode_slide_to_show, 
      "slidesToScroll": this.epdisode_slide_to_scroll,
      // "nextArrow":"<div class='nav-btn next-slide'></div>",
      // "prevArrow":"<div class='nav-btn prev-slide'></div>",
      "dots":false,
      "infinite": true
    };
    this.user_id = (this.sessionStorage['user_id'] != '' && this.sessionStorage['user_id'] != undefined ) ? this.sessionStorage['user_id'] : false;
    this.access_token = (this.sessionStorage['access_token'] != undefined && this.sessionStorage['access_token'] != '') ? this.sessionStorage['access_token'] : '';
    if (this.user_id && this.access_token) {
      console.log(this.sessionStorage['user_id'], this.sessionStorage['access_token'])
      // Get init data
      var key = this.route.snapshot.paramMap['params'].id;
      this.apiService.getSingleChannel({id : this.sessionStorage['user_id'], token : this.sessionStorage['access_token'], cid : key}).subscribe(data=>{
        if(data.success){
                  this.title = data.channel.name;console.log(this.title);
                  this.picture = data.channel.picture;console.log(this.picture);
                  this.description = data.channel.description;console.log(this.description);
                  var videos_all = data.channel.videos;console.log(videos_all)
                  var videos_s = [];
                  var videos_item = [];
                  var count = 1;
                  videos_all[0]&&videos_all[0].forEach(function(item) {
                      if(count % (show_count + 1) == 0){
                          videos_s.push(videos_item);
                          videos_item = [];
                          videos_item.push(item);
                          count = 1;
                      } else {
                          videos_item.push(item);
                      }
                      count++;
                  }, this);
                  videos_s.push(videos_item);
                 this.videos = videos_s;
                 $("#page_preloader").hide();
        }
      })
  }
  else{
    window.localStorage.setItem('logged_in', 'false');
    this.sessionStorage = {};
    localStorage.removeItem("sessionStorage");
    localStorage.clear();
    this.router.navigateByUrl('/');
  }

  }

  showVideoDrop = function (event, id, length) {
    $("#drop_" + id).show();
    $('#video_' + id).removeClass('transition-class');
    $('#' + id + "_img").addClass('active_img');
    $('#' + id + "_desc").hide();
    $('#' + id + "_div").addClass('play_icon_div');
};

  closeDiv = function (id) {
    $("#drop_" + id).fadeOut();
    $('#' + id + "_img").removeClass('active_img');
    $('#' + id + "_desc").show();
    $('#' + id + "_div").removeClass('play_icon_div');
  
}

// Event for Mouse Over
  hoverIn = function(event, id, length){
    var video_drop = $(".video-drop").is(":visible");
    if (!video_drop) {
        $('#video_' + id).addClass('transition-class');
    } else {
        $('#video_' + id).parent().find(".tile-media").removeClass("active_img");
        $("#drop_" + id).parent().find(".video-drop").hide();
        $("#drop_" + id).show();
        $('#' + id + "_img").addClass('active_img');
        $('#' + id + "_desc").hide();
        $('#' + id + "_div").addClass('play_icon_div');
    }
};

// Event for Mouse Out
  hoverOut = function (event, id, length) {
    var video_drop = $(".video-drop").is(":visible");
    if (video_drop) {
        $("#drop_" + id).show();
        //$('#' + id + "_img").removeClass('active_img');
        $('#' + id + "_desc").show();
        $('#' + id + "_div").removeClass('play_icon_div');
    }
    $('#video_' + id).removeClass('transition-class');
};

// Tab on Drop down
  dynamicContent = function (id, key) {
    $("#" + id + "_overview").removeClass('active');
    $("#" + id + "_episodes").removeClass('active');
    $("#" + id + "_trailers").removeClass('active');
    $("#" + id + "_more-like").removeClass('active');
    $("#" + id + "_details").removeClass('active');
    if (key == "overview") {
        $("#" + id + "_overview").addClass('active');
    } else if (key == "episodes") {
        $("#" + id + "_episodes").addClass('active');
    } else if (key == "trailers") {
        $("#" + id + "_trailers").addClass('active');
    } else if (key == "more-like") {
        $("#" + id + "_more-like").addClass('active');
    } else {
        $("#" + id + "_details").addClass('active');
    }
}

// Adding Wishlist
  addWishlist = function (id) {console.log(id);
    
      $("#my-list-txt_" + id).html(
          '<a class="my-list bold"><i class="fa fa-check fa-stack-1x my-list-icon"></i><span class="my-list-txt">Adding</span></a>'
      );
      this.apiService.AddWishList({
            id: this.user_id,
            token: this.access_token,
            admin_video_id: id,
            sub_profile_id:this.sub_profile_id
            
      }).subscribe(data=>{
        if(data.success){
          setTimeout(function () {
            $("#my-list-txt_" + id).html(
                '<a (click)="removeWishlist(' + data.wishlist_id + ', ' + id  + "'" + ')" class="my-list bold" id="remove-my-list-txt" style="cursor: pointer;">' +
                '<i class="fa fa-check my-list-icon"></i>' +
                '<span class="my-list-txt">My List</span>' +
                '</a>');
        }, 2000);
        }
        else{
          UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });
          return false;
        }
      })
}

// Remove from whislist
  removeWishlist = function (id, admin_video_id) {
    
    $("#my-list-txt_" + admin_video_id).html(
      '<a class="my-list bold"><i class="fa fa-plus fa-stack-1x fa-inverse padding2"></i><span class="my-list-txt">Removing</span></a>'
    );

    this.apiService.deleteWishlist({

      id: this.user_id,
      token: this.access_token,
      sub_profile_id:this.sub_profile_id,
      wishlist_id:admin_video_id
      
      }).subscribe(data=>{
       if(data.success){
        setTimeout(function () {
          $("#my-list-txt_" + admin_video_id).html(
              '<a (click)="addWishlist(' + admin_video_id + ')" class="my-list bold" style="cursor: pointer;">' +
              '<i class="fa fa-plus my-list-icon"></i>' +
              '<span class="my-list-txt">My List</span>' +
              '</a>'
          );
      }, 2000);
      }
      else{
        UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });
        return false;
      }
    })
}

  likeVideo = function (admin_video_id) {

    $("#like_" + admin_video_id).addClass('disabled_class');
    this.apiService.likeVideo({
      id: this.sessionStorage.user_id,
      token: this.sessionStorage.access_token,
      admin_video_id: admin_video_id,
      sub_profile_id: this.sessionStorage.sub_profile_id
    }).subscribe(data=>{console.log('likevideo',data);
      $("#like_" + admin_video_id).removeClass('disabled_class');
      if(data.success){
                $("#like_count_" + admin_video_id).html(data.like_count);
                $("#dis_like_count_" + admin_video_id).html(data.dislike_count);
                // setTimeout(function(){
                if (data.delete) {
                    // UIkit.notify({message : "We are very sorry you removed the video from like", timeout : 3000, pos : 'top-center', status : 'success'});
                    $("#dis_like_" + admin_video_id).show();
                    $("#dis_like_" + admin_video_id).removeClass('ng-hide');
                    $("#dis_like_" + admin_video_id).css('display', 'inline !important');
                } else {
                    // UIkit.notify({message : "I'm glad you liked the video", timeout : 3000, pos : 'top-center', status : 'success'});
                    $("#dis_like_" + admin_video_id).fadeOut(500);
                }
         }
        else{
          UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });
          return false;
        }
    });
}

  dislikeVideo = function (admin_video_id) {

    $("#dis_like_" + admin_video_id).addClass('disabled_class');
    this.apiService.dislikeVideo({
      id: this.sessionStorage.user_id,
      token: this.sessionStorage.access_token,
      admin_video_id: admin_video_id,
      sub_profile_id: this.sessionStorage.sub_profile_id
    }).subscribe(data=>{
      console.log('dislike video', data);
      $("#dis_like_" + admin_video_id).removeClass('disabled_class');
      if (data.success) {
          $("#like_count_" + admin_video_id).html(data.like_count);
          $("#dis_like_count_" + admin_video_id).html(data.dislike_count);
          // setTimeout(function(){
          if (data.delete) {
              // UIkit.notify({message : "I'm glad you removed the video from dislike", timeout : 3000, pos : 'top-center', status : 'success'});
              $("#like_" + admin_video_id).show(500);
              $("#like_" + admin_video_id).removeClass('ng-hide');
              $("#like_" + admin_video_id).css('display', 'inline !important');
          } else {
              // UIkit.notify({message : "You disliked the video", timeout : 3000, pos : 'top-center', status : 'warning'});
              $("#like_" + admin_video_id).fadeOut(500);
          }
          // }, 2000);
      } else {
          UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });
          return false;
      }
    })
};


openPopup = function(htmlPage, width, height){
  window.open('/video/'+htmlPage,"",'width=' + '1000px' + ', height=' + '650px' + ', top=' + '300px' + ', left=' + '700px');
 };	

 trailerPopup = function(htmlPage, width, height){
  window.open('/trailer_video/'+htmlPage,"",'width=' + '1000px' + ', height=' + '650px' + ', top=' + '300px' + ', left=' + '700px');
 };	
}