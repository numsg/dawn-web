function _clickOnTab(id, tabframe, viewframe, viewPage, viewTask, tbarframe, toolbarPage, toolbarTask) {
	
	var max = 10;
	
	var tab = searchFrameEl(tabframe);
	
	var doc;
	
	if (tab) {
		doc = getFrameContentDocument(tab);	
	}
	
	if (!doc) {
		doc = document;
	}

	if (!id) id = 0;

	var oElement = null;

	for (var i = 0; i < max; i++)
	{
		oElement = doc.getElementById(i);

		if (!oElement) {
			break;
		}

		if (i == id) {		
			oElement.className = "tabOn";	
		} else {
			oElement.className = "tabOff";			
		}
	}
		
	if (viewframe) {
		var frame = searchFrameEl(viewframe);
		if (frame) {
			var contentDoc = getFrameContentDocument(frame);//(frame.contentDocument)? frame.contentDocument : frame.contentWindow.document;			
			showView(contentDoc, viewTask, viewPage);
		}
	}
	
	_showTabToolbar(tbarframe, toolbarPage);
	//if (doc.body)
		//doc.body.focus();
}


function clickOnTab(id, tabframe, viewframe, view, tbarframe, toolbar) {	
	_clickOnTab(id, tabframe, viewframe, "index.jspx?task="+view, view, tbarframe, "index.jspx?task="+toolbar, toolbar);
}

function _showTabToolbar(tabTBframe, page) {

	var tabFrame = searchFrameWin(tabTBframe);
	
	if (tabFrame && page) {
		tabFrame.location.replace(page);	
	}
	
}

function showTabToolbar(tabTBframe, tb) {
	_showTabToolbar(tabTBframe, "index.jspx?task=" + tb);		
}

function showView(doc, viewname, viewpage) {
	
	if (!doc)
		doc = document;
		
	var frames = doc.getElementsByTagName("iframe");
	
	if (!frames) {
		return true; // no iframe, just return, nothing can be done
	}
		
	if (!viewname) { // use the first iframe, if none specified
		viewname = frames[0].id;
	}		
			
	for (var i = 0; i < frames.length; i++) {
				
		var frame = frames[i];
							
		if (frame.id == viewname || (i == 0 && !viewname)) {
				
			if (!frame.src) {
				frame.src = viewpage; 					
			}
			
			frame.className = "show";
			
			var frameDoc = getFrameContentDocument(frame);
			
			if (frame.contentWindow) {
				frame.contentWindow.focus();
			} else if (frameDoc && frameDoc.body) {
				frameDoc.body.focus();
			}
			
		} else {
			frame.className = "hidden";
		}	
	}
	
	return false;
	
}


function _showPage(view, page) {
	if (!view || !page)
		return;
		
	var frame = searchFrameEl(view);

	if (frame)
		frame.src = page;
}

function showPage(view, task) {
	_showPage(view, "index.jspx?task=" + task);
}
