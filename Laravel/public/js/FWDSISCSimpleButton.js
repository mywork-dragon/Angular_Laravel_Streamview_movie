/* FWDSISCSimpleButton */
(function (window){
var FWDSISCSimpleButton = function(parent,
								  nImg, 
								  sPath, 
								  dPath, 
								  alwaysShowSelectedPath, 
								  useHEXColorsForSkin_bl,
								  normalButtonsColor_str,
								  selectedButtonsColor_str,
								  iconCSSString, 
								  normalClassName,
								  selectedCalssName){
		
		var self = this;
		var prototype = FWDSISCSimpleButton.prototype;
		
		this.iconCSSString = iconCSSString;
		this.normalClassName = normalClassName;
		this.selectedCalssName = selectedCalssName;
		this.nImg = nImg;
		this.sPath_str = sPath;
		this.dPath_str = dPath;
	
		this.n_sdo;
		this.s_sdo;
		this.d_sdo;
		
		this.toolTipLabel_str;
		
		this.totalWidth = this.nImg.width;
		this.totalHeight = this.nImg.height;
		
		this.useHEXColorsForSkin_bl = useHEXColorsForSkin_bl;
		this.normalButtonsColor_str = normalButtonsColor_str;
		this.selectedButtonsColor_str = selectedButtonsColor_str;
		
		this.isShowed_bl = true;
		this.isSetToDisabledState_bl = false;
		this.isDisabled_bl = false;
		this.isDisabledForGood_bl = false;
		this.isSelectedFinal_bl = false;
		this.isActive_bl = false;
		this.isMobile_bl = FWDSISCUtils.isMobile;
		this.hasPointerEvent_bl = FWDSISCUtils.hasPointerEvent;
		this.allowToCreateSecondButton_bl = true;

		this.useFonticon_bl = Boolean(this.iconCSSString);

		//##########################################//
		/* initialize self */
		//##########################################//
		self.init = function(){
			self.setupMainContainers();
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		self.setupMainContainers = function(){
			if(self.useFonticon_bl){
				self.n_do = new FWDSISCDisplayObject("div");	
				
				self.n_do.setInnerHTML('<div class="table-plugin-fwdsisc-button"><span class="table-cell-fwdsisc-plugin-button ' + self.iconCSSString + '"></span></div>');
				
				self.addChild(self.n_do);
				self.setNormalState(false);
				self.setFinalSize();
				self.setOverflow('visible');
				
			}else{
				self.n_sdoHolder = new FWDSISCDisplayObject("div");
					self.n_sdoHolder.setOverflow("visible");
				if(self.useHEXColorsForSkin_bl){
					
					self.n_sdo = new FWDSISCTransformDisplayObject("div");
					self.n_sdo.setWidth(self.totalWidth);
					self.n_sdo.setHeight(self.totalHeight);
					self.n_sdo_canvas = FWDSISCUtils.getCanvasWithModifiedColor(self.nImg, self.normalButtonsColor_str).canvas;
					self.n_sdo.screen.appendChild(self.n_sdo_canvas);
				}else{
					
					self.n_sdo = new FWDSISCTransformDisplayObject("img");	
					self.n_sdo.setScreen(self.nImg);
				}
				
				if(self.allowToCreateSecondButton_bl){
					
					self.img1 = new Image();
					self.img1.src = self.sPath_str;
					var img2 = new Image();
					self.sImg = img2;
					
					if(self.useHEXColorsForSkin_bl){
						self.s_sdo = new FWDSISCTransformDisplayObject("div");
						self.s_sdo.setWidth(self.totalWidth);
						self.s_sdo.setHeight(self.totalHeight);
						self.img1.onload = function(){
							self.s_sdo_canvas = FWDSISCUtils.getCanvasWithModifiedColor(self.img1, self.selectedButtonsColor_str).canvas;
							self.s_sdo.screen.appendChild(self.s_sdo_canvas);
						}
						//self.s_sdo.setAlpha(0);
						self.addChild(self.s_sdo);
					}else{
						self.s_sdo = new FWDSISCDisplayObject("img");
						self.s_sdo.setScreen(self.img1);
						self.s_sdo.setWidth(self.totalWidth);
						self.s_sdo.setHeight(self.totalHeight);
						//self.s_sdo.setAlpha(0);
						self.addChild(self.s_sdo);
					}
					
					if(self.dPath_str){
						img2.src = self.dPath_str;
						self.d_sdo = new FWDSISCDisplayObject("img");
						self.d_sdo.setScreen(img2);
						self.d_sdo.setWidth(self.totalWidth);
						self.d_sdo.setHeight(self.totalHeight);
						self.d_sdo.setX(-100);
						self.addChild(self.d_sdo);
					};
				}
				self.addChild(self.n_sdoHolder);
				self.n_sdoHolder.addChild(self.n_sdo);

				self.setWidth(self.totalWidth);
				self.setHeight(self.totalHeight);
			}
			
			
			self.setButtonMode(true);
			self.screen.style.yellowOverlayPointerEvents = "none";
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("pointerup", self.onMouseUp);
					self.screen.addEventListener("pointerover", self.onMouseOver);
					self.screen.addEventListener("pointerout", self.onMouseOut);
				}else{
					self.screen.addEventListener("touchend", self.onMouseUp);
				}
			}else if(self.screen.addEventListener){	
				self.screen.addEventListener("mouseover", self.onMouseOver);
				self.screen.addEventListener("mouseout", self.onMouseOut);
				self.screen.addEventListener("mouseup", self.onMouseUp);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOver);
				self.screen.attachEvent("onmouseout", self.onMouseOut);
				self.screen.attachEvent("onmouseup", self.onMouseUp);
			}
		};
		
		self.onMouseOver = function(e){
			self.dispatchEvent(FWDSISCSimpleButton.SHOW_TOOLTIP, {e:e});
			if(self.isDisabledForGood_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				if(self.isDisabled_bl || self.isSelectedFinal_bl) return;
				self.dispatchEvent(FWDSISCSimpleButton.MOUSE_OVER, {e:e});
				self.setSelectedState(true);
			}

		};
			
		self.onMouseOut = function(e){
			if(self.isDisabledForGood_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				if(self.isDisabled_bl || self.isSelectedFinal_bl) return;
				self.dispatchEvent(FWDSISCSimpleButton.MOUSE_OUT, {e:e});
				self.setNormalState(true);
			}
		};
		
		self.onMouseUp = function(e){
			if(self.isDisabledForGood_bl) return;
			if(e.preventDefault) e.preventDefault();
			if(self.isDisabled_bl || e.button == 2) return;
			if(!self.isMobile_bl) self.setSelectedState(true);
			self.dispatchEvent(FWDSISCSimpleButton.MOUSE_UP, {e:e});
		};

		self.checkCount = 0;
		this.setFinalSize = function(){
		
			clearInterval(self.checkId_int);
			if(self.checkCount > 5) return;
			self.lastWidth = self.n_do.screen.offsetWidth;
			self.checkCount +=1;
		
			self.checkId_int = setInterval(function(){
				self.setFinalSize();
			},100);
			
			if(self.prevWidth == self.lastWidth || self.lastWidth == 0) return;
			self.setWidth(self.n_do.screen.offsetWidth);
			self.setHeight(self.n_do.screen.offsetHeight);
			self.n_do.setWidth(self.w);
			self.n_do.setHeight(self.h);
			self.buttonWidth = self.w;
			self.buttonHeight = self.h;
			self.totalWidth = self.w;
			self.totalHeight = self.h;
	
			
			if(self.hd_do){
				self.hd_do.setX(self.w - self.hd_do.w + 2);
				self.hd_do.setY( -2);	
			}
			
			self.prevWidth = self.lastWidth;
		}
		
		//####################################//
		/* Set normal / selected state */
		//####################################//
		this.setNormalState = function(animate){
			if(self.useFonticon_bl){
				FWDAnimation.killTweensOf(self.n_do.screen);
				if(animate){
					FWDAnimation.to(self.n_do.screen, .8, {className:self.normalClassName, ease:Expo.easeOut});	
				}else{
					self.n_do.screen.className = self.normalClassName;
				}
			}else{
				FWDAnimation.killTweensOf(self.n_sdoHolder);
				FWDAnimation.to(self.n_sdoHolder, .5, {alpha:1, ease:Expo.easeOut});
			}
		};
		
		this.setSelectedState = function(animate){
			if(self.useFonticon_bl){
				FWDAnimation.killTweensOf(self.n_do.screen);
				if(animate){
					FWDAnimation.to(self.n_do.screen, .8, {className:self.selectedCalssName, ease:Expo.easeOut});	
				}else{
					self.n_do.screen.className = self.selectedCalssName;
				}
			}else{
				FWDAnimation.killTweensOf(self.n_sdoHolder);
				//if(self.n_sdo.alpha == 0) return;
				if(animate){
					FWDAnimation.to(self.n_sdoHolder, .5, {alpha:0, delay:.1, ease:Expo.easeOut});
				}else{
					self.n_sdoHolder.setAlpha(0);
				}
			}
		};
		
		//####################################//
		/* Disable / enable */
		//####################################//
		this.setDisabledState = function(){
			if(self.isSetToDisabledState_bl) return;
			self.isSetToDisabledState_bl = true;
			if(self.d_sdo) self.d_sdo.setX(0);
		};
		
		this.setEnabledState = function(){
			if(!self.isSetToDisabledState_bl) return;
			self.isSetToDisabledState_bl = false;
			if(self.d_sdo) self.d_sdo.setX(-100);
		};
		
		this.disable = function(){
			if(self.isDisabledForGood_bl  || self.isDisabled_bl) return;
			self.isDisabled_bl = true;
			self.setButtonMode(false);
			FWDAnimation.killTweensOf(self);
			FWDAnimation.to(self, .6, {alpha:.4});
			self.setNormalState();
		};
		
		this.enable = function(){
			if(self.isDisabledForGood_bl || !self.isDisabled_bl) return;
			self.isDisabled_bl = false;
			self.setButtonMode(true);
			FWDAnimation.killTweensOf(self);
			FWDAnimation.to(self, .6, {alpha:1});
		};
		
		this.disableForGood = function(){
			self.isDisabledForGood_bl = true;
			self.setButtonMode(false);
		};
		
		this.showDisabledState = function(){
			if(self.d_sdo.x != 0) self.d_sdo.setX(0);
		};
		
		this.hideDisabledState = function(){
			if(self.d_sdo.x != -100) self.d_sdo.setX(-100);
		};
		
		//#####################################//
		/* show / hide */
		//#####################################//
		this.show = function(animate){
			if(self.isShowed_bl) return;
			self.isShowed_bl = true;
			var x;
			x = 0;
			
			FWDAnimation.killTweensOf(self.n_do);

			FWDAnimation.killTweensOf(self.n_do);
			
			if(parent.nextAndPrevButtonsPosition_str != "leftAndRight"){

				if(animate){
					FWDAnimation.to(self.n_do, .8, {alpha:1, ease:Expo.easeInOut});
				}else{
					self.n_do.setAlpha(1);	
				}
			}

			if(animate){
				FWDAnimation.to(self.n_do, .8, {x:x, ease:Expo.easeInOut});
			}else{
				self.n_do.setX(x);
			}
		};	
			
		this.hide = function(animate){
			if(!self.isShowed_bl) return;
			self.isShowed_bl = false;
			var x;

			if(self.iconCSSString.indexOf('right') != -1){
				x = self.n_do.getWidth() + parent.horizontalButtonsOffset;
			}else if(self.iconCSSString.indexOf('left') != -1){
				x = - self.n_do.getWidth() - parent.horizontalButtonsOffset;
			}
			
			FWDAnimation.killTweensOf(self.n_do);
			if(parent.nextAndPrevButtonsPosition_str != "leftAndRight"){
				if(animate){
					FWDAnimation.to(self.n_do, .8, {alpha:0, ease:Expo.easeInOut});
				}else{
					self.n_do.setAlpha(0);	
				}
			}

			if(animate){
				FWDAnimation.to(self.n_do, .8, {x:x, ease:Expo.easeInOut});
			}else{
				self.n_do.setX(x);
			}
		};
		
		//##########################################//
		/* Update HEX color of a canvaas */
		//##########################################//
		self.updateHEXColors = function(normalColor_str, selectedColor_str){
			FWDSISCUtils.changeCanvasHEXColor(self.nImg, self.n_sdo_canvas, normalColor_str);
			FWDSISCUtils.changeCanvasHEXColor(self.img1, self.s_sdo_canvas, selectedColor_str);
		}
		
		self.init();
	};
	
	/* set prototype */
	FWDSISCSimpleButton.setPrototype = function(){
		FWDSISCSimpleButton.prototype = null;
		FWDSISCSimpleButton.prototype = new FWDSISCTransformDisplayObject("div");
	};
	
	FWDSISCSimpleButton.CLICK = "onClick";
	FWDSISCSimpleButton.MOUSE_OVER = "onMouseOver";
	FWDSISCSimpleButton.SHOW_TOOLTIP = "showTooltip";
	FWDSISCSimpleButton.MOUSE_OUT = "onMouseOut";
	FWDSISCSimpleButton.MOUSE_UP = "onMouseDown";
	
	FWDSISCSimpleButton.prototype = null;
	window.FWDSISCSimpleButton = FWDSISCSimpleButton;
}(window));