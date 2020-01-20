import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AppSettings } from '../../app-settings';
import { componentHostSyntheticProperty } from '@angular/core/src/render3';
import { Router } from '@angular/router';
import { FWDEVPlayer } from '../../../assets/evp/start/java/FWDEVPlayer.js';
import { ApiService } from '../../services/api.service';
import { AppGlobal } from 'src/app/app-global';
import { ActivatedRoute } from "@angular/router";
import { Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

declare var $: any;
declare var UIkit: any;

@Component({
  selector: 'app-genre-video',
  templateUrl: './genre-video.component.html',
  styleUrls: ['./genre-video.component.css']
})
export class GenreVideoComponent implements OnInit {

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
  displayPopup;
  video;
  ios_video;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

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
      
      this.video = '';

      this.displayPopup = false;
      this.ios_video = '';
      this.sub_profile_id = this.sessionStorage.sub_profile_id;

    	this.height = $(window).height();

      this.user_type = (this.sessionStorage.user_type == undefined || this.sessionStorage.user_type == 0 ) ? true : false;
      var id = this.route.snapshot.paramMap['params'].id;
      this.apiService.GenreVideo({ id: this.user_id, token: this.access_token, genre_id: id })
       .subscribe(data=>{
         if(data.success){
           this.video = data.model;
           this.embed_link = AppGlobal.apiBase+"g_embed?u_id="+data.model.unique_id;
           this.ios_video = data.ios_video;
         }
         else{
          UIkit.notify({message : data.error_messages, timeout : 3000, pos : 'top-center', status : 'danger'});
          return false;
         }
       })
       var JWPLAYER_KEY = $.grep(this.site_settings, function(e){ return e.key == 'JWPLAYER_KEY'; });
       var jwplayer_key = "";
       if (JWPLAYER_KEY.length == 0) {

        console.log("not found");
        
        } else if (JWPLAYER_KEY.length == 1) {

          jwplayer_key = JWPLAYER_KEY[0].value;

          if (jwplayer_key != '' || jwplayer_key != null || jwplayer_key != undefined) {
            
          } else {

            jwplayer_key = '';

          }

        } else {

          jwplayer_key = "";

        }

      //  jwplayer.key = jwplayer_key;

            if (jwplayer_key == "") {

                UIkit.notify({message :"Configure JWPLAYER KEY, Please Contact Admin", timeout : 3000, pos : 'top-center', status : 'danger'});

                return false;

        }

    }
    else{
      window.localStorage.setItem('logged_in', 'false');
      this.sessionStorage = {};
      localStorage.removeItem("sessionStorage");
      localStorage.clear();
      this.router.navigateByUrl('/');
    }
  }

}
