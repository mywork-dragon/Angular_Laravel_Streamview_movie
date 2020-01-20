
/* thumbs manager */
(function(window){
	
	var FWDEVPVimeoScreen = function(parent, volume){
		
		var self = this;
		var prototype = FWDEVPVimeoScreen.prototype;
		
		this.iframe_do = null;
		this.vimeoPlayer = null;
		
		this.lastQuality_str = "auto";
		
		this.volume = volume;
		
		this.updateVideoId_int;
		this.updatePreloadId_int;
	
		this.controllerHeight = parent.data.controllerHeight;
		this.hasBeenCreatedOnce_bl = true;
		this.hasHours_bl = false;
		this.allowScrubing_bl = false;
		this.hasError_bl = false;
		this.isPlaying_bl = false;
		this.isStopped_bl = true;
		this.isStartEventDispatched_bl = false;
		this.isSafeToBeControlled_bl = false;
		this.isPausedInEvent_bl = true;
		this.isShowed_bl = true;
		this.isCued_bl = false;
		this.isVideoLoaded_bl = false;
		this.isReady_bl = false;
		this.isMobile_bl = FWDEVPUtils.isMobile;
		
		//###############################################//
		/* init */
		//###############################################//
		this.init = function(){
			self.hasTransform3d_bl = false;
			self.hasTransform2d_bl = false;
		
			self.setBackfaceVisibility();
			parent.main_do.addChildAt(self, 1);
			self.resizeAndPosition();
			self.setupVideo();
			self.setupDisableClick();
			self.setBkColor("#000000");
		};
	
		
		//#####################################//
		/* Setup disable click */
		//#####################################//
		this.setupDisableClick = function(){
			self.disableClick_do = new FWDEVPDisplayObject("div");
			self.disableClick_do.setBkColor(parent.backgroundColor_str);	
			self.disableClick_do.setAlpha(0.00000001);
			self.addChild(self.disableClick_do);
		};
		
		this.showDisable = function(){
			if(!parent.tempVidStageWidth || self.disableClick_do.w == self.stageWidth) return;
			self.disableClick_do.setWidth(parent.tempVidStageWidth);
			if(FWDEVPUtils.isIphone){	
				self.disableClick_do.setHeight(parent.tempVidStageHeight - self.controllerHeight);
			}else{
				self.disableClick_do.setHeight(parent.tempVidStageHeight);
			}
		};
		
		this.hideDisable = function(){
			if(self.disableClick_do.w == 0) return;
			self.disableClick_do.setWidth(0);
			self.disableClick_do.setHeight(0);
		};
	
		//###############################################//
		/* Setup youtube video */
		//##############################################//
		this.setupVideo = function(){
			if(self.vimeoPlayer) return;
			self.iframe_do = new FWDEVPDisplayObject("iframe");
			self.iframe_do.hasTransform3d_bl = false;
			self.iframe_do.hasTransform2d_bl = false;
			self.iframe_do.screen.setAttribute("id", parent.instanceName_str + "vimeo");
			if(self.isMobile_bl){
				self.iframe_do.screen.setAttribute("webkitallowfullscreen", "1");
				self.iframe_do.screen.setAttribute("mozallowfullscreen", "1");
				self.iframe_do.screen.setAttribute("allowfullscreen", "1");
			}
			
			self.iframe_do.screen.setAttribute("src", "https://player.vimeo.com/video/76979871" + "?player_id=" + parent.instanceName_str + "vimeo&autoplay=0");
			
			self.iframe_do.getStyle().width = "100%";
			self.iframe_do.getStyle().height = "100%";
			self.iframe_do.setBackfaceVisibility();
			self.addChild(self.iframe_do);
			
			self.vimeoPlayer = new Vimeo.Player(self.iframe_do.screen); 
			self.vimeoPlayer.on('play', function(data) {
			
				self.playHandler();
			});
			
			self.vimeoPlayer.on('pause', function(data) {
				self.pauseHandler();
			});
			
			self.vimeoPlayer.on('loadProgress', function(data) {
				self.loadProgressHandler();
			});
			
			self.vimeoPlayer.on('ended', function(data) {
				self.finishHandler();
			});
			
			self.vimeoPlayer.on('loaded', function(data) {
				self.loadedHandler();
			});
			
			self.vimeoPlayer.ready().then(function(){
				self.readyHandler();
			});
			
			self.blackOverlay_do = new FWDEVPDisplayObject("div");
			self.blackOverlay_do.getStyle().backgroundColor = "#000000";
			self.blackOverlay_do.getStyle().width = "100%";
			self.blackOverlay_do.getStyle().height = "100%";
			self.addChild(self.blackOverlay_do);
			
			//self.setX(-5000);
		};
			
		
		//##############################################//
		/* Resize and position */
		//##############################################//
		this.resizeAndPosition = function(){
			if(!parent.tempVidStageWidth) return;
			self.setWidth(parent.tempVidStageWidth);
			self.setHeight(parent.tempVidStageHeight);
		};

		
		//##############################################//
		/* Set source and initialize player */
		//##############################################//
		this.setSource = function(sourcePath){
			if(sourcePath) self.sourcePath_str = sourcePath;
			self.stopToUpdateSubtitles();
			self.stop();
			var videoId = self.sourcePath_str.match(/[^\/]+$/i);	
		
			self.vimeoPlayer.loadVideo(videoId).then(function(id) {
				if(!parent.isMobile_bl && (parent.data.autoPlay_bl || parent.isThumbClick_bl) || parent.isAdd_bl || parent.wasAdd_bl){
					parent.play();
				}
				self.setVolume(parent.volume);
			}).catch(function(error) {
				if(console) console.log(error);
				self.displayErrorId_to = setTimeout(function(){
					self.dispatchEvent(FWDEVPVimeoScreen.ERROR, {error:error.name});
				} , 2000);
				if(console) console.log(error);
			});
		};
		
		//########################################//
		/* Ready handler */
		//########################################//
		this.readyHandler = function(){
			
			clearTimeout(self.intitErrorId_to);
			if(self.contains(self.blackOverlay_do)){
				clearTimeout(self.removeChildWithDelayId_to);
				self.removeChildWithDelayId_to = setTimeout(function(){
					self.removeChild(self.blackOverlay_do);
				}, 1500);
			}
			self.resizeAndPosition();
			
			
			if(self.isReady_bl){
				try{
					self.vimeoPlayer.api("setColor", '#FFFFFF');
				}catch(e){}
				if(parent.videoType_str == FWDEVPlayer.VIMEO) self.setX(0);
				if(parent.data.autoPlay_bl) parent.play();
			
				return;
			}
			self.isReady_bl = true;
		
			self.dispatchEvent(FWDEVPVimeoScreen.READY);
		};
		
		this.loadedHandler = function(){
			self.isVideoLoaded_bl = true;
		};
		
		this.playHandler = function(){
				
			//if(self.isPlaying_bl ) return;
			//if(!self.isSafeToBeControlled_bl){
				clearInterval(self.startToPlayWithDelayId_to);
				clearTimeout(self.displayErrorId_to);
				self.isStopped_bl = false;
				self.isSafeToBeControlled_bl = true;
				self.isPlaying_bl = true;
				self.startToUpdateSubtitles();
				self.startToUpdate();
			
				self.dispatchEvent(FWDEVPVimeoScreen.SAFE_TO_SCRUBB);
				self.dispatchEvent(FWDEVPVimeoScreen.PLAY);
				self.hasHours_bl = Math.floor(self.getDuration() / (60 * 60)) > 0;
			
				
			//}
			
		};
		
		this.loadProgressHandler = function(e){
			if(self.isShowed_bl) return;
			self.dispatchEvent(FWDEVPVimeoScreen.LOAD_PROGRESS, {percent:e.percent});
		};
		
		this.pauseHandler = function(){
			if(!self.isPlaying_bl ) return;
		
			self.isPlaying_bl = false;
			clearInterval(self.startToPlayWithDelayId_to);
			self.dispatchEvent(FWDEVPVimeoScreen.PAUSE);
			self.stopToUpdate();
		};
		
		this.finishHandler = function(){
			if(parent.data.loop_bl){
				self.stop();
				setTimeout(self.play, 200);
			}
			self.dispatchEvent(FWDEVPVimeoScreen.PLAY_COMPLETE);
		};
	
		//##########################################//
		/* Play / pause / stop methods */
		//##########################################//
		this.play = function(overwrite){
			FWDEVPlayer.curInstance = parent;
			var dl = 200;
			//self.isPlaying_bl = true;
			self.hasError_bl = false;
			if(parent.prevVideoType_str != FWDEVPlayer.VIMEO) dl = 1000;
			self.vimeoPlayer.play();
			if(!self.isMobile_bl) self.isStopped_bl = false;
			
			
		};

		this.pause = function(){
			if(self.isStopped_bl || self.hasError_bl) return;
			//self.isPlaying_bl = false;
			clearInterval(self.startToPlayWithDelayId_to);
			self.vimeoPlayer.pause();
			self.stopToUpdate();
		};
		
		this.togglePlayPause = function(){
			if(self.isPlaying_bl){
				self.pause();
			}else{
				self.play();
			}
		};
		
		this.resume = function(){
			if(self.isStopped_bl) return;
			self.play();
		};
		
		//###########################################//
		/* Updates ... */
		//###########################################//
		this.startToUpdate = function(){
			clearInterval(self.updateVideoId_int);
			self.updateVideoId_int = setInterval(self.updateVideo, 500);

		};
		
		this.stopToUpdate = function(){
			clearInterval(self.updateVideoId_int);
		};
		
		this.updateVideo = function(){
		
			var percentPlayed; 
			if(!self.vimeoPlayer){
				stopToUpdate();
				return;
			}
			
			var totalTime = self.formatTime(self.getDuration());
			var curTime = self.formatTime(self.getCurrentTime());
			
			percentPlayed = self.getCurrentTime()/self.getDuration();
			if(isNaN(percentPlayed)) percentPlayed = 0;
			
			self.dispatchEvent(FWDEVPYoutubeScreen.UPDATE, {percent:percentPlayed});

			self.dispatchEvent(FWDEVPVimeoScreen.UPDATE_TIME, {curTime:curTime , totalTime:totalTime, seconds:parseInt(self.getCurrentTime()), totalTimeInSeconds:self.getCurrentTime()});
		};	
		
		//###########################################//
		/* Event handlers */
		//###########################################//	
		this.stop = function(addEvents){
			self.isVideoLoaded_bl = false;
			if(self.isStopped_bl) return;
			
			clearInterval(self.startToPlayWithDelayId_to);
			clearTimeout(self.displayErrorId_to);
			//if(logger) logger.log("# VIMEO stop #" + parent.instanceName_str);
			self.stopVideo();
			self.stopToUpdateSubtitles();
			
			self.isPlaying_bl = false;
			self.isStopped_bl = true;
			self.isCued_bl = false;
			self.allowScrubing_bl = false;
			self.isSafeToBeControlled_bl = false;
			self.isPausedInEvent_bl = true;
			
			self.stopToUpdate();
			if(!addEvents){
				self.stopVideo();
				self.dispatchEvent(FWDEVPVimeoScreen.STOP);
				//self.dispatchEvent(FWDEVPVimeoScreen.LOAD_PROGRESS, {percent:0});
				//self.dispatchEvent(FWDEVPVimeoScreen.UPDATE_TIME, {curTime:"00:00" , totalTime:"00:00"});
			}
			
		};
		
		this.destroy = function(){
			if(self.iframe_do){
				self.iframe_do.screen.removeAttribute("id", parent.instanceName_str + "vimeo");
				self.removeChild(self.iframe_do);
				self.iframe_do.destroy();
				self.iframe_do = null;
			}
			self.vimeoPlayer = null;
		};
		
		this.stopVideo = function(){
			self.vimeoPlayer.unload().then(function() {
				// the video was unloaded
			}).catch(function(error) {
				// an error occurred
			});
			//self.setSource(self.sourcePath_str);
		};
		

		//########################################//
		/* Various Vimeo API methods */
		//########################################//
		this.startToScrub = function(){
			if(!self.isSafeToBeControlled_bl) return;
			self.allowScrubing_bl = true;
		};
		
		this.stopToScrub = function(){
			if(!self.isSafeToBeControlled_bl) return;
			self.allowScrubing_bl = false;
		};
		
		this.scrubbAtTime = function(duration){
			//if(!self.isSafeToBeControlled_bl) return;
		
			self.vimeoPlayer.setCurrentTime(duration).then(function(seconds) {
				// seconds = the actual time that the player seeked to
			})
		}
		
		this.scrub = function(percent){
			
			if(!self.isSafeToBeControlled_bl) return;
		
			self.vimeoPlayer.setCurrentTime(percent * self.getDuration()).then(function(seconds) {
				// seconds = the actual time that the player seeked to
			})
		};
	
		this.setVolume = function(vol){
			if(vol != undefined) self.volume = vol;
			if(self.vimeoPlayer) self.vimeoPlayer.setVolume(vol);
		};
		
		
		this.getDuration = function(){
			if(!self.isSafeToBeControlled_bl) return;
				self.vimeoPlayer.getDuration().then(function(duration) {
				self.duration = Math.round(duration);
            });
			return self.duration;
		};
		
		this.getCurrentTime = function(){
			if(!self.isSafeToBeControlled_bl) return;
			self.vimeoPlayer.getCurrentTime().then(function(time) {
               self.currentTime = Math.round(time);
            });
			
			return self.currentTime;
		};

		
		//##############################################//
		/* Format time */
		//##############################################//
		this.formatTime = function(secs){
			var hours = Math.floor(secs / (60 * 60));
			
		    var divisor_for_minutes = secs % (60 * 60);
		    var minutes = Math.floor(divisor_for_minutes / 60);

		    var divisor_for_seconds = divisor_for_minutes % 60;
		    var seconds = Math.ceil(divisor_for_seconds);
		    
		    minutes = (minutes >= 10) ? minutes : "0" + minutes;
		    seconds = (seconds >= 10) ? seconds : "0" + seconds;
		    
		    if(isNaN(seconds)) return "00:00";
			if(hours){
				if(hours >= 10) return hours + ":" + minutes + ":" + seconds;
				return "0" + hours + ":" + minutes + ":" + seconds;
			}else{
				 return minutes + ":" + seconds;
			}
		};
		
		//##################################################//
		/* Suntitles */
		//##################################################//
		this.stopToUpdateSubtitles = function(){
			clearInterval(self.startToUpdateSubtitleId_int);	
		}
		
		this.startToUpdateSubtitles = function(){
			clearInterval(self.startToUpdateSubtitleId_int);
			self.startToUpdateSubtitleId_int = setInterval(self.updateSubtitleHandler, 10);
		}
		
		this.updateSubtitleHandler = function(){
			if(!self.getCurrentTime()) return;
			self.dispatchEvent(FWDEVPVimeoScreen.UPDATE_SUBTITLE, {curTime:self.getCurrentTime()});
		}
		
	
		this.init();
	};

	/* set prototype */
	FWDEVPVimeoScreen.setPrototype = function(){
		FWDEVPVimeoScreen.prototype = new FWDEVPDisplayObject("div");
	};
	
	FWDEVPVimeoScreen.UPDATE_SUBTITLE = "updateSubtitle";
	FWDEVPVimeoScreen.SAFE_TO_SCRUBB = "safeToScrub";
	FWDEVPVimeoScreen.READY = "ready";
	FWDEVPVimeoScreen.ERROR = "initError";
	FWDEVPVimeoScreen.UPDATE = "update";
	FWDEVPVimeoScreen.UPDATE_TIME = "updateTime";
	FWDEVPVimeoScreen.LOAD_PROGRESS = "loadProgress";
	FWDEVPVimeoScreen.PLAY = "play";
	FWDEVPVimeoScreen.PAUSE = "pause";
	FWDEVPVimeoScreen.STOP = "stop";
	FWDEVPVimeoScreen.PLAY_COMPLETE = "playComplete";
	FWDEVPVimeoScreen.CUED = "cued";
	FWDEVPVimeoScreen.QUALITY_CHANGE = "qualityChange";


	window.FWDEVPVimeoScreen = FWDEVPVimeoScreen;

}(window));