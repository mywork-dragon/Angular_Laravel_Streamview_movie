/* FWDEVPSimpleButton */
(function (window){
var FWDEVPSimpleButton = function(nImg, 
								  sPath, 
								  dPath, 
								  alwaysShowSelectedPath, 
								  useHEXColorsForSkin_bl,
								  normalButtonsColor_str,
								  selectedButtonsColor_str,
								  iconCSSString, 
								  showHDIcon, 
								  normalCalssName,
								  selectedCalssName
								 ){
		
		var self = this;
		var prototype = FWDEVPSimpleButton.prototype;
		
		this.iconCSSString = iconCSSString;
		this.showHDIcon = showHDIcon;
		
		this.nImg = nImg;
		this.sPath_str = sPath;
		this.dPath_str = dPath;
		
		self.testButton = Boolean(String(self.iconCSSString).indexOf("download") != -1);
	
		this.n_sdo;
		this.s_sdo;
		this.d_sdo;
		
		this.toolTipLabel_str;
		
		if(this.nImg){
			this.totalWidth = this.nImg.width;
			this.totalHeight = this.nImg.height;
			self.buttonWidth = self.totalWidth;
			self.buttonHeight = self.totalHeight;
		}
		
		
		this.normalCalssName = normalCalssName;
		this.selectedCalssName = selectedCalssName;
		
		this.useHEXColorsForSkin_bl = useHEXColorsForSkin_bl;
		this.normalButtonsColor_str = normalButtonsColor_str;
		this.selectedButtonsColor_str = selectedButtonsColor_str;
		
		this.isShowed_bl = true;
		this.isSetToDisabledState_bl = false;
		this.isDisabled_bl = false;
		this.isDisabledForGood_bl = false;
		this.isSelectedFinal_bl = false;
		this.isActive_bl = false;
		this.isMobile_bl = FWDEVPUtils.isMobile;
		this.hasPointerEvent_bl = FWDEVPUtils.hasPointerEvent;
		this.allowToCreateSecondButton_bl = !self.isMobile_bl || self.hasPointerEvent_bl || alwaysShowSelectedPath;
		this.useFontAwesome_bl = Boolean(this.iconCSSString);
		
		//##########################################//
		/* initialize self */
		//##########################################//
		self.init = function(){
			self.setupMainContainers();
			self.setNormalState();
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		self.setupMainContainers = function(){
			if(self.useFontAwesome_bl){
				self.n_do = new FWDEVPTransformDisplayObject("div");	
				self.n_do.setInnerHTML(self.iconCSSString);
				self.addChild(self.n_do);
				
				if(self.showHDIcon){
					var hdImage = new Image();
					hdImage.src = "http://www.webdesign-flash.ro/icons/hd.png";
					self.hd_do = new FWDEVPDisplayObject("img");
					self.hd_do.setScreen(hdImage);
					self.hd_do.setWidth(7);
					self.hd_do.setHeight(5);

					self.setOverflow("visible");
					self.addChild(self.hd_do);
				};
			
				self.setFinalSize();
			}else{
				if(self.useHEXColorsForSkin_bl){
					self.n_sdo = new FWDEVPTransformDisplayObject("div");
					self.n_sdo.setWidth(self.totalWidth);
					self.n_sdo.setHeight(self.totalHeight);
					self.n_sdo_canvas = FWDEVPUtils.getCanvasWithModifiedColor(self.nImg, self.normalButtonsColor_str).canvas;
					self.n_sdo.screen.appendChild(self.n_sdo_canvas);
					self.addChild(self.n_sdo);
				}else{
					self.n_sdo = new FWDEVPTransformDisplayObject("img");	
					self.n_sdo.setScreen(self.nImg);
					self.addChild(self.n_sdo);
				}
				
				if(self.allowToCreateSecondButton_bl){
					
					self.img1 = new Image();
					self.img1.src = self.sPath_str;
					var img2 = new Image();
					self.sImg = img2;
					
					if(self.useHEXColorsForSkin_bl){
						self.s_sdo = new FWDEVPTransformDisplayObject("div");
						self.s_sdo.setWidth(self.totalWidth);
						self.s_sdo.setHeight(self.totalHeight);
						self.img1.onload = function(){
							self.s_sdo_canvas = FWDEVPUtils.getCanvasWithModifiedColor(self.img1, self.selectedButtonsColor_str).canvas;
							self.s_sdo.screen.appendChild(self.s_sdo_canvas);
						}
						self.s_sdo.setAlpha(0);
						self.addChild(self.s_sdo);
					}else{
						self.s_sdo = new FWDEVPDisplayObject("img");
						self.s_sdo.setScreen(self.img1);
						self.s_sdo.setWidth(self.totalWidth);
						self.s_sdo.setHeight(self.totalHeight);
						self.s_sdo.setAlpha(0);
						self.addChild(self.s_sdo);
					}
					
					if(self.dPath_str){
						img2.src = self.dPath_str;
						self.d_sdo = new FWDEVPDisplayObject("img");
						self.d_sdo.setScreen(img2);
						self.d_sdo.setWidth(self.totalWidth);
						self.d_sdo.setHeight(self.totalHeight);
						self.d_sdo.setX(-100);
						self.addChild(self.d_sdo);
					};
					self.setWidth(self.totalWidth);
					self.setHeight(self.totalHeight);
				}
			}
			
			self.setButtonMode(true);
			self.screen.style.yellowOverlayPointerEvents = "none";
			
			if(self.hasPointerEvent_bl){
				self.screen.addEventListener("pointerup", self.onMouseUp);
				self.screen.addEventListener("pointerover", self.onMouseOver);
				self.screen.addEventListener("pointerout", self.onMouseOut);
			}else if(self.screen.addEventListener){	
				if(!self.isMobile_bl){
					self.screen.addEventListener("mouseover", self.onMouseOver);
					self.screen.addEventListener("mouseout", self.onMouseOut);
					self.screen.addEventListener("mouseup", self.onMouseUp);
				}
				self.screen.addEventListener("touchend", self.onMouseUp);
			}
		};
		
		self.onMouseOver = function(e){
			self.dispatchEvent(FWDEVPSimpleButton.SHOW_TOOLTIP, {e:e});
			if(self.isDisabledForGood_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				if(self.isDisabled_bl || self.isSelectedFinal_bl) return;
				self.dispatchEvent(FWDEVPSimpleButton.MOUSE_OVER, {e:e});
				self.setSelectedState(true);
			}
		};
			
		self.onMouseOut = function(e){
			if(self.isDisabledForGood_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				if(self.isDisabled_bl || self.isSelectedFinal_bl) return;
				self.dispatchEvent(FWDEVPSimpleButton.MOUSE_OUT, {e:e});
				self.setNormalState(true);
			}
		};
		
		self.onMouseUp = function(e){
			
			if(self.isDisabledForGood_bl) return;
			if(e.preventDefault) e.preventDefault();
			if(self.isDisabled_bl || e.button == 2) return;
		
			self.dispatchEvent(FWDEVPSimpleButton.MOUSE_UP, {e:e});
		};
		
		self.checkCount = 0;
		this.setFinalSize = function(){
			
			clearInterval(self.checkId_int);
			if(self.checkCount > 6) return;
			self.lastWidth = self.n_do.screen.firstChild.offsetWidth;
			self.checkCount +=1;
		
			self.checkId_int = setInterval(function(){
				self.setFinalSize();
			},100);
			
			if(self.prevWidth == self.lastWidth || self.lastWidth == 0) return;
			self.setWidth(self.n_do.screen.firstChild.offsetWidth);
			self.setHeight(self.n_do.screen.firstChild.offsetHeight);
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
		
		//##############################//
		// set select / deselect final.
		//##############################//
		self.setSelected = function(){
			self.isSelectedFinal_bl = true;
			if(!self.s_sdo) return;
			FWDAnimation.killTweensOf(self.s_sdo);
			FWDAnimation.to(self.s_sdo, .8, {alpha:1, ease:Expo.easeOut});
		};
		
		self.setUnselected = function(){
			self.isSelectedFinal_bl = false;
			if(!self.s_sdo) return;
			FWDAnimation.to(self.s_sdo, .8, {alpha:0, delay:.1, ease:Expo.easeOut});
		};
		
		//####################################//
		/* Set normal / selected state */
		//####################################//
		this.setNormalState = function(animate){
			if(self.doNotallowToSetNormal) return;
			if(self.useFontAwesome_bl){
				FWDAnimation.killTweensOf(self.n_do.screen);
				if(animate){
					FWDAnimation.to(self.n_do.screen, .8, {className:self.normalCalssName, ease:Expo.easeOut});	
				}else{
					self.n_do.screen.className = self.normalCalssName;
				}
			}else{
				FWDAnimation.killTweensOf(self.s_sdo);
				FWDAnimation.to(self.s_sdo, .5, {alpha:0, ease:Expo.easeOut});	
			}
		};
		
		this.setSelectedState = function(animate){
			if(self.useFontAwesome_bl){
				FWDAnimation.killTweensOf(self.n_do.screen);
				if(animate){
					FWDAnimation.to(self.n_do.screen, .8, {className:self.selectedCalssName, ease:Expo.easeOut});	
				}else{
					self.n_do.screen.className = self.selectedCalssName;
				}
			}else{
				FWDAnimation.killTweensOf(self.s_sdo);
				FWDAnimation.to(self.s_sdo, .5, {alpha:1, delay:.1, ease:Expo.easeOut});
			}
		};
		
		//####################################//
		/* Disable / enable */
		//####################################//
		this.setDisabledState = function(){
			if(self.isSetToDisabledState_bl) return;
			self.isSetToDisabledState_bl = true;
			if(self.d_sdo) self.d_sdo.setX(0);
			if(self.hd_do) self.hd_do.setX(self.w - self.hd_do.w);
		};
		
		this.setEnabledState = function(){
			if(!self.isSetToDisabledState_bl) return;
			self.isSetToDisabledState_bl = false;
			if(self.d_sdo) self.d_sdo.setX(-100);
			if(self.hd_do) self.hd_do.setX(-100000);
		};
		
		this.disable = function(){
			if(self.isDisabledForGood_bl  || self.isDisabled_bl) return;
			self.isDisabled_bl = true;
			self.setButtonMode(false);
			FWDAnimation.killTweensOf(self);
			FWDAnimation.to(self, .6, {alpha:.4});
			self.setNormalState(true);
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
			if(self.d_sdo) if(self.d_sdo.x != 0) self.d_sdo.setX(0);
			if(self.hd_do) self.hd_do.setX(self.w - self.hd_do.w + 2);
		};
		
		this.hideDisabledState = function(){
			if(self.d_sdo) if(self.d_sdo.x != -100) self.d_sdo.setX(-100);
			if(self.hd_do) self.hd_do.setX(-10000);
		};
	
		
		//#####################################//
		/* show / hide */
		//#####################################//
		this.show = function(){
			if(self.isShowed_bl) return;
			self.isShowed_bl = true;
			
			FWDAnimation.killTweensOf(self);
			if(!FWDEVPUtils.isIEAndLessThen9 ){
				if(FWDEVPUtils.isIEWebKit){
					FWDAnimation.killTweensOf(self.n_sdo);
					self.n_sdo.setScale2(0);
					FWDAnimation.to(self.n_sdo, .8, {scale:1, delay:.4, onStart:function(){self.setVisible(true);}, ease:Elastic.easeOut});
				}else{
					self.setScale2(0);
					FWDAnimation.to(self, .8, {scale:1, delay:.4, onStart:function(){self.setVisible(true);}, ease:Elastic.easeOut});
				}
			}else if(FWDEVPUtils.isIEAndLessThen9){
				self.setVisible(true);
			}else{
				self.setAlpha(0);
				FWDAnimation.to(self, .4, {alpha:1, delay:.4});
				self.setVisible(true);
			}
		};	
			
		this.hide = function(animate){
			if(!self.isShowed_bl) return;
			self.isShowed_bl = false;
			FWDAnimation.killTweensOf(self);
			FWDAnimation.killTweensOf(self.n_sdo);
			self.setVisible(false);
		};
		
		//##########################################//
		/* Update HEX color of a canvaas */
		//##########################################//
		self.updateHEXColors = function(normalColor_str, selectedColor_str){
			FWDEVPUtils.changeCanvasHEXColor(self.nImg, self.n_sdo_canvas, normalColor_str);
			FWDEVPUtils.changeCanvasHEXColor(self.img1, self.s_sdo_canvas, selectedColor_str);
		}
		
		self.init();
	};
	
	/* set prototype */
	FWDEVPSimpleButton.setPrototype = function(){
		FWDEVPSimpleButton.prototype = null;
		FWDEVPSimpleButton.prototype = new FWDEVPTransformDisplayObject("div");
	};
	
	FWDEVPSimpleButton.CLICK = "onClick";
	FWDEVPSimpleButton.MOUSE_OVER = "onMouseOver";
	FWDEVPSimpleButton.SHOW_TOOLTIP = "showTooltip";
	FWDEVPSimpleButton.MOUSE_OUT = "onMouseOut";
	FWDEVPSimpleButton.MOUSE_UP = "onMouseDown";
	
	FWDEVPSimpleButton.prototype = null;
	window.FWDEVPSimpleButton = FWDEVPSimpleButton;
}(window));