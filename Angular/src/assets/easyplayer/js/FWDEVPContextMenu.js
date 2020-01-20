/* Context menu */
(function (){
	var FWDEVPContextMenu = function(parent, data){
		
		var self = this;
		var prototype = FWDEVPContextMenu.prototype;
		self.parent = parent;
		
		self.buttonsTest_ar = ['copy_url', 'copy_url_time', 'fullscreen'];
		self.itemsLabels_ar = ['Copy video URL', 'Copy video URL at current time', 'Fullscreen/Normalscreen'];
		self.items_ar = [];
		self.spacers_ar = [];
		
		self.copyURL_do = null;
		self.copyURLTime_do = null;
	
		self.backgroundColor_str = data.contextMenuBackgroundColor_str;
		self.borderColor_str = data.contextMenuBorderColor_str;
		self.spacerColor_str = data.contextMenuSpacerColor_str;
		self.itemNormalColor_str = data.contextMenuItemNormalColor_str;
		self.itemSelectedColor_str = data.contextMenuItemSelectedColor_str;
		self.itemDisabledColor_str = data.contextMenuItemDisabledColor_str;
		self.draggingMode_str = data.startDraggingMode_str;
		self.link_str = data.link_str;
		
		self.borderRadius = 0;
		self.biggestWidth;
		self.totalWidth = 400;
		self.totalHeight = 400;
		self.sapaceBetweenButtons = 7;
		self.padding = 6;
		
		self.getMaxWidthResizeAndPositionId_to;
		
		self.inverseNextAndPrevRotation_bl = data.inverseNextAndPrevRotation_bl;
		self.showScriptDeveloper_bl = data.showScriptDeveloper_bl;
		self.show_bl = false;
		
		self.init = function(){
			
			if(self.itemsLabels_ar || self.showScriptDeveloper_bl){
				self.show_bl = true;
				self.setWidth(self.totalWidth);
				self.setHeight(self.totalHeight);
				self.setBkColor(self.backgroundColor_str);
				self.getStyle().borderColor = self.borderColor_str;
				self.getStyle().borderStyle = "solid";
				self.getStyle().borderRadius = self.borderRadius + "px";
				self.getStyle().borderWidth = "1px";
				self.setVisible(false);
				self.setY(-2000);
				self.parent.main_do.addChild(self);
				
				self.setupLabels();	
				self.setupDeveloperButton();
				self.setupSpacers();
				self.disable();
				self.getMaxWidthResizeAndPositionId_to = setTimeout(self.getMaxWidthResizeAndPosition, 200);
			}
			
			self.addContextEvent();
		};
		

		self.copyText = function(str){
		 	var el = document.createElement('textarea');
		 	el.value = str;
		  	document.body.appendChild(el);
		  	el.select();
		  	document.execCommand('copy');
		  	document.body.removeChild(el);
		};
		
		//##########################################//
		/* Setup context items. */
		//##########################################//
		self.setupLabels = function(){
			var len = self.buttonsTest_ar.length;
			var res;
			var label1_str = "";
			var label2_str = "";
			
			if(!self.itemsLabels_ar) return;
			
			for(var i=0; i<len; i++){
				res = self.buttonsTest_ar[i];	
				if(res == "copy_url"){
					label1_str = self.itemsLabels_ar[i];
					FWDEVPContextMenuButton.setPrototype();
					self.copyURL_do = new FWDEVPContextMenuButton(label1_str, undefined, self.itemNormalColor_str, self.itemSelectedColor_str, self.itemDisabledColor_str);
					self.items_ar.push(self.copyURL_do);
					self.copyURL_do.addListener(FWDEVPContextMenuButton.MOUSE_DOWN, self.copyURLHandler);
					self.addChild(self.copyURL_do);
				}else if(res == "copy_url_time"){
					label1_str = self.itemsLabels_ar[i];
					FWDEVPContextMenuButton.setPrototype();
					self.copyURLTime_do = new FWDEVPContextMenuButton(label1_str, undefined, self.itemNormalColor_str, self.itemSelectedColor_str, self.itemDisabledColor_str);
					self.items_ar.push(self.copyURLTime_do);
					self.copyURLTime_do.addListener(FWDEVPContextMenuButton.MOUSE_DOWN, self.copyURLAtTimeHandler);
					self.addChild(self.copyURLTime_do);
				}else if(res == "fullscreen"){
					if(data.showFullScreenButton_bl){
						str =  self.itemsLabels_ar[i];
						label1_str = str.substr(0, str.indexOf("/"));
						label2_str = str.substr(str.indexOf("/") + 1);
						
						FWDEVPContextMenuButton.setPrototype();
						self.fullScreenButton_do = new FWDEVPContextMenuButton(label1_str, label2_str, self.itemNormalColor_str, self.itemSelectedColor_str, self.itemDisabledColor_str);
						self.items_ar.push(self.fullScreenButton_do);
						self.fullScreenButton_do.addListener(FWDEVPContextMenuButton.MOUSE_DOWN, self.fullScreenStartHandler);
						self.addChild(self.fullScreenButton_do);
					}
				}
			}
		};
		
		self.setupDeveloperButton = function(){
			if(self.showScriptDeveloper_bl){
				if(!self.itemsLabels_ar) self.itemsLabels_ar = [];
				self.itemsLabels_ar.push("&#0169; made by FWD");
				label1_str = "&#0169; made by FWD";
				FWDEVPContextMenuButton.setPrototype();
				self.developerButton_do = new FWDEVPContextMenuButton(label1_str, undefined, self.itemNormalColor_str, self.itemSelectedColor_str, self.itemDisabledColor_str);
				self.developerButton_do.isDeveleper_bl = true;
				self.items_ar.push(self.developerButton_do);
				self.addChild(self.developerButton_do);

			}
		};
		
		self.copyURLAtTimeHandler = function(e){
			var curTime = parent.curTime;
			if(curTime.length == 5) curTime = '00:' + curTime;
			var time_ar = String(curTime).split(':');
			for(var i=0; i<time_ar.length; i++){
				if(time_ar[i] == '00') time_ar[i] = '0';
			}
			var args = FWDEVPUtils.getHashUrlArgs(window.location.hash);
			var href = location.href;
			href = href.replace(/&evpi=.*/i, '');
			href = href.replace(/&t=.*/i, '');
			
			if(location.href.indexOf('?') == -1){
				if(FWDEVPlayer.instaces_ar.length > 1){
					curTime = href + '?&evpi=' + parent.instanceName_str;
				}else{
					curTime = href + '?';
				}
			}else{
				if(FWDEVPlayer.instaces_ar.length > 1){
					curTime = href + '&evpi=' + parent.instanceName_str;
				}else{
					curTime = href;
				}
			}

			if(curTime.indexOf('t=') == -1) curTime = curTime + '&t=' + time_ar[0] +'h' + time_ar[1] +'m' + time_ar[2] +'s';
			self.copyText(curTime);
			self.removeMenuId_to = setTimeout(self.removeFromDOM, 150);
		};
		
		
		self.copyURLHandler = function(e){
			self.copyText(location.href);
			self.removeMenuId_to = setTimeout(self.removeFromDOM, 150);
		};

		//full screen.
		self.fullScreenStartHandler = function(e){
			if(self.fullScreenButton_do.currentState == 0){
				parent.goFullScreen();
			}else if(self.fullScreenButton_do.currentState == 1){
				parent.goNormalScreen();
			}
			self.fullScreenButton_do.onMouseOut();
		};
		
		self.updateFullScreenButton = function(currentState){
			if(!self.fullScreenButton_do) return;
			if(currentState == 0){
				self.fullScreenButton_do.setButtonState(0);
			}else{
				self.fullScreenButton_do.setButtonState(1);
			}
			self.removeMenuId_to = setTimeout(self.removeFromDOM, 150);
		};
		
		
		//########################################//
		/* setup sapcers */
		//########################################//
		self.setupSpacers = function(){
			var totalSpacers = self.items_ar.length - 1;
			var spacer_sdo;
			
			for(var i=0; i<totalSpacers; i++){
				spacer_sdo = new FWDEVPDisplayObject("div");
				self.spacers_ar[i] = spacer_sdo;
				spacer_sdo.setHeight(1);
				spacer_sdo.setBkColor(self.spacerColor_str);
				self.addChild(spacer_sdo);
			};
		};
		
		//########################################//
		/* Get max width and position */
		//#######################################//
		self.getMaxWidthResizeAndPosition = function(){
			var totalItems = self.items_ar.length;
			var item_do;
			var spacer;
			var finalX;
			var finalY;
			self.totalWidth = 0;
			self.totalHeight = 0;
			for(var i=0; i<totalItems; i++){
				item_do = self.items_ar[i];
				if(item_do.getMaxTextWidth() > self.totalWidth) self.totalWidth = item_do.getMaxTextWidth();
			};
			
			for(var i=0; i<totalItems; i++){
				spacer = self.spacers_ar[i - 1];
				item_do = self.items_ar[i];
				item_do.setX(self.padding);
				item_do.setY(10 + (i * (item_do.totalHeight + self.sapaceBetweenButtons)) - self.padding);
				
				if(spacer){
					spacer.setWidth(self.totalWidth + 2);
					spacer.setX(self.padding);
					spacer.setY(parseInt(item_do.getY() - self.sapaceBetweenButtons/2) - 1);
				};
				
				
				item_do.setWidth(self.totalWidth + 2);
				item_do.centerText();
			}
			
			self.totalHeight = item_do.getY() + item_do.totalHeight + 2;
			
			self.setWidth(self.totalWidth + self.padding * 2 + 4);
			self.setHeight(self.totalHeight);
			
			self.setVisible(true);
			self.removeMenuId_to = setTimeout(self.removeFromDOM, 150);
		};
		
		//##########################################//
		/* Add context events. */
		//##########################################//
		self.addContextEvent = function(){
			if(self.parent.main_do.screen.addEventListener){
				self.parent.main_do.screen.addEventListener("contextmenu", self.contextMenuHandler);
			}else{
				self.parent.main_do.screen.attachEvent("oncontextmenu", self.contextMenuHandler);
			}
		};
		
		self.contextMenuHandler = function(e){	

			if(!self.show_bl || !data.showContextmenu_bl){
				if(e.preventDefault){
					e.preventDefault();
				}else{
					return false;
				}	
				return;
			}
			clearTimeout(self.removeMenuId_to);
			self.parent.main_do.addChild(self);

			self.positionButtons(e);
			self.setAlpha(0);
			FWDAnimation.to(self, .4, {alpha:1, ease:Quart.easeOut});
			
			if(window.addEventListener){
				window.addEventListener("mousedown", self.contextMenuWindowOnMouseDownHandler);
				window.addEventListener("mouseup", self.contextMenuWindowOnMouseDownHandler);
			}else{
				document.documentElement.attachEvent("onmousedown", self.contextMenuWindowOnMouseDownHandler);
				document.documentElement.attachEvent("onmouseup", self.contextMenuWindowOnMouseDownHandler);
			}
			
			if(e.preventDefault){
				e.preventDefault();
			}else{
				return false;
			}
		};
		
		self.contextMenuWindowOnMouseDownHandler = function(e){
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);
			
			var screenX =  viewportMouseCoordinates.screenX;
			var screenY =  viewportMouseCoordinates.screenY;
			
			
			if(!FWDEVPUtils.hitTest(self.screen, screenX, screenY)){
				if(window.removeEventListener){
					window.removeEventListener("mousedown", self.contextMenuWindowOnMouseDownHandler);
					window.removeEventListener("mouseup", self.contextMenuWindowOnMouseDownHandler);
				}else{
					document.documentElement.detachEvent("onmousedown", self.contextMenuWindowOnMouseDownHandler);
					document.documentElement.detachEvent("onmouseup", self.contextMenuWindowOnMouseDownHandler);
				}
				self.removeMenuId_to = setTimeout(self.removeFromDOM, 150);
			}
		};
	
		//####################################//
		/* position buttons */
		//####################################//
		self.positionButtons = function(e){
		
			var viewportMouseCoordinates = FWDEVPUtils.getViewportMouseCoordinates(e);
			var parentWidth = self.parent.main_do.getWidth();
			var parentHeight = self.parent.main_do.getHeight();
		
			var localX = viewportMouseCoordinates.screenX - self.parent.main_do.getGlobalX();
			var localY = viewportMouseCoordinates.screenY - self.parent.main_do.getGlobalY();
			var finalX = localX - 2;
			var finalY = localY - 2;
			self.totalWidth = self.getWidth();
			self.totalHeight = self.getHeight();
			
			if(finalX + self.totalWidth > parentWidth - 2) finalX = localX - self.totalWidth;
			if(finalX < 0) finalX = parseInt((parentWidth - self.totalWidth)/2);
			if(finalX < 0) finalX = 0;
			
			if(finalY + self.totalHeight > parentHeight - 2) finalY = localY - self.totalHeight;
			if(finalY < 0) finalY = parseInt((parentHeight - self.totalHeight)/2);
			if(finalY < 0) finalY = 0;
	
			self.setX(finalX);
			self.setY(finalY);			
		};
		
		//########################################//
		/* disable / enable */
		//########################################//
		self.disable = function(){
			if(self.copyURL_do) self.copyURL_do.disable();
			if(self.copyURLTime_do) self.copyURLTime_do.disable();
			
		};
		
		self.enable = function(){
			if(self.copyURL_do) self.copyURL_do.enable();
			if(self.copyURLTime_do) self.copyURLTime_do.enable();
		};
		
		//######################################//
		/* remove from DOM */
		//######################################//
		self.removeFromDOM = function(){
			//if(self.parent.main_do.contains(self)) self.parent.main_do.removeChild(self);
			self.setX(-5000);
		};
		
		self.init();
	};
	
	FWDEVPContextMenu.setPrototype = function(){
		FWDEVPContextMenu.prototype = new FWDEVPDisplayObject("div");
	};
	
	
	FWDEVPContextMenu.prototype = null;
	window.FWDEVPContextMenu = FWDEVPContextMenu;
	
}(window));
