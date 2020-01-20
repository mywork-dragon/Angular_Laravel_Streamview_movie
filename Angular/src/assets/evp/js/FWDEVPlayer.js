/* Gallery */
(function (window){
	
	var FWDEVPlayer = function(props){
		
		var self = this;
	
		this.props = props;
		this.isInstantiate_bl = false;
		this.displayType = props.displayType || FWDEVPlayer.RESPONSIVE;
		
		if(self.displayType.toLowerCase() != FWDEVPlayer.RESPONSIVE 
		   && self.displayType.toLowerCase() != FWDEVPlayer.FULL_SCREEN
		   && self.displayType.toLowerCase() != FWDEVPlayer.AFTER_PARENT
		){
			self.displayType = FWDEVPlayer.RESPONSIVE;
		}
		
		if(props.displayType.toLowerCase() == FWDEVPlayer.BACKGROUND_VIDEO){
			self.displayType = FWDEVPlayer.BACKGROUND_VIDEO;
		}
		
		self.displayType = self.displayType.toLowerCase();

		if(FWDEVPlayer.videoStartBehaviour != "pause" 
			&& FWDEVPlayer.videoStartBehaviour != "stop"
			&& FWDEVPlayer.videoStartBehaviour != "default"
		){
			FWDEVPlayer.videoStartBehaviour = "pause";
		}
		
		this.maxWidth = props.maxWidth || 640;
		this.maxHeight = props.maxHeight || 380;
	
		self.showPreloader_bl = props.showPreloader; 
		self.showPreloader_bl = self.showPreloader_bl == "no" ? false : true;
	
		this.disableDoubleClickFullscreen_bl = props.disableDoubleClickFullscreen || "no"; 
		this.disableDoubleClickFullscreen_bl = this.disableDoubleClickFullscreen_bl == "yes" ? true : false;
			
		self.mainFolderPath_str = props.mainFolderPath;
		if((self.mainFolderPath_str.lastIndexOf("/") + 1) != self.mainFolderPath_str.length){
			self.mainFolderPath_str += "/";
		}
		
		this.skinPath_str = props.skinPath;
		if((self.skinPath_str.lastIndexOf("/") + 1) != self.skinPath_str.length){
			self.skinPath_str += "/";
		}
		
		this.warningIconPath_str = self.mainFolderPath_str + this.skinPath_str + "warningIcon.png";
		this.fillEntireVideoScreen_bl = false;
		FWDEVPlayer.instaces_ar.push(this);
	
		/* init gallery */
		self.init = function(){
			
			if(self.isInstantiate_bl) return;
			
			FWDTweenLite.ticker.useRAF(false);
			this.props_obj = props;
	
			
			this.instanceName_str = this.props_obj.instanceName;
			
			this.mustHaveHolderDiv_bl = false;
			
			if(!this.instanceName_str){
				alert("FWDEVPlayer instance name is requires please make sure that the instanceName parameter exsists and it's value is uinique.");
				return;
			}
			
			if(window[this.instanceName_str]){
				alert("FWDEVPlayer instance name " + this.instanceName_str +  " is already defined and contains a different instance reference, set a different instance name.");
				return;
			}else{
				window[this.instanceName_str] = this;
			}
		
			if(!this.props_obj){
				alert("FWDEVPlayer constructor properties object is not defined!");
				return;
			}
			
			if(!this.props_obj.parentId){		
				alert("Property parentId is not defined in the FWDEVPlayer constructor, self property represents the div id into which the megazoom is added as a child!");
				return;
			}
			
			if(self.displayType == FWDEVPlayer.RESPONSIVE || self.displayType == FWDEVPlayer.AFTER_PARENT) self.mustHaveHolderDiv_bl = true;
		
			if(self.mustHaveHolderDiv_bl && !FWDEVPUtils.getChildById(self.props_obj.parentId)){
				alert("FWDEVPlayer holder div is not found, please make sure that the div exsists and the id is correct! " + self.props_obj.parentId);
				return;
			}
			
			var args = FWDEVPUtils.getUrlArgs(window.location.search);
			var embedTest = args.EVPInstanceName;
			
			if(self.instanceName_str == embedTest){
				FWDEVPlayer.isEmbedded_bl = true;
				self.isEmbedded_bl = true;
			}
		
		
			if(self.isEmbedded_bl) self.displayType = FWDEVPlayer.FULL_SCREEN;
			
			this.body = document.getElementsByTagName("body")[0];
			this.stageContainer = null;
			
			if(self.displayType == FWDEVPlayer.FULL_SCREEN || self.displayType == FWDEVPlayer.BACKGROUND_VIDEO){
				if(FWDEVPUtils.isIEAndLessThen9){
					self.stageContainer = self.body;
				}else{
					self.stageContainer = document.documentElement;
				}
			}else{
				this.stageContainer = FWDEVPUtils.getChildById(self.props_obj.parentId);
			}
	
			this.listeners = {events_ar:[]};
			this.customContextMenu_do = null;
			this.info_do = null;
			this.main_do = null;
			this.ytb_do = null;
			this.preloader_do = null;
			this.controller_do = null;
			this.videoScreen_do = null;
			this.flash_do = null;
			this.flashObject = null;
			this.videoPoster_do = null;
			this.largePlayButton_do = null;
			this.hider = null;
			this.embedWindow_do = null;
			this.facebookShare = null;
			
			this.backgroundColor_str = self.props_obj.backgroundColor || "transparent";
			this.videoBackgroundColor_str = "#000000";
			this.flashObjectMarkup_str =  null;
			
			this.lastX = 0;
			this.lastY = 0;
			this.stageWidth = 0;
			this.stageHeight = 0;
			this.firstTapX;
			this.firstTapY;
			this.curTime;
			this.totalTime;
			
			this.videoSourcePath_str;;
			this.prevVideoSourcePath_str;
			this.posterPath_str = self.props_obj.posterPath;
			this.videoType_str;
			this.videoStartBehaviour_str;
			this.prevVideoSource_str;
			this.prevPosterSource_str;
			this.finalVideoPath_str;
		
			this.resizeHandlerId_to;
			this.resizeHandler2Id_to;
			this.hidePreloaderId_to;
			this.orientationChangeId_to;
			this.disableClickId_to;
			this.clickDelayId_to;
			this.secondTapId_to;
			
			this.autoScale_bl = self.props_obj.autoScale;
			this.autoScale_bl = self.autoScale_bl == "yes" ? true : false;
			self.showErrorInfo_bl = self.props_obj.showErrorInfo; 
			self.showErrorInfo_bl = self.showErrorInfo_bl == "no" ? false : true;
			this.isVideoPlayingWhenOpenWindows_bl = false;
			this.isSpaceDown_bl = false;
			this.isPlaying_bl = false;
			this.firstTapPlaying_bl = false;
			this.stickOnCurrentInstanceKey_bl = false;
			this.isFullScreen_bl = false;
			this.isFlashScreenReady_bl = false;
			this.orintationChangeComplete_bl = true;
			this.disableClick_bl = false;
			
			this.isAPIReady_bl = false;
			this.isInstantiate_bl = true;
			this.isAdd_bl = false;
			this.isMobile_bl = FWDEVPUtils.isMobile;
			this.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
			
			this.setupMainDo();
			this.startResizeHandler();
			
			self.initializeOnlyWhenVisible_bl = self.props_obj.initializeOnlyWhenVisible; 
			self.initializeOnlyWhenVisible_bl = self.initializeOnlyWhenVisible_bl == "yes" ? true : false;
			
		
			
			if(self.initializeOnlyWhenVisible_bl){
				window.addEventListener("scroll", self.onInitlalizeScrollHandler);
				setTimeout(self.onInitlalizeScrollHandler, 500);
			}else{
				self.setupPlayer();
			}
			
		};
		
		self.onInitlalizeScrollHandler = function(){
			
			var scrollOffsets = FWDEVPUtils.getScrollOffsets();
			self.pageXOffset = scrollOffsets.x;
			self.pageYOffset = scrollOffsets.y;
			
			if(self.main_do.getRect().top >= -self.stageHeight && self.main_do.getRect().top < self.ws.h){
				window.removeEventListener("scroll", self.onInitlalizeScrollHandler);
				self.setupPlayer();
			}
		};
		
		this.setupPlayer = function(){
		
			this.setupInfo();
			this.setupData();
		}
		
		//#############################################//
		/* setup main do */
		//#############################################//
		self.setupMainDo = function(){
			self.main_do = new FWDEVPDisplayObject("div", "relative");
			if(self.hasPointerEvent_bl) self.main_do.getStyle().touchAction = "none";
			self.main_do.getStyle().webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
			self.main_do.getStyle().webkitFocusRingColor = "rgba(0, 0, 0, 0)";
			self.main_do.getStyle().width = "100%";
			self.main_do.getStyle().height = "100%";
			self.main_do.setBackfaceVisibility();
			self.main_do.setBkColor(self.backgroundColor_str);
			if(!FWDEVPUtils.isMobile || (FWDEVPUtils.isMobile && FWDEVPUtils.hasPointerEvent)) self.main_do.setSelectable(false);
			
			
			if(self.displayType == FWDEVPlayer.FULL_SCREEN){	
				self.stageContainer.style.overflow = "hidden";
				self.main_do.getStyle().position = "absolute";
				document.documentElement.appendChild(self.main_do.screen);
				self.stageContainer.style.zIndex = 9999999999998;
				self.main_do.getStyle().zIndex = 9999999999998;
			}else if(self.displayType == FWDEVPlayer.BACKGROUND_VIDEO){	
				
				document.documentElement.appendChild(self.main_do.screen);
				self.main_do.getStyle().zIndex = -9999999999998;
				self.main_do.getStyle().position = "fixed";
				document.documentElement.insertBefore(self.main_do.screen, document.documentElement.firstChild);
			}else{
				self.stageContainer.style.overflow = "hidden";
				self.stageContainer.appendChild(self.main_do.screen);
			}	
			if(self.isEmbedded_bl) self.main_do.getStyle().zIndex = 9999999999998;
		};
		
		//#############################################//
		/* setup info_do */
		//#############################################//
		self.setupInfo = function(){
			FWDEVPInfo.setPrototype();
			self.info_do = new FWDEVPInfo(self, self.warningIconPath_str, self.showErrorInfo_bl);
		};	
		
		//#############################################//
		/* resize handler */
		//#############################################//
		self.startResizeHandler = function(){
			if(window.addEventListener){
				window.addEventListener("resize", self.onResizeHandler);
				//window.addEventListener("orientationchange", self.orientationChange);
			}else if(window.attachEvent){
				window.attachEvent("onresize", self.onResizeHandler);
			}
			self.onResizeHandler(true);
			self.resizeHandlerId_to = setTimeout(function(){self.resizeHandler(true);}, 500);
		};
		
		self.stopResizeHandler = function(){
			if(window.removeEventListener){
				window.removeEventListener("resize", self.onResizeHandler);
				//window.removeEventListener("orientationchange", self.orientationChange);
			}else if(window.detachEvent){
				window.detachEvent("onresize", self.onResizeHandler);
			}	
			clearTimeout(self.resizeHandlerId_to);
		};
		
		self.onResizeHandler = function(e){
			self.resizeHandler();
			clearTimeout(self.resizeHandler2Id_to);
			self.resizeHandler2Id_to = setTimeout(function(){self.resizeHandler();}, 300);
		};
		
		this.orientationChange = function(){
		
			if(self.displayType == FWDEVPlayer.FULL_SCREEN || self.isFullScreen_bl){
				self.orintationChangeComplete_bl = false;	
				clearTimeout(self.resizeHandlerId_to);
				clearTimeout(self.resizeHandler2Id_to);
				clearTimeout(self.orientationChangeId_to);
			
				self.orientationChangeId_to = setTimeout(function(){
					self.orintationChangeComplete_bl = true; 
					self.resizeHandler(true);
					}, 1000);
				
				self.main_do.setX(0);
				self.main_do.setWidth(0);
			}
		};
		
		self.resizeHandler = function(overwrite){
		//	if(!self.orintationChangeComplete_bl) return;
			
			var viewportSize = FWDEVPUtils.getViewportSize();
			self.ws = viewportSize;
				
			if(self.isFullScreen_bl || self.displayType == FWDEVPlayer.FULL_SCREEN || self.displayType == FWDEVPlayer.BACKGROUND_VIDEO){	
				self.main_do.setX(0);
				self.main_do.setY(0);
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h;
			}else if(self.displayType == FWDEVPlayer.AFTER_PARENT){
				self.stageWidth = self.stageContainer.offsetWidth;
				self.stageHeight = self.stageContainer.offsetHeight;
			}else{
				self.stageContainer.style.width = "100%";
				if(self.stageContainer.offsetWidth > self.maxWidth){
					self.stageContainer.style.width = self.maxWidth + "px";
				}
				self.stageWidth = self.stageContainer.offsetWidth;
				if(self.autoScale_bl){
					self.stageHeight = parseInt(self.maxHeight * (self.stageWidth/self.maxWidth));
				}else{
					self.stageHeight = self.maxHeight;
				}
				//if(self.stageHeight < 320) self.stageHeight = 320;
				self.stageContainer.style.height = self.stageHeight + "px";
			}
			
			
			self.tempVidStageWidth = self.stageWidth;
			self.tempVidStageHeight = self.stageHeight;
			self.main_do.setWidth(self.stageWidth);
			self.main_do.setHeight(self.stageHeight);
			
			if(self.fillEntireVideoScreen_bl  && self.videoType_str == FWDEVPlayer.VIDEO){
			
				if(self.videoScreen_do && self.videoScreen_do.video_el && self.videoScreen_do.video_el.videoWidth != 0){
					
					var originalW = self.videoScreen_do.video_el.videoWidth;
					var originalH = self.videoScreen_do.video_el.videoHeight
					var scaleX = self.stageWidth/originalW;
					var scaleY = self.stageHeight/originalH;
					
					totalScale = 0;
					if(scaleX >= scaleY){
						totalScale = scaleX;
					}else if(scaleX <= scaleY){
						totalScale = scaleY;
					}
					
					finalW = parseInt(originalW * totalScale);
					finalH = parseInt(originalH * totalScale);
					finalX = parseInt((self.stageWidth - finalW)/2);
					finalY = parseInt((self.stageHeight - finalH)/2);
					
					self.videoScreen_do.setWidth(finalW); 
					self.videoScreen_do.setHeight(finalH); 
					self.videoScreen_do.setX(finalX); 
					self.videoScreen_do.setY(finalY); 
				
				}
				
			}else if(self.audioScreen_do && self.videoType_str == FWDEVPlayer.MP3){
				self.audioScreen_do.resizeAndPosition(self.stageWidth, self.stageHeight);
				self.audioScreen_do.setX(0);
				self.audioScreen_do.setY(0);
			}else if(self.videoScreen_do && (self.videoType_str == FWDEVPlayer.VIDEO || self.videoType_str == FWDEVPlayer.HLS_JS)){
				self.videoScreen_do.resizeAndPosition(self.stageWidth, self.stageHeight);
				self.videoScreen_do.setX(0);
				self.videoScreen_do.setY(0);
			}
			
			if(self.popw_do && self.popw_do.isShowed_bl) self.popw_do.positionAndResize();
		
			if(self.ytb_do && self.videoType_str == FWDEVPlayer.YOUTUBE){
				self.ytb_do.setWidth(self.stageWidth);
				self.ytb_do.setHeight(self.stageHeight);
			}
			
			if(self.vimeo_do && self.videoType_str == FWDEVPlayer.VIMEO){
				self.vimeo_do.setWidth(self.stageWidth);
				self.vimeo_do.setHeight(self.stageHeight);
			}
			
			self.positionAdsImage();
			
			if(self.logo_do) self.logo_do.positionAndResize();
		
			if(self.controller_do) self.controller_do.resizeAndPosition();
		
			if(self.ytb_do && self.ytb_do.ytb && self.videoType_str == FWDEVPlayer.YOUTUBE){
				self.ytb_do.resizeAndPosition();
			}
			
			if(self.preloader_do) self.positionPreloader();
			self.resizeDumyHandler();
			
			if(self.largePlayButton_do) self.positionLargePlayButton();
			if(self.videoPoster_do && self.videoPoster_do.allowToShow_bl) self.videoPoster_do.positionAndResize();
			if(self.embedWindow_do && self.embedWindow_do.isShowed_bl) self.embedWindow_do.positionAndResize();
			if(self.passWindow_do && self.passWindow_do.isShowed_bl) self.passWindow_do.positionAndResize();
			if(self.shareWindow_do && self.shareWindow_do.isShowed_bl) self.shareWindow_do.positionAndResize();
			if(self.adsStart_do) self.positionAds();
			if(self.subtitle_do) self.subtitle_do.position();
			if(self.popupAds_do) self.popupAds_do.position();
			if(self.annotations_do) self.annotations_do.position();
			
		};
		
		this.resizeDumyHandler = function(){
			
			if(self.dumyClick_do){
				if(self.is360 && self.videoType_str == FWDEVPlayer.YOUTUBE){
					self.dumyClick_do.setWidth(0);
				}else{
					self.dumyClick_do.setWidth(self.stageWidth);
					if(self.isMobile_bl){
						self.dumyClick_do.setHeight(self.stageHeight);
					}else{
						//if(self.videoType_str == FWDEVPlayer.YOUTUBE && !self.isAdd_bl){
						//	self.dumyClick_do.setHeight(self.stageHeight - 120);
						//}else{
							self.dumyClick_do.setHeight(self.stageHeight);
						//}
					}
				}
			}
		}
		
		//###############################################//
		/* Setup click screen */
		//###############################################//
		this.setupClickScreen = function(){
			self.dumyClick_do = new FWDEVPDisplayObject("div");
			if(self.displayType !=  FWDEVPlayer.BACKGROUND_VIDEO){
				if(self.hasPointerEvent_bl){
					self.dumyClick_do.screen.addEventListener("pointerdown", self.playPauseDownHandler);
					self.dumyClick_do.screen.addEventListener("pointerup", self.playPauseClickHandler);
					self.dumyClick_do.screen.addEventListener("pointermove", self.playPauseMoveHandler);
				}else{	
					if(!self.isMobile_bl){
						self.dumyClick_do.screen.addEventListener("mousedown", self.playPauseDownHandler);
						self.dumyClick_do.screen.addEventListener("mouseup", self.playPauseClickHandler);
						self.dumyClick_do.screen.addEventListener("mousemove", self.playPauseMoveHandler);
					}else{
						
						self.dumyClick_do.screen.addEventListener("click", self.playPauseClickHandler);
					}
					//self.dumyClick_do.screen.addEventListener("touchstart", self.playPauseDownHandler);
					//self.dumyClick_do.screen.addEventListener("touchend", self.playPauseClickHandler);
				}
			}
			self.hideClickScreen();
			self.main_do.addChild(self.dumyClick_do);
		};
		
		this.playPauseDownHandler = function(e){
			
			self.isClickHandlerMoved_bl = false;
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);
			self.firstDommyTapX = viewportMouseCoordinates.screenX;
			self.firstDommyTapY = viewportMouseCoordinates.screenY;
			if(self.is360) self.dumyClick_do.getStyle().cursor = 'url(' + self.data.grabPath_str + '), default';
		}
		
		this.playPauseMoveHandler = function(e){
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);
			var dx;
			var dy;
			
			if(e.touches && e.touches.length != 1) return;
			dx = Math.abs(viewportMouseCoordinates.screenX - self.firstDommyTapX);   
			dy = Math.abs(viewportMouseCoordinates.screenY - self.firstDommyTapY); 
			
			if(self.isMobile_bl && (dx > 10 || dy > 10)){
				self.isClickHandlerMoved_bl = true;
			}else if(!self.isMobile_bl && (dx > 2 || dy > 2)){
				self.isClickHandlerMoved_bl = true;
			}
		}
		
		this.playPauseClickHandler = function(e){
			if(e.button == 2) return;
			if(self.is360) self.dumyClick_do.getStyle().cursor = 'url(' + self.data.handPath_str + '), default';
			if(self.isClickHandlerMoved_bl) return;
			
			if(self.isAdd_bl){
				if(self.data.adsPageToOpenURL_str && self.data.adsPageToOpenURL_str != "none"){
					window.open(self.data.adsPageToOpenURL_str, self.data.adsPageToOpenTarget_str);
					self.pause();
				}
				return;
			}

			if(self.disableClick_bl) return;
			self.firstTapPlaying_bl = self.isPlaying_bl;
			
			FWDEVPlayer.keyboardCurInstance = self;
			
			if(self.controller_do && self.controller_do.mainHolder_do.y != 0 && self.isMobile_bl) return;
			if(!self.isMobile_bl){
				if(FWDEVPlayer.videoStartBehaviour == FWDEVPlayer.PAUSE_ALL_VIDEOS){
					FWDEVPlayer.pauseAllVideos(self);
				}else if(FWDEVPlayer.videoStartBehaviour == FWDEVPlayer.STOP_ALL_VIDEOS){
					FWDEVPlayer.stopAllVideos(self);
				}
			}
			
			if(self.videoType_str == FWDEVPlayer.IMAGE || self.videoType_str == FWDEVPlayer.IFRAME){
				self.togglePlayPause();
			}else if(self.videoType_str == FWDEVPlayer.YOUTUBE){
				self.ytb_do.togglePlayPause();
			}else if(self.videoType_str == FWDEVPlayer.MP3){
				self.audioScreen_do.togglePlayPause();
			}else if(FWDEVPlayer.hasHTML5Video){
				
				if(self.videoScreen_do) self.videoScreen_do.togglePlayPause();
				
			}else if(self.isFlashScreenReady_bl){
				
			}
		};
		
		this.showClickScreen = function(){
			self.dumyClick_do.setVisible(true);
			if(self.isAdd_bl && self.data.adsPageToOpenURL_str && self.data.adsPageToOpenURL_str != "none"){
				self.dumyClick_do.setButtonMode(true);
			}else{	
				if(self.is360){
					self.dumyClick_do.getStyle().cursor = 'url(' + self.data.handPath_str + '), default';
				}else{
					self.dumyClick_do.setButtonMode(false);
				}
			}
		};
		
		this.hideClickScreen = function(){
			self.dumyClick_do.setVisible(false);
		};
		
		this.disableClick = function(){
			self.disableClick_bl = true;
			clearTimeout(self.disableClickId_to);
			self.disableClickId_to =  setTimeout(function(){
				self.disableClick_bl = false;
			}, 500);
		};
		
		//########################################//
		/* add double click and tap support */
		//########################################//
		this.addDoubleClickSupport = function(){
			
			if(self.hasPointerEvent_bl){
				self.dumyClick_do.screen.addEventListener("pointerdown", self.onFirstDown);
			}else{
				if(!self.isMobile_bl){
					self.dumyClick_do.screen.addEventListener("mousedown", self.onFirstDown);
					if(FWDEVPUtils.isIEWebKit) self.dumyClick_do.screen.addEventListener("dblclick", self.onSecondDown);
				}
				self.dumyClick_do.screen.addEventListener("touchstart", self.onFirstDown);
			}
			
		};
		
		this.onFirstDown = function(e){
			if(e.button == 2) return;
			if(self.isFullscreen_bl && e.preventDefault) e.preventDefault();
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);
			self.firstTapX = viewportMouseCoordinates.screenX;
			self.firstTapY = viewportMouseCoordinates.screenY;
			
			self.firstTapPlaying_bl = self.isPlaying_bl;
			
			if(FWDEVPUtils.isIEWebKit) return;
			if(self.hasPointerEvent_bl){
				self.dumyClick_do.screen.removeEventListener("pointerdown", self.onFirstDown);
				self.dumyClick_do.screen.addEventListener("pointerdown", self.onSecondDown);
			}else{
				if(!self.isMobile_bl){
					self.dumyClick_do.screen.addEventListener("mousedown", self.onSecondDown);
					self.dumyClick_do.screen.removeEventListener("mousedown", self.onFirstDown);
				}
				self.dumyClick_do.screen.addEventListener("touchstart", self.onSecondDown);
				self.dumyClick_do.screen.removeEventListener("touchstart", self.onFirstDown);
			}
			clearTimeout(self.secondTapId_to);
			self.secondTapId_to = setTimeout(self.doubleTapExpired, 500);
		};
		
		this.doubleTapExpired = function(){
			clearTimeout(self.secondTapId_to);
			if(self.hasPointerEvent_bl){
				self.dumyClick_do.screen.removeEventListener("pointerdown", self.onSecondDown);
				self.dumyClick_do.screen.addEventListener("pointerdown", self.onFirstDown);
			}else{
				
				self.dumyClick_do.screen.removeEventListener("touchstart", self.onSecondDown);
				self.dumyClick_do.screen.addEventListener("touchstart", self.onFirstDown);
				if(!self.isMobile_bl){
					self.dumyClick_do.screen.removeEventListener("mousedown", self.onSecondDown);
					self.dumyClick_do.screen.addEventListener("mousedown", self.onFirstDown);
				}
			}
		};
		
		this.onSecondDown = function(e){
			if(e.preventDefault) e.preventDefault();
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);
			var dx;
			var dy;
			
			if(FWDEVPUtils.isIEWebKit) self.firstTapPlaying_bl = self.isPlaying_bl;
			if(e.touches && e.touches.length != 1) return;
			dx = Math.abs(viewportMouseCoordinates.screenX - self.firstTapX);   
			dy = Math.abs(viewportMouseCoordinates.screenY - self.firstTapY); 
		
			if((dx > 10 || dy > 10)) return;
				
			self.switchFullScreenOnDoubleClick(e);
			
			if(!FWDEVPUtils.isIEWebKit){
				if(self.firstTapPlaying_bl){
					self.play();
				}else{
					self.pause();
				}
			}
		};
		
		this.switchFullScreenOnDoubleClick = function(e){
			self.disableClick();
			if(!self.isFullScreen_bl){
				self.goFullScreen();
			}else{
				self.goNormalScreen();
			}
		};
		
		
		//############################################//
		/* Setup Vimeo player */
		//############################################//
		self.isVimeoReady_bl = false;
		this.setupVimeoPlayer = function(){
			if(self.vimeo_do) return;
			FWDEVPVimeoScreen.setPrototype();
			self.vimeo_do = new FWDEVPVimeoScreen(self, self.data.volume);
			self.vimeo_do.addListener(FWDEVPVimeoScreen.READY, self.vimeoReadyHandler);
			self.vimeo_do.addListener(FWDEVPVimeoScreen.STOP, self.videoScreenStopHandler);
			self.vimeo_do.addListener(FWDEVPVimeoScreen.PLAY, self.videoScreenPlayHandler);
			self.vimeo_do.addListener(FWDEVPVimeoScreen.PAUSE, self.videoScreenPauseHandler);
			self.vimeo_do.addListener(FWDEVPVimeoScreen.UPDATE, self.videoScreenUpdateHandler);
			self.vimeo_do.addListener(FWDEVPVimeoScreen.UPDATE_TIME, self.videoScreenUpdateTimeHandler);
			self.vimeo_do.addListener(FWDEVPVimeoScreen.LOAD_PROGRESS, self.videoScreenLoadProgressHandler);
			self.vimeo_do.addListener(FWDEVPVimeoScreen.PLAY_COMPLETE, self.videoScreenPlayCompleteHandler);
			
		};
		
		this.vimeoReadyHandler = function(e){
			self.isVimeoReady_bl = true;
			clearInterval(self.hidePreloaderId_to);
			self.vimeo_do.iFrame_do.screen.style.left = "0px";
			self.setSource(self.videoSourcePath_str);
			if(self.preloader_do) self.preloader_do.hide(true);
		};		
		
		//############################################//
		/* Setup youtube player */
		//############################################//
		this.setupYoutubeAPI = function(){
			if(self.ytb_do) return;
			if(typeof YT != "undefined" && YT.Player){
				self.setupYoutubePlayer();
				return;
			}else{
				if(FWDEVPlayer.isYoutubeAPILoadedOnce_bl){
					self.keepCheckingYoutubeAPI_int =  setInterval(function(){
						if(typeof YT != "undefined" && YT && YT.Player){
							if(self.videoSourcePath_str.indexOf("youtube.") == -1) clearInterval(self.keepCheckingYoutubeAPI_int);
							clearInterval(self.keepCheckingYoutubeAPI_int);
							self.setupYoutubePlayer();
						}
					}, 50);
					return;
				}
				
				var tag = document.createElement("script");
				tag.src = "https://www.youtube.com/iframe_api";
				var firstScriptTag = document.getElementsByTagName("script")[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			
				tag.onload = function(){
					self.checkIfYoutubePlayerIsReadyId_int = setInterval(function(){
						if(YT && YT.Player){
							clearInterval(self.checkIfYoutubePlayerIsReadyId_int);
							self.setupYoutubePlayer();
						}
					}, 50);
				}
				
				tag.onerror = function(){
					setTimeout(function(){
						self.main_do.addChild(self.info_do);
						self.info_do.allowToRemove_bl = false;
						self.info_do.showText("Error loading Youtube API");
						self.preloader_do.hide();
					}, 500);
					return;
				}
				
				FWDEVPlayer.isYoutubeAPILoadedOnce_bl = true;
			}
		};
		
		this.setupYoutubePlayer = function(){
			
			FWDEVPYoutubeScreen.setPrototype();
			self.ytb_do = new FWDEVPYoutubeScreen(self, self.data.volume);
			self.ytb_do.addListener(FWDEVPYoutubeScreen.READY, self.youtubeReadyHandler);
			self.ytb_do.addListener(FWDEVPVideoScreen.ERROR, self.videoScreenErrorHandler);
			self.ytb_do.addListener(FWDEVPYoutubeScreen.SAFE_TO_SCRUBB, self.videoScreenSafeToScrubbHandler);
			self.ytb_do.addListener(FWDEVPYoutubeScreen.STOP, self.videoScreenStopHandler);
			self.ytb_do.addListener(FWDEVPYoutubeScreen.PLAY, self.videoScreenPlayHandler);
			self.ytb_do.addListener(FWDEVPYoutubeScreen.PAUSE, self.videoScreenPauseHandler);
			self.ytb_do.addListener(FWDEVPYoutubeScreen.UPDATE, self.videoScreenUpdateHandler);
			self.ytb_do.addListener(FWDEVPYoutubeScreen.UPDATE_TIME, self.videoScreenUpdateTimeHandler);
			self.ytb_do.addListener(FWDEVPYoutubeScreen.LOAD_PROGRESS, self.videoScreenLoadProgressHandler);
			self.ytb_do.addListener(FWDEVPYoutubeScreen.PLAY_COMPLETE, self.videoScreenPlayCompleteHandler);
			self.ytb_do.addListener(FWDEVPYoutubeScreen.CUED, self.youtubeScreenCuedHandler);
			self.ytb_do.addListener(FWDEVPYoutubeScreen.QUALITY_CHANGE, self.youtubeScreenQualityChangeHandler);
	
			if(!self.isMobile_bl) self.ytb_do.showDisable();
			clearTimeout(self.ytb_do);
		};
		
		this.youtubeReadyHandler = function(e){
		
			self.isYoutubeReady_bl = true;
			if(self.videoType_str != FWDEVPlayer.YOUTUBE) return;
		
			if(self.ytb_do.hasBeenCreatedOnce_bl){
				if(self.videoSourcePath_str.indexOf(".") != -1) return;
				if(!self.isMobile_bl){
					self.setPosterSource(self.posterPath_str);
					self.videoPoster_do.show();
				}else{
					self.setPosterSource(undefined);
					self.videoPoster_do.hide();
					//if(self.largePlayButton_do) self.largePlayButton_do.hide();
				}
				if(self.videoSourcePath_str.indexOf(".") == -1) self.setSource(self.videoSourcePath_str, true, self.data.videoSource_ar[self.data.startAtVideoSource]["videoType"]);
				
				return;
			}
			
			if(self.isMobile_bl){
				setTimeout(function(){
					try{
						self.ytb_do.ytb.a.style.left = "0px";
					}catch(e){}
				}, 500);
			}else{
				//self.ytb_do.ytb.a.style.left = "0px";
			}
			
			
			self.setSource(self.videoSourcePath_str, true, self.data.videoSource_ar[self.data.startAtVideoSource]["videoType"]);
			
			if(self.preloader_do) self.preloader_do.hide(true);
			
		};
		
		this.youtubeScreenCuedHandler = function(){
			if(self.main_do) if(self.main_do.contains(self.info_do)) self.main_do.removeChild(self.info_do);
		};
		
		this.youtubeScreenQualityChangeHandler = function(e){
			if(self.videoType_str == FWDEVPlayer.VIDEO) self.curDurration = self.videoScreen_do.curDuration;
			if(self.controller_do) self.controller_do.updateQuality(e.levels, e.qualityLevel);
		};
		
		//#############################################//
		/* setup context menu */
		//#############################################//
		self.setupContextMenu = function(){
			self.customContextMenu_do = new FWDEVPContextMenu(self.main_do, self.data.rightClickContextMenu_str);
		};
		
		//#############################################//
		/* setup data */
		//#############################################//
		self.setupData = function(){
			FWDEVPData.setPrototype();
			self.data = new FWDEVPData(self.props_obj, self.rootElement_el);
			self.data.addListener(FWDEVPData.PRELOADER_LOAD_DONE, self.onPreloaderLoadDone);
			self.data.addListener(FWDEVPData.LOAD_ERROR, self.dataLoadError);
			self.data.addListener(FWDEVPData.SKIN_PROGRESS, self.dataSkinProgressHandler);
			self.data.addListener(FWDEVPData.SKIN_LOAD_COMPLETE, self.dataSkinLoadComplete);
		};
		
		self.onPreloaderLoadDone = function(){
			self.setupPreloader();
			if(!self.isMobile_bl) self.setupContextMenu();
			if(self.displayType == FWDEVPlayer.BACKGROUND_VIDEO){
				self.data.useChromeless_bl = true;
				if(!self.isMobile_bl) self.data.autoPlay_bl = true;
				self.data.loop_bl = true;
				self.data.fillEntireVideoScreen_bl = self.fillEntireVideoScreen_bl = true;
			}else{
				self.fillEntireVideoScreen_bl = self.data.fillEntireVideoScreen_bl;
			}
			
			
			self.resizeHandler();
		};
		
		self.dataLoadError = function(e, text){
			self.main_do.addChild(self.info_do);
			self.info_do.showText(e.text);
			if(self.preloader_do) self.preloader_do.hide(false);
			self.resizeHandler();
		};
		
		self.dataSkinProgressHandler = function(e){};
		
		self.dataSkinLoadComplete = function(){
			self.volume = self.data.volume;
			if(self.displayType == FWDEVPlayer.FULL_SCREEN  && !FWDEVPUtils.hasFullScreen){
				self.data.showFullScreenButton_bl = false;
			}
			
			clearInterval(self.hidePreloaderId_to);
			self.hidePreloaderId_to = setTimeout(function(){
				if(self.preloader_do) self.preloader_do.hide(true);}
			, 500);
		
			self.setupNormalVideoPlayer();
		};
		
		this.setupNormalVideoPlayer = function(){
			if(self.normalVideoPlayersCreated_bl) return;
			self.normalVideoPlayersCreated_bl = true;
			//if(FWDEVPlayer.hasHTML5Video){
				self.isAPIReady_bl = true;
				self.setupVideoScreen();
				self.setupAudioScreen();
				//if(!self.isMobile_bl && !FWDEVPlayer.hasHTMLHLS) self.setupFlashScreen();
				self.setupVideoPoster();
				if(self.showPreloader_bl) self.main_do.addChild(self.preloader_do);	
				self.setupSubtitle();
				self.setupClickScreen();
				self.setupPopupAds();
				if(!self.disableDoubleClickFullscreen_bl) self.addDoubleClickSupport();
				if(!self.data.useChromeless_bl && self.data.showController_bl) self.setupController();
				if(!self.data.useChromeless_bl && self.data.showLogo_bl) self.setupLogo();
				self.setupHider();
				if(!self.data.useChromeless_bl && self.data.showController_bl && self.data.showEmbedButton_bl) self.setupEmbedWindow();
				if(!self.data.useChromeless_bl && self.data.showController_bl) self.setupPasswordWindow();
				if(!self.data.useChromeless_bl  && self.data.showController_bl && self.data.showShareButton_bl) self.setupShareWindow();
				if(self.data.showAopwWindow_bl) self.setupAopw();
				if(!self.data.useChromeless_bl && self.data.showController_bl) self.setupAdsStart();
				if(self.data.hasAnnotiations_bl) self.setupAnnotations();
				if(!self.data.useChromeless_bl) self.setupLargePlayPauseButton();
				self.dispatchEvent(FWDEVPlayer.READY);
				
				self.updateAds(0);
			
			//}
			
			
			
			if(self.displayType == FWDEVPlayer.BACKGROUND_VIDEO && self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					window.addEventListener("pointerdown", self.playVideoBackgroundOnMobileOnInteraction);
				}else{
					window.addEventListener("touchstart", self.playVideoBackgroundOnMobileOnInteraction);
				}	
			}
			
			if(self.data.addKeyboardSupport_bl) self.addKeyboardSupport();
			self.resizeHandler();
		};
		
		this.setupAopw = function(){
			
			FWDEVPOPWindow.setPrototype();
			self.popw_do = new FWDEVPOPWindow(self.data, self);
		}
		
		
		this.playVideoBackgroundOnMobileOnInteraction = function(){
			if(self.hasPointerEvent_bl){
				window.removeEventListener("pointerdown", self.playVideoBackgroundOnMobileOnInteraction);
			}else{
				window.removeEventListener("touchstart", self.playVideoBackgroundOnMobileOnInteraction);
			}	
			self.play();
		}
		

		//###########################################//
		/* Setup popup ads */
		//###########################################//
		this.setupPopupAds = function(){
			FWDEVPPopupAds.setPrototype();
			self.popupAds_do =  new FWDEVPPopupAds(self, self.data);
			self.main_do.addChild(self.popupAds_do);
		};
		
		
		
		
		//#############################################//
		/* setup preloader */
		//#############################################//
		this.setupPreloader = function(){
			FWDEVPPreloader.setPrototype();
			self.preloader_do = new FWDEVPPreloader(self.data.mainPreloader_img, 38, 30, 36, 80);
			self.preloader_do.show(true);
			if(self.showPreloader_bl) self.main_do.addChild(self.preloader_do);
		};
	
		this.positionPreloader = function(){
			self.preloader_do.setX(parseInt((self.stageWidth - self.preloader_do.w)/2));
			self.preloader_do.setY(parseInt((self.stageHeight - self.preloader_do.h)/2));
		};
		
		//##########################################//
		/* setup video poster */
		//##########################################//
		this.setupVideoPoster = function(){
			FWDEVPPoster.setPrototype();
			self.videoPoster_do = new FWDEVPPoster(self, self.data.posterBackgroundColor_str, self.data.show, self.data.fillEntireScreenWithPoster_bl);
			self.main_do.addChild(self.videoPoster_do);
		};
		
		//###########################################//
		/* Setup large play / pause button */
		//###########################################//
		this.setupLargePlayPauseButton = function(){
			
			FWDEVPSimpleButton.setPrototype();
			self.largePlayButton_do = new FWDEVPSimpleButton(
														 self.data.largePlayN_img, 
														 self.data.largePlayS_str, 
														 undefined, 
														 true,
														 self.data.useHEXColorsForSkin_bl,
														 self.data.normalButtonsColor_str,
														 self.data.selectedButtonsColor_str);
			self.largePlayButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, self.largePlayButtonUpHandler);
			self.largePlayButton_do.setOverflow("visible");
			self.largePlayButton_do.hide(false);
			self.main_do.addChild(self.largePlayButton_do);
		};
		
		this.largePlayButtonUpHandler = function(){
			self.disableClick();
			self.largePlayButton_do.hide();
			self.play();
		};
		
		this.positionLargePlayButton =  function(){
			self.largePlayButton_do.setX(parseInt((self.stageWidth - self.largePlayButton_do.w)/2));
			self.largePlayButton_do.setY(parseInt((self.stageHeight - self.largePlayButton_do.h)/2));
		};
		
		//###########################################//
		/* Setup logo */
		//###########################################//
		this.setupLogo = function(){
			FWDEVPLogo.setPrototype();
			self.logo_do = new FWDEVPLogo(self, self.data.logoPath_str, self.data.logoPosition_str, self.data.logoMargins);
			self.main_do.addChild(self.logo_do);
		};
		
		//###########################################//
		/* Setup subtitle */
		//###########################################//
		this.setupSubtitle = function(){
			FWDEVPSubtitle.setPrototype();
			self.subtitle_do =  new FWDEVPSubtitle(self, self.data);
			self.subtitle_do.addListener(FWDEVPSubtitle.LOAD_COMPLETE, self.subtitleLoadComplete);
		};
		
		this.subtitleLoadComplete = function(){
			if(self.controller_do) self.controller_do.enableSubtitleButton();
		};
		
		this.loadSubtitle = function(path){
			//if(self.controller_do) self.controller_do.disableSubtitleButton();
			if(path){
				self.subtitle_do.loadSubtitle(path);
				self.main_do.addChildAt(self.subtitle_do, self.main_do.getChildIndex(self.dumyClick_do) - 1);
			}
		}
		
		//###########################################//
		/* setup controller */
		//###########################################//
		this.setupController = function(){
			
			FWDEVPController.setPrototype();
			self.controller_do = new FWDEVPController(self.data, self);
			self.controller_do.addListener(FWDEVPController.CHANGE_PLAYBACK_RATES, self.changePlaybackRateHandler);
			self.controller_do.addListener(FWDEVPController.CHANGE_SUBTITLE, self.changeSubtitileHandler);
			self.controller_do.addListener(FWDEVPController.PLAY, self.controllerOnPlayHandler);
			self.controller_do.addListener(FWDEVPController.PAUSE, self.controllerOnPauseHandler);
			self.controller_do.addListener(FWDEVPController.START_TO_SCRUB, self.controllerStartToScrubbHandler);
			self.controller_do.addListener(FWDEVPController.SCRUB, self.controllerScrubbHandler);
			self.controller_do.addListener(FWDEVPController.STOP_TO_SCRUB, self.controllerStopToScrubbHandler);
			self.controller_do.addListener(FWDEVPController.CHANGE_VOLUME, self.controllerChangeVolumeHandler);
			self.controller_do.addListener(FWDEVPController.DOWNLOAD_VIDEO, self.controllerDownloadVideoHandler);
			self.controller_do.addListener(FWDEVPController.SHARE, self.controllerShareHandler);
			self.controller_do.addListener(FWDEVPController.CHANGE_YOUTUBE_QUALITY, self.controllerChangeYoutubeQualityHandler);
			self.controller_do.addListener(FWDEVPController.FULL_SCREEN, self.controllerFullScreenHandler);
			self.controller_do.addListener(FWDEVPController.NORMAL_SCREEN, self.controllerNormalScreenHandler);
			self.controller_do.addListener(FWDEVPController.SHOW_EMBED_WINDOW, self.showEmbedWindowHandler);
			self.controller_do.addListener(FWDEVPController.SHOW_SUBTITLE, self.showSubtitleHandler);
			self.controller_do.addListener(FWDEVPController.HIDE_SUBTITLE, self.hideSubtitleHandler);
			self.main_do.addChild(self.controller_do);
		};
		
		this.changePlaybackRateHandler = function(e){
			self.setPlaybackRate(e.rate);
		}
		
		this.changeSubtitileHandler = function(e){
			self.data.startAtSubtitle = e.id;
			self.controller_do.updateSubtitleButtons(self.data.subtitles_ar, self.data.startAtSubtitle);
			self.data.subtitlePath_str = self.data.subtitles_ar[self.data.subtitles_ar.length - 1 - self.data.startAtSubtitle]["source"];
			if(!self.isAdd_bl) self.loadSubtitle(self.data.subtitlePath_str);
		}
		
		this.controllerDownloadVideoHandler = function(){
			self.downloadVideo();
		};
		
		
		this.showSubtitleHandler = function(){
			self.subtitle_do.isShowed_bl = true;
			self.subtitle_do.show();
		};
		
		this.hideSubtitleHandler = function(){
			self.subtitle_do.isShowed_bl = false;
			self.subtitle_do.hide();
		};
		
		this.controllerOnPlayHandler = function(e){
			self.play();
		};
		
		this.controllerOnPauseHandler = function(e){
			self.pause();
		};
		
		this.controllerStartToScrubbHandler = function(e){
			self.startToScrub();
		};
		
		this.controllerScrubbHandler = function(e){
			self.scrub(e.percent);
		};
		
		this.controllerStopToScrubbHandler = function(e){
			self.stopToScrub();
		};
		
		this.controllerChangeVolumeHandler = function(e){
			self.setVolume(e.percent);
		};
		
		this.controllerShareHandler = function(e){
			if(self.videoType_str == FWDEVPlayer.YOUTUBE && self.ytb_do){
				self.isVideoPlayingWhenOpenWindows_bl = self.ytb_do.isPlaying_bl;
			}else if(self.videoType_str == FWDEVPlayer.VIMEO && self.vimeo_do){
				self.isVideoPlayingWhenOpenWindows_bl = self.vimeo_do.isPlaying_bl;
			}else if(FWDEVPlayer.hasHTML5Video){
				if(self.videoScreen_do) self.isVideoPlayingWhenOpenWindows_bl = self.videoScreen_do.isPlaying_bl;
			}
			self.pause();
			
			self.shareWindow_do.show();
			if(self.controller_do){
				self.controller_do.shareButton_do.setSelectedState();
				self.controller_do.shareButton_do.isDisabled_bl = true;
			}
		};
		
		this.controllerChangeYoutubeQualityHandler = function(e){
			if(self.videoType_str == FWDEVPlayer.YOUTUBE){
				self.ytb_do.setQuality(e.quality);
			}else{
				self.data.startAtVideoSource = self.data.videoSource_ar.length -1 - e.id;
				self.setSource(self.data.videoSource_ar[self.data.startAtVideoSource]["source"],false, self.data.videoSource_ar[self.data.startAtVideoSource]["videoType"]);
				self.isQualityChanging_bl = true;
				self.play();
			}
		};
		
		
		
		this.controllerFullScreenHandler = function(){
			self.goFullScreen();
		};
		
		this.controllerNormalScreenHandler = function(){
			self.goNormalScreen();
		};
		
		this.showEmbedWindowHandler = function(){
			if(location.protocol.indexOf("file:") != -1){
				self.main_do.addChild(self.info_do);
				self.info_do.showText("Embedding video files local is not allowed or possible! To function properly please test online.");
				return;
			}
			
			if(self.videoType_str == FWDEVPlayer.YOUTUBE && self.ytb_do){
				self.isVideoPlayingWhenOpenWindows_bl = self.ytb_do.isPlaying_bl;
			}else if(self.videoType_str == FWDEVPlayer.VIMEO && self.vimeo_do){
				self.isVideoPlayingWhenOpenWindows_bl = self.vimeo_do.isPlaying_bl;
			}else if(FWDEVPlayer.hasHTML5Video){
				if(self.videoScreen_do) self.isVideoPlayingWhenOpenWindows_bl = self.videoScreen_do.isPlaying_bl;
			}
			self.pause();
			
			if(self.customContextMenu_do) self.customContextMenu_do.disable();
			self.embedWindow_do.show();
			
			if(self.controller_do){
				self.controller_do.embedButton_do.setSelectedState();
				self.controller_do.embedButton_do.isDisabled_bl = true;
			}
		};
		
		//###########################################//
		/* setup FWDEVPAudioScreen */
		//###########################################//
		this.setupAudioScreen = function(){	
			FWDEVPAudioScreen.setPrototype();
			self.audioScreen_do = new FWDEVPAudioScreen(self, self.data.volume);
			//self.audioScreen_do.addListener(FWDEVPAudioScreen.START, self.audioScreenStartHandler);
			self.audioScreen_do.addListener(FWDEVPAudioScreen.ERROR, self.videoScreenErrorHandler);
			self.audioScreen_do.addListener(FWDEVPAudioScreen.SAFE_TO_SCRUBB, self.videoScreenSafeToScrubbHandler);
			self.audioScreen_do.addListener(FWDEVPAudioScreen.STOP, self.videoScreenStopHandler);
			self.audioScreen_do.addListener(FWDEVPAudioScreen.PLAY, self.videoScreenPlayHandler);
			self.audioScreen_do.addListener(FWDEVPAudioScreen.PAUSE, self.videoScreenPauseHandler);
			self.audioScreen_do.addListener(FWDEVPAudioScreen.UPDATE, self.videoScreenUpdateHandler);
			self.audioScreen_do.addListener(FWDEVPAudioScreen.UPDATE_TIME, self.videoScreenUpdateTimeHandler);
			self.audioScreen_do.addListener(FWDEVPAudioScreen.LOAD_PROGRESS, self.videoScreenLoadProgressHandler);
			self.audioScreen_do.addListener(FWDEVPVideoScreen.START_TO_BUFFER, self.videoScreenStartToBuferHandler);
			self.audioScreen_do.addListener(FWDEVPVideoScreen.STOP_TO_BUFFER, self.videoScreenStopToBuferHandler);
			self.audioScreen_do.addListener(FWDEVPAudioScreen.PLAY_COMPLETE, self.videoScreenPlayCompleteHandler);
			self.main_do.addChild(self.audioScreen_do);
		};
		
		//###########################################//
		/* setup FWDEVPVideoScreen */
		//###########################################//
		this.setupVideoScreen = function(){
			
			FWDEVPVideoScreen.setPrototype();
			self.videoScreen_do = new FWDEVPVideoScreen(self, self.backgroundColor_str, self.data.volume);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.ERROR, self.videoScreenErrorHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.SAFE_TO_SCRUBB, self.videoScreenSafeToScrubbHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.STOP, self.videoScreenStopHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.PLAY, self.videoScreenPlayHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.PAUSE, self.videoScreenPauseHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.UPDATE, self.videoScreenUpdateHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.UPDATE_TIME, self.videoScreenUpdateTimeHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.LOAD_PROGRESS, self.videoScreenLoadProgressHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.START_TO_BUFFER, self.videoScreenStartToBuferHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.STOP_TO_BUFFER, self.videoScreenStopToBuferHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.PLAY_COMPLETE, self.videoScreenPlayCompleteHandler);
			self.main_do.addChild(self.videoScreen_do);
		};
		
		this.videoScreenErrorHandler = function(e){
			var error;
			self.isPlaying_bl = false;
			if(FWDEVPlayer.hasHTML5Video || self.videoType_str == FWDEVPlayer.YOUTUBE){
				error = e.text;
				if(window.console) console.log(e.text);
				if(self.main_do) self.main_do.addChild(self.info_do);
				if(self.info_do) self.info_do.showText(error);
				
				if(self.controller_do){
					self.controller_do.disableMainScrubber();
					if(!self.data.showControllerWhenVideoIsStopped_bl) self.controller_do.hide(!self.isMobile_bl, true);
					//self.largePlayButton_do.hide();
					self.hideClickScreen();
					self.hider.stop();
				}
				
			}else{
				error = e;
				if(self.main_do) self.main_do.addChild(self.info_do);
				if(self.info_do) self.info_do.showText(error);
			}
		
			if(self.logo_do) self.logo_do.hide(false);
			self.preloader_do.hide(false);
			self.showCursor();
			
			self.dispatchEvent(FWDEVPlayer.ERROR, {error:error});
		};
		
		this.videoScreenSafeToScrubbHandler = function(){
			
			if(self.hasHlsPlayedOnce_bl && self.videoType_str == FWDEVPlayer.HLS_JS) return;
			
			if(self.controller_do){
				if(self.isAdd_bl){
					self.controller_do.disableMainScrubber();
					if(self.data.timeToHoldAds != 0) self.adsStart_do.show(true);
					if(self.data.adsThumbnailPath_str && self.data.adsThumbnailPath_str != "none") self.adsStart_do.loadThumbnail(self.data.adsThumbnailPath_str);
					self.positionAds();
				}else{
					self.controller_do.enableMainScrubber();
				}
				
				if(!self.isAdd_bl) self.loadSubtitle(self.data.subtitlePath_str);
				
				self.controller_do.show(true);
				
				if(!self.isAdd_bl && self.controller_do.ytbQualityButton_do){
					self.controller_do.ytbQualityButton_do.enable();
				}
				
				if(!self.isAdd_bl && self.controller_do.playbackRateButton_do){
					self.controller_do.enablePlaybackRateButton();
				}
				if(!self.isAdd_bl && self.controller_do && self.controller_do.downloadButton_do) self.controller_do.downloadButton_do.enable();
				self.hider.start();
			}
		
			if(self.videoType_str != FWDEVPlayer.VIMEO) self.showClickScreen();
			if(self.fillEntireVideoScreen_bl) self.resizeHandler();
			setTimeout(function(){
				if(self.totalDuration && self.controller_do) self.controller_do.positionAdsLines(self.totalDuration);
			}, 500);
		};
		
		this.videoScreenStopHandler = function(e){
			
			if(self.main_do) if(self.main_do.contains(self.info_do)) self.main_do.removeChild(self.info_do);
			
			self.videoPoster_do.allowToShow_bl = true;
			self.isPlaying_bl = false;
		
			if(self.controller_do){
				self.controller_do.disableMainScrubber();
				self.controller_do.showPlayButton();
				self.controller_do.updateMainScrubber(0);
				if(!self.data.showControllerWhenVideoIsStopped_bl){
					self.controller_do.hide(!self.isMobile_bl, true);
				}else{
					self.controller_do.show(!self.isMobile_bl);
				}
				self.hider.stop();
			}
			
			if(self.ytb_do && self.videoType_str == FWDEVPlayer.YOUTUBE){
				//if(self.isMobile_bl){
					//self.ytb_do.destroyYoutube();
				//}else{
					self.ytb_do.stopVideo();
				//}
			}
			
			if(self.logo_do) self.logo_do.hide(true);
			
			self.hideClickScreen();
			
			if(self.isMobile_bl && self.videoType_str == FWDEVPlayer.YOUTUBE){
				self.videoPoster_do.hide();
				if(self.largePlayButton_do) self.largePlayButton_do.hide();
			}
			self.hider.reset();
			self.showCursor();
			self.dispatchEvent(FWDEVPlayer.STOP);
		};
		
		this.videoScreenPlayHandler = function(){
			
			FWDEVPlayer.keyboardCurInstance = self;
			
			if(self.videoType_str == FWDEVPlayer.YOUTUBE
			   && self.ytb_do && self.ytb_do.isStopped_bl) return;
			
			self.isPlaying_bl = true;
			
			if(self.isMobile_bl){
				if(FWDEVPlayer.videoStartBehaviour == FWDEVPlayer.STOP_ALL_VIDEOS){
					FWDEVPlayer.stopAllVideos(self);
				}
			}else{
				if(FWDEVPlayer.videoStartBehaviour == FWDEVPlayer.PAUSE_ALL_VIDEOS){
					FWDEVPlayer.pauseAllVideos(self);
				}
			}
			
			if(self.logo_do && self.videoType_str != FWDEVPlayer.VIMEO) self.logo_do.show(true);
			  
			if(self.controller_do){
				self.controller_do.showPauseButton();
				self.controller_do.show(true);
			}
			
			if(self.popw_do) self.popw_do.hide();
			
			if(self.largePlayButton_do) self.largePlayButton_do.hide();
			self.hider.start();
			self.showCursor();
			
			if(self.isAdd_bl) self.isQualityChanging_bl = false;
			if(self.playAtTime_bl && !self.isAdd_bl) self.scrubbAtTime(self.data.scrubAtTimeAtFirstPlay);
			self.playAtTime_bl = false;
			self.hasHlsPlayedOnce_bl = true;
			
			if(self.isAdd_bl && !self.hasStartedToPlay_bl) self.scrubbAtTime(0);
			
			if(self.isQualityChanging_bl && !self.isAdd_bl){
				self.scrubbAtTime(self.curDurration);
				self.curDurration = 0;
				self.isQualityChanging_bl = false;
			}
			
			if(self.wasAdd_bl && !self.isAdd_bl){
				self.scrubbAtTime(self.scrubAfterAddDuration);
				self.wasAdd_bl = false;
				
			}
			
			if(!self.hasStartedToPlay_bl && self.data.startAtTime && !self.isAdd_bl){
				self.scrubbAtTime(self.data.startAtTime);
			}
			
			
			
			self.hasStartedToPlay_bl = true;
			self.dispatchEvent(FWDEVPlayer.PLAY);
		};
		
		
		
		this.videoScreenPauseHandler = function(){
			
			if(self.videoType_str == FWDEVPlayer.YOUTUBE
			   && self.ytb_do && self.ytb_do.isStopped_bl) return;
			
			self.isPlaying_bl = false;
			
			if(self.controller_do) self.controller_do.showPlayButton(); 
			if(self.largePlayButton_do  && self.videoType_str != FWDEVPlayer.VIMEO  && !self.data.showAnnotationsPositionTool_bl) self.largePlayButton_do.show();
			if(self.controller_do) self.controller_do.show(true);
			if(self.logo_do && self.videoType_str != FWDEVPlayer.VIMEO) self.logo_do.show(true);
			self.hider.stop();
			self.hider.reset();
			self.showCursor();
			if(self.videoType_str != FWDEVPlayer.VIMEO) self.showClickScreen();
			
			if(self.popw_do){
				var isShareWIndowShowed_bl = self.shareWindow_do && self.shareWindow_do.isShowed_bl;
				var isEmbedWIndowShowed_bl = self.embedWindow_do && self.embedWindow_do.isShowed_bl;

				if(!isShareWIndowShowed_bl && !isEmbedWIndowShowed_bl)
				self.popw_do.show();
			}
			self.dispatchEvent(FWDEVPlayer.PAUSE);
		};
		
		this.videoScreenUpdateHandler = function(e){
			var percent;	
			
			if(FWDEVPlayer.hasHTML5Video || self.videoType_str == FWDEVPlayer.YOUTUBE && self.videoType_str != FWDEVPlayer.IMAGE && self.videoType_str != FWDEVPlayer.IFRAME){
				percent = e.percent;
				if(self.controller_do) self.controller_do.updateMainScrubber(percent);
			}else{
				percent = e;
				if(self.controller_do) self.controller_do.updateMainScrubber(percent);
			}
			self.dispatchEvent(FWDEVPlayer.UPDATE, {percent:percent});

		};
		
		this.videoScreenUpdateTimeHandler = function(e, e2, e3, stopHandler){
			
			//if(self.addSource_str && self.addSource_str.indexOf("youtube.") != -1 && !self.isYoutubeReady_bl) return;
			
			var time;
			var seconds;
			if(FWDEVPlayer.hasHTML5Video || self.videoType_str == FWDEVPlayer.YOUTUBE || self.videoType_str == FWDEVPlayer.HLS_JS || self.videoType_str == FWDEVPlayer.VIMEO){
				self.curTime = e.curTime;
				self.totalTime = e.totalTime;
				time = self.curTime + "/" + self.totalTime;
				seconds = e.seconds;
				if(self.controller_do) self.controller_do.updateTime(time);
			}else{
				self.curTime = e;
				self.totalTime = e2;
				time = self.curTime + "/" + self.totalTime;
				seconds = e3;
				if(e == undefined || e2 ==  undefined) time = "00:00/00:00";
				if(self.controller_do) self.controller_do.updateTime(time);
			}
			
			if(stopHandler) return;
			
			if(!self.isAdd_bl){
				if(self.totalTime.length>5){
					self.totalDuration = FWDEVPUtils.getSecondsFromString(self.totalTime);
				}else{
					self.totalDuration = FWDEVPUtils.getSecondsFromString("00:" + self.totalTime);
				}
			}
			
			if(self.isAdd_bl){
				if(self.data.timeToHoldAds > seconds){
					self.adsStart_do.updateText(self.data.skipToVideoText_str + Math.abs(self.data.timeToHoldAds - seconds));
					self.adsSkip_do.hide(false);
					if(self.videoType_str == FWDEVPlayer.IMAGE || self.videoType_str == FWDEVPlayer.IFRAME){
						self.adsStart_do.show(true);
					}
				}else{
					self.adsStart_do.hide(true);
					self.adsSkip_do.show(true);
				}
			}
			
			self.currentSecconds = e.seconds;
			self.subtitle_do.updateSubtitle(parseInt(self.currentSecconds));
			if(!self.isAdd_bl && self.popupAds_do) self.popupAds_do.update(parseInt(e.seconds));
			if(!self.isAdd_bl && self.annotations_do) self.annotations_do.update(e.seconds);
			if(seconds != 0 && !self.isAdd_bl) self.curDurration = seconds;
			
			
			if(self.data.cuePointsSource_ar){
				for(var i=0; i<self.data.cuePointsSource_ar.length; i++){
					var cuePoint = self.data.cuePointsSource_ar[i];
					if(cuePoint.timeStart == e.seconds){
						if(self.data.executeCuepointsOnlyOnce_bl){
							if(!cuePoint.isPlayed_bl) eval(cuePoint.javascriptCall);
						}else{
							eval(cuePoint.javascriptCall);
						}
						cuePoint.isPlayed_bl = true;
					}
				}
			}
			
			if(!self.isAdd_bl) self.updateAds(seconds);
			
			if(self.isPlaying_bl && FWDEVPUtils.getSecondsFromString(self.data.stopAtTime) <= e.seconds) self.stop();
			
			self.dispatchEvent(FWDEVPlayer.UPDATE_TIME, {currentTime:self.curTime, totalTime:self.totalTime});
		};
		
	
		
		this.videoScreenLoadProgressHandler = function(e){
			if(FWDEVPlayer.hasHTML5Video || self.videoType_str == FWDEVPlayer.YOUTUBE){
				if(self.controller_do) self.controller_do.updatePreloaderBar(e.percent);
			}else if(self.videoType_str == FWDEVPlayer.VIDEO){
				if(self.controller_do) self.controller_do.updatePreloaderBar(e);
			}
		};
		
		this.videoScreenStartToBuferHandler = function(){
			if(self.showPreloader_bl) self.preloader_do.show();
		};
		
		this.videoScreenStopToBuferHandler = function(){
			self.preloader_do.hide(true);
		};
		
		this.videoScreenPlayCompleteHandler = function(e, buttonUsedToSkipAds){
			
			/*
			if(self.videoType_str == FWDEVPlayer.VIMEO){
				self.dispatchEvent(FWDEVPlayer.PLAY_COMPLETE);
				return;
			}
			*/
		
			var tempIsAdd_bl = self.isAdd_bl;
			if(self.isAdd_bl){
				if(self.data.openNewPageAtTheEndOfTheAds_bl && self.data.adsPageToOpenURL_str != "none" && !buttonUsedToSkipAds){
					if(self.data.adsPageToOpenTarget_str == "_self"){
						location.href = self.data.adsPageToOpenURL_str;
					}else{
						window.open(self.data.adsPageToOpenURL_str, self.data.adsPageToOpenTarget_str);
					}
				}
					
				self.isAdd_bl = false;	
				self.setSource(self.data.videoSource_ar[self.data.startAtVideoSource]["source"], true );
				
				self.wasAdd_bl = true;
				if(buttonUsedToSkipAds && self.videoType_str == FWDEVPlayer.VIDEO){	
					self.play();
				}else{
					if(!self.isMobile_bl) self.play();
				}	
			}
			
			if(!tempIsAdd_bl){
				if(self.data.loop_bl){
					self.scrub(0);
					self.play();
				}else{
					self.stop();
				}
				self.dispatchEvent(FWDEVPlayer.PLAY_COMPLETE);
			}
			
			if(self.hider) self.hider.reset();
		};
		
		//##########################################//
		/* Setup annotations */
		//##########################################//
		this.setupAnnotations = function(){
			FWDEVPAnnotations.setPrototype();
			self.annotations_do = new FWDEVPAnnotations(self, self.data);
			self.main_do.addChild(self.annotations_do);
		};
		
		//##########################################//
		/* Setup skip adds buttons */
		//##########################################//
		this.setupAdsStart = function(){
			FWDEVPAdsStart.setPrototype();
			self.adsStart_do = new FWDEVPAdsStart(
					self.data.adsButtonsPosition_str, 
					self.data.adsBorderNormalColor_str, 
					"", 
					self.data.adsBackgroundPath_str,
					self.data.adsTextNormalColor);
			
			FWDEVPAdsButton.setPrototype();
			self.adsSkip_do = new FWDEVPAdsButton(
					self.data.skipIconPath_img,
					self.data.skipIconSPath_str,
					self.data.skipToVideoButtonText_str,
					self.data.adsButtonsPosition_str, 
					self.data.adsBorderNormalColor_str, 
					self.data.adsBorderSelectedColor_str, 
					self.data.adsBackgroundPath_str,
					self.data.adsTextNormalColor,
					self.data.adsTextSelectedColor,
					self.data.useHEXColorsForSkin_bl,
					self.data.normalButtonsColor_str,
					self.data.selectedButtonsColor_str);
			self.adsSkip_do.addListener(FWDEVPAdsButton.MOUSE_UP, self.skipAdsMouseUpHandler);
			
			
			self.main_do.addChild(self.adsSkip_do);
			self.main_do.addChild(self.adsStart_do);
		};
		
		this.skipAdsMouseUpHandler = function(e){
			self.videoScreenPlayCompleteHandler(e, true);
		};
		
		this.positionAds = function(animate){
			
			var finalX;
			var finalY;
			//if(self.adsStart_do.isShowed_bl){
				if(self.data.adsButtonsPosition_str == "left"){
					finalX = 0;
				}else{
					finalX = self.stageWidth;
				}
				
				if(self.controller_do && self.controller_do.isShowed_bl){
					finalY = self.stageHeight - self.adsStart_do.h - self.data.controllerHeight - 30;
				}else{
					finalY = self.stageHeight - self.adsStart_do.h - self.data.controllerHeight;
				}
				

				FWDAnimation.killTweensOf(this.adsStart_do);
				if(animate){
					FWDAnimation.to(this.adsStart_do, .8, {y:finalY, ease:Expo.easeInOut});
				}else{
					this.adsStart_do.setY(finalY);
				}
				
				//logger.log(finalX + " " + finalY)
				//logger.log(self.data.adsButtonsPosition_str)
				
				self.adsStart_do.setX(finalX);
			//}
			
			//if(self.adsSkip_do.isShowed_bl){
				if(self.data.adsButtonsPosition_str == "left"){
					finalX = 0;
				}else{
					finalX = self.stageWidth;
				}
				
				if(self.controller_do && self.controller_do.isShowed_bl){
					finalY = self.stageHeight - self.adsSkip_do.h - self.data.controllerHeight - 30;
				}else{
					finalY = self.stageHeight - self.adsSkip_do.h - self.data.controllerHeight;
				}
				
				FWDAnimation.killTweensOf(this.adsSkip_do);
				if(animate){
					FWDAnimation.to(this.adsSkip_do, .8, {y:finalY, ease:Expo.easeInOut});
				}else{
					this.adsSkip_do.setY(finalY);
				}
				
				self.adsSkip_do.setX(finalX);
			//}
		};
		
		
		//##########################################//
		/* Setup embed window */
		//##########################################//
		this.setupShareWindow = function(){
			FWDEVPShareWindow.setPrototype();
			self.shareWindow_do = new FWDEVPShareWindow(self.data, self);
			self.shareWindow_do.addListener(FWDEVPShareWindow.HIDE_COMPLETE, self.shareWindowHideCompleteHandler);
		};
		
		this.shareWindowHideCompleteHandler = function(){
			
			if(self.isVideoPlayingWhenOpenWindows_bl) self.resume();
			
			if(self.controller_do){
				self.controller_do.shareButton_do.isDisabled_bl = false;
				self.controller_do.shareButton_do.setNormalState();
			}
		};
		
		
		
		//##########################################//
		/* Setup embed window */
		//##########################################//
		this.setupPasswordWindow = function(){
			FWDEVPPassword.setPrototype();
			self.passWindow_do = new FWDEVPPassword(self.data, self);
			self.passWindow_do.addListener(FWDEVPPassword.CORRECT, self.passordCorrect);
		};
		
		this.passordCorrect = function(){
			self.passWindow_do.hide();
			self.hasPassedPassowrd_bl = true;
			self.play();
		}
		
		//##########################################//
		/* Setup embed window */
		//##########################################//
		this.setupEmbedWindow = function(){
			FWDEVPEmbedWindow.setPrototype();
			self.embedWindow_do = new FWDEVPEmbedWindow(self.data, self);
			self.embedWindow_do.addListener(FWDEVPEmbedWindow.ERROR, self.embedWindowErrorHandler);
			self.embedWindow_do.addListener(FWDEVPEmbedWindow.HIDE_COMPLETE, self.embedWindowHideCompleteHandler);
		};
		
		this.embedWindowErrorHandler = function(e){
			self.main_do.addChild(self.info_do);
			self.info_do.showText(e.error);
		};
		
		this.embedWindowHideCompleteHandler = function(){
		
			if(self.isVideoPlayingWhenOpenWindows_bl) self.resume();
		
			if(self.controller_do){
				self.controller_do.embedButton_do.isDisabled_bl = false;
				self.controller_do.embedButton_do.setNormalState();
			}
		};
		
		this.copyLinkButtonOnMouseOver = function(){
			if(!self.embedWindow_do.isShowed_bl) return
			self.embedWindow_do.copyLinkButton_do.setSelectedState();
		};
		
		this.copyLinkButtonOnMouseOut = function(){
			if(!self.embedWindow_do.isShowed_bl) return
			self.embedWindow_do.copyLinkButton_do.setNormalState();
		};
		
		this.getLinkCopyPath = function(){
			if(!self.embedWindow_do.isShowed_bl) return
			return self.embedWindow_do.linkToVideo_str;
		};
		
		this.embedkButtonOnMouseOver = function(){
			if(!self.embedWindow_do.isShowed_bl) return
			self.embedWindow_do.copyEmbedButton_do.setSelectedState();
		};
		
		this.embedButtonOnMouseOut = function(){
			if(!self.embedWindow_do.isShowed_bl) return
			self.embedWindow_do.copyEmbedButton_do.setNormalState();
		};
		
		this.getEmbedCopyPath = function(){
			return self.embedWindow_do.finalEmbedCode_str;
		};
		
		
		//#############################################//
		/* Flash screen... */
		//#############################################//
		this.setupFlashScreen = function(){
			if(self.flash_do) return;
			
			if(location.protocol.indexOf("file:") != -1){
				if(FWDEVPUtils.isOpera || FWDEVPUtils.isIEAndLessThen9){
					self.main_do.addChild(self.info_do);
					self.info_do.textHolder_do.screen.innerHTML = "This browser can't play video local, please test online or use a browser like Firefox of Chrome.";
					return;
				}
			}
			
			if(!FWDEVPFlashTest.hasFlashPlayerVersion("9.0.18")) return;
			
			
			self.flash_do = new FWDEVPDisplayObject("div");
			self.flash_do.setBackfaceVisibility();
			self.flash_do.setResizableSizeAfterParent();	
			self.main_do.addChild(self.flash_do);
		
		
			window[self.instanceName_str + "HLSFlashReady"] = function(eventName, args){
				
				if(eventName == "error"){
					self.main_do.addChild(self.info_do);
					self.info_do.showText(args[2] + " - " + args[1]);
				}
				
				if(eventName == "manifest"){
					self.setVolume(self.data.volume);
					
					if(self.data.autoPlay_bl) self.flashObject.playerPlay(-1);
				}
				
				if(eventName == "state"){
					self.hlsState = args[0];
					if(args[0] == "PLAYING"){
						self.isVideoPlayingWhenOpenWindows_bl = true;
						self.isHLSVideoPlayng_bl = true;
						self.videoScreenSafeToScrubbHandler();
						self.videoScreenPlayHandler();
					}else if(args[0] == "PAUSED"){
						self.videoScreenPauseHandler();
						self.isHLSVideoPlayng_bl = false;
					}
				}
				
				if(eventName == "position" && self.isPlaying_bl){
					self.HLSDuration = Math.round(args[0]["duration"]);
					var totalTime = FWDEVPVideoScreen.formatTime(Math.round(args[0]["duration"]));
					var curTime = FWDEVPVideoScreen.formatTime(Math.round(args[0]["position"]));
					var obj = {curTime:curTime, totalTime:totalTime, seconds:Math.round(args[0]["position"])};
					self.hlsPosition = args[0]["position"];
					self.videoScreenUpdateTimeHandler(obj);
					self.videoScreenUpdateHandler({percent:Math.round(args[0]["position"])/Math.round(args[0]["duration"])});
				}
				
				if(eventName == "complete"){
					self.videoScreenPlayCompleteHandler();
				}
			}
			
			self.flashObjectMarkup_str = '<object id="' + self.instanceName_str + '"classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="100%" height="100%"><param name="movie" value="' + self.data.flashPath_str + '"/><param name="allowScriptAccess" value="sameDomain"/><param name="wmode" value="opaque"/><param name="scale" value="noscale"/><param name=FlashVars value="callback=' + self.instanceName_str + 'HLSFlashReady&instanceName=' + self.instanceName_str + '&volume=' + self.data.volume + '&bkColor_str=' + self.videoBackgroundColor_str + '"/><object type="application/x-shockwave-flash" data="' + self.data.flashPath_str + '" width="100%" height="100%"><param name="movie" value="' + self.data.flashPath_str + '"/><param name="wmode" value="opaque"/><param name="scale" value="noscale"/><param name=FlashVars value="callback=' + self.instanceName_str + 'HLSFlashReady&instanceName=' + self.instanceName_str + '&volume=' + self.data.volume + '&bkColor_str=' + self.videoBackgroundColor_str + '"/></object></object>';
			
			self.flash_do.screen.innerHTML = self.flashObjectMarkup_str;
			
			self.registerHLSEvents_int = setInterval(function(){
				if(self.flashObject.playerLoad){
					self.isHLSFlashReady_bl = true;
					clearInterval(self.registerHLSEvents_int);
				}	
			}, 50);
			
			self.flashObject = self.flash_do.screen.firstChild;
			if(!FWDEVPUtils.isIE) self.flashObject = self.flashObject.getElementsByTagName("object")[0];
		};
		
		this.flashScreenFail = function(){
			self.main_do.addChild(self.info_do);
			self.info_do.showText("External interface error!");
			self.resizeHandler();
		};
		
		//######################################//
		/* Add keyboard support */
		//######################################//
		this.addKeyboardSupport = function(){
			if(document.addEventListener){
				document.addEventListener("keydown",  this.onKeyDownHandler);	
				document.addEventListener("keyup",  this.onKeyUpHandler);	
			}else if(document.attachEvent){
				document.attachEvent("onkeydown",  this.onKeyDownHandler);	
				document.attachEvent("onkeyup",  this.onKeyUpHandler);	
			}
		};
		
		this.onKeyDownHandler = function(e){
			if(self.isSpaceDown_bl) return;
			self.isSpaceDown_bl = true;
			if (e.keyCode == 32){
				if(self != FWDEVPlayer.keyboardCurInstance 
				   && (FWDEVPlayer.videoStartBehaviour == "pause" || FWDEVPlayer.videoStartBehaviour == "none")) return
				self.stickOnCurrentInstanceKey_bl = true;
				if(self.videoType_str == FWDEVPlayer.IMAGE || self.videoType_str == FWDEVPlayer.IFRAME){
					if(self.isImageAdsPlaying_bl){
						self.stopUpdateImageInterval();
					}else{
						self.startUpdateImageInterval();
					}
				}else if(self.videoType_str == FWDEVPlayer.YOUTUBE){
					if(!self.ytb_do.isSafeToBeControlled_bl) return;
					self.ytb_do.togglePlayPause();
				}else if(self.videoType_str == FWDEVPlayer.MP3){
					if(!self.audioScreen_do.isSafeToBeControlled_bl) return;
					self.audioScreen_do.togglePlayPause();
				}else if(FWDEVPlayer.hasHTML5Video){
					if(!self.videoScreen_do.isSafeToBeControlled_bl) return;
					if(self.videoScreen_do) self.videoScreen_do.togglePlayPause();
				}else if(self.isFlashScreenReady_bl){
					self.flashObject.togglePlayPause();
				}
				if(e.preventDefault) e.preventDefault();
				return false;
			}
		};
		
		this.onKeyUpHandler = function(e){
			self.isSpaceDown_bl = false;
		};
		
		//####################################//
		/* Setup hider */
		//####################################//
		this.setupHider = function(){
			FWDEVPHider.setPrototype();
			self.hider = new FWDEVPHider(self.main_do, self.controller_do, self.data.controllerHideDelay);
			self.hider.addListener(FWDEVPHider.SHOW, self.hiderShowHandler);
			self.hider.addListener(FWDEVPHider.HIDE, self.hiderHideHandler);
			self.hider.addListener(FWDEVPHider.HIDE_COMPLETE, self.hiderHideCompleteHandler);
		};
		
		this.hiderShowHandler = function(){
			if(self.controller_do && self.isPlaying_bl) self.controller_do.show(true);
			if(self.logo_do && self.data.hideLogoWithController_bl && self.isPlaying_bl && self.videoType_str != FWDEVPlayer.VIMEO) self.logo_do.show(true);
			self.showCursor();
			if(self.isAdd_bl){
				self.positionAds(true);
				self.adsStart_do.showWithOpacity();
				self.adsSkip_do.showWithOpacity();	
			}
			self.subtitle_do.position(true);
			if(self.popupAds_do) self.popupAds_do.position(true);
		};
		
		this.hiderHideHandler = function(){
			
			if(self.controller_do && self.data.showYoutubeQualityButton_bl && FWDEVPUtils.hitTest(self.controller_do.ytbButtonsHolder_do.screen, self.hider.globalX, self.hider.globalY)){
				self.hider.reset();
				return;
			}
			
			if(self.controller_do && self.data.showSubtitleButton_bl && FWDEVPUtils.hitTest(self.controller_do.subtitlesButtonsHolder_do.screen, self.hider.globalX, self.hider.globalY)){
				self.hider.reset();
				return;
			}
			
			if(self.controller_do && self.data.showPlaybackRateButton_bl && FWDEVPUtils.hitTest(self.controller_do.playbackRatesButtonsHolder_do.screen, self.hider.globalX, self.hider.globalY)){
				self.hider.reset();
				return;
			}
			
			if(self.controller_do && FWDEVPUtils.hitTest(self.controller_do.screen, self.hider.globalX, self.hider.globalY)){
				self.hider.reset();
				return;
			}
			
			if(self.controller_do) self.controller_do.hide(true);
			if(self.isAdd_bl){
				self.positionAds(true);
				self.adsStart_do.hideWithOpacity();
				self.adsSkip_do.hideWithOpacity();	
			}
			
			if(self.logo_do && self.data.hideLogoWithController_bl) self.logo_do.hide(true);
			if(self.isFullScreen_bl) self.hideCursor();
			self.subtitle_do.position(true);
			if(self.popupAds_do) self.popupAds_do.position(true);
		};
		
		this.hiderHideCompleteHandler = function(){
			if(self.controller_do) self.controller_do.positionScrollBarOnTopOfTheController();
		};
		
		
		
		//####################################//
		// API
		//###################################//
		this.play = function(){
		
			if(!self.isAPIReady_bl) return;
			
		
			if(self.videoType_str == FWDEVPlayer.YOUTUBE && !self.isYoutubeReady_bl){
				if(self.showPreloader_bl) self.preloader_do.show();
				if(self.largePlayButton_do) self.largePlayButton_do.show();
				return;
			}
			
			if(self.videoType_str == FWDEVPlayer.VIMEO && !self.isVimeoReady_bl){
				if(self.showPreloader_bl) self.preloader_do.show();
				if(self.largePlayButton_do) self.largePlayButton_do.show();
				return;
			}
			
			if(self.videoType_str == FWDEVPlayer.HLS_JS){
				if(location.protocol.indexOf("file:") >= 0){
					self.main_do.addChild(self.info_do);
					self.info_do.showText("HLS m3u8 videos can't be played local on this browser, please test it online!.");
					return;
				}
				//if(!self.isMobile_bl && !self.isHLSManifestReady_bl) return;
			}
			
			if(self.data.playVideoOnlyWhenLoggedIn_bl){
				if(!self.data.isLoggedIn_bl){
					self.main_do.addChild(self.info_do);
					self.info_do.showText(self.data.loggedInMessage_str);
					if(self.largePlayButton_do) self.largePlayButton_do.show();
					return;
				}
			}
			
			if(!self.isAdd_bl && self.data.videosSource_ar[self.data.startAtVideoSource]["isPrivate"] && !self.hasPassedPassowrd_bl && self.passWindow_do){
				if(self.largePlayButton_do) self.largePlayButton_do.show();
				self.passWindow_do.show();
				return
			}
			self.hasPassedPassowrd_bl = true;
			
			if(self.isMobile_bl && self.videoType_str == FWDEVPlayer.YOUTUBE && self.ytb_do && !self.ytb_do.isSafeToBeControlled_bl) return;
			
			if(self.isMobile_bl){
				FWDEVPlayer.stopAllVideos(self);
			}else{
				if(FWDEVPlayer.videoStartBehaviour == FWDEVPlayer.PAUSE_ALL_VIDEOS){
					FWDEVPlayer.pauseAllVideos(self);
				}else if(FWDEVPlayer.videoStartBehaviour == FWDEVPlayer.STOP_ALL_VIDEOS){
					FWDEVPlayer.stopAllVideos(self);
				}
			}
		
			if(self.videoType_str == FWDEVPlayer.IMAGE || self.videoType_str == FWDEVPlayer.IFRAME){
				self.startUpdateImageInterval();
			}else if(self.videoType_str == FWDEVPlayer.YOUTUBE && self.ytb_do){
				self.ytb_do.play();
			}else if(self.videoType_str == FWDEVPlayer.VIMEO && self.vimeo_do){
				if(self.vimeo_do.isStopped_bl && self.data.autoPlay_bl){
					self.startVimeoVideoWithDelay = setTimeout(self.vimeo_do.play, 1000);
				}else{
					self.vimeo_do.play();
				}
			}else if(self.videoType_str == FWDEVPlayer.MP3){
				if(self.audioScreen_do) self.audioScreen_do.play();
			}else if(FWDEVPlayer.hasHTML5Video){
				
				if(self.videoType_str == FWDEVPlayer.HLS_JS && !self.isHLSManifestReady_bl){
					self.videoScreen_do.initVideo();
					self.setupHLS();
					self.hlsJS.loadSource(self.videoSourcePath_str);
					self.hlsJS.attachMedia(self.videoScreen_do.video_el);
					
					self.hlsJS.on(Hls.Events.MANIFEST_PARSED,function(e){
						self.isHLSManifestReady_bl = true;
						self.play();
					});
				}else{
					if(self.videoScreen_do) self.videoScreen_do.play();
				}
				
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.playVideo();
			}
			
			FWDEVPlayer.keyboardCurInstance = self;
			self.videoPoster_do.allowToShow_bl = false;
			if(self.largePlayButton_do) self.largePlayButton_do.hide();
			
			self.videoPoster_do.hide();
		};
		
		this.pause = function(){
			if(!self.isAPIReady_bl) return;
			
			if(self.videoType_str == FWDEVPlayer.IMAGE || self.videoType_str == FWDEVPlayer.IFRAME){
				self.stopUpdateImageInterval();
			}else if(self.videoType_str == FWDEVPlayer.YOUTUBE){
				self.ytb_do.pause();
			}else if(self.videoType_str == FWDEVPlayer.VIMEO && self.vimeo_do){
				self.vimeo_do.pause();
			}else if(self.videoType_str == FWDEVPlayer.MP3){
				if(self.audioScreen_do) self.audioScreen_do.pause();
			}else if(FWDEVPlayer.hasHTML5Video){
				if(self.videoScreen_do) self.videoScreen_do.pause();
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.pauseVideo();
			}
		};
		
		this.resume = function(){
			if(!self.isAPIReady_bl) return;
			
			if(self.videoType_str == FWDEVPlayer.IMAGE || self.videoType_str == FWDEVPlayer.IFRAME){
				self.startUpdateImageInterval();
			}else if(self.videoType_str == FWDEVPlayer.YOUTUBE && self.ytb_do){
				self.ytb_do.resume();
			}else if(self.videoType_str == FWDEVPlayer.VIMEO && self.vimeo_do){
				self.vimeo_do.resume();
			}else if(self.videoType_str == FWDEVPlayer.MP3){
				if(self.audioScreen_do) self.audioScreen_do.resume();
			}else if(FWDEVPlayer.hasHTML5Video){
				if(self.videoScreen_do) self.videoScreen_do.resume();
			}
		};
		
		self.hasHlsPlayedOnce_bl = false;
		this.stop = function(source){
			if(!self.isAPIReady_bl) return;
		
			
			self.hasPassedPassowrd_bl = false;
			self.isHLSManifestReady_bl = false;
			self.playYoutubeIfLoadedLate_bl = false;
			self.isPlaying_bl = false;
			self.hider.reset();
			self.destroyHLS();
			
			clearTimeout(self.startVimeoVideoWithDelay);
			clearTimeout(self.load360ScriptsId_to);
			//clearInterval(self.keepCheckingYoutubeAPI_int);
			//clearInterval(self.checkIfYoutubePlayerIsReadyId_int);
			if(self.popw_do) self.popw_do.hide();
			
			if(self.controller_do && self.controller_do.ytbQualityButton_do){
				self.controller_do.ytbQualityButton_do.disable();
				self.controller_do.hideQualityButtons(false);
				self.controller_do.updateMainScrubber(0);
				self.controller_do.updatePreloaderBar(0);
			}
			
			if(self.controller_do && self.controller_do.subtitleButton_do) self.controller_do.subtitleButton_do.disable();
			if(self.controller_do && self.controller_do.downloadButton_do) self.controller_do.downloadButton_do.disable();
			if(self.controller_do) self.controller_do.disablePlaybackRateButton();
			
			if(self.isAdd_bl){
				self.setPlaybackRate(1);
			}else{
				self.setPlaybackRate(self.data.defaultPlaybackRate_ar[self.data.startAtPlaybackIndex]);
			}
			
			if(self.controller_do && self.data.showPlaybackRateButton_bl){
				self.controller_do.updatePlaybackRateButtons(self.data.updatePlaybackRateButtons, self.data.startAtPlaybackIndex);
			}
			
			if(self.videoType_str == FWDEVPlayer.IMAGE || self.videoType_str == FWDEVPlayer.IFRAME){
				self.stopUpdateImageInterval();
			}else if(self.videoType_str == FWDEVPlayer.YOUTUBE && self.ytb_do){
				self.ytb_do.stop();
			}else if(self.videoType_str == FWDEVPlayer.VIMEO){
				if(self.vimeo_do) self.vimeo_do.stop();
			}else if(self.videoType_str == FWDEVPlayer.MP3){
				if(self.audioScreen_do) self.audioScreen_do.stop();
			}else if(FWDEVPlayer.hasHTML5Video){
				self.videoScreen_do.stop();
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.stopVideo();
			}
			
				
			if(self.isMobile_bl){
				if(source && source.indexOf(".") != -1){
					if(self.data.showControllerWhenVideoIsStopped_bl && self.controller_do) self.controller_do.show(true);
					if(self.videoPoster_do) self.videoPoster_do.show();
					if(self.largePlayButton_do  && !self.data.showAnnotationsPositionTool_bl) self.largePlayButton_do.show();
				}else{
					if(!source && self.videoType_str == FWDEVPlayer.VIDEO){
						self.videoPoster_do.show();
						if(self.largePlayButton_do) self.largePlayButton_do.show();
					}else if(self.useYoutube_bl){
						if(!self.ytb_do.ytb){
							self.ytb_do.setupVideo();
						}
					}
				}
			}else{
				if(self.data.showControllerWhenVideoIsStopped_bl && self.controller_do_do) self.controller_do.show(true);
				self.videoPoster_do.show();
				if(self.largePlayButton_do) self.largePlayButton_do.show();
			}
			
			
			
			
			self.subtitle_do.hide();
			self.hasHlsPlayedOnce_bl = false;
			self.isSafeToScrub_bl = false;
			self.hlsState = undefined;
			if(self.popupAds_do) self.popupAds_do.hideAllPopupButtons(false);
			if(self.adsStart_do) self.adsStart_do.hide(true);
			if(self.adsSkip_do) self.adsSkip_do.hide(true);
			
			if(self.controller_do) self.controller_do.hideAdsLines();
			
			if(self.annotations_do) self.annotations_do.update(100000);
			
			self.hasStartedToPlay_bl = false;
		};
		
		this.startToScrub = function(){
			if(!self.isAPIReady_bl) return;
			if(self.videoType_str == FWDEVPlayer.YOUTUBE && self.ytb_do && self.ytb_do.isSafeToBeControlled_bl){
				self.ytb_do.startToScrub();
			}else if(self.videoType_str == FWDEVPlayer.VIMEO && self.vimeo_do){
				self.vimeo_do.startToScrub();
			}else if(self.videoType_str == FWDEVPlayer.MP3){
				if(self.audioScreen_do) self.audioScreen_do.startToScrub();
			}else if(FWDEVPlayer.hasHTML5Video){
				if(self.videoScreen_do) self.videoScreen_do.startToScrub();
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.startToScrub();
			}
		};
		
		this.stopToScrub = function(){
			if(!self.isAPIReady_bl) return;
			if(self.videoType_str == FWDEVPlayer.YOUTUBE && self.ytb_do && self.ytb_do.isSafeToBeControlled_bl){
				self.ytb_do.stopToScrub();
			}else if(self.videoType_str == FWDEVPlayer.VIMEO && self.vimeo_do){
				self.vimeo_do.stopToScrub();
			}else if(self.videoType_str == FWDEVPlayer.MP3){
				if(self.audioScreen_do) self.audioScreen_do.stopToScrub();
			}else if(FWDEVPlayer.hasHTML5Video){
				if(self.videoScreen_do) self.videoScreen_do.stopToScrub();
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.stopToScrub();
			}
		};
		
		this.scrub = function(percent, time){
			if(!self.isAPIReady_bl) return;
			if(isNaN(percent)) return;
			if(percent < 0){
				percent = 0;
			}else if(percent > 1){
				percent = 1;
			}
			
			if(self.videoType_str == FWDEVPlayer.YOUTUBE && self.ytb_do && self.ytb_do.isSafeToBeControlled_bl){
				self.ytb_do.scrub(percent);
			}else if(self.videoType_str == FWDEVPlayer.VIMEO && self.vimeo_do){
				self.vimeo_do.scrub(percent);
			}else if(self.videoType_str == FWDEVPlayer.MP3){
				if(self.audioScreen_do) self.audioScreen_do.scrub(percent);
			}else if(FWDEVPlayer.hasHTML5Video){
				if(self.videoScreen_do) self.videoScreen_do.scrub(percent);	
			}else if(self.isFlashScreenReady_bl){
				self.flashObject.scrub(percent);
			}
	
			self.dispatchEvent(FWDEVPlayer.SCRUB, {percent:percent});
		};
		
		this.scrubbAtTime = function(duration){
		
			if(!self.isAPIReady_bl || !duration) return;
				
		
			if(String(duration).indexOf(":") != -1) duration = FWDEVPUtils.getSecondsFromString(duration);
			
			if(self.videoType_str == FWDEVPlayer.YOUTUBE && self.ytb_do){
				self.ytb_do.scrubbAtTime(duration);
			}else if(self.videoType_str == FWDEVPlayer.VIMEO && self.vimeo_do){
				self.vimeo_do.scrubbAtTime(duration);
			}else if(self.videoType_str == FWDEVPlayer.MP3){
				if(self.audioScreen_do) self.audioScreen_do.scrubbAtTime(duration);
			}else if(FWDEVPlayer.hasHTML5Video){
				if(self.videoScreen_do) self.videoScreen_do.scrubbAtTime(duration);
			}
		};
		
		this.share = function(){
			if(!self.isAPIReady_bl) return;
			self.shareWindow_do.show();
		}
		
		
		this.setVolume = function(volume){
			if(!self.isAPIReady_bl || self.isMobile_bl) return;
			if(self.controller_do) self.controller_do.updateVolume(volume, true);
			self.volume = volume;
			if(self.ytb_do){
				self.ytb_do.setVolume(volume);
			}
			
			if(self.vimeo_do){
				self.vimeo_do.setVolume(volume);
			}
			
			if(self.audioScreen_do){
				self.audioScreen_do.setVolume(volume);
			}
			
			if(FWDEVPlayer.hasHTML5Video){
				if(self.videoScreen_do) self.videoScreen_do.setVolume(volume);
			}
			
			
			self.dispatchEvent(FWDEVPlayer.VOLUME_SET, {volume:volume});
		};
		
		this.setPosterSource = function(path){
			if(!self.isAPIReady_bl || !path) return;
			var path_ar = path.split(",");
				
			if(self.isMobile_bl && path_ar[1] != undefined){
				path = path_ar[1];
			}else{
				path = path_ar[0];
			}
			
			if(path.indexOf("encrypt:") != -1) path = atob(path.substr(8));
			
			self.posterPath_str = path;
			if(self.videoSourcePath_str.indexOf(".") == -1 && self.useYoutube_bl && self.isMobile_bl){
				self.videoPoster_do.setPoster("youtubemobile");
			}else{
				self.videoPoster_do.setPoster(self.posterPath_str);
				if(self.prevPosterSource_str != path) self.dispatchEvent(FWDEVPlayer.UPDATE_POSTER_SOURCE);
			}
			self.prevPosterSource_str = path;
		};
		
		//#####################################################//
		/* Update ads */
		//#####################################################//
		this.updateAds = function(duration){
			if(self.isAdd_bl) return;
			if(!this.isAdd_bl){
				for(var i=0; i<self.data.adsSource_ar.length; i++){
					if(duration >= self.data.adsSource_ar[i].timeStart && duration <= (self.data.adsSource_ar[i].timeStart + 1) 
						&& !self.data.adsSource_ar[i].played_bl && duration != self.prevDuration){
						self.isAdd_bl = true;
						self.addSource_str = self.data.adsSource_ar[i].source;
						self.data.adsSource_ar[i].played_bl = true;
						self.data.adsThumbnailPath_str = self.data.adsSource_ar[i].thumbnailSource;
						self.data.timeToHoldAds = self.data.adsSource_ar[i].timeToHoldAds;
						self.data.adsPageToOpenURL_str = self.data.adsSource_ar[i].link;
						self.data.adsPageToOpenTarget_str = self.data.adsSource_ar[i].target;
						self.scrubAfterAddDuration = self.data.adsSource_ar[i].timeStart;
						self.curImageTotalTime = self.data.adsSource_ar[i].addDuration;
						
						
						self.setSource(self.addSource_str);
					
						if(self.videoType_str != FWDEVPlayer.IMAGE && self.videoType_str != FWDEVPlayer.IFRAME && !self.isMobile_bl){
							 if(self.addSource_str.indexOf("youtube.") != -1 && self.ytb_do && self.ytb_do.hasBeenCreatedOnce_bl) self.play();
							  if(self.addSource_str.indexOf("youtube.") == -1) self.play();
						}
						
						if(this.controller_do) this.controller_do.line_ar[i].setVisible(false);
					}
				}
			}
			
			
			
			if(this.controller_do){
				self.controller_do.setupAdsLines(self.data.adsSource_ar);
				if(self.totalDuration) self.controller_do.positionAdsLines(self.totalDuration);
			}
			
			if(!this.isAdd_bl && !self.setSourceExternal_bl) self.setSource(self.data.videoSource_ar[self.data.startAtVideoSource]["source"], false, self.data.videoSource_ar[self.data.startAtVideoSource]["videoType"]);
			if(this.controller_do) this.controller_do.positionAdsLines(self.curDuration);
			self.prevDuration = duration;
		};
		
		//#####################################################//
		/* Setup image screen */
		//#####################################################//
		this.updateImageScreen = function(source){
			
			if(self.videoType_str == FWDEVPlayer.IFRAME){
				if(!self.iFrame_do){		
					self.iFrame_do = new FWDEVPDisplayObject("iframe");
					self.iFrame_do.hasTransform3d_bl = false;
					self.iFrame_do.hasTransform2d_bl = false;
					self.iFrame_do.setBackfaceVisibility();
				}
				
				self.main_do.addChildAt(self.iFrame_do, self.main_do.getChildIndex(self.dumyClick_do) + 1);
				self.showClickScreen();
				
				self.iFrame_do.screen.src = source;
				self.positionAdsImage();
				self.startToUpdateAdsButton();
				return;
			}
			
			if(!this.imageSceeenHolder_do){
				this.imageSceeenHolder_do = new FWDEVPDisplayObject("div");
				this.imageSceeenHolder_do.setX(0);
				this.imageSceeenHolder_do.setY(0);
				this.imageSceeenHolder_do.setBkColor("#000000");
			}
			
			self.main_do.addChildAt(self.imageSceeenHolder_do,  self.main_do.getChildIndex(self.dumyClick_do) - 1);
			self.showClickScreen();
			if(self.imageSceeenHolder_do.contains(self.imageScreen_do)) self.imageSceeenHolder_do.removeChild(this.imageScreen_do);
			this.imageScreen_do = null;
			
			self.imageScreen_do = new FWDEVPDisplayObject("img");
			
			self.imageAdd_img = new Image()
			self.imageAdd_img.src = source;
		
			if(self.showPreloader_bl) self.preloader_do.show();
			if(self.largePlayButton_do) self.largePlayButton_do.hide();
			
			self.imageAdd_img.onload = function(){
				self.imageScreen_do.setScreen(self.imageAdd_img);
				self.imageScreen_do.setAlpha(0);
				FWDAnimation.to(self.imageScreen_do, 1, {alpha:1});
				self.imageAddOriginalWidth = self.imageAdd_img.width;
				self.imageAddOriginalHeight = self.imageAdd_img.height;
				self.preloader_do.hide();
				self.imageSceeenHolder_do.addChild(self.imageScreen_do);
				self.positionAdsImage();
				self.startToUpdateAdsButton();
			}
			
			self.imageAdd_img.onerror = function(){
				self.main_do.addChild(self.info_do);
				self.info_do.showText("Advertisment image with path " +  source + " can't be found");
				self.preloader_do.hide();
				return;
			}
		}
		
		this.positionAdsImage = function(){
			
			if(self.videoType_str == FWDEVPlayer.IFRAME && self.iFrame_do){
				self.iFrame_do.setWidth(self.stageWidth);
				self.iFrame_do.setHeight(self.stageHeight);
		
			}
			
			if(!self.imageScreen_do || self.videoType_str != FWDEVPlayer.IMAGE) return;
			var scaleX = self.stageWidth/self.imageAddOriginalWidth;
			var scaleY = self.stageHeight/self.imageAddOriginalHeight;
			
			totalScale = 0;
			if(scaleX >= scaleY){
				totalScale = scaleX;
			}else if(scaleX <= scaleY){
				totalScale = scaleY;
			}
			
			finalW = parseInt(self.imageAddOriginalWidth * totalScale);
			finalH = parseInt(self.imageAddOriginalHeight * totalScale);
			finalX = parseInt((self.stageWidth - finalW)/2);
			finalY = parseInt((self.stageHeight - finalH)/2);
			
			self.imageScreen_do.setWidth(finalW); 
			self.imageScreen_do.setHeight(finalH); 
			self.imageScreen_do.setX(finalX); 
			self.imageScreen_do.setY(finalY); 
			self.imageSceeenHolder_do.setWidth(self.stageWidth);
			self.imageSceeenHolder_do.setHeight(self.stageHeight);
		}
		
		this.startToUpdateAdsButton = function(){
			self.curImageTime = 0;
			self.updateAdsButton();
			self.stopUpdateImageInterval();
			self.startUpdateImageInterval();
			self.setPlayAndPauseButtonState();	
		}
		
		this.stopUpdateImageInterval = function(){
			self.isImageAdsPlaying_bl = false;
			
			clearInterval(self.startUpdateAdsId_int);
			self.setPlayAndPauseButtonState();
			if(self.largePlayButton_do) self.largePlayButton_do.show();
			self.isPlaying_bl = false;
			self.hider.stop();	
		}
		
		this.startUpdateImageInterval = function(){
			self.isImageAdsPlaying_bl = true;
			self.startUpdateAdsId_int = setInterval(self.updateAdsButton, 1000);
			self.setPlayAndPauseButtonState();
			if(self.largePlayButton_do) self.largePlayButton_do.hide();
			self.isPlaying_bl = true;
			self.hider.start();
		}
		
		this.updateAdsButton = function(){
			
			self.videoScreenUpdateTimeHandler({curTime:FWDEVPUtils.formatTime(self.curImageTime), totalTime:FWDEVPUtils.formatTime(self.curImageTotalTime), seconds:self.curImageTime});
			self.videoScreenUpdateHandler({percent:self.curImageTime/self.curImageTotalTime});
			if(self.curImageTime == self.curImageTotalTime) self.videoScreenPlayCompleteHandler();
			self.curImageTime += 1;
		}
		
		this.setPlayAndPauseButtonState = function(){
			if(this.isImageAdsPlaying_bl){
				if(self.controller_do) self.controller_do.showPauseButton();
			}else{
				if(self.controller_do) self.controller_do.showPlayButton();
			}
		}
		
		this.isThreeJsLoaded_bl = false;
		this.isThreeJsOrbitLoaded_bl = false;
		this.load360ScriptsId_to;
		this,isHLSJsLoaded_bl = false;
		
		this.destroyHLS = function(){
			if(self.hlsJS){
				self.hlsJS.destroy();
				self.hlsJS = null;
			}
		}
		
		this.setupHLS = function(){
			if(self.hlsJS) return;
			self.isHLSJsLoaded_bl = true;
			self.hlsJS = new Hls();
			
			console.log("setup hls");
			
			 self.hlsJS.on(Hls.Events.ERROR, function(event,data) {
				
				self.HLSError_str;
				switch(data.details) {
					case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
						try {
						 self.HLSError_str ="cannot load <a href=\"" + data.context.url + "\">" + url + "</a><br>HTTP response code:" + data.response.code + " <br>" + data.response.text;
							if(data.response.code === 0) {
							 self.HLSError_str += "this might be a CORS issue, consider installing <a href=\"https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi\">Allow-Control-Allow-Origin</a> Chrome Extension";
							}
						} catch(err) {
						  self.HLSError_str = "cannot load " + self.videoSourcePath_str;
						}
						break;
					case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
						self.HLSError_str = "timeout while loading manifest";
						break;
						case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
						self.HLSError_str = "error while parsing manifest:" + data.reason;
					break;
						case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
						self.HLSError_str = "error while loading level playlist";
					break;
						case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
						self.HLSError_str = "timeout while loading level playlist";
					break;
						case Hls.ErrorDetails.LEVEL_SWITCH_ERROR:
						self.HLSError_str = "error while trying to switch to level " + data.level;
					break;
						case Hls.ErrorDetails.FRAG_LOAD_ERROR:
						self.HLSError_str = "error while loading fragment " + data.frag.url;
					break;
						case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
						self.HLSError_str = "timeout while loading fragment " + data.frag.url;
					break;
						case Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
						self.HLSError_str = "Frag Loop Loading Error";
					break;
						case Hls.ErrorDetails.FRAG_DECRYPT_ERROR:
						self.HLSError_str = "Decrypting Error:" + data.reason;
					break;
						case Hls.ErrorDetails.FRAG_PARSING_ERROR:
						self.HLSError_str = "Parsing Error:" + data.reason;
					break;
						case Hls.ErrorDetails.KEY_LOAD_ERROR:
						self.HLSError_str ="error while loading key " + data.frag.decryptdata.uri;
					break;
						case Hls.ErrorDetails.KEY_LOAD_TIMEOUT:
						self.HLSError_str = "timeout while loading key " + data.frag.decryptdata.uri;
					break;
						case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
						self.HLSError_str = "Buffer Append Error";
					break;
						case Hls.ErrorDetails.BUFFER_ADD_CODEC_ERROR:
						self.HLSError_str = "Buffer Add Codec Error for " + data.mimeType + ":" + data.err.message;
					break;
						case Hls.ErrorDetails.BUFFER_APPENDING_ERROR:
						self.HLSError_str = "Buffer Appending Error";
					break;
						default:
					break;
				}
				
				
				if(self.HLSError_str){
					if(console) console.log(self.HLSError_str);
					self.info_do.allowToRemove_bl = false;
					self.main_do.addChild(self.info_do);
					self.info_do.showText(self.HLSError_str);
					self.resizeHandler();
				}
			});
		}
		
		var recoverDecodingErrorDate,recoverSwapAudioCodecDate;
		function handleMediaError() {
			  if(autoRecoverError) {
				var now = performance.now();
				if(!recoverDecodingErrorDate || (now - recoverDecodingErrorDate) > 3000) {
				  recoverDecodingErrorDate = performance.now();
				  self.HLSError_str = "try to recover media Error ..."
				  self.hlsJS.recoverMediaError();
				} else {
				  if(!recoverSwapAudioCodecDate || (now - recoverSwapAudioCodecDate) > 3000) {
					recoverSwapAudioCodecDate = performance.now();
					self.HLSError_str = "try to swap Audio Codec and recover media Error ...";
					self.hlsJS.swapAudioCodec();
					self.hlsJS.recoverMediaError();
				  } else {
					self.HLSError_str = "cannot recover, last media error recovery failed ...";
				  }
				}
			  }
			  
			  if(self.HLSError_str){
				if(console) console.log(self.HLSError_str);
				self.info_do.allowToRemove_bl = false;
				self.main_do.addChild(self.info_do);
				self.info_do.showText(self.HLSError_str);
				self.resizeHandler();
			}
		}
		
		//#####################################################//
		/* set source */
		//#####################################################//
		this.setSource = function(source, overwrite, videoType){
			
		
			if(!self.isAPIReady_bl) return;
			source = source.replace(/&amp;/g, "&");
			self.videoSource_str = source;
			self.videoSourcePath_str = source;
			self.finalVideoPath_str = source;
		
			self.currentSecconds = 0;
			clearInterval(self.tryHLS_int);
			clearTimeout(self.load360ScriptsId_to);
			if(source.indexOf("encrypt:") != -1) source = atob(source.substr(8));
			if(source ==  self.prevVideoSource_str && !overwrite) return;
			self.videoSource_str = source;
			self.videoSourcePath_str = source;
			self.finalVideoPath_str = source;
			
			if(self.main_do.contains(self.info_do)){
				self.main_do.removeChild(self.info_do);
			}
			
			self.stop();
		
			if(self.videoSourcePath_str.indexOf("vimeo.com") != -1){
				self.videoType_str = FWDEVPlayer.VIMEO;
				if(self.controller_do)  self.controller_do.setX(-5000);
			}else if(self.videoSourcePath_str.indexOf("youtube.") != -1){
				self.videoType_str = FWDEVPlayer.YOUTUBE;
				if(self.controller_do) self.controller_do.setX(0);
			}else if(self.videoSourcePath_str.indexOf(".jpg") != -1 
					|| self.videoSourcePath_str.indexOf(".jpeg") != -1 
					|| self.videoSourcePath_str.indexOf(".png") != -1
			){
				self.videoType_str = FWDEVPlayer.IMAGE;
				if(self.controller_do) self.controller_do.setX(0);
			}else if(self.videoSourcePath_str.toLowerCase().indexOf(".mp3") != -1){
				self.videoType_str = FWDEVPlayer.MP3;
				if(self.controller_do) self.controller_do.setX(0);
			}else if(self.videoSourcePath_str.toLowerCase().indexOf("http") != -1
				 && self.videoSourcePath_str.indexOf(".m3u8") == -1 
				 &&  self.videoSourcePath_str.toLowerCase().indexOf(".mp4") == -1
				 && self.videoSourcePath_str.toLowerCase().indexOf("google.com") == -1
				 && self.videoSourcePath_str.toLowerCase().indexOf("lh3.") == -1
			){
				self.videoType_str = FWDEVPlayer.IFRAME;
				if(self.controller_do) self.controller_do.setX(0);
			}else{
				if(self.controller_do) self.controller_do.setX(0);
				if(!self.isMobile_bl && !FWDEVPlayer.hasHTMLHLS && self.videoSourcePath_str.indexOf(".m3u8") != -1){
					self.videoType_str = FWDEVPlayer.HLS_JS;
				}else{
					self.videoType_str = FWDEVPlayer.VIDEO;
				}
			}
			
			if(self.videoSource_str.indexOf("youtube.") != -1 && !self.ytb_do){
				
				setTimeout(function(){
					
					if(self.showPreloader_bl){
						self.main_do.addChild(self.preloader_do);	
						self.preloader_do.show(true);
						if(self.largePlayButton_do) self.largePlayButton_do.hide();
						
						if(location.protocol.indexOf("file:") != -1 && FWDEVPUtils.isIE) self.main_do.addChild(self.info_do);
					}
				}, 50);
				
				if(location.protocol.indexOf("file:") != -1 && FWDEVPUtils.isIE){
					self.info_do.allowToRemove_bl = false;
					self.main_do.addChild(self.info_do);
					
					self.info_do.showText("This browser dosen't allow the Youtube API to run local, please test it online or in another browser like Firefox or Chrome.");
			
					self.resizeHandler();
				
					return;
				}	
				
				self.setupYoutubeAPI();
				return;
			}
			
			
		
			if(self.videoSource_str.indexOf("vimeo.") != -1 && !self.isVimeoReady_bl){
					
				if(location.protocol.indexOf("file:") != -1){
					self.info_do.allowToRemove_bl = false;
					self.main_do.addChild(self.info_do);
					self.info_do.showText("This browser dosen't allow playing Vimeo videos local, please test online.");
					self.resizeHandler();
					return;
				}
				
				
				if(self.showPreloader_bl){
					self.main_do.addChild(self.preloader_do);	
					self.preloader_do.show(true);
				}
				if(self.largePlayButton_do) self.largePlayButton_do.hide();
			
				self.setupVimeoPlayer();
				
				return;
			}
		
			
			
			self.isGR = false;
			self.is360 = false;
			
			if(videoType){
				if(videoType.toLowerCase() == "360degreevideo"){
					self.isGR = false;
					self.is360 = true;
				}else if(videoType.toLowerCase() == "greenscreenvideo"){
					self.isGR = true;
					self.is360 = false;
				}
			}
			
			if(self.isGR || self.is360){
				self.main_do.setBkColor("transparent");
				self.videoScreen_do.setBkColor("transparent");
			}else{
				self.main_do.setBkColor(self.backgroundColor_str);
				self.videoScreen_do.setBkColor(self.backgroundColor_str);
			}
			
			if(!self.isMobile_bl && !FWDEVPlayer.hasHTMLHLS && self.videoSourcePath_str.indexOf(".m3u8") != -1 && !self.isHLSJsLoaded_bl && !FWDEVPlayer.isHLSJsLoaded_bl){
				
				if(location.protocol.indexOf("file:") != -1){
					self.info_do.allowToRemove_bl = false;
					self.main_do.addChild(self.info_do);
					self.info_do.showText("This browser dosen't allow playing HLS / live streaming videos local, please test online.");
					self.resizeHandler();
					return;
				}
				
				var script = document.createElement('script');
				script.src = self.data.hlsPath_str;
				script.onerror = function(){
					self.main_do.addChild(self.info_do);
					self.info_do.showText("Error loading HLS library <font color='#FF0000'>" + self.data.hlsPath_str + "</font>.");
					self.preloader_do.hide();
					return;
				}
				
				script.onload = function () {
					self.isHLSJsLoaded_bl = true;
					FWDEVPlayer.isHLSJsLoaded_bl = true;
					self.setupHLS();
					self.setSource(self.videoSourcePath_str, false,self.data.videoSource_ar[self.data.startAtVideoSource]["videoType"]);
				}
				document.head.appendChild(script); //or something of the likes
				return;
			}
			
			
			if(self.is360 && !self.isThreeJsOrbigLoaded_bl){
					
				if(FWDEVPUtils.isLocal){
					self.main_do.addChild(self.info_do);
					self.info_do.showText("This browser dosen't allow playing 360 videos local, please test online.");
					self.preloader_do.hide();
					return;
				}
				
				if(!FWDEVPUtils.hasWEBGL){
					self.main_do.addChild(self.info_do);
					self.info_do.showText("Playing 360 videos in this browser is not possible because it dosen't support WEBGL.");
					self.preloader_do.hide();
					return;
				}
				
				if(!self.isThreeJsLoaded_bl && !FWDEVPlayer.hasThreeJsLoaded_bl){
					var script = document.createElement('script');
					script.src = self.data.threeJsPath_str;
					script.onerror = function(){
						self.main_do.addChild(self.info_do);
						self.info_do.showText("Error loading 360 degree library <font color='#FF0000'>" + self.data.threeJsPath_str + "</font>.");
						self.preloader_do.hide();
						return;
					}
					script.onload = function () {
						self.isThreeJsOrbigLoaded_bl = true;
						
							var script2 = document.createElement('script');
							script2.src = self.data.threeJsControlsPath_str;
							script2.onerror = function(){
								self.main_do.addChild(self.info_do);
								self.info_do.showText("Error loading three.js from <font color='#FF0000'>" + self.data.threeJsControlsPath_str + "</font>.");
								self.preloader_do.hide();
								return;
							}
							script2.onload = function () {
								FWDEVPlayer.hasThreeJsLoaded_bl = true;
								self.isThreeJsOrbitLoaded_bl = true;
								if(self.isThreeJsOrbigLoaded_bl && self.isThreeJsOrbitLoaded_bl) self.setSource(self.data.videoSource_ar[self.data.startAtVideoSource]["source"],false, self.data.videoSource_ar[self.data.startAtVideoSource]["videoType"]);
								clearTimeout(self.load360ScriptsId_to);
								self.preloader_do.hide();
							};
							document.head.appendChild(script2); //or something of the likes
								
							};

					document.head.appendChild(script); //or something of the likes
					
					
					this.load360ScriptsId_to = setTimeout(function(){
						if(self.showPreloader_bl) self.preloader_do.show();
					},1000);
					return;
				}
			}
			
			if(self.is360){
				self.dumyClick_do.getStyle().cursor = 'url(' + self.data.handPath_str + '), default';
			}else{
				self.dumyClick_do.getStyle().cursor = "auto";
			}
			
			self.prevVideoSource_str = source;
			
			if(!source){
				self.main_do.addChild(self.info_do);
				self.info_do.showText("Video source is not defined!");
				return;
			}
			
			if(source.indexOf("youtube.") != -1){
				var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
				source = source.match(regExp)[2];
			}
			
			if(self.popupAds_do){
				if(self.data.popupAds_ar){
					self.popupAds_do.resetPopups(self.data.popupAds_ar);
				}
			}
			
			self.stop(source);
			
			if(self.controller_do && self.data.subtitles_ar && self.data.subtitles_ar.length > 1){
				self.controller_do.updateSubtitleButtons(self.data.subtitles_ar, self.data.startAtSubtitle);
				self.data.subtitlePath_str = self.data.subtitles_ar[self.data.subtitles_ar.length - 1 - self.data.startAtSubtitle]["source"];
			}
			
			
			if(self.controller_do && !self.isQualityChanging_bl) self.controller_do.disableSubtitleButton();
			
			if(self.data.scrubAtTimeAtFirstPlay != "00:00:00") self.playAtTime_bl = true;
		
			if(self.controller_do && self.controller_do.downloadButton_do) self.controller_do.downloadButton_do.disable();
			
			if(self.controller_do) self.controller_do.updateHexColorForScrubber(self.isAdd_bl);
				
			self.resizeHandler();
			if(self.getVideoSource()) self.dispatchEvent(FWDEVPlayer.UPDATE_VIDEO_SOURCE);

			//Image
			if(self.videoType_str == FWDEVPlayer.IMAGE || self.videoType_str == FWDEVPlayer.IFRAME){
				self.updateImageScreen(self.videoSourcePath_str);
				if(self.videoPoster_do) self.videoPoster_do.setX(-5000);
				return;
			}else{
				if(self.main_do.contains(self.imageSceeenHolder_do)) self.main_do.removeChild(self.imageSceeenHolder_do);
				if(self.main_do.contains(self.iFrame_do)) self.main_do.removeChild(self.iFrame_do);
		   		if(self.videoPoster_do) self.videoPoster_do.setX(0);
			}
			
			if(self.isAdd_bl){
				self.setPlaybackRate(1);
			}else{
				self.setPlaybackRate(self.data.defaultPlaybackRate_ar[self.data.startAtPlaybackIndex]);
			}
			
			if(self.controller_do){
				if(self.videoType_str == FWDEVPlayer.VIMEO
					|| self.videoType_str == FWDEVPlayer.HLS_JS
					|| self.videoType_str == FWDEVPlayer.IMAGE
					|| self.videoType_str == FWDEVPlayer.IFRAME
				){
					self.controller_do.removePlaybackRateButton();
				}else{
					self.controller_do.addPlaybackRateButton();
				}
			}
			
			if(self.controller_do && self.data.showPlaybackRateButton_bl){
				self.controller_do.updatePlaybackRateButtons(self.data.updatePlaybackRateButtons, self.data.startAtPlaybackIndex);
			}
			
		
			
			//Vimeo
			if(self.videoType_str == FWDEVPlayer.VIMEO){
				
				//if(self.vimeo_do) self.vimeo_do.setX(-5000);
				
				if(self.videoScreen_do) self.videoScreen_do.setX(-5000);
				if(self.audioScreen_do) self.audioScreen_do.setX(-5000);
				self.audioScreen_do.setVisible(false);
				
				
				if(self.ytb_do && self.ytb_do.ytb){
					//self.ytb_do.ytb.a.style.visibility = "hidden";
					self.ytb_do.showDisable();
				}
							
				if(self.flash_do){
					self.flash_do.setWidth(1);
					self.flash_do.setHeight(1);
				}else{
					self.videoScreen_do.setVisible(false);
				}
			
				//if(!self.isMobile_bl) self.vimeo_do.showDisable();
				self.vimeo_do.setSource(source);
				if(self.isMobile_bl){
					self.videoPoster_do.hide();
					if(self.largePlayButton_do) self.largePlayButton_do.hide();
				}else{
					self.setPosterSource(self.posterPath_str);
					self.videoPoster_do.show();
					if(self.largePlayButton_do && !self.data.showAnnotationsPositionTool_bl) self.largePlayButton_do.show();
					if(self.data.autoPlay_bl) self.play();
				}
				
				if(self.getVideoSource()) self.dispatchEvent(FWDEVPlayer.UPDATE_VIDEO_SOURCE);
				this.resizeHandler();
				self.vimeo_do.iFrame_do.screen.style.left = "0px";
				self.vimeo_do.setX(0);
				return;
			}
		
				
			//Youtube
			if(self.videoType_str == FWDEVPlayer.YOUTUBE && self.ytb_do &&  self.ytb_do.ytb &&  self.ytb_do.ytb.cueVideoById){
			
				//if(self.ytb_do.ytb) return;	
				if(self.ytb_do && self.ytb_do.ytb){
					//self.ytb_do.ytb.a.style.visibility = "visible";
					self.ytb_do.hideDisable();
				}
				
				self.ytb_do.setX(0);
				
				if(self.flash_do){
					self.flash_do.setWidth(1);
					self.flash_do.setHeight(1);
				}else{
					self.videoScreen_do.setVisible(false);
				}
				
				if(self.vimeo_do) self.vimeo_do.setX(-5000);
				if(self.videoScreen_do) self.videoScreen_do.setX(-5000);
				if(self.audioScreen_do) self.audioScreen_do.setX(-5000);
				self.audioScreen_do.setVisible(false);
				
				
				self.ytb_do.setSource(source);
				if(self.isMobile_bl){
					self.videoPoster_do.hide();
					if(self.largePlayButton_d) self.largePlayButton_do.hide();
				}else{
					self.setPosterSource(self.posterPath_str);
					self.videoPoster_do.show();
					if(self.largePlayButton_do  && !self.data.showAnnotationsPositionTool_bl) self.largePlayButton_do.show();
					if(self.data.autoPlay_bl) self.play();
					if(!self.isMobile_bl && self.isAdd_bl) self.play();
					//if(self.playYoutubeIfLoadedLate_bl && !self.isMobile_bl) self.play();
					
				}
				
				
				if(self.controller_do){
					self.controller_do.updatePreloaderBar(0);
					self.controller_do.addYtbQualityButton();
				}
				if(self.getVideoSource()) self.dispatchEvent(FWDEVPlayer.UPDATE_VIDEO_SOURCE);
				return;
			}
			
			
			//HTML / Flash video
			if(source.indexOf("google.") == -1){
				var path_ar = source.split(",");
				
				if(self.isMobile_bl && path_ar[1] != undefined){
					source = path_ar[1];
				}else{
					source = path_ar[0];
				}
			}
			self.finalVideoPath_str = source;
			
			if(self.videoType_str == FWDEVPlayer.MP3){
				self.setPosterSource(self.posterPath_str);
				if(self.ytb_do && self.ytb_do.ytb){
					//self.ytb_do.ytb.a.style.visibility = "hidden";
					self.ytb_do.showDisable();
				}
				
				if(self.vimeo_do) self.vimeo_do.setX(-5000);
				if(self.ytb_do) self.ytb_do.setX(-5000);
				
				if(self.flash_do){
					self.flash_do.setWidth(1);
					self.flash_do.setHeight(1);
				}else{
					self.videoScreen_do.setVisible(false);
				}
				
				self.videoPoster_do.show();
				if(self.largePlayButton_do  && !self.data.showAnnotationsPositionTool_bl) self.largePlayButton_do.show();
				self.audioScreen_do.setX(0);
				self.audioScreen_do.setVisible(true);
				
				if(self.showPreloader_bl) self.preloader_do.hide(true);
			
				
				self.audioScreen_do.setSource(source);
				if(self.data.autoPlay_bl) self.play();								
				if(self.controller_do && self.data.videoSource_ar && self.data.videoSource_ar.length > 1){
					self.controller_do.updatePreloaderBar(0);					
					self.controller_do.addYtbQualityButton();	
					self.controller_do.updateQuality(self.data.videoLabels_ar, self.data.videoLabels_ar[self.data.videoLabels_ar.length - 1 - self.data.startAtVideoSource]);
				}else if(self.controller_do){	
					self.controller_do.removeYtbQualityButton();
				}
				return;
			}
			
			if(FWDEVPlayer.hasHTML5Video && self.videoType_str == FWDEVPlayer.VIDEO || self.videoType_str == FWDEVPlayer.HLS_JS){
				
				self.setPosterSource(self.posterPath_str);
				
				if(self.ytb_do && self.ytb_do.ytb){
					//self.ytb_do.ytb.a.style.visibility = "hidden";
					self.ytb_do.showDisable();
				}
				
				if(self.vimeo_do) self.vimeo_do.setX(-5000);
				if(self.ytb_do) self.ytb_do.setX(-5000);
				if(self.audioScreen_do) self.audioScreen_do.setX(-5000);
				self.audioScreen_do.setVisible(false);
				
				self.videoPoster_do.show();
				if(self.largePlayButton_do  && !self.data.showAnnotationsPositionTool_bl) self.largePlayButton_do.show();
				
				self.videoScreen_do.setX(0)
				self.videoScreen_do.setVisible(true);
				if(self.showPreloader_bl) self.preloader_do.hide(true);
				
				if(self.videoType_str == FWDEVPlayer.HLS_JS){
					
					self.videoScreen_do.setSource(source);
					self.videoScreen_do.initVideo();
					self.setupHLS();
					self.hlsJS.loadSource(self.videoSourcePath_str);
					self.hlsJS.attachMedia(self.videoScreen_do.video_el);
					self.hlsJS.on(Hls.Events.MANIFEST_PARSED,function(e){
						self.isHLSManifestReady_bl = true;
						if(self.data.autoPlay_bl) self.play();
					});
				}else{
					self.videoScreen_do.setSource(source);
					if(self.data.autoPlay_bl) self.play();
					if(self.flash_do){
						self.flash_do.setWidth(1);
						self.flash_do.setHeight(1);
					}
				}
				
				
				if(self.controller_do && self.data.videoSource_ar && self.data.videoSource_ar.length > 1){
					self.controller_do.updatePreloaderBar(0);
					self.controller_do.addYtbQualityButton();
					self.controller_do.updateQuality(self.data.videoLabels_ar, self.data.videoLabels_ar[self.data.videoLabels_ar.length - 1 - self.data.startAtVideoSource]);
				}else if(self.controller_do){
					self.controller_do.removeYtbQualityButton();
				}
			}
			
			
			self.prevVideoSourcePath_str = self.videoSourcePath_str;
		};
		
	
		//#############################################//
		/* go fullscreen / normal screen */
		//#############################################//
		this.goFullScreen = function(){
			if(!self.isAPIReady_bl || self.displayType ==  FWDEVPlayer.BACKGROUND_VIDEO) return;
			
			if(document.addEventListener){
				document.addEventListener("fullscreenchange", self.onFullScreenChange);
				document.addEventListener("mozfullscreenchange", self.onFullScreenChange);
				document.addEventListener("webkitfullscreenchange", self.onFullScreenChange);
				document.addEventListener("MSFullscreenChange", self.onFullScreenChange);
			}
			
			if(document.documentElement.requestFullScreen) {
				self.main_do.screen.documentElement.requestFullScreen();
			}else if(document.documentElement.mozRequestFullScreen){ 
				self.main_do.screen.mozRequestFullScreen();
			}else if(document.documentElement.webkitRequestFullScreen){
				self.main_do.screen.webkitRequestFullScreen();
			}else if(document.documentElement.msRequestFullscreen){
				self.main_do.screen.msRequestFullscreen();
			}
			
			self.disableClick();
			
			self.main_do.getStyle().position = "fixed";
			document.documentElement.style.overflow = "hidden";
			self.main_do.getStyle().zIndex = 9999999999998;
		
			self.isFullScreen_bl = true;
			if(self.controller_do){
				self.controller_do.showNormalScreenButton();
				self.controller_do.setNormalStateToFullScreenButton();
			}
			
			var scrollOffsets = FWDEVPUtils.getScrollOffsets();
			self.lastX = scrollOffsets.x;
			self.lastY = scrollOffsets.y;
			
			window.scrollTo(0,0);
		
			if(self.isMobile_bl) window.addEventListener("touchmove", self.disableFullScreenOnMobileHandler);
			self.dispatchEvent(FWDEVPlayer.GO_FULLSCREEN);
			self.resizeHandler();
		};
		
		this.disableFullScreenOnMobileHandler = function(e){
			if(e.preventDefault) e.preventDefault();
		};
		
		this.goNormalScreen = function(){		
			if(!self.isAPIReady_bl || self.displayType ==  FWDEVPlayer.BACKGROUND_VIDEO) return;
			
			if (document.cancelFullScreen) {  
				document.cancelFullScreen();  
			}else if (document.mozCancelFullScreen) {  
				document.mozCancelFullScreen();  
			}else if (document.webkitCancelFullScreen) {  
				document.webkitCancelFullScreen();  
			}else if (document.msExitFullscreen) {  
				document.msExitFullscreen();  
			}
		
			self.addMainDoToTheOriginalParent();
			self.isFullScreen_bl = false;
			
			self.resizeHandler();
		};
		
		this.addMainDoToTheOriginalParent = function(){
			if(!self.isFullScreen_bl) return;
			
			if(document.removeEventListener){
				document.removeEventListener("fullscreenchange", self.onFullScreenChange);
				document.removeEventListener("mozfullscreenchange", self.onFullScreenChange);
				document.removeEventListener("webkitfullscreenchange", self.onFullScreenChange);
				document.removeEventListener("MSFullscreenChange", self.onFullScreenChange);
			}
				
			if(self.controller_do) self.controller_do.setNormalStateToFullScreenButton();
			
			if(self.displayType == FWDEVPlayer.RESPONSIVE
			   || self.displayType == FWDEVPlayer.AFTER_PARENT){
				if(FWDEVPUtils.isIEAndLessThen9){
					document.documentElement.style.overflow = "auto";
				}else{
					document.documentElement.style.overflow = "visible";
				}
				self.main_do.getStyle().position = "relative";
				self.main_do.getStyle().zIndex = 0;
			}else{
				self.main_do.getStyle().position = "absolute";
				self.main_do.getStyle().zIndex = 9999999999998;
			}
			
			
			self.showCursor();
			if(self.controller_do) self.controller_do.showFullScreenButton();
		
			window.scrollTo(self.lastX, self.lastY);
			
			if(!FWDEVPUtils.isIE){
				setTimeout(function(){
					window.scrollTo(self.lastX, self.lastY);
				}, 150);
			}
			
			if(self.isMobile_bl) window.removeEventListener("touchmove", self.disableFullScreenOnMobileHandler);
			self.dispatchEvent(FWDEVPlayer.GO_NORMALSCREEN);
		};
		
		this.onFullScreenChange = function(e){
			if(!(document.fullScreen || document.msFullscreenElement  || document.mozFullScreen || document.webkitIsFullScreen || document.msieFullScreen)){
				if(self.controller_do) self.controller_do.showNormalScreenButton();
				self.addMainDoToTheOriginalParent();
				self.isFullScreen_bl = false;
			}
		};
		
	
		
		this.downloadVideo = function(){
			if(!self.isAPIReady_bl) return;
			var sourceName;
			
			var source = self.data.videoSource_ar[self.data.startAtVideoSource]["source"];
			if(source.indexOf("/") != -1){
				sourceName = source.substr(source.lastIndexOf("/") + 1);
			}else{
				sourceName = source;
			}
		
			self.data.downloadVideo(source, sourceName);
		};
		
		this.setVideoSource =  function(source, videoType){
			if(!self.isAPIReady_bl) return;
			self.isAdd_bl = false;
			self.data.videoSource_ar[self.data.startAtVideoSource]["source"] = source;
			self.data.videoSource_ar[self.data.startAtVideoSource]["videoType"] = videoType;
			self.setSource(source, false, videoType);
		};
		
		this.getVideoSource = function(){
			if(!self.isAPIReady_bl) return;
			return self.finalVideoPath_str;
		};
		
		this.updateVolume = function(){
			if(!self.isAPIReady_bl) return;
			self.setVolume();
		}
		
		this.getPosterSource = function(){
			if(!self.isAPIReady_bl) return;
			return self.posterPath_str;
		};
		
		this.getCurrentTime = function(){
			var tm;
			if(!self.curTime){
				tm = "00:00";
			}else{
				tm = self.curTime;
			}
			return tm;
		};
		
		this.getTotalTime = function(){
			var tm;
			if(!self.totalTime){
				tm = "00:00";
			}else{
				tm = self.totalTime;
			}
			return tm;
		};
		
		
		this.setPlaybackRate = function(rate){
			if(!self.isAPIReady_bl) return;
			if(self.videoType_str == FWDEVPlayer.VIDEO && self.videoScreen_do){
				self.videoScreen_do.setPlaybackRate(rate);
			}else if(self.videoType_str == FWDEVPlayer.MP3 && self.audioScreen_do){
				self.audioScreen_do.setPlaybackRate(rate);
			}else if(self.videoType_str == FWDEVPlayer.YOUTUBE){
				if(self.ytb_do && self.ytb_do.ytb) self.ytb_do.setPlaybackRate(rate);
			}
		}
		
		this.fillEntireVideoScreen = function(param){
			this.fillEntireVideoScreen_bl = param;
			this.resizeHandler();
		};
		
		this.updateHEXColors = function(normalColor, selectedColor){
			if(!self.isAPIReady_bl) return;
			self.controller_do.updateHEXColors(normalColor, selectedColor);
			if(self.largePlayButton_do) self.largePlayButton_do.updateHEXColors(normalColor, selectedColor);
			if(self.shareWindow_do) self.shareWindow_do.updateHEXColors(normalColor, selectedColor);
			if(self.embedWindow_do) self.embedWindow_do.updateHEXColors(normalColor, selectedColor);
			if(self.adsSkip_do) self.adsSkip_do.updateHEXColors(normalColor, selectedColor);
		};
		
		//###########################################//
		/* Hide / show cursor */
		//###########################################//
		this.hideCursor = function(){
			document.documentElement.style.cursor = "none";
			document.getElementsByTagName("body")[0].style.cursor = "none";
			if(!self.isAdd_bl) self.dumyClick_do.getStyle().cursor = "none";
		};
		
		this.showCursor = function(){
			document.documentElement.style.cursor = "auto";
			document.getElementsByTagName("body")[0].style.cursor = "auto";
			if(self.isAdd_bl){
				self.dumyClick_do.setButtonMode(true);
			}else{
				if(self.is360){
					self.dumyClick_do.getStyle().cursor = 'url(' + self.data.handPath_str + '), default';
				}else{
					self.dumyClick_do.getStyle().cursor = "auto";
				}
			}
		};

		
		//###########################################//
		/* event dispatcher */
		//###########################################//
		this.addListener = function (type, listener){
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function.");
	    	
	        var event = {};
	        event.type = type;
	        event.listener = listener;
	        event.target = this;
	        this.listeners.events_ar.push(event);
	    };
	    
	    this.dispatchEvent = function(type, props){
	    	if(this.listeners == null) return;
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this && this.listeners.events_ar[i].type === type){		
	    	        if(props){
	    	        	for(var prop in props){
	    	        		this.listeners.events_ar[i][prop] = props[prop];
	    	        	}
	    	        }
	        		this.listeners.events_ar[i].listener.call(this, this.listeners.events_ar[i]);
	        	}
	        }
	    };
	    
	   this.removeListener = function(type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function." + type);
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this 
	        			&& this.listeners.events_ar[i].type === type
	        			&& this.listeners.events_ar[i].listener ===  listener
	        	){
	        		this.listeners.events_ar.splice(i,1);
	        		break;
	        	}
	        }  
	    };
	    
	   //#############################################//
		/* clean main events */
		//#############################################//
		self.cleanMainEvents = function(){
			if(window.removeEventListener){
				window.removeEventListener("resize", self.onResizeHandler);
			}else if(window.detachEvent){
				window.detachEvent("onresize", self.onResizeHandler);
			}
		
			clearTimeout(self.resizeHandlerId_to);
			clearTimeout(self.resizeHandler2Id_to);
			clearTimeout(self.hidePreloaderId_to);
			clearTimeout(self.orientationChangeId_to);
		};
		
		//#####################################################//
		/* Add background if embedded */
		//#####################################################//
		var args = FWDEVPUtils.getUrlArgs(window.location.search);
		var embedTest = args.EVPInstanceName;
	
		var tt = FWDEVPlayer.instaces_ar.length;
		var video;
		
		if(embedTest){
			for(var i=0; i<tt; i++){
				video = FWDEVPlayer.instaces_ar[i];
				if(video.props.instanceName == embedTest){
					var ws = FWDEVPUtils.getViewportSize();
					
					var dumy_do = new FWDEVPDisplayObject("div");
					dumy_do.setBkColor(video.props.backgroundColor);
					dumy_do.setWidth(ws.w);
					dumy_do.setHeight(ws.h);
				
					document.documentElement.style.overflow = "hidden";
					document.getElementsByTagName("body")[0].style.overflow = "hidden";
					
					if(FWDEVPUtils.isIEAndLessThen9){
						document.getElementsByTagName("body")[0].appendChild(dumy_do.screen);
					}else{
						document.documentElement.appendChild(dumy_do.screen);
					}
					break;
				}
			}
		}
	
		self.init();
	};
	
	
	/* set prototype */
	FWDEVPlayer.setPrototype =  function(){
		FWDEVPlayer.prototype = new FWDEVPEventDispatcher();
	};
	
	FWDEVPlayer.stopAllVideos = function(pVideo){
		var tt = FWDEVPlayer.instaces_ar.length;
		var video;
		for(var i=0; i<tt; i++){
			video = FWDEVPlayer.instaces_ar[i];
			if(video != pVideo){
				video.stop();
			}
		};
	};
	
	FWDEVPlayer.pauseAllVideos = function(pVideo){
		var tt = FWDEVPlayer.instaces_ar.length;
		var video;
		for(var i=0; i<tt; i++){
			video = FWDEVPlayer.instaces_ar[i];
			if(video != pVideo){
				video.pause();
			}
		};
	};
	
	
	FWDEVPlayer.hasHTML5VideoTestIsDone = false;
	if(!FWDEVPlayer.hasHTML5VideoTestIsDone){
		FWDEVPlayer.hasHTML5Video = (function(){
			var videoTest_el = document.createElement("video");
			var flag = false;
			if(videoTest_el.canPlayType){
				flag = Boolean(videoTest_el.canPlayType('video/mp4') == "probably" || videoTest_el.canPlayType('video/mp4') == "maybe");
				FWDEVPlayer.canPlayMp4 = Boolean(videoTest_el.canPlayType('video/mp4') == "probably" || videoTest_el.canPlayType('video/mp4') == "maybe");
				FWDEVPlayer.canPlayOgg = Boolean(videoTest_el.canPlayType('video/ogg') == "probably" || videoTest_el.canPlayType('video/ogg') == "maybe");
				FWDEVPlayer.canPlayWebm = Boolean(videoTest_el.canPlayType('video/webm') == "probably" || videoTest_el.canPlayType('video/webm') == "maybe");
			}
			
			if(self.isMobile_bl) return true;
			//return false;
			FWDEVPlayer.hasHTML5VideoTestIsDone = true;
			return flag;
		}());
	}
	
	FWDEVPlayer.hasHTMLHLS = (function(){
		var videoTest_el = document.createElement("video");
		var flag = false;
		if(videoTest_el.canPlayType){
			flag = Boolean(videoTest_el.canPlayType('application/vnd.apple.mpegurl') === "probably" || videoTest_el.canPlayType('application/vnd.apple.mpegurl') === "maybe");
		}
		return flag;
	}());
	
	FWDEVPlayer.instaces_ar = [];
	
	FWDEVPlayer.curInstance = null;
	FWDEVPlayer.keyboardCurInstance = null;
	FWDEVPlayer.areInstancesCreated_bl = null;
	FWDEVPlayer.isYoutubeAPICreated_bl = false;
	FWDEVPlayer.isEmbedded_bl = false;
	
	
	FWDEVPlayer.PAUSE_ALL_VIDEOS = "pause";
	FWDEVPlayer.STOP_ALL_VIDEOS = "stop";
	FWDEVPlayer.DO_NOTHING = "none";
	FWDEVPlayer.VIMEO = "vimeo";
	FWDEVPlayer.YOUTUBE = "youtube";
	FWDEVPlayer.VIDEO = "video";
	FWDEVPlayer.MP3 = "mp3";
	
	FWDEVPlayer.IFRAME = "iframe";
	FWDEVPlayer.SCRUB = "scrub";
	FWDEVPlayer.BACKGROUND_VIDEO = "backgroundvideo";
	FWDEVPlayer.READY = "ready";
	FWDEVPlayer.STOP = "stop";
	FWDEVPlayer.PLAY = "play";
	FWDEVPlayer.PAUSE = "pause";
	FWDEVPlayer.UPDATE = "update";
	FWDEVPlayer.UPDATE_TIME = "updateTime";
	FWDEVPlayer.UPDATE_VIDEO_SOURCE = "updateVideoSource";
	FWDEVPlayer.UPDATE_POSTER_SOURCE = "udpatePosterSource";
	FWDEVPlayer.ERROR = "error";
	FWDEVPlayer.PLAY_COMPLETE = "playComplete";
	FWDEVPlayer.VOLUME_SET = "volumeSet";
	FWDEVPlayer.GO_FULLSCREEN = "goFullScreen";
	FWDEVPlayer.GO_NORMALSCREEN = "goNormalScreen";
	FWDEVPlayer.IMAGE = "image";
	
	FWDEVPlayer.HLS_JS = "HLS_JS";
	FWDEVPlayer.RESPONSIVE = "responsive";
	FWDEVPlayer.FULL_SCREEN = "fullscreen";
	FWDEVPlayer.AFTER_PARENT = "afterparent";
	
	
	window.FWDEVPlayer = FWDEVPlayer;
	
}(window));