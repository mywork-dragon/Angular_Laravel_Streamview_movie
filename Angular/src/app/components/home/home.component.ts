import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppSettings } from '../../app-settings';
import { componentHostSyntheticProperty } from '@angular/core/src/render3';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FWDSISC, FWDSISCUtils } from '../../../assets/slider/java/FWDSISC.js';
import { AppGlobal } from 'src/app/app-global';
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { ChangeDetectorRef } from '@angular/core';


declare var $: any;
declare var UIkit: any;
declare const FWDSISC: any;
declare const FWDSISCUtils: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private recent_video = {};
  private sessionStorage = {};
  private user_id;
  private access_token;
  private window_width;
  private epdisode_slide_to_show;
  private epdisode_slide_to_scroll;
  slide_to_show = 6;
  slide_to_scroll = 6;
  private media_height;
  private postData;
  private ActiveCategories = {};
  private loadStatus = false;
  slideConfig1;
  datas;
  showCount;
  slideConfig;
  spam_reasons;
  sub_profile_id;
  user_type;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private changeDetector: ChangeDetectorRef
  ) {
    this.titleService.setTitle(AppGlobal.title + " | Home");
  }

  ngOnInit() {

    // $(".test-slick").slick({
    //   centerMode: true,
    //   centerPadding: '60px',
    //   slidesToShow: 3,
    // })


    $('.top_slider').slick({
      centerMode: true,
      centerPadding: '60px',
      slidesToShow: 3,
      adaptiveHeight: true,
      height: 500
    });

    this.window_width = $(window).innerWidth();

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

    $(window).bind('resize', function () {
      this.window_width = $(window).innerWidth();

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

    });
    this.slideConfig = {
      "slidesToShow": this.epdisode_slide_to_show,
      "slidesToScroll": this.epdisode_slide_to_scroll,
      // "nextArrow":"<div class='nav-btn next-slide'></div>",
      // "prevArrow":"<div class='nav-btn prev-slide'></div>",
      "dots": false,
      "infinite": true
    };

    this.sessionStorage = JSON.parse(localStorage.getItem('sessionStorage'));
    this.user_id = (this.sessionStorage['user_id'] != '' && this.sessionStorage['user_id'] != undefined) ? this.sessionStorage['user_id'] : false;
    this.access_token = (this.sessionStorage['access_token'] != undefined && this.sessionStorage['access_token'] != '') ? this.sessionStorage['access_token'] : '';
    if (this.user_id && this.access_token) {
      this.sub_profile_id = this.sessionStorage['sub_profile_id'] = this.route.snapshot.paramMap['params'].id;
      this.user_type = (this.sessionStorage['user_type'] == undefined || this.sessionStorage['user_type'] == 0) ? true : false;

      if (this.window_width > 991) {
        this.slide_to_show = 6;
        this.slide_to_scroll = 6;
        this.media_height = {
          "height": Math.round((this.window_width - 200)) / 6 * 1.5 + "px"
        }
      }

      if (this.window_width > 767 && this.window_width < 992) {
        this.slide_to_show = 4;
        this.slide_to_scroll = 4;
        this.media_height = {
          "height": Math.round((this.window_width - 100)) / 5 * 1.5 + "px"
        }
        console.log('media height', this.media_height);
      }

      if (this.window_width > 479 && this.window_width < 768) {
        this.slide_to_show = 2;
        this.slide_to_scroll = 2;
        this.media_height = {
          "height": Math.round((this.window_width - 50)) / 2 * 1.5 + "px"
        }
      }

      if (this.window_width < 480) {
        this.slide_to_show = 1;
        this.slide_to_scroll = 1;
        this.media_height = {
          "height": (this.window_width - 100) * 1.5 + "px"
        }
      }

      $(window).bind('resize', function () {
        this.window_width = $(window).innerWidth();
        if (this.window_width > 991) {
          this.slide_to_show = 6;
          this.slide_to_scroll = 6;
          this.media_height = {
            "height": Math.round((this.window_width - 200)) / 6 * 1.5 + "px"
          }
        }

        if (this.window_width > 767 && this.window_width < 992) {
          this.slide_to_show = 4;
          this.slide_to_scroll = 4; console.log(this.slide_to_scroll);
          this.media_height = {
            "height": Math.round((this.window_width - 100)) / 5 * 1.5 + "px"
          }
          console.log('media height', this.media_height);
          $(".slider").slick({
            slidesToShow: 4
          });
        }

        if (this.window_width > 479 && this.window_width < 768) {
          this.slide_to_show = 2;
          this.slide_to_scroll = 2;
          this.media_height = {
            "height": Math.round((this.window_width - 50)) / 2 * 1.5 + "px"
          }

          $(".slider").slick({
            slidesToShow: 2
          });
        }

        if (this.window_width < 480) {
          this.slide_to_show = 1;
          this.slide_to_scroll = 1;
          this.media_height = {
            "height": (this.window_width - 100) * 1.5 + "px"
          }

          $(".slider").slick({
            slidesToShow: 1
          });
          this.changeDetector.detectChanges();
        }

        console.log('media height', this.media_height);
      });
      this.changeDetector.detectChanges();
      this.slideConfig1 = {
        "slidesToShow": this.slide_to_show,
        "slidesToScroll": this.slide_to_scroll,
        "dots": false,
        "infinite": true
      };
      console.log(this.slideConfig1);
      $("#before_loader").show();

      this.apiService.getHomeData({ id: this.sessionStorage['user_id'], token: this.sessionStorage['access_token'], sub_profile_id: this.sessionStorage['sub_profile_id'], device_type: 'web' })
        .subscribe(data => {
          if (data.success) {
            this.datas = data.data;
            this.recent_video = data.recent_video;
            $("#before_loader").hide();
          }
          else {

            UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });
            return false;
          }
        });

      var win = $(window);
      var windowWidth = win.width();

      if (windowWidth >= 0 && windowWidth <= 479) {
        this.showCount = 2;
      }
      else if (windowWidth >= 480 && windowWidth <= 767) {
        this.showCount = 3;
      }
      else if (windowWidth >= 768 && windowWidth <= 991) {
        this.showCount = 4;
      }
      else {
        this.showCount = 5;
      }

      this.apiService.spamReasons().subscribe(data => {
        if (data.success) {
          this.spam_reasons = data.data;
        }
        else {
          return false;
        }
      });

    }
    else {

      window.localStorage.setItem('logged_in', 'false');

      this.sessionStorage = {};

      localStorage.removeItem("sessionStorage");

      localStorage.clear();

      this.router.navigateByUrl('/');

    }

  }


  spamVideo = function (admin_video_id, index, key) {

    if (confirm('Are you sure want to spam the video ?')) {

      var reason = $('input[name=reason]:checked').val(); console.log(reason);

      $.ajax({

        type: "post",

        url: AppGlobal.apiBase + "userApi/add_spam",

        data: { id: this.sessionStorage.user_id, token: this.sessionStorage.access_token, admin_video_id: admin_video_id, sub_profile_id: this.sessionStorage.sub_profile_id, reason: reason },

        async: false,

        beforeSend: function () {

          //$("#my-list-txt_"+$index+"_"+key).html('<a class="my-list bold"><i class="fa fa-plus my-list-icon"></i><span class="my-list-txt">Removing</span></a>');

        },

        success: function (data) {


          if (data.success) {

            UIkit.notify({ message: "You have marked the video as spam, the video won't appear anywhere except spam videos section", timeout: 3000, pos: 'top-center', status: 'success' });

            window.setTimeout(function () {

              window.location.reload();

            }, 1000);

          } else {

            UIkit.notify({ message: data.error_messages, timeout: 5000, pos: 'top-center', status: 'danger' });

            return false;
          }
        },
        error: function (data) {

          UIkit.notify({ message: 'Something Went Wrong, Please Try again later', timeout: 3000, pos: 'top-center', status: 'danger' });

        },

        /*complete : function(data) {

          $("#before_loader").hide();

        },*/
      });

    }

  }
  displayContent = function (id) {

    $("#overview").hide();
    $("#episodes").hide();
    $("#trailers").hide();
    $("#more-like").hide();
    $("#details").hide();

    if (id == 'overview') {

      $("#overview").show();
      $("#overview").addClass('adtive');

    } else if (id == 'episodes') {

      $("#episodes").show();
      $("#episodes").addClass('adtive');

    } else if (id == 'trailers') {

      $("#trailers").show();
      $('#trailers').addClass('active')

    } else if (id == 'more-like') {

      $("#more-like").show();
      $('#more-like').addClass('active')

    } else {

      $("#details").show();
      $('#details').addClass('active')
    }


  }
  addWishlist = function (id, $index, key) {

    $.ajax({

      type: "post",

      url: AppGlobal.apiBase + "userApi/addWishlist",

      data: { id: this.sessionStorage.user_id, token: this.sessionStorage.access_token, admin_video_id: id, sub_profile_id: this.sessionStorage.sub_profile_id },

      async: false,

      beforeSend: function () {

        $("#my-list-txt_" + $index + "_" + key).html('<a class="my-list bold"><i class="fa fa-check my-list-icon"></i><span class="my-list-txt">Adding</span></a>');

      },

      success: function (data) {

        if (data.success) {

          setTimeout(function () {

            $("#my-list-txt_" + $index + "_" + key).html('<a (click)="removeWishlist(' + data.wishlist_id + ', ' + id + ', ' + $index + ', ' + "'" + key + "'" + ')" class="my-list bold" id="remove-my-list-txt" style="cursor: pointer;">' +
              '<i class="fa fa-check my-list-icon"></i>' +
              '<span class="my-list-txt">My List</span>' +
              '</a>');
          }, 2000);

        } else {

          UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });

          return false;
        }
      },
      error: function (data) {

        UIkit.notify({ message: 'Something Went Wrong, Please Try again later', timeout: 3000, pos: 'top-center', status: 'danger' });

      },

      /*complete : function(data) {

        $("#before_loader").hide();

      },*/
    });
  }
  closeDiv = function (index, key) {

    $("#" + index + "_" + key + "_video_drop").fadeOut();

    // $("#"+index+"_"+key+"_video_drop").fadeOut();

    $('#' + index + "_" + key + "_img").removeClass('active_img');

    $('#' + index + "_" + key + "_desc").show();

    $('#' + index + "_" + key + "_div").removeClass('play_icon_div');
  }
  removeWishlist = function (id, admin_video_id, $index, key) {

    $.ajax({

      type: "post",

      url: AppGlobal.apiBase + "userApi/deleteWishlist",

      data: { id: this.sessionStorage.user_id, token: this.sessionStorage.access_token, wishlist_id: admin_video_id, sub_profile_id: this.sessionStorage.sub_profile_id },

      async: false,

      beforeSend: function () {

        $("#my-list-txt_" + $index + "_" + key)
          .html('<a class="my-list bold"><i class="fa fa-plus my-list-icon"></i><span class="my-list-txt">Removing</span></a>');

      },

      success: function (data) {

        if (data.success) {

          setTimeout(function () {

            $("#my-list-txt_" + $index + "_" + key).html('<a (click)="addWishlist(' + admin_video_id + ', ' + $index + ', ' + "'" + key + "'" + ')" class="my-list bold" style="cursor: pointer;">' +
              '<i class="fa fa-plus my-list-icon"></i>' +
              '<span class="my-list-txt">My List</span>' +
              '</a>');

          }, 2000);

        } else {

          UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });

          return false;
        }
      },
      error: function (data) {

        UIkit.notify({ message: 'Something Went Wrong, Please Try again later', timeout: 3000, pos: 'top-center', status: 'danger' });

      },

      /*complete : function(data) {

        $("#before_loader").hide();

      },*/
    });
  }

  likeVideo = function (admin_video_id, $index, key) {

    $.ajax({

      type: "post",

      url: AppGlobal.apiBase + "userApi/like_video",

      data: { id: this.sessionStorage.user_id, token: this.sessionStorage.access_token, admin_video_id: admin_video_id, sub_profile_id: this.sessionStorage.sub_profile_id },

      async: false,

      beforeSend: function () {

        $("#like_" + $index + "_" + key).addClass('disabled_class');

      },

      success: function (data) {

        $("#like_" + $index + "_" + key).removeClass('disabled_class');


        if (data.success) {

          // setTimeout(function(){

          $("#like_count_" + $index + "_" + key).html(data.like_count);

          $("#dis_like_count_" + $index + "_" + key).html(data.dislike_count);

          if (data.delete) {


            // UIkit.notify({message : "We are very sorry you removed the video from like", timeout : 3000, pos : 'top-center', status : 'success'});

            $("#dis_like_" + $index + "_" + key).show();

            $("#dis_like_" + $index + "_" + key).removeClass('ng-hide');

            $("#dis_like_" + $index + "_" + key).css('display', 'inline !important');

          } else {

            // UIkit.notify({message : "I'm glad you liked the video", timeout : 3000, pos : 'top-center', status : 'success'});

            $("#dis_like_" + $index + "_" + key).fadeOut(500);

          }

          // }, 2000);

        } else {

          UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });

          return false;
        }
      },
      error: function (data) {

        UIkit.notify({ message: 'Something Went Wrong, Please Try again later', timeout: 3000, pos: 'top-center', status: 'danger' });

      },

      /*complete : function(data) {

        $("#before_loader").hide();

      },*/
    });
  }

  dislikeVideo = function (admin_video_id, $index, key) {

    $.ajax({

      type: "post",

      url: AppGlobal.apiBase + "userApi/dis_like_video",

      data: { id: this.sessionStorage.user_id, token: this.sessionStorage.access_token, admin_video_id: admin_video_id, sub_profile_id: this.sessionStorage.sub_profile_id },

      async: false,

      beforeSend: function () {

        //$("#my-list-txt_"+$index+"_"+key).html('<a class="my-list bold"><i class="fa fa-plus my-list-icon"></i><span class="my-list-txt">Removing</span></a>');
        $("#dis_like_" + $index + "_" + key).addClass('disabled_class');

      },

      success: function (data) {

        $("#dis_like_" + $index + "_" + key).removeClass('disabled_class');

        if (data.success) {

          // setTimeout(function(){

          $("#like_count_" + $index + "_" + key).html(data.like_count);

          $("#dis_like_count_" + $index + "_" + key).html(data.dislike_count);

          if (data.delete) {

            // UIkit.notify({message : "I'm glad you removed the video from dislike", timeout : 3000, pos : 'top-center', status : 'success'});

            $("#like_" + $index + "_" + key).show(500);

            $("#like_" + $index + "_" + key).removeClass('ng-hide');

            $("#like_" + $index + "_" + key).css('display', 'inline !important');

          } else {

            // UIkit.notify({message : "You disliked the video", timeout : 3000, pos : 'top-center', status : 'warning'});

            $("#like_" + $index + "_" + key).fadeOut(500);

          }

          // }, 2000);

        } else {

          UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });

          return false;
        }
      },
      error: function (data) {

        UIkit.notify({ message: 'Something Went Wrong, Please Try again later', timeout: 3000, pos: 'top-center', status: 'danger' });

      },

      /*complete : function(data) {

        $("#before_loader").hide();

      },*/
    });
  }


  getSeasons = function (genre_id, idx, key, divid, loader, main_id) {

    if (genre_id == '' || genre_id == undefined) {

      genre_id = main_id;
    }

    $.ajax({

      type: "post",

      url: AppGlobal.apiBase + "userApi/genre-list",

      data: { id: this.sessionStorage.user_id, token: this.sessionStorage.access_token, genre_id: genre_id },

      async: false,

      beforeSend: function () {

        $("#" + idx + key + divid).html("");

        $("#" + idx + key + loader).show();

      },

      success: function (data) {

        if (data.success) {

          $("#" + idx + key + divid).html(data.data);

          $(".episode-slider").not('.slick-initialized').slick({
            slidesToShow: this.epdisode_slide_to_show,
            slidesToScroll: this.epdisode_slide_to_scroll,
          });

          $('.top_slider').slick({
            centerMode: true,
            centerPadding: '60px',
            slidesToShow: 3,
          });

          $(".episode-slider").slick('setPosition');

          $('.slick-carousel-responsive').resize();

        } else {

          UIkit.notify({ message: 'Something Went Wrong, Please Try again later', timeout: 3000, pos: 'top-center', status: 'danger' });

          return false;
        }
      },
      error: function (data) {

        UIkit.notify({ message: 'Something Went Wrong, Please Try again later', timeout: 3000, pos: 'top-center', status: 'danger' });

      },

      complete: function (data) {

        $("#" + idx + key + loader).hide();

      },
    });
  }

  showArrow = function (id) {
    $("#" + id).css('line-height', 0);
    $("#" + id).fadeIn()
  };

  hideArrow = function (id) {
    $("#" + id).fadeOut();
  };

  showVideoDrop = function (event, idx, key) {
    $(".video-drop").hide();
    $("#" + idx + "_" + key + "_video_drop").show();
    // $('#'+idx+"_"+key).addClass('active_img');
    //console.log($('#'+idx+"_"+key).closest('.slide-box').siblings().find('tile-img').addClass('active_img'));
    $('#' + idx + "_" + key + "_img").addClass('active_img');
    $('#' + idx + "_" + key + "_desc").hide();
    $('#' + idx + "_" + key + "_div").addClass('play_icon_div');
    $('#' + idx + "_" + key).removeClass('transition-class');
  };

  hoverIn = function (event, id, key, length) {

    var video_drop = $(".video-drop").is(":visible");

    if (!video_drop) {
      $('#' + id + "_" + key).addClass('transition-class');
      $('#' + id + "_" + key + "_desc").show();
      $('#' + id + "_" + key + "_div").removeClass('play_icon_div');

      var n_w = $('#' + id + "_recent").width();
      var added_w = n_w * 0.4 / 2;
      // $('#' + id + "_" + key).parent().css('width', $('#' + id + "_" + key).parent().width() + added_w + 100 + 'px');
      // if($('#' + id + "_" + key).prev().length > 0){
      //   $('#' + id + "_" + key).prev().css('margin-right', added_w + 'px');
      //   $('#' + id + "_" + key).css('margin-left', '-' + added_w + 'px');
      // }
      // if($('#' + id + "_" + key).next().length > 0){
      //   $('#' + id + "_" + key).next().css('margin-left', added_w + 'px');
      //   $('#' + id + "_" + key).css('margin-right', added_w + 'px');
      // }

      $('#' + id + "_" + key).css('padding', '0');
      //$('#' + id + "_" + key + "_desc").css('bottom', '30px');
    } else {
      for (var i = 0; i < length; i++) {
        $("#" + i + "_" + key + "_video_drop").hide();
        // $('#'+i+"_"+key).removeClass('active_img');
        $('#' + i + "_" + key + "_img").removeClass('active_img');
        $('#' + i + "_" + key + "_div").removeClass('play_icon_div');
        $('#' + i + "_" + key + "_desc").show();
      }
      $('#' + id + "_" + key).removeClass('transition-class');
      $('#' + id + "_" + key + "_img").addClass('active_img');
      $('#' + id + "_" + key + "_desc").hide();
      $('#' + id + "_" + key + "_div").addClass('play_icon_div');
      $("#" + id + "_" + key + "_video_drop").show();
    }

  };

  hoverOut = function (event, id, key, length) {
    $('.slick-slide').css('margin', '0px');
    var value = id;

    if (value == 0 || value % this.showCount == 0) {
    }
    else if ((value + 1) % this.showCount == 0 && value != 0) {
      $(".transition-class").css("margin-left", "0px");
    }
    else {
      $(".transition-class").css("margin-left", "0px");
    }
    var video_drop = $(".video-drop").is(":visible");

    if (video_drop) {
      for (var i = 0; i < length; i++) {
        $("#" + i + "_" + key + "_video_drop").hide();
        $('#' + i + "_" + key + "_img").removeClass('active_img');
        $('#' + i + "_" + key + "_div").removeClass('play_icon_div');
        $('#' + i + "_" + key + "_desc").show();
      }

      // $('#'+id+"_"+key).addClass('active_img');
      $('#' + id + "_" + key + "_img").addClass('active_img');
      $('#' + id + "_" + key + "_desc").hide();
      $('#' + id + "_" + key + "_div").addClass('play_icon_div');
      $("#" + id + "_" + key + "_video_drop").show();
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

    // $(".episode-slider").not('.slick-initialized').slick({
    //   slidesToShow: this.epdisode_slide_to_show,
    //   slidesToScroll: this.epdisode_slide_to_scroll,
    // });

    // $(".episode-slider").slick('setPosition');
  }

  modalShow = function (a, b) {
    console.log(a, b)
    $.noConflict();
    $('#overviewmodal_' + a + '_' + b).modal('show');
  }

  openPopup = function (htmlPage, width, height) {
    window.open('/video/' + htmlPage, "", 'width=' + '1000px' + ', height=' + '650px' + ', top=' + '300px' + ', left=' + '700px');
  };
  otherPopup = function (htmlPage, width, height) {
    window.open('/payment-option/' + htmlPage, "", 'width=' + '1000px' + ', height=' + '650px' + ', top=' + '300px' + ', left=' + '700px');
  };

}
