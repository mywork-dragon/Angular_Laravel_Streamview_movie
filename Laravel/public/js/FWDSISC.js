/* Gallery */
(function (window){
	
	var FWDSISC = function(props){
		
		var self = this;
	
		/* init gallery */
		self.init = function(){
		
			FWDTweenLite.ticker.useRAF(true);
			this.props_obj = props;
			this.listeners = {events_ar:[]};
			 
			if(!this.props_obj){
				alert("FWDSISC constructor properties object is not defined!");
				return;
			}
			
			this.instanceName_str = this.props_obj.instanceName;
			
			this.displayType = this.props_obj.displayType || FWDSISC.RESPONSIVE;
			this.displayType = this.displayType.toLowerCase();
			
			if(self.displayType.toLowerCase() != FWDSISC.RESPONSIVE 
			   && self.displayType.toLowerCase() != FWDSISC.FULL_SCREEN
			   && self.displayType.toLowerCase() != FWDSISC.FLUID_WIDTH
			   && self.displayType.toLowerCase() != FWDSISC.FLUID_WIDTH_AND_HEIGHT
			   && self.displayType.toLowerCase() != FWDSISC.AFTER_PARENT){
				this.displayType = FWDSISC.RESPONSIVE;
			}
		
			if(!this.props_obj.instanceName){
				alert("FWDSISC instance name is required please make sure that the instanceName parameter exsists and it's value is uinique.");
				return;
			}
			
			if(window[this.instanceName_str]){
				alert("FWDSISC instance name " + this.instanceName_str +  " is already defined and contains a different instance reference, set a different instance name.");
				return;
			}else{
				window[this.instanceName_str] = this;
			}
		
			if(!this.props_obj){
				alert("FWDSISC constructor properties object is not defined!");
				return;
			}
		
			this.body = document.getElementsByTagName("body")[0];
			this.stageContainer = null;
			
			if(this.displayType == FWDSISC.FULL_SCREEN){
				this.stageContainer = self.body;
			}else{	
				this.stageContainer = FWDSISCUtils.getChildById(this.props_obj.parentId);
			}
			
			this.data = null;
			this.customContextMenu_do = null;
			this.imageManager_do = null;
			this.info_do = null;
			this.hider = null;
			this.main_do = null;
			this.preloader_do = null;
			this.playlist_ar = null;
			this.backgroundColor_str = this.props_obj.backgroundColor || "#000000";
			this.maxWidth = this.props_obj.maxWidth || 640;
			this.maxHeight = this.props_obj.maxHeight || 380;
			this.sliderOffsetTopAndBottom = this.props_obj.sliderOffsetTopAndBottom || 0;
			this.id = -1;
			this.catId = -1;
			this.prevCatId = -2;
			this.prevId = -2;
			this.stageWidth = 0;
			this.stageHeight = 0;
			this.zIndex = this.props_obj.zIndex || 0;
			this.totalimages;
		
			this.isMobile_bl = FWDSISCUtils.isMobile;
			this.autoScale_bl = this.props_obj.autoScale == "yes" ? true : false;
			self.paralax_bl = self.props_obj.paralax == "yes" ? true : false;
			this.useVideo_bl = false;
			this.hasPointerEvent_bl = FWDSISCUtils.hasPointerEvent;
		
			self.initializeOnlyWhenVisible_bl = self.props_obj.initializeOnlyWhenVisible; 
			self.initializeOnlyWhenVisible_bl = self.initializeOnlyWhenVisible_bl == "yes" ? true : false;
			this.setupMainDo();
			this.startResizeHandler();

			
			if(self.initializeOnlyWhenVisible_bl){
				window.addEventListener("scroll", self.onInitlalizeScrollHandler);
				setTimeout(self.onInitlalizeScrollHandler, 50);
			}else{
				setTimeout(self.setupSlider, 50);
			}
		};
		
		
		self.onInitlalizeScrollHandler = function(){
			if(!self.ws) return;
			var scrollOffsets = FWDSISCUtils.getScrollOffsets();
			self.pageXOffset = scrollOffsets.x;
			self.pageYOffset = scrollOffsets.y;
			
			if(self.main_do.getRect().top >= -self.stageHeight && self.main_do.getRect().top < self.ws.h){
				window.removeEventListener("scroll", self.onInitlalizeScrollHandler);
				self.setupSlider();
			}
		};
		
		this.setupSlider = function(){
			if(self.data) return;
			self.setupData();
			self.setupInfoWindow();

		}

		// Start stop slideshow */
		this.startStopSlideshowBasedOnVisiblity = function(){
			if(self.data.slideshowDelay || self.paralax_bl){
				window.addEventListener("scroll", self.onStartStopSlideshowBasedOnVisiblity);
				self.onStartStopSlideshowBasedOnVisiblity();
			}
		}
		
		self.isVisible_bl = true;
		self.onStartStopSlideshowBasedOnVisiblity = function(){
			var scrollOffsets = FWDSISCUtils.getScrollOffsets();
			self.pageXOffset = scrollOffsets.x;
			self.pageYOffset = scrollOffsets.y;
				
			if(self.main_do.getRect().top >= -self.stageHeight && self.main_do.getRect().top < self.ws.h){
				if(self.paralax_bl){
					self.imageManager_do.mainHolder_do.setY(Math.round(self.pageYOffset/2));
					if(self.imageManager_do.slideshowPreloader) self.imageManager_do.slideshowPreloader.positionAndResize();
				}

				if(!self.isVisible_bl && self.imageManager_do.tm) self.imageManager_do.tm.start();
				self.isVisible_bl = true;
			}else{
				if(self.imageManager_do.tm) self.imageManager_do.tm.stop();
				self.isVisible_bl = false;
			}
			
		};
			
		//#############################################//
		/* setup main do */
		//#############################################//
		this.setupMainDo = function(){
	
			this.main_do = new FWDSISCDisplayObject("div", "relative");
			this.main_do.getStyle().msTouchAction = "none";
			this.main_do.getStyle().webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
			this.main_do.getStyle().webkitFocusRingColor = "rgba(0, 0, 0, 0)";
			this.main_do.screen.className = "FWDSISC";
			this.main_do.getStyle().width = "100%";
			this.main_do.getStyle().height = "100%";
			this.main_do.setBkColor(this.backgroundColor_str);
			if(!FWDSISCUtils.isMobile || (FWDSISCUtils.isMobile && FWDSISCUtils.hasPointerEvent)) this.main_do.setSelectable(false);
			
			if(this.displayType == FWDSISC.FULL_SCREEN || this.displayType == FWDSISC.FLUID_WIDTH ||  self.displayType == FWDSISC.FLUID_WIDTH_AND_HEIGHT){	
				this.main_do.getStyle().position = "absolute";
				document.documentElement.appendChild(this.main_do.screen);
				
				if(this.displayType == FWDSISC.FLUID_WIDTH ||  self.displayType == FWDSISC.FLUID_WIDTH_AND_HEIGHT){
					this.main_do.getStyle().zIndex = self.zIndex;
					self.stageContainer.style.height = "500px";
				}else{
					this.main_do.getStyle().zIndex = "9999999999998";
				}
				this.stageContainer.style.overflow = "hidden";
			}else{
				this.stageContainer.insertBefore(this.main_do.screen, this.stageContainer.firstChild);
			}		
		};
		
		//#############################################//
		/* resize handler */
		//#############################################//
		this.startResizeHandler = function(){
			if(window.addEventListener){
				window.addEventListener("resize", self.onResizeHandler);
				window.addEventListener("scroll", self.onScrollHandler);
				window.addEventListener("orientationchange", self.orientationChange);
			}else if(window.attachEvent){
				window.attachEvent("onresize", self.onResizeHandler);
				window.attachEvent("onscroll", self.onScrollHandler);
			}
			setTimeout(self.resizeHandler, 100);
			self.resizeHandlerId2_to = setTimeout(function(){self.resizeHandler();}, 50);
			if(self.displayType == FWDSISC.FLUID_WIDTH ||  self.displayType == FWDSISC.FLUID_WIDTH_AND_HEIGHT) self.resizeHandlerId1_to = setTimeout(function(){self.scrollHandler();}, 800);
		};
		
		this.onResizeHandler = function(e){
			if(self.isMobile_bl){
				clearTimeout(self.resizeHandlerId2_to);
				self.resizeHandlerId2_to = setTimeout(function(){self.resizeHandler();}, 200);
			}else{
				self.resizeHandler();
			}	
		};
		
		self.onScrollHandler = function(e){
			self.scrollHandler();
		};
		
		this.orientationChange = function(){
			if(self.displayType == FWDSISC.FLUID_WIDTH ||  self.displayType == FWDSISC.FLUID_WIDTH_AND_HEIGHT || self.displayType == FWDSISC.FULL_SCREEN){
				
				clearTimeout(self.scrollEndId_to);
				clearTimeout(self.resizeHandlerId2_to);
				clearTimeout(self.orientationChangeId_to);
				
				self.orientationChangeId_to = setTimeout(function(){
					self.orintationChanceComplete_bl = true; 
					self.resizeHandler();
					}, 1000);
			}
		};
		
		//##########################################//
		/* resize and scroll handler */
		//##########################################//
		self.scrollHandler = function(){
			
			self.scrollOffsets = FWDSISCUtils.getScrollOffsets();
		
			self.pageXOffset = self.scrollOffsets.x;
			self.pageYOffset = self.scrollOffsets.y;
			
			if(self.isFullScreen_bl || self.displayType == FWDSISC.FULL_SCREEN){	
				self.main_do.setX(self.pageXOffset);
				self.main_do.setY(self.pageYOffset);
			}else if(self.displayType == FWDSISC.FLUID_WIDTH || self.displayType == FWDSISC.FLUID_WIDTH_AND_HEIGHT){	
				if(!self.isMobile_bl){
					self.main_do.setX(self.pageXOffset);
					self.main_do.setY(Math.round(self.stageContainer.getBoundingClientRect().top + self.pageYOffset));
				}
			}
			self.globalX = self.main_do.getGlobalX();
			self.globalY = self.main_do.getGlobalY();
			//if(self.thumbsManager_do) self.thumbsManager_do.setRect();
		};
		
		this.resizeHandler = function(overwrite){
			var viewportSize = FWDSISCUtils.getViewportSize();
			
			self.scrollOffsets = FWDSISCUtils.getScrollOffsets();
			self.ws = viewportSize;
			var scale;
			
			self.wsw = viewportSize.w;
			self.wsh = viewportSize.h;
			self.pageXOffset = self.scrollOffsets.x;
			self.pageYOffset = self.scrollOffsets.y;
			
			if(self.isFullScreen_bl || self.displayType == FWDSISC.FULL_SCREEN){	
				self.main_do.setX(self.scrollOffsets.x);
				self.main_do.setY(self.scrollOffsets.y);
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h;
			}else if(self.displayType == FWDSISC.FLUID_WIDTH){
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h;
				if (self.autoScale_bl){
					scale = Math.min(self.stageWidth/self.maxWidth, 1);
					self.stageHeight = Math.min(parseInt(scale * self.maxHeight), self.maxHeight);
					if(self.stageHeight < 300) self.stageHeight = 300;
					self.stageContainer.style.height = self.stageHeight + "px";
				}else{
					self.stageHeight = self.maxHeight;
					self.stageContainer.style.height = self.stageHeight + "px";
				}
				
				self.main_do.setX(self.pageXOffset);
				self.main_do.setY(Math.round(self.stageContainer.getBoundingClientRect().top + self.pageYOffset));
			}else if(self.displayType == FWDSISC.FLUID_WIDTH_AND_HEIGHT){
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h - Math.round(self.stageContainer.getBoundingClientRect().top + self.pageYOffset);
				self.stageContainer.style.height = self.stageHeight + "px";
				self.main_do.setX(self.pageXOffset);
				self.main_do.setY(Math.round(self.stageContainer.getBoundingClientRect().top + self.pageYOffset));
				
			}else if(self.displayType == FWDSISC.RESPONSIVE){
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
				self.main_do.setX(0);
				self.main_do.setY(0);
				self.stageContainer.style.height = self.stageHeight + "px";
			}else if(self.displayType == FWDSISC.AFTER_PARENT){
				self.stageWidth = self.stageContainer.offsetWidth;
				self.stageHeight = self.stageContainer.offsetHeight;
			}else{
				self.main_do.setX(0);
				self.main_do.setY(0);
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h;
			}
			
			self.scale = Math.min(self.stageWidth/self.maxWidth, 1);
			
			self.main_do.setWidth(self.stageWidth);
			self.main_do.setHeight(self.stageHeight);
			
			self.globalX = self.main_do.getGlobalX();
			self.globalY = self.main_do.getGlobalY();
			
			if(self.preloader_do) self.positionPreloader();
			
			if(self.comboBox_do) self.comboBox_do.position();
			if(self.helpScreen_do && self.helpScreen_do.isShowed_bl) self.helpScreen_do.resizeAndPosition();
			if(self.imageManager_do){
				self.imageManager_do.resizeAndPosition();
				self.imageManager_do.getTextHeight()
				//self.addHeightIfTextIsOutside();
			}
		};
		
		this.addHeightIfTextIsOutside = function(animate){
			var finalHeight;

			if(self.displayType == FWDSISC.FLUID_WIDTH_AND_HEIGHT || self.displayType == FWDSISC.AFTER_PARENT) return;
			if(self.data.HTMLTextPosition_str == "outside"){
				if(self.imageManager_do && self.imageManager_do.nextButton_do && self.imageManager_do.nextAndPrevButtonsPosition_str == "atTheBottomOfImage"){
					if(self.sliderOffsetTopAndBottom > 0){
						finalHeight = self.stageHeight + self.imageManager_do.nextButton_do.h + self.imageManager_do.verticalButtonsOffset + self.imageManager_do.verticalButtonsOffset + self.imageManager_do.getTextHeight() + (self.sliderOffsetTopAndBottom * 2);
					}else{
						finalHeight = self.stageHeight + self.imageManager_do.nextButton_do.h + self.imageManager_do.verticalButtonsOffset * 2;			
					}
				}else{
					finalHeight = self.stageHeight + self.imageManager_do.getTextHeight()  + (self.sliderOffsetTopAndBottom * 2);
				}
			}else{
				if(self.imageManager_do && self.imageManager_do.nextButton_do && self.imageManager_do.nextAndPrevButtonsPosition_str == "atTheBottomOfImage"){
					if(self.sliderOffsetTopAndBottom > 0){
						finalHeight = self.stageHeight + self.imageManager_do.nextButton_do.h + self.imageManager_do.verticalButtonsOffset  + (self.sliderOffsetTopAndBottom * 2);
					}else{
						finalHeight = self.stageHeight + self.imageManager_do.nextButton_do.h + self.imageManager_do.verticalButtonsOffset * 2;			
					}
					
				}else{
					finalHeight = self.stageHeight  + (self.sliderOffsetTopAndBottom * 2);
				}	
			}
			
			FWDAnimation.killTweensOf(self.main_do);
			if(self.displayType != FWDSISC.AFTER_PARENT) FWDAnimation.killTweensOf(self.stageContainer);
			if(animate){
				FWDAnimation.to(self.main_do, .8, {h:finalHeight, ease:Expo.easeInOut});
				FWDAnimation.to(self.stageContainer, .8, {css:{height:finalHeight}, ease:Expo.easeInOut});
			}else{
				if(self.sliderOffsetTopAndBottom > 0){
					self.main_do.setHeight(finalHeight);
				}else{
					self.main_do.setHeight(finalHeight);
				}
				self.stageContainer.style.height = finalHeight + "px";
				self.imageManager_do.setY(self.sliderOffsetTopAndBottom);
			}
			/*
			if(self.isFullScreen_bl || self.displayType == FWDSISC.FULL_SCREEN){
				self.main_do.setHeight(self.stageHeight);
				if(self.imageManager_do) self.imageManager_do.setY(0);
			}else{
				self.main_do.setHeight(self.stageHeight + self.sliderOffsetTopAndBottom * 2);
				if(self.imageManager_do) 
			}
			*/
		}

		this.setFinalHeight = function(finalHeight){
			self.main_do.setHeight(finalHeight);
			self.stageContainer.style.height = finalHeight + "px";
			
		}
		
		//#############################################//
		/* setup info_do */
		//#############################################//
		self.setupInfoWindow = function(){
			FWDSISCInfo.setPrototype();
			self.info_do = new FWDSISCInfo(self, self.data.warningIconPath_str);
		};	
		
		//#############################################//
		/* setup context menu */
		//#############################################//
		self.setupContextMenu = function(){
			self.customContextMenu_do = new FWDSISCContextMenu(self.main_do, self.data.rightClickContextMenu_str);
		};
		
		//#############################################//
		/* Setup hider */
		//#############################################//
		this.setupHider = function(){
			FWDSISCHider.setPrototype();
			self.hider = new FWDSISCHider(self.main_do, self.data.buttonsHideDelay);
			self.hider.addListener(FWDSISCHider.SHOW, self.hiderShowHandler);
			self.hider.addListener(FWDSISCHider.HIDE, self.hiderHideHandler);
			self.hider.start();
		};
		
		this.hiderShowHandler = function(){
			self.imageManager_do.showButtons(true);
			self.imageManager_do.showCnt(true);
		};
		
		this.hiderHideHandler = function(){	
			if(self.imageManager_do && self.imageManager_do.nextButton_do){
				if(FWDSISCUtils.hitTest(self.imageManager_do.nextButton_do.screen, self.hider.globalX, self.hider.globalY)){
					self.hider.reset();
					return;
				}
				
				if(FWDSISCUtils.hitTest(self.imageManager_do.prevButton_do.screen, self.hider.globalX, self.hider.globalY)){
					self.hider.reset();
					return;
				}
			}

			self.imageManager_do.hideButtons(true);
			self.imageManager_do.hideCnt(true);
		};
		
	
		//#############################################//
		/* setup data */
		//#############################################//
		self.setupData = function(){
			FWDSISCData.setPrototype();
			self.data = new FWDSISCData(self.props_obj, self.rootElement_el, self);
			
			if(self.displayType == FWDSISC.FLUID_WIDTH_AND_HEIGHT){

				if(self.data.nextAndPrevButtonsPosition_str == "atTheBottomOfImage"){
					self.data.nextAndPrevButtonsPosition_str = "leftAndRight";
					self.data.HTMLTextPosition_str = "inside";
					self.sliderOffsetTopAndBottom = 0;
				}
			}
			
			self.data.addListener(FWDSISCData.PRELOADER_LOAD_DONE, self.onPreloaderLoadDone);
			self.data.addListener(FWDSISCData.LOAD_ERROR, self.dataLoadError);
			self.data.addListener(FWDSISCData.SKIN_LOAD_COMPLETE, self.dataSkinLoadComplete);
		};
		
		self.onPreloaderLoadDone = function(){
			self.positionPreloader();
		};
		
		self.dataLoadError = function(e){
			if(self.preloader_do) self.preloader_do.hide(false);
			self.main_do.addChild(self.info_do);
			self.info_do.showText(e.text);
			setTimeout(self.resizeHandler, 200);
			self.dispatchEvent(FWDSISC.ERROR, {error:e.text});
		};
		
		self.dataSkinLoadComplete = function(){	
			self.isReady_bl = true;
			self.useVideo_bl = self.data.useVideo_bl;
			self.useAudio_bl = self.data.useAudio_bl;
			if(self.totalPlaylists == 1) showCategoriesMenuButton_bl = false;
			self.setupContextMenu();
			self.setupMainStuff();
			self.id = self.data.startAtimage;
			self.setCategory();
			self.setupPreloader();
			self.positionPreloader();
			self.onStartStopSlideshowBasedOnVisiblity();
			self.dispatchEvent(FWDSISC.READY);
		};
		
		//#############################################//
		/* Setup main instances */
		//#############################################//
		self.setupMainStuff = function(){
			if(self.data.addKeyboardSupport_bl) self.addKeyboardSupport();
			if(self.data.showNextAndPrevButtons_bl) self.setupHider();
		};
		
		//####################################//
		/* add keyboard support */
		//####################################//
		this.addKeyboardSupport = function(){
			if(document.addEventListener){
				document.addEventListener("keydown",  this.onKeyDownHandler);	
				document.addEventListener("keyup",  this.onKeyUpHandler);	
			}else{
				document.attachEvent("onkeydown",  this.onKeyDownHandler);	
				document.attachEvent("onkeyup",  this.onKeyUpHandler);	
			}
		};
		
		this.onKeyDownHandler = function(e){
			if(!self.imageManager_do) return;
			if(document.removeEventListener){
				document.removeEventListener("keydown",  self.onKeyDownHandler);
			}else{
				document.detachEvent("onkeydown",  self.onKeyDownHandler);
			}
			var id = self.imageManager_do.curId;
				
			if (e.keyCode == 39){	
				if (id < self.imageManager_do.totalImages-1){
					id ++;
				}else{
					id = 0;
				}
				
				self.imageManager_do.goToImage(id);
				
				if(e.preventDefault){
					e.preventDefault();
				}else{
					return false;
				}
			}else if (e.keyCode == 37){
				if (id > 0){
					id--;
				}else{
					id = self.imageManager_do.totalImages-1;
				}
					
				self.imageManager_do.goToImage(id);
				
				if(e.preventDefault){
					e.preventDefault();
				}else{
					return false;
				}
			}
		};
		
		this.onKeyUpHandler = function(e){
			if(document.addEventListener){
				document.addEventListener("keydown",  self.onKeyDownHandler);	
			}else{
				document.attachEvent("onkeydown",  self.onKeyDownHandler);	
			}
		};
		
		//#############################################//
		/* setup preloader */
		//#############################################//
		self.setupPreloader = function(){
			FWDSISCSlideshowPreloader.setPrototype();
			self.preloader_do = new FWDSISCSlideshowPreloader(
				self, 
				self.data.preloaderPosition,
				self.data.slideshowRadius, 
				self.data.slideshowBackgroundColor, 
				self.data.slideshowFillColor, 
				self.data.slideshowStrokeSize, 
				1);
			self.main_do.addChild(self.preloader_do);
			self.preloader_do.show(true);
			self.preloader_do.startPreloader();
			
		};
		
		self.positionPreloader = function(){
			if(!self.preloader_do) return;
			self.preloader_do.positionAndResize();
		};
	
		//############################################//
		/* Update category */
		//############################################//
		this.setCategory = function(){
			if(!self.isReady_bl) return;
			
			self.playlist_ar = self.data.playlist_ar.playlistimages;
			
			self.setupImageManager();	
			self.imageManager_do.setupImages();
			setTimeout(function(){
				self.preloader_do.hide(true);
			}, 1000);
		};
		
		//#####################################//
		/* Setup image manager */
		//####################################//
		this.setupImageManager = function(){
			FWDSISCImageManager.setPrototype();
			self.imageManager_do = new FWDSISCImageManager(self, self.data);
			self.imageManager_do.addListener(FWDSISC.ERROR, self.loadErrorImage);
			self.main_do.addChild(self.imageManager_do);
		}
		
		this.loadErrorImage = function(e){
			self.main_do.addChild(self.info_do);
			self.info_do.showText(e.text);
		};

		//############################################//
		/* API */
		//############################################//
		self.goToImage = function(id){
			if(!self.isReady_bl) return;
			self.imageManager_do.goToImage(id);	
		};
		
		this.goToNextImage = function(){	
			var id = self.imageManager_do.curId;
			if (id < self.imageManager_do.totalImages-1){
				id ++;
			}else{
				id = 0;
			}
			self.imageManager_do.goToImage(id);
		};
		
		this.goToPrevImage = function(){
			var id = self.imageManager_do.curId;
			if (id > 0){
				id--;
			}else{
				id = self.imageManager_do.totalImages-1;
			}
			self.imageManager_do.goToImage(id);
		};
			
		this.getImageId = function(){
			if(!self.isReady_bl) return;
			return this.id;
		};
		
		//###########################################//
		/* event dispatcher */
		//###########################################//
		this.addListener = function (type_str, listener){
	    	if(!self.listeners) return;
	    	if(type_str == undefined) throw Error("type_str is required.");
	    	if(typeof type_str === "object") throw Error("type_str must be of type_str String.");
	    	if(typeof listener != "function") throw Error("listener must be of type_str Function.");
	    	
	        var event = {};
	        event.type_str = type_str;
	        event.listener = listener;
	        event.target = self;
	        self.listeners.events_ar.push(event);
	    };
	    
	    this.dispatchEvent = function(type_str, props){
	    	if(self.listeners == null) return;
	    	if(type_str == undefined) throw Error("type_str is required.");
	    	if(typeof type_str === "object") throw Error("type_str must be of type_str String.");
	    	
	        for (var i=0, len=self.listeners.events_ar.length; i < len; i++){
	        	if(self.listeners.events_ar[i].target === self && self.listeners.events_ar[i].type_str === type_str){		
	    	        if(props){
	    	        	for(var prop in props){
	    	        		self.listeners.events_ar[i][prop] = props[prop];
	    	        	}
	    	        }
	        		self.listeners.events_ar[i].listener.call(self, self.listeners.events_ar[i]);
	        	}
	        }
	    };
	    
	    this.removeListener = function(type_str, listener){
	    	if(type_str == undefined) throw Error("type_str is required.");
	    	if(typeof type_str === "object") throw Error("type_str must be of type_str String.");
	    	if(typeof listener != "function") throw Error("listener must be of type_str Function." + type_str);
	    	
	        for (var i=0, len=self.listeners.events_ar.length; i < len; i++){
	        	if(self.listeners.events_ar[i].target === self 
	        			&& self.listeners.events_ar[i].type_str === type_str
	        			&& self.listeners.events_ar[i].listener ===  listener
	        	){
	        		self.listeners.events_ar.splice(i,1);
	        		break;
	        	}
	        }  
	    };		
		self.init();
	};

	
	FWDSISC.RESPONSIVE = "responsive";
	FWDSISC.FLUID_WIDTH = "fluidwidth";
	FWDSISC.FLUID_WIDTH_AND_HEIGHT = "fluidwidthandheight";
	FWDSISC.AFTER_PARENT = "afterparent";
	FWDSISC.FULL_SCREEN = "fullscreen";
	FWDSISC.ERROR = "error";
	
	FWDSISC.FILP_FROM_LEFT_TO_RIGHT = "flipFromLeftToRight";
	FWDSISC.FADE = "fade";
	FWDSISC.FADE_FROM_LEFT_TO_RIGHT = "fadeFromLeftToRight";
	FWDSISC.MOVE_FROM_LEFT_TO_RIGHT = "moveFromLeftToRight";
	FWDSISC.GO_NORMAL_SCREEN = "goNormalScreen";
	FWDSISC.GO_FULL_SCREEN = "goFullScrren";
	FWDSISC.SHOW_START = "showStart";
	FWDSISC.SHOW_COMPLETE = "showComplete";
	FWDSISC.HIDE_START = "hideStart";
	FWDSISC.HIDE_COMPLETE	= "hidecComplete";
	FWDSISC.CATEGORY_UPDATE = "categoryUpdate";
	FWDSISC.image_UPDATE = "imageUpdate";
	FWDSISC.BUTTONS_IN = "in";
	FWDSISC.READY = "ready";
	FWDSISC.ERROR = "error";

	
	FWDSISC.MAXIMIZE_COMPLETE = "maximizeComplete";
	
	window.FWDSISC = FWDSISC;
	
}(window));