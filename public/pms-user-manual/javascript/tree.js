/*
	Dependencies: Requires utils.js
*/


function topicClicked(e) {
	var	myElement=e.srcElement;
	
	if (!myElement) {
		myElement = e.target;					
	} 
	
	if (!myElement)
		return true;
	
	if (myElement.id)
		document.currentId = myElement.id;
	
	return true;
}

function toggleOpenClose(e) { 
	var	myElement=e.srcElement;
				
	if (!myElement) {
		myElement = e.target;					
	} 
	
	if (!myElement)
		return true;

	while (myElement && "LI" != myElement.tagName.toUpperCase()) {
		myElement = myElement.parentNode;
	}
							
	toggleNode(myElement);
						
	if (myElement.className=="open") {
		  	myElement.className="closed"; 
	} else if (myElement.className=="closed") {
	   	myElement.className="open"; 					 
	} else if (myElement.className=="closed-hidden") {
	   	myElement.className="open-hidden"; 					 
	} else if (myElement.className=="open-hidden") {
	   	myElement.className="closed-hidden"; 					 
	} else if (myElement.className=="closed-disabled") {
	   	myElement.className="open-disabled"; 					 
	} else if (myElement.className=="open-disabled") {
	   	myElement.className="closed-disabled"; 					 
	} else if (myElement.className=="item-hidden") {
	   	myElement.className="item"; 					 
	} else if (myElement.className=="item") {
	   	myElement.className="item-hidden"; 					 
	} else if (myElement.className=="folder-hidden") {
	   	myElement.className="folder"; 					 
	} else if (myElement.className=="folder") {
	   	myElement.className="folder-hidden"; 					 
	} 
		
	if (!e.cancelBubble)
		e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();

	return true;
}

function toggleNode(node) {
	if (!node)
		return;
		
	var img = getFirstLevelChildByElementName(node, "img");
	
	if (img) {
		if (img.src.indexOf(openImage) >= 0) {
			img.src = closedImage;
		} else if (img.src.indexOf(openLinkImage) >= 0){
		 	img.src = closedLinkImage;
		} else if (img.src.indexOf(closedImage) >= 0) {
			img.src = openImage;
		} else if (img.src.indexOf(closedLinkImage) >= 0) {
			img.src = openLinkImage;
		}	
	} 

}

function openNode(node) {
	if (!node)
		return;
		
	var img = getFirstLevelChildByElementName(node, "img");
	
	if (img) {
			if (img.src.indexOf(closedImage) >= 0) {
			img.src = openImage;
		}	else if (img.src.indexOf(closedLinkImage) >= 0) {
			img.src = openLinkImage;
		}
	}

}

function closeNode(node) {
	if (!node)
		return;
		
	var img = getFirstLevelChildByElementName(node, "img");
	
	if (img) {
		if (img.src.indexOf(openImage) >= 0) {
			img.src = closedImage;
		} 	else if (img.src.indexOf(openLinkImage) >= 0){
		 	img.src = closedLinkImage;
		}
	}

	var ul = getFirstLevelChildByElementName(node, "ul");
	if (ul) {
		if (ul.style == "display: block")
			ul.style="display: none";
	}

}


function setSelected(doc, elm) {
	if (elm)
		elm.focus();
}

function openDocById(id, frame) {
	//alert("open: " + id);
	var win = window;
	var doc = document;

	if (!id)
		return;

	var elm = document.getElementById(id);

	if (!elm)
		return;
		
	expandToNode(win, elm);			
	scrollIntoView(win, elm);

	elm.removeAttribute("id");
	
	elm = getFirstLevelChildByElementName(elm, "a");	

	if (elm) {
		elm.focus();
	}	
	
}

function showId(win, id) {
	if (!win || !id)
		return;
	
	var doc = getFrameContentDocument(win);
	
	if (!doc)
		return;
	
	var elm = doc.getElementById(id);
	
	if (!elm) {
		return;
	}
	
	expandToNode(win, elm);			
	setSelected(doc, elm);	
	scrollIntoView(win, elm);
}

function showPath(win, path, showquery, showanchor) {
	if (!win || !path)
		return;

    if (!showquery) {
		var idx = path.indexOf("?");
	
		if (idx != -1)
			path = path.substring(0, idx);
	}
	
	if (!showanchor) {
		idx = path.indexOf("#");
	
		if (idx != -1)
			path = path.substring(0, idx);
	}
	
	var doc = getFrameContentDocument(win);
	
	path = unescape(path);
	
	if (doc) {
		var nodes = doc.getElementsByTagName("a");
		
		if (nodes == null) {
			nodes = doc.getElementsByTagName("A");
		}
	
		var node = null;
					
		if (nodes) {
			for (var i = 0; i < nodes.length; i++) {					
				if (unescape(nodes[i].href) == path) {	
					expandToNode(win, nodes[i]);			
					setSelected(doc, nodes[i]);	
					node = nodes[i];
					break;
				}
			}
		}
		if (node)
			scrollIntoView(win, node);
	
		return;		
	}
}

function expandAll (agent, framename) {

	var win = searchFrameWin(framename);

	if ("server" == agent) {
		
		win.location.replace("index.jspx?task=TOC&expand=true");
	
	} else {
	
		var liNodes = win.document.getElementsByTagName("li");

		if (liNodes) {
			for (var i=0; i < liNodes.length; i++) {
				var node = liNodes[i];
				win.openNode(node);
				if (node.className == "closed")
					node.className = "open";
				else if (node.className == "closed-hidden")
					node.className = "open-hidden";	
				else if (node.className == "closed-disabled")
					node.className = "open-disabled";	
			}	
		}
	}
}

function collapseAll (agent, framename) {

	var win = searchFrameWin(framename);
	
	if ("server" == agent) {
		win.location.replace("index.jspx?task=TOC");
	} else {	
		
		var liNodes = win.document.getElementsByTagName("li");
		
		if (liNodes) {
			for (var i=0; i < liNodes.length; i++) {
				var node = liNodes[i];
				win.closeNode(node);
				if (node.className == "open")
					node.className = "closed";	
				else if (node.className == "open-hidden")
					node.className = "closed-hidden";
				else if (node.className == "open-disabled")
					node.className = "closed-disabled";
			}
		}
		
	}
}

function printToc(toc, content) {
	
	var win = searchFrameWin(toc);
	
	if (!win) {
		alert("Cannot find toc window.");
		return;
	}
	
	var id = win.document.currentId;
	
	if (id) {
		
		var contentWin = searchFrameWin(content);
		if (contentWin) {
			contentWin.focus();
			contentWin.location.href = "_conhtml?id=" + id;
		} else {
			alert("Cannot open print content.");		
		}
		
		showId(win, id);

	} else {
		alert("No topic is selected.");
	}
}

function expandToNode(win, node) {
	if (!win || !node)
		return;
	
	var parent = node.parentNode;
	
	while (parent) {
		if (parent.tagName == "li" || parent.tagName == "LI") {
			win.openNode(parent);
			if (parent.className == "closed") {
				parent.className = "open";
			}
		} else if (parent.tagName == "ul" || parent.tagName == "UL") {
			win.closeNode(parent);
			if (parent.className == "collapsed") {
				parent.className = "expanded";
			}		
		}
		parent = parent.parentNode;
	}
}

/**
 * Scrolls the page to show the specified element
 */
function scrollIntoView(win, node)
{
	node.scrollIntoView();
	win.scrollBy(-100, 0);
}

/**
 * Scrolls the page to show the specified element
 */
function getVerticalScroll(win, node)
{
	if (!win || !node)
		return;
	var doc = getFrameContentDocument(win);
	var nodeTop = getNodeTop(node);
	var nodeBottom = nodeTop + node.offsetHeight;
	var pageTop = 0;
	var pageBottom = 0;
		
	if (doc.body.clientHeight)
	{
		pageTop = doc.body.scrollTop; 
		pageBottom = pageTop + doc.body.clientHeight;
	} 
	else if (win.pageYOffset)
	{
		pageTop = win.pageYOffset;
		pageBottom = pageTop + win.innerHeight - node.offsetHeight;
	}
	
	var scroll = 0;
	if (nodeTop >= pageTop )
	{
		if (nodeBottom <= pageBottom)
			scroll = 0; // already in view
		else
			scroll = nodeBottom - pageBottom;
	}
	else
	{
		scroll = nodeTop - pageTop;
	}

	return scroll;
}


function getNodeTop(node) {
	var top = 0;
	while (node) {
		top += Number(node.offsetTop);
		if (node.tagName && node.tagName == "BODY") {
			break;
		}
		node = node.offsetParent;
	}
	
	return top;
}

function showTOCPath(win, path, showquery, showanchor) {
	var foundPath = false;
	if (!win || !path)
		return foundPath;

    if (!showquery) {
		var idx = path.indexOf("?");
	
		if (idx != -1)
			path = path.substring(0, idx);
	}
	
	if (!showanchor) {
		idx = path.indexOf("#");
	
		if (idx != -1)
			path = path.substring(0, idx);
	}
	
	var doc = getFrameContentDocument(win);
	
	path = unescape(path);
	if (doc) {
		var nodes = doc.getElementsByTagName("a");
		
		if (nodes == null) {
			nodes = doc.getElementsByTagName("A");
		}
	
		var node = null;
					
		if (nodes) {
			for (var i = 0; i < nodes.length; i++) {					
				if (unescape(nodes[i].href).indexOf(path) != -1) {	
					expandToNode(win, nodes[i]);			
					setSelected(doc, nodes[i]);	
					node = nodes[i];
					foundPath = true;
					break;
				}
			}
		}
		if (node)
			scrollIntoView(win, node);
	
		return foundPath;		
	}
}
function showCurrentDocument() {
	var frameWin = searchFrameWin('content');
	var sPath = frameWin.location.pathname.substr(1);
	if (frameWin.location.hash)
		sPath += frameWin.location.hash;
    if (!showTOCPath(searchFrameWin('TOC'), sPath, false, true)) {
    	showTOCPath(searchFrameWin('TOC'), sPath);
    }
}


function getBaseHref(href) {
	var ndx = href.indexOf("?");
	if (ndx >= 0) {
		href = href.substring(0, ndx);
	}
	ndx = href.indexOf("#");
	if (ndx >= 0) {
		href = href.substring(0, ndx);
	}
	return unescape(href);
}

function jumpToAdjascent(next) {
	var frameWin = searchFrameWin('content');
	if (!frameWin) return;
	var path = frameWin.location.pathname.substr(1);
	if (!path) return;
	if (frameWin.location.hash)
		path += frameWin.location.hash;
	
	path = getBaseHref(path);
	
	var tocWin = searchFrameWin('TOC');
	if (!tocWin) return;
	var doc = getFrameContentDocument(tocWin);
	if (!doc) return;
	
	var links = doc.getElementsByTagName('a');
	if (links == null) {
		links = doc.getElementsByTagName('A');
	}
	if (links == null) return;
	
	var linkNdx = -1;
	var href, prevHref, i, j;
	for (i = 0; i < links.length; i++) {
		href = unescape(links[i].href);
		if (href.indexOf(path) != -1) {
			linkNdx = i;
			break;
		}
	}
	if (linkNdx == -1) return;
	
	var nextLinkNdx = linkNdx;
	if (next) {
		// advance to next link to new base href:
		for (i = linkNdx + 1; i < links.length; i++) {
			href = unescape(links[i].href);
			if (href.indexOf(path) == -1) {
				nextLinkNdx = i;
				break;
			}
		}
	} else {
		// go back to a link with a new base href
		// and then on to the first of that new base href.
		for (i = linkNdx - 1; i >= 0; i--) {
			href = unescape(links[i].href);
			if (href.indexOf(path) == -1) {
				if (i == 0) {
					nextLinkNdx = i;
				}
				else {
					prevHref = unescape(getBaseHref(links[i].href));
					j=i-1;
					while ((j >= 0) && links[j].href.indexOf(prevHref) != -1) {
						i = j;
						j--;
					}
					nextLinkNdx = i;
				}
				break;
			}
		}
	}

	if (nextLinkNdx != linkNdx) {
		frameWin.document.location = links[nextLinkNdx].href;
	}

	setSelected(doc, links[linkNdx]);
}
