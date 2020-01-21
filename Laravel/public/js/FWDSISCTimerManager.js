/* Slide show time manager */
(function(window){
	
	var FWDSISCTimerManager = function(delay){
		
		var self = this;
		var prototpype = FWDSISCTimerManager.prototype;
		
		this.timeOutId;
		this.delay = delay;
		this.isStopped_bl = true;
		
		self.stop = function(){
			if(self.isStopped_bl) return;
			self.pause();
			self.isStopped_bl = true;
			self.dispatchEvent(FWDSISCTimerManager.STOP);
			
		};
		
		self.start = function(){
			if(!self.isStopped_bl) return;
			self.isStopped_bl = false;
			self.timeOutId = setTimeout(self.onTimeHanlder, self.delay);
			self.dispatchEvent(FWDSISCTimerManager.START);
		};
		
		self.pause = function(){
			if(self.isStopped_bl) return;
			clearTimeout(self.timeOutId);
			self.dispatchEvent(FWDSISCTimerManager.PAUSE);
		};
		
		self.resume = function(){
			if(self.isStopped_bl) return;
			clearTimeout(self.timeOutId);
			self.timeOutId = setTimeout(self.onTimeHanlder, self.delay);
			self.dispatchEvent(FWDSISCTimerManager.RESUME);
		};
		
		self.onTimeHanlder = function(){
			self.dispatchEvent(FWDSISCTimerManager.TIME);
		};
	};

	FWDSISCTimerManager.setPrototype = function(){
		FWDSISCTimerManager.prototype = new FWDSISCEventDispatcher();
	};
	
	FWDSISCTimerManager.START = "start";
	FWDSISCTimerManager.STOP = "stop";
	FWDSISCTimerManager.RESUME = "resume";
	FWDSISCTimerManager.PAUSE = "pause";
	FWDSISCTimerManager.TIME = "time";
	
	FWDSISCTimerManager.prototype = null;
	window.FWDSISCTimerManager = FWDSISCTimerManager;
	
}(window));