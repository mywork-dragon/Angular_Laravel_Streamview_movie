/* Data */
(function(window){
	
	var FWDSISCData = function(props, playListElement, parent){
		
		var self = this;
		var prototype = FWDSISCData.prototype;
		
		this.xhr = null;
		this.emailXHR = null;
		this.playlist_ar = null;
	
		this.props_obj = props;
		this.skinPaths_ar = [];
		this.playlist_ar = [];
		this.lightboxPlaylist_ar = [];
		this.categories_ar = [];
	
		this.mainSkinPath_str = null;
		this.facebookAppId_str = null;
	
		this.countLoadedSkinImages = 0;
		this.showLoadPlaylistErrorId_to;
		this.loadPreloaderId_to;

		this.allowToChangeVolume_bl = true;
		this.autoPlay_bl = false;
		this.showFacebookButton_bl = false;
		this.isDataLoaded_bl = false;
		this.useDeepLinking_bl = false;
		this.isMobile_bl = FWDSISCUtils.isMobile;
		this.hasPointerEvent_bl = FWDSISCUtils.hasPointerEvent;
	
		//###################################//
		/*init*/
		//###################################//
		self.init = function(){
			if(self.props_obj.playlistId.indexOf("siscobj_") != -1){
				setTimeout(self.parseProperties, 1000);
			}else{
				self.parseProperties();
			}
			
		};
		
		//#############################################//
		// parse properties.
		//#############################################//
		self.parseProperties = function(){
			
			self.mainFolderPath_str = self.props_obj.mainFolderPath;
			if(!self.mainFolderPath_str){
				setTimeout(function(){
					if(self == null) return;
					errorMessage_str = "The <font color='#FF0000'>mainFolderPath</font> property is not defined in the constructor function!";
					self.dispatchEvent(FWDSISCData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
			
			if((self.mainFolderPath_str.lastIndexOf("/") + 1) != self.mainFolderPath_str.length){
				self.mainFolderPath_str += "/";
			}
			
			self.mainSkinPath_str = self.props_obj.skinPath;
			if(!self.mainSkinPath_str){
				setTimeout(function(){
					if(self == null) return;
					errorMessage_str = "The <font color='#FF0000'>skinPath</font> property is not defined in the constructor function!";
					self.dispatchEvent(FWDSISCData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
			
		
			if((self.mainSkinPath_str.lastIndexOf("/") + 1) != self.mainSkinPath_str.length){
				self.mainSkinPath_str += "/";
			}
			
			self.skinPath_str =  self.mainFolderPath_str + self.mainSkinPath_str;
			self.audioFlashPath_str = self.mainFolderPath_str + "audio_player.swf";
			self.gallerySkinPath_str = self.mainFolderPath_str;
			self.videoSkinPath_str = self.mainSkinPath_str + "video_player_skin/";
			self.audioSkinPath_str = self.mainSkinPath_str + "audio_player_skin/";
			
			self.rightClickContextMenu_str = self.props_obj.rightClickContextMenu || "developer";
			test = self.rightClickContextMenu_str == "developer" 
				   || self.rightClickContextMenu_str == "disabled"
				   || self.rightClickContextMenu_str == "default";
			if(!test) self.rightClickContextMenu_str = "developer";
			
			self.descriptionWindowPosition_str = self.props_obj.descriptionWindowPosition || "top";
			test = self.descriptionWindowPosition_str == "top" 
				   || self.descriptionWindowPosition_str == "bottom";
			if(!test) self.descriptionWindowPosition_str = "top";
			self.DFDescriptionWindowPosition_str = self.descriptionWindowPosition_str;
			
			self.warningIconPath_str = self.skinPath_str + "warningIcon.png";
			
			self.allCategoriesLabel_str = self.props_obj.allCategoriesLabel || "not defined";
			self.imageBorderColor_str = self.props_obj.imageBorderColor || "transparent";
			self.imageBackgroundColor_str = self.props_obj.imageBackgroundColor || "transparent";
			
			self.imageBackgroundColor_str = self.props_obj.imageBackgroundColor || "transparent";
			self.imageBorderRadius = self.props_obj.imageBorderRadius || 0; 
			self.imageBorderSize = self.props_obj.imageBorderSize || 0;
			self.howManyImagesToSkipOnNextAndPrevButtons = self.props_obj.howManyImagesToSkipOnNextAndPrevButtons || 1;

			self.displayVertical_bl = self.props_obj.displayVertical || "no";
			self.displayVertical_bl = self.displayVertical_bl == "yes" ? true : false;

			self.slideshowPreloaderPosition = self.props_obj.slideshowPreloaderPosition || 'bottomleft';
			self.slideshowPreloaderPosition = self.slideshowPreloaderPosition.toLowerCase();

			self.preloaderPosition = self.props_obj.preloaderPosition || 'bottomleft';
			self.preloaderPosition = self.preloaderPosition.toLowerCase();
			if(self.displayVertical_bl) self.preloaderPosition = 'topleft'
		
			self.slideshowRadius = self.props_obj.slideshowRadius || 10;
			
			self.slideshowBackgroundColor = self.props_obj.slideshowBackgroundColor || '#FF0000';
			self.slideshowFillColor = self.props_obj.slideshowFillColor || '#FFFFFF';
			self.slideshowStrokeSize = self.props_obj.slideshowStrokeSize || 4;

			self.maxImageHeight = self.props_obj.maxImageHeight || 300;
			if(self.maxImageHeight == "originalSize") self.maxImageHeight = 10000;
			self.maxCenterImageHeight = self.props_obj.maxCenterImageHeight || 300;
			if(self.maxCenterImageHeight == "originalSize") self.maxCenterImageHeight = 10000;

		

			self.addDragSupport_bl = self.props_obj.addDragSupport || "no";
			self.addDragSupport_bl = self.addDragSupport_bl == "yes" ? true : false;

			if(self.displayVertical_bl) self.addDragSupport_bl = false;

			
			
			self.showCount_bl = self.props_obj.showCount || "no";
			self.showCount_bl = self.showCount_bl == "yes" ? true : false;
			
			if(self.maxCenterImageHeight != "10000" || self.maxImageHeight != "10000" && self.maxImageHeight != "fullscreen") self.addDragSupport_bl = false;
		
			self.imageOffsetBottom = self.props_obj.imageOffsetBottom || 0;
			self.nextAndPrevButtonsHorizontalButtonsOffset = self.props_obj.nextAndPrevButtonsHorizontalButtonsOffset || 0;
			self.nextAndPrevButtonsVerticalButtonsOffset = self.props_obj.nextAndPrevButtonsVerticalButtonsOffset || 0;
			
			self.buttonsHideDelay = self.props_obj.buttonsHideDelay || 3;
			self.buttonsHideDelay *= 1000;
			
			self.showHTMLTextContent_str = self.props_obj.showHTMLTextContent || "none";
			if(self.showHTMLTextContent_str.toLowerCase() == "none"){
				self.showHTMLTextContent_str = "none";
			}else if(self.showHTMLTextContent_str.toLowerCase() == "center"){
				self.showHTMLTextContent_str = "center";
			}else if(self.showHTMLTextContent_str.toLowerCase() == "all"){
				self.showHTMLTextContent_str = "all";
			}else{
				self.showHTMLTextContent_str = "all";
			}

			if(self.displayVertical_bl) self.showHTMLTextContent_str = "all";
			
			
			self.nextAndPrevButtonsPosition_str = self.props_obj.nextAndPrevButtonsPosition || "insideImage";
			if(self.nextAndPrevButtonsPosition_str.toLowerCase() == "insideimage"){
				self.nextAndPrevButtonsPosition_str = "insideImage";
			}else if(self.nextAndPrevButtonsPosition_str.toLowerCase() == "outsideimage"){
				self.nextAndPrevButtonsPosition_str = "outsideImage";
			}else if(self.nextAndPrevButtonsPosition_str.toLowerCase() == "atthebottomofimage"){
				self.nextAndPrevButtonsPosition_str = "atTheBottomOfImage";
			}else if(self.nextAndPrevButtonsPosition_str.toLowerCase() == "leftandright"){
				self.nextAndPrevButtonsPosition_str = "leftAndRight";
			}else{
				self.nextAndPrevButtonsPosition_str = "insideImage";
			}
			
			self.HTMLTextPosition_str = self.props_obj.HTMLTextPosition || "inside";
			if(self.HTMLTextPosition_str.toLowerCase() == "inside"){
				self.HTMLTextPosition_str = "inside";
			}else if(self.HTMLTextPosition_str.toLowerCase() == "outside"){
				self.HTMLTextPosition_str = "outside";
			}else{
				self.HTMLTextPosition_str = "inside";
			}
			
			self.HTMLTextAlignment_str = self.props_obj.HTMLTextAlignment || "top";
			if(self.HTMLTextAlignment_str.toLowerCase() == "top"){
				self.HTMLTextAlignment_str = "top";
			}else if(self.HTMLTextAlignment_str.toLowerCase() == "bottom"){
				self.HTMLTextAlignment_str = "bottom";
			}else{
				self.HTMLTextAlignment_str = "top";
			}
			
			self.buttonBackgroundNormalColor_str = self.props_obj.buttonBackgroundNormalColor || "#FF0000";
			self.buttonBackgroundNormalSelected_str = self.props_obj.buttonBackgroundSelectedColor || "#FF0000";
			self.buttonTextNormalColor_str = self.props_obj.buttonTextNormalColor || "#FF0000";
			self.buttonTextSelectedColor_str = self.props_obj.buttonTextSelectedColor || "#FF0000";
			self.buttonBackgroundOpacity =  self.props_obj.buttonBackgroundOpacity;
			if(!self.props_obj.buttonBackgroundOpacity) self.buttonBackgroundOpacity = 1;
			
			
			self.autoPlay_bl = self.props_obj.autoPlay; 
			self.autoPlay_bl = self.autoPlay_bl == "yes" ? true : false;
			self.useVideo_bl = self.props_obj.useVideo == "no" ? false : true;
			
			
			//video settings
			self.timeColor_str = self.props_obj.timeColor || "#FF0000";
			self.videoPosterBackgroundColor_str = self.props_obj.videoPosterBackgroundColor || "transparent";
			self.videoControllerBackgroundColor_str = self.props_obj.videoControllerBackgroundColor || "transparent";
			self.audioControllerBackgroundColor_str = self.props_obj.audioControllerBackgroundColor || "transparent";
		
			self.volume = 1;
			self.controllerHeight = self.props_obj.videoControllerHeight || 50;
			self.startSpaceBetweenButtons = self.props_obj.startSpaceBetweenButtons || 0;
			self.controllerHideDelay = self.props_obj.videoControllerHideDelay || 2;
			self.controllerHideDelay *= 1000;
			self.vdSpaceBetweenButtons = self.props_obj.vdSpaceBetweenButtons || 0;
			self.scrubbersOffsetWidth = self.props_obj.scrubbersOffsetWidth || 0;
			self.volumeScrubberOffsetRightWidth = self.props_obj.volumeScrubberOffsetRightWidth || 0;
			self.timeOffsetLeftWidth = self.props_obj.timeOffsetLeftWidth || 0;
			self.timeOffsetRightWidth = self.props_obj.timeOffsetRightWidth || 0;
			self.timeOffsetTop = self.props_obj.timeOffsetTop || 0;
			self.logoMargins = self.props_obj.logoMargins || 0;
			self.mainScrubberOffestTop = self.props_obj.mainScrubberOffestTop || 0;
			self.volumeScrubberWidth = self.props_obj.volumeScrubberWidth || 10;
			self.audioScrubbersOffestTotalWidth = self.props_obj.audioScrubbersOffestTotalWidth || 0;
			self.audioControllerHeight =  self.props_obj.audioControllerHeight || 40;
			self.imageBackgroundColor_str = self.props_obj.imageBackgroundColor || "#333333";
			self.startAtCategory = self.props_obj.startAtCategory || 0;  
			self.startAtImage = self.props_obj.startAtImage || 0;  
			if(self.volumeScrubberWidth > 200) self.volumeScrubberWidth = 200;
			self.transitionDuration = parseInt(self.props_obj.transitionDuration) || .8;
			self.spaceBetweenImages = parseInt(self.props_obj.spaceBetweenImages) || 0;
			
			self.transitionType_str = self.props_obj.transitionType || "expo";
			if(self.transitionType != "expo"
			  && self.transitionType != "slowease"
			  && self.transitionType != "elastic"
			  && self.transitionType != "bounce"
			  && self.transitionType != "normal"){
				  self.transitionType_str = self.getTransitionType(self.transitionType_str);
			  }
			self.defaulNrThumbsToDisplay = self.props_obj.defaulNrThumbsToDisplay || "all"
			if(self.displayVertical_bl) self.defaulNrThumbsToDisplay = "all";
			if(self.defaulNrThumbsToDisplay != "all") self.defaulNrThumbsToDisplay = parseInt(self.defaulNrThumbsToDisplay);
				
				
			self.animationTextType_str = self.props_obj.animationTextType || "fade";
			if(self.animationTextType_str != "fade"
			  && self.animationTextType_str != "fadeFromLeftToRight"
			  && self.animationTextType_str != "moveFromLeftToRight"
			  && self.animationTextType_str != "flipFromLeftToRight" 
			){
				  self.animationTextType_str = "fade";
			}
			
			self.showImageReflection_bl = self.props_obj.showImageReflection || "no";
			self.showImageReflection_bl = self.showImageReflection_bl == "yes" ? true : false;
			if(self.displayVertical_bl) self.showImageReflection_bl = false;
			
			if(self.isMobile_bl) self.allowToChangeVolume_bl = false;
			
			self.overlayColor_str = self.props_obj.overlayColor || ""; 
			if(self.displayVertical_bl) self.overlayColor_str = 'rgba(0,0,0,0)';
		
			self.showNextAndPrevButtons_bl = self.props_obj.showNextAndPrevButtons; 
			self.showNextAndPrevButtons_bl = self.showNextAndPrevButtons_bl == "yes" ? true : false;
			
			self.showNextAndPrevButtonsOnMobile_bl = self.props_obj.showNextAndPrevButtonsOnMobile; 
			self.showNextAndPrevButtonsOnMobile_bl = self.showNextAndPrevButtonsOnMobile_bl == "yes" ? true : false;
			if(self.isMobile_bl && !self.showNextAndPrevButtonsOnMobile_bl) self.showNextAndPrevButtons_bl = false;
			if(self.displayVertical_bl) self.showNextAndPrevButtons_bl = false;

			self.slideshowDelay = self.props_obj.slideshowDelay;
			self.slideshowDelay /= 1000;
			if(self.displayVertical_bl) self.slideshowDelay = 0;
			
			self.videoAutoPlay_bl = self.props_obj.videoAutoPlay; 
			self.videoAutoPlay_bl = self.videoAutoPlay_bl == "yes" ? true : false;
			if(FWDSISCUtils.isMobile) self.videoAutoPlay_bl = false;
			
			self.audioAutoPlay_bl = self.props_obj.audioAutoPlay; 
			self.audioAutoPlay_bl = self.audioAutoPlay_bl == "yes" ? true : false;
			if(FWDSISCUtils.isMobile) self.audioAutoPlay_bl = false;
			
			self.videoLoop_bl = self.props_obj.videoLoop; 
			self.videoLoop_bl = self.videoLoop_bl == "yes" ? true : false;
			
			self.audioLoop_bl = self.props_obj.audioLoop; 
			self.audioLoop_bl = self.audioLoop_bl == "yes" ? true : false;
			
			self.addKeyboardSupport_bl = self.props_obj.addKeyboardSupport; 
			self.addKeyboardSupport_bl = self.addKeyboardSupport_bl == "yes" ? true : false;
			
			self.hideLogoWithController_bl = self.props_obj.hideLogoWithController; 
			self.hideLogoWithController_bl = self.hideLogoWithController_bl == "yes" ? true : false;
			
			self.showPoster_bl = self.props_obj.showPoster; 
			self.showPoster_bl = self.showPoster_bl == "yes" ? true : false;
			
			self.showVolumeScrubber_bl = self.props_obj.showVolumeScrubber; 
			self.showVolumeScrubber_bl = self.showVolumeScrubber_bl == "no" ? false : true;

			self.useVectorIconsSkin_bl = self.props_obj.useVectorIconsSkin; 
			self.useVectorIconsSkin_bl = self.useVectorIconsSkin_bl == "no" ? false : true;

		
			self.showVolumeButton_bl = self.props_obj.showVolumeButton; 
			self.showVolumeButton_bl = self.showVolumeButton_bl == "no" ? false : true;
			
			self.showAllCategories_bl = self.props_obj.showAllCategories;
			self.showAllCategories_bl = self.showAllCategories_bl == "yes" ? true : false;
			
			self.showControllerWhenVideoIsStopped_bl = true; 
			
			self.showTime_bl = self.props_obj.showTime; 
			self.showTime_bl = self.showTime_bl == "no" ? false : true;
			
			self.videoShowFullScreenButton_bl = self.props_obj.videoShowFullScreenButton; 
			self.videoShowFullScreenButton_bl = self.videoShowFullScreenButton_bl == "no" ? false : true;
			
			self.randomizeImages_bl = self.props_obj.randomizeImages;
			self.randomizeImages_bl = self.randomizeImages_bl == "yes" ? true : false;
			
			self.showComboBox_bl = self.props_obj.showComboBox;
			self.showComboBox_bl = self.showComboBox_bl == "yes" ? true : false;
			
			//#################################//
			//create playlists
			//#################################//
			var parsedPlaylist_ar = [];
			self.playListElement = FWDSISCUtils.getChildById(self.props_obj.playlistId);
			
			if(self.props_obj.playlistId.indexOf("siscobj_") != -1){
				plObj = window[self.props_obj.playlistId];
				if(!plObj){
					errorMessage_str = "ERROR! The playlist JSON object with the label <font color='#FF0000'>" + self.props_obj.playlistId + "</font> doesn't exist!";
						setTimeout(function(){
						self.dispatchEvent(FWDSISCData.LOAD_ERROR, {text:errorMessage_str});
					}, 100);
					return;
				}
				self.playlist_ar = plObj;
			}else{
				if(!self.playListElement){
					errorMessage_str = "Playlist div with the id - <font color='#FF0000'>" + self.props_obj.playlistId + "</font> doesn't exists.";
					setTimeout(function(){
						self.dispatchEvent(FWDSISCData.LOAD_ERROR, {text:errorMessage_str});
					}, 100);
					return;
				}
			
				var curPlaylist_ar = FWDSISCUtils.getChildren(self.playListElement);
				var totalimages = curPlaylist_ar.length;
				
				var plObj = {};
				
				if(totalimages == 0){
					errorMessage_str = "At least one entry is requires in the playlist nr: <font color='#FF0000'>" + j + "</font>";
					setTimeout(function(){
						self.dispatchEvent(FWDSISCData.LOAD_ERROR, {text:errorMessage_str});
					}, 100);
					return;
				}
				
				for(var i=0; i<totalimages; i++){
					var obj = {};
					var ch = curPlaylist_ar[i];
					var test;
					
					if(!FWDSISCUtils.hasAttribute(ch, "data-source")){
						errorMessage_str = "Attribute <font color='#FF0000'>data-source</font> is not found in the playlist at position nr: <font color='#FF0000'>" + i + "</font>.";
						setTimeout(function(){
							self.dispatchEvent(FWDSISCData.LOAD_ERROR, {text:errorMessage_str});
						}, 100);
						return;
					}
					
					obj.source = String(FWDSISCUtils.getAttributeValue(ch, "data-source"));
					obj.target = FWDSISCUtils.getAttributeValue(ch, "data-target");
					obj.link = FWDSISCUtils.getAttributeValue(ch, "data-link");
					obj.imageWidth = FWDSISCUtils.getAttributeValue(ch, "data-width");
					obj.imageHeight = FWDSISCUtils.getAttributeValue(ch, "data-height");
					obj.HTMLTextAlignment = FWDSISCUtils.getAttributeValue(ch, "text-vertical-alignment");
					
					try{
						obj.description_ar = [];
					
						for(var k=0; k<FWDSISCUtils.getChildren(ch).length; k++){
							obj.description_ar[k] = FWDSISCUtils.getChildren(ch)[k].outerHTML;
						}
						//obj.description_ar = FWDSISCUtils.getChildren();
					}catch(e){};
			
				
					var firstUrlPath = encodeURI(obj.source.substr(0,obj.source.lastIndexOf("/") + 1));
					var secondUrlPath = encodeURIComponent(obj.source.substr(obj.source.lastIndexOf("/") + 1));
					obj.source = firstUrlPath + secondUrlPath;
					
					
					parsedPlaylist_ar[i] = obj;
				}
				self.playlist_ar = {playlistimages:parsedPlaylist_ar};
			}
				
			if(self.randomizeImages_bl) self.playlist_ar.playlistimages = FWDSISCUtils.randomizeArray(self.playlist_ar.playlistimages);
			
			try{
				self.playListElement.parentNode.removeChild(self.playListElement);
			}catch(e){};
		
			self.skinPaths_ar = [
			    {img:self.nextButtonN_img = new Image(), src:self.skinPath_str + "next-button.png"},
				{img:self.prevButtonN_img = new Image(), src:self.skinPath_str + "prev-button.png"}
    		];
			self.nextButtonS_str = self.skinPath_str + "next-button-over.png";
			self.prevButtonS_str = self.skinPath_str + "prev-button-over.png";
		
			self.totalGraphics = self.skinPaths_ar.length;
			
			if(self.useVectorIconsSkin_bl){
				setTimeout(function(){
					self.dispatchEvent(FWDSISCData.PRELOADER_LOAD_DONE);
					self.dispatchEvent(FWDSISCData.SKIN_LOAD_COMPLETE);
				}, 50);	
			}else{
				self.loadSkin();
			}
		};
		
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
					self.dispatchEvent(FWDSISCData.SKIN_LOAD_COMPLETE);
				}, 50);
			}
		};
		
		self.onSkinLoadErrorHandler = function(e){
			if (FWDSISCUtils.isIEAndLessThen9){
				message = "Graphics image not found!";
			}else{
				message = "The skin icon with label <font color='#FF0000'>" + e.target.src + "</font> can't be loaded, check path!";
			}
			
			if(window.console) console.log(e);
			var err = {text:message};
			setTimeout(function(){
				self.dispatchEvent(FWDSISCData.LOAD_ERROR, err);
			}, 50);
		};
		
		self.getTransitionType = function(transition){
			
			if(transition.toLowerCase() == "expo"){
				transition = "Expo.easeInOut"
			}else if(transition.toLowerCase() == "slowease"){
				transition = "Quint.easeOut"
			}else if(transition.toLowerCase() == "elastic"){
				transition = "Elastic.easeOut"
			}else if(transition.toLowerCase() == "bounce"){
				transition = "Bounce.easeOut"
			}else if(transition.toLowerCase() == "normal"){
				transition = "Power0.easeNone"
			}
			
			return transition;
		}
		
			//##########################################//
		/* load facebook playlistlist */
		//##########################################//
		this.loadFacebookPlaylist = function(){
			
			if(document.location.protocol == "file:"){
				self.isPlaylistDispatchingError_bl = true;
				var error = "Please test online, is not possible to view Facebook albums local.";
				self.main_do.addChild(self.info_do);
				self.info_do.showText(error);	
				setTimeout(function(){
					self.isAnim_bl = false;
				}, 850);
				return
			}
			
			if(!self.facebookShare){
				FWDRLFacebookShare.setPrototype();
				self.facebookShare = new FWDRLFacebookShare(self.facebookAppId_str);
				self.facebookShare.addListener(FWDRLFacebookShare.API_READY, self.facebookAPIReadyHandler);
				self.facebookShare.addListener(FWDRLFacebookShare.API_ERROR, self.facebookAPIErrorHandler);
			}else{
				self.loadAccessFacebookAccessToken();
			}
		};
		
		this.facebookAPIReadyHandler = function(e){
			self.loadAccessFacebookAccessToken();
		};
		
		this.facebookAPIErrorHandler = function(e){
			var error = "Error loading file : <font color='#FF0000'>" + self.originalFacebookURL_str + "</font>";
			self.main_do.addChild(self.info_do);
			self.info_do.showText(error);	
			self.isAnim_bl = false;
		};
		
		this.loadAccessFacebookAccessToken = function(){
			self.stopToLoadPlaylist();
			self.sourceURL_str = self.data.mainFolderPath_str + "facebook_access_token.txt";
		
			self.xhr = new XMLHttpRequest();
			self.xhr.onreadystatechange = self.facebookTokenOnLoadoadHandler;
			self.xhr.onerror = self.facebookErrorHandler;
			
			try{
				self.xhr.open("get", self.sourceURL_str + "?rand=" + parseInt(Math.random() * 99999999), true);
				self.xhr.send();
			}catch(e){
				var message = e;
				if(e){if(e.message)message = e.message;}
				self.facebookAPIErrorHandler();
			}
		};
		
		this.facebookTokenOnLoadoadHandler = function(e){
			var response;
			
			if(self.xhr.readyState == 4){
				if(self.xhr.status == 404){
					var error = "Facebook token path is not found : <font color='#FF0000'>" + self.originalFacebookURL_str + "</font>";
					self.main_do.addChild(self.info_do);
					self.info_do.showText(error);	
					self.isAnim_bl = false;
				}else if(self.xhr.status == 408){
					var error = "Loading facebook token";
					self.main_do.addChild(self.info_do);
					self.info_do.showText(error);	
					self.isAnim_bl = false;
				}else if(self.xhr.status == 200){
					if(window.JSON){
						response = JSON.parse(self.xhr.responseText);
					}else{
						response = eval('('+ self.xhr.responseText +')');
					}
				
					self.accessToken_str = response.access_token;
					self.loadFacebookPlaylistWhenReady();
				}
			}
		};
		
		this.facebookErrorHandler = function(e){
			var error = "Error loading file : <font color='#FF0000'>" + self.originalFacebookURL_str + "</font>";
			self.main_do.addChild(self.info_do);
			self.info_do.showText(error);	
			self.isAnim_bl = false;
		};
		
		this.loadFacebookPlaylistWhenReady = function(){
			
			
			FB.api(
				  '/' + self.facebookUsisc_str + '?access_token=' + self.accessToken_str,
				  'GET',
				  {"fields":"photos.limit(100){images,created_time,name}"},
				  function(response) {
					  if (response){
						  FWDRL.parsePlaylist(response, self.id, self.propsObjVariableName_str);
				      }
				  }
			);
		};
		
		//####################################//
		/* show error if a required property is not defined */
		//####################################//
		self.showPropertyError = function(error){
			self.dispatchEvent(FWDSISCData.LOAD_ERROR, {text:"The property called <font color='#FF0000'>" + error + "</font> is not defined."});
		};
		
		self.init();
	};
	
	/* set prototype */
	FWDSISCData.setPrototype = function(){
		FWDSISCData.prototype = new FWDSISCEventDispatcher();
	};
	
	FWDSISCData.prototype = null;
	
	FWDSISCData.PRELOADER_LOAD_DONE = "onPreloaderLoadDone";
	FWDSISCData.LOAD_DONE = "onLoadDone";
	FWDSISCData.LOAD_ERROR = "onLoadError";
	FWDSISCData.IMAGE_LOADED = "onImageLoaded";
	FWDSISCData.SKIN_LOAD_COMPLETE = "onSkinLoadComplete";
	FWDSISCData.SKIN_PROGRESS = "onSkinProgress";
	FWDSISCData.IMAGES_PROGRESS = "onImagesPogress";
	FWDSISCData.PLAYLIST_LOAD_COMPLETE = "onPlaylistLoadComplete";
	
	window.FWDSISCData = FWDSISCData;
}(window));