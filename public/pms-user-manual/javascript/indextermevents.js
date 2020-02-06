					function registerEventListeners() {

						var elm = document.getElementById("input");
						
						if (!elm)
							return;
							
						elm.focus();	
						
						var form = document.indexTerm;
							
						var ind = searchFrameWin("INDEX_TERM");	
						
						if (!ind) {
							alert("Can not locate Index Term winidow");
						}
						
						if (elm.addEventListener) {		
							elm.addEventListener("keyup", 
										function (event) {ind.navigate(event, onArrow(event));},
										true);							
							elm.addEventListener("keyup", 
										function (event) {ind.search(event, onTyping(event));},
										true);
							elm.addEventListener("DOMAttrModified", 
										function (event) {ind.search(event, onPaste(event));},
										true);			
							form.addEventListener("submit", 
										function (event) {ind.opendoc(event);},
										true);											
						} else if (elm.attachEvent) {							
							elm.attachEvent("onkeyup", 
										function (event) {ind.navigate(event, onArrow(event));});						
							elm.attachEvent("onkeyup", 
										function (event) {ind.search(event, onTyping(event));});
							elm.attachEvent("onpaste", 
										function (event) {ind.search(event, onPaste(event));});		
							form.attachEvent("onsubmit", 
										function (event) {ind.opendoc(event);});											
						} else {
							elm.onkeyup = function (event) {ind.search(event, onTyping(event));};
							//elm.onkeydown = function (event) {ind.navigate(event, onArrow(event));};
						}													
					}
	
					function onArrow(e, key) {
						e = (e)? e : ((event)? event : null);
						if (!e) {
							alert("can't capture event");
							return false;	
						}
						
						var key = (e.which)? e.which : e.keyCode;
						
						switch (key) { // arrow keys
					   		case 38:	
					   		case 40:

				   			return key;
					   	}				
					   	
					   	return 0;	
					}

	
					function onTyping(e) {
						e = (e)? e : ((event)? event : null);
						if (!e) {
							alert("can't capture event");
							return false;	
						}
						
						var key = (e.which)? e.which : e.keyCode;
										   	
						key = String.fromCharCode(key);

						var key = (e.which)? e.which : e.keyCode;
						
						switch (key) { // arrow keys
							case 13:
					   		case 38:	
					   		case 40:

				   			return;
					   	}			
					   							
						var elem = (e.srcElement)? e.srcElement : 
							(e.target)? e.target : (e.currentTarget)? e.currentTarget : null;	
							
						if (!elem)
							return;	
						
						return elem.value;
						
					}
					
					function onPaste(e) {
						e = (e)? e : ((event)? event : null);
						if (!e) {
							alert("can't capture event");
							return false;	
						}
						
						var elem = (e.srcElement)? e.srcElement : 
							(e.target)? e.target : (e.currentTarget)? e.currentTarget : null;	
							
						if (!elem)
							return;	
													
						return elem.value + window.clipboardData.getData( "Text" );
						
					}	