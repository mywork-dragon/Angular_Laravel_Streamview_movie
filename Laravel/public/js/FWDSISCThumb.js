/* thumb */
(function(window){
	
	var FWDSISCThumb = function(
			parent,
			id, 
			transitionDuration,
			transitionType_str,
			animationTextType_str,
			showHTMLTextContent_str,
			HTMLTextPosition_str,
			HTMLTextAlignment_str,
			source,
			imageW,
			imageH,
			imageBorderSize,
			imageBorderRadius,
			backgroundColor,
			imageBorderColor,
			overlayColor_str,
			description_ar,
			showImageReflection_bl,
			link,
			target,
			source
		){
		
		var self = this;
		var prototype = FWDSISCThumb.prototype;

		this.source_str = source;
		this.background_do = null;
		this.image_do = null;
		this.overlay_do = null;
		this.animationTextType_str = animationTextType_str;
		this.HTMLTextPosition_str = HTMLTextPosition_str;
		this.HTMLTextAlignment_str = HTMLTextAlignment_str;
		this.borderColor_str = imageBorderColor;
		this.backgroundColor = backgroundColor;
		this.showHTMLTextContent_str = showHTMLTextContent_str;
		this.showImageReflection_bl = showImageReflection_bl;
		this.link = link;
		this.target = target;
		this.source = source
	
		this.id = id;
		this.finalId = id;
		this.borderSize = imageBorderSize;
		
		this.borderRadius = imageBorderRadius;
		this.imageW = imageW;
		this.imageH = imageH;
		this.finalX = -1;
		this.finalY = -1;
		this.transitionDuration = transitionDuration;
		this.transitionType_str = transitionType_str;
		this.description_ar = description_ar;
		this.htmlContent_ar;
	
		this.showFirstTime_bl = true;
		this.isSelected_bl = false;
		this.isDisabled_bl = false;
		this.hasPointerEvent_bl = FWDSISCUtils.hasPointerEvent;
		this.isMobile_bl = FWDSISCUtils.isMobile;
		this.overlayColor_str = overlayColor_str;
	
		/* init */
		self.init = function(){
			self.setOverflow("visible");
			//self.setButtonMode(true);
			self.setupScreen();
			self.addLinkSupport();
		};
		
		/* setup screen */
		self.setupScreen = function(){			
			self.background_do = new FWDSISCDisplayObject("div");
			//self.background_do.getStyle().color = "#FFFFFF";
			//self.background_do.setInnerHTML(self.id);
			//self.background_do.getStyle().fontSize = "30px"
			
			if(self.borderRadius) self.getStyle().borderRadius = self.borderRadius + "px";
			if(self.borderRadius) self.getStyle().borderRadius = self.borderRadius + "px";
			
			if(self.borderSize){
				self.background_do.setX(self.borderSize);
				self.background_do.setY(self.borderSize);
				self.border_do = new FWDSISCDisplayObject("div");
				self.border_do.getStyle().backgroundColor = self.borderColor_str;
				self.addChild(self.border_do);
			}
			
			self.background_do.getStyle().backgroundColor = self.backgroundColor;
			self.addChild(self.background_do);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("MSPointerUp", self.onMouseClickHandler);
				}
				self.screen.addEventListener("click", self.onMouseClickHandler);
			}else if(self.screen.addEventListener){
				self.screen.addEventListener("mouseover", self.onMouseOverHandler);
				self.screen.addEventListener("click", self.onMouseClickHandler);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOverHandler);
				self.screen.attachEvent("onclick", self.onMouseClickHandler);
			}
			
			self.mainTextHolder_do = new FWDSISCTransformDisplayObject("div");
			if(self.HTMLTextAlignment_str == "top" && HTMLTextPosition_str == "inside"){
				self.mainTextHolder_do.screen.className = 'align-top';
			}
			self.mainTextHolder_do.getStyle().transformOrigin = "0% 0%";
			self.mainTextHolder_do.setOverflow("visible");
			self.textHolder_do = new FWDSISCTransformDisplayObject("div");
			self.textHolder_do.getStyle().transformOrigin = "0% 0%";
			self.textHolder_do.getStyle().width = "100%";
			self.mainTextHolder_do.addChild(self.textHolder_do);
			self.addChild(self.mainTextHolder_do);
			
			self.updateTextContent(self.description_ar);
		};
		
		//#########################################//
		/* Update text */
		//########################################//
		this.updateTextContent = function(htmlContent_ar){
			self.htmlContent_ar = [];
			for(var i=0; i<htmlContent_ar.length; i++){
				var mainHtmlElement = new FWDSISCDisplayObject("div");
				mainHtmlElement.getStyle().position = "relative";
				var childHtmlElement = new FWDSISCDisplayObject("div");
				childHtmlElement.getStyle().position = "relative";
				childHtmlElement.setInnerHTML(htmlContent_ar[i]);
				mainHtmlElement.addChild(childHtmlElement);
				self.textHolder_do.addChild(mainHtmlElement);
				self.htmlContent_ar[i] = {mainHtmlElement:mainHtmlElement, childHtmlElement:childHtmlElement};
			}
		};
		
		
		this.animateTextContent = function(animate){
			var dl = 0;
			if(self.showHTMLTextContent_str == "none"){
				if(self.textHolder_do.visible) self.textHolder_do.setVisible(false);
				return;
			}else{
				if(!self.textHolder_do.visible)  self.textHolder_do.setVisible(true);
			}
			
			FWDAnimation.killTweensOf(self.textHolder_do);
			if(self.showHTMLTextContent_str == "center"){
				if(self.id != parent.curId){
					if(animate){
						FWDAnimation.to(self.textHolder_do, .8, {alpha:0, ease:self.transitionType_str});	
					}else{
						self.textHolder_do.setAlpha(0);
					}	
				}else{
					if(animate){
						FWDAnimation.to(self.textHolder_do, .8, {alpha:1});	
					}else{
						self.textHolder_do.setAlpha(1);
					}	
				}
			}
			
			if(self.id == parent.curId){
				if(self.link && self.link != "none" && self.link.length > 4){
					setTimeout(function(){
						self.allowToOpenLink_bl = true;
					}, 200);
					if(!parent.addDragSupport_bl && !parent.displayVertical_bl) self.setButtonMode(true);
				}else{
					self.allowToOpenLink_bl = false;
					if(!parent.addDragSupport_bl) self.setButtonMode(false);
				}
			}else{
				self.allowToOpenLink_bl = false;
				if(!parent.addDragSupport_bl && !parent.displayVertical_bl) self.setButtonMode(true);
			}
		
		
			if(animationTextType_str == FWDSISC.FADE_FROM_LEFT_TO_RIGHT
			   || animationTextType_str == FWDSISC.MOVE_FROM_LEFT_TO_RIGHT
			  ){
				
				if(animate) dl = self.transitionDuration;
			
				for(var i=0; i<self.htmlContent_ar.length; i++){
					var mainHtmlElement = self.htmlContent_ar[i].mainHtmlElement;
					var childHtmlElement = self.htmlContent_ar[i].childHtmlElement;
					FWDAnimation.killTweensOf(mainHtmlElement);
					if(self.finalX + self.finalW >= 0 && self.finalX < parent.stageWidth + self.finalW){
						childHtmlElement.setWidth(self.finalScaledW - self.borderSize * 2);
						if(self.showHTMLTextContent_str == "all" && !self.isTextContentShowed_bl){		
							if(!self.isTextContentShowed_bl){
								if(animationTextType_str == FWDSISC.FADE_FROM_LEFT_TO_RIGHT){
									mainHtmlElement.getStyle().width = "0%";
									FWDAnimation.to(mainHtmlElement.screen, .8, {css:{width:"100%"}, delay:dl, ease:Expo.easeInOut});
								}else if(animationTextType_str == FWDSISC.MOVE_FROM_LEFT_TO_RIGHT){
									mainHtmlElement.screen.style.left = (-childHtmlElement.screen.firstChild.offsetWidth - 15) + 'px';
									FWDAnimation.to(mainHtmlElement.screen, .8, {css:{left:"0"}, delay:dl, ease:Expo.easeInOut});
								}
							}
							if(i == self.htmlContent_ar.length - 1) self.isTextContentShowed_bl = true;
						}else if(self.showHTMLTextContent_str == "center" && self.id == parent.curId && animate){
							childHtmlElement.setWidth(self.finalScaledW - self.borderSize * 2);
							if(!self.isTextContentShowed_bl){
								if(animationTextType_str == FWDSISC.FADE_FROM_LEFT_TO_RIGHT){
									mainHtmlElement.getStyle().width = "0%";
									FWDAnimation.to(mainHtmlElement.screen, .8, {css:{width:"100%"}, delay:dl, ease:Expo.easeInOut});
								}else if(animationTextType_str == FWDSISC.MOVE_FROM_LEFT_TO_RIGHT){
									mainHtmlElement.setX(-childHtmlElement.screen.firstChild.offsetWidth - 15);
									FWDAnimation.to(mainHtmlElement, .8, {x:0, delay:dl, ease:Expo.easeInOut});
								}
							}
							if(i == self.htmlContent_ar.length - 1 && self.id != parent.curId) self.isTextContentShowed_bl = true;
						}
						
					}
					dl += .2;
				}
			}
	
			if(self.HTMLTextAlignment_str == "bottom" && HTMLTextPosition_str == "inside"){
				self.textHolder_do.setY(self.finalScaledH - self.textHolder_do.getHeight() - self.borderSize * 2);
			}
			
			if(self.showHTMLTextContent_str == "center"){
				self.showFirstTime_bl = true;
			}else{
				self.showFirstTime_bl = false;
			}
		}
		
		//#########################################//
		/* Resize and position */
		//#########################################//
		this.resizeImage = function(animate){		
			//if(self.x < -self.finalW && self.finalX < -self.finalW) return;
			//if(self.x > parent.stageWidth && self.finalX > parent.stageWidth) return;
			
			FWDAnimation.killTweensOf(self);
			FWDAnimation.killTweensOf(self.background_do);
			FWDAnimation.killTweensOf(self.textHolder_do);
			if(self.border_do) FWDAnimation.killTweensOf(self.border_do);
			
			if(animate){
				
				if(parent.data.maxImageHeight == 'fullscreen'){
					FWDAnimation.to(self, self.transitionDuration, {alpha:self.finalAlpha, x:self.finalX, y:0, w:self.finalW, h:self.finalH, ease:self.transitionType_str, onComplete:self.imageOnComplete});
				}else{
					FWDAnimation.to(self, self.transitionDuration, {alpha:self.finalAlpha, x:self.finalX, y:self.finalY, w:self.finalW, h:self.finalH, ease:self.transitionType_str, onComplete:self.imageOnComplete});
				}	
				FWDAnimation.to(self.background_do, self.transitionDuration, {w:self.finalW - (self.borderSize * 2), h:self.finalH - (self.borderSize * 2), ease:self.transitionType_str});
				if(self.border_do) FWDAnimation.to(self.border_do, self.transitionDuration, {w:self.finalW , h:self.finalH, ease:self.transitionType_str});				
			}else{

				self.setAlpha(self.finalAlpha);
				self.setX(self.finalX);
				if(parent.data.maxImageHeight == 'fullscreen'){
					self.setY(0);
				}else{
					self.setY(self.finalY);
				}
				self.setWidth(self.finalW);
				self.setHeight(self.finalH);
				if(self.background_do){
					self.background_do.setWidth(self.finalW - (self.borderSize * 2));
					self.background_do.setHeight(self.finalH - (self.borderSize * 2));
				}
				if(self.border_do){
					self.border_do.setWidth(self.finalW );
					self.border_do.setHeight(self.finalH);
				}

			}
				
			self.tempScale = (self.finalW - self.borderSize * 2) /(self.finalScaledW - self.borderSize * 2);
			if(parent.data.maxImageHeight == 'fullscreen') self.tempScale = 1;
			var textY = self.borderSize;
			if(self.HTMLTextPosition_str == "inside"){
				textY = self.borderSize;
				self.mainTextHolder_do.setX(self.borderSize);
			}else{
				if(self.id == parent.curId){
					textY = self.finalH * self.tempScale;
				}else{
					textY = self.finalH;
				}
				self.mainTextHolder_do.setX(0);
			}
			
			if(animate){
				if(self.HTMLTextPosition_str == "inside"){
					FWDAnimation.to(self.mainTextHolder_do, self.transitionDuration, {y:textY, w:self.finalScaledW - self.borderSize * 2,  scale:self.tempScale, ease:self.transitionType_str});
				}else{
					FWDAnimation.to(self.mainTextHolder_do, self.transitionDuration, {y:textY, w:self.finalScaledW,  scale:self.tempScale, ease:self.transitionType_str});
				}
			}else{
				self.mainTextHolder_do.setY(textY);
				if(self.HTMLTextPosition_str == "inside"){
					self.mainTextHolder_do.setWidth(self.finalScaledW - self.borderSize * 2);
				}else{
					self.mainTextHolder_do.setWidth(self.finalScaledW);
				}
		
				self.mainTextHolder_do.setScale2(self.tempScale);
				if(self.id == parent.curId) self.mainTextHolder_do.setScale2(self.tempScale);
			}
			
			if(self.overlay_do){
				var overlayAlpha = 0;
				if(self.id != parent.curId) overlayAlpha = 1;
				FWDAnimation.killTweensOf(self.overlay_do);
				if(animate){
					FWDAnimation.to(self.overlay_do, self.transitionDuration, {alpha:overlayAlpha, w:self.finalW - self.borderSize * 2, h:self.finalH - self.borderSize * 2,   ease:self.transitionType_str});
				}else{
					self.overlay_do.setAlpha(overlayAlpha);
					self.overlay_do.setX(self.borderSize);
					self.overlay_do.setY(self.borderSize);
					self.overlay_do.setWidth(self.finalW - self.borderSize * 2);
					self.overlay_do.setHeight(self.finalH - self.borderSize * 2);
				}
			}
			
			if(self.prevW != self.finalW && self.prevH !=self.finalH  && self.image_do ){
				FWDAnimation.killTweensOf(self.image_do);
				FWDAnimation.killTweensOf(self.imageHolder_do);
				if(animate){
					FWDAnimation.to(self.imageHolder_do, self.transitionDuration, {x:self.borderSize, y:self.borderSize, w:self.finalW - self.borderSize * 2, h:self.finalH - self.borderSize * 2,   ease:self.transitionType_str});
					if(parent.data.maxImageHeight == 'fullscreen'){
						FWDAnimation.to(self.image_do, self.transitionDuration, {x:Math.round((parent.stageWidth - self.imageFinalW)/2), y:Math.round((parent.stageHeight - self.imageFinalH)/2), w:self.imageFinalW - self.borderSize * 2, h:self.imageFinalH - self.borderSize * 2, ease:self.transitionType_str});
					}else{
						FWDAnimation.to(self.image_do, self.transitionDuration, {x:0, y:0, w:self.finalW - self.borderSize * 2, h:self.finalH - self.borderSize * 2, ease:self.transitionType_str});
					}
					
				}else{
					self.imageHolder_do.setX(self.borderSize);
					self.imageHolder_do.setY(self.borderSize);
					self.imageHolder_do.setWidth(self.finalW - self.borderSize * 2);
					self.imageHolder_do.setHeight(self.finalH - self.borderSize * 2);
					
					if(parent.data.maxImageHeight == 'fullscreen'){
						self.image_do.setX(Math.round((parent.stageWidth - self.imageFinalW)/2));
						self.image_do.setY(Math.round((parent.stageHeight - self.imageFinalH)/2));
						self.image_do.setWidth(self.imageFinalW - self.borderSize * 2);
						self.image_do.setHeight(self.imageFinalH - self.borderSize * 2);
					}else{
						self.image_do.setX(0);
						self.image_do.setY(0);
						self.image_do.setWidth(self.finalW - self.borderSize * 2);
						self.image_do.setHeight(self.finalH - self.borderSize * 2);
					}
				}
			}
			
			this.resizeReflection(animate);	
		}
		self.prevW = self.finalW;
		self.prevH = self.finalH;
		
		this.getTextHeight = function(){
			self.curThumbnailTextContentHeight = Math.round(self.textHolder_do.screen.clientHeight);
			return self.curThumbnailTextContentHeight;
		};
		
		this.addLinkSupport = function(){
			
			self.screen.addEventListener("click", function(e){
				if(!self.allowToOpenLink_bl || self.id != parent.curId) return;
				var viewportMouseCoordinates = FWDSISCUtils.getViewportMouseCoordinates(e);	
				if(FWDSISCUtils.hitTest(self.imageHolder_do.screen, viewportMouseCoordinates.screenX, viewportMouseCoordinates.screenY)){
					window.open(self.link, self.target);
				}
			});
		}
		
		//######################################//
		/* add image */
		//######################################//
		self.setImage = function(image){
			
			self.imageHolder_do = new FWDSISCDisplayObject("div");
			
			self.image_do = new FWDSISCDisplayObject("img");
			self.image_do.setScreen(image);
			
			self.imageHolder_do.addChild(self.image_do);
			self.addChild(self.imageHolder_do);
			self.addChild(self.mainTextHolder_do);
			
			if(parent.data.maxImageHeight == 'fullscreen'){
				self.imageHolder_do.setX(parent.stageWidth/2);
				self.imageHolder_do.setY(parent.stageHeight/2);
				self.image_do.setX(-self.imageFinalW /2 + self.borderSize);
				self.image_do.setY(-self.imageFinalH /2 + self.borderSize);
				self.image_do.setWidth(self.imageFinalW - self.borderSize * 2);
				self.image_do.setHeight(self.imageFinalH - self.borderSize * 2);

				FWDAnimation.to(self.image_do, .8, {x:(parent.stageWidth - self.imageFinalW)/2, y:(parent.stageHeight - self.imageFinalH)/2,  ease:Expo.easeInOut});
				FWDAnimation.to(self.imageHolder_do, .8, {x:self.borderSize, y:self.borderSize, w:parent.stageWidth - self.borderSize * 2, h:parent.stageHeight - self.borderSize * 2,   ease:Expo.easeInOut});
			}else{
				self.imageHolder_do.setX(self.finalW/2);
				self.imageHolder_do.setY(self.finalH/2);
				self.image_do.setX(-self.finalW /2 + self.borderSize);
				self.image_do.setY(-self.finalH /2 + self.borderSize);
				self.image_do.setWidth(self.finalW - self.borderSize * 2);
				self.image_do.setHeight(self.finalH - self.borderSize * 2);
				FWDAnimation.to(self.image_do, .8, {x:0, y:0,  ease:Expo.easeInOut});
				FWDAnimation.to(self.imageHolder_do, .8, {x:self.borderSize, y:self.borderSize, w:self.finalW - self.borderSize * 2, h:self.finalH - self.borderSize * 2,   ease:Expo.easeInOut});
			}



			if(self.overlayColor_str.length > 1) self.setupOverlay();
			if(self.showImageReflection_bl) self.addReflection();
			if(parent.id == self.id) self.disable();
		};
		
		this.addReflection = function(){
		
			var imgW = self.finalScaledW - self.borderSize * 2;
			var imgH = self.finalScaledH - self.borderSize * 2;
			
			self.reflHolder_do = new FWDSISCDisplayObject("div");
			//self.reflHolder_do.setOverflow("visible");
			self.reflCanvas_do = new FWDSISCDisplayObject("canvas");
			self.reflHolder_do.addChild(self.reflCanvas_do);
			
			self.reflCanvas_do.screen.width = self.finalScaledW;
			self.reflCanvas_do.screen.height = self.finalScaledH;
			
			var context = self.reflCanvas_do.screen.getContext("2d");
		   
			context.save();
					
			context.translate(0, self.finalScaledH);
			context.scale(1, -1);
			
			//context.fillStyle = self.borderColor_str;
			//context.fillRect(0, 0, self.finalScaledW, self.finalScaledH);
			
			context.drawImage(self.image_do.screen, self.borderSize, self.borderSize, imgW, imgH);

			context.restore();
			
			context.globalCompositeOperation = "destination-out";
			var gradient = context.createLinearGradient(0, 0, 0, self.finalScaledH);
			gradient.addColorStop(0, "rgba(255, 255, 255, " + (1- 0.3) + ")");
			gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");
			context.fillStyle = gradient;
			context.fillRect(0, 0, self.finalScaledW, self.finalScaledH);
		
			self.resizeReflection(false);
			self.addChildAt(self.reflHolder_do, 0);
			
			if(self.finalX > -self.finalW && self.finalX < parent.stageWidth){
				self.reflHolder_do.setX(self.finalW/2);
				self.reflHolder_do.setY(self.finalH/2 + self.finalH);
				self.reflHolder_do.setWidth(0);
				self.reflHolder_do.setHeight(0);
				
				self.reflCanvas_do.setX(-self.finalW /2);
				self.reflCanvas_do.setY(-self.finalH /2);
	
				FWDAnimation.to(self.reflCanvas_do, .8, {x:0, y:0,  ease:Expo.easeInOut});
				FWDAnimation.to(self.reflHolder_do, .8, {x:0, y:self.finalH, w:self.finalW, h:self.finalH, ease:Expo.easeInOut});
			}
		};
		
		this.resizeReflection =  function(animate){
			if(self.showImageReflection_bl && self.reflCanvas_do){
				FWDAnimation.killTweensOf(self.reflCanvas_do);
				if(animate){
					FWDAnimation.to(self.reflCanvas_do, self.transitionDuration, {w:self.finalW, h:self.finalH, ease:self.transitionType_str});
					FWDAnimation.to(self.reflHolder_do, self.transitionDuration, {y:self.finalH, w:self.finalW, h:self.finalH, ease:self.transitionType_str});
					
				}else{
					
					self.reflHolder_do.setWidth(self.finalW);
					self.reflHolder_do.setHeight(self.finalH);
					self.reflCanvas_do.setWidth(self.finalW);
					self.reflCanvas_do.setHeight(self.finalH);
					self.reflHolder_do.setY(self.finalH);
				}
			}
		}
		
		this.setupOverlay = function(){
			self.overlay_do = new FWDSISCDisplayObject("div");
			if(self.overlayColor_str.indexOf("jpg") != -1 || self.overlayColor_str.indexOf("jpeg") != -1 || self.overlayColor_str.indexOf("png") != -1){
				self.overlay_do.getStyle().background = "url('" + self.overlayColor_str + "') repeat";
			}else{
				self.overlay_do.setBkColor(this.overlayColor_str);
			}
			
		
			self.overlay_do.setX(self.borderSize);
			self.overlay_do.setY(self.borderSize);
			self.overlay_do.setWidth(self.finalW - self.borderSize * 2);
			self.overlay_do.setHeight(self.finalH - self.borderSize * 2);
			if(self.id == parent.curId) self.overlay_do.setAlpha(0);
					
			self.addChild(self.overlay_do);
			
			self.overlay_do.setAlpha(0);
			if(self.id != parent.curId) FWDAnimation.to(self.overlay_do, .8, {alpha:1, delay:.1});
		
		}
		
		self.onMouseOverHandler = function(e){
			self.dispatchEvent(FWDSISCThumb.HOVER);
			if(self.isDisabled_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				self.setSelectedState(true);
			}
			self.startToCheckTest();
		};
		
		self.startToCheckTest = function(){
			if(window.addEventListener){
				window.addEventListener("mousemove", self.checkHitTest);
			}else if(document.attachEvent){
				document.detachEvent("onmousemove", self.checkHitTest);
				document.attachEvent("onmousemove", self.checkHitTest);
			}
		};
		
		self.stopToCheckTest = function(){
			if(window.removeEventListener){
				window.removeEventListener("mousemove", self.checkHitTest);
			}else if(document.detachEvent){
				document.detachEvent("onmousemove", self.checkHitTest);
			}
		};
		
		self.checkHitTest = function(e){
			var wc = FWDSISCUtils.getViewportMouseCoordinates(e);
			
			if(!FWDSISCUtils.hitTest(self.screen, wc.screenX, wc.screenY)){
				self.onMouseOutHandler(e);
				self.stopToCheckTest();
			}
		};

		self.onMouseOutHandler = function(e){
			if(self.isDisabled_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				self.setNormalState(true);
			}
		};
	
		self.onMouseClickHandler = function(e){
			if(self.isDisabled_bl || parent.disableThumbClick) return;
			self.dispatchEvent(FWDSISCThumb.CLICK, {id:self.id});
		};
		
		//#########################################//
		/* Set normal/selected display states */
		//########################################//
		self.setNormalState = function(animate){
			if(!self.isSelected_bl || self.id == parent.curId) return;
			self.isSelected_bl = false;
			if(self.overlay_do) FWDAnimation.to(self.overlay_do, .8, {alpha:1, ease:Expo.easeOut});
		};

		self.setSelectedState = function(animate){
			if(self.isSelected_bl || self.id == parent.curId) return;
			self.isSelected_bl = true;
			if(self.overlay_do) FWDAnimation.to(self.overlay_do, .8, {alpha:0, ease:Expo.easeOut});
		};

		//########################################//
		/* show/hide thumb */
		//########################################//
		self.show = function(animate){
			FWDAnimation.killTweensOf(self);
			if(animate){
				FWDAnimation.to(self, self.transitionDuration, {y:0, ease:self.transitionType_str});
			}else{
				self.setY(0);
			}
		};
		
		self.hide = function(animate){	
			FWDAnimation.killTweensOf(self);
			if(animate){
				FWDAnimation.to(self, self.transitionDuration, {y:self.imageOffsetBottom + self.imageH + 2});
			}else{
				self.setY(self.imageOffsetBottom + self.imageH + 2);
			}
		};
		
		self.init();
	};

	/* set prototype */
	FWDSISCThumb.setPrototype = function(){
		FWDSISCThumb.prototype = new FWDSISCDisplayObject("div");
	};
	
	FWDSISCThumb.HOVER =  "onHover";
	FWDSISCThumb.CLICK =  "onClick";
	
	
	FWDSISCThumb.IFRAME = "iframe";
	FWDSISCThumb.IMAGE = "image";
	FWDSISCThumb.FLASH = "flash";
	FWDSISCThumb.AUDIO = "audio";
	FWDSISCThumb.VIDEO = "video";
	FWDSISCThumb.VIMEO= "vimeo";
	FWDSISCThumb.YOUTUBE = "youtube";
	FWDSISCThumb.MAPS = "maps";
	FWDSISCThumb.AJAX = "ajax";
	FWDSISCThumb.HTML = "html";
	
	FWDSISCThumb.prototype = null;
	window.FWDSISCThumb = FWDSISCThumb;
}(window));