/* Data */
(function(window){
	
	var FWDEVPData = function(props, playListElement, root){
		
		var self = this;
		var prototype = FWDEVPData.prototype;
		
		this.skipIconPath_img = null;
		this.mainPreloader_img = null;
		this.bkLeft_img = null;
		this.bkMiddle_img = null;
		this.bkRight_img = null;
		this.playN_img = null;
		this.pauseN_img = null;
		this.mainScrubberBkLeft_img = null;
		this.mainScrubberBkRight_img = null;
		this.mainScrubberDragLeft_img = null;
		this.mainScrubberLine_img = null;
		this.volumeScrubberBkLeft_img = null;
		this.volumeScrubberBkRight_img = null;
		this.volumeScrubberDragLeft_img = null;
		this.volumeScrubberLine_img = null;
		this.volumeN_img = null;
		this.progressLeft_img = null;
		this.largePlayN_img = null;
		this.fullScreenN_img = null;
		this.ytbQualityN_img = null;
		this.ytbQualityD_img = null;
		this.shareN_img = null;
		this.normalScreenN_img = null;
		this.embedN_img = null;
		this.embedColoseN_img = null;
	
		this.props_obj = props;
		this.skinPaths_ar = [];
		this.images_ar = [];
	
		this.skinPath_str = null;
		this.flashPath_str = null;
		this.flashCopyToCBPath_str = null;
		this.mainFolderPath_str = null;
		this.bkMiddlePath_str = null;
		this.hdPath_str = null;
		this.youtubeQualityArrowPath_str = null;
		this.mainScrubberBkMiddlePath_str = null;
		this.volumeScrubberBkMiddlePath_str = null;
		this.mainScrubberDragMiddlePath_str = null;
		this.volumeScrubberDragMiddlePath_str = null;
		this.timeColor_str = null;
		this.progressMiddlePath_str = null;
		this.facebookAppId_str = null;
		this.ytbQualityButtonPointerPath_str = null;
		this.youtubeQualityButtonNormalColor_str = null;
		this.youtubeQualityButtonSelectedColor_str = null;
		this.controllerBkPath_str = null;
		this.logoPosition_str = null;
		this.logoPath_str = null;
		this.shareAndEmbedTextColor_str = null;
		this.inputBackgroundColor_str = null;
		this.borderColor_str = null;
		this.inputColor_str = null;
		this.secondaryLabelsColor_str = null;
		this.mainLabelsColor_str = null;
		this.embedPathS_str = null;
		this.embedWindowClosePathS_str = null;
		this.embedWindowInputBackgroundPath_str = null;
		this.embedCopyButtonNPath_str = null;
		this.embedCopyButtonSPath_str = null;
		this.sendButtonNPath_str = null;
		this.sendButtonSPath_str = null;
		this.embedWindowBackground_str = null;
		
		this.controllerHeight = 0;
		this.countLoadedSkinImages = 0;
		this.volume = 1;
		this.controllerHideDelay = 0;
		this.startSpaceBetweenButtons = 0;
		this.spaceBetweenButtons = 0;
		this.scrubbersOffsetWidth = 0;
		this.volumeScrubberOffsetRightWidth = 0;
		this.timeOffsetLeftWidth = 0;
		this.timeOffsetTop = 0;
		this.logoMargins = 0;
		this.embedWindowCloseButtonMargins = 0;
		
		this.loadImageId_to;
		this.dispatchLoadSkinCompleteWithDelayId_to;
		
		this.showEmbedButton_bl;
		this.showShareButton_bl;
		this.allowToChangeVolume_bl = true;
		this.showContextMenu_bl = false;
		this.autoPlay_bl = false;
		this.showPoster_bl = false;
		this.loop_bl = false;
		this.showVolumeScrubber_bl = false;
		this.showVolumeButton_bl = false;
		this.showControllerWhenVideoIsStopped_bl = false;
		this.showLogo_bl = false;
		this.hideLogoWithController_bl = false;
		this.isMobile_bl = FWDEVPUtils.isMobile;
		this.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
	
		//###################################//
		/*init*/
		//###################################//
		self.init = function(){
			self.parseProperties();
		};
		
		//#############################################//
		// parse properties.
		//#############################################//
		self.parseProperties = function(){
			
			self.useHEXColorsForSkin_bl = self.props_obj.useHEXColorsForSkin; 
			self.useHEXColorsForSkin_bl = self.useHEXColorsForSkin_bl == "yes" ? true : false;
			if(location.protocol.indexOf("file:") != -1) self.useHEXColorsForSkin_bl = false;
			
			self.mainFolderPath_str = self.props_obj.mainFolderPath;
			if(!self.mainFolderPath_str){
				setTimeout(function(){
					if(self == null) return;
					errorMessage_str = "The <font color='#FF0000'>mainFolderPath</font> property is not defined in the constructor function!";
					self.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
			
			if((self.mainFolderPath_str.lastIndexOf("/") + 1) != self.mainFolderPath_str.length){
				self.mainFolderPath_str += "/";
			}
			
			self.skinPath_str = self.props_obj.skinPath;
			if(!self.skinPath_str){
				setTimeout(function(){
					if(self == null) return;
					errorMessage_str = "The <font color='#FF0000'>skinPath</font> property is not defined in the constructor function!";
					self.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
			
			/*
			if(!self.useHEXColorsForSkin_bl){
				if(self.skinPath_str.indexOf("dark") != -1){
					self.skinPath_str = "minimal_skin_dark"
				}else if(self.skinPath_str.indexOf("white") != -1){
					self.skinPath_str = "minimal_skin_white";
				}
			}
			*/
			
			if((self.skinPath_str.lastIndexOf("/") + 1) != self.skinPath_str.length){
				self.skinPath_str += "/";
			}
			
			
			
			self.skinPath_str = self.mainFolderPath_str + self.skinPath_str;
			self.flashPath_str = self.mainFolderPath_str + "flashlsChromeless.swf";
			self.flashCopyToCBPath_str = self.mainFolderPath_str + "cb.swf";
			self.sendToAFriendPath_str = self.mainFolderPath_str + "sendMailToAFriend.php"; 
			self.videoDownloaderPath_str = self.mainFolderPath_str  + "downloader.php";
			self.mailPath_str = self.mainFolderPath_str  + "sendMail.php";
			self.hlsPath_str = self.mainFolderPath_str  + "java/hls.js";
			self.threeJsPath_str = self.mainFolderPath_str  + "java/three.js";
			self.threeJsControlsPath_str = self.mainFolderPath_str  + "java/threeControled.js";

			
			//self.videoSourcePath_str = self.props_obj.videoSourcePath || undefined;
			self.timeColor_str = self.props_obj.timeColor || "#FF0000";
			
			self.privateVideoPassword_str = self.props_obj.privateVideoPassword;
			
			self.adsVideoSourcePath_str = self.props_obj.adsVideoSourcePath;
			self.adsPageToOpenURL_str = self.props_obj.adsPageToOpenURL;
			self.adsPageToOpenTarget_str = self.props_obj.adsPageToOpenTarget || "_blank";
			self.adsThumbnailPath_str = self.props_obj.adsThumbnailPath;
		
			self.youtubeQualityButtonNormalColor_str = self.props_obj.youtubeQualityButtonNormalColor || "#FF0000";
			self.youtubeQualityButtonSelectedColor_str = self.props_obj.youtubeQualityButtonSelectedColor || "#FF0000";
			self.posterBackgroundColor_str = self.props_obj.posterBackgroundColor || "transparent";
			
			self.logoPosition_str = self.props_obj.logoPosition || "topleft";
			self.logoPosition_str = String(self.logoPosition_str).toLowerCase();
			test = self.logoPosition_str == "topleft" 
					   || self.logoPosition_str == "topright"
					   || self.logoPosition_str == "bottomleft"
					   || self.logoPosition_str == "bottomright";
						   
			if(!test) self.logoPosition_str = "topleft";
			
			self.adsButtonsPosition_str = self.props_obj.adsButtonsPosition || "left";
			self.adsButtonsPosition_str = String(self.adsButtonsPosition_str).toLowerCase();
			test = self.adsButtonsPosition_str == "left" 
					   || self.adsButtonsPosition_str == "right";
					 	   
			if(!test) self.adsButtonsPosition_str = "left";
			
			
			self.rightClickContextMenu_str = self.props_obj.rightClickContextMenu || "developer";
			test = self.rightClickContextMenu_str == "developer" 
				   || self.rightClickContextMenu_str == "disabled"
				   || self.rightClickContextMenu_str == "default";
			if(!test) self.rightClickContextMenu_str = "developer";
			
			self.logoLink_str = self.props_obj.logoLink || "none";
			self.skipToVideoButtonText_str = self.props_obj.skipToVideoButtonText || "not defined";
			
			self.skipToVideoText_str = self.props_obj.skipToVideoText;
			
			self.shareAndEmbedTextColor_str = self.props_obj.shareAndEmbedTextColor || "#FF0000";
			self.inputBackgroundColor_str = self.props_obj.inputBackgroundColor || "#FF0000";
			self.borderColor_str = self.props_obj.borderColor || "#FF0000";
			self.inputColor_str = self.props_obj.inputColor || "#FF0000";
			self.secondaryLabelsColor_str = self.props_obj.secondaryLabelsColor || "#FF0000"; 
			self.mainLabelsColor_str = self.props_obj.mainLabelsColor || "#FF0000"; 
			self.adsTextNormalColor = self.props_obj.adsTextNormalColor || "#FF0000";
			self.adsTextSelectedColor = self.props_obj.adsTextSelectedColor || "#FF0000";
			self.adsBorderNormalColor_str = self.props_obj.adsBorderNormalColor || "#FF0000";
			self.adsBorderSelectedColor_str = self.props_obj.adsBorderSelectedColor || "#FF0000";
			
			self.normalButtonsColor_str = self.props_obj.normalHEXButtonsColor || "#FFFFFF";
			self.selectedButtonsColor_str = self.props_obj.selectedHEXButtonsColor || "#999999";
		
			self.volume = self.props_obj.volume;
			if(self.volume == undefined) self.volume = 1;
			if(isNaN(self.volume)) volume = 1;
			
			if(self.volume > 1){
				self.volume = 1;
			}else if(self.volume <=0){
				self.volume = 0;
			}
			
			self.audioVisualizerLinesColor_str = self.props_obj.audioVisualizerLinesColor || "#0099FF";
			self.audioVisualizerCircleColor_str = self.props_obj.audioVisualizerCircleColor || "#00FF00";
			
			self.controllerHeight = self.props_obj.controllerHeight || 50;
			self.startSpaceBetweenButtons = self.props_obj.startSpaceBetweenButtons || 0;
			self.controllerHideDelay = self.props_obj.controllerHideDelay || 2;
			self.controllerHideDelay *= 1000;
			self.spaceBetweenButtons = self.props_obj.spaceBetweenButtons || 0;
			self.scrubbersOffsetWidth = self.props_obj.scrubbersOffsetWidth || 0;
			self.volumeScrubberOffsetRightWidth = self.props_obj.volumeScrubberOffsetRightWidth || 0;
			self.timeOffsetLeftWidth = self.props_obj.timeOffsetLeftWidth || 0;
			self.timeOffsetRightWidth = self.props_obj.timeOffsetRightWidth || 0;
			self.timeOffsetTop = self.props_obj.timeOffsetTop || 0;
			self.embedWindowCloseButtonMargins = self.props_obj.embedWindowCloseButtonMargins || 0;
			self.logoMargins = self.props_obj.logoMargins || 0;
			self.mainScrubberOffestTop = self.props_obj.mainScrubberOffestTop || 0;
			self.volumeScrubberWidth = self.props_obj.volumeScrubberWidth || 10;
			if(self.volumeScrubberWidth > 200) self.volumeScrubberWidth = 200;
			self.timeToHoldAds = 4;

			self.greenScreenTolerance = self.props_obj.greenScreenTolerance || 200;
			
			
			if(self.isMobile_bl) self.allowToChangeVolume_bl = false;
			
			self.showContextMenu_bl = self.props_obj.showContextMenu; 
			self.showContextMenu_bl = self.showContextMenu_bl == "no" ? false : true;
			
			self.showDefaultControllerForVimeo_bl = self.props_obj.showDefaultControllerForVimeo; 
			self.showDefaultControllerForVimeo_bl = self.showDefaultControllerForVimeo_bl == "yes" ? true : false;

			self.showScrubberWhenControllerIsHidden_bl = self.props_obj.showScrubberWhenControllerIsHidden; 
			self.showScrubberWhenControllerIsHidden_bl = self.showScrubberWhenControllerIsHidden_bl == "no" ? false : true;

			self.addKeyboardSupport_bl = self.props_obj.addKeyboardSupport; 
			self.addKeyboardSupport_bl = self.addKeyboardSupport_bl == "no" ? false : true;
			
			self.autoPlay_bl = self.props_obj.autoPlay; 
			self.autoPlay_bl = self.autoPlay_bl == "yes" ? true : false;
			if(FWDEVPUtils.isMobile) self.autoPlay_bl = false;
			
			self.showContextmenu_bl = self.props_obj.showContextmenu;
			self.showContextmenu_bl = self.showContextmenu_bl == "no" ? false : true;
		
			
			self.scrubAtTimeAtFirstPlay = self.props_obj.scrubAtTimeAtFirstPlay || "00:00:00";
			self.scrubAtTimeAtFirstPlay = FWDEVPUtils.getSecondsFromString(self.scrubAtTimeAtFirstPlay);
			
			self.loop_bl = self.props_obj.loop; 
			self.loop_bl = self.loop_bl == "yes" ? true : false;
			
			self.showSkipButton_bl = true;
			
			self.showLogo_bl = self.props_obj.showLogo; 
			self.showLogo_bl = self.showLogo_bl == "yes" ? true : false;
			
			
			self.showRewindButton_bl = self.props_obj.showRewindButton; 
			self.showRewindButton_bl = self.showRewindButton_bl == "yes" ? true : false;
			
			
			self.openDownloadLinkOnMobile_bl = self.props_obj.openDownloadLinkOnMobile; 
			self.openDownloadLinkOnMobile_bl = self.openDownloadLinkOnMobile_bl == "yes" ? true : false;
			
			self.thumbnailsPreview = self.props_obj.thumbnailsPreview || false;
			
			self.thumbnailsPreviewWidth = self.props_obj.thumbnailsPreviewWidth || 300
			self.thumbnailsPreviewHeight = self.props_obj.thumbnailsPreviewHeight || 168
			self.thumbnailsPreviewBackgroundColor =  self.props_obj.thumbnailsPreviewBackgroundColor || "#000";
			self.thumbnailsPreviewBorderColor =	self.props_obj.thumbnailsPreviewBorderColor || "#333";
			self.thumbnailsPreviewLabelBackgroundColor =	self.props_obj.thumbnailsPreviewLabelBackgroundColor || "#FFF";
			self.thumbnailsPreviewLabelFontColor =	self.props_obj.thumbnailsPreviewLabelFontColor || "#000";

			self.contextMenuBackgroundColor_str = self.props_obj.contextMenuBackgroundColor || "#000000";
			self.contextMenuBorderColor_str = self.props_obj.contextMenuBorderColor || "#FF0000";
			self.contextMenuSpacerColor_str = self.props_obj.contextMenuSpacerColor || "#FF0000";
			self.contextMenuItemNormalColor_str = self.props_obj.contextMenuItemNormalColor || "#FF0000";
			self.contextMenuItemSelectedColor_str = self.props_obj.contextMenuItemSelectedColor || "#FF0000";
			self.contextMenuItemDisabledColor_str = self.props_obj.contextMenuItemDisabledColor || "#FF0000";
		
			//loggin
			self.playVideoOnlyWhenLoggedIn_bl = self.props_obj.playVideoOnlyWhenLoggedIn; 
			self.playVideoOnlyWhenLoggedIn_bl = self.playVideoOnlyWhenLoggedIn_bl == "yes" ? true : false;
			
			self.isLoggedIn_bl = self.props_obj.isLoggedIn; 
			self.isLoggedIn_bl = self.isLoggedIn_bl == "yes" ? true : false;
			
			self.useVectorIcons_bl = self.props_obj.useVectorIcons; 
			self.useVectorIcons_bl = self.useVectorIcons_bl == "yes" ? true : false;
					
			self.loggedInMessage_str = self.props_obj.loggedInMessage || "Only loggedin users can view this video";
					
			self.hideLogoWithController_bl = self.props_obj.hideLogoWithController; 
			self.hideLogoWithController_bl = self.hideLogoWithController_bl == "yes" ? true : false;
			
			self.showDefaultControllerForVimeo_bl = self.props_obj.showDefaultControllerForVimeo; 
			self.showDefaultControllerForVimeo_bl = self.showDefaultControllerForVimeo_bl == "yes" ? true : false;
			
			self.aopwSource = self.props_obj.aopwSource; 
			self.aopwBorderSize = self.props_obj.aopwBorderSize || 0; 
			self.aopwTitle = self.props_obj.aopwTitle || "Advertisement";
			self.aopwTitleColor_str = self.props_obj.aopwTitleColor || "#FFFFFF"; 
			
			self.openerAlignment_str = self.props_obj.openerAlignment;
			self.openerEqulizerOffsetTop = self.props_obj.openerEqulizerOffsetTop || 0;
			self.openerEqulizerOffsetLeft = self.props_obj.openerEqulizerOffsetLeft || 0;
			
			self.showOpener_bl = self.props_obj.showOpener; 
			self.showOpener_bl = self.showOpener_bl == "yes" ? true : false;
			
			self.showOpenerPlayPauseButton_bl = self.props_obj.showOpenerPlayPauseButton;
			self.showOpenerPlayPauseButton_bl = self.showOpenerPlayPauseButton_bl == "yes" ? true : false;
			
			self.animate_bl = self.props_obj.animatePlayer; 
			self.animate_bl = self.animate_bl == "yes" ? true : false;

			self.showScriptDeveloper_bl = self.props_obj.showScriptDeveloper;
			self.showScriptDeveloper_bl = self.showScriptDeveloper_bl == "yes" ? true : false;
			
			self.useAToB = self.props_obj.useAToB == "yes" ? true : false;
			self.playsinline = self.props_obj.playsinline == "yes" ? true : false;
		
			self.atbTimeBackgroundColor = self.props_obj.atbTimeBackgroundColor || "transparent";
			self.atbTimeTextColorNormal = self.props_obj.atbTimeTextColorNormal ||  "#888888";
			self.atbTimeTextColorSelected = self.props_obj.atbTimeTextColorSelected || "#FFFFFF";
			self.atbButtonTextNormalColor = self.props_obj.atbButtonTextNormalColor || "#888888";
			self.atbButtonTextSelectedColor = self.props_obj.atbButtonTextSelectedColor || "#FFFFFF";
			self.atbButtonBackgroundNormalColor = self.props_obj.atbButtonBackgroundNormalColor || "#FFFFFF";
			self.atbButtonBackgroundSelectedColor = self.props_obj.atbButtonBackgroundSelectedColor || "#000000";

			self.scrubbersToolTipLabelBackgroundColor = self.props_obj.scrubbersToolTipLabelBackgroundColor || "#FFFFFF";
			self.scrubbersToolTipLabelFontColor  = self.props_obj.scrubbersToolTipLabelFontColor || "#000000";
			
			self.showMainScrubberToolTipLabel_bl = self.props_obj.showMainScrubberToolTipLabel;
			self.showMainScrubberToolTipLabel_bl = self.showMainScrubberToolTipLabel_bl == "yes" ? true : false;
			
			if(self.thumbnailsPreview) self.showMainScrubberToolTipLabel_bl = false;
			
			self.aopwWidth = self.props_obj.aopwWidth || 200; 
			self.aopwHeight = self.props_obj.aopwHeight || 200; 
			if(self.aopwSource && String(self.aopwSource.length) > 5){
				self.showAopwWindow_bl = true;
			}else{
				self.showAopwWindow_bl = false;
			}
			
			self.fillEntireScreenWithPoster_bl = self.props_obj.fillEntireScreenWithPoster; 
			self.fillEntireScreenWithPoster_bl = self.fillEntireScreenWithPoster_bl == "yes" ? true : false;
			
			self.startAtTime = self.props_obj.startAtTime;
			if(self.startAtTime == "00:00:00" || !FWDEVPUtils.checkTime(self.startAtTime)) self.startAtTime = undefined;
			
			self.stopAtTime = self.props_obj.stopAtTime;
			if(self.stopAtTime == "00:00:00" || !FWDEVPUtils.checkTime(self.stopAtTime)) self.stopAtTime = undefined;
		
			self.showPoster_bl = self.props_obj.showPoster; 
			self.showPoster_bl = self.showPoster_bl == "yes" ? true : false;
			
			self.showVolumeScrubber_bl = self.props_obj.showVolumeScrubber; 
			self.showVolumeScrubber_bl = self.showVolumeScrubber_bl == "no" ? false : true;
			
			self.showVolumeButton_bl = self.props_obj.showVolumeButton; 
			self.showVolumeButton_bl = self.showVolumeButton_bl == "no" ? false : true;
			
			self.showControllerWhenVideoIsStopped_bl = self.props_obj.showControllerWhenVideoIsStopped; 
			self.showControllerWhenVideoIsStopped_bl = self.showControllerWhenVideoIsStopped_bl == "yes" ? true : false;
			
			self.showTime_bl = self.props_obj.showTime; 
			self.showTime_bl = self.showTime_bl == "no" ? false : true;
			
			self.showAnnotationsPositionTool_bl = self.props_obj.showAnnotationsPositionTool; 
			self.showAnnotationsPositionTool_bl = self.showAnnotationsPositionTool_bl == "yes" ? true : false;
			
			self.showDownloadVideoButton_bl = self.props_obj.showDownloadButton; 
			self.showDownloadVideoButton_bl = self.showDownloadVideoButton_bl == "yes" ? true : false;
			
			self.showFullScreenButton_bl = self.props_obj.showFullScreenButton; 
			self.showFullScreenButton_bl = self.showFullScreenButton_bl == "no" ? false : true;
			
			self.executeCuepointsOnlyOnce_bl = self.props_obj.executeCuepointsOnlyOnce; 
			self.executeCuepointsOnlyOnce_bl = self.executeCuepointsOnlyOnce_bl == "yes" ? true : false;
			
			if(self.showAnnotationsPositionTool_bl) self.showFullScreenButton_bl = false;
			
			self.repeatBackground_bl = self.props_obj.repeatBackground; 
			self.repeatBackground_bl = self.repeatBackground_bl == "no" ? false : true;
			
			self.showShareButton_bl = self.props_obj.showShareButton; 
			self.showShareButton_bl = self.showShareButton_bl == "no" ? false : true;
			
			self.showEmbedButton_bl = self.props_obj.showEmbedButton; 
			self.showEmbedButton_bl = self.showEmbedButton_bl == "no" ? false : true;
			
			self.showController_bl = self.props_obj.showController; 
			self.showController_bl = self.showController_bl == "no" ? false : true;
			
			self.fillEntireVideoScreen_bl = self.props_obj.fillEntireVideoScreen; 
			self.fillEntireVideoScreen_bl = self.fillEntireVideoScreen_bl == "yes" ? true : false;
														    
			self.showSubtitileByDefault_bl = self.props_obj.showSubtitleByDefault; 
			self.showSubtitileByDefault_bl = self.showSubtitileByDefault_bl == "no" ? false : true;

			self.useResumeOnPlay_bl = self.props_obj.useResumeOnPlay; 
			self.useResumeOnPlay_bl = self.useResumeOnPlay_bl == "yes" ? true : false;
			
			self.showPopupAdsCloseButton_bl = self.props_obj.showPopupAdsCloseButton; 
			self.showPopupAdsCloseButton_bl = self.showPopupAdsCloseButton_bl == "no" ? false : true;
			
			self.showSubtitleButton_bl = self.props_obj.showSubtitleButton;
			self.showSubtitleButton_bl = self.showSubtitleButton_bl == "no" ? false : true;
			
			self.useChromeless_bl = self.props_obj.useChromeless;
			self.useChromeless_bl = self.useChromeless_bl == "yes" ? true : false;

			self.stickyOnScrollShowOpener_bl = self.props_obj.stickyOnScrollShowOpener; 
			self.stickyOnScrollShowOpener_bl = self.stickyOnScrollShowOpener_bl == "yes" ? true : false;

			self.hasAds_bl = self.adsVideoSourcePath_str;
			self.hasAds_bl = self.hasAds_bl == "none" ? false : true;
			if(!self.adsVideoSourcePath_str) self.hasAds_bl = false;
		
			self.openNewPageAtTheEndOfTheAds_bl =  self.props_obj.openNewPageAtTheEndOfTheAds;
			self.openNewPageAtTheEndOfTheAds_bl = self.openNewPageAtTheEndOfTheAds_bl == "yes" ? true : false;
			
			self.vastXML = self.props_obj.vastSource;
			self.vastLinearStartTime = self.props_obj.vastLinearStartTime || "00:00:00";
			self.vastNonLinearStartTime = self.props_obj.vastNonLinearStartTime || "00:00:00";
			self.vastClickTroughTarget = self.props_obj.vastClickTroughTarget || "_blank";
			
			self.redirectURL = self.props_obj.redirectURL;
			if(self.redirectURL != undefined && self.redirectURL.length < 4) self.redirectURL = undefined;
			self.redirectTarget = self.props_obj.redirectTarget || "_self";
			if(self.redirectTarget != "_self" 
				&& self.redirectTarget != "_blank" 
				&& self.redirectTarget != "_parent"
			){
				self.redirectTarget = "_blank";
			}
		
			self.showYoutubeQualityButton_bl = self.props_obj.showQualityButton;
			self.showYoutubeQualityButton_bl = self.showYoutubeQualityButton_bl == "no" ? false : true;
			//if(FWDEVPlayer.useYoutube == "no" || self.isMobile_bl) self.showYoutubeQualityButton_bl = false;
			
			self.showPlaybackRateButton_bl = self.props_obj.showPlaybackRateButton;
			self.showPlaybackRateButton_bl = self.showPlaybackRateButton_bl == "yes" ? true : false;
			
			self.defaultPlaybackRate_str = self.props_obj.defaultPlaybackRate;
			self.defaultPlaybackRate_ar = ["0.25", "0.5", "1", "1.25", "1.5", "2"];
			self.startAtPlaybackIndex = 3;
			self.defaultPlaybackRate_ar.reverse();
			var found_bl = false;
			for(var i=0; i<self.defaultPlaybackRate_ar.length; i++){
				if(self.defaultPlaybackRate_ar[i] == self.defaultPlaybackRate_str){
					found_bl = true;
					self.startAtPlaybackIndex = i;
				}
			}
			
			if(!found_bl){
				self.defaultPlaybackRate_str = 1;
			}
			
			//setup skin paths
			self.logoPath_str = self.skinPath_str + "logo.png";
			self.handPath_str = self.skinPath_str + "hand.cur";
			self.grabPath_str = self.skinPath_str + "grab.cur";
			if(self.props_obj.logoPath) self.logoPath_str = self.props_obj.logoPath;
			
			
			
			self.popupAddCloseNPath_str = self.skinPath_str + "close-button-normal.png"; 
			self.popupAddCloseSPath_str = self.skinPath_str + "close-button-selected.png";
			
			self.annotationAddCloseNPath_str = self.skinPath_str + "annotation-close-button-normal.png"; 
			self.annotationAddCloseSPath_str = self.skinPath_str + "annotation-close-button-selected.png";
			
			
			self.adLinePat_str = self.skinPath_str + "ad-line.png";
			self.playSPath_str = self.skinPath_str + "play-over.png"; 
			var pauseNPath_str = self.skinPath_str + "pause.png"; 
			self.pauseSPath_str = self.skinPath_str + "pause-over.png";
			self.bkMiddlePath_str = self.skinPath_str + "controller-middle.png";
			self.hdPath_str = self.skinPath_str + "hd.png";
			self.youtubeQualityArrowPath_str = self.skinPath_str + "youtube-quality-arrow.png";
			self.ytbQualityButtonPointerPath_str = self.skinPath_str + "youtube-quality-pointer.png";
			self.controllerBkPath_str = self.skinPath_str + "controller-background.png";
			self.skipIconSPath_str = self.skinPath_str + "skip-icon-over.png";
			self.adsBackgroundPath_str = self.skinPath_str + "ads-background.png";
			self.showSubtitleSPath_str = self.skinPath_str + "show-subtitle-icon-over.png";
			self.hideSubtitleSPath_str = self.skinPath_str + "hide-subtitle-icon-over.png";
	
			self.mainScrubberBkMiddlePath_str = self.skinPath_str + "scrubber-middle-background.png";
			self.mainScrubberDragMiddlePath_str = self.skinPath_str + "scrubber-middle-drag.png";
			self.mainScrubberDragLeftAddPath_str = self.skinPath_str + "scrubber-left-drag-add.png";
			self.mainScrubberDragMiddleAddPath_str = self.skinPath_str + "scrubber-middle-drag-add.png";
			
			self.volumeScrubberBkMiddlePath_str = self.skinPath_str + "scrubber-middle-background.png";
			self.volumeScrubberDragMiddlePath_str = self.skinPath_str + "scrubber-middle-drag.png";	

			self.volumeSPath_str = self.skinPath_str + "volume-over.png";
			self.volumeDPath_str = self.skinPath_str + "volume-disabled.png";
			self.largePlayS_str = self.skinPath_str + "large-play-over.png";
			self.fullScreenSPath_str = self.skinPath_str + "full-screen-over.png";
			self.ytbQualitySPath_str = self.skinPath_str + "youtube-quality-over.png";
			self.ytbQualityDPath_str = self.skinPath_str + "youtube-quality-hd.png";
			self.shareSPath_str = self.skinPath_str + "share-over.png";
			self.normalScreenSPath_str = self.skinPath_str + "normal-screen-over.png";
			
			self.progressMiddlePath_str = self.skinPath_str + "progress-middle.png";
			
			self.embedPathS_str = self.skinPath_str + "embed-over.png"; 
			self.embedWindowClosePathS_str = self.skinPath_str + "embed-close-button-over.png"; 
			self.shareWindowClosePathS_str = self.skinPath_str + "embed-close-button-over.png"; 
			self.embedWindowInputBackgroundPath_str = self.skinPath_str + "embed-window-input-background.png";
			self.embedCopyButtonNPath_str = self.skinPath_str + "embed-copy-button.png";;
			self.embedCopyButtonSPath_str = self.skinPath_str + "embed-copy-button-over.png";
			self.sendButtonNPath_str = self.skinPath_str + "send-button.png";
			self.sendButtonSPath_str = self.skinPath_str + "send-button-over.png";
			self.embedWindowBackground_str = self.skinPath_str + "embed-window-background.png";
			self.playbackRateSPath_str = self.skinPath_str + "playback-rate-selected.png";
			self.passButtonNPath_str = self.skinPath_str + "pass-button.png";
			self.passButtonSPath_str = self.skinPath_str + "pass-button-over.png";
			
			self.mainPreloader_img = new Image();
			self.mainPreloader_img.onerror = self.onSkinLoadErrorHandler;
			self.mainPreloader_img.onload = self.onPreloaderLoadHandler;
			self.mainPreloader_img.src = self.skinPath_str + "preloader.jpg";
			
			self.annotiationsListId_str = self.props_obj.annotiationsListId;
			
			
			//annotations
			self.annotations_el = FWDEVPUtils.getChildById(self.annotiationsListId_str);
			self.hasAnnotiations_bl = Boolean(self.annotations_el);
			
			if(self.hasAnnotiations_bl){
				var annotations_ar = FWDEVPUtils.getChildren(self.annotations_el);
				self.annotations_ar = [];
				
				var child;
				var tt = annotations_ar.length;
				
				
				for(var i=0; i<tt; i++){
					var obj = {};
					child = annotations_ar[i];
				
					obj.start = FWDEVPSubtitle.getDuration(FWDEVPUtils.getAttributeValue(child, "data-start-time"));
					obj.end = FWDEVPSubtitle.getDuration(FWDEVPUtils.getAttributeValue(child, "data-end-time"));
					obj.left = parseInt(FWDEVPUtils.getAttributeValue(child, "data-left"), 10);
					obj.top = parseInt(FWDEVPUtils.getAttributeValue(child, "data-top"), 10);
					
					obj.showCloseButton_bl = FWDEVPUtils.getAttributeValue(child, "data-show-close-button") == "yes" ? true : false; 
					obj.clickSource = FWDEVPUtils.getAttributeValue(child, "data-click-source");
					obj.clickSourceTarget = FWDEVPUtils.getAttributeValue(child, "data-click-source-target");
					obj.normalStateClass = FWDEVPUtils.getAttributeValue(child, "data-normal-state-class");
					obj.selectedStateClass = FWDEVPUtils.getAttributeValue(child, "data-selected-state-class");
					
					obj.content = child.innerHTML;
					
					self.annotations_ar[i] = obj
				}
				
				try{
					self.annotations_el.parentNode.removeChild(self.annotations_el)
				}catch(e){};
			}
			
			
			//video sources
			self.startAtVideoSource = self.props_obj.startAtVideoSource || 0;
			self.videoSource_ar = self.props_obj.videoSource;
			if(self.videoSource_ar){
				self.videosSource_ar = [];
				self.videoLabels_ar = [];
				for(var i=0; i<self.videoSource_ar.length; i++){
					var obj={};
					obj.source = self.videoSource_ar[i]["source"];
					obj.videoType = self.videoSource_ar[i]["videoType"] || "normal";
					
					obj.label = self.videoSource_ar[i]["label"];
					self.videoSource_ar[i].videoType = obj.videoType;
					obj.isLive = self.videoSource_ar[i]["isLive"] || "no";
					obj.isLive = obj.isLive == "yes" ? true : false;
					
					self.videoLabels_ar[i] = self.videoSource_ar[i]["label"];
					obj.isPrivate = self.videoSource_ar[i]["isPrivate"] || "no";
					obj.isPrivate = obj.isPrivate == "yes" ? true : false;
					self.videosSource_ar[i] = obj;
				}
				
				self.videoLabels_ar.reverse();
				if(self.startAtVideoSource > self.videoLabels_ar.length - 1) self.startAtVideoSource = self.videoLabels_ar.length - 1;
			}
			
			if(!self.videosSource_ar || (self.videoLabels_ar && self.videoSource_ar.length == 0)){
				setTimeout(function(){
					if(self == null) return;
					errorMessage_str = "Please specify at least a video source!";
					self.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:errorMessage_str});
				}, 100);
				return;
			}
			
			
			if(self.videoSource_ar[self.startAtVideoSource]["source"].indexOf(".mp4") ==  -1)  self.showDownloadVideoButton_bl = false;
			
			//subtitles
			self.startAtSubtitle = self.props_obj.startAtSubtitle || 0;
			self.subtitlesSource_ar = self.props_obj.subtitlesSource;
			self.subtitlesOffLabel_str = self.props_obj.subtitlesOffLabel || "Subtitle off";
			if(self.subtitlesSource_ar){
				self.subtitles_ar = [];
				for(var i=0; i<self.subtitlesSource_ar.length; i++){
					var obj={};
					obj.source = self.subtitlesSource_ar[i]["subtitlePath"];
					if(obj.source.indexOf("encrypt:") != -1) obj.source = atob(obj.source.substr(8));
					obj.label = self.subtitlesSource_ar[i]["subtileLabel"];
					self.subtitles_ar[i] = obj;
				}
				self.subtitles_ar.splice(0,0, {source:"none", label:self.subtitlesOffLabel_str});
				self.subtitles_ar.reverse();
			}
			
			
			
			if(!self.subtitlesSource_ar) self.showSubtitleButton_bl = false;
			//if(self.subtitlesSource_ar && self.subtitlesSource_ar.length == 1) self.showSubtitleButton_bl = false;
			
			//video popup adds
			self.popupAds_ar = self.props_obj.popupCommercialAdsSource;
			if(self.popupAds_ar){
				for(var i=0; i<self.popupAds_ar.length; i++){
					self.popupAds_ar[i]["timeStart"] = FWDEVPUtils.getSecondsFromString(self.popupAds_ar[i]["timeStart"]);
					self.popupAds_ar[i]["timeEnd"] = FWDEVPUtils.getSecondsFromString(self.popupAds_ar[i]["timeEnd"]);
					self.popupAds_ar[i]["google_ad_width"] = self.popupAds_ar[i]["google_ad_width"] || 600;
					self.popupAds_ar[i]["google_ad_height"] = self.popupAds_ar[i]["google_ad_height"] || 200;
				}
			}
			
			//ads
			self.ads_ar = self.props_obj.adsSource;
			self.adsSource_ar = [];
			if(self.ads_ar){
				for(var i=0; i<self.ads_ar.length; i++){
					var adsObj = {}
					adsObj.timeStart = FWDEVPUtils.getSecondsFromString(self.ads_ar[i]["timeStart"]);
					adsObj.addDuration = FWDEVPUtils.getSecondsFromString(self.ads_ar[i]["addDuration"]) || 10;
					adsObj.thumbnailSource = self.ads_ar[i]["thumbnailSource"];
					
					adsObj.timeToHoldAds = self.ads_ar[i]["timeToHoldAds"] || 0;
					adsObj.source = self.ads_ar[i]["source"];
					adsObj.link = self.ads_ar[i]["link"];
					adsObj.target = self.ads_ar[i]["target"];
					self.adsSource_ar[i] = adsObj;
				}
			}
			
			
			
			//cue points
			self.cuePoints_ar = self.props_obj.cuepoints;
			self.cuePointsSource_ar = [];
			if(self.cuePoints_ar){
				for(var i=0; i<self.cuePoints_ar.length; i++){
					var cuePointsObj = {}
					cuePointsObj.timeStart = FWDEVPUtils.getSecondsFromString(self.cuePoints_ar[i]["timeStart"]);
					cuePointsObj.javascriptCall = self.cuePoints_ar[i]["javascriptCall"];
					cuePointsObj.isPlayed_bl = false;
					
					self.cuePointsSource_ar[i] = cuePointsObj;
				}
			}
		
			if(!self.useChromeless_bl){
				
				self.skinPaths_ar = [
				     {img:self.largePlayN_img = new Image(), src:self.skinPath_str + "large-play.png"},
				     {img:self.skipIconPath_img = new Image(), src:self.skinPath_str + "skip-icon.png"}
				];

				if(self.showController_bl){
					self.skinPaths_ar.push( 
					     {img:self.mainScrubberBkLeft_img = new Image(), src:self.skinPath_str + "scrubber-left-background.png"},
					     {img:self.mainScrubberBkRight_img = new Image(), src:self.skinPath_str + "scrubber-right-background.png"},
					     {img:self.mainScrubberDragLeft_img = new Image(), src:self.skinPath_str + "scrubber-left-drag.png"},
					     {img:self.mainScrubberLine_img = new Image(), src:self.skinPath_str + "scrubber-line.png"},
					     {img:self.volumeScrubberBkLeft_img = new Image(), src:self.skinPath_str + "scrubber-left-background.png"},
					     {img:self.volumeScrubberBkRight_img = new Image(), src:self.skinPath_str + "scrubber-right-background.png"},
					     {img:self.volumeScrubberDragLeft_img = new Image(), src:self.skinPath_str + "scrubber-left-drag.png"},
					     {img:self.volumeScrubberLine_img = new Image(), src:self.skinPath_str + "scrubber-line.png"},
					     {img:self.progressLeft_img = new Image(), src:self.skinPath_str + "progress-left.png"}
					)
				}
				
				if((self.showOpener_bl && root.displayType == FWDEVPlayer.STICKY) 
					|| (self.stickyOnScrollShowOpener_bl && root.stickyOnScroll)){
					self.skinPaths_ar.push(
					     {img:self.openerPauseN_img = new Image(), src:self.skinPath_str + "open-pause-button-normal.png"},
						 {img:self.openerPlayN_img = new Image(), src:self.skinPath_str + "open-play-button-normal.png"},
						 {img:self.animationPath_img = new Image(), src:self.skinPath_str + "equalizer.png"},
						 {img:self.closeN_img = new Image(), src:self.skinPath_str + "opener-close.png"},
						 {img:self.openTopN_img = new Image(), src:self.skinPath_str + "open-button-normal-top.png"},
						 {img:self.openBottomN_img = new Image(), src:self.skinPath_str + "open-button-normal-bottom.png"}
						 
					)
					self.openerPauseS_str = self.skinPath_str + "open-pause-button-selected.png";
					self.openerPlayS_str = self.skinPath_str + "open-play-button-selected.png";
					self.openerAnimationPath_str = self.skinPath_str + "equalizer.png";	
					self.openTopSPath_str = self.skinPath_str + "open-button-selected-top.png";	
					self.openBottomSPath_str = self.skinPath_str + "open-button-selected-bottom.png";	
					self.openTopSPath_str = self.skinPath_str + "open-button-selected-top.png";
					self.openBottomSPath_str = self.skinPath_str + "open-button-selected-bottom.png";
					
					self.closeSPath_str = self.skinPath_str + "opener-close-over.png"
				}
				
				if(self.showRewindButton_bl){
					self.skinPaths_ar.push(
					     {img:self.rewindN_img = new Image(), src:self.skinPath_str + "rewind.png"}
					)
					self.rewindSPath_str = self.skinPath_str + "rewind-over.png";
				}
				
				
				if(self.showShareButton_bl){
	
					self.shareSPath_str = self.skinPath_str + "share-over.png";
					self.facebookSPath_str = self.skinPath_str + "facebook-over.png";
					self.googleSPath_str = self.skinPath_str + "google-plus-over.png";
					self.twitterSPath_str = self.skinPath_str + "twitter-over.png";
					self.likedInSPath_str = self.skinPath_str + "likedin-over.png";
					self.bufferSPath_str = self.skinPath_str + "buffer-over.png";
					self.diggSPath_str = self.skinPath_str + "digg-over.png";
					self.redditSPath_str = self.skinPath_str + "reddit-over.png";
					self.thumbrlSPath_str = self.skinPath_str + "thumbrl-over.png";
					
				}
			}

			self.atbSPath_str = self.skinPath_str + "a-to-b-button-over.png";
			
			if(!self.useVectorIcons_bl){
				self.skinPaths_ar.push(
					 {img:self.playN_img = new Image(), src:self.skinPath_str + "play.png"},
					 {img:self.pauseN_img = new Image(), src:self.skinPath_str + "pause.png"},
					 {img:self.volumeN_img = new Image(), src:self.skinPath_str + "volume.png"},
					 {img:self.downloadN_img = new Image(), src:self.skinPath_str + "download-button.png"},
					 {img:self.fullScreenN_img = new Image(), src:self.skinPath_str + "full-screen.png"},
					 {img:self.ytbQualityN_img = new Image(), src:self.skinPath_str + "youtube-quality.png"},
					 {img:self.normalScreenN_img = new Image(), src:self.skinPath_str + "normal-screen.png"},
					 {img:self.embedN_img = new Image(), src:self.skinPath_str + "embed.png"},
					 {img:self.embedColoseN_img = new Image(), src:self.skinPath_str + "embed-close-button.png"},
					 {img:self.passColoseN_img = new Image(), src:self.skinPath_str + "embed-close-button.png"},
					 {img:self.showSubtitleNPath_img = new Image(), src:self.skinPath_str + "show-subtitle-icon.png"},
					 {img:self.hideSubtitleNPath_img = new Image(), src:self.skinPath_str + "hide-subtitle-icon.png"},
					 {img:self.playbackRateNPath_img = new Image(), src:self.skinPath_str + "playback-rate-normal.png"}
				);
				if(self.showShareButton_bl || self.showEmbedButton_bl){
					self.skinPaths_ar.push(
						{img:self.shareClooseN_img = new Image(), src:self.skinPath_str + "embed-close-button.png"},
						{img:self.embedClooseN_img = new Image(), src:self.skinPath_str + "embed-close-button.png"}
					);
				}
				if(self.showShareButton_bl){
					self.skinPaths_ar.push(
						{img:self.shareN_img = new Image(), src:self.skinPath_str + "share.png"},
						{img:self.facebookN_img = new Image(), src:self.skinPath_str + "facebook.png"},
						{img:self.googleN_img = new Image(), src:self.skinPath_str + "google-plus.png"},
						{img:self.twitterN_img = new Image(), src:self.skinPath_str + "twitter.png"},
						{img:self.likedInkN_img = new Image(), src:self.skinPath_str + "likedin.png"},
						{img:self.bufferkN_img = new Image(), src:self.skinPath_str + "buffer.png"},
						{img:self.diggN_img = new Image(), src:self.skinPath_str + "digg.png"},
						{img:self.redditN_img = new Image(), src:self.skinPath_str + "reddit.png"},
						{img:self.thumbrlN_img = new Image(), src:self.skinPath_str + "thumbrl.png"}
					)
				}

				if(self.useAToB){
					self.skinPaths_ar.push(
						{img:self.atbNPath_img = new Image(), src:self.skinPath_str + "a-to-b-button.png"}
					)
				}
			}
				
			
			self.downloadSPath_str = self.skinPath_str + "download-button-over.png";
			if(self.showHelpScreen_bl){
				self.skinPaths_ar.push(
				    {img:self.helpScreen_img = new Image(), src:self.skinPath_str + self.helpScreenPath_str},
				    {img:self.pauseN_img = new Image(), src:self.skinPath_str + "ok-button.png"}
				);
			};
			
			if(self.showAopwWindow_bl){
				self.skinPaths_ar.push(
				    {img:self.popwColseN_img = new Image(), src:self.skinPath_str + "popw-close-button.png"}
				);
				self.popwColseSPath_str = self.skinPath_str + "popw-close-button-over.png";
				self.popwWindowBackgroundPath_str = self.skinPath_str + "popw-window-background.png";
				self.popwBarBackgroundPath_str = self.skinPath_str + "popw-bar-background.png";
			};
			
			
			
			self.totalGraphics = self.skinPaths_ar.length;		
		};
		
		//####################################//
		/* Preloader load done! */
		//###################################//
		this.onPreloaderLoadHandler = function(){
			self.countLoadedSCript = 0;
			self.scripts = [];
			if(self.useAToB){
				self.scripts.push('FWDEVPATB.js');
			}
			if(self.thumbnailsPreview){
				self.scripts.push('FWDEVPThumbnailsPreview.js');
			}
			self.totalScripts = self.scripts.length;
	
			
			self.dispatchEvent(FWDEVPData.PRELOADER_LOAD_DONE);
			if(self.useChromeless_bl){
				setTimeout(function(){
					self.dispatchEvent(FWDEVPData.SKIN_LOAD_COMPLETE);
				}, 50);
			}else{
				self.loadPlugin();
			}
			
		};
		
		self.loadPlugin = function(){
			if(self.countLoadedSCript == self.totalScripts){
				self.loadSkin();	
			}else{
				var script = document.createElement('script');
				document.head.appendChild(script);
				script.src =  self.mainFolderPath_str + 'java/' + self.scripts[self.countLoadedSCript];
				script.onload = self.loadPlugin;
				script.onerror = function(e){
					console.log(e);
					if(self.scripts[self.countLoadedSCript] == 'FWDEVPATB.js'){
						self.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:'You have enabled the A to B plugin<br>A to B js file named <font color="#FF0000">FWDEVPATB.js</font> is not found. Please make sure that the content folder contains the java folder that contains the <font color="#FF0000">FWDEVPATB.js</font> file. '});
					}else if(self.scripts[self.countLoadedSCript] == 'FWDEVPThumbnailsPreview.js'){
						self.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:'You have enabled thethumbnal preview plugin<br>thumbnail preview js file named <font color="#FF0000">FWDEVPThumbnailsPreview.js</font> is not found. Please make sure that the content folder contains the java folder that contains the <font color="#FF0000">FWDEVPThumbnailsPreview.js</font> file. '});
					}
				
				}
			}
			self.countLoadedSCript++;
		}
		
		//####################################//
		/* load buttons graphics */
		//###################################//
		self.loadSkin = function(){
			var img;
			var src;
			for(var i=0; i<self.totalGraphics; i++){
				img = self.skinPaths_ar[i].img;
				src = self.skinPaths_ar[i].src;
				img.onload = self.onSkinLoadHandler;
				img.onerror = self.onSkinLoadErrorHandler;
				img.src = src;
			}
		};
		
		this.onSkinLoadHandler = function(e){
			self.countLoadedSkinImages++;
			if(self.countLoadedSkinImages == self.totalGraphics){
				setTimeout(function(){
					self.dispatchEvent(FWDEVPData.SKIN_LOAD_COMPLETE);
				}, 50);
			}
		};
		
		self.onSkinLoadErrorHandler = function(e){
			if (FWDEVPUtils.isIEAndLessThen9){
				message = "Graphics image not found!";
			}else{
				message = "The skin graphics with label <font color='#FF0000'>" + e.target.src + "</font> can't be loaded, check path!";
			}
			
			if(window.console) console.log(e);
			var err = {text:message};
			setTimeout(function(){
				self.dispatchEvent(FWDEVPData.LOAD_ERROR, err);
			}, 50);
		};
	
		
		//####################################//
		/* load buttons graphics */
		//###################################//
	
		self.onSkinLoadHandlersss = function(e){
	
			self.countLoadedSkinImages++;
			if(self.countLoadedSkinImages < self.totalGraphics){
				if(FWDEVPUtils.isIEAndLessThen9){
					self.loadImageId_to = setTimeout(self.loadSkin, 16);
				}else{
					self.loadSkin();
				}
			}else{
				setTimeout(function(){
					self.dispatchEvent(FWDEVPData.SKIN_LOAD_COMPLETE);
				}, 50);
			}
		};
		
		//##########################################//
		/* Download video */
		//##########################################//
		this.downloadVideo = function(sourcePath, pName){
			
			if(document.location.protocol == "file:"){
				self.isPlaylistDispatchingError_bl = true;
				showLoadPlaylistErrorId_to = setTimeout(function(){
					self.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"Downloading video files local is not allowed or possible! To function properly please test online."});
					self.isPlaylistDispatchingError_bl = false;
				}, 50);
				return;
			}
			
			if(!sourcePath){
				self.isPlaylistDispatchingError_bl = true;
				showLoadPlaylistErrorId_to = setTimeout(function(){
					self.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"Not allowed to download this video!"});
					self.isPlaylistDispatchingError_bl = false;
				}, 50);
				return;
			}
			
			if(String(sourcePath.indexOf(".mp4")) == -1){
				self.isPlaylistDispatchingError_bl = true;
				showLoadPlaylistErrorId_to = setTimeout(function(){
					self.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"Only mp4 video files hosted on your server can be downloaded."});
					self.isPlaylistDispatchingError_bl = false;
				}, 50);
				return;
				
			}
			
			var defaultSourcePath = sourcePath;
			var path1 = location.origin;
			var path2 = location.pathname;
		
			if(path2.indexOf(".") != -1){
				path2 = path2.substr(0, path2.lastIndexOf("/") + 1);
			}
			
			var hasHTTPorHTTPS_bl = sourcePath.indexOf("http:") == -1 && sourcePath.indexOf("https:") == -1;
		
			if(hasHTTPorHTTPS_bl){
				sourcePath = path1 + path2 + sourcePath;
			}
	
			if(!pName) return;
		
			pName = pName.replace(/[^A-Z0-9\-\_\.]+/ig, "_");
			if(!(/\.(mp3)$/i).test(pName)) pName+='.mp3';
			
			sourcePath = sourcePath;
			
			var url = self.videoDownloaderPath_str;
			
			if(!self.dlIframe){
				self.dlIframe = document.createElement("IFRAME");
				self.dlIframe.style.display = "none";
				document.documentElement.appendChild(self.dlIframe);
			}
			
			if(self.isMobile_bl){
				
				if(self.openDownloadLinkOnMobile_bl){
					window.open(defaultSourcePath, "_blank");
					return;
				}
			
				var email = self.getValidEmail();
				if(!email) return;
				
				if(self.emailXHR != null){
					try{self.emailXHR.abort();}catch(e){}
					self.emailXHR.onreadystatechange = null;
					self.emailXHR.onerror = null;
					self.emailXHR = null;
				}
				
				self.emailXHR = new XMLHttpRequest();
				
				self.emailXHR.onreadystatechange = function(e){
					if(self.emailXHR.readyState == 4){
						if(self.emailXHR.status == 200){
							if(self.emailXHR.responseText == "sent"){
								alert("Email sent.");
							}else{
								alert("Error sending email, this is a server side error, the php file can't send the email!");
							}
							
						}else{
							alert("Error sending email: " + self.emailXHR.status + ": " + self.emailXHR.statusText);
						}
					}
				};
				
				self.emailXHR.onerror = function(e){
					try{
						if(window.console) console.log(e);
						if(window.console) console.log(e.message);
					}catch(e){};
					alert("Error sending email: " + e.message);
				};

				self.emailXHR.open("get", self.mailPath_str + "?mail=" + email + "&name=" + pName + "&path=" + sourcePath, true);
				self.emailXHR.send();
				return;
			}
			
		
			self.dlIframe.src = url + "?path="+ sourcePath +"&name=" + pName;
		};
		
		this.getValidEmail = function(){
			var email = prompt("Please enter your email address where the video download link will be sent:");
			var emailRegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		
			while(!emailRegExp.test(email) || email == ""){
				if(email === null) return;
				email = prompt("Please enter a valid email address:");
			}
			return email;
		};
		
		//####################################//
		/* load vast */
		//####################################//
		this.loadVast = function(xmlSource){
			var vastObj = [];
			var tempObj;
			self.vastXHR = new XMLHttpRequest();
			self.vastXHR.onreadystatechange = function(e){
				if(self.vastXHR.readyState == 4){
					if(self.vastXHR.status == 200){
						var respObj = FWDEVPUtils.xmlToJson(self.vastXHR.responseXML).VAST;
						//console.log(respObj);
						//console.log("##########################");
						if(!respObj["Ad"]){
							self.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"No <font color='#FF0000'> &lt;ad&gt; </font> tag was found in the VAST xml file."});
							return;
						}else{
							if(!respObj["Ad"].length) respObj["Ad"] = [respObj["Ad"]];
							var ad_ar = [];
							for(var i=0; i< respObj["Ad"].length; i++){
								tempObj = {};
								tempObj.id = respObj["Ad"][i]["@attributes"]["id"];
								tempObj.sequence = respObj["Ad"][i]["@attributes"]["sequence"];
								tempObj.startTime = respObj["Ad"][i]["@attributes"]["startTime"];
								if(!tempObj.sequence) tempObj.sequence = i;
								
								
								if(!respObj["Ad"][i]["InLine"]){
									self.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"No <font color='#FF0000'> &lt;InLine&gt; </font>tag was found in the VAST xml file."});
									return;
								}
								tempObj["InLine"] = {};
								
								//impression
								tempObj["InLine"]["Impression"] = undefined;
								if(respObj["Ad"][i]["InLine"]["Impression"]){
									if(respObj["Ad"][i]["InLine"]["Impression"]["#cdata-section"]){
										tempObj["InLine"]["Impression"] = respObj["Ad"][i]["InLine"]["Impression"]["#cdata-section"];
									}else{
										tempObj["InLine"]["Impression"] = respObj["Ad"][i]["InLine"]["Impression"]["#text"];
									}
									
								}
								
								if(!respObj["Ad"][i]["InLine"]["Creatives"]["Creative"].length){
									respObj["Ad"][i]["InLine"]["Creatives"]["Creative"] = [respObj["Ad"][i]["InLine"]["Creatives"]["Creative"]]
								}
								
							
								if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"].length){
									for(var j=0; j<respObj["Ad"][i]["InLine"]["Creatives"]["Creative"].length; j++){
										//linear ads
										if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]){
											
											if(!respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["MediaFiles"]["MediaFile"].length){
												respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["MediaFiles"]["MediaFile"] = [respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["MediaFiles"]["MediaFile"]];
											}
											
											
											tempObj["InLine"]["Linear"] = {};
										
											//video source
											var allVideosObj = [];
											for(var k = 0; k<respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["MediaFiles"]["MediaFile"].length; k++){
												allVideosObj.push(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["MediaFiles"]["MediaFile"][k])
											}
											
											var videoSource;
											var correctIndex = 0;
											
											prop:for(var m=0;  m<allVideosObj.length; m++){
												if(window["innerWidth"] >= allVideosObj[m]["@attributes"]["width"]){
													correctIndex = m;
													break prop;
												}
											}
											
											if(allVideosObj[correctIndex]["#cdata-section"]){
												tempObj["InLine"]["Linear"]["videoSource"]  = allVideosObj[correctIndex]["#cdata-section"];
											}else{
												tempObj["InLine"]["Linear"]["videoSource"] = allVideosObj[correctIndex]["#text"];
											}
											
											//duration
											if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["Duration"]){
												if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["Duration"]["#cdata-section"]){
													tempObj["InLine"]["Linear"]["Duration"] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["Duration"]["#cdata-section"];
												}else if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["Duration"]["#text"]){
													tempObj["InLine"]["Linear"]["Duration"] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["Duration"]["#text"];
												}
											}
											
										
											//skip offset
											tempObj["InLine"]["Linear"]["skipoffset"] = undefined;
											if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["@attributes"]
											   && respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["@attributes"]["skipoffset"]
											){
												tempObj["InLine"]["Linear"]["skipoffset"] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["@attributes"]["skipoffset"];
											}
											
											
											if(tempObj["InLine"]["Linear"]["skipoffset"]){
												tempObj["InLine"]["Linear"]["skipoffset"] = tempObj["InLine"]["Linear"]["skipoffset"].substr(0, 8);
												if(tempObj["InLine"]["Linear"]["Duration"] && tempObj["InLine"]["Linear"]["skipoffset"].indexOf("%") != -1){
													var tempSkipOffset =  Math.round(FWDEVPUtils.getSecondsFromString(tempObj["InLine"]["Linear"]["Duration"]) * (tempObj["InLine"]["Linear"]["skipoffset"].substr(0, tempObj["InLine"]["Linear"]["skipoffset"].length -1)/100));
													tempObj["InLine"]["Linear"]["skipoffset"] = FWDEVPUtils.formatTime(tempSkipOffset, true);
												}
												
											}
											if(tempObj["InLine"]["Linear"]["skipoffset"]){
												
												tempObj["InLine"]["Linear"]["skipoffset"] = FWDEVPUtils.getSecondsFromString(tempObj["InLine"]["Linear"]["skipoffset"]);
												if(tempObj["InLine"]["Linear"]["Duration"] && FWDEVPUtils.getSecondsFromString(tempObj["InLine"]["Linear"]["Duration"]) <= tempObj["InLine"]["Linear"]["skipoffset"]){
													tempObj["InLine"]["Linear"]["skipoffset"] = undefined;
												}
											}
											
											
											//tracking events
											tempObj["InLine"]["Linear"]["TrackingEvents"] = undefined;
											if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["TrackingEvents"]["Tracking"]){
												tempObj["InLine"]["Linear"]["TrackingEvents"] = [];
												for(var p=0; p<respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["TrackingEvents"]["Tracking"].length; p++){
													
													
													tempObj["InLine"]["Linear"]["TrackingEvents"].push({
														event:respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["TrackingEvents"]["Tracking"][p]["@attributes"]["event"]
													})
													
													if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["TrackingEvents"]["Tracking"][p]["#cdata-section"]){
														tempObj["InLine"]["Linear"]["TrackingEvents"][p].URI = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["TrackingEvents"]["Tracking"][p]["#cdata-section"];
													}else{
														tempObj["InLine"]["Linear"]["TrackingEvents"][p].URI = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["TrackingEvents"]["Tracking"][p]["#text"];
													}
												}
											}
											
											//video clicks
											if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]){
												if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickThrough"]){
													if(tempObj["InLine"]["Linear"]["ClickThrough"] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickThrough"]["#cdata-section"]){
														tempObj["InLine"]["Linear"]["ClickThrough"] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickThrough"]["#cdata-section"];
													}else{
														tempObj["InLine"]["Linear"]["ClickThrough"] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickThrough"]["#text"]
													}
												}

												if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickTracking"]){
													if(respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickTracking"]["#cdata-section"]){
														tempObj["InLine"]["Linear"]["ClickTracking"] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickTracking"]["#cdata-section"];
													}else{
														tempObj["InLine"]["Linear"]["ClickTracking"] = respObj["Ad"][i]["InLine"]["Creatives"]["Creative"][j]["Linear"]["VideoClicks"]["ClickTracking"]["#text"];
													}
												}
											}							
										}
									}
								}	
								vastObj.push(tempObj);
							}
						}
						
						FWDEVPUtils.storArrayBasedOnObjectValue(vastObj, "sequence");
						//console.log(vastObj);

						//create ads object
						var ads=[];
						for(var i=0; i<vastObj.length; i++){
							var adsObj = {};
							
							adsObj.source = vastObj[i]["InLine"]["Linear"]["videoSource"];
							
							adsObj.timeStart = FWDEVPUtils.getSecondsFromString(self.vastLinearStartTime);
							if(vastObj[i].startTime) adsObj.timeStart = FWDEVPUtils.getSecondsFromString(vastObj[i].startTime);
							if(vastObj[i]["InLine"]["Linear"]["skipoffset"]) adsObj.timeToHoldAds = vastObj[i]["InLine"]["Linear"]["skipoffset"];
							adsObj.link = vastObj[i]["InLine"]["Linear"]["ClickThrough"];
							if(vastObj[i]["InLine"]["Linear"]["ClickTracking"]) adsObj.ClickTracking = vastObj[i]["InLine"]["Linear"]["ClickTracking"];
							adsObj.target = self.vastClickTroughTarget;
							if(vastObj[i]["InLine"]["Impression"]) adsObj.Impression = vastObj[i]["InLine"]["Impression"];
							if(vastObj[i]["InLine"]["Linear"]["TrackingEvents"]) adsObj.TrackingEvents = vastObj[i]["InLine"]["Linear"]["TrackingEvents"];
							ads.push(adsObj);
						}
						
						self.adsSource_ar = ads;
						self.isVastXMLParsed_bl = true;
						self.dispatchEvent(FWDEVPData.VAST_LOADED, {ads:ads});
					}else{
						self.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"vast XML file can't be loaded " +  self.vastXHR.statusText});
					}
				}
			};
			
			self.vastXHR.onerror = function(e){
				try{
					if(window.console) console.log(e);
					if(window.console) console.log(e.message);
				}catch(e){};
			};
			
			if(xmlSource.indexOf("http") != -1 || xmlSource.indexOf("https") != -1){
				xmlSource = "https://cors-anywhere.herokuapp.com/" + xmlSource;
			}
			
			self.vastXHR.open("get", xmlSource, true);
			self.vastXHR.send();
		}
		
		
		//####################################//
		/* show error if a required property is not defined */
		//####################################//
		self.showPropertyError = function(error){
			self.dispatchEvent(FWDEVPData.LOAD_ERROR, {text:"The property called <font color='#FF0000'>" + error + "</font> is not defined."});
		};
		
		self.init();
	};
	
	/* set prototype */
	FWDEVPData.setPrototype = function(){
		FWDEVPData.prototype = new FWDEVPEventDispatcher();
	};
	
	FWDEVPData.prototype = null;
	
	FWDEVPData.VAST_LOADED = "vastLoaded";
	FWDEVPData.PRELOADER_LOAD_DONE = "onPreloaderLoadDone";
	FWDEVPData.LOAD_DONE = "onLoadDone";
	FWDEVPData.LOAD_ERROR = "onLoadError";
	FWDEVPData.IMAGE_LOADED = "onImageLoaded";
	FWDEVPData.SKIN_LOAD_COMPLETE = "onSkinLoadComplete";
	FWDEVPData.SKIN_PROGRESS = "onSkinProgress";
	FWDEVPData.IMAGES_PROGRESS = "onImagesPogress";
	
	window.FWDEVPData = FWDEVPData;
}(window));