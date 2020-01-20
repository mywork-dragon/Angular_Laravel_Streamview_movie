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
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})

export class BrowseComponent implements OnInit {
  window_width;
  media_height;
  slide_to_show = 6;
  slide_to_scroll = 2;
  user_id;
  access_token;
  sessionStorage={};
  user_type;
  datas={};
  slideConfig
  epdisode_slide_to_show = 6;
  epdisode_slide_to_scroll = 2;
  spam_reasons;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {
    this.titleService.setTitle(AppGlobal.title+'| Browse')
   }

  ngOnInit() {
    this.sessionStorage = JSON.parse(localStorage.sessionStorage);
    $("#page_preloader").show();
    this.window_width = $(window).width();
		var slideShowCount = 6;
		if (this.window_width > 1024) {
			this.media_height = {
				"height" : Math.round((this.window_width - 200)) / 6 * 1.5 + "px"
			}
			slideShowCount = 6;
		}
		if (this.window_width > 768 && this.window_width < 1024) {
			this.media_height = {
				"height" : Math.round((this.window_width - 100)) / 5 * 1.5 + "px"
			}
			slideShowCount = 5;
		}
		if (this.window_width > 479 && this.window_width < 768) {
			this.media_height = {
				"height" : Math.round((this.window_width - 50)) / 4 * 1.5 + "px"
			}
			slideShowCount = 4;
		}
		if (this.window_width < 480) {
			this.media_height = {
				"height" : Math.round((this.window_width - 50)) / 2 * 1.5 + "px"
			}
			slideShowCount = 2;
		}
		this.slide_to_show = slideShowCount;
    this.slide_to_scroll = 2;
    
    $(window).bind('resize', function () {
			this.window_width = $(window).innerWidth;
			slideShowCount = 6;
			if (this.window_width > 1000) {
				this.media_height = {
					"height" : Math.round((this.window_width - 200)) / 6 * 1.5 + "px"
				}
				slideShowCount = 6;
			}
			if (this.window_width > 768 && this.window_width < 1000) {
				this.media_height = {
					"height" : Math.round((this.window_width - 100)) / 5 * 1.5 + "px"
				}
				slideShowCount = 5;
			}
			if (this.window_width > 479 && this.window_width < 768) {
				this.media_height = {
					"height" : Math.round((this.window_width - 50)) / 4 * 1.5 + "px"
				}
				slideShowCount = 4;
			}
			if (this.window_width < 480) {
				this.media_height = {
					"height" : Math.round((this.window_width - 50)) / 2 * 1.5 + "px"
				}
				slideShowCount = 2;
			}
			
			this.slide_to_show = slideShowCount;
			this.slide_to_scroll = 2;
			$(".slider.multiple-items").slick({
				slidesToShow: slideShowCount,
				slidesToScroll: 2,
			});
			
    });
    this.slideConfig = {
      "slidesToShow": this.slide_to_show, 
      "slidesToScroll": this.slide_to_scroll,
      // "nextArrow":"<div class='nav-btn next-slide'></div>",
      // "prevArrow":"<div class='nav-btn prev-slide'></div>",
      "dots":false,
      "infinite": true
    };
    this.user_id = (this.sessionStorage['user_id'] != '' && this.sessionStorage['user_id'] != undefined ) ? this.sessionStorage['user_id'] : false;
    this.access_token = (this.sessionStorage['access_token'] != undefined && this.sessionStorage['access_token'] != '') ? this.sessionStorage['access_token'] : '';
    
    if(this.user_id&&this.access_token){
 
      $("#page_preloader").show();
      this.user_type = (this.sessionStorage['user_type'] == undefined || this.sessionStorage['user_type'] == 0 ) ? true : false;
      var key = this.route.snapshot.paramMap['params'].id;

      this.apiService.getVideoData( {id : this.sessionStorage['user_id'], token : this.sessionStorage['access_token'], key : key, sub_profile_id : this.sessionStorage['sub_profile_id']}).subscribe(data=>{
        if(data.success){
          this.datas = data;
        }
        else{
          UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
					return false;
        }
        $("#page_preloader").hide();
        
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

showVideoDrop = function(event, sub, idx, key) {
    $("#"+sub+'_'+idx+"_"+key+"_video_drop").fadeIn();
    $('#'+sub+'_'+idx+"_"+key).removeClass('transition-class');
    $('#'+sub+'_'+idx+"_"+key+"_img").addClass('active_img');
    $('#'+sub+'_'+idx+"_"+key+"_desc").hide();
  $('#'+sub+'_'+idx+"_"+key+"_div").addClass('play_icon_div');
};

ShowGeners = function(){
  if(!$("#geners_menu").hasClass("active")){
    $("#geners_menu").css('display', 'block');
    $("#geners_menu").addClass("active");
  }else{
    $("#geners_menu").css('display', 'none');
    $("#geners_menu").removeClass("active");
  }
};

hoverIn = function(event, sub, id, key, length) {
  var video_drop = $(".video-drop").is(":visible");
  if (!video_drop) {

    $('#'+sub+'_'+id+"_"+key).addClass('transition-class');
    $('#'+sub+'_'+id+"_"+key+"_desc").show();
    $('#'+sub+'_'+id+"_"+key+"_desc").css('bottom', '30px');
    $('#'+sub+'_'+id+"_"+key).css('padding', '0');
    
    var n_w = $('#'+sub+'_'+id+"_"+key).width();
    var added_w = n_w * 0.4 / 2;
    // $('#'+sub+'_'+id+"_"+key).parent().css('width', $('#'+sub+'_'+id+"_"+key).parent().width() + added_w + 100 + 'px');
    // if($('#'+sub+'_'+id+"_"+key).prev().length > 0){
    //   $('#'+sub+'_'+id+"_"+key).prev().css('margin-right', added_w + 'px');
    //   $('#'+sub+'_'+id+"_"+key).css('margin-left', '-' + added_w + 'px');
    // }
    // if($('#'+sub+'_'+id+"_"+key).next().length > 0){
    //   $('#'+sub+'_'+id+"_"+key).next().css('margin-left', added_w + 'px');
    //   $('#'+sub+'_'+id+"_"+key).css('margin-right', added_w + 'px');
    // }
    
  } else {
    for(var i = 0; i < length ; i++) {
      $("#"+sub+'_'+i+"_"+i+"_video_drop").hide();
      $('#'+sub+'_'+i+"_"+i+"_img").removeClass('active_img');
      $('#'+sub+'_'+i+"_"+i+"_div").removeClass('play_icon_div');
      $('#'+sub+'_'+i+"_"+i+"_desc").show();
    }
    $('#'+sub+'_'+id+"_"+key).removeClass('transition-class');
    $('#'+sub+'_'+id+"_"+key+"_img").addClass('active_img');
    $('#'+sub+'_'+id+"_"+key+"_desc").hide();	
    $('#'+sub+'_'+id+"_"+key+"_div").addClass('play_icon_div');
    $("#"+sub+'_'+id+"_"+key+"_video_drop").show();
  }
};

hoverOut = function(event, sub, id, key, length) {
  $('.slick-slide').css('margin', '0px');
  var video_drop = $(".video-drop").is(":visible");
  if (video_drop) {
    for(var i = 0; i < length ; i++) {
      $("#"+sub+'_'+i+"_"+i+"_video_drop").hide();
      $('#'+sub+'_'+i+"_"+i+"_img").removeClass('active_img');
      $('#'+sub+'_'+i+"_"+i+"_desc").show();	
      $('#'+sub+'_'+i+"_"+i+"_div").removeClass('play_icon_div');	
    }
    $("#"+sub+'_'+i+"_"+key+"_video_drop").hide();
    $('#'+sub+'_'+id+"_"+key+"_img").addClass('active_img');
    $("#"+sub+'_'+id+"_"+key+"_video_drop").show();
    $('#'+sub+'_'+id+"_"+key+"_desc").hide();	
    $('#'+sub+'_'+id+"_"+key+"_div").addClass('play_icon_div');	
  } 

  $('#'+sub+'_'+id+"_"+key).removeClass('transition-class');
};

addWishlist = function(id, subkey, $index, key) {
  $.ajax({
    type : "post",
    url : AppGlobal.apiBase + "userApi/addWishlist",
    data : {id : this.sessionStorage.user_id, token : this.sessionStorage.access_token, admin_video_id : id,sub_profile_id:this.sessionStorage.sub_profile_id},
    async : false,
    beforeSend : function() {
      $("#my-list-txt_"+subkey+"_"+$index+"_"+key).html('<a class="my-list bold"><i class="fa fa-check my-list-icon"></i><span class="my-list-txt">Adding</span></a>');
    },
    success : function (data) {
      if (data.success) {
        setTimeout(function(){
          $("#my-list-txt_"+subkey+"_"+$index+"_"+key).html('<a onclick="angular.element(this).scope().removeWishlist('+data.wishlist_id+', '+id+', '+ subkey +', '+$index+', '+"'"+key+"'"+')" class="my-list bold" id="remove-my-list-txt" style="cursor: pointer;">'+
                            '<i class="fa fa-check my-list-icon"></i>'+
                            '<span class="my-list-txt">My List</span>'+
                          '</a>');
        }, 2000);
      } else {
        if(data.error_code 	== 101 || data.error_code == 103 || data.error_code == 104) {
                window.localStorage.setItem('logged_in', 'false');
                var memoryStorage = {};
                localStorage.removeItem("sessionStorage");
                localStorage.clear();
                this.router.navigateByUrl('/');
        } else {
          UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
          return false;
        }
      }
    },
    error : function (data) {
      UIkit.notify({message : 'Something Went Wrong, Please Try again later', timeout : 3000, pos : 'top-center', status : 'danger'});
    },

    /*complete : function(data) {

      $("#before_loader").hide();

    },*/
  });
}

closeDiv = function(sub,index, key) {
  $("#"+sub+'_'+index+"_"+key+"_video_drop").fadeOut();
  $('#'+sub+'_'+index+"_"+key+"_img").removeClass('active_img');
  $('#'+sub+'_'+index+"_"+key+"_desc").show();	
  $('#'+sub+'_'+index+"_"+key+"_div").removeClass('play_icon_div');
}

removeWishlist = function(id, admin_video_id, sub, $index, key) {
  $.ajax({
    type : "post",
    url : AppGlobal.apiBase + "userApi/deleteWishlist",
    data : {id : this.sessionStorage.user_id, token : this.sessionStorage.access_token, wishlist_id : admin_video_id,sub_profile_id:this.sessionStorage.sub_profile_id},
    async : false,
    beforeSend : function() {

      $("#my-list-txt_"+sub+"_"+$index+"_"+key)
      .html('<a class="my-list bold"><i class="fa fa-plus my-list-icon"></i><span class="my-list-txt">Removing</span></a>');
    },
    success : function (data) {
      if (data.success) {
        setTimeout(function(){
        $("#my-list-txt_"+sub+"_"+$index+"_"+key).html('<a onclick="angular.element(this).scope().addWishlist('+admin_video_id+', '+sub+', '+$index+', '+"'"+key+"'"+')" class="my-list bold" style="cursor: pointer;">'+
                          '<i class="fa fa-plus my-list-icon"></i>'+
                          '<span class="my-list-txt">My List</span>'+
                        '</a>');
        }, 2000);
      } else {
        if(data.error_code 	== 101 || data.error_code == 103 || data.error_code == 104) {
                window.localStorage.setItem('logged_in', 'false');
                var memoryStorage = {};
                localStorage.removeItem("sessionStorage");
                localStorage.clear();
                this.router.navigateByUrl('/');
        } else {
          UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
          return false;
        }
      }
    },
    error : function (data) {
      UIkit.notify({message : 'Something Went Wrong, Please Try again later', timeout : 3000, pos : 'top-center', status : 'danger'});
    },
  });
}

likeVideo = function(admin_video_id, subkey, $index, key) {
  $.ajax({
    type : "post",
    url : AppGlobal.apiBase + "userApi/like_video",
    data : {id : this.sessionStorage.user_id, token : this.sessionStorage.access_token, admin_video_id : admin_video_id,sub_profile_id:this.sessionStorage.sub_profile_id},
    async : false,
    beforeSend : function() {
      $("#like_"+subkey+"_"+$index+"_"+key).addClass('disabled_class');
    },
    success : function (data) {
      $("#like_"+subkey+"_"+$index+"_"+key).removeClass('disabled_class');
      if (data.success) {
        $("#like_count_"+subkey+"_"+$index+"_"+key).html(data.like_count);
        $("#dis_like_count_"+subkey+"_"+$index+"_"+key).html(data.dislike_count);
        // setTimeout(function(){
          if (data.delete) {
            // UIkit.notify({message : "We are very sorry you removed the video from like", timeout : 3000, pos : 'top-center', status : 'success'});
            $("#dis_like_"+subkey+"_"+$index+"_"+key).show();
            $("#dis_like_"+subkey+"_"+$index+"_"+key).removeClass('ng-hide');
            $("#dis_like_"+subkey+"_"+$index+"_"+key).css('display', 'inline !important');
          } else {
            // UIkit.notify({message : "I'm glad you liked the video", timeout : 3000, pos : 'top-center', status : 'success'});
            $("#dis_like_"+subkey+"_"+$index+"_"+key).fadeOut(500);
          }
        // }, 2000);
      } else {
        UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
        return false;
      }
    },
    error : function (data) {
      UIkit.notify({message : 'Something Went Wrong, Please Try again later', timeout : 3000, pos : 'top-center', status : 'danger'});
    },
  });
}

dislikeVideo = function(admin_video_id, subkey, $index, key) {
  $.ajax({
    type : "post",
    url : AppGlobal.apiBase + "userApi/dis_like_video",
    data : {id : this.sessionStorage.user_id, token : this.sessionStorage.access_token, admin_video_id : admin_video_id,sub_profile_id:this.sessionStorage.sub_profile_id},
    async : false,
    beforeSend : function() {
      //$("#my-list-txt_"+$index+"_"+key).html('<a class="my-list bold"><i class="fa fa-plus my-list-icon"></i><span class="my-list-txt">Removing</span></a>');
      $("#dis_like_"+subkey+"_"+$index+"_"+key).addClass('disabled_class');
    },
    success : function (data) {
      $("#dis_like_"+subkey+"_"+$index+"_"+key).removeClass('disabled_class');
      if (data.success) {
        $("#like_count_"+subkey+"_"+$index+"_"+key).html(data.like_count);
        $("#dis_like_count_"+subkey+"_"+$index+"_"+key).html(data.dislike_count);
        // setTimeout(function(){
          if (data.delete) {
            // UIkit.notify({message : "I'm glad you removed the video from dislike", timeout : 3000, pos : 'top-center', status : 'success'});
            $("#like_"+subkey+"_"+$index+"_"+key).show(500);
            $("#like_"+subkey+"_"+$index+"_"+key).removeClass('ng-hide');
            $("#like_"+subkey+"_"+$index+"_"+key).css('display', 'inline !important');
          } else {
            // UIkit.notify({message : "You disliked the video", timeout : 3000, pos : 'top-center', status : 'warning'});
            $("#like_"+subkey+"_"+$index+"_"+key).fadeOut(500);
          }

        // }, 2000);
      } else {
        UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
        return false;
      }
    },
    error : function (data) {
      UIkit.notify({message : 'Something Went Wrong, Please Try again later', timeout : 3000, pos : 'top-center', status : 'danger'});
    },

    /*complete : function(data) {

      $("#before_loader").hide();

    },*/
  });
}

getSeasons = function(genre_id, sub, idx, key, divid, loader,main_id) {
 
  if (genre_id == '' || genre_id  == undefined) {
    genre_id = main_id;
  }
  $.ajax({
    type : "post",
    url : AppGlobal.apiBase + "userApi/genre-list",
    data : {id : this.sessionStorage.user_id, token : this.sessionStorage.access_token, genre_id : genre_id, sub_profile_id :this.sessionStorage.sub_profile_id},
    async : false,
    beforeSend : function() {
      $("#"+sub+idx+key+divid).html("");
      $("#"+sub+idx+key+loader).show();
    },
    success : function (data) {
      if (data.success) {
        // $("#"+divid).html(data.view);
        console.log($("#"+sub+idx+key+divid));
        $("#"+sub+idx+key+divid).html(data.data);
        $(".episode-slider").not('.slick-initialized').slick({
          slidesToShow: this.epdisode_slide_to_show,
          slidesToScroll: this.epdisode_slide_to_scroll,
        });
        $(".episode-slider").slick('setPosition');
          $('.slick-carousel-responsive').resize();
      } else {
        if(data.error_code 	== 101 || data.error_code == 103 || data.error_code == 104) {

                window.localStorage.setItem('logged_in', 'false');
                this.sessionStorage = {};
                localStorage.removeItem("sessionStorage");
                localStorage.clear();
                this.router.navigateByUrl('/')
        } else {
          UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
          return false;
        }
      }
    },
    error : function (data) {
      UIkit.notify({message : 'Something Went Wrong, Please Try again later', timeout : 3000, pos : 'top-center', status : 'danger'});
    },
    complete : function(data) {
      $("#"+sub+idx+key+loader).hide();
    },
  });
}

spamVideo = function(admin_video_id, index, key) {
  if (confirm('Are you sure want to spam the video ?')) {
    var reason = $('input[name=reason]:checked').val();
    $.ajax({
      type : "post",
      url : AppGlobal.apiBase + "userApi/add_spam",
      data : {id : this.sessionStorage.user_id, token : this.sessionStorage.access_token, admin_video_id : admin_video_id,sub_profile_id:this.sessionStorage.sub_profile_id , reason : reason},
      async : false,
      beforeSend : function() {
        //$("#my-list-txt_"+$index+"_"+key).html('<a class="my-list bold"><i class="fa fa-plus my-list-icon"></i><span class="my-list-txt">Removing</span></a>');
      },
      success : function (data) {
        if (data.success) {
          UIkit.notify({message : "You have marked the video as spam, the video won't appear anywhere except spam videos section", timeout : 3000, pos : 'top-center', status : 'success'});
          // window.setTimeout(function() {
          window.location.reload();
          // }, 1000);
        } else {
          UIkit.notify({message : data.error_messages, timeout : 5000, pos : 'top-center', status : 'danger'});
          return false;
        }
      },
      error : function (data) {
        UIkit.notify({message : 'Something Went Wrong, Please Try again later', timeout : 3000, pos : 'top-center', status : 'danger'});
      },

      /*complete : function(data) {

        $("#before_loader").hide();

      },*/
    });
  }	
}

dynamicContent = function(sub, index, key, id) {

  $("#"+sub+"_"+index+"_"+key+"_overview").removeClass('active');
  $("#"+sub+"_"+index+"_"+key+"_episodes").removeClass('active');
  $("#"+sub+"_"+index+"_"+key+"_trailers").removeClass('active');
  $("#"+sub+"_"+index+"_"+key+"_more-like").removeClass('active');
  $("#"+sub+"_"+index+"_"+key+"_details").removeClass('active');

  if (id == "overview") {

    $("#"+sub+"_"+index+"_"+key+"_overview").addClass('active');

  } else if (id == "episodes") {

    $("#"+sub+"_"+index+"_"+key+"_episodes").addClass('active');

  } else if (id == "trailers") {

    $("#"+sub+"_"+index+"_"+key+"_trailers").addClass('active');
    
  } else if (id == "more-like") {

    $("#"+sub+"_"+index+"_"+key+"_more-like").addClass('active');
    
  } else {

    $("#"+sub+"_"+index+"_"+key+"_details").addClass('active');
  }

  $(".episode-slider").not('.slick-initialized').slick({
      slidesToShow: this.epdisode_slide_to_show,
      slidesToScroll: this.epdisode_slide_to_scroll,
    });
  $(".episode-slider").slick('setPosition');
}


openPopup = function(htmlPage, width, height){
  window.open('/video/'+htmlPage,"",'width=' + '1000px' + ', height=' + '650px' + ', top=' + '300px' + ', left=' + '700px');
 };	
 trailerPopup = function(htmlPage, width, height){
  window.open('/trailer_video/'+htmlPage,"",'width=' + '1000px' + ', height=' + '650px' + ', top=' + '300px' + ', left=' + '700px');
 };	
}
