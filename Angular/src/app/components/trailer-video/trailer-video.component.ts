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
  selector: 'app-trailer-video',
  templateUrl: './trailer-video.component.html',
  styleUrls: ['./trailer-video.component.css']
})

export class TrailerVideoComponent implements OnInit {

  sessionStorage;
  user_id;
  access_token;
  sub_profile_id;
  user_type;
  height;
  page_not_changed;
  videoData;
  embed_link;
  continous_watch_video_id;
  continous_sub_profile_id;
  videoFile;
  title = "FWD";
  videoFetched:boolean = false;
  opts = {
    instanceName: 'first-video',
    mainFolderPath: "/assets/fwd-content",
    skinPath: "minimal_skin_dark",
    initializeOnlyWhenVisible: "no",
    displayType: "responsive",
    autoScale: "yes",
    fillEntireVideoScreen: "no",
    openDownloadLinkOnMobile: "no",
    useHEXColorsForSkin: "no",
    normalHEXButtonsColor: "#FF0000",
    selectedHEXButtonsColor: "#FFFFFF",
    privateVideoPassword: "428c841430ea18a70f7b06525d4b748a",
    startAtTime: "",
    stopAtTime: "",
    startAtVideoSource: 2,
    videoSource: [
    ],
    posterPath: "/assets/fwd-content/posters/360.jpg",
    showErrorInfo: "yes",
    fillEntireScreenWithPoster: "yes",
    rightClickContextMenu: "default",
    disableDoubleClickFullscreen: "no",
    useChromeless: "no",
    showPreloader: "yes", 
    addKeyboardSupport: "yes",
    autoPlay: "no",
    loop: "no",
    maxWidth: 2500,
    maxHeight: 1500,
    volume: .8,
    greenScreenTolerance: 200,
    backgroundColor: "#000000",
    posterBackgroundColor: "#0099FF",
    //logo settings
    showLogo: "yes",
    hideLogoWithController: "yes",
    logoPosition: "topRight",
    logoLink: "http://www.webdesign-flash.ro",
    logoMargins: 5,
    //controller settings
    showController: "yes",
    showControllerWhenVideoIsStopped: "yes",
    showVolumeScrubber: "yes",
    showVolumeButton: "yes",
    showTime: "yes",
    showQualityButton: "yes",
    showShareButton: "yes",
    showEmbedButton: "yes",
    showDownloadButton: "yes",
    showFullScreenButton: "yes",
    repeatBackground: "yes",
    controllerHeight: 41,
    controllerHideDelay: 3,
    startSpaceBetweenButtons: 7,
    spaceBetweenButtons: 9,
    mainScrubberOffestTop: 14,
    scrubbersOffsetWidth: 4,
    timeOffsetLeftWidth: 5,
    timeOffsetRightWidth: 3,
    volumeScrubberWidth: 80,
    volumeScrubberOffsetRightWidth: 0,
    timeColor: "#888888",
    youtubeQualityButtonNormalColor: "#888888",
    youtubeQualityButtonSelectedColor: "#FFFFFF",
    //cuepoints
    executeCuepointsOnlyOnce: "no",
    //subtitles
    showSubtitleButton: "yes",
    subtitlesOffLabel: "Subtitle off",
    startAtSubtitle: 1,
    //audio visualizer
    audioVisualizerLinesColor: "#0099FF",
    audioVisualizerCircleColor: "#FFFFFF",
    //advertisement on pause window
    aopwTitle: "Advertisement",
    aopwSource: "",
    aopwWidth: 400,
    aopwHeight: 240,
    aopwBorderSize: 6,
    aopwTitleColor: "#FFFFFF",
    //playback rate / speed
    showPlaybackRateButton: "no",
    defaultPlaybackRate: "1", //0.25, 0.5, 1, 1.25, 1.5, 2
    //embed window
    embedWindowCloseButtonMargins: 0,
    borderColor: "#333333",
    mainLabelsColor: "#FFFFFF",
    secondaryLabelsColor: "#a1a1a1",
    shareAndEmbedTextColor: "#5a5a5a",
    inputBackgroundColor: "#000000",
    inputColor: "#FFFFFF"

  };
  id;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) { this.titleService.setTitle(AppGlobal.title+' | Trailer')}

  private addVideoSource(videoLink) {
    this.opts.videoSource.push(
      { source: videoLink, label: "small version", is360: "yes" }
    )
    this.videoFetched = true;
  } 

  ngOnInit() {
    this.sessionStorage = JSON.parse(localStorage.sessionStorage);
    this.user_id = (this.sessionStorage.user_id != '' && this.sessionStorage.user_id != undefined) ? this.sessionStorage.user_id : false;
    this.access_token = (this.sessionStorage.access_token != undefined && this.sessionStorage.access_token != '') ? this.sessionStorage.access_token : '';
    if (this.user_id && this.access_token) {
            this.sub_profile_id = this.sessionStorage.sub_profile_id;
            this.user_type = (this.sessionStorage.user_type == undefined || this.sessionStorage.user_type == 0) ? true : false;
            this.height = $(window).height();
            this.page_not_changed = true;

            var id = this.route.snapshot.paramMap['params'].id;
            this.id = this.id = 'https://flashington.com/popupVideo/'+id;
            this.apiService.getSingleVideo({ id: this.sessionStorage.user_id, token: this.sessionStorage.access_token, admin_video_id: id, device_type: 'web'})
              .subscribe(data=>{
                if(data.success){
                  this.videoData = data;console.log('this is trailer video', this.videoData);
                  this.embed_link = AppGlobal.apiBase + "embed?v_t=2&u_id=" + data.video.unique_id;
                  this.sessionStorage.saved_subscription_video_id = "";
                  localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));
                
                if (this.videoData.pay_per_view_status) {

                } else {
                    this.page_not_changed = false;
                    this.sessionStorage.saved_subscription_video_id = this.route.snapshot.paramMap['params'].id;
                    localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));
                    this.router.navigateByUrl('/pay_per_view'+this.videoData.video.admin_video_id);
                }
                if (this.videoData.pay_per_view_status && this.videoData.video.amount <= 0) {
                  if (this.user_type) {
                      this.page_not_changed = false;
                      this.sessionStorage.saved_subscription_video_id = this.route.snapshot.paramMap['params'].id;
                      localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));
                      this.router.navigateByUrl('/subscriptions'+this.sessionStorage.sub_profile_id);
                  }
              }

              if (this.page_not_changed) {
                this.sessionStorage.continous_watch_video_id = this.route.snapshot.paramMap['params'].id;
                this.sessionStorage.continous_sub_profile_id = this.sessionStorage.sub_profile_id;
                localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));
                console.log(this.videoData)
                var videoId = this.getId(this.videoData['trailer_video']);
                if(videoId != 'error'){
                    this.videoFile = "www.youtube.com/embed/" + videoId;
                } else {
                    this.videoFile = this.videoData.trailer_video;
                }
                this.addVideoSource(this.videoFile);
              }
            }
            else{
              UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });
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

redirect = function(){
    $("html>div").remove();
    window.location.replace(this.prevUrl);
    location.reload();
}

getId(url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);

  if (match && match[2].length == 11) {
      return match[2];
  } else {
      return 'error';
  }
}

openPopup = function(htmlPage, width, height){
  // var left = parseInt(((window.innerWidth) - width)/2);
  // var top =  parseInt(((window.innerHeight) - height)/2);
   window.open(htmlPage,"",'width=' + '1000px' + ', height=' + '650px' + ', top=' + '300px' + ', left=' + '700px');

};	

}
