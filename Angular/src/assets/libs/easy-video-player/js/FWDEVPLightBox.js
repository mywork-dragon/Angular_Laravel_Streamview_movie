/* FWDEVPLightBox */
(function (window){
	
	var FWDEVPLightBox = function(
			parent,
			mainBackgroundColor_str,
			holderBackgroundColor_str,
			lightBoxBackgroundOpacity,
			lightBoxWidth,
			lightBoxHeight
		){
		
		var self  = this;
		var prototype = FWDEVPLightBox.prototype;

		this.mainLightBox_do = null;
		this.lightBoxBackground_sdo = null;
		this.lightBoxGridHolder_do = null;
		this.closeButton_do = null;
		
		this.mainBackgroundColor_str = mainBackgroundColor_str;
		this.holderBackgroundColor_str = holderBackgroundColor_str;
		
		this.lightBoxBackgroundOpacity = lightBoxBackgroundOpacity;
		this.lightBoxWidth = lightBoxWidth;
		this.lightBoxHeight = lightBoxHeight;
		
		this.setupButtonWithDelayId_to;
		
		this.isMobile_bl = FWDEVPUtils.isMobile;
		this.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
		this.closeButtonIsTweening_bl = true;
	
		this.init = function(){
			self.getStyle().zIndex = 9999999;
			self.setupMainContainers();
		};
		
		//#############################################//
		/* setup main containers */
		//#############################################//
		this.setupMainContainers = function(){
			
			if(self.isMobile_bl && self.hasPointerEvent_bl) self.getStyle().msTouchAction = "none";
			
			self.lightBoxBackground_sdo = new FWDEVPDisplayObject("div"); 
			self.lightBoxBackground_sdo.setResizableSizeAfterParent();
			self.lightBoxBackground_sdo.setBkColor(self.mainBackgroundColor_str);
			self.lightBoxBackground_sdo.screen.addEventListener('click', self.closeButtonOnStartHandler);
			self.addChild(self.lightBoxBackground_sdo);
			
			self.mainLightBox_do = new FWDEVPDisplayObject("div");
			//self.mainLightBox_do.getStyle().boxShadow = "0px 0px 5px #999999";
			self.mainLightBox_do.setBkColor(self.holderBackgroundColor_str);
			self.mainLightBox_do.setWidth(1);
			self.mainLightBox_do.setHeight(1);

			self.addChild(self.mainLightBox_do);
			
			document.documentElement.appendChild(self.screen);

			
			self.setX(-10000);
			self.setY(-10000);
			self.setWidth(0);
			self.setHeight(0);
		};
		
		this.show = function(){
			if(self.isShowed_bl) return;
			self.isShowed_bl = true;
			if(self.closeButton_do){
				self.hideCloseButton(false);
				self.showCloseButton(true);
				self.closeButton_do.setX(-200);
			}else{
				self.loadClsoeButtonImage();
			}
			
			var viewportSize = FWDEVPUtils.getViewportSize();
			var scrollOffsets = FWDEVPUtils.getScrollOffsets();
			
			self.setWidth(viewportSize.w);
			self.setHeight(viewportSize.h);
			self.setX(scrollOffsets.x);
			self.setY(scrollOffsets.y);
			
			self.lightBoxBackground_sdo.setAlpha(0);
			FWDAnimation.to(self.lightBoxBackground_sdo, .8, {alpha:self.lightBoxBackgroundOpacity});
			self.setX(scrollOffsets.x);
			self.setY(scrollOffsets.y);
			
			self.mainLightBox_do.setX(parseInt(viewportSize.w/2));
			self.mainLightBox_do.setY(parseInt(viewportSize.h/2));
			
			if(self.lightBoxWidth > viewportSize.w){
				self.finalLightBoxWidth = viewportSize.w;
				self.finalLightBoxHeight = parseInt(self.lightBoxHeight * (viewportSize.w/self.lightBoxWidth));
			}else{
				self.finalLightBoxWidth = self.lightBoxWidth;
				self.finalLightBoxHeight = self.lightBoxHeight;
			}
			
			FWDAnimation.to(self.mainLightBox_do, .8, {
				w:self.finalLightBoxWidth, 
				h:self.finalLightBoxHeight,
				x:parseInt((viewportSize.w - self.finalLightBoxWidth)/2),
				y:parseInt((viewportSize.h - self.finalLightBoxHeight)/2),
				delay:.4,
				onComplete:self.showComplete,
				ease:Expo.easeInOut});
				
			parent.stageContainer = self.mainLightBox_do.screen;
			if(parent.main_do){
				parent.main_do.setX(-5000);
				if(!parent.stageContainer.contains(parent.main_do.screen)) parent.stageContainer.appendChild(parent.main_do.screen);
			}
			self.dispatchEvent(FWDEVPLightBox.SHOW);
		}
		
		this.showComplete = function(){
			self.closeButton_do.addListener(FWDEVPSimpleButton.MOUSE_UP, self.closeButtonOnStartHandler);
			self.addKeyboardSupport();
			parent.startResizeHandler();
			self.showComplete_bl = true;
		}
		
		
		//####################################//
		/* Add keyboard support */
		//#####################################//
		this.addKeyboardSupport = function(){
			document.addEventListener("keydown",  this.onKeyDownHandler);	
		}
		
		this.onKeyDownHandler = function(e){
			if(e.keyCode == 27) self.closeButtonOnStartHandler();
		}
		
		//#############################################//
		/* setup lightbox close button */
		//#############################################//
		this.loadClsoeButtonImage = function(){
			self.closeN_img = new Image();
			self.closeN_img.onload = self.setupCloseButton;
			self.closeN_img.src = parent.mainFolderPath_str + parent.skinPath_str + "embed-close-button.png";
			self.closeSPath_str = parent.mainFolderPath_str + parent.skinPath_str + "embed-close-button-over.png";
		}
		
		this.setupCloseButton = function(e){
			var viewportSize = FWDEVPUtils.getViewportSize();
			FWDEVPSimpleButton.setPrototype();
			self.closeButton_do = new FWDEVPSimpleButton(self.closeN_img, self.closeSPath_str, undefined, true);
			
			self.hideCloseButton(false);
			self.showCloseButton(true);
			self.closeButton_do.setX(viewportSize.w - self.closeButton_do.w - 4);
			self.closeButton_do.setY(4);
			self.addChild(self.closeButton_do);
		};
		
		this.showCloseButtonComplete = function(){
			self.closeButtonIsTweening_bl = false;
		}
		
		this.hideCloseButton = function(animate){
			FWDAnimation.killTweensOf(self.closeButton_do);
			if(!animate){
				self.closeButton_do.setAlpha(0);
			}else{
				FWDAnimation.to(self.closeButton_do, .9, {alpha:0});	
			}
		}
		
		this.showCloseButton = function(animate){
			
			FWDAnimation.killTweensOf(self.closeButton_do);
			if(!animate){
				self.closeButton_do.setAlpha(1);
			}else{
				FWDAnimation.to(self.closeButton_do, .9, {alpha:1, delay:.8});	
			}
		}
		
		
		this.mouseDummyHandler = function(e){
			if(e.preventDefault){
				e.preventDefault();
			}else{
				return false;
			}
		};
			
		this.closeButtonOnStartHandler = function(e){
			if(!self.isShowed_bl || !self.showComplete_bl) return;
			self.isShowed_bl = false;
			var viewportSize = FWDEVPUtils.getViewportSize();
			
			self.closeButton_do.removeListener(FWDEVPSimpleButton.MOUSE_UP, self.closeButtonOnStartHandler);
			
			FWDAnimation.to(self.closeButton_do, .9, {alpha:0});
			
			FWDAnimation.to(self.mainLightBox_do, .8, {
				w:0, 
				h:0,
				x:parseInt(viewportSize.w/2),
				y:parseInt(viewportSize.h/2),
				delay:.4,
				ease:Expo.easeInOut});
			
			FWDAnimation.to(self.lightBoxBackground_sdo, .8, {alpha:0, delay:.8});
			FWDAnimation.to(parent.main_do, .8, {x:-parent.main_do.w/2, y:-parent.main_do.h/2 , ease:Expo.easeInOut, delay:.4});
			self.lighboxAnimDoneId_to = setTimeout(self.lighboxHideAnimationDone, 1600);
			
			
			self.dispatchEvent(FWDEVPLightBox.CLOSE);
		};
		
		this.lighboxHideAnimationDone = function(){
			self.setX(-10000);
			self.setY(-10000);
			self.setWidth(0);
			self.setHeight(0);
			self.dispatchEvent(FWDEVPLightBox.HIDE_COMPLETE);
		};
		
		
		this.init();
	};
	
	/* set prototype */
    FWDEVPLightBox.setPrototype = function(){
    	FWDEVPLightBox.prototype = new FWDEVPDisplayObject("div");
    };
    
    FWDEVPLightBox.CLOSE = "ligtBoxClose";
    FWDEVPLightBox.SHOW = "show";
    FWDEVPLightBox.HIDE_COMPLETE = "hideComplete";
    
    FWDEVPLightBox.prototype = null;
	window.FWDEVPLightBox = FWDEVPLightBox;
}(window));