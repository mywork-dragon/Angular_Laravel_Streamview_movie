/* FWDEVPScrubberToolip */
(function (window){
var FWDEVPScrubberToolip = function(
			buttonRef_do,
			bkColor,
			fontColor_str,
			toolTipLabel_str,
			toolTipsButtonsHideDelay
		){
		
		var self = this;
		var prototype = FWDEVPScrubberToolip.prototype;
		
		this.buttonRef_do = buttonRef_do;
		
		this.bkColor = bkColor;
		
		
		this.text_do = null;
		this.pointer_do = null;
	
		this.fontColor_str = fontColor_str;
		this.toolTipLabel_str = toolTipLabel_str;
		
		this.toolTipsButtonsHideDelay = toolTipsButtonsHideDelay * 1000;
		this.pointerWidth = 7;
		this.pointerHeight = 4;
		
		this.showWithDelayId_to;
		
		this.isMobile_bl = FWDEVPUtils.isMobile;
		this.isShowed_bl = true;
	
		//##########################################//
		/* initialize */
		//##########################################//
		this.init = function(){
			self.setOverflow("visible");
			self.setupMainContainers();
			self.setLabel(toolTipLabel_str);
			self.hide();
			self.setVisible(false);
			self.getStyle().backgroundColor = self.bkColor;
			self.getStyle().zIndex = 9999999999999;
			self.getStyle().pointerEvents = "none";

		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		this.setupMainContainers = function(){
			self.pointerHolder_do = new FWDEVPDisplayObject("div");
			self.pointerHolder_do.setOverflow('visible');
			self.addChild(self.pointerHolder_do);

			self.text_do = new FWDEVPDisplayObject("div");
			self.text_do.hasTransform3d_bl = false;
			self.text_do.hasTransform2d_bl = false;
			self.text_do.setBackfaceVisibility();
			self.text_do.setDisplay("inline-block");
			self.text_do.getStyle().fontFamily = "Arial";
			self.text_do.getStyle().fontSize= "12px";
			self.text_do.getStyle().color = self.fontColor_str;

			self.text_do.getStyle().whiteSpace= "nowrap";
			self.text_do.getStyle().fontSmoothing = "antialiased";
			self.text_do.getStyle().webkitFontSmoothing = "antialiased";
			self.text_do.getStyle().textRendering = "optimizeLegibility";
			self.text_do.getStyle().padding = "6px";
			self.text_do.getStyle().paddingTop = "4px";
			self.text_do.getStyle().paddingBottom = "4px";
		
			self.addChild(self.text_do);
			
			self.pointer_do = new FWDEVPDisplayObject("div");
			self.pointer_do.setBkColor(self.bkColor);
			self.pointer_do.screen.style = "border: 4px solid transparent; border-top-color: " + self.bkColor + ";";
			self.pointerHolder_do.addChild(self.pointer_do);
		
		}
		
		//##########################################//
		/* set label */
		//##########################################//
		this.setLabel = function(label){
			
			if(label === undefined ) return;
			self.text_do.setInnerHTML(label);
			setTimeout(function(){
				if(self == null) return;
					self.setWidth(self.text_do.getWidth());
					self.setHeight(self.text_do.getHeight());
					self.positionPointer();
				},20);
		};
		
		this.positionPointer = function(offsetX){
			var finalX;
			var finalY;
			
			if(!offsetX) offsetX = 0;
			
			finalX = parseInt((self.w - 8)/2) + offsetX;
			finalY = self.h;
			self.pointerHolder_do.setX(finalX);
			self.pointerHolder_do.setY(finalY);
			
		};
		
		//##########################################//
		/* show / hide*/
		//##########################################//
		this.show = function(){
			//if(self.isShowed_bl) return;
			self.isShowed_bl = true;
			clearTimeout(self.hideWithDelayId_to);

			FWDAnimation.killTweensOf(self);
			clearTimeout(self.showWithDelayId_to);
			self.showWithDelayId_to = setTimeout(self.showFinal, self.toolTipsButtonsHideDelay);
		};
		
		this.showFinal = function(){
			self.setVisible(true);
			FWDAnimation.to(self, .4, {alpha:1, onComplete:function(){self.setVisible(true);}, ease:Quart.easeOut});
		};
		
		this.hide = function(){
			
			if(!self.isShowed_bl) return;
			clearTimeout(self.hideWithDelayId_to);
			self.hideWithDelayId_to = setTimeout(function(){
				clearTimeout(self.showWithDelayId_to);
				FWDAnimation.killTweensOf(self);
				self.setVisible(false);
				self.isShowed_bl = false;	
				self.setAlpha(0);
			}, 100);
			
		};
		
	
		this.init();
	};
	
	/* set prototype */
	FWDEVPScrubberToolip.setPrototype = function(){
		FWDEVPScrubberToolip.prototype = null;
		FWDEVPScrubberToolip.prototype = new FWDEVPDisplayObject("div");
	};
	
	FWDEVPScrubberToolip.CLICK = "onClick";
	FWDEVPScrubberToolip.MOUSE_DOWN = "onMouseDown";
	
	FWDEVPScrubberToolip.prototype = null;
	window.FWDEVPScrubberToolip = FWDEVPScrubberToolip;
}(window));