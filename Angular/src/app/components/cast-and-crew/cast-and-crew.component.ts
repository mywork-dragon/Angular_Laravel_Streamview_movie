import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppSettings } from '../../app-settings';
import { componentHostSyntheticProperty } from '@angular/core/src/render3';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AppGlobal } from 'src/app/app-global';
import { ActivatedRoute } from "@angular/router";
import { Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

declare var $: any;
declare var UIkit: any;

@Component({
  selector: 'app-cast-and-crew',
  templateUrl: './cast-and-crew.component.html',
  styleUrls: ['./cast-and-crew.component.css']
})
export class CastAndCrewComponent implements OnInit {

  sessionStorage;
  user_id;
  access_token;
  window_width;
  slide_to_show;
  slide_to_scroll;
  media_height;
  user_type;
  sub_profile_id;
  title;
  spam_reasons;
  no_results_found;
  recent_video;
  slideConfig;
  slideConfig1;
  epdisode_slide_to_show;
  epdisode_slide_to_scroll;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.sessionStorage = JSON.parse(localStorage.sessionStorage);
    this.user_id = (this.sessionStorage['user_id'] != '' && this.sessionStorage['user_id'] != undefined ) ? this.sessionStorage['user_id'] : false;
    this.access_token = (this.sessionStorage['access_token'] != undefined && this.sessionStorage['access_token'] != '') ? this.sessionStorage['access_token'] : '';
    this.sub_profile_id = this.sessionStorage['sub_profile_id'];
    this.window_width = $(window).width();
    if (this.window_width > 991) {
			this.slide_to_show = 6;
			this.slide_to_scroll = 6;
			this.media_height = {
				"height" : Math.round((this.window_width - 200)) / 6 * 1.5 + "px"
			}
		}

		if (this.window_width > 767 && this.window_width < 992) {
			this.slide_to_show = 4;
			this.slide_to_scroll = 4;
			this.media_height = {
				"height" : Math.round((this.window_width - 100)) / 5 * 1.5 + "px"
			}
		}

		if (this.window_width > 479 && this.window_width < 768) {
			this.slide_to_show = 2;
			this.slide_to_scroll = 2;
			this.media_height = {
				"height" : Math.round((this.window_width - 50)) / 2 * 1.5 + "px"
			}
		}

		if (this.window_width < 480) {
			this.slide_to_show = 1;
			this.slide_to_scroll = 1;
			this.media_height = {
				"height" : (this.window_width - 100) * 1.5 + "px"
			}
    }
    
    $(window).bind('resize', function () {
			this.window_width = $(window).innerWidth;

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

		//	this.$apply();
    });
    this.slideConfig = {
      "slidesToShow": this.epdisode_slide_to_show, 
      "slidesToScroll": this.epdisode_slide_to_scroll,
      // "nextArrow":"<div class='nav-btn next-slide'></div>",
      // "prevArrow":"<div class='nav-btn prev-slide'></div>",
      "dots":false,
      "infinite": true
    };

    this.slideConfig = {
      "slidesToShow": this.slide_to_show,
      "slidesToScroll": this.slide_to_scroll,
      "dots": false,
      "infinite": true
    }
		if(this.user_id && this.access_token ){
      this.user_type = (this.sessionStorage.user_type == undefined || this.sessionStorage.user_type == 0 ) ? true : false;
      this.title = this.route.snapshot.paramMap['params'].id;
      var key = this.route.snapshot.routeConfig.path;
      var param = key.split('/:id');
      this.apiService.spamReasons().subscribe(data=>{
        if(data.success){
          this.spam_reasons = data.data;
        }
        else{
          return false;
        }
      })
      $("#data_loader").show();
     this.apiService.CastAndCrewVideos({ ignore: true, id: this.title, field: param[0]+'s', })
     .subscribe(data=>{
       if(data.success){
         this.recent_video = data.data;
         this.no_results_found = '';
       }
       else{
         this.no_results_found = "assets/img/no-results.png";
         UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
         return false;
       }
       $("#data_loader").hide();
     })
    }
    else{
      
			this.sessionStorage = {};
			
			localStorage.removeItem("sessionStorage");

			localStorage.clear();

      this.router.navigateByUrl('/');
    }
  }

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
            $("#my-list-txt_"+subkey+"_"+$index+"_"+key).html('<a onclick="removeWishlist('+data.wishlist_id+', '+id+', '+ subkey +', '+$index+', '+"'"+key+"'"+')" class="my-list bold" id="remove-my-list-txt" style="cursor: pointer;">'+
                              '<i class="fa fa-check my-list-icon"></i>'+
                              '<span class="my-list-txt">My List</span>'+
                            '</a>');
          }, 2000);
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

  closeDiv = function(index, key) {

    $("#"+index+"_"+key+"_video_drop").fadeOut();

    $('#'+index+"_"+key+"_img").removeClass('active_img');

    $('#'+index+"_"+key+"_desc").show();	

    $('#'+index+"_"+key+"_div").removeClass('play_icon_div');	
  }

  
  removeWishlist = function(id, admin_video_id, $index, key) {

    $.ajax({

      type : "post",

      url : AppGlobal.apiBase + "userApi/deleteWishlist",

      data : {id : this.user_id, token : this.access_token, wishlist_id : admin_video_id, sub_profile_id: this.sub_profile_id},

      async : false,

      beforeSend : function() {

        $("#my-list-txt_"+$index+"_"+key)
        .html('<a class="my-list bold"><i class="fa fa-plus my-list-icon"></i><span class="my-list-txt">Removing</span></a>');

      },



      success : function (data) {

        if (data.success) {

          setTimeout(function(){

            $("#my-list-txt_"+$index+"_"+key).html('<a onclick="addWishlist('+admin_video_id+', '+$index+', '+"'"+key+"'"+')" class="my-list bold" style="cursor: pointer;">'+
                            '<i class="fa fa-plus fa-stack-1x my-list-icon"></i>'+
                            '<span class="my-list-txt">My List</span>'+
                          '</a>');

          }, 2000);

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
  
  likeVideo = function(admin_video_id, $index, key) {console.log(admin_video_id, $index, key)

    $.ajax({

      type : "post",

      url : AppGlobal.apiBase + "userApi/like_video",

      data : {id : this.user_id, token : this.access_token, admin_video_id : admin_video_id,sub_profile_id:this.sub_profile_id},

      async : false,

      beforeSend : function() {

        $("#like_"+$index+"_"+key).addClass('disabled_class');

      },

      success : function (data) {

        $("#like_"+$index+"_"+key).removeClass('disabled_class');


        if (data.success) {

          $("#like_count_"+$index+"_"+key).html(data.like_count);

          $("#dis_like_count_"+$index+"_"+key).html(data.dislike_count);


          // setTimeout(function(){

            if (data.delete) {
              
              // UIkit.notify({message : "We are very sorry you removed the video from like", timeout : 3000, pos : 'top-center', status : 'success'});

              $("#dis_like_"+$index+"_"+key).show();

              $("#dis_like_"+$index+"_"+key).removeClass('ng-hide');

              $("#dis_like_"+$index+"_"+key).css('display', 'inline !important');

            } else {

              // UIkit.notify({message : "I'm glad you liked the video", timeout : 3000, pos : 'top-center', status : 'success'});

              $("#dis_like_"+$index+"_"+key).fadeOut(500);

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

  dislikeVideo = function(admin_video_id, $index, key) {console.log(admin_video_id, $index, key)

    $.ajax({

      type : "post",

      url : AppGlobal.apiBase + "userApi/dis_like_video",

      data : {id : this.user_id, token : this.access_token, admin_video_id : admin_video_id,sub_profile_id:this.sub_profile_id},

      async : false,

      beforeSend : function() {

        //$("#my-list-txt_"+$index+"_"+key).html('<a class="my-list bold"><i class="fa fa-plus my-list-icon"></i><span class="my-list-txt">Removing</span></a>');
        $("#dis_like_"+$index+"_"+key).addClass('disabled_class');

      },

      success : function (data) {

        $("#dis_like_"+$index+"_"+key).removeClass('disabled_class');

        if (data.success) {

          $("#like_count_"+$index+"_"+key).html(data.like_count);

          $("#dis_like_count_"+$index+"_"+key).html(data.dislike_count);


          // setTimeout(function(){
            if (data.delete) {

              UIkit.notify({message : "I'm glad you removed the video from dislike", timeout : 3000, pos : 'top-center', status : 'success'});

              $("#like_"+$index+"_"+key).show(500);

              $("#like_"+$index+"_"+key).removeClass('ng-hide');
              
              $("#like_"+$index+"_"+key).css('display', 'inline !important');

            } else {

              UIkit.notify({message : "You disliked the video", timeout : 3000, pos : 'top-center', status : 'warning'});

              $("#like_"+$index+"_"+key).fadeOut(500);

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

  spamVideo = function(admin_video_id, index, key) {

    if (confirm('Are you sure want to spam the video ?')) {

      var reason = $('input[name=reason]:checked').val();

      $.ajax({

        type : "post",

        url : AppGlobal.apiBase + "userApi/add_spam",

        data : {id : this.user_id, token : this.access_token, admin_video_id : admin_video_id,sub_profile_id:this.sub_profile_id , reason : reason},

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

  showVideoDrop = function(event, idx, key) {


    $("#"+idx+"_"+key+"_video_drop").show();

    $('#'+idx+"_"+key).removeClass('transition-class');

    $('#'+idx+"_"+key+"_img").addClass('active_img');

    $('#'+idx+"_"+key+"_desc").hide();	

  $('#'+idx+"_"+key+"_div").addClass('play_icon_div');	

};

hoverIn = function(event, id, key, length) {
  $('#'+id+"_"+key).css('padding', '0');
  $('#'+id+"_"+key+"_desc").css('bottom', '20px');
  var video_drop = $(".video-drop").is(":visible");
  if (!video_drop) {
    $('#'+id+"_"+key).addClass('transition-class');
  } else {
    for(var i = 0; i < length ; i++) {
      $("#"+i+"_"+key+"_video_drop").hide();
      $('#'+i+"_"+key+"_img").removeClass('active_img');
      $('#'+i+"_"+key+"_desc").show();	
      $('#'+i+"_"+key+"_div").removeClass('play_icon_div');	
    }
    $('#'+id+"_"+key+"_img").addClass('active_img');
    $('#'+id+"_"+key+"_desc").hide();	
    $('#'+id+"_"+key+"_div").addClass('play_icon_div');	
    $("#"+id+"_"+key+"_video_drop").show();
  }
};

hoverOut = function(event, id, key, length) {
  var video_drop = $(".video-drop").is(":visible");
  if (video_drop) {
    for(var i = 0; i < length ; i++) {
      $("#"+i+"_"+key+"_video_drop").hide();
      $('#'+i+"_"+key+"_img").removeClass('active_img');
      $('#'+i+"_"+key+"_desc").show();	
      $('#'+i+"_"+key+"_div").removeClass('play_icon_div');	
    }
    $('#'+id+"_"+key+"_img").addClass('active_img');
    $("#"+id+"_"+key+"_video_drop").show();
    $('#'+id+"_"+key+"_desc").hide();	
    $('#'+id+"_"+key+"_div").addClass('play_icon_div');	
  } 
  $('#'+id+"_"+key).removeClass('transition-class');
};

dynamicContent = function(index, key, id) {

  $("#"+index+"_"+key+"_overview").removeClass('active');
  $("#"+index+"_"+key+"_episodes").removeClass('active');
  $("#"+index+"_"+key+"_trailers").removeClass('active');
  $("#"+index+"_"+key+"_more-like").removeClass('active');
  $("#"+index+"_"+key+"_details").removeClass('active');

if (id == "overview") {

    $("#"+index+"_"+key+"_overview").addClass('active');

} else if (id == "episodes") {

    $("#"+index+"_"+key+"_episodes").addClass('active');

} else if (id == "trailers") {

    $("#"+index+"_"+key+"_trailers").addClass('active');
    
  } else if (id == "more-like") {

    $("#"+index+"_"+key+"_more-like").addClass('active');
    
  } else {

    $("#"+index+"_"+key+"_details").addClass('active');
  }
  
  $(".episode-slider").not('.slick-initialized').slick({
    slidesToShow: this.epdisode_slide_to_show,
    slidesToScroll: this.epdisode_slide_to_scroll,
  });

  $(".episode-slider").slick('setPosition');

}

getSeasons = function(genre_id, idx, key, divid, loader, main_id) {

		 
  if (genre_id == '' || genre_id  == undefined) {

    genre_id = main_id;
  }

  $.ajax({

    type : "post",

    url : AppGlobal.apiBase + "userApi/genre-list",

    data : {id : this.user_id, token : this.access_token, genre_id : genre_id},

    async : false,

    beforeSend : function() {

      $("#"+idx+key+divid).html("");

      $("#"+idx+key+loader).show();

    },

    success : function (data) {

      if (data.success) {

        // $("#"+divid).html(data.view);

        console.log($("#"+idx+key+divid));

        $("#"+idx+key+divid).html(data.data);

        $(".episode-slider").not('.slick-initialized').slick({
          slidesToShow: this.epdisode_slide_to_show,
          slidesToScroll: this.epdisode_slide_to_scroll,
        });

        $(".episode-slider").slick('setPosition');

          $('.slick-carousel-responsive').resize();

      } else {

        UIkit.notify({message : 'Something Went Wrong, Please Try again later', timeout : 3000, pos : 'top-center', status : 'danger'});

        return false;
      }
    },
    error : function (data) {

      UIkit.notify({message : 'Something Went Wrong, Please Try again later', timeout : 3000, pos : 'top-center', status : 'danger'});

    },

    complete : function(data) {

      $("#"+idx+key+loader).hide();

    },
  });

}
}
