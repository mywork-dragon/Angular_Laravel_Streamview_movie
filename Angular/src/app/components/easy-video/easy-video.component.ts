import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppSettings } from '../../app-settings';
import { componentHostSyntheticProperty } from '@angular/core/src/render3';
import { Router } from '@angular/router';
import { FWDEVPlayer } from '../../../assets/evp/start/java/FWDEVPlayer.js';
import { ApiService } from '../../services/api.service';
import { RouterExtService } from '../../services/router-ext.service';
import { AppGlobal } from 'src/app/app-global';
import { ActivatedRoute } from "@angular/router";
import { Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import {Title} from "@angular/platform-browser";

declare var $: any;
declare var UIkit: any;

@Component({
  selector: 'app-easy-video',
  templateUrl: './easy-video.component.html',
  styleUrls: ['./easy-video.component.css']
})
export class EasyVideoComponent implements OnInit {
  
  sessionStorage;
  videoFetched:boolean = false;
  user_id;
  access_token;
  site_settings;
  sub_profile_id;
  user_type;
  height;
  page_not_changed;
  videoData = {};
  embed_link;
  player_ins;
  source;
  title = "FWD";
  preUrl;
  id;
  opts = {
    instanceName: 'first-video',
    mainFolderPath: "/assets/fwd-content",
    skinPath: "minimal_skin_dark",
    initializeOnlyWhenVisible: "no",
    displayType: "fullscreen",
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
    fillEntireScreenWithPoster: "no",
    rightClickContextMenu: "default",
    disableDoubleClickFullscreen: "no",
    useChromeless: "no",
    showPreloader: "no", 
    addKeyboardSupport: "yes",
    autoPlay: "yes",
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
    logoLink: "https://admin.flashington.com/uploads/images/SV-2019-09-06-16-54-04-cc603a9ee2b210ea3958f4902c5bad83e475a2e6.png",
    logoMargins: 5,
    //controller settings
    showController: "yes",
    showControllerWhenVideoIsStopped: "no",
    showVolumeScrubber: "yes",
    showVolumeButton: "yes",
    showTime: "yes",
    showQualityButton: "yes",
    showShareButton: "yes",
    showEmbedButton: "no",
    showDownloadButton: "no",
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

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private RouterExtService: RouterExtService,
    private titleService:Title
  ) { this.titleService.setTitle(AppGlobal.title+" | Videos"); }
  private addVideoSource(videoLink) {
    this.opts.videoSource.push(
      { source: videoLink, label: "small version", is360: "yes" }
    )
    this.videoFetched = true;
  } 
  ngOnInit() {
    
    this.sessionStorage = JSON.parse(localStorage.sessionStorage);
    this.site_settings = AppSettings.settings;
    this.user_id = (this.sessionStorage['user_id'] != '' && this.sessionStorage['user_id'] != undefined ) ? this.sessionStorage['user_id'] : false;
    this.access_token = (this.sessionStorage['access_token'] != undefined && this.sessionStorage['access_token'] != '') ? this.sessionStorage['access_token'] : '';

    if (this.user_id && this.access_token) {
            this.sub_profile_id = this.sessionStorage['sub_profile_id'];
            this.user_type = (this.sessionStorage['user_type'] == undefined || this.sessionStorage['user_type'] == 0) ? true : false;
            this.height = $(window).height();
            this.page_not_changed = true;
            var id = this.route.snapshot.paramMap['params'].id;
            this.id = 'https://flashington.com/popupVideo/'+id;
            this.watchCount(id);
            this.apiService.getSingleVideo({id: this.user_id, token: this.access_token, device_type: 'web',admin_video_id: id })
              .subscribe(data=>{
                if(data.success){
                        this.videoData = data;
                        this.embed_link = AppGlobal.apiBase + "embed?v_t=2&u_id=" + data.video.unique_id;
                        this.sessionStorage['saved_subscription_video_id'] = "";
                        localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));
                        if (this.videoData['pay_per_view_status']) {

                      } else {
                       
                        this.page_not_changed = false;
                        this.sessionStorage['saved_subscription_video_id'] = this.route.snapshot.paramMap['params'].id;
                        localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));
                        this.router.navigateByUrl('pay_per_view/'+this.videoData['video'].admin_video_id);

                      }
                      if (this.videoData['pay_per_view_status'] && this.videoData['video'].amount <= 0) {
                        if (this.user_type) {
                            this.page_not_changed = false;
                            this.sessionStorage.saved_subscription_video_id = this.route.snapshot.paramMap['params'].id;
                            localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));
                            this.router.navigateByUrl('/subscriptions/'+this.sessionStorage.sub_profile_id);
                        }
                    }

                    if (this.page_not_changed) {
                      this.sessionStorage.continous_watch_video_id = this.route.snapshot.paramMap['params'].id;
                      this.sessionStorage.continous_sub_profile_id = this.sessionStorage.sub_profile_id;
                      localStorage.setItem('sessionStorage', JSON.stringify(this.sessionStorage));
                      this.player_ins = "ins_" + this.videoData['video'].admin_video_id;
                      this.source = this.videoData['video'].video;
                      this.addVideoSource(this.source);
                     
                      
                    $("html>div").css("z-index", 1000);    
                  };
                }
                else{
                    UIkit.notify({ message: data.error_messages, timeout: 3000, pos: 'top-center', status: 'danger' });
                    return false;
                }
            });
    }
    else{
      window.localStorage.setItem('logged_in', 'false');
      this.sessionStorage = {};
      localStorage.removeItem("sessionStorage");
      localStorage.clear();
      this.router.navigateByUrl('/');
    }
  }

  watchCount(videoId) {
    this.apiService.setWatchCount({ id: this.user_id, token: this.access_token, admin_video_id: videoId }).
    subscribe(data => {
      console.log("dd", data);
    })
  }
  
  redirect = function(){
    $("html>div").remove();
    // window.location.replace('/video');
    this.router.navigateByUrl('/');
    location.reload();
}

 openPopup = function(htmlPage, width, height){
   window.open(htmlPage,"",'width=' + '1000px' + ', height=' + '650px' + ', top=' + '300px' + ', left=' + '700px');
};	
}
