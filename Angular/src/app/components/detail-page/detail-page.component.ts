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

declare var $: any;
declare var UIkit: any;

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css']
})
export class DetailPageComponent implements OnInit {

window_width;
media_height;
epdisode_slide_to_show;
epdisode_slide_to_scroll;
sessionStorage = {};
user_id;
access_token;
user_type;
title;
spam_reasons;
slideConfig;
datas = [];
id;
display;
show_count;
geners = [];
total;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  
    this.sessionStorage = JSON.parse(localStorage.sessionStorage);
    this.window_width = window.innerWidth;
      var show_count = 6;
      this.show_count = 6;
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
				this.show_count = show_count;
			//	this.$apply();
			});

			if (this.window_width > 991) {
				this.epdisode_slide_to_show = 4;
				this.epdisode_slide_to_scroll = 4;
			}

			if (this.window_width > 767 && this.window_width < 992) {
				this.epdisode_slide_to_show = 3;
				this.epdisode_slide_to_scroll = 3;
			}

			if (this.window_width > 479 && this.window_width < 768) {
				this.epdisode_slide_to_show = 2;
				this.epdisode_slide_to_scroll = 2;
			}

			if (this.window_width < 480) {
				this.epdisode_slide_to_show = 1;
				this.epdisode_slide_to_scroll = 1;
      }

      this.slideConfig = {
        "slidesToShow": this.epdisode_slide_to_show, 
        "slidesToScroll": this.epdisode_slide_to_scroll,
        // "nextArrow":"<div class='nav-btn next-slide'></div>",
        // "prevArrow":"<div class='nav-btn prev-slide'></div>",
        "dots":false,
        "infinite": true
      };
      this.user_id = (this.sessionStorage['user_id'] != undefined && this.sessionStorage['user_id'] != '') ? this.sessionStorage['user_id'] : '';
      this.access_token = (this.sessionStorage['access_token'] != undefined && this.sessionStorage['access_token'] != '') ? this.sessionStorage['access_token'] : '';
      

      if (this.user_id && this.access_token) {
      //	$anchorScroll();
        this.title = this.route.snapshot.paramMap['params'].title;console.log('parameter',this.title);
        this.id = this.route.snapshot.paramMap['params'].id;console.log('parameter',this.id);
        this.user_type = (this.sessionStorage['user_type'] == undefined || this.sessionStorage['user_type'] == 0) ? true : false;console.log(this.user_type);
       
        this.apiService.spamReasons().subscribe(data=>{
          if(data.success){
            this.spam_reasons = data.data;console.log('spamReasons', this.spam_reasons);
          }
          else{
            return false;
          }
        });

        $(window).scroll(function () {

					if ($(window).scrollTop() == $(document).height() - $(window).height()) {console.log('ddddd'+ $(window).height());
            // ajax call get data from server and append to the div
            setTimeout(function(){
              $("#load_more_details").click();
            }, 5000)
              
              console.log('click number');
					}
        });
        $("#page_preloader").show();
        this.detailsFn(0, 12);
        $("#page_preloader").hide();
        
        console.log('this is data!!!', this.datas);
			
      }
        else{
          window.localStorage.setItem('logged_in', 'false');

          this.sessionStorage = {};

          localStorage.removeItem("sessionStorage");

          localStorage.clear();

          this.router.navigateByUrl('/');

        }
  }

  detailsFn = function (skip, take) {
    $("#data_loader").show();
    
      var data = new FormData;
      data.append('id', this.sessionStorage.user_id);
      data.append('token', this.sessionStorage.access_token);
      data.append('sub_profile_id', this.sessionStorage.sub_profile_id);
      data.append('key', this.title);
      data.append('skip', skip);
      data.append('take', take);

      if(this.id){
        data.append('cate_id', this.id);
      }
      this.apiService.getDetails(data).subscribe(data=>{
        if(data.success){
          this.geners = data.sub_category;
          var videos_all = [];
          videos_all = data.data;
          var videos_s = [];
          var videos_item = [];
          var count = 1;console.log('row count', this.show_count);
          videos_all[0] &&videos_all[0].forEach(function(item) {
            if(count % (this.show_count + 1) == 0){
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
      
          if(videos_s[0].length > 0) {
            this.display = true;
          } else {
            this.display = false;
          }
          if (Object.keys(data.data).length > 0) {
            this.title = data.title;
            if (Object.keys(this.datas).length > 0) {
              this.datas = $.merge(this.datas, videos_s);console.log('this is data!!!', this.datas);
            } else {
              this.datas = videos_s;console.log('this is le!!!', this.datas);
            }
            
          }
          $("#data_loader").hide();
         
        }
        else{
          UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });
          this.router.navigateByUrl('/');
          return false;
        }
      })
    }
  addWishlist = function (id, index, key) {

      $("#my-list-txt_" + index + "_" + key).html('<a class="my-list bold"><i class="fa fa-check fa-stack-1x my-list-icon"></i><span class="my-list-txt">Adding</span></a>');
      this.apiService.AddWishList({id:this.sessionStorage.user_id, token: this.sessionStorage.access_token, admin_video_id: id, sub_profile_id: this.sessionStorage.sub_profile_id})
        .subscribe(data=>{
          if(data.success){
            setTimeout(function () {

              $("#my-list-txt_" + index + "_" + key).html('<a (click)="removeWishlist(' + data.wishlist_id + ', ' + id + ', ' + index + ', ' + "'" + key + "'" + ')" class="my-list bold" id="remove-my-list-txt" style="cursor: pointer;">' +
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

  closeDiv = function (index, key) {
      $("#" + index + "_" + key + "_video_drop").fadeOut();
      $('#' + index + "_" + key + "_img").removeClass('active_img');
      $('#' + index + "_" + key + "_desc").show();
      $('#' + index + "_" + key + "_div").removeClass('play_icon_div');
    }

  removeWishlist = function (id, admin_video_id, index, key) {

    $("#my-list-txt_" + index + "_" + key).html('<a class="my-list bold"><i class="fa fa-plus fa-stack-1x fa-inverse padding2"></i><span class="my-list-txt">Removing</span></a>');

    this.apiService.deleteWishlist({id: this.sessionStorage.user_id, token: this.access_token, wishlist_id: admin_video_id, sub_profile_id: this.sessionStorage.sub_profile_id })
      .subscribe(data=>{
        if(data.success){console.log('deleteWishlist', data);
          setTimeout(function () {

            $("#my-list-txt_" + index + "_" + key).html('<a (click)="addWishlist(' + admin_video_id + ', ' + index + ', ' + "'" + key + "'" + ')" class="my-list bold" style="cursor: pointer;">' +
              '<i class="fa fa-plus my-list-icon"></i>' +
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

  likeVideo = function (admin_video_id, index, key) {

      $("#like_" + index + "_" + key).addClass('disabled_class');
      this.apiService.likeVideo({ id: this.sessionStorage.user_id, token: this.sessionStorage.access_token, admin_video_id: admin_video_id, sub_profile_id: this.sessionStorage.sub_profile_id })
        .subscribe(data=>{
          $("#like_" + index + "_" + key).removeClass('disabled_class');
          if(data.success){
            $("#like_count_" + index + "_" + key).html(data.like_count);
            $("#dis_like_count_" + index + "_" + key).html(data.dislike_count);
            // setTimeout(function(){
            if (data.delete) {
              // UIkit.notify({message : "We are very sorry you removed the video from like", timeout : 3000, pos : 'top-center', status : 'success'});
              $("#dis_like_" + index + "_" + key).show();
              $("#dis_like_" + index + "_" + key).removeClass('ng-hide');
              $("#dis_like_" + index + "_" + key).css('display', 'inline !important');
            } else {
              // UIkit.notify({message : "I'm glad you liked the video", timeout : 3000, pos : 'top-center', status : 'success'});
              $("#dis_like_" + index + "_" + key).fadeOut(500);
            }
          }
          else{
            UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });
            return false;
          }
        })
    }
    
  dislikeVideo = function (admin_video_id, index, key) {
    
      $("#dis_like_" + index + "_" + key).addClass('disabled_class');
      this.apiService.dislikeVideo({ id: this.sessionStorage.user_id, token: this.sessionStorage.access_token, admin_video_id: admin_video_id, sub_profile_id: this.sessionStorage.sub_profile_id })
        .subscribe(data=>{
          $("#dis_like_" + index + "_" + key).removeClass('disabled_class');
          if(data.success){
            $("#like_count_" + index + "_" + key).html(data.like_count);
            $("#dis_like_count_" + index + "_" + key).html(data.dislike_count);
            // setTimeout(function(){
            if (data.delete) {
              // UIkit.notify({message : "I'm glad you removed the video from dislike", timeout : 3000, pos : 'top-center', status : 'success'});
              $("#like_" + index + "_" + key).show(500);
              $("#like_" + index + "_" + key).removeClass('ng-hide');
              $("#like_" + index + "_" + key).css('display', 'inline !important');
            } else {
              // UIkit.notify({message : "You disliked the video", timeout : 3000, pos : 'top-center', status : 'warning'});
              $("#like_" + index + "_" + key).fadeOut(500);
            }
          }
          else{
            UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });
            return false;
          }
        })
    }

  spamVideo = function (admin_video_id, index, key) {

      if (confirm('Are you sure want to spam the video ?')) {

        var reason = $('input[name=reason]:checked').val();
        this.apiService.AddSpam({ id: this.sessionStorage.user_id, token: this.sessionStorage.access_token, admin_video_id: admin_video_id, sub_profile_id: this.sessionStorage.sub_profile_id, reason: reason })
          .subscribe(data=>{
            if(data.success){

              UIkit.notify({ message: "You have marked the video as spam, the video won't appear anywhere except spam videos section", timeout: 3000, pos: 'top-center', status: 'success' });

              window.location.reload();
            }
            else{

              UIkit.notify({ message: data.error_messages, timeout: 5000, pos: 'top-center', status: 'danger' });

              return false;
            }
          });

      }

    }
    
  showVideoDrop = function (event, idx, key) {
      $("#" + idx + "_" + key + "_video_drop").show();
      $('#' + idx + "_" + key).removeClass('transition-class');
      $('#' + idx + "_" + key + "_img").addClass('active_img');
      $('#' + idx + "_" + key + "_desc").hide();
      $('#' + idx + "_" + key + "_div").addClass('play_icon_div');
    };

  hoverIn = function (event, id, key, length) {
    //$(".video-drop").hide();
    var video_drop = $(".video-drop").is(":visible");
    if (!video_drop) {
      $('#' + id + "_" + key).addClass('transition-class');
      /*
      var n_w = $('#' + id + "_" + key).width();
      var added_w = n_w * 0.4 / 2;
      if($('#' + id + "_" + key).prev().length > 0){
        $('#' + id + "_" + key).prev().css('margin-right', added_w + 'px');
        $('#' + id + "_" + key).css('margin-left', '-' + added_w + 'px');
      }
      if($('#' + id + "_" + key).next().length > 0){
        $('#' + id + "_" + key).next().css('margin-left', added_w + 'px');
        $('#' + id + "_" + key).css('margin-right', added_w + 'px');
      }
      */
    } else {
      for (var i = 0; i < length; i++) {
        $("#" + i + "_" + key + "_video_drop").hide();
        $('#' + i + "_" + key + "_img").removeClass('active_img');
        $('#' + i + "_" + key + "_desc").show();
        $('#' + i + "_" + key + "_div").removeClass('play_icon_div');
      }
      $('#' + id + "_" + key + "_img").addClass('active_img');
      $("#" + id + "_" + key + "_video_drop").show();
      $('#' + id + "_" + key + "_desc").hide();
      $('#' + id + "_" + key + "_div").addClass('play_icon_div');
    }
  };

  hoverOut = function (event, id, key, length) {
    var video_drop = $(".video-drop").is(":visible");
    if (video_drop) {
      for (var i = 0; i < length; i++) {
        $("#" + i + "_" + key + "_video_drop").hide();
        $('#' + i + "_" + key + "_img").removeClass('active_img');
        $('#' + i + "_" + key + "_desc").show();
        $('#' + i + "_" + key + "_div").removeClass('play_icon_div');
      }
      $('#' + id + "_" + key + "_img").addClass('active_img');
      $("#" + id + "_" + key + "_video_drop").show();
      $('#' + id + "_" + key + "_desc").hide();
      $('#' + id + "_" + key + "_div").addClass('play_icon_div');
    }
    $('#' + id + "_" + key).removeClass('transition-class');
  };

  dynamicContent = function (index, key, id) {
    $("#" + index + "_" + key + "_overview").removeClass('active');
    $("#" + index + "_" + key + "_episodes").removeClass('active');
    $("#" + index + "_" + key + "_trailers").removeClass('active');
    $("#" + index + "_" + key + "_more-like").removeClass('active');
    $("#" + index + "_" + key + "_details").removeClass('active');
    if (id == "overview") {
      $("#" + index + "_" + key + "_overview").addClass('active');
    } else if (id == "episodes") {
      $("#" + index + "_" + key + "_episodes").addClass('active');
    } else if (id == "trailers") {
      $("#" + index + "_" + key + "_trailers").addClass('active');
    } else if (id == "more-like") {
      $("#" + index + "_" + key + "_more-like").addClass('active');
    } else {
      $("#" + index + "_" + key + "_details").addClass('active');
    }
    $(".episode-slider").not('.slick-initialized').slick({
      slidesToShow: this.epdisode_slide_to_show,
      slidesToScroll: this.epdisode_slide_to_scroll,
    });
    $(".episode-slider").slick('setPosition');
  }

  ShowGeners = function(){
    if(!$("#geners_menu").hasClass("active")){
      $("#geners_menu").css('display', 'block');
      $("#geners_menu").addClass("active");
    }else{
      $("#geners_menu").css('display', 'none');
      $("#geners_menu").removeClass("active");
    }
  };

  getSeasons = function (genre_id, idx, key, divid, loader, main_id) {

    if (genre_id == '' || genre_id == undefined) {
      genre_id = main_id;
    }

    $("#" + idx + key + divid).html("");

    $("#" + idx + key + loader).show();

    this.apiService.GetGenreList({id: this.sessionStorage.user_id, token: this.sessionStorage.access_token, genre_id: genre_id, sub_profile_id: this.sessionStorage.sub_profile_id})
      .subscribe(data=>{
        if(data.success){
          $("#" + idx + key + divid).html(data.data);

          $(".episode-slider").not('.slick-initialized').slick({
            slidesToShow: this.epdisode_slide_to_show,
            slidesToScroll: this.epdisode_slide_to_scroll,
          });

          $(".episode-slider").slick('setPosition');

          $('.slick-carousel-responsive').resize();
        }
        else{
          
          UIkit.notify({ message: 'Something Went Wrong, Please Try again later', timeout: 3000, pos: 'top-center', status: 'danger' });

          return false;
        }
      });

  }

  loadMoreDetails = function () {

    var dataLength = Object.keys(this.datas).length;
    if(dataLength == 0 ) {
      this.display = false;
    } else {
      // this.display = true;
    }
    length = 0;

    for (var i = 0; i < dataLength; i++) {

      length += Object.keys(this.datas[i]).length;

    }

     var total = length;
     if(total == this.total){
        return false;
     }
     this.total = total;
    console.log('total',total);
    this.detailsFn(total, 12);

  }

  openPopup = function(htmlPage, width, height){
    window.open('/video/'+htmlPage,"",'width=' + '1000px' + ', height=' + '650px' + ', top=' + '300px' + ', left=' + '700px');
   };	

   trailerPopup = function(htmlPage, width, height){
    window.open('/tailer_video/'+htmlPage,"",'width=' + '1000px' + ', height=' + '650px' + ', top=' + '300px' + ', left=' + '700px');
   };	
}
