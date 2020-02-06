/* Cache frames by ID for easy lookup in the future.
   Also, once the content frame accesses an external
   URL, we lose the ability to scan for it, so it's
   important to have it cached. */
top.frameCache = {};
function scanFrames() {
	searchFrameWin('dummy');
}
window.onload = scanFrames;

function searchFrameWin(frameid) {
	if (top.frameCache[frameid]) return top.frameCache[frameid];
	return _searchFrameWin(top.frames, frameid);
}

function searchFrameEl(frameid) {
	return _searchFrameEl(top.frames, frameid);
}


/**
* Search frame/iframe with the given name in the given frames and their children
* First match will be returned.
*
*/
function _searchFrameWin(frames, frameid) {
	try {
		for (var i = 0; i < frames.length; i++) {
			var frame = frames[i];
			top.frameCache[frame.name] = frame;
			if (frame.name == frameid || frame.document.id == frameid) {
				return frame;
			} else {
				frame = _searchFrameWin(frame.frames, frameid);
				if (frame)
					return frame;
			}			
		}
	}
	catch (e) {
		return null;
	}	
}


/**
* Search frame/iframe element with the given name in the given frames and their children
* First match will be returned.
*
*/
function _searchFrameEl(frames, frameid) {
	
	for (var i = 0; i < frames.length; i++) {
				
		var frame = frames[i];
		
		var doc = frame.document;
		
		var frameEl = (doc)? doc.getElementById(frameid) : null;
		
		if (frameEl)
			return frameEl;
		else	{
			frameEl = _searchFrameEl(frame.frames, frameid);
			if (frameEl)
				return frameEl;
		}
	}
		
	return null;
}


function getWindowHeight(win) {
  var myHeight = 0;
  
  if( typeof( win.innerWidth ) == 'number' ) {
    //Non-IE
    myHeight = win.innerHeight;
  } else if( win.document.documentElement &&
      ( win.document.documentElement.clientWidth || win.document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myHeight = win.document.documentElement.clientHeight;
  } else if( win.document.body && ( win.document.body.clientWidth || windocument.body.clientHeight ) ) {
    //IE 4 compatible
    myHeight = win.document.body.clientHeight;
  }

  return myHeight;
}


function getWindowWidth(win) {
  var myWidth = 0;
  
  if( typeof( win.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = win.innerWidth;
  } else if( win.document.documentElement &&
      ( win.document.documentElement.clientWidth || win.document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = win.document.documentElement.clientWidth;
  } else if( win.document.body && ( win.document.body.clientWidth || win.document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = win.document.body.clientWidth;
  }
  
  return myWidth;
}


function getFrameContentDocument(frame) {
	if (!frame) 
		return null;		
	try {	
		return (frame.contentDocument)? frame.contentDocument : (frame.contentWindow)? frame.contentWindow.document 
	: (frame.document)? frame.document : null;				
	} catch (e) {
		return null;
	}
}


function getFirstLevelChildByElementName(elm, name) {

	name = name.toLowerCase();

	if (elm.tagName) {
		if (name == elm.tagName.toLowerCase())
			return elm;
	}
	elm = elm.firstChild;			

	while (elm) {
		if (elm.tagName) {
			if (name == elm.tagName.toLowerCase())
				return elm;
		}
		elm = elm.nextSibling;					
	}
	
	return null;
}

function getFirstChildByElementName(elm, name) {

	name = name.toLowerCase();

	while (elm) {
		if (elm.tagName) {
			if (name == elm.tagName.toLowerCase())
				return elm;
		}
		elm = elm.firstChild;			
	}
	
	return null;
}

function getFirstTextChild(elm) {
	while(elm) {
		if (elm.nodeType == 3)
			return elm;
		elm = elm.firstChild;	
	}

	return "";	
}

function getQueryStringParam(key)
{
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(top.location.href);
  if(qs == null)
    return null;
  else
    return qs[1];
}

function setStartPage() {
  	var startAt = getQueryStringParam("startat");
    if (startAt) {
   	   var frameWin = searchFrameWin('content');
   	   if (frameWin) {
   	   	var startHash = getQueryStringParam("hash");
   	   	if (startHash)
   	   		startAt += "#" + startHash;
   	   	   frameWin.location.href = startAt;
   	   	   
   	   }
    }
}
