/* Gallery */
(function (window){
	'use strict';
	var FWDEVPlayer = function(props){
			
		var self = this;
	
		this.props = props;
		this.isInstantiate_bl = false;
		this.displayType = props.displayType || FWDEVPlayer.RESPONSIVE;
		
		if(self.displayType.toLowerCase() != FWDEVPlayer.RESPONSIVE 
		   && self.displayType.toLowerCase() != FWDEVPlayer.FULL_SCREEN
		   && self.displayType.toLowerCase() != FWDEVPlayer.AFTER_PARENT
		   && self.displayType.toLowerCase() != FWDEVPlayer.STICKY
		   && self.displayType.toLowerCase() != FWDEVPlayer.LIGHTBOX
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

		this.stickyOnScroll = props.stickyOnScroll || "no";
		this.stickyOnScroll = self.stickyOnScroll == "yes" ? true : false;
		if(self.displayType != FWDEVPlayer.RESPONSIVE) this.stickyOnScroll = false;
		self.isMinShowed = true;
		
		self.stickyOnScrollWidth = props.stickyOnScrollWidth || 700;
		self.stickyOnScrollHeight = props.stickyOnScrollHeight || 394; 
		
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
		
		if(!FWDEVPlayer.iFrame && !FWDEVPUtils.isMobile && FWDEVPUtils.isChrome){
			FWDEVPlayer.iFrame = document.createElement("iframe");
			FWDEVPlayer.iFrame.src = self.mainFolderPath_str + 'audio/silent.mp3';
			FWDEVPlayer.iFrame.style.position = 'absolute';
			FWDEVPlayer.iFrame.style.top = '-500px';
			document.documentElement.appendChild(FWDEVPlayer.iFrame);
		}
		
		this.skinPath_str = props.skinPath;
		if((self.skinPath_str.lastIndexOf("/") + 1) != self.skinPath_str.length){
			self.skinPath_str += "/";
		}
		
		this.warningIconPath_str = self.mainFolderPath_str + this.skinPath_str + "warningIcon.png";
		this.fillEntireVideoScreen_bl = false;
		this.isShowedFirstTime_bl = true;
		FWDEVPlayer.instaces_ar.push(this);
	
		/* init gallery */
		self.init = function(){
			
			if(self.isInstantiate_bl) return;
			
			FWDTweenLite.ticker.useRAF(true);
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
			
			this.position_str = self.props_obj.verticalPosition;
			if(!this.position_str) this.position_str = FWDEVPlayer.POSITION_TOP;
			if(this.position_str == "bottom"){
				this.position_str = FWDEVPlayer.POSITION_BOTTOM;
			}else{
				this.position_str = FWDEVPlayer.POSITION_TOP;
			}
			
			
			this.horizontalPosition_str = self.props_obj.horizontalPosition;
			if(!this.horizontalPosition_str) this.horizontalPosition_str = FWDEVPlayer.CENTER;
			if(this.horizontalPosition_str == "center"){
				this.horizontalPosition_str = FWDEVPlayer.CENTER;
			}else if(this.horizontalPosition_str == "left"){
				this.horizontalPosition_str = FWDEVPlayer.LEFT;
			}else if(this.horizontalPosition_str == "right"){
				this.horizontalPosition_str = FWDEVPlayer.RIGHT;
			}else{
				this.horizontalPosition_str = FWDEVPlayer.CENTER;
			}
			
			self.isShowed_bl = self.props.showPlayerByDefault; 
			self.isShowed_bl = self.isShowed_bl == "no" ? false : true;
			
			self.preloaderBackgroundColor = self.props_obj.preloaderBackgroundColor || "#000000";
			self.preloaderFillColor = self.props_obj.preloaderFillColor || "#FFFFFF";
			this.offsetX = parseInt(props.offsetX) || 0;
			this.offsetY = parseInt(props.offsetY) || 0
		
			if(self.isEmbedded_bl) self.displayType = FWDEVPlayer.FULL_SCREEN;
			
			this.body = document.getElementsByTagName("body")[0];
			this.stageContainer = null;
			
			if(self.displayType == FWDEVPlayer.STICKY){
				this.stageContainer = document.createElement("div");
				this.stageContainer.style.position = "fixed";
				this.stageContainer.style.width = "100%";
				this.stageContainer.style.zIndex = "999999";
				this.stageContainer.style.height = "0px";
			
				document.documentElement.appendChild(this.stageContainer);
				this.stageContainer.style.overflow = "visible";
				
			}else if(self.displayType == FWDEVPlayer.FULL_SCREEN || self.displayType == FWDEVPlayer.BACKGROUND_VIDEO || self.displayType == FWDEVPlayer.LIGHTBOX){
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
			this.lightBox_do = null;
			
			this.lightBoxBackgroundOpacity = self.props_obj.lightBoxBackgroundOpacity || 1;
			this.lightBoxBackgroundColor_str = self.props_obj.lightBoxBackgroundColor || "transparent";
			this.lightBoxWidth = self.props_obj.maxWidth || 500;
			this.lightBoxHeight =  self.props_obj.maxHeight || 400;
			this.finalLightBoxWidth;
			this.finalLightBoxHeight;
			
			this.backgroundColor_str = self.props_obj.backgroundColor || "transparent";
			this.videoBackgroundColor_str = "#000000";
			this.flashObjectMarkup_str =  null;
			this.controllerHeight = parseInt(self.props_obj.controllerHeight) || 70;
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
			self.useWithoutVideoScreen_bl = self.props_obj.useWithoutVideoScreen; 
			self.useWithoutVideoScreen_bl = self.useWithoutVideoScreen_bl == "yes" ? true : false;

			this.isSpaceDown_bl = false;
			this.isPlaying_bl = false;
			this.firstTapPlaying_bl = false;
			this.stickOnCurrentInstanceKey_bl = false;
			this.isFullScreen_bl = false;
			this.isFlashScreenReady_bl = false;
			this.orintationChangeComplete_bl = true;
			this.disableClick_bl = false;
			
			self.mainBackgroundImagePath_str = self.props_obj.mainBackgroundImagePath;
			if(self.mainBackgroundImagePath_str && self.mainBackgroundImagePath_str.length < 3) self.mainBackgroundImagePath_str = undefined;
			
			this.isAPIReady_bl = false;
			this.isInstantiate_bl = true;
			this.isAdd_bl = false;
			this.isMobile_bl = FWDEVPUtils.isMobile;
			this.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
			
			
			self.initializeOnlyWhenVisible_bl = self.props_obj.initializeOnlyWhenVisible; 
			self.initializeOnlyWhenVisible_bl = self.initializeOnlyWhenVisible_bl == "yes" ? true : false;
			
			self.googleAnalyticsTrackingCode = self.props_obj.googleAnalyticsTrackingCode; 
			if(!window["ga"] && self.googleAnalyticsTrackingCode){
				(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

				ga('create', self.googleAnalyticsTrackingCode, 'auto');
				ga('send', 'pageview');
			}else if(window["ga"] && self.googleAnalyticsTrackingCode){
				ga('create', self.googleAnalyticsTrackingCode, 'auto');
				ga('send', 'pageview');
			}
		
			if(self.displayType == FWDEVPlayer.LIGHTBOX){
				self.setupLightBox();
			}else if(self.displayType == FWDEVPlayer.STICKY){
				self.setupPlayer();
				this.startResizeHandler();
			}else{
				self.setupMainDo();
				if(self.initializeOnlyWhenVisible_bl){
					this.startResizeHandler();
					window.addEventListener("scroll", self.onInitlalizeScrollHandler);
					setTimeout(self.onInitlalizeScrollHandler, 500);
				}else{
					self.setupPlayer();
					this.startResizeHandler();
				}
			}
		};

		//#############################################//
		/* add min on scroll */
		//#############################################//
		self.addMinOnScroll = function(){
			if(self.displayType != FWDEVPlayer.RESPONSIVE) return;
			if(self.stickyOnScroll) window.addEventListener("scroll", self.minimizeOnScrollHandler);
		}

		self.removeMinOnScroll = function(){
			if(self.stickyOnScroll) window.removeEventListener("scroll", self.minimizeOnScrollHandler);
		}

		self.minimizeOnScrollHandler = function(e){
			var scrollOffsets = FWDEVPUtils.getScrollOffsets();
			self.pageXOffset = scrollOffsets.x;
			self.pageYOffset = scrollOffsets.y;
			
			if(self.stageContainer.getBoundingClientRect().bottom < 0){
				self.setMinimized();
			}else{
				self.setNormal();
			}
		}

		self.setMinimized = function(){
			if(self.isMin || self.isFullscreen_bl) return;
			self.isMin = true;
			self.main_do.getStyle().position = 'fixed';
			self.main_do.getStyle().zIndex = 9999999999999;
			self.main_do.setAlpha(0);
			self.startPosisionOnMin();
		}

		self.startPosisionOnMin = function(){
			self.resizeHandler();
			self.positionOnMin();
		}

		self.setNormal = function(){
			if(!self.isMin) return;
			self.isMinShowed = true;
			self.isMin = false;
			self.main_do.getStyle().position = "relative";
			self.main_do.getStyle().zIndex = 0;
			FWDAnimation.killTweensOf(self.main_do);
			self.main_do.setAlpha(1);
			self.main_do.setX(0);
			self.main_do.setY(0);
			if(self.opener_do) self.opener_do.setX(-1000);
						
			self.startPosisionOnNormal();
		}

		self.startPosisionOnNormal = function(){
			if(self.opener_do) self.opener_do.showCloseButton();
			self.resizeHandler();
		}
		
		self.positionOnMin = function(animate){
			if(!self.isMin && !animate) return;
			var offset = 5;
			var dl = .2;
			if(self.isMobile_bl) offset= 0;
			var offsetTop = 0;
			if(!self.isMinShowed){
				dl = 0;
				offsetTop = Math.round(self.stageHeight) + offset;
			} 

			if(self.opener_do){
				var oX = self.ws.w - self.opener_do.w - offset;
				var oY = self.ws.h - self.stageHeight - offset + offsetTop - self.opener_do.h;
			}

			self.main_do.setX(self.ws.w - self.stageWidth - offset);
			if(self.main_do.alpha == 0 || animate){
				if(self.main_do.alpha == 0){
					self.main_do.setY(self.ws.h);
					if(self.opener_do){
						self.opener_do.setX(oX);
						self.opener_do.setY(self.ws.h);
					}
				}
				FWDAnimation.to(self.main_do, .8, {alpha:1, y:self.ws.h - self.stageHeight - offset + offsetTop, delay:dl, ease:Expo.easeInOut});
				if(self.opener_do){
					FWDAnimation.killTweensOf(self.opener_do);
					FWDAnimation.to(self.opener_do, .8, {x:oX, y:oY, delay:dl, ease:Expo.easeInOut});
				}
			}else{
				FWDAnimation.killTweensOf(self.main_do);
				self.main_do.setAlpha(1);
				self.main_do.setY(self.ws.h - self.stageHeight - offset + offsetTop);
				if(self.opener_do){
					FWDAnimation.killTweensOf(self.opener_do);
					self.opener_do.setX(oX);
					self.opener_do.setY(oY);
				}
			}			
		}
		
		//#############################################//
		/* setup  lighbox...*/
		//#############################################//
		self.setupLightBox = function(){
			
			FWDEVPLightBox.setPrototype();
			self.lightBox_do =  new FWDEVPLightBox(self, 
					self.lightBoxBackgroundColor_str, 
					self.backgroundColor_str, 
					self.lightBoxBackgroundOpacity, 
					self.lightBoxWidth, 
					self.lightBoxHeight);
					
			self.lightBox_do.addListener(FWDEVPLightBox.SHOW, self.lightBoxShowHandler);
			self.lightBox_do.addListener(FWDEVPLightBox.CLOSE, self.lightBoxCloseHandler);
			self.lightBox_do.addListener(FWDEVPLightBox.HIDE_COMPLETE, self.lightBoxHideCompleteHandler);
			self.lighboxAnimDoneId_to = setTimeout(self.setupPlayer, 1200);
		};
		
		self.lightBoxShowHandler = function(){
			//self.startResizeHandler();
		}
		
		self.lightBoxCloseHandler = function(){
			self.stop();
			self.stopResizeHandler();
		};
		
		self.lightBoxHideCompleteHandler = function(){
			self.dispatchEvent(FWDEVPlayer.HIDE_LIGHTBOX_COMPLETE);
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
			if(!self.info_do){
				self.setupMainDo();
				self.setupInfo();
				self.setupData();
			}
		}
		
		//#############################################//
		/* setup main do */
		//#############################################//
		self.setupMainDo = function(){
			if(self.main_do) return;
			self.main_do = new FWDEVPDisplayObject("div", "relative");
			if(self.hasPointerEvent_bl) self.main_do.getStyle().touchAction = "none";
			self.main_do.getStyle().webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
			self.main_do.getStyle().webkitFocusRingColor = "rgba(0, 0, 0, 0)";
			self.main_do.getStyle().width = "100%";
			self.main_do.getStyle().height = "100%";
			self.main_do.setBackfaceVisibility();
			self.main_do.setBkColor(self.backgroundColor_str);
			if(!FWDEVPUtils.isMobile || (FWDEVPUtils.isMobile && FWDEVPUtils.hasPointerEvent)) self.main_do.setSelectable(false);	

			if(self.displayType ==  FWDEVPlayer.STICKY){
				self.background_do = new FWDEVPDisplayObject("div");
				self.background_do.getStyle().width = "100%";
				if(self.mainBackgroundImagePath_str){
					self.mainBackground_do =  new FWDEVPDisplayObject("div");
					self.stageContainer.appendChild(self.mainBackground_do.screen);
				}
				self.stageContainer.appendChild(self.background_do.screen);
				self.stageContainer.appendChild(self.main_do.screen);
			}else if(self.displayType == FWDEVPlayer.FULL_SCREEN){	
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
			}else if(self.displayType == FWDEVPlayer.LIGHTBOX){
				self.main_do.getStyle().position = "absolute";
				self.stageContainer.appendChild(self.main_do.screen);
				self.main_do.setX(-10000);
				self.main_do.setY(-10000);
				self.main_do.setWidth(0);
				self.main_do.setHeight(0);
			}else{
				self.stageContainer.style.overflow = "hidden";
				self.stageContainer.appendChild(self.main_do.screen);
			}	
			if(self.isEmbedded_bl) self.main_do.getStyle().zIndex = 9999999999998;
			
		};

		//#####################################//
		/* Setup disable click */
		//#####################################//
		this.setupDisableClick = function(){
			self.disableClick_do = new FWDEVPDisplayObject("div");
			if(FWDEVPUtils.isIE){
				self.disableClick_do.setBkColor("#ff0000");
				self.disableClick_do.setAlpha(0.001);
			}
			self.main_do.addChild(self.disableClick_do);
			
		};
		
		this.disableClick = function(){
			self.disableClick_bl = true;
			clearTimeout(self.disableClickId_to);
			if(self.disableClick_do){
				self.disableClick_do.setWidth(self.stageWidth);
				self.disableClick_do.setHeight(self.stageHeight);
			}
			self.disableClickId_to =  setTimeout(function(){
				if(self.disableClick_do){
					self.disableClick_do.setWidth(0);
					self.disableClick_do.setHeight(0);
				}
				self.disableClick_bl = false;
			}, 500);
		};
		
		this.showDisable = function(){
			if(self.disableClick_do.w == self.stageWidth) return;
			self.disableClick_do.setWidth(self.stageWidth);
			self.disableClick_do.setHeight(self.stageHeight);
		};
		
		this.hideDisable = function(){
			if(!self.disableClick_do) return;
			if(self.disableClick_do.w == 0) return;
			self.disableClick_do.setWidth(0);
			self.disableClick_do.setHeight(0);
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
			window.addEventListener("resize", self.onResizeHandler);
			
			if(self.displayType == FWDEVPlayer.STICKY){
				if(FWDEVPUtils.isAndroid) window.addEventListener("orientationchange", self.orientationChange);
				window.addEventListener("scroll", self.onScrollHandler);
			}
			
			if(self.displayType == FWDEVPlayer.LIGHTBOX){
				window.addEventListener("scroll", self.onScrollHandler);
			}
			
			self.onResizeHandler(true);
			self.resizeHandlerId_to = setTimeout(function(){self.resizeHandler(true);}, 500);
		};
		
		self.onScrollHandler = function(e){
			if(self.displayType == FWDEVPlayer.STICKY) self.onResizeHandler();
			if(self.lightBox_do && !self.lightBox_do.isShowed_bl) return;
			self.scrollHandler();
			var scrollOffsets = FWDEVPUtils.getScrollOffsets();
			self.scrollOffsets = scrollOffsets;
		};
		
		self.scrollHandler = function(){
			var scrollOffsets = FWDEVPUtils.getScrollOffsets();
			self.pageXOffset = scrollOffsets.x;
			self.pageYOffset = scrollOffsets.y;
			if(self.displayType == FWDEVPlayer.LIGHTBOX){
				self.lightBox_do.setX(scrollOffsets.x);
				self.lightBox_do.setY(scrollOffsets.y);
			}else if(self.isFullScreen_bl || self.displayType == FWDEVPlayer.FULL_SCREEN){	
				self.main_do.setX(scrollOffsets.x);
				self.main_do.setY(scrollOffsets.y);
			}
		};
		
		self.stopResizeHandler = function(){
			if(window.removeEventListener){
				window.removeEventListener("resize", self.onResizeHandler);
				window.removeEventListener("scroll", self.onScrollHandler);
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
			self.orintationChangeComplete_bl = false;	
			clearTimeout(self.resizeHandlerId_to);
			clearTimeout(self.resizeHandler2Id_to);
			clearTimeout(self.orientationChangeId_to);
		
			self.orientationChangeId_to = setTimeout(function(){
				self.orintationChangeComplete_bl = true; 
				self.resizeHandler(true);
				}, 1000);
			
			self.stageContainer.style.left = "-5000px";
			if(self.preloader_do) self.preloader_do.setX(-5000);	
		};
		

		self.resizeHandler = function(animate){
		//	if(!self.orintationChangeComplete_bl) return;
			
			var viewportSize = FWDEVPUtils.getViewportSize();
			var scrollOffsets = FWDEVPUtils.getScrollOffsets();
			self.ws = viewportSize;
			
			if(self.displayType == FWDEVPlayer.STICKY && !self.isFullScreen_bl){
				self.main_do.getStyle().width = "100%";
				if(self.main_do.getWidth() > self.maxWidth){
					self.main_do.setWidth(self.maxWidth);
				}
				
				self.stageWidth = self.main_do.getWidth();
				if(self.autoScale_bl){
					self.stageHeight = parseInt(self.maxHeight * (self.stageWidth/self.maxWidth));
				}else{
					self.stageHeight = self.maxHeight;
				}
			
			}else if(self.displayType == FWDEVPlayer.LIGHTBOX && !self.isFullScreen_bl){
				if(!self.lightBox_do.isShowed_bl ||  !self.main_do) return;
				if(self.lightBoxWidth > viewportSize.w){
					self.finalLightBoxWidth = viewportSize.w;
					self.finalLightBoxHeight = parseInt(self.lightBoxHeight * (viewportSize.w/self.lightBoxWidth));
				}else{
					self.finalLightBoxWidth = self.lightBoxWidth;
					self.finalLightBoxHeight = self.lightBoxHeight;
				}
				self.lightBox_do.setWidth(viewportSize.w);
				self.lightBox_do.setHeight(viewportSize.h);
				self.lightBox_do.setX(scrollOffsets.x);
				self.lightBox_do.setY(scrollOffsets.y);
				self.lightBox_do.mainLightBox_do.setX(parseInt((viewportSize.w - self.finalLightBoxWidth)/2));
				self.lightBox_do.mainLightBox_do.setY(parseInt((viewportSize.h - self.finalLightBoxHeight)/2));
				if(self.lightBox_do.closeButton_do && self.lightBox_do.isShowed_bl){ 
					self.lightBox_do.closeButton_do.setX(viewportSize.w - self.lightBox_do.closeButton_do.w - 4);
					self.lightBox_do.closeButton_do.setY(4);
				}
				self.main_do.setX(0);
				self.main_do.setY(0);
				self.lightBox_do.mainLightBox_do.setWidth(self.finalLightBoxWidth);
				self.lightBox_do.mainLightBox_do.setHeight(self.finalLightBoxHeight);	
				self.stageWidth = self.finalLightBoxWidth;
				self.stageHeight = self.finalLightBoxHeight;
			}else if(self.isFullScreen_bl || self.displayType == FWDEVPlayer.FULL_SCREEN || self.displayType == FWDEVPlayer.BACKGROUND_VIDEO){	
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
				//if(self.stageHeight < 320) self.stageHeight = 320;g
				self.stageContainer.style.height = self.stageHeight + "px";
			}
			if(self.useWithoutVideoScreen_bl){
				self.stageHeight = self.controllerHeight;
			}

			if(self.isMin && !self.isFullScreen_bl){
				self.stageWidth = Math.min(self.stickyOnScrollWidth - 10, self.ws.w - 10)
				self.stageHeight = parseInt(self.stickyOnScrollHeight * (self.stageWidth/self.stickyOnScrollWidth));
				self.stageHeight = self.stageHeight;
			}

			
			self.tempVidStageWidth = self.stageWidth;
			self.tempVidStageHeight = self.stageHeight;
			self.main_do.setWidth(self.stageWidth);
			self.main_do.setHeight(self.stageHeight);
			
			if(self.fillEntireVideoScreen_bl  && self.videoType_str == FWDEVPlayer.VIDEO){
			
				if(self.videoScreen_do && self.videoScreen_do.video_el && self.videoScreen_do.video_el.videoWidth != 0){
					
					var originalW = self.videoScreen_do.video_el.videoWidth;
					var originalH = self.videoScreen_do.video_el.videoHeight
					var scaleX = self.tempVidStageWidth/originalW;
					var scaleY = self.tempVidStageHeight/originalH;
					
					var totalScale = 0;
					if(scaleX >= scaleY){
						totalScale = scaleX;
					}else if(scaleX <= scaleY){
						totalScale = scaleY;
					}
					
					var finalW = parseInt(originalW * totalScale);
					var finalH = parseInt(originalH * totalScale);
					var finalX = parseInt((self.stageWidth - finalW)/2);
					var finalY = parseInt((self.stageHeight - finalH)/2);
					
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
			
			if(self.vimeo_do && self.videoType_str == FWDEVPlayer.VIMEO) self.vimeo_do.resizeAndPosition();
			
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
			
			if(self.mainBackground_do){
				self.mainBackground_do.setWidth(self.ws.w);
				self.mainBackground_do.setHeight(self.stageHeight);
			}
			
			if(self.displayType == FWDEVPlayer.STICKY) self.setStageContainerFinalHeightAndPosition(animate);

			self.positionOnMin();
			
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
		
		this.setStageContainerFinalHeightAndPosition = function(animate){
			
			if(self.isMin) return;
			self.allowToResizeAndPosition_bl = true;
			clearTimeout(self.showPlaylistWithDelayId_to);
			
			
			if(self.horizontalPosition_str == FWDEVPlayer.LEFT){
				self.main_do.setX(self.offsetX);
				if(self.opener_do){
					if(self.data.openerAlignment_str == "right"){
						self.opener_do.setX(Math.round(self.stageWidth - self.opener_do.w + self.offsetX));
					}else{
						self.opener_do.setX(self.offsetX);
					}
				}
			}else if(self.horizontalPosition_str == FWDEVPlayer.CENTER){
				self.main_do.setX(Math.round((self.ws.w - self.stageWidth)/2));
				if(self.opener_do){
					if(self.data.openerAlignment_str == "right"){
						self.opener_do.setX(parseInt((self.ws.w - self.stageWidth)/2) + self.stageWidth - self.opener_do.w);
					}else{
						self.opener_do.setX(self.main_do.x);
					}
				}
			}else if(self.horizontalPosition_str == FWDEVPlayer.RIGHT){
				self.main_do.setX(Math.round(self.ws.w - self.stageWidth - self.offsetX));
				if(self.opener_do){
					if(self.data.openerAlignment_str == "right"){
						self.opener_do.setX(Math.round(self.ws.w - self.opener_do.w - self.offsetX));
					}else{
						self.opener_do.setX(Math.round(self.ws.w - self.stageWidth - self.offsetX));
					}
				}
			}
			
			if(animate){		
				if(self.opener_do) FWDAnimation.killTweensOf(self.opener_do);
				if(self.position_str ==  FWDEVPlayer.POSITION_TOP){
					if(self.isShowed_bl && !self.isShowedFirstTime_bl){
						FWDAnimation.to(self.stageContainer, .8, {css:{top:self.offsetY}, ease:Expo.easeInOut});
					}else{
						FWDAnimation.to(self.stageContainer, .8, {css:{top:-self.stageHeight}, ease:Expo.easeInOut});
					}
					
					if(self.isShowedFirstTime_bl){
						if(self.opener_do) FWDAnimation.to(self.opener_do, .8, {y:self.stageHeight - self.opener_do.h, ease:Expo.easeInOut});
					}else{
						if(self.opener_do) FWDAnimation.to(self.opener_do, .8, {y:self.stageHeight, ease:Expo.easeInOut});
					}
				}else{
					if(self.isShowed_bl && !self.isShowedFirstTime_bl){
						FWDAnimation.to(self.stageContainer, .8, {css:{top:self.ws.h - self.stageHeight - self.offsetY}, ease:Expo.easeInOut});
					}else{
						FWDAnimation.to(self.stageContainer, .8, {css:{top:self.ws.h}, ease:Expo.easeInOut, onComplete:self.moveWheyLeft});
					}
					
					if(self.isShowedFirstTime_bl){
						if(self.opener_do) FWDAnimation.to(self.opener_do, .8, {y:0, ease:Expo.easeInOut});
					}else{
						if(self.opener_do) FWDAnimation.to(self.opener_do, .8, {y:-self.opener_do.h, ease:Expo.easeInOut});
					}
				}
			}else{
				if(self.position_str ==  FWDEVPlayer.POSITION_TOP){
					if(self.isShowed_bl && !self.isShowedFirstTime_bl){
						self.stageContainer.style.top = self.offsetY + "px";
					}else{
						self.stageContainer.style.top = -self.stageHeight + "px";
					}
					if(self.isShowedFirstTime_bl){
						if(self.opener_do) self.opener_do.setY(self.stageHeight - self.opener_do.h);
					}else{
						if(self.opener_do) self.opener_do.setY(self.stageHeight);
					}
				}else{
					if(self.isShowed_bl && !self.isShowedFirstTime_bl){
						self.stageContainer.style.top = (self.ws.h - self.stageHeight - self.offsetY) + "px";
					}else{
						self.stageContainer.style.top = self.ws.h + "px";
					}
					
					if(self.isShowedFirstTime_bl){
						if(self.opener_do) self.opener_do.setY(0);
					}else{
						if(self.opener_do) self.opener_do.setY(-self.opener_do.h);
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
				if(self.data.adsPageToOpenURL_str && self.data.adsPageToOpenURL_str != "none" && !self.skipOnDb_bl){
					if(self.ClickTracking) self.executeVastEvent(self.ClickTracking);
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
			self.setupVisualization();
		};
		
		this.onFirstDown = function(e){
			if(e.button == 2) return;
			if(self.isFullscreen_bl && e.preventDefault) e.preventDefault();
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);
			self.firstTapX = viewportMouseCoordinates.screenX - self.main_do.getGlobalX();
			self.firstTapY = viewportMouseCoordinates.screenY - self.main_do.getGlobalY();
			
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
			dx = Math.abs((viewportMouseCoordinates.screenX - self.main_do.getGlobalX()) - self.firstTapX);
			dy = Math.abs(viewportMouseCoordinates.screenY -  self.main_do.getGlobalY() - self.firstTapY); 
		
			if((dx > 10 || dy > 10)) return;
				
			if(self.firstTapX < self.tempVidStageWidth * 0.33){
				if(!self.isPlaying_bl){
					self.skipOnDb_bl = true;
					self.rewind(10);
					self.addVisualization('left');
					setTimeout(function(){
						if(!self.isPlaying_bl) self.play();
					}, 200);
					setTimeout(function(){
						self.skipOnDb_bl = false;
					}, 500);
				} 
			}else if(self.firstTapX > self.tempVidStageWidth * 0.67){
					if(!self.isPlaying_bl){
						self.skipOnDb_bl = true;
						self.rewind(-10);
						self.addVisualization('right');
						setTimeout(function(){
							if(!self.isPlaying_bl) self.play();
						}, 200);
						setTimeout(function(){
							self.skipOnDb_bl = false;
						}, 500);
				} 
			}else{
				self.switchFullScreenOnDoubleClick();
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
		/* Setup double click visualization */
		//############################################//
		self.lasPosition;
		this.setupVisualization = function(){
			self.mainVz_do = new FWDEVPDisplayObject('div');
			self.mainVz_do.getStyle().pointerEvents = 'none';
			self.mainVz_do.getStyle().backgroundColor = 'rgba(0,0,0,0.01)';
			self.mainVzBackgrond_do = new FWDEVPDisplayObject('div');
			self.mainVzBackgrond_do.getStyle().width = '100%';
			self.mainVzBackgrond_do.getStyle().height = '100%';
			self.mainVzBackgrond_do.getStyle().backgroundColor = 'rgba(255,255,255, .15)';
			self.mainVz_do.getStyle().borderRadius = '100%';
			self.mainVz_do.addChild(self.mainVzBackgrond_do);

			self.circle_do = new FWDEVPTransformDisplayObject('div');
			self.circle_do.getStyle().backgroundColor = 'rgba(255,255,255, .15)';
			self.circle_do.getStyle().borderRadius = '100%';
			self.mainVz_do.addChild(self.circle_do);


			var vzImg1 = new Image();
			vzImg1.src = self.mainFolderPath_str + this.skinPath_str + 'vis.png';
			self.vzImg1_do = new FWDEVPTransformDisplayObject('img');
			self.vzImg1_do.setScreen(vzImg1);
			self.vzImg1_do.setWidth(17);
			self.vzImg1_do.setHeight(23);
			self.mainVz_do.addChild(self.vzImg1_do);

			var vzImg2 = new Image();
			vzImg2.src = self.mainFolderPath_str + this.skinPath_str + 'vis.png';
			self.vzImg2_do = new FWDEVPTransformDisplayObject('img');
			self.vzImg2_do.setScreen(vzImg2);
			self.vzImg2_do.setWidth(17);
			self.vzImg2_do.setHeight(23);
			self.mainVz_do.addChild(self.vzImg2_do);

			var vzImg3 = new Image();
			vzImg3.src = self.mainFolderPath_str + this.skinPath_str + 'vis.png';
			self.vzImg3_do = new FWDEVPTransformDisplayObject('img');
			self.vzImg3_do.setScreen(vzImg3);
			self.vzImg3_do.setWidth(17);
			self.vzImg3_do.setHeight(23);
			self.mainVz_do.addChild(self.vzImg3_do);
		}

		this.addVisualization = function(pos){
			clearTimeout(self.vizFinisedId_to);
			clearTimeout(self.vizFinished2Id_to);
			var w = Math.round(self.tempVidStageWidth/2);
			var h = Math.round(self.tempVidStageHeight * 1.5);

			FWDAnimation.killTweensOf(self.mainVzBackgrond_do);
			if(self.lasPosition != pos) self.mainVzBackgrond_do.setAlpha(0);
			FWDAnimation.to(self.mainVzBackgrond_do, .4, {alpha:1});

			self.mainVz_do.setVisible(true);
			self.mainVz_do.setWidth(w);
			self.mainVz_do.setHeight(h);
			self.mainVz_do.setY((self.tempVidStageHeight - h)/2);
			var offsetY = Math.abs(self.mainVz_do.y);
			if(self.controller_do && self.controller_do.isShowed_bl) offsetY -= self.controller_do.stageHeight/2;
			if(!self.main_do.contains(self.mainVz_do)){
				if(self.controller_do){
					self.main_do.addChildAt(self.mainVz_do, self.main_do.getChildIndex(self.controller_do) - 1);
				}else{
					self.main_do.addChild(self.mainVz_do);
				}
			} 
			if(pos == 'right'){
				self.mainVz_do.getStyle().borderRadius = '100% 0% 0% 100%';
				self.mainVz_do.setX(w);
				self.vzImg1_do.setRotation(0);
				self.vzImg2_do.setRotation(0);
				self.vzImg3_do.setRotation(0);
			}else{
				self.mainVz_do.getStyle().borderRadius = '0% 100% 100% 0%';
				self.mainVz_do.setX(0);
				self.vzImg1_do.setRotation(180);
				self.vzImg2_do.setRotation(180);
				self.vzImg3_do.setRotation(180);
			}

			self.vzImg1_do.setX(Math.round(w - (self.vzImg1_do.w * 3))/2);
			self.vzImg1_do.setY(Math.round(offsetY + (self.tempVidStageHeight - self.vzImg1_do.h)/2));
			self.vzImg2_do.setX(self.vzImg1_do.x + self.vzImg1_do.w);
			self.vzImg2_do.setY(self.vzImg1_do.y);
			self.vzImg3_do.setX(self.vzImg2_do.x + self.vzImg2_do.w);
			self.vzImg3_do.setY(self.vzImg2_do.y);

			
			FWDAnimation.killTweensOf(self.vzImg1_do);
			FWDAnimation.killTweensOf(self.vzImg2_do);
			FWDAnimation.killTweensOf(self.vzImg3_do);
			self.vzImg1_do.setAlpha(0);
			self.vzImg2_do.setAlpha(0);
			self.vzImg3_do.setAlpha(0);
			if(pos == 'right'){
				FWDAnimation.to(self.vzImg1_do, .4, {alpha:1});
				FWDAnimation.to(self.vzImg1_do, .4, {alpha:0, delay:.3});
				FWDAnimation.to(self.vzImg2_do, .4, {alpha:1, delay:.3});
				FWDAnimation.to(self.vzImg2_do, .4, {alpha:0, delay:.6});
				FWDAnimation.to(self.vzImg3_do, .4, {alpha:1, delay:.6});
				FWDAnimation.to(self.vzImg3_do, .4, {alpha:0, delay:.9});
			}else{
				FWDAnimation.to(self.vzImg3_do, .4, {alpha:1});
				FWDAnimation.to(self.vzImg3_do, .4, {alpha:0, delay:.3});
				FWDAnimation.to(self.vzImg2_do, .4, {alpha:1, delay:.3});
				FWDAnimation.to(self.vzImg2_do, .4, {alpha:0, delay:.6});
				FWDAnimation.to(self.vzImg1_do, .4, {alpha:1, delay:.6});
				FWDAnimation.to(self.vzImg1_do, .4, {alpha:0, delay:.9});
			}

			FWDAnimation.killTweensOf(self.circle_do);
			self.circle_do.setAlpha(1);
			self.circle_do.setScale2(1);
			self.circle_do.setWidth(w);
			self.circle_do.setHeight(w);
			self.circle_do.setScale2(0);
			self.circle_do.setX(self.firstTapX - self.mainVz_do.x - self.circle_do.w/2);
			self.circle_do.setY(self.firstTapY + offsetY - self.circle_do.w/2);
			//FWDAnimation.to(self.circle_do, 1, {alpha:0});
			FWDAnimation.to(self.circle_do, .8, {scale:2, ease:Expo.easeInOut});

			self.vizFinisedId_to = setTimeout(function(){
				FWDAnimation.to(self.mainVzBackgrond_do, .4, {alpha:0});
				FWDAnimation.to(self.circle_do, .4, {alpha:0});
				self.vizFinished2Id_to = setTimeout(function(){
					self.mainVz_do.setVisible(false);
				}, 400)
			}, 800);

			self.lasPosition = pos;
		}

		this.stopVisualization =  function(){
			if(!self.mainVz_do) return;
			clearTimeout(self.vizFinisedId_to);
			clearTimeout(self.vizFinished2Id_to);
			self.mainVz_do.setVisible(false);
		}
		
		//############################################//
		/* Setup Vimeo API */
		//############################################//
		this.setupVimeoAPI = function(){
			if(self.vimeo_do) return;
			if(typeof Vimeo != "undefined" && Vimeo.Player){
				self.setupVimeoPlayer();
				return;
			}else{
				if(FWDEVPlayer.isVimeoAPILoadedOnce_bl){
					self.keepCheckingVimeoAPI_int =  setInterval(function(){
						if(typeof Vimeo != "undefined" && Vimeo && Vimeo.Player){
							if(self.videoSourcePath_str.indexOf("vimeo.") == -1) clearInterval(self.keepCheckingVimeoAPI_int);
							clearInterval(self.keepCheckingVimeoAPI_int);
							self.setupVimeoPlayer();
						}
					}, 50);
					return;
				}
				
				var tag = document.createElement("script");
				tag.src = "https://player.vimeo.com/api/player.js";
				var firstScriptTag = document.getElementsByTagName("script")[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			
				tag.onload = function(){
					self.keepCheckingVimeoAPI_int = setInterval(function(){
						if(typeof Vimeo != "undefined" && Vimeo && Vimeo.Player){
							clearInterval(self.keepCheckingVimeoAPI_int);
							self.setupVimeoPlayer();
						}
					}, 50);
				}
										
				tag.onerror = function(){
					setTimeout(function(){
						self.main_do.addChild(self.info_do);
						//self.info_do.allowToRemove_bl = false;
						self.info_do.showText("Error loading Vimeo API");
						self.preloader_do.hide(false);
						self.preloader_do.stopPreloader();
					}, 500);
					return;
				}
				if(self.largePlayButton_do) self.largePlayButton_do.hide();
				
				FWDEVPlayer.isVimeoAPILoadedOnce_bl = true;
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
			self.vimeo_do.addListener(FWDEVPVimeoScreen.SAFE_TO_SCRUBB, self.videoScreenSafeToScrubbHandler);
			self.vimeo_do.addListener(FWDEVPVimeoScreen.PLAY, self.videoScreenPlayHandler);
			self.vimeo_do.addListener(FWDEVPVimeoScreen.PAUSE, self.videoScreenPauseHandler);
			self.vimeo_do.addListener(FWDEVPVimeoScreen.UPDATE, self.videoScreenUpdateHandler);
			self.vimeo_do.addListener(FWDEVPVimeoScreen.UPDATE_TIME, self.videoScreenUpdateTimeHandler);
			self.vimeo_do.addListener(FWDEVPVimeoScreen.LOAD_PROGRESS, self.videoScreenLoadProgressHandler);
			self.vimeo_do.addListener(FWDEVPVimeoScreen.PLAY_COMPLETE, self.videoScreenPlayCompleteHandler);
			self.vimeo_do.addListener(FWDEVPVimeoScreen.UPDATE_SUBTITLE, self.videoScreenUpdateSubtitleHandler);
			
		};
		
		this.vimeoReadyHandler = function(e){
			self.isVimeoReady_bl = true;
			clearInterval(self.hidePreloaderId_to);
			if(self.vimeo_do.iFrame_do) self.vimeo_do.iFrame_do.screen.style.left = "0px";
			self.setSource(self.videoSourcePath_str);
			if(self.preloader_do){
				self.preloader_do.hide(false);
				self.preloader_do.stopPreloader();
			}
		};		
		
		//############################################//
		/* Setup youtube player */
		//############################################//
		this.setupYoutubeAPI = function(){
			if(self.ytb_do || self.isYoutubeAPiCreated_bl) return;
			 self.isYoutubeAPiCreated_bl = true;
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
						self.preloader_do.hide(false);
						self.preloader_do.stopPreloader();
					}, 500);
					return;
				}
				
				FWDEVPlayer.isYoutubeAPILoadedOnce_bl = true;
			}
		};
		
		this.setupYoutubePlayer = function(){
			if(self.ytb_do) return;
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
			self.ytb_do.addListener(FWDEVPVideoScreen.UPDATE_SUBTITLE, self.videoScreenUpdateSubtitleHandler);
	
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
				if(self.videoSourcePath_str.indexOf(".") == -1) self.setSource(self.videoSourcePath_str, true, self.data.videosSource_ar[self.data.startAtVideoSource]["videoType"]);
				
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
			
			
			self.setSource(self.videoSourcePath_str, true, self.data.videosSource_ar[self.data.startAtVideoSource]["videoType"]);
			
			if(self.preloader_do){
				self.preloader_do.hide(false);
				self.preloader_do.stopPreloader();
			}
			
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
			FWDEVPContextMenu.setPrototype();
			self.customContextMenu_do = new FWDEVPContextMenu(self, self.data);
		};
		
		//###########################################//
		/* setup opener */
		//###########################################//
		this.setupOpener = function(){
			
			FWDEVPOpener.setPrototype();
			self.opener_do = new FWDEVPOpener(self, self.data, self.position_str, self.isShowed_bl);
			self.opener_do.getStyle().zIndex = "99999999994";
			
			self.opener_do.setX(-1000);
			if(self.isShowed_bl){
				self.opener_do.showCloseButton();
			}else{
				self.opener_do.showOpenButton();
			}
		
			self.opener_do.addListener(FWDEVPOpener.SHOW, self.openerShowHandler);
			self.opener_do.addListener(FWDEVPOpener.HIDE, self.openerHideHandler);
			self.opener_do.addListener(FWDEVPOpener.PLAY, self.controllerOnPlayHandler);
			self.opener_do.addListener(FWDEVPOpener.PAUSE, self.controllerOnPauseHandler);
			self.stageContainer.appendChild(self.opener_do.screen);
			if(self.stickyOnScroll){
				 self.opener_do.getStyle().position = 'fixed';
				 document.documentElement.appendChild(self.opener_do.screen);
			}
		};
		
		this.openerShowHandler = function(){
			self.showPlayer();
		};
		
		this.openerHideHandler = function(){
			self.hidePlayer();
		};

		//#############################################//
		/* setup RSM */
		//#############################################//
		self.setupRSM = function(){
			if(self.data.useResumeOnPlay_bl){
				window.addEventListener("beforeunload", function (e) {
					var test = Math.random() * 1000;
					if(self.isPlaying_bl){
						document.cookie = "fwdevp_video_path=" + self.videoSourcePath_str + "; expires=Thu, 18 Dec 2040 00:00:01 GMT; path=/";
						var curTime = self.getCurrentTime();
						if(curTime.length == 5) curTime = "00:" + curTime;
						document.cookie = "fwdevp_time=" + curTime + "; expires=Thu, 18 Dec 2040 00:00:01 GMT; path=/";	
					}
				});
			}
		};
		
		//#############################################//
		/* setup data */
		//#############################################//
		self.setupData = function(){
			
			FWDEVPData.setPrototype();
			self.data = new FWDEVPData(self.props_obj, self.rootElement_el, self);
			
			if(self.mainBackground_do) self.mainBackground_do.getStyle().background = "url('" + self.mainBackgroundImagePath_str + "')";
			
			self.data.addListener(FWDEVPData.VAST_LOADED, self.vastLoaded);
			self.data.addListener(FWDEVPData.PRELOADER_LOAD_DONE, self.onPreloaderLoadDone);
			self.data.addListener(FWDEVPData.LOAD_ERROR, self.dataLoadError);
			self.data.addListener(FWDEVPData.SKIN_PROGRESS, self.dataSkinProgressHandler);
			self.data.addListener(FWDEVPData.SKIN_LOAD_COMPLETE, self.dataSkinLoadComplete);
			
			
		};
		
		self.vastLoaded = function(){
			self.updateAds(0);
		}
		
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
			if(self.preloader_do){
				self.preloader_do.hide(false);
				self.preloader_do.stopPreloader();
			}
			self.resizeHandler();
		};
		
		
		self.dataSkinProgressHandler = function(e){};
		
		self.dataSkinLoadComplete = function(){
			window.removeEventListener("scroll", self.onScrollHandler);
			self.volume = self.data.volume;
			if(self.displayType == FWDEVPlayer.FULL_SCREEN  && !FWDEVPUtils.hasFullScreen){
				self.data.showFullScreenButton_bl = false;
			}
			
			clearInterval(self.hidePreloaderId_to);
			self.hidePreloaderId_to = setTimeout(function(){
				if(self.preloader_do){
					self.preloader_do.hide(false);
					self.preloader_do.stopPreloader();
				}
			}, 500);
			
			if(self.useWithoutVideoScreen_bl){
				self.data.showFullScreenButton_bl = false;
				self.data.showDownloadVideoButton_bl = false;
				self.data.showSubtitleButton_bl = false;
				self.data.showEmbedButton_bl = false;
				self.data.showYoutubeQualityButton_bl = false;
				self.data.showShareButton_bl = false;
				self.data.showPlaybackRateButton_bl = false;
				self.data.controllerHideDelay = 10000000;
			}

			
			self.setupNormalVideoPlayer();
			
			self.animate_bl = self.data.animate_bl;

			if((self.data.showOpener_bl && self.displayType == FWDEVPlayer.STICKY)
				|| (self.data.stickyOnScrollShowOpener_bl && self.stickyOnScroll)){
				self.setupOpener();
			} 
			
			
			if(self.data.useVectorIcons_bl){
				self.checkFinalButtonSizezId_int = setInterval(function(){
					if(self.controller_do){
						if(self.controller_do.playPauseButton_do.w != 0){
							setTimeout(function(){
								self.isShowedFirstTime_bl = false;
								self.resizeHandler(self.animate_bl);
								clearInterval(self.checkFinalButtonSizezId_int);
							}, 100);
						}
					}else{
						if(self.controller_do) clearInterval(self.checkFinalButtonSizezId_int);
					}
				}, 50);
			}else{
				setTimeout(function(){
					self.isShowedFirstTime_bl = false;
					self.resizeHandler(self.animate_bl);
				}, 50);
			}
			
			
		
		};
		
		this.setupNormalVideoPlayer = function(){
			if(self.normalVideoPlayersCreated_bl) return;
			self.normalVideoPlayersCreated_bl = true;
			//if(FWDEVPlayer.hasHTML5Video){
				self.isAPIReady_bl = true;
				self.setupVideoScreen();
				self.setupAudioScreen();
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
				self.addMinOnScroll();
				self.setupDisableClick();
				self.setupRSM();
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
		
			self.preloader_do = new FWDEVPPreloader(self, 'center', 10, self.preloaderBackgroundColor, self.preloaderFillColor, 3, 0.8);
			self.preloader_do.show(false);
			self.preloader_do.startPreloader();
			
			if(self.showPreloader_bl){
				if(self.displayType == FWDEVPlayer.STICKY){
					document.documentElement.appendChild(self.preloader_do.screen);
				}else{
					self.main_do.addChild(self.preloader_do);
				}
				
			}
		};
		
		this.positionPreloader = function(){

			if(self.displayType == FWDEVPlayer.STICKY){
				
				if(!self.main_do.contains(self.preloader_do)){
					
					self.preloader_do.setX(Math.round((self.ws.w - self.preloader_do.w)/2));
					if(self.position_str == FWDEVPlayer.POSITION_BOTTOM){
						self.preloader_do.setY(Math.round((self.ws.h - self.preloader_do.h) - 10) + FWDEVPUtils.getScrollOffsets().y);
					}else{
						self.preloader_do.setY(10);
					}
				}else{
					self.preloader_do.setX(Math.round((self.stageWidth - self.preloader_do.w)/2));
					self.preloader_do.setY(Math.round((self.stageHeight - self.preloader_do.h)/2));
				}
			}else{
				self.preloader_do.setX(parseInt((self.stageWidth - self.preloader_do.w)/2));
				self.preloader_do.setY(parseInt((self.stageHeight - self.preloader_do.h)/2));
			}
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
			if(self.data.useVectorIcons_bl){				
				FWDEVPSimpleButton.setPrototype();
				self.largePlayButton_do = new FWDEVPSimpleButton(
						undefined, undefined, undefined, true, undefined, undefined, undefined,
						"<div class='table-fwdevp-button'><span class='table-cell-fwdevp-button icon-play'></span></div>",
						undefined,
						"EVPLargePlayButtonNormalState",
						"EVPLargePlayButtonSelectedState"
				);
			}else{
				FWDEVPSimpleButton.setPrototype();
				self.largePlayButton_do = new FWDEVPSimpleButton(
														 self.data.largePlayN_img, 
														 self.data.largePlayS_str, 
														 undefined, 
														 true,
														 self.data.useHEXColorsForSkin_bl,
														 self.data.normalButtonsColor_str,
														 self.data.selectedButtonsColor_str);
			}
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
			
			self.controller_do.addListener(FWDEVPController.REWIND, self.rewindHandler);

			self.controller_do.addListener(FWDEVPData.LOAD_ERROR, self.thumbnailsPreviewLoadError);
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
		
		this.rewindHandler = function(){
			self.rewind(10);
		}
		
		this.rewind = function(offset){
			var curTime = self.getCurrentTime();
			if(curTime.length == 5) curTime = "00:" + curTime;
			if(curTime.length == 7) curTime = "0" + curTime;
			curTime = FWDEVPUtils.getSecondsFromString(curTime);
			curTime -= offset;
			curTime = FWDEVPUtils.formatTime(curTime);
			if(curTime.length == 5) curTime = "00:" + curTime;
			if(curTime.length == 7) curTime = "0" + curTime;
			self.scrubbAtTime(curTime);
		}
		
		self.thumbnailsPreviewLoadError = function(e){
			console.log(e);
		}
		
		this.changePlaybackRateHandler = function(e){
			self.setPlaybackRate(e.rate);
			self.dispatchEvent(FWDEVPlayer.PLAYBACK_RATE_CHANGE, {rate:e.rate});
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
				self.data.startAtVideoSource = self.data.videosSource_ar.length -1 - e.id;
				self.setSource(self.data.videosSource_ar[self.data.startAtVideoSource]["source"],false, self.data.videosSource_ar[self.data.startAtVideoSource]["videoType"]);
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
			
			/*if(location.protocol.indexOf("file:") != -1){
				self.main_do.addChild(self.info_do);
				self.info_do.showText("Embedding video files local is not allowed or possible! To function properly please test online.");
				return;
			}*/
			
			
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
			self.audioScreen_do.addListener(FWDEVPAudioScreen.UPDATE_SUBTITLE, self.videoScreenUpdateSubtitleHandler);
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
			self.videoScreen_do.addListener(FWDEVPVideoScreen.START, self.videoScreenStartHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.PLAY, self.videoScreenPlayHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.PAUSE, self.videoScreenPauseHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.UPDATE, self.videoScreenUpdateHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.UPDATE_TIME, self.videoScreenUpdateTimeHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.UPDATE_SUBTITLE, self.videoScreenUpdateSubtitleHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.LOAD_PROGRESS, self.videoScreenLoadProgressHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.START_TO_BUFFER, self.videoScreenStartToBuferHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.STOP_TO_BUFFER, self.videoScreenStopToBuferHandler);
			self.videoScreen_do.addListener(FWDEVPVideoScreen.PLAY_COMPLETE, self.videoScreenPlayCompleteHandler);
			self.main_do.addChild(self.videoScreen_do);
		};
		
		this.videoScreenStartHandler = function(){
			self.callVastEvent("start");
			self.executeVastEvent(self.Impression);
		}
		
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
			self.preloader_do.stopPreloader();
			self.showCursor();
			
			self.dispatchEvent(FWDEVPlayer.ERROR, {error:error});
		};
		
		this.videoScreenSafeToScrubbHandler = function(){
			
			if(self.hasHlsPlayedOnce_bl && self.videoType_str == FWDEVPlayer.HLS_JS) return;

			
			if(self.controller_do){
				if(self.isAdd_bl){
					self.controller_do.disableMainScrubber();
					if(self.data.showSkipButton_bl){
						if(self.data.timeToHoldAds != 0) self.adsStart_do.show(true);
						if(self.data.adsThumbnailPath_str && self.data.adsThumbnailPath_str != "none") self.adsStart_do.loadThumbnail(self.data.adsThumbnailPath_str);
					}
					self.positionAds();
				}else{
					self.controller_do.enableMainScrubber();
				}
				
				if(self.controller_do){
					if(!self.isQualityChanging_bl) self.controller_do.disableSubtitleButton();
					if(!self.isAdd_bl) self.controller_do.enableAtbButton();
					self.controller_do.show(true);
				} 
				
				if(!self.isAdd_bl){
					if(self.customContextMenu_do) self.customContextMenu_do.enable();
					self.loadSubtitle(self.data.subtitlePath_str);
					if(self.controller_do.thumbnailsPreview_do) self.controller_do.thumbnailsPreview_do.load(self.data.thumbnailsPreview);
				}
				
				if(!self.isAdd_bl && self.controller_do.ytbQualityButton_do){
					self.controller_do.ytbQualityButton_do.enable();
				}
				
				if(!self.isAdd_bl && self.controller_do.playbackRateButton_do){
					self.controller_do.enablePlaybackRateButton();
				}
				if(!self.isAdd_bl && self.controller_do){
					 if(self.controller_do.downloadButton_do) self.controller_do.downloadButton_do.enable();
					 if(self.controller_do.rewindButton_do) self.controller_do.rewindButton_do.enable();
				}
				self.hider.start();
			}
		
			if(self.videoType_str != FWDEVPlayer.VIMEO) self.showClickScreen();
			if(self.fillEntireVideoScreen_bl){
				self.fillScreenId_int = setInterval(function(){
					 if(self.videoScreen_do.video_el.videoWidth != 0){
					 	 self.resizeHandler();
					 	 clearInterval(self.fillScreenId_int);
					 }
				}, 5);
			}
			
			setTimeout(function(){
				if(self.totalDuration && self.controller_do) self.controller_do.positionAdsLines(self.totalDuration);
			}, 500);

			var args = FWDEVPUtils.getHashUrlArgs(window.location.hash);
			
			if(self.getStartTimeStamp("t") != "00:00:00"){
				if(args['evpi']){
					if(args['evpi'] == self.instanceName_str) self.scrubbAtTime(self.getStartTimeStamp("t"));
				}else{
					self.scrubbAtTime(self.getStartTimeStamp("t"));
				}
			}
			 

			if(document.cookie){
				if(FWDEVPUtils.getCookie("fwdevp_video_path") && FWDEVPUtils.getCookie("fwdevp_time") 
				   && FWDEVPUtils.getCookie("fwdevp_video_path") == self.videoSourcePath_str && !self.isAdd_bl){
					var curTime = FWDEVPUtils.getCookie("fwdevp_time");
					if(!self.rmsPlayed_bl){
						self.scrubbAtTime(FWDEVPUtils.getCookie("fwdevp_time"));
						//document.cookie = "fwdevp_video_path=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/";
					}
				}
			}
			
			self.dispatchEvent(FWDEVPlayer.SAFE_TO_SCRUB);
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
			
			self.callVastEvent("resume");
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
			
			if(self.logo_do && self.videoType_str != FWDEVPlayer.VIMEO && !self.useWithoutVideoScreen_bl) self.logo_do.show(true);
			  
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
			
			if(self.opener_do) self.opener_do.showPauseButton();
			
			self.hasStartedToPlay_bl = true;
			self.dispatchEvent(FWDEVPlayer.PLAY);
		};
		
		this.videoScreenPauseHandler = function(){
		
			if(self.videoType_str == FWDEVPlayer.YOUTUBE
			   && self.ytb_do && self.ytb_do.isStopped_bl) return;
			
			self.isPlaying_bl = false;
			self.callVastEvent("pause");
			
			if(self.controller_do) self.controller_do.showPlayButton(); 
			if(self.largePlayButton_do && !self.data.showAnnotationsPositionTool_bl && !self.useWithoutVideoScreen_bl) self.largePlayButton_do.show();
			if(self.controller_do) self.controller_do.show(true);
			if(self.logo_do && self.videoType_str != FWDEVPlayer.VIMEO && !self.useWithoutVideoScreen_bl && !self.useWithoutVideoScreen_bl) self.logo_do.show(true);
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
			if(self.opener_do) self.opener_do.showPlayButton();
			
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
		
		this.videoScreenUpdateSubtitleHandler = function(e){
			self.subtitle_do.updateSubtitle(e.curTime);
		}
		
		this.videoScreenUpdateTimeHandler = function(e, e2, e3, stopHandler){
			
			//if(self.addSource_str && self.addSource_str.indexOf("youtube.") != -1 && !self.isYoutubeReady_bl) return;
			if(self.prevSeconds != e.seconds) self.totalTimePlayed += 1;
			self.totalTimeInSeconds = e.totalTimeInSeconds;
			self.curTimeInSecond = e.seconds;
			self.prevSeconds = e.seconds
			self.totalPercentPlayed = self.totalTimePlayed / e.totalTimeInSeconds;

			if(self.controller_do 
			   && !self.controller_do.isMainScrubberScrubbing_bl
			   && self.controller_do.atb
			   && self.controller_do.atb.isShowed_bl
			   && !self.controller_do.atb.scrub){
				var a = self.totalTimeInSeconds * self.controller_do.atb.pa;
				var b = self.totalTimeInSeconds * self.controller_do.atb.pb;
				
				if(self.prevCurTimeInSeconds != self.curTimeInSecond){
					self.prevCurTimeInSeconds = self.curTimeInSecond;
					if(self.curTimeInSecond < a){
						self.scrub(self.controller_do.atb.pa);
					}else if(self.curTimeInSecond > b){
						self.scrub(self.controller_do.atb.pa);
					}
				}
				
			}
			
			if(self.isAdd_bl){
				
				if(self.totalPercentPlayed >= .25 && self.callFirstQuartile){
					self.callVastEvent("firstQuartile");
					self.callFirstQuartile = false;
				}else if(self.totalPercentPlayed >= .50 && self.callMidpoint){
					self.callVastEvent("midpoint");
					self.callMidpoint = false;
				}else if(self.totalPercentPlayed >= .75 && self.callThirdQuartile){
					self.callVastEvent("thirdQuartile");
					self.callThirdQuartile = false;
				}
			}
			
			
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
			
			if(self.isAdd_bl && self.data.showSkipButton_bl){
			
					if(self.data.timeToHoldAds > seconds){
						self.adsStart_do.updateText(self.data.skipToVideoText_str + Math.abs(self.data.timeToHoldAds - seconds));
						self.adsSkip_do.hide(false);
						if(self.videoType_str == FWDEVPlayer.IMAGE || self.videoType_str == FWDEVPlayer.IFRAME){
							self.adsStart_do.show(true);
						}
					}else{
						self.adsStart_do.hide(true);
						if(self.data.timeToHoldAds != 0) self.adsSkip_do.show(true);
					}
			}
			
			self.currentSecconds = e.seconds;
			
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

			if(FWDEVPUtils.getSecondsFromString(self.getStartTimeStamp("e"))){
				if(self.curTimeInSecond >= parseInt(FWDEVPUtils.getSecondsFromString(self.getStartTimeStamp("e")))) self.stop();
			}
			
			
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
			if(self.showPreloader_bl){
				self.preloader_do.show(false);
				self.preloader_do.startPreloader();
			} 
		};
		
		this.videoScreenStopToBuferHandler = function(){
			self.preloader_do.hide(false);
			self.preloader_do.stopPreloader();
		};
		
		this.videoScreenPlayCompleteHandler = function(e, buttonUsedToSkipAds){
			self.adDone_bl = true;
			/*
			if(self.videoType_str == FWDEVPlayer.VIMEO){
				self.dispatchEvent(FWDEVPlayer.PLAY_COMPLETE);
				return;
			}
			*/
			self.callVastEvent("complete");
			
			if(!self.isAdd_bl && self.data.redirectURL){
			
				if(self.data.redirectTarget == "_self"){
					location.replace(self.data.redirectURL);
				}else{
					window.open(self.data.redirectURL, self.data.redirectTarget);
				}
			}
		
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
				self.setSource(self.data.videosSource_ar[self.data.startAtVideoSource]["source"], true );
				
				self.wasAdd_bl = true;
				if(buttonUsedToSkipAds && self.videoType_str == FWDEVPlayer.VIDEO){	
					self.play();
				}else{
					if(!self.isMobile_bl && self.videoType_str != FWDEVPlayer.HLS_JS) self.play();
				}	
				self.wasAdHLS = true;
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
			if(e.preventDefault) e.preventDefault();
			
			self.callVastEvent("skip");
			self.videoScreenPlayCompleteHandler(e, true);
		};
		
		this.positionAds = function(animate){
			if(!self.data.showSkipButton_bl) return;
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
				self.controller_do.shareButton_do.setNormalState(true);
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
				self.controller_do.embedButton_do.setNormalState(true);
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
		
		
		
		
		//######################################//
		/* Add keyboard support */
		//######################################//
		this.setInputs = function(){
			var numInputs = document.querySelectorAll('input');
			for (var i = 0; i < numInputs .length; i++) {
				if(self.hasPointerEvent_bl){
					numInputs[i].addEventListener("pointerdown", self.inputFocusInHandler);
				}else if(numInputs[i].addEventListener){
					numInputs[i].addEventListener("mousedown", self.inputFocusInHandler);
					numInputs[i].addEventListener("touchstart", self.inputFocusInHandler);
				}
			}
		}
		
		this.inputFocusInHandler = function(e){
			//if(FWDEVPlayer.isSearchedFocused_bl) return;
			self.curInput = e.target;
			setTimeout(function(){
			
				if(self.hasPointerEvent_bl){
					window.addEventListener("pointerdown", self.inputFocusOutHandler);
				}else if(window.addEventListener){
					window.addEventListener("mousedown", self.inputFocusOutHandler);
					window.addEventListener("touchstart", self.inputFocusOutHandler);
				}
				FWDEVPlayer.isSearchedFocused_bl = true;
			}, 50);
		}
		
		this.inputFocusOutHandler = function(e){
			
			var vc = FWDEVPUtils.getViewportMouseCoordinates(e);	
			if(!FWDEVPUtils.hitTest(self.curInput, vc.screenX, vc.screenY)){
				if(self.hasPointerEvent_bl){
					window.removeEventListener("pointerdown", self.inputFocusOutHandler);
				}else if(window.removeEventListener){
					window.removeEventListener("mousedown", self.inputFocusOutHandler);
					window.removeEventListener("touchstart", self.inputFocusOutHandler);
				}
				//if(e.target && e.target.type != "text") 
				FWDEVPlayer.isSearchedFocused_bl = false;
				return;
			}
		};
		
		this.addKeyboardSupport = function(){
			
			self.setInputs();
			document.addEventListener("keydown",  this.onKeyDownHandler);	
			document.addEventListener("keyup",  this.onKeyUpHandler);	
		};
		
		this.onKeyDownHandler = function(e){
			
			if(self.isSpaceDown_bl || !self.hasStartedToPlay_bl || FWDEVPlayer.isSearchedFocused_bl) return;
			self.isSpaceDown_bl = true;
			if(e.preventDefault) e.preventDefault();
			//pause
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
				}else if(self.videoType_str == FWDEVPlayer.VIMEO){
					if(!self.vimeo_do.isSafeToBeControlled_bl) return;
					self.vimeo_do.togglePlayPause();
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
			}else if (e.keyCode == 70 && !self.useWithoutVideoScreen_bl){
				if(self.isFullScreen_bl){
					self.goNormalScreen();
				}else{
					self.goFullScreen();
				}
			}else if (e.keyCode == 77){
				if(self.volume != 0) self.lastVolume = self.volume;
				if(self.volume != 0){
					self.volume = 0;
				}else{
					self.volume = self.lastVolume;
				}
				self.setVolume(self.volume);
			}else if (e.keyCode == 38){
				self.volume += .1;
				if(self.volume > 1) self.volume = 1;
				self.setVolume(self.volume);
			}else if (e.keyCode == 40){
				self.volume -= .1;
				if(self.volume < 0) self.volume = 0;
				self.setVolume(self.volume);
			}else if (e.keyCode == 77){
				
				if(self.volume < 0) self.volume = 0;
				self.setVolume(self.volume);
			}else if (e.keyCode == 39 && !self.isAdd_bl){
				var curTime = self.getCurrentTime();
				if(curTime.length == 5) curTime = "00:" + curTime;
				if(curTime.length == 7) curTime = "0" + curTime;
				curTime = FWDEVPUtils.getSecondsFromString(curTime);
				curTime += 5;
				curTime = FWDEVPUtils.formatTime(curTime);
				if(curTime.length == 5) curTime = "00:" + curTime;
				if(curTime.length == 7) curTime = "0" + curTime;
				
				self.scrubbAtTime(curTime);
			}else if (e.keyCode == 37 && !self.isAdd_bl){
				var curTime = self.getCurrentTime();
				if(curTime.length == 5) curTime = "00:" + curTime;
				if(curTime.length == 7) curTime = "0" + curTime;
				curTime = FWDEVPUtils.getSecondsFromString(curTime);
				curTime -= 5;
				curTime = FWDEVPUtils.formatTime(curTime);
				if(curTime.length == 5) curTime = "00:" + curTime;
				if(curTime.length == 7) curTime = "0" + curTime;
				self.scrubbAtTime(curTime);
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
			if(self.logo_do && self.data.hideLogoWithController_bl && self.isPlaying_bl && self.videoType_str != FWDEVPlayer.VIMEO && !self.useWithoutVideoScreen_bl) self.logo_do.show(true);
			self.showCursor();
			if(self.isAdd_bl && self.data.showSkipButton_bl){
				self.positionAds(true);
				self.adsStart_do.showWithOpacity();
				self.adsSkip_do.showWithOpacity();	
			}
			self.subtitle_do.position(true);
			if(self.popupAds_do) self.popupAds_do.position(true);
		};
		
		this.hiderHideHandler = function(){
			if(self.videoType_str == FWDEVPlayer.VIMEO && !self.data.showDefaultControllerForVimeo_bl) return;
			
			if(self.controller_do && self.data.showYoutubeQualityButton_bl && FWDEVPUtils.hitTest(self.controller_do.ytbButtonsHolder_do.screen, self.hider.globalX, self.hider.globalY)){
				self.hider.reset();
				return;
			}

			if(self.controller_do && self.controller_do.atb && self.controller_do.atb.isShowed_bl){
				if(FWDEVPUtils.hitTest(self.controller_do.atb.mainHolder_do.screen, self.hider.globalX, self.hider.globalY)){
					self.hider.reset();
					return;
				}
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
			if(self.isAdd_bl && self.data.showSkipButton_bl){
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
		this.showPlayer = function(){
			if(!self.isAPIReady_bl) return;
			self.isShowed_bl = true;
			self.opener_do.showCloseButton();
			self.setStageContainerFinalHeightAndPosition(self.animate_bl);
			if(self.isMin){
				self.isMinShowed = true;
				self.positionOnMin(true);
			}
		};
		
		this.hidePlayer = function(){
			if(!self.isAPIReady_bl) return;
			self.isShowed_bl = false;
			self.opener_do.showOpenButton();
			self.setStageContainerFinalHeightAndPosition(self.animate_bl);
			if(self.isMin){
				self.isMinShowed = false;
				self.positionOnMin(true);
			}
		};
		
		this.play = function(){
		
			if(!self.isAPIReady_bl) return;
			
			if(self.videoType_str == FWDEVPlayer.YOUTUBE && !self.isYoutubeReady_bl){
				if(self.showPreloader_bl){
				 	self.preloader_do.show(false);
					self.preloader_do.startPreloader();
				}
				if(self.largePlayButton_do && !self.useWithoutVideoScreen_bl) self.largePlayButton_do.show();
				return;
			}
			
			if(self.videoType_str == FWDEVPlayer.VIMEO && !self.isVimeoReady_bl){
				if(self.showPreloader_bl){
					self.preloader_do.show(false);
					self.preloader_do.startPreloader();
				}
				if(self.largePlayButton_do && !self.useWithoutVideoScreen_bl) self.largePlayButton_do.show();
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
					if(self.largePlayButton_do && !self.useWithoutVideoScreen_bl) self.largePlayButton_do.show();
					return;
				}
			}
			
			if(!self.isAdd_bl && self.data.videosSource_ar[self.data.startAtVideoSource]["isPrivate"] && !self.hasPassedPassowrd_bl && self.passWindow_do){
				if(self.largePlayButton_do && !self.useWithoutVideoScreen_bl) self.largePlayButton_do.show();
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
				if(self.vimeo_do.isStopped_bl){
					self.startVimeoVideoWithDelay = setTimeout(self.vimeo_do.play, 1000);
				}else{
					self.vimeo_do.play();
				}
			}else if(self.videoType_str == FWDEVPlayer.MP3){
				if(self.audioScreen_do){
					self.audioScreen_do.play();
					if(!FWDEVPUtils.isLocal) self.audioScreen_do.setupSpectrum();
				}
			}else if(FWDEVPlayer.hasHTML5Video){
				
				if(self.videoType_str == FWDEVPlayer.HLS_JS && !self.isHLSManifestReady_bl){
					self.videoScreen_do.initVideo();
					self.setupHLS();
					var source = self.videoSourcePath_str;
					if(source.indexOf("encrypt:") != -1) source = atob(source.substr(8));
					self.hlsJS.loadSource(source);
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
			if(window["ga"]){
				if(Math.round(self.totalPercentPlayed * 100)){
					var gaLabel = 'videoPath:' + self.videoSource_str +  ', percentPlayed:' + Math.round(self.totalPercentPlayed * 100)  + ', stoppedAtTime:' + self.getCurrentTime() + ', fullScreen:' +  self.	isFullScreen_bl + ''
					ga('send', {
					  hitType: 'event',
					  eventCategory: 'videos',
					  eventAction: 'played',
					  eventLabel: gaLabel,
					  nonInteraction: true
					});
				}
			}
			
			self.hasPassedPassowrd_bl = false;
			self.isHLSManifestReady_bl = false;
			self.playYoutubeIfLoadedLate_bl = false;
			self.isPlaying_bl = false;
			self.totalTimePlayed = 0;
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

			
			if(self.controller_do){
				if(self.controller_do.atb) self.controller_do.atb.hide(true);
				self.controller_do.disableAtbButton();
				if(self.controller_do.thumbnailsPreview_do) self.controller_do.thumbnailsPreview_do.remove();
			}
			if(self.controller_do && self.controller_do.subtitleButton_do) self.controller_do.subtitleButton_do.disable();
			if(self.controller_do && self.controller_do.downloadButton_do) self.controller_do.downloadButton_do.disable();
			if(self.controller_do && self.controller_do.rewindButton_do) self.controller_do.rewindButton_do.disable();
			if(self.controller_do){
				self.controller_do.disablePlaybackRateButton();
				if(self.controller_do.ttm) self.controller_do.ttm.hide();
			}
			
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
					if(self.largePlayButton_do  && !self.data.showAnnotationsPositionTool_bl && !self.useWithoutVideoScreen_bl) self.largePlayButton_do.show();
				}else{
					if(!source && self.videoType_str == FWDEVPlayer.VIDEO){
						self.videoPoster_do.show();
						if(self.largePlayButton_do && !self.useWithoutVideoScreen_bl) self.largePlayButton_do.show();
					}else if(self.useYoutube_bl){
						if(!self.ytb_do.ytb){
							self.ytb_do.setupVideo();
						}
					}
				}
			}else{
				if(self.data.showControllerWhenVideoIsStopped_bl && self.controller_do_do) self.controller_do.show(true);
				self.videoPoster_do.show();
				if(self.largePlayButton_do && !self.useWithoutVideoScreen_bl) self.largePlayButton_do.show();
			}
			
			
			clearInterval(self.fillScreenId_int);
			self.subtitle_do.hide();
			self.hasHlsPlayedOnce_bl = false;
			self.isSafeToScrub_bl = false;
			self.hlsState = undefined;
			if(self.popupAds_do) self.popupAds_do.hideAllPopupButtons(false);
			if(self.adsStart_do) self.adsStart_do.hide(true);
			if(self.adsSkip_do) self.adsSkip_do.hide(true);
			
			if(self.controller_do) self.controller_do.hideAdsLines();
			
			if(self.annotations_do) self.annotations_do.update(100000);
			if(self.customContextMenu_do) self.customContextMenu_do.disable();
			self.stopVisualization();
			
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
				self.ytb_do.setVolume(self.volume);
			}
			
			if(self.vimeo_do){
				self.vimeo_do.setVolume(self.volume);
			}
			
			if(self.audioScreen_do){
				self.audioScreen_do.setVolume(self.volume);
			}
			
			if(FWDEVPlayer.hasHTML5Video){
				if(self.videoScreen_do) self.videoScreen_do.setVolume(self.volume);
			}
				
			self.dispatchEvent(FWDEVPlayer.VOLUME_SET, {volume:self.volume});
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
			if(self.videoType_str == FWDEVPlayer.YOUTUBE && !self.ytb_do) return;
			if(self.data.vastXML && !self.data.isVastXMLParsed_bl){
				self.data.loadVast(self.data.vastXML);
				return;
			}
			
			if(self.isAdd_bl) return;
			self.TrackingEvents = undefined;
			self.Impression = undefined;
			self.ClickTracking = undefined;
			
			self.callFirstQuartile = true;
			self.callMidpoint = true;
			self.callThirdQuartile = true;
				
			if(!this.isAdd_bl){
				
				if(this.controller_do){
					self.controller_do.setupAdsLines(self.data.adsSource_ar);
					if(self.totalDuration) self.controller_do.positionAdsLines(self.totalDuration);
				}
				
				for(var i=0; i<self.data.adsSource_ar.length; i++){
					if(duration >= self.data.adsSource_ar[i].timeStart && duration <= (self.data.adsSource_ar[i].timeStart + 1) 
						&& !self.data.adsSource_ar[i].played_bl && duration != self.prevDuration){
						
						self.isAdd_bl = true;
						if(self.data.adsSource_ar[i].timeStart != 0) self.wasAdd_bl = true;
						self.addSource_str = self.data.adsSource_ar[i].source;
						self.data.adsSource_ar[i].played_bl = true;
						self.data.adsThumbnailPath_str = self.data.adsSource_ar[i].thumbnailSource;
						self.data.timeToHoldAds = self.data.adsSource_ar[i].timeToHoldAds;
						if(self.data.timeToHoldAds){
							self.data.showSkipButton_bl = true;
						}else{
							self.data.showSkipButton_bl = false;
						}						
						self.data.adsPageToOpenURL_str = self.data.adsSource_ar[i].link;
						self.data.adsPageToOpenTarget_str = self.data.adsSource_ar[i].target;
						self.scrubAfterAddDuration = self.data.adsSource_ar[i].timeStart;
						self.TrackingEvents = self.data.adsSource_ar[i].TrackingEvents;
						self.Impression = self.data.adsSource_ar[i].Impression
						self.ClickTracking = self.data.adsSource_ar[i].ClickTracking
			
						self.curImageTotalTime = self.data.adsSource_ar[i].addDuration;
						if(!self.isStopped_bl) self.lastCurTime = self.curTime
						if(!self.lastCurTime) self.lastCurTime = self.getCurrentTime();
						self.setSource(self.addSource_str);
					
						if(self.videoType_str != FWDEVPlayer.IMAGE && self.videoType_str != FWDEVPlayer.IFRAME && !self.isMobile_bl){
							self.allowToPlay = false;
							if(self.lastCurTime.substr(self.lastCurTime.length -2) == "00"){
								if(self.autoPlay_bl || self.adDone_bl){
									if(self.addSource_str.indexOf("youtube.") != -1 && self.ytb_do && self.ytb_do.hasBeenCreatedOnce_bl) self.allowToPlay = true;
									if(self.addSource_str.indexOf("youtube.") == -1 ) self.allowToPlay = true;
								}
							}else{
								if(self.addSource_str.indexOf("youtube.") != -1 && self.ytb_do && self.ytb_do.hasBeenCreatedOnce_bl) self.allowToPlay = true;
								if(self.addSource_str.indexOf("youtube.") == -1 ) self.allowToPlay = true;
							}
							if(self.allowToPlay) self.play();
				
						}
						self.adDone_bl = false;
						if(this.controller_do && this.controller_do.line_ar){
							this.controller_do.line_ar[i].setVisible(false);
							this.controller_do.line_ar[i].isUsed_bl = true;
						}
						break;
					}
				}
			}
			self.isLive = self.data.videosSource_ar[self.data.startAtVideoSource]["isLive"];
		
			if(!this.isAdd_bl && !self.setSourceExternal_bl) self.setSource(self.data.videosSource_ar[self.data.startAtVideoSource]["source"], false, self.data.videosSource_ar[self.data.startAtVideoSource]["videoType"]);
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
		
			if(self.showPreloader_bl){
				self.preloader_do.show(false);
				self.preloader_do.startPreloader();
			}
			if(self.largePlayButton_do) self.largePlayButton_do.hide();
			
			self.imageAdd_img.onload = function(){
				self.imageScreen_do.setScreen(self.imageAdd_img);
				self.imageScreen_do.setAlpha(0);
				FWDAnimation.to(self.imageScreen_do, 1, {alpha:1});
				self.imageAddOriginalWidth = self.imageAdd_img.width;
				self.imageAddOriginalHeight = self.imageAdd_img.height;
				self.preloader_do.hide(false);
				self.preloader_do.stopPreloader();
				self.imageSceeenHolder_do.addChild(self.imageScreen_do);
				self.positionAdsImage();
				self.startToUpdateAdsButton();
			}
			
			self.imageAdd_img.onerror = function(){
				self.main_do.addChild(self.info_do);
				self.info_do.showText("Advertisment image with path " +  source + " can't be found");
				self.preloader_do.hide(false);
				self.preloader_do.stopPreloader();
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
			
			var totalScale = 0;
			if(scaleX >= scaleY){
				totalScale = scaleX;
			}else if(scaleX <= scaleY){
				totalScale = scaleY;
			}
			
			var finalW = parseInt(self.imageAddOriginalWidth * totalScale);
			var finalH = parseInt(self.imageAddOriginalHeight * totalScale);
			var finalX = parseInt((self.stageWidth - finalW)/2);
			var finalY = parseInt((self.stageHeight - finalH)/2);
			
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
			if(self.largePlayButton_do && !self.useWithoutVideoScreen_bl) self.largePlayButton_do.show();
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
		this.isHLSJsLoaded_bl = false;
		
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
	
			if(self.controller_do) self.controller_do.setIsLive(self.isLive);
			
		
			if(self.videoSourcePath_str.indexOf("vimeo.com") != -1 &&
			   source.indexOf(".mp4") == -1){
				self.videoType_str = FWDEVPlayer.VIMEO;
				//if(self.controller_do && !self.data.showDefaultControllerForVimeo_bl)  self.controller_do.setX(-5000);
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

			if(self.videoSource_str.indexOf("youtube.") != -1 && !self.isYoutubeReady_bl){
				
				setTimeout(function(){
					
					if(self.showPreloader_bl){
						self.main_do.addChild(self.preloader_do);	
						self.preloader_do.show(false);
						self.preloader_do.startPreloader();
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
			
			if(source.indexOf("vimeo.") != -1 && !self.vimeo_do && self.videoType_str == FWDEVPlayer.VIMEO){
					
				if(location.protocol.indexOf("file:") != -1){
					//self.info_do.allowToRemove_bl = false;
					self.main_do.addChild(self.info_do);
					self.info_do.showText("This browser dosen't allow playing Vimeo videos local, please test online.");
					self.resizeHandler();
					return;
				}
				
				
				if(self.showPreloader_bl){
					self.main_do.addChild(self.preloader_do);	
					self.preloader_do.show(false);
					self.preloader_do.startPreloader();
				}
				if(self.largePlayButton_do) self.largePlayButton_do.hide();
			
				self.setupVimeoAPI();
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
					self.preloader_do.hide(false);
					self.preloader_do.stopPreloader();
					return;
				}
				
				script.onload = function () {
					self.isHLSJsLoaded_bl = true;
					FWDEVPlayer.isHLSJsLoaded_bl = true;
					self.setupHLS();
					self.setSource(self.videoSourcePath_str, false,self.data.videosSource_ar[self.data.startAtVideoSource]["videoType"]);
				}
				document.head.appendChild(script); //or something of the likes
				return;
			}
			
			
			if(self.is360 && !self.isThreeJsOrbigLoaded_bl){
					
				if(FWDEVPUtils.isLocal){
					self.main_do.addChild(self.info_do);
					self.info_do.showText("This browser dosen't allow playing 360 videos local, please test online.");
					self.preloader_do.hide(false);
					self.preloader_do.stopPreloader();
					return;
				}
				
				if(!FWDEVPUtils.hasWEBGL){
					self.main_do.addChild(self.info_do);
					self.info_do.showText("Playing 360 videos in this browser is not possible because it dosen't support WEBGL.");
					self.preloader_do.hide(false);
					self.preloader_do.stopPreloader();
					return;
				}
				
				if(!self.isThreeJsLoaded_bl && !FWDEVPlayer.hasThreeJsLoaded_bl){
					var script = document.createElement('script');
					script.src = self.data.threeJsPath_str;
					script.onerror = function(){
						self.main_do.addChild(self.info_do);
						self.info_do.showText("Error loading 360 degree library <font color='#FF0000'>" + self.data.threeJsPath_str + "</font>.");
						self.preloader_do.hide(false);
						self.preloader_do.stopPreloader();
						return;
					}
					script.onload = function () {
						self.isThreeJsOrbigLoaded_bl = true;
						
							var script2 = document.createElement('script');
							script2.src = self.data.threeJsControlsPath_str;
							script2.onerror = function(){
								self.main_do.addChild(self.info_do);
								self.info_do.showText("Error loading three.js from <font color='#FF0000'>" + self.data.threeJsControlsPath_str + "</font>.");
								self.preloader_do.hide(false);
								self.preloader_do.stopPreloader();
								return;
							}
							script2.onload = function () {
								FWDEVPlayer.hasThreeJsLoaded_bl = true;
								self.isThreeJsOrbitLoaded_bl = true;
								if(self.isThreeJsOrbigLoaded_bl && self.isThreeJsOrbitLoaded_bl) self.setSource(self.data.videosSource_ar[self.data.startAtVideoSource]["source"],false, self.data.videosSource_ar[self.data.startAtVideoSource]["videoType"]);
								clearTimeout(self.load360ScriptsId_to);
								self.preloader_do.hide(false);
								self.preloader_do.stopPreloader();
							};
							document.head.appendChild(script2); //or something of the likes
								
							};

					document.head.appendChild(script); //or something of the likes
					
					
					this.load360ScriptsId_to = setTimeout(function(){
						if(self.showPreloader_bl){
							self.preloader_do.show(false);
							self.preloader_do.startPreloader();
						}
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
			if(self.controller_do && self.controller_do.rewindButton_do) self.controller_do.rewindButton_do.disable();
			
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
							
				
				self.videoScreen_do.setVisible(false);
				
				//if(!self.isMobile_bl) self.vimeo_do.showDisable();
				self.vimeo_do.setSource(source);
				if(self.isMobile_bl){
					self.videoPoster_do.hide();
					if(self.largePlayButton_do) self.largePlayButton_do.hide();
				}else{
					self.setPosterSource(self.posterPath_str);
					self.videoPoster_do.show();
					
					if(self.largePlayButton_do && !self.data.showAnnotationsPositionTool_bl && !self.useWithoutVideoScreen_bl){
						self.largePlayButton_do.show();
					}
					if(self.data.autoPlay_bl) self.play();
				}
				
				if(self.getVideoSource()) self.dispatchEvent(FWDEVPlayer.UPDATE_VIDEO_SOURCE);
				this.resizeHandler();
				if(self.vimeo_do.iFrame_do) self.vimeo_do.iFrame_do.screen.style.left = "0px";
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
				self.videoScreen_do.setVisible(false);
								
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
					if(self.largePlayButton_do  && !self.data.showAnnotationsPositionTool_bl && !self.useWithoutVideoScreen_bl) self.largePlayButton_do.show();
					if(self.data.autoPlay_bl) self.play();
					
					if((!self.isMobile_bl && self.wasAdd_bl)) self.play();
					
					//if(self.playYoutubeIfLoadedLate_bl && !self.isMobile_bl) self.play();
					
				}
				
				
				if(self.controller_do){
					self.controller_do.updatePreloaderBar(0);
					self.controller_do.addYtbQualityButton();
				}
				if(self.getVideoSource()) self.dispatchEvent(FWDEVPlayer.UPDATE_VIDEO_SOURCE);
				return;
			}
			self.wasAdd_bl = false;
			
			
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
			
				self.videoScreen_do.setVisible(false);
				
				
				self.videoPoster_do.show();
				if(self.largePlayButton_do  && !self.data.showAnnotationsPositionTool_bl && !self.useWithoutVideoScreen_bl) self.largePlayButton_do.show();
				self.audioScreen_do.setX(0);
				self.audioScreen_do.setVisible(true);
				
				if(self.showPreloader_bl){
					self.preloader_do.hide(false);
					self.preloader_do.stopPreloader();
				}
			
				
				self.audioScreen_do.setSource(source);
				if(self.data.autoPlay_bl) self.play();
			
				if(self.controller_do && self.data.videosSource_ar && self.data.videosSource_ar.length > 1){
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
				if(self.largePlayButton_do  && !self.data.showAnnotationsPositionTool_bl && !self.useWithoutVideoScreen_bl) self.largePlayButton_do.show();
				
				self.videoScreen_do.setX(0)
				self.videoScreen_do.setVisible(true);
				if(self.showPreloader_bl){
					self.preloader_do.hide(false);
					self.preloader_do.stopPreloader();
				}
				
				if(self.videoType_str == FWDEVPlayer.HLS_JS){
					self.videoScreen_do.setSource(source);
					self.videoScreen_do.initVideo();
					self.setupHLS();
					self.hlsJS.loadSource(self.videoSourcePath_str);
					self.hlsJS.attachMedia(self.videoScreen_do.video_el);
					self.hlsJS.on(Hls.Events.MANIFEST_PARSED,function(e){
						self.isHLSManifestReady_bl = true;
						if(self.data.autoPlay_bl || self.wasAdHLS) self.play();
						self.wasAdHLS = false;
					});
				}else{
					
					self.videoScreen_do.setSource(source);
					if(self.data.autoPlay_bl) self.play();
					if(self.flash_do){
						self.flash_do.setWidth(1);
						self.flash_do.setHeight(1);
					}
				}
				
				
				if(self.controller_do && self.data.videosSource_ar && self.data.videosSource_ar.length > 1){
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
			
			self.stopVisualization();
			self.callVastEvent("playerExpand");
			self.disableClick();
			if(self.customContextMenu_do) self.customContextMenu_do.updateFullScreenButton(1);
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
			
			self.callVastEvent("playerCollapse");
				
			if(self.controller_do) self.controller_do.setNormalStateToFullScreenButton();
			
			if(self.displayType == FWDEVPlayer.RESPONSIVE
			   || self.displayType == FWDEVPlayer.AFTER_PARENT
			   || self.displayType == FWDEVPlayer.LIGHTBOX
			   || self.displayType == FWDEVPlayer.STICKY
			 ){
			
				document.documentElement.style.overflow = "visible";
				self.main_do.getStyle().position = "relative";
				self.main_do.getStyle().zIndex = 0;

				if(self.isMin){
					self.main_do.getStyle().position = 'fixed';
					self.main_do.getStyle().zIndex = 9999999999999;
				}else{
					self.main_do.getStyle().position = "relative";
					self.main_do.getStyle().zIndex = 0;
				}
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
			if(self.customContextMenu_do) self.customContextMenu_do.updateFullScreenButton(0);
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
			
			var source = self.data.videosSource_ar[self.data.startAtVideoSource]["source"];
			if(source.indexOf("/") != -1){
				sourceName = source.substr(source.lastIndexOf("/") + 1);
			}else{
				sourceName = source;
			}
		
			self.data.downloadVideo(source, sourceName);
			
			if(window["ga"]){
				var gaLabel = 'videoPath:' + source +  ', videoName:' + sourceName  + '';
				ga('send', {
				  hitType: 'event',
				  eventCategory: 'videos',
				  eventAction: 'downloaded',
				  eventLabel: gaLabel,
				  nonInteraction: true
				});
			}
			
			
		};
		
		this.setVideoSource =  function(source, videoType, isLive){
			if(!self.isAPIReady_bl) return;
			self.isAdd_bl = false;
			if(isLive ==  undefined) isLive = false;
			self.data.videosSource_ar[self.data.startAtVideoSource]["isLive"] = isLive;
			self.data.videosSource_ar[self.data.startAtVideoSource]["source"] = source;
			self.data.videosSource_ar[self.data.startAtVideoSource]["videoType"] = videoType;
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
			if(!self.isAPIReady_bl) return;
			this.fillEntireVideoScreen_bl = param;
			this.resizeHandler();
		};
		
		this.showLightbox = function(){
			if(self.lightBox_do) self.lightBox_do.show();
		}
		
		this.updateHEXColors = function(normalColor, selectedColor){
			if(!self.isAPIReady_bl) return;
			self.controller_do.updateHEXColors(normalColor, selectedColor);
			if(self.largePlayButton_do) self.largePlayButton_do.updateHEXColors(normalColor, selectedColor);
			if(self.shareWindow_do) self.shareWindow_do.updateHEXColors(normalColor, selectedColor);
			if(self.embedWindow_do) self.embedWindow_do.updateHEXColors(normalColor, selectedColor);
			if(self.adsSkip_do) self.adsSkip_do.updateHEXColors(normalColor, selectedColor);
			if(self.opener_do) self.opener_do.updateHEXColors(normalColor, selectedColor);
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
		
		//#############################################//
		/* Tracking vast events */
		//#############################################//
		this.callVastEvent = function(eventName){
			
			if(!self.TrackingEvents) return;
			var URI;
			
			for(var i=0; i<self.TrackingEvents.length; i++){
				if(eventName == self.TrackingEvents[i]["event"]){
					//console.log(eventName);
					URI = self.TrackingEvents[i]["URI"];
				}
			}
		
			if(!URI) return;
			self.executeVastEvent(URI);
		}
		
		this.executeVastEvent = function(URI){
			if(!URI) return;
			var trackingXHR = new XMLHttpRequest();
			trackingXHR.onreadystatechange = function(e){
				//if(trackingXHR.readyState == 4){
					//console.log(trackingXHR.status + "  " + trackingXHR.response)
				//}
			};
			
			trackingXHR.onerror = function(e){
				try{
					if(window.console) console.log(e);
					if(window.console) console.log(e.message);
				}catch(e){};
			};
			
			trackingXHR.open("get", URI, true);
			trackingXHR.send();
		}
		
		this.getStartTimeStamp = function(str){
			var ts  = window.location.href;
			ts = ts.substr(ts.indexOf(str + "=") + 2);
			if(ts.indexOf("&") != -1){
				ts = ts.substr(0, ts.indexOf("&"));
			}

			if(ts.indexOf("s&") != -1){
				ts = ts.substr(0, ts.indexOf("s&") + 1);
			}
			
			var pattern = /\d+h/g;
			var hours = ts.match(pattern);
			try{ hours = ts.match(pattern)[0] }catch(e){}
			if(hours){
				hours = hours.substr(0, hours.length -1);
				if(hours.length == 1 && parseInt(hours) < 10){
					hours = "0" + hours;
				}
				if(parseInt(hours) > 59) hours = 59;
			}
			hours = hours ? hours : "00";
			
			var pattern = /\d+m/g;
			var minutes = ts.match(pattern);
			try{ minutes = ts.match(pattern)[0] }catch(e){}
			if(minutes){
				minutes = minutes.substr(0, minutes.length -1);
				if(minutes.length == 1 && parseInt(minutes) < 10){
					minutes = "0" + minutes;
				}
				if(parseInt(minutes) > 59) minutes = 59;
			}
			minutes = minutes ? minutes : "00";
			
			var pattern = /\d+s/g;
			var seconds = ts.match(pattern);
			try{ seconds = ts.match(pattern)[0] }catch(e){}
			if(seconds){
				seconds = seconds.substr(0, seconds.length -1);
				if(seconds.length == 1 && parseInt(seconds) < 10){
					seconds = "0" + seconds;
				}
				if(parseInt(seconds) > 59) seconds = 59;
			}
			seconds = seconds ? seconds : "00";
		
			return hours + ":" + minutes + ":" + seconds;
		}
	
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
	
	
	FWDEVPlayer.CENTER = "center";
	FWDEVPlayer.LEFT = "left";
	FWDEVPlayer.RIGHT = "right";
	FWDEVPlayer.PAUSE_ALL_VIDEOS = "pause";
	FWDEVPlayer.STOP_ALL_VIDEOS = "stop";
	FWDEVPlayer.DO_NOTHING = "none";
	FWDEVPlayer.VIMEO = "vimeo";
	FWDEVPlayer.YOUTUBE = "youtube";
	FWDEVPlayer.VIDEO = "video";
	FWDEVPlayer.MP3 = "mp3";
	FWDEVPlayer.STICKY = "sticky";
	
	FWDEVPlayer.POSITION_TOP = "top";
	FWDEVPlayer.POSITION_BOTTOM = "bottom";
	
	FWDEVPlayer.SAFE_TO_SCRUB = "safeToScrub";
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
	FWDEVPlayer.PLAYBACK_RATE_CHANGE = "playbackRateChange";
	FWDEVPlayer.ERROR = "error";
	FWDEVPlayer.PLAY_COMPLETE = "playComplete";
	FWDEVPlayer.VOLUME_SET = "volumeSet";
	FWDEVPlayer.GO_FULLSCREEN = "goFullScreen";
	FWDEVPlayer.GO_NORMALSCREEN = "goNormalScreen";
	FWDEVPlayer.IMAGE = "image";
	
	FWDEVPlayer.HIDE_LIGHTBOX_COMPLETE = "lightboxHideComplete";
	FWDEVPlayer.HLS_JS = "HLS_JS";
	FWDEVPlayer.LIGHTBOX = "lightbox";
	FWDEVPlayer.RESPONSIVE = "responsive";
	FWDEVPlayer.FULL_SCREEN = "fullscreen";
	FWDEVPlayer.AFTER_PARENT = "afterparent";
	
	
	window.FWDEVPlayer = FWDEVPlayer;
	
}(window));