(function (window){
	
	var FWDSISCImageManager = function(parent, data){
		
		var self = this;
		var prototype = FWDSISCImageManager.prototype;
		
		this.data = data;
		this.parent = parent;
		this.playlist_ar = null;
		this.images_ar = null;
		
		this.mainHolder_do = null;
		this.imageHolder_do = null;
		
		this.displayVertical_bl = data.displayVertical_bl;
		this.imageBorderColor_str = data.imageBorderColor_str;
		this.imageoverlayColor_str = data.imageoverlayColor_str;
		this.imageBorderRadius = data.imageBorderRadius;
		this.imageBorderSize = data.imageBorderSize;
		this.imageBackgroundColor_str = data.imageBackgroundColor_str;
		this.showHTMLTextContent_str = data.showHTMLTextContent_str;
		this.HTMLTextPosition_str = data.HTMLTextPosition_str;
		this.overlayColor_str = data.overlayColor_str;
		this.showImageReflection_bl = data.showImageReflection_bl;
		this.HTMLTextAlignment_str = data.HTMLTextAlignment_str
		
		this.stageWidth = 0;
		this.stageHeight = 0;
		
		this.horizontalButtonsOffset = data.nextAndPrevButtonsHorizontalButtonsOffset;
		this.verticalButtonsOffset = data.nextAndPrevButtonsVerticalButtonsOffset;
		this.nextAndPrevButtonsPosition_str = data.nextAndPrevButtonsPosition_str;
		this.maxImageHeight = data.maxImageHeight;
		this.maxCenterImageHeight = data.maxCenterImageHeight;
		
		this.spaceBetweenImages = data.spaceBetweenImages;
		this.imageOverlayOpacity = parent.imageOverlayOpacity;
		this.lastPresedX = 0;
		this.totalImages = 0;	

		this.countLoadedThumbs = 0;
		this.curId = data.startAtImage;
		this.cntId = data.startAtImage;
		
		this.prevId = this.curId;
		this.defaulNrThumbsToDisplay = data.defaulNrThumbsToDisplay;
		this.transitionDuration = data.transitionDuration;
		this.defaultTransitionDuration = this.transitionDuration;
		this.transitionType_str = data.transitionType_str;
		this.defaultTransitionType = data.transitionType_str;
		
		this.howManyImagesToSkipOnNextAndPrevButtons = data.howManyImagesToSkipOnNextAndPrevButtons;
		this.loadWithDelayId_to;
		this.disableOnMoveId_to;
		this.updateMobileScrollBarId_int;
		this.animationTextType_str = data.animationTextType_str;
		this.showNextAndPrevButtons_bl = data.showNextAndPrevButtons_bl;
		this.showimageOverlay_bl = parent.showimageOverlay_bl;
		this.areimageTouched_bl = false;
		this.isScrolling_bl = false;
		this.isShowed_bl = false;
		this.isMobile_bl = FWDSISCUtils.isMobile;
		this.hasPointerEvent_bl =FWDSISCUtils.hasPointerEvent;
	
		//#################################//
		/* init */
		//#################################//
		self.init = function(){
			self.setOverflow("visible");
			self.mainHolder_do = new FWDSISCDisplayObject("div");
			self.mainHolder_do.setOverflow("visible");
			
			self.imageHolder_do = new FWDSISCDisplayObject("div"); 
			self.imageHolder_do.setOverflow("visible");
			self.mainHolder_do.addChild(self.imageHolder_do);
			
			self.addChild(self.mainHolder_do);
			if(!self.addDragSupport_bl && !self.displayVertical_bl) self.addSwipeSupport();
			self.addDragSupport_bl = data.addDragSupport_bl;
			if(self.addDragSupport_bl){				
				setTimeout(self.addDragSupport, 200);
			}

			self.setupSlideshowPreloader();
			if(data.showCount_bl){
				this.setupCount();
				self.setCount(self.cntId, parent.playlist_ar.length);
				setTimeout(function(){
					self.positionCnt();
					self.hideCnt();
				}, 300);
			} 
			self.resizeAndPosition();
		};

		// Setup count.
		this.setupCount = function(){
			self.cntHolder_do = new FWDSISCDisplayObject('div');
			self.cntHolder_do.screen.style.display = "inline-block";
			self.cntHolder_do.screen.className = 'fwdsisc-count-holder';
			self.isCntShowed_bl = true;

			self.cnt_do = new FWDSISCDisplayObject("div", 'relative');	
			self.cnt_do.screen.style.display = "inline-block";
			self.cnt_do.setVisible(false);
			self.addChild(self.cntHolder_do);
			self.cntHolder_do.addChild(self.cnt_do);
		}

		this.setCount = function(current, total){
			if(!self.cnt_do) return;
			current = current + 1;
		
			var output = '<div class="fwdsisc-count">';
			if(current < 10){
				current = '0<span class="fwdsisc-current">' + current + '</span>';
			}else{
				current = '<span class="fwdsisc-current">' + current + '</span>';
			}

			if(total < 10) total = '0' + total;

			output += current + '/' + total;
			self.cnt_do.setInnerHTML(output);
			self.positionCnt();
		}

		this.positionCnt =  function(){
			if(!self.cnt_do) return;
			self.cntHolder_do.setY(self.stageHeight - self.cnt_do.getHeight());
		}
		
		this.showCnt =  function(animate){
			if(!self.cnt_do) return;
			self.isCntShowed_bl = true;
			self.cnt_do.setVisible(true);
			FWDAnimation.killTweensOf(self.cnt_do);
			if(animate){
				FWDAnimation.to(self.cnt_do, .8, {x:0, ease:Expo.easeInOut});
			}else{
				self.cnt_do.setX(0);
			}
		}

		this.hideCnt =  function(animate){
			if(!self.cnt_do) return;
			self.isCntShowed_bl = false;
			FWDAnimation.killTweensOf(self.cnt_do);
			if(animate){
				FWDAnimation.to(self.cnt_do, .8, {x:self.cnt_do.getWidth() + 5, ease:Expo.easeInOut});
			}else{
				self.cnt_do.setX(self.cnt_do.getWidth() + 5);
			}
		}


		// Setup slideshow preloader
		this.setupSlideshowPreloader = function(){
			if(!self.data.slideshowDelay) return;
			if(data.playlist_ar['playlistimages'].length <= 1) return;
		
			FWDSISCSlideshowPreloader.setPrototype();
			self.slideshowPreloader = new FWDSISCSlideshowPreloader(
				self, 
				self.data.slideshowPreloaderPosition,
				self.data.slideshowRadius, 
				self.data.slideshowBackgroundColor, 
				self.data.slideshowFillColor, 
				self.data.slideshowStrokeSize, 
				self.data.slideshowDelay);
			self.mainHolder_do.addChild(self.slideshowPreloader);

			FWDSISCTimerManager.setPrototype();
			self.tm = new FWDSISCTimerManager(self.data.slideshowDelay  * 1000);
			self.tm.addListener(FWDSISCTimerManager.START, self.tmStartHandler);
			self.tm.addListener(FWDSISCTimerManager.STOP, self.tmStopHandler);
			self.tm.addListener(FWDSISCTimerManager.TIME, self.tmTimeHandler);
		}

		this.tmStopHandler =  function(){
			self.slideshowPreloader.stopSlideshow();
		}

		this.tmStartHandler = function(){
			self.slideshowPreloader.show(true);
			self.slideshowPreloader.startSlideshow();
		}
		
		this.tmTimeHandler = function(){
			self.nextButtonClickHandler();
		}	
				
		this.postionSlideshowPreloader = function(){
			if(!self.slideshowPreloader) return;
			self.slideshowPreloader.positionAndResize();
		}
		
		//######################################//
		/* Position and resize */
		//######################################//
		self.resizeAndPosition = function(){
			self.areButtonsPositioned_bl = false;
			self.stageWidth = parent.stageWidth;
			self.stageHeight = parent.stageHeight;
			self.mainHolder_do.setWidth(self.stageWidth);
			self.mainHolder_do.setHeight(self.stageHeight);
			self.postionSlideshowPreloader();
			self.positionImages(false);
			this.positionCnt();
		};
		
		//##########################################//
		/* setup mobile drag */
		//##########################################//
		this.addSwipeSupport = function(){
			if(self.hasPointerEvent){
				parent.main_do.screen.addEventListener("pointerdown", self.mobileDragStartHandler);
			}else{
				parent.main_do.screen.addEventListener("touchstart", self.mobileDragStartTest);
			}
		};
		
		this.mobileDragStartTest = function(e){
			var viewportMouseCoordinates = FWDSISCUtils.getViewportMouseCoordinates(e);	
		
			self.lastPressedX = viewportMouseCoordinates.screenX;
			self.lastPressedY = viewportMouseCoordinates.screenY;
	
			window.addEventListener("touchmove", self.mobileDragMoveTest);
			window.addEventListener("touchend", self.mobileDragEndTest);
		};
		
		this.mobileDragMoveTest = function(e){
			if (e.touches.length != 1) return;
			
			self.disableThumbClick = true;
			
			var viewportMouseCoordinates = FWDSISCUtils.getViewportMouseCoordinates(e);	
			
			self.mouseX = viewportMouseCoordinates.screenX;
			self.mouseY = viewportMouseCoordinates.screenY;
			
			var angle = Math.atan2(self.mouseY - self.lastPressedY, self.mouseX - self.lastPressedX);
			var posAngle = Math.abs(angle) * 180 / Math.PI;
			
			if ((posAngle > 120) || (posAngle < 60)){
				if(e.preventDefault) e.preventDefault();
				
				self.mobileDragStartHandler(e);
				window.removeEventListener("touchmove", self.mobileDragMoveTest);
			}else{
				window.removeEventListener("touchmove", self.mobileDragMoveTest);
			}
		};
		
		this.mobileDragEndTest = function(e){
			self.disableThumbClick = false;
			
			window.removeEventListener("touchmove", self.mobileDragMoveTest);
			window.removeEventListener("touchmove", self.mobileDragMoveHandler);
			window.removeEventListener("touchend", self.mobileDragEndTest);
		};
		
		this.mobileDragStartHandler = function(e){
			var viewportMouseCoordinates = FWDSISCUtils.getViewportMouseCoordinates(e);		
			

			self.mouseX = self.lastPressedX = viewportMouseCoordinates.screenX;	
			self.lastDragNumber = 100;
			
			self.dragCurId = self.curId;

			if(self.hasPointerEvent){
				window.addEventListener("pointerup", self.mobileDragEndHandler);
				window.addEventListener("pointermove", self.mobileDragMoveHandler);
			}else if(self.isMobile){
				window.addEventListener("touchmove", self.mobileDragMoveHandler);
				window.addEventListener("touchend", self.mobileDragEndHandler);
			}
		};
		
		this.mobileDragMoveHandler = function(e){
			if(e.preventDefault) e.preventDefault();
			
			if(self.mouseX != self.lastPressedX){
				self.disableThumbClick = true;
			}
			
			var viewportMouseCoordinates = FWDSISCUtils.getViewportMouseCoordinates(e);	
			self.curDragNumber = (self.mouseX - self.lastPressedX);
			
			self.mouseX = viewportMouseCoordinates.screenX;;
			
			
			if(self.curId != self.prevCurId){
				self.gotoThumb();
			}
			self.lastDragNumber = self.curDragNumber;
			
		};

		this.mobileDragEndHandler = function(e){
			setTimeout(function(){
				self.disableThumbClick = false;
			}, 50)
			if(self.curDragNumber < 100){
				self.curId--;
			}else if(self.curDragNumber < 100){
				self.curId++;
			}
			
			if (self.curId <= 0){
				self.curId = 0;
			}else{
				self.curId = self.curId - 1;	
				self.lastPressedX = viewportMouseCoordinates.screenX;
			}	
			
			self.goToImage(self.curId);
			
			if(self.hasPointerEvent){
				window.removeEventListener("pointerup", self.mobileDragEndHandler);
				window.removeEventListener("pointermove", self.mobileDragMoveHandler);
			}else if(self.isMobile){
				window.removeEventListener("touchmove", self.mobileDragMoveHandler);
				window.removeEventListener("touchend", self.mobileDragEndHandler);
			}
		};
		
		this.removeMobileDrag = function(){
			if (self.hasPointerEvent){
				parent.main_do.screen.removeEventListener("pointerdown", self.mobileDragStartHandler);
				window.removeEventListener("pointerup", self.mobileDragEndHandler);
				window.removeEventListener("pointermove", self.mobileDragMoveHandler);
			}else if(!self.isMobile){
				parent.main_do.screen.removeEventListener("mousedown", self.mobileDragStartHandler);
				window.removeEventListener("mouseup", self.mobileDragEndHandler);
				window.removeEventListener("mousemove", self.mobileDragMoveHandler);
			}else if (window.addEventListener){
				parent.main_do.screen.removeEventListener("touchstart", self.mobileDragStartTest);
				window.removeEventListener("touchmove", self.mobileDragMoveTest);
				window.removeEventListener("touchmove", self.mobileDragMoveHandler);
				window.removeEventListener("touchend", self.mobileDragEndTest);
			}
		};
		
		
		//#####################################//
		/* Create / destory image */
		//#####################################//
		self.setupImages = function(){
			self.areimageCreated_bl = true;
			self.areButtonsPositioned_bl = false;
			self.images_ar = [];
			self.originalImages_ar = [];
			self.playlist_ar = parent.playlist_ar;
			self.totalImages = self.playlist_ar.length;
			
			this.nrThumbsToDisplay = self.defaulNrThumbsToDisplay;
			
			if(this.nrThumbsToDisplay > (Math.floor((Math.floor(self.totalImages - 1 / self.nrThumbsToDisplay))/2))){
				this.nrThumbsToDisplay = (Math.floor((Math.floor(self.totalImages - 1 / self.nrThumbsToDisplay))/2));
			}
			if(self.totalImages <3) nrThumbsToDisplay = "all";
			if(self.curId > self.totalImages-1)  self.curId = 0;
			
			for(var i=0; i<self.totalImages; i++){
				var HTMLTextAlignment_str = self.HTMLTextAlignment_str;
				if(self.playlist_ar[i].HTMLTextAlignment != undefined) HTMLTextAlignment_str = self.playlist_ar[i].HTMLTextAlignment;
				
				FWDSISCThumb.setPrototype();
				var thumb = new FWDSISCThumb(
						self,
						i, 
						self.transitionDuration,
						self.transitionType_str,
						self.animationTextType_str,
						self.showHTMLTextContent_str,
						self.HTMLTextPosition_str,
						HTMLTextAlignment_str,
						self.playlist_ar[i].source,
						self.playlist_ar[i].imageWidth,
						self.playlist_ar[i].imageHeight,
						self.imageBorderSize,
						self.imageBorderRadius,
						self.imageBackgroundColor_str,
						self.imageBorderColor_str,
						self.overlayColor_str,
						self.playlist_ar[i].description_ar,
						self.showImageReflection_bl,
						self.playlist_ar[i].link,
						self.playlist_ar[i].target,
						self.playlist_ar[i].source
						);
				self.originalImages_ar[i] = thumb;
				self.images_ar[i] = thumb;
				self.imageHolder_do.addChild(thumb);
				thumb.addListener(FWDSISCThumb.CLICK, self.onThumbImageClick);
			}
			
			if(self.nrThumbsToDisplay != "all") self.checkRightOrLeftSide();
			self.setAlpha(0);
			FWDAnimation.to(self, .8, {alpha:1, ease:Expo.easeOut});
			self.setTextType();
			if(self.showNextAndPrevButtons_bl){
				self.setupNextAndPrevButtons();
				self.hideButtons();
				setTimeout(function(){
					self.showButtons();
					self.showCnt(true);
				}, self.transitionDuration * 1000);
			}
			self.resizeAndPosition();
			self.loadImagecenterId = self.curId;
			self.loadImageRightId = self.curId + 1;
			self.loadImageleftId = self.curId - 1;
			self.loadImageCenter();
		};
		
		self.setTextType = function(textType){
			self.animationTextType_str = textType;
			for(var i=0; i<self.totalImages; i++){
				self.images_ar[i].animationTextType_str = self.animationTextType_str;
			}
		}
		
		self.onThumbImageClick = function(e){
			if(self.curId != e.id) self.goToImage(e.id);
		};
		
		
		this.goToImage = function(id){
			if(self.isStillTransitioning_bl) return;
			if(id == self.curId) return;
			
			self.cntId += id - self.curId;
			if(self.cntId < 0){
				self.cntId = self.totalImages - 1;
			}else if(self.cntId > self.totalImages - 1){
				self.cntId = 0;
			}
			self.curId = id;
			self.prevId = id;


			self.setCount(self.cntId, self.totalImages);
			
			if(self.nrThumbsToDisplay == "all"){
				self.positionImages(true);
			}else{
				self.checkRightOrLeftSide(true);
			}

			if(self.tm){
				self.tm.stop();
				setTimeout(self.tm.start, 800);
			} 
			
		}
		
		//###########################################################//
		/* Setup next and prev buttons */
		//###########################################################//
		this.setupNextAndPrevButtons = function(){
			if(self.totalImages <= 1) return;
			FWDSISCSimpleButton.setPrototype();
			this.nextButton_do = new FWDSISCSimpleButton(self, data.nextButtonN_img, data.nextButtonS_str, undefined, 
								  undefined, 
								  undefined,
								  undefined,
								  undefined,
								  'icon-right', 
								  'fwdsisc-button-normal',
								  'fwdsisc-button-selected'
								  );
			this.nextButton_do.addListener(FWDSISCSimpleButton.MOUSE_UP, self.nextButtonClickHandler);

			FWDSISCSimpleButton.setPrototype();
			this.prevButton_do = new FWDSISCSimpleButton(self, data.prevButtonN_img, data.prevButtonS_str, undefined, 
								  undefined, 
								  undefined,
								  undefined,
								  undefined,
								  'icon-left', 
								  'fwdsisc-button-normal',
								  'fwdsisc-button-selected'
								  );
			this.prevButton_do.addListener(FWDSISCSimpleButton.MOUSE_UP, self.prevButtonClickHandler);
			
			this.addChild(this.nextButton_do);
			this.addChild(this.prevButton_do);
			self.nextButton_do.hide(false);
			self.prevButton_do.hide(false);
			setTimeout(parent.addHeightIfTextIsOutside, 50);
			setTimeout(self.postionNextAndPrevButtons, 500);
		}

		self.postionNextAndPrevButtons  = function(animate){
			if(self.nextAndPrevButtonsPosition_str == "insideImage"){
				self.nextButtonX = Math.round(self.centerImage.finalX + self.centerImage.finalW - self.nextButton_do.w - self.imageBorderSize -  self.horizontalButtonsOffset);
				self.prevButtonX = Math.round(self.centerImage.finalX + self.imageBorderSize + self.horizontalButtonsOffset);
				self.buttonsY = Math.round((self.stageHeight - self.nextButton_do.h)/2);
			}else if(self.nextAndPrevButtonsPosition_str == "outsideImage"){
				self.nextButtonX = Math.round(self.centerImage.finalX + self.centerImage.finalW + self.horizontalButtonsOffset);
				self.prevButtonX = Math.round(self.centerImage.finalX - self.prevButton_do.w - self.horizontalButtonsOffset);
				self.buttonsY = Math.round((self.stageHeight - self.nextButton_do.h)/2);
			}else if(self.nextAndPrevButtonsPosition_str == "leftAndRight"){
				//var paralax_bl = parent && parent.paralax_bl;
				//var offsetY2 = (parent && parent.pageYOffset ? parent.pageYOffset/2 : 0);
				self.nextButtonX = Math.round(self.stageWidth - self.nextButton_do.w - self.horizontalButtonsOffset);
				self.prevButtonX = Math.round(self.horizontalButtonsOffset);
				self.buttonsY = Math.round((self.stageHeight - self.nextButton_do.h)/2 );
			}else if(self.nextAndPrevButtonsPosition_str == "atTheBottomOfImage"){
				self.prevButtonX = Math.round(self.stageWidth/2 - self.nextButton_do.w - self.horizontalButtonsOffset);
				self.nextButtonX = Math.round(self.stageWidth/2  + self.horizontalButtonsOffset);
				if(self.HTMLTextPosition_str == "outside"){	
					self.buttonsY = Math.round(self.centerImage.finalY + self.centerImage.finalH + self.verticalButtonsOffset + self.getTextHeight());
				}else{
					self.buttonsY = Math.round(self.centerImage.finalY + self.centerImage.finalH + self.verticalButtonsOffset);
				}
			}

			if(animate){
				FWDAnimation.to(self.nextButton_do, self.transitionDuration, {x:self.nextButtonX, y:self.buttonsY, ease:Expo.easeInOut});
				FWDAnimation.to(self.prevButton_do, self.transitionDuration, {x:self.prevButtonX, y:self.buttonsY, ease:Expo.easeInOut});
			}else{

				self.nextButton_do.setX(self.nextButtonX);
				self.nextButton_do.setY(self.buttonsY);
				self.prevButton_do.setX(self.prevButtonX);
				self.prevButton_do.setY(self.buttonsY);
			}
		}
		
		this.nextButtonClickHandler = function(e){
			var id = self.curId;
			
			if (id < self.totalImages-1){
				id += self.howManyImagesToSkipOnNextAndPrevButtons;
				if(id > self.totalImages - 1 && self.defaulNrThumbsToDisplay == "all") id = 0;
			}else{
				id = 0;
			}
			self.goToImage(id);
		}
		
		this.prevButtonClickHandler = function(e){
			var id = self.curId;
			
			if (id > 0){
				id -= self.howManyImagesToSkipOnNextAndPrevButtons;
				if(id < 0 && self.defaulNrThumbsToDisplay == "all") id = self.totalImages - 1;
			}else{
				id = self.totalImages-1;
			}
			self.goToImage(id);
		}

		//##########################################################//
		/* Add drag support */
		//##########################################################//
		this.addDragSupport = function(){
			if(self.totalImages <= 1) return;
			self.dum_do = new FWDSISCDisplayObject("div");
			//self.dum_do.getStyle().backgroundColor = "#FF0000";
			self.dum_do.screen.style.cursor = "grabbing";
			parent.main_do.addChild(self.dum_do);
			if(self.hasPointerEvent_bl){
				parent.main_do.screen.addEventListener("pointerdown", self.dragStart);
			}else if(!self.isMobile_bl){
				parent.main_do.screen.addEventListener("mousedown", self.dragStart);
			}else{
				parent.main_do.screen.addEventListener("touchstart", self.dragStart);
			}
			
			parent.main_do.screen.style.cursor = "grab";
			self.screen.style.cursor = "grab";
		}
		

		this.dragStart = function(e){
			//if(FWDAnimation.isTweening(self.imageHolder_do)) return;
	
			FWDAnimation.killTweensOf(self.imageHolder_do)
			var viewportMouseCoordinates = FWDSISCUtils.getViewportMouseCoordinates(e);	
		
			self.isHorizontal = undefined;
			self.holderX = self.imageHolder_do.x;
			self.lastPressedX = viewportMouseCoordinates.screenX;
			self.lastPressedY = viewportMouseCoordinates.screenY;
			if(self.hasPointerEvent_bl){
				window.addEventListener("pointermove", self.dragMove);
				window.addEventListener("pointerup", self.dragUp);
			}else if(!self.isMobile_bl){
				window.addEventListener("mousemove", self.dragMove);
				window.addEventListener("mouseup", self.dragUp);
			}else{
				window.addEventListener("touchmove", self.dragMove, { passive:false });
				window.addEventListener("touchend", self.dragUp);
			}
			
		}

		this.dragMove =  function(e){
			var viewportMouseCoordinates = FWDSISCUtils.getViewportMouseCoordinates(e);	
			
			self.mouseX = viewportMouseCoordinates.screenX;
			self.mouseY = viewportMouseCoordinates.screenY;
			var angle = Math.atan2(self.mouseY - self.lastPressedY, self.mouseX - self.lastPressedX);
			var posAngle = Math.abs(angle) * 180 / Math.PI;
			var difX = Math.abs(self.mouseX - self.lastPressedX);
			
			if(self.isHorizontal ==  undefined){
				if(e && e.preventDefault) e.preventDefault();
				if(difX > 1){
					if ((posAngle > 120) || (posAngle < 60)){
						self.isHorizontal = "yes";
					}else{
						self.isHorizontal =  "no";
					}
				}
				
			}
			if(self.tm){
					self.tm.stop();
					self.slideshowPreloader.reset();
				} 
			
			if(self.isHorizontal == "yes"){
				if(e && e.preventDefault) e.preventDefault();
				self.dum_do.setWidth(self.stageWidth);
				self.dum_do.setHeight(self.stageHeight);
				self.dif = self.lastPressedX - viewportMouseCoordinates.screenX;
				
				if(self.lastPressedX - viewportMouseCoordinates.screenX > 0){
					self.dir = "left";
				}else if( self.lastPressedX - viewportMouseCoordinates.screenX < 0){
					self.dir = "right";
				}
				self.imageHolder_do.setX(self.holderX + self.dif * -1);
			}
		}

		this.dragUp = function(e){
			setTimeout(function(){
				self.dum_do.setWidth(0);
				self.dum_do.setHeight(0);
			},50);

			var id = self.curId;
			var image;

			if(self.dir){
				if(self.dir == "left"){
					var addToId = -1;
					for(var i=self.curId; i<self.totalImages; i++){
						image = self.images_ar[i];
						if(image.getGlobalX() < self.stageWidth/2){
							addToId ++;
						}
					}
					if(addToId == 0) addToId ++;
					id += addToId;
					
				}else{
					var addToId = -1;
					for(var i=self.curId; i>=0; i--){
						image = self.images_ar[i];
						if(image.getGlobalX() + image.w > self.stageWidth/2){
							addToId ++;
						}
					}
					if(addToId == 0) addToId ++;
					id -= addToId;
				}

				self.transitionDuration = .4;
				for(var i=0; i<self.images_ar.length; i++){
					self.images_ar[i].transitionDuration = .4;
					self.images_ar[i].transitionType_str = "Quint.easeOut";
				}
				self.goToImage(id);
				

				FWDAnimation.to(self.imageHolder_do, self.transitionDuration, {x:0, ease:"Quint.easeOut", onComplete:self.imageOnComplete});

				for(var i=0; i<self.images_ar.length; i++){
					self.images_ar[i].transitionDuration = self.defaultTransitionDuration;
					self.images_ar[i].transitionType_str = self.defaultTransitionType;
				}
			}
			self.dir = undefined;
			if(self.hasPointerEvent_bl){
				window.removeEventListener("pointermove", self.dragMove);
				window.removeEventListener("pointerup", self.dragUp);
			}else if(!self.isMobile_bl){
				window.removeEventListener("mousemove", self.dragMove);
				window.removeEventListener("mouseup", self.dragUp);
			}else{
				window.removeEventListener("touchmove", self.dragMove);
				window.removeEventListener("touchend", self.dragUp);
			}
		}
		
		//##########################################################//
		/* Position image */
		//##########################################################//
		this.positionImages = function(animate){
			if(!self.images_ar) return;

			var image;
			self.nextButtonX = 0;
			self.prevButtonX = 0;
			self.buttonsY = 0;
			var prevImage;
			var scale = 1;
			
			var removeFromSize = 0;
			if(parent.displayType == FWDSISC.FLUID_WIDTH_AND_HEIGHT) removeFromSize = parent.sliderOffsetTopAndBottom * 2;

			self.centerImage = self.images_ar[self.curId];
		
			if(data.maxImageHeight == 'fullscreen'){
				self.imageHolder_do.removeChild(self.centerImage);
				self.imageHolder_do.addChild(self.centerImage);
				scaleX = self.stageWidth/self.centerImage.imageW;
				scaleY = self.stageHeight/self.centerImage.imageH;
				totalScale = 0;
				if(scaleX >= scaleY){
					scale = scaleX;
				}else if(scaleX <= scaleY){
					scale = scaleY;
				}
			}else{
				scale = self.getScale(self.stageWidth, Math.min(self.stageHeight, self.maxCenterImageHeight), self.centerImage.imageW, self.centerImage.imageH);
			}
			
			self.centerImage.scale = scale;
			self.centerImage.finalScaledW = Math.round((self.centerImage.imageW - removeFromSize) * self.getScale(self.stageWidth, self.stageHeight, self.centerImage.imageW, self.centerImage.imageH));
			self.centerImage.finalScaledH = Math.round((self.centerImage.imageH - removeFromSize) * self.getScale(self.stageWidth, self.stageHeight, self.centerImage.imageW, self.centerImage.imageH));
			if(data.maxImageHeight == 'fullscreen'){
				self.centerImage.imageFinalW = Math.round(((self.centerImage.imageW - removeFromSize) * scale));
				self.centerImage.imageFinalH = Math.round(((self.centerImage.imageH - removeFromSize) * scale));
				self.centerImage.finalW = self.stageWidth;
				self.centerImage.finalH = self.stageHeight;
			}else{
				self.centerImage.finalW = Math.round(((self.centerImage.imageW - removeFromSize) * scale));
				self.centerImage.finalH = Math.round(((self.centerImage.imageH - removeFromSize) * scale));
			}
			self.centerImage.finalX = Math.round((self.stageWidth - self.centerImage.finalW)/2);
			self.centerImage.finalY = Math.round((self.stageHeight - self.centerImage.finalH)/2);
			self.centerImage.isSelected_bl = false;
			self.centerImage.finalAlpha = 1;
			
			
			for(var i=self.curId - 1; i>=0; i--){
				prevImage = self.images_ar[i + 1];
				image = self.images_ar[i];
				if(data.maxImageHeight == 'fullscreen'){
					scaleX = self.stageWidth/image.imageW;
					scaleY = self.stageHeight/image.imageH;
					totalScale = 0;
					if(scaleX >= scaleY){
						scale = scaleX;
					}else if(scaleX <= scaleY){
						scale = scaleY;
					}
				}else{
					scale = self.getScale(self.stageWidth, Math.min(self.stageHeight, self.maxImageHeight), image.imageW, image.imageH);
				}

				image.finalScaledW =  Math.round((image.imageW - removeFromSize) * self.getScale(self.stageWidth, self.stageHeight, image.imageW, image.imageH));
				image.finalScaledH = Math.round((image.imageH - removeFromSize) * self.getScale(self.stageWidth, self.stageHeight, image.imageW, image.imageH));
				image.scale = scale;
				if(data.maxImageHeight == 'fullscreen'){
					image.imageFinalW = Math.round((image.imageW - removeFromSize) * scale);
					image.imageFinalH = Math.round((image.imageH - removeFromSize) * scale);
					image.finalW = self.stageWidth;
					image.finalH = self.stageHeight;
				}else{
					image.finalW = Math.round((image.imageW - removeFromSize) * scale);
					image.finalH = Math.round((image.imageH - removeFromSize) * scale);
				}

				image.finalX = Math.round(prevImage.finalX - image.finalW - self.spaceBetweenImages);
				image.finalY = Math.round((self.stageHeight - image.finalH)/2);
				image.finalAlpha = 1;
				if(self.nrThumbsToDisplay != "all"){
					if(self.curId  - i == self.nrThumbsToDisplay + 1 && self.totalImages > 2){
						if(prevImage.finalX > 0) image.finalX = -image.finalW;
						//image.finalAlpha = 0;
					}
				}
			}
			
			for(var i=self.curId + 1; i<self.totalImages; i++){

				prevImage = self.images_ar[i - 1];
				image = self.images_ar[i];
				if(data.maxImageHeight == 'fullscreen'){
					scaleX = self.stageWidth/image.imageW;
					scaleY = self.stageHeight/image.imageH;
					totalScale = 0;
					if(scaleX >= scaleY){
						scale = scaleX;
					}else if(scaleX <= scaleY){
						scale = scaleY;
					}
				}else{
					scale = self.getScale(self.stageWidth, Math.min(self.stageHeight, self.maxImageHeight), image.imageW, image.imageH);
				}


				image.finalScaledW =  Math.round((image.imageW - removeFromSize) * self.getScale(self.stageWidth, self.stageHeight, image.imageW, image.imageH));
				image.finalScaledH = Math.round((image.imageH - removeFromSize) * self.getScale(self.stageWidth, self.stageHeight, image.imageW, image.imageH));
				image.scale = scale;
				if(data.maxImageHeight == 'fullscreen'){
					image.imageFinalW = Math.round((image.imageW - removeFromSize) * scale);
					image.imageFinalH = Math.round((image.imageH - removeFromSize) * scale);
					image.finalW = self.stageWidth;
					image.finalH = self.stageHeight;
				}else{
					image.finalW = Math.round((image.imageW - removeFromSize) * scale);
					image.finalH = Math.round((image.imageH - removeFromSize) * scale);
				}
				image.finalX = Math.round(prevImage.finalX + prevImage.finalW + self.spaceBetweenImages);
				image.finalY = Math.round((self.stageHeight - image.finalH)/2);
				image.finalAlpha = 1;

				if(self.nrThumbsToDisplay != "all"){
					if(i - self.curId == self.nrThumbsToDisplay + 1 && self.totalImages > 2){
						if(prevImage.finalX + prevImage.finalW < self.stageWidth)  image.finalX = self.stageWidth;	
						//image.finalAlpha = 0;
					}
				}
			}

			if(self.displayVertical_bl){
				for(var i=0; i<self.totalImages; i++){
					image = self.images_ar[i];
					
					scaleX = self.stageWidth/image.imageW;
					scale = scaleX;
				
					image.finalScaledW =  self.stageWidth;
				
					image.finalScaledH = Math.round((image.imageH - removeFromSize) * scale);
					image.scale = scale;
					
					image.imageFinalW = Math.round((image.imageW - removeFromSize) * scale);
					image.imageFinalH = Math.round((image.imageH - removeFromSize) * scale);

					image.finalW = Math.round((image.imageW - removeFromSize) * scale);
					image.finalH = Math.round((image.imageH - removeFromSize) * scale);
					
					image.finalX = 0;
					image.finalY = Math.round((i - image.finalH));
					image.finalAlpha = 1;
				}
			}


			var totalH = 0;
			for(var i=0; i<self.totalImages; i++){
				image = self.images_ar[i];
				if(self.displayVertical_bl){
					image.finalX = 0;
					if(i == 0){
						image.finalY = 0;
					}else{
						image.finalY = self.images_ar[i-1].finalY + self.images_ar[i-1].finalH;
						
					}
					totalH += image.finalH;
				}
				//if(image.finalX > self.stageWidth || image.finalX + image.finalW < 0) image.finalAlpha = 0;
				image.resizeImage(animate);
			}

			if(self.displayVertical_bl){
				parent.setFinalHeight(totalH);
			}
			
			self.loadImageRight();
			self.loadImageleft();
			self.getTextHeight();
			
			if(self.nextButton_do){
				self.postionNextAndPrevButtons(animate);
			}
			
			if(animate){
				self.isStillTransitioning_bl = true;
				self.transitionFinishedId_to = setTimeout(function(){
					self.isStillTransitioning_bl = false;
					
				}, self.transitionDuration * 1000);
				
				parent.addHeightIfTextIsOutside(true);
			}else{
				self.isStillTransitioning_bl = false;
				clearTimeout(self.transitionFinishedId_to);
				
				parent.addHeightIfTextIsOutside(false);
			}
			
			self.animateTextContent(animate);
		}
		
		this.animateTextContent = function(animate){
			for(var i=0; i<self.totalImages; i++){
				self.images_ar[i].animateTextContent(animate);
			}
		}
		
		this.checkRightOrLeftSide = function(){
			
			if(self.nrThumbsToDisplay != "all"){
				var countIndexShift = 0;
				var prevImage;
				var side;
				for(var i=self.totalImages - 1; i>self.totalImages - (self.nrThumbsToDisplay - self.curId + 1); i--){	
					side = "left";
					var splicedImage = self.images_ar.splice(self.totalImages - 1, 1)[0];
					splicedImage.finalAlpha =0;
					self.images_ar.splice(0, 0, splicedImage);
					prevImage = self.images_ar[1];
					
					splicedImage.finalX = Math.round(prevImage.finalX - splicedImage.finalW - self.spaceBetweenImages);
					if(splicedImage.finalX > -splicedImage.finalW){
						splicedImage.finalX = -splicedImage.finalW;
						//splicedImage.setAlpha(0);
					}
					
					splicedImage.setX(splicedImage.finalX);
					
					countIndexShift++;	
				}
				
				
				for(var i=self.curId; i>self.totalImages - self.nrThumbsToDisplay - 1; i--){
					side = "right";
					var splicedImage = self.images_ar.splice(0, 1)[0];
					splicedImage.finalAlpha =0;
					self.images_ar.splice(self.totalImages-1, 0, splicedImage);
					prevImage = self.images_ar[self.totalImages-2];
				
					splicedImage.finalX = Math.round(prevImage.finalX + prevImage.finalW + self.spaceBetweenImages);
					if(splicedImage.finalX < self.stageWidth){
						splicedImage.finalX = self.stageWidth;
						//splicedImage.setAlpha(0);
					}
					
					splicedImage.setX(splicedImage.finalX);
					
					prevImage = splicedImage;
					countIndexShift++;			
				}
				
				
				for(var i=0; i<self.totalImages; i++){
					self.images_ar[i].id = i;
				}
				
				if(side == "left"){	
					self.curId += countIndexShift;
				}else if(side == "right"){
					self.curId -= countIndexShift;
				}
			
			}
			
			self.positionImages(true);
		}
		
		this.getScale = function(containerW, containerH, width, height){
			var totalScale;
			var scaleX = containerW/width;
			var scaleY = containerH/height;
			var totalScale = 0;
			if(scaleX <= scaleY){
				totalScale = scaleX;
			}else if(scaleX >= scaleY){
				totalScale = scaleY;
			}
			//if(scaleX >= 1 && scaleY >=1) totalScale = 1;
			
			return totalScale;
		};
		
		this.getTextHeight = function(){
			return self.images_ar[self.curId].getTextHeight();
		}
		
		//########################################//
		/* Load images */
		//########################################//
		self.loadImageCenter = function(){
			clearTimeout(self.loadImagecenter_to);
			self.loadedImagecenter = self.images_ar[self.loadImagecenterId];
			self.imagecenter_img = new Image();
			self.imagecenter_img.onerror = self.onimageLoadcenterError;
			self.imagecenter_img.onload = self.onimageLoadcenterComplete;
			self.imagecenter_img.src = self.loadedImagecenter.source;
		};
	
		self.onimageLoadcenterError = function(){
			var error = "Error loading image <font color='#FF0000'>" + self.playlist_ar[self.loadImagecenterId].source + "</font>."
			self.dispatchEvent(FWDSISC.ERROR, {text:error});
		}
		
		self.onimageLoadcenterComplete = function(e){
			self.loadedImagecenter.setImage(self.imagecenter_img);
			self.loadedImagecenter.hasImage_bl = true;
			self.loadImageRight();
			self.loadImageleft();
			if(self.tm){
				setTimeout(function(){
					self.tm.start();
				}, 1200);
			}
			parent.startStopSlideshowBasedOnVisiblity();
			self.animateTextContent(true);
		};
		
		
		self.loadImageleft = function(){
			clearTimeout(self.loadImageleft_to);
			self.loadedImageleft = self.images_ar[self.loadImageleftId];
			if(!self.loadedImageleft) return;
			if(self.loadedImageleft.hasImage_bl){
				self.loadImageleftId ++;
				self.loadImageleft();
			}
			self.imageleft_img = new Image();
			self.imageleft_img.onerror = self.onimageLoadleftError;
			self.imageleft_img.onload = self.onimageLoadleftComplete;
			self.imageleft_img.src = self.loadedImageleft.source;
		};
	
		self.onimageLoadleftError = function(){
			self.loadImageleftId --;
			self.loadImageleft_to = setTimeout(self.loadImageleft, 100);
			
		}
		
		self.onimageLoadleftComplete = function(e){
			self.loadedImageleft.setImage(self.imageleft_img);
			self.loadedImageleft.hasImage_bl = true;
			self.loadImageleftId --;
			self.loadImageleft_to = setTimeout(self.loadImageleft, 100);
		};
		
		
		self.loadImageRight = function(){
			clearTimeout(self.loadImageRight_to);
			self.loadedImageRight = self.images_ar[self.loadImageRightId];
			if(!self.loadedImageRight) return;
			if(self.loadedImageRight.hasImage_bl){
				self.loadImageRightId ++;
				self.loadImageRight();
			}

			self.imageRight_img = new Image();
			self.imageRight_img.onerror = self.onimageLoadRightError;
			self.imageRight_img.onload = self.onimageLoadRightComplete;
			self.imageRight_img.src = self.loadedImageRight.source;
		};
	
		self.onimageLoadRightError = function(){
			self.loadImageRightId ++;
			self.loadImageRight_to = setTimeout(self.loadImageRight, 100);
			
		}
		
		self.onimageLoadRightComplete = function(e){
			self.loadedImageRight.setImage(self.imageRight_img);
			self.loadedImageRight.hasImage_bl = true;
			self.loadImageRightId ++;
			self.loadImageRight_to = setTimeout(self.loadImageRight, 100);
		};
		
	
		self.stopToLoadThumbanils = function(){
			if(self.imageRight_img){
				self.imageRight_img.onload = null;
				self.imageRight_img.onerror = null;
				self.imageRight_img.src = "";
				self.imageRight_img = null;
			}
			clearTimeout(self.loadWithDelayId_to);
		};
		
		self.thumbClickHandler = function(e){
			//if(!parent.isShowed_bl) return;
			self.dispatchEvent(FWDSISCThumb.CLICK, {id:e.id});
		};
		
		self.thumbHoverHandler = function(){
			//if(!parent.isShowed_bl) return;
			self.addDesktopScrollSupport();
		};
		
		this.showButtons = function(){
			if(!self.nextButton_do || self.areButtonsShowed_bl) return;
			self.areButtonsShowed_bl = true;
			self.nextButton_do.show(true);
			self.prevButton_do.show(true);
			/*
			
				FWDAnimation.killTweensOf(self.nextButton_do.n_sdo);
				FWDAnimation.killTweensOf(self.nextButton_do.s_sdo);
				FWDAnimation.killTweensOf(self.prevButton_do.n_sdo);
				FWDAnimation.killTweensOf(self.prevButton_do.s_sdo);
				
				//self.nextButton_do.n_sdo.setAlpha(1);
				FWDAnimation.to(self.nextButton_do.n_sdo, .8, {x:0, delay:.2, ease:Expo.easeInOut});
				FWDAnimation.to(self.nextButton_do.s_sdo, .8, {x:0, ease:Expo.easeInOut});
			
				//self.prevButton_do.n_sdo.setAlpha(1);
				FWDAnimation.to(self.prevButton_do.n_sdo, .8, {x:0, delay:.2, ease:Expo.easeInOut});
				FWDAnimation.to(self.prevButton_do.s_sdo, .8, {x:0, ease:Expo.easeInOut});
			*/
		}
		
		this.hideButtons = function(animate){
			if(!self.nextButton_do || !self.areButtonsShowed_bl) return;
			self.areButtonsShowed_bl = false;
			self.nextButton_do.hide(true);
			self.prevButton_do.hide(true);
			/*
			FWDAnimation.killTweensOf(self.nextButton_do.n_sdo);
			FWDAnimation.killTweensOf(self.nextButton_do.s_sdo);
			FWDAnimation.killTweensOf(self.prevButton_do.n_sdo);
			FWDAnimation.killTweensOf(self.prevButton_do.s_sdo);
			if(animate){
				
				FWDAnimation.to(self.nextButton_do.n_sdo, .8, {x:self.nextButton_do.w, ease:Expo.easeInOut});
				FWDAnimation.to(self.nextButton_do.s_sdo, .8, {x:self.nextButton_do.w, delay:.2, ease:Expo.easeInOut});
				
				FWDAnimation.to(self.prevButton_do.n_sdo, .8, {x:-self.nextButton_do.w, ease:Expo.easeInOut});
				FWDAnimation.to(self.prevButton_do.s_sdo, .8, {x:-self.nextButton_do.w, delay:.2, ease:Expo.easeInOut});
			}else{
				self.nextButton_do.n_sdo.setX(self.nextButton_do.w);
				self.nextButton_do.s_sdo.setX(self.nextButton_do.w);
				self.prevButton_do.n_sdo.setX(-self.nextButton_do.w);
				self.prevButton_do.s_sdo.setX(-self.nextButton_do.w);
			}*/
		}
		
		
		self.init();
	};
		
	/* set prototype */
	FWDSISCImageManager.setPrototype = function(){
		FWDSISCImageManager.prototype = new FWDSISCDisplayObject("div", "relative");
	};
	
	
	FWDSISCImageManager.prototype = null;
	window.FWDSISCImageManager = FWDSISCImageManager;
}(window));