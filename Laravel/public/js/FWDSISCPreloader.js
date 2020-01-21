/* Thumb */
(function (window){
	
	var FWDSISCPreloader = function(imageSource_img, segmentWidth, segmentHeight, totalSegments, animDelay){
		
		var self  = this;
		var prototype = FWDSISCPreloader.prototype;
		
		this.imageSource_img = imageSource_img;
		this.image_sdo = null;
		
		this.segmentWidth = segmentWidth;
		this.segmentHeight = segmentHeight;
		this.totalSegments = totalSegments;
		this.animDelay = animDelay || 300;
		this.count = 0;
		
		this.delayTimerId_int;
		this.isShowed_bl = false;
		
		//###################################//
		/* init */
		//###################################//
		this.init = function(){
			self.setWidth(self.segmentWidth);
			self.setHeight(self.segmentHeight);
		
			self.image_sdo = new FWDSISCDisplayObject("img");
			self.image_sdo.setScreen(self.imageSource_img);
			self.addChild(self.image_sdo);
			
			self.hide(false);
		};
		
		//###################################//
		/* start / stop preloader animation */
		//###################################//
		this.start = function(){
			if(self == null) return;
			clearInterval(self.delayTimerId_int);
			self.delayTimerId_int = setInterval(self.updatePreloader, self.animDelay);
		};
		
		this.stop = function(){
			clearInterval(self.delayTimerId_int);
		};
		
		this.updatePreloader = function(){
			if(self == null) return;
			self.count++;
			if(self.count > self.totalSegments - 1) self.count = 0;
			var posX = self.count * self.segmentWidth;
			self.image_sdo.setX(-posX);
		};
		
		
		//###################################//
		/* show / hide preloader animation */
		//###################################//
		this.show = function(){
			if(self.isShowed_bl) return;
			self.setVisible(true);
			self.start();
			FWDAnimation.killTweensOf(self);
			FWDAnimation.to(self, 1, {alpha:1, delay:.2});
			self.isShowed_bl = true;
		};
		
		this.hide = function(animate){
			if(!self.isShowed_bl) return;
			FWDAnimation.killTweensOf(this);
			if(animate){
				FWDAnimation.to(this, 1, {alpha:0, onComplete:self.onHideComplete});
			}else{
				self.setVisible(false);
				self.setAlpha(0);
			}
			self.isShowed_bl = false;
		};
		
		this.onHideComplete = function(){
			self.setVisible(false);
			self.stop();
			self.dispatchEvent(FWDSISCPreloader.HIDE_COMPLETE);
		};
		
		this.init();
	};
	
	/* set prototype */
    FWDSISCPreloader.setPrototype = function(){
    	FWDSISCPreloader.prototype = new FWDSISCDisplayObject("div");
    };
    
    FWDSISCPreloader.HIDE_COMPLETE = "hideComplete";
    
    FWDSISCPreloader.prototype = null;
	window.FWDSISCPreloader = FWDSISCPreloader;
}(window));