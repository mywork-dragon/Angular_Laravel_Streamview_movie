/* Context menu */
(function (){
	var FWDEVPOpener = function(parent, data, position_str, playerIsShowed_bl){
		
		var self = this;
		
		this.animation_img = data.openerAnimation_img;
		
		if(position_str ==  FWDEVPlayer.POSITION_TOP){
			this.openN_img = data.openTopN_img;
			this.openSPath_str = data.openTopSPath_str;		
		}else{
			this.openN_img = data.openBottomN_img;
			this.openSPath_str = data.openBottomSPath_str;
		}
	
		this.openerPauseN_img = data.openerPauseN_img;
		this.openerPlayN_img = data.openerPlayN_img;
		this.closeN_img = data.closeN_img;
		
		self.useHEXColorsForSkin_bl = data.useHEXColorsForSkin_bl; 
		self.normalButtonsColor_str = data.normalButtonsColor_str;
		self.selectedButtonsColor_str = data.selectedButtonsColor_str;
		
		this.openerPauseS_str = data.openerPauseS_str;
		this.openerPlaySPath_str = data.openerPlayS_str;
		this.closeSPath_str = data.closeSPath_str;
		this.animationPath_img = data.animationPath_img;
		
		this.totalWidth = self.openN_img.width;
		this.totalHeight = self.openN_img.height;
	
		this.mainHolder_do = null;
		this.dumy_do = null;
		this.openN_do = null;
		this.openS_do = null;
		this.closeN_do = null;
		this.closeS_do = null;
		this.animation_do = null;
		this.playPauseButton_do = null;
		
		this.position_str = position_str;
		this.alignment_str = data.openerAlignment_str;
		
		this.openerEqulizerOffsetLeft = data.openerEqulizerOffsetLeft; 
		this.openerEqulizerOffsetTop = data.openerEqulizerOffsetTop;
		
		this.showFirstTime_bl = true;
		this.playerIsShowed_bl = playerIsShowed_bl;
		this.showOpenerPlayPauseButton_bl = data.showOpenerPlayPauseButton_bl;
		this.isMobile_bl = FWDEVPUtils.isMobile;
		this.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
		
		this.init = function(){
			if(data.skinPath_str.indexOf("hex_white") != -1){
				self.selectedButtonsColor_str = "#FFFFFF";
			}else{
				self.selectedButtonsColor_str = data.selectedButtonsColor_str;
			}
			self.hasTransform3d_bl = false;
			self.hasTransform2d_bl = false;
			self.setBackfaceVisibility();
			self.getStyle().msTouchAction = "none";
			self.getStyle().webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
			self.setupStuff();
			if(self.showOpenerPlayPauseButton_bl) self.setupPlayPauseButton();
		
			if(self.playerIsShowed_bl) self.showCloseButton();
			if(self.showOpenerPlayPauseButton_bl){
				self.setWidth(self.totalWidth + self.openerPauseN_img.width + 1);
			}else{
				self.setWidth(self.totalWidth);
			}
			self.setHeight(self.totalHeight);
		};
	
		//######################################//
		/* setup main stuff */
		//######################################//
		this.setupStuff = function(e){
			self.mainHolder_do = new FWDEVPDisplayObject("div");
			self.mainHolder_do.hasTransform3d_bl = false;
			self.mainHolder_do.hasTransform2d_bl = false;
			self.mainHolder_do.setBackfaceVisibility();
			
			if(self.showOpenerPlayPauseButton_bl){
				self.mainHolder_do.setWidth(self.totalWidth + self.openerPauseN_img.width + 1);
			}else{
				self.mainHolder_do.setWidth(self.totalWidth);
			}
			self.mainHolder_do.setHeight(self.totalHeight);
			
			if(self.useHEXColorsForSkin_bl){
				self.openN_do = new FWDEVPDisplayObject("div");
				self.openN_canvas = FWDEVPUtils.getCanvasWithModifiedColor(self.openN_img, self.normalButtonsColor_str).canvas;
				self.openN_do.screen.appendChild(self.openN_canvas);
			}else{
				self.openN_do = new FWDEVPDisplayObject("img");
				self.openN_do.setScreen(self.openN_img);
			}
			self.openN_do.setWidth(self.openN_img.width);
			self.openN_do.setHeight(self.openN_img.height);
			
			
			self.openS_img = new Image();
			self.openS_img.src = self.openSPath_str;	
			if(self.useHEXColorsForSkin_bl){
				self.openS_do = new FWDEVPDisplayObject("div");
				self.openS_img.onload = function(){		
					self.openS_canvas = FWDEVPUtils.getCanvasWithModifiedColor(self.openS_img, self.selectedButtonsColor_str).canvas;
					self.openS_do.setWidth(self.openS_img.width);
					self.openS_do.setHeight(self.openS_img.height);
					self.openS_do.screen.appendChild(self.openS_canvas);
				}					
			}else{
				self.openS_do = new FWDEVPDisplayObject("img"); 
				self.openS_do.setScreen(self.openS_img);
			}
			self.openS_do.setWidth(self.openN_do.w);
			self.openS_do.setHeight(self.openN_do.h);
			self.openS_do.setAlpha(0);
			
			
			if(self.useHEXColorsForSkin_bl){
				self.closeN_do = new FWDEVPDisplayObject("div");
				self.closeN_canvas = FWDEVPUtils.getCanvasWithModifiedColor(self.closeN_img, self.normalButtonsColor_str).canvas;
				self.closeN_do.screen.appendChild(self.closeN_canvas);
			}else{
				self.closeN_do = new FWDEVPDisplayObject("img");
				self.closeN_do.setScreen(self.closeN_img);
			}
			self.closeN_do.setWidth(self.closeN_img.width);
			self.closeN_do.setHeight(self.closeN_img.height);
			
			self.closeN_do.hasTransform3d_bl = false;
			self.closeN_do.hasTransform2d_bl = false;
			self.closeN_do.setBackfaceVisibility();
			
			self.closeS_img = new Image();
			self.closeS_img.src = self.closeSPath_str;	
			if(self.useHEXColorsForSkin_bl){
				self.closeS_do = new FWDEVPDisplayObject("div");
				self.closeS_img.onload = function(){		
					self.closeS_canvas = FWDEVPUtils.getCanvasWithModifiedColor(self.closeS_img, self.selectedButtonsColor_str).canvas;
					self.closeS_do.setWidth(self.closeN_img.width);
					self.closeS_do.setHeight(self.closeN_img.height);
					self.closeS_do.screen.appendChild(self.closeS_canvas);
				}					
			}else{
				self.closeS_do = new FWDEVPDisplayObject("img"); 
				self.closeS_do.setScreen(self.closeS_img);
			}
			
			self.closeS_do.setWidth(self.closeN_img.width);
			self.closeS_do.setHeight(self.closeN_img.height);
			
			self.closeS_do.setAlpha(0);
			self.closeS_do.hasTransform3d_bl = false;
			self.closeS_do.hasTransform2d_bl = false;
			
			
			FWDEVPPreloader2.setPrototype();
			self.animation_do = new FWDEVPPreloader2(self.animationPath_img, 29, 22, 31, 80, true);
			self.animation_do.setY(self.openerEqulizerOffsetTop);
			self.animation_do.show(false);
			self.animation_do.stop();
			
			self.dumy_do = new FWDEVPDisplayObject("div");
			self.dumy_do.setWidth(self.totalWidth);
			self.dumy_do.setHeight(self.totalHeight);
			self.dumy_do.getStyle().zIndex = 2;
			self.dumy_do.hasTransform3d_bl = false;
			self.dumy_do.hasTransform2d_bl = false;
			self.dumy_do.setBackfaceVisibility();
			self.dumy_do.setButtonMode(true);
			
			if(FWDEVPUtils.isIE || FWDEVPUtils.isAndroid){
				self.dumy_do.setBkColor("#FF0000");
				self.dumy_do.setAlpha(.01);
			}
		
			
			if(self.hasPointerEvent_bl){
				self.mainHolder_do.screen.addEventListener("pointerup", self.onMouseUp);
				self.mainHolder_do.screen.addEventListener("pointerover", self.onMouseOver);
				self.mainHolder_do.screen.addEventListener("pointerout", self.onMouseOut);
			}else if(self.screen.addEventListener){	
				if(!self.isMobile_bl){
					self.mainHolder_do.screen.addEventListener("mouseover", self.onMouseOver);
					self.mainHolder_do.screen.addEventListener("mouseout", self.onMouseOut);
					self.mainHolder_do.screen.addEventListener("mouseup", self.onMouseUp);
				}
				self.screen.addEventListener("touchend", self.onMouseUp);
			}
			
			self.mainHolder_do.addChild(self.openN_do);
			self.mainHolder_do.addChild(self.openS_do);
			
			self.mainHolder_do.addChild(self.closeN_do);
			self.mainHolder_do.addChild(self.closeS_do);
			self.mainHolder_do.addChild(self.animation_do);
			self.mainHolder_do.addChild(self.dumy_do);
			self.addChild(self.mainHolder_do);
		};
		
		this.onMouseOver = function(e, animate){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				self.setSelectedState();
			}
		};
			
		this.onMouseOut = function(e){
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				self.setNormalState();
			}
		};
		
		this.onMouseUp = function(e){
			if(e.preventDefault) e.preventDefault();
			if(self.playerIsShowed_bl){
				self.playerIsShowed_bl = false;
				self.dispatchEvent(FWDEVPOpener.HIDE);
			}else{
				self.playerIsShowed_bl = true;
				self.dispatchEvent(FWDEVPOpener.SHOW);
			}
		};
		
		//################################################//
		/* Setup play button */
		//################################################//
		this.setupPlayPauseButton = function(){
			FWDEVPComplexButton.setPrototype();
			self.playPauseButton_do = new FWDEVPComplexButton(
					self.openerPlayN_img,
					self.openerPlaySPath_str,
					self.openerPauseN_img,
					self.openerPauseS_str,
					true,
					self.useHEXColorsForSkin_bl,
					self.normalButtonsColor_str,
					self.selectedButtonsColor_str
			);
			self.playPauseButton_do.addListener(FWDEVPComplexButton.MOUSE_UP, self.playButtonMouseUpHandler);
			self.addChild(self.playPauseButton_do);
		};
		
		this.showPlayButton = function(){
			if(self.playPauseButton_do) self.playPauseButton_do.setButtonState(1);
			self.animation_do.stop();
		};
		
		this.showPauseButton = function(){
			if(self.playPauseButton_do) self.playPauseButton_do.setButtonState(0);
			self.animation_do.start(0);
		};
		
		this.playButtonMouseUpHandler = function(){
			if(self.playPauseButton_do.currentState == 0){
				self.dispatchEvent(FWDEVPController.PAUSE);
			}else{
				self.dispatchEvent(FWDEVPController.PLAY);
			}
		};
		
		//###############################//
		/* set normal / selected state */
		//################################//
		this.setNormalState = function(){
			if(self.isMobile_bl && !self.hasPointerEvent_bl) return;
			FWDAnimation.killTweensOf(self.openS_do);
			FWDAnimation.killTweensOf(self.closeS_do);
			FWDAnimation.to(self.openS_do, .5, {alpha:0, ease:Expo.easeOut});	
			FWDAnimation.to(self.closeS_do, .5, {alpha:0, ease:Expo.easeOut});
		};
		
		this.setSelectedState = function(animate){
			FWDAnimation.killTweensOf(self.openS_do);
			FWDAnimation.killTweensOf(self.closeS_do);
			FWDAnimation.to(self.openS_do, .5, {alpha:1, ease:Expo.easeOut});	
			FWDAnimation.to(self.closeS_do, .5, {alpha:1, ease:Expo.easeOut});
		};
		
		//######################################//
		/* show /hide close / open */
		//######################################//
		this.showOpenButton = function(){
			self.playerIsShowed_bl = false;
			self.closeN_do.setX(150);
			self.closeS_do.setX(150);
			
			if(self.playPauseButton_do){
				if(self.alignment_str == "right"){
					self.playPauseButton_do.setX(0);
					self.openN_do.setX(self.playPauseButton_do.w + 1);
					self.openS_do.setX(self.playPauseButton_do.w + 1);
					self.dumy_do.setX(self.playPauseButton_do.w + 1);
					self.dumy_do.setWidth(self.totalWidth);
					self.animation_do.setX(self.playPauseButton_do.w + 1 + self.openerEqulizerOffsetLeft);
				}else{
					self.playPauseButton_do.setX(self.openN_do.w + 1);
					self.openN_do.setX(0);
					self.openS_do.setX(0);
					self.dumy_do.setX(0);
					self.dumy_do.setWidth(self.totalWidth);
					self.animation_do.setX(self.openerEqulizerOffsetLeft);
				}
			}else{
				self.openN_do.setX(0);
				self.openS_do.setX(0);
				self.dumy_do.setX(0);
				self.dumy_do.setWidth(self.totalWidth);
				self.animation_do.setX(self.openerEqulizerOffsetLeft);
			}
			self.animation_do.setVisible(true);
		};
		
		this.showCloseButton = function(){
			self.playerIsShowed_bl = true;
			self.openN_do.setX(150);
			self.openS_do.setX(150);
			self.dumy_do.setWidth(self.closeN_do.w);
			if(self.alignment_str == "right"){
				if(self.playPauseButton_do){
					self.closeN_do.setX(self.totalWidth + 1);
					self.closeS_do.setX(self.totalWidth + 1);
					self.dumy_do.setX(self.totalWidth + 1);
				}else{
					self.closeN_do.setX(self.totalWidth - self.closeN_do.w);
					self.closeS_do.setX(self.totalWidth - self.closeN_do.w);
					self.dumy_do.setX(self.totalWidth - self.closeN_do.w);
				}
			}else{
				self.closeN_do.setX(0);
				self.closeS_do.setX(0);
				self.dumy_do.setX(0);
			}
			
			if(self.playPauseButton_do) self.playPauseButton_do.setX(150);
			self.animation_do.setX(150);
			self.animation_do.setVisible(false);
		};
		
		this.hide = function(){
			self.mainHolder_do.setX(150);
		};
		
		this.show = function(){
			self.mainHolder_do.setX(0);
		};
		
		//##########################################//
		/* Update HEX color of a canvaas */
		//##########################################//
		self.updateHEXColors = function(normalColor_str, selectedColor_str){
			
			self.normalColor_str = normalColor_str;
			self.selectedColor_str = selectedColor_str;
			self.playPauseButton_do.updateHEXColors(normalColor_str, selectedColor_str);
			FWDEVPUtils.changeCanvasHEXColor(self.openN_img, self.openN_canvas, normalColor_str);
			FWDEVPUtils.changeCanvasHEXColor(self.closeN_img, self.closeN_canvas, normalColor_str);
			
			FWDEVPUtils.changeCanvasHEXColor(self.openS_img, self.openS_canvas, selectedColor_str);
			FWDEVPUtils.changeCanvasHEXColor(self.closeS_img, self.closeS_canvas, selectedColor_str);
		}
		
		this.init();
	};
	
	/* set prototype */
	FWDEVPOpener.setPrototype = function(){
		FWDEVPOpener.prototype = new FWDEVPDisplayObject("div");
	};
	
	FWDEVPOpener.SHOW = "show";
	FWDEVPOpener.HIDE = "hise";
	FWDEVPOpener.PLAY = "play";
	FWDEVPOpener.PAUSE = "pause";
	
	
	FWDEVPOpener.prototype = null;
	window.FWDEVPOpener = FWDEVPOpener;
	
}(window));
