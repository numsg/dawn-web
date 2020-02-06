/*
 * default profiling mode is inclusive
*/
var inclusive = true;


/**
* reset drop down manual to the default value
*/
function reset(){

	for (var i=0; i<document.forms.length; i++) {
		var form = document.forms[i];
		for (var j=0; j<form.elements.length; j++){
		    var select = form.elements[j];
			if (select.type == "select-one" || select.type == "select-multiple") {
				var options = select.options;
				for (var k=0; k<options.length; k++) {
					if (k==0) {
						options[k].selected = true;
					} else {
						options[k].selected = false;
					}
				}
			} 
		}
	}
}


/**
* gather all profile values from drop down lists
*/
function getFormValues(doc, form) {
	var f = doc.forms[0];
	
	if (!f)
		return 0;
	
	if (f.name != form)
		return 0;

	var value = new Array(f.elements.length);
	
	for (var i = 0; i < f.elements.length; i++) {
		var e = f.elements[i];
		
		if (e.type =="select-one" || e.type == "select-multiple")
			value[i] = getSelect(f.elements[i]);	
	}
	
	return value;

}
/**
* get values from all selected
*/
function getSelect (elm) {
	var value = 0;
	
	if (!elm)
		return 0;
	
	for (var i=0; i<elm.options.length; i++) {
		if (elm.options[i].selected) {
			value += parseInt(elm.options[i].value, 16);
		}
	}
	
	return value;	
}

/**
* Since javascript cannot handle big integer, we need to break
* profile code into pieces
*
*/
function filter(frame, form) {

	var value = getFormValues(document, form);
	
	var f = searchFrameEl(frame);
	
	var doc;
	
	if (f) {
		doc = getFrameContentDocument(f);	
	}
		
	if (!doc)
		return;
				
	var nodes = doc.getElementsByTagName("li");	
	
	for (var i=0; i<nodes.length; i++) {
	
		var elm = nodes.item(i);
		
		var att = elm.getAttribute("profile");

		var propagated = elm.getAttribute("propagate_profile");
		
		if (match(value, att, inclusive)) {
			show(elm);
		} else {
		  if (match(value, propagated, inclusive)) 
		    disable(elm);
		  else
		    hide(elm);
		}

	}	
	
	for (var i=0; i<nodes.length; i++) { // clear up orphaned folder
		var elm = nodes.item(i);
		var cls = elm.className;
		// node disabled, but no visible item, hide the folder as well
		if ("open-disabled" == cls || "closed-disabled" == cls || "folder-disabled" == cls) {
			var nl = elm.getElementsByTagName("li");
			if (!nl){
				hide(elm);
			}
			
			var hasItem = false;
				
			for (var j=0; j<nl.length; j++){
				if ("item" == nl.item(j).className) {
					hasItem = true;
					break;
				}
			}
			
			if (!hasItem)
				hide(elm);
			
		}
		
		
	}
	
}


/**
*
*
*/
function filterFrameContent(frame, form) {
	var f = searchFrameEl(frame);

	if (!f)
	  return;

	var doc = getFrameContentDocument(f);	

	if (!doc)
		return;

	var value = getFormValues(doc, form);	
	
	f = searchFrameEl("content");

	if (!f)
	  return;
	
	doc = getFrameContentDocument(f);
	if (!doc)
	  return;
	
	_filterContent(doc, value);	
}

/**
*
*/
function filterContent(frame, form) {

	var value = getFormValues(document, form);

	var f = searchFrameEl(frame);

	if (!f)
	  return;
	
	var doc = getFrameContentDocument(f);	
		
	if (!doc)
		return;
		
	_filterContent(doc, value);
}

function _filterContent(doc, value) {

	var nodes = doc.getElementsByTagName("span");	

	for (var i=0; i<nodes.length; i++) {
	
		var elm = nodes.item(i);
		
		var att = elm.getAttribute("profilecode");
		
		if (!att)
		  continue;

		if (match(value, att, inclusive)) {
		  showNode(elm);
		} else {
		  hideNode(doc, elm);
		}

	}	
}

function showNode(elm) {

	if (!elm)
		return;
		
	elm.style.display="";
		
}

function hideNode (doc, elm) {
	if (!elm)
		return;
		
	elm.style.display = "none";

}

function match(array, value, inclusive) {

	if (!array)
		return true;

	if (!value) {
		if (inclusive)
			return true;
		else
			return false;
	}
	
	var v = value;
		
	for (var i=0; i<array.length; i++) {
		
		var t;
		
		if (v.length > 8) {
			t = v.substring(v.length-8, v.length)
			v = v.substring(0, v.length-8);
		} else {
			t = v;
			v = "0";
		}		
		
		var s = parseInt(t, 16);

		if (array[i] == 0) // the profile is not specified 
			continue;
		
		if (inclusive && s == 0)
			continue;
		
		if (s & array[i]) {
			continue;
		} else {
			return false;
		}	
			
	}
	
	return true;
}

function show(elm) {
	if ("item-hidden" == elm.className) {
		elm.className = "item";
	}
	if ("open-hidden" == elm.className) {
		elm.className = "open";
	}
	if ("closed-hidden" == elm.className) {
		elm.className = "closed";
	}
	if ("folder-hidden" == elm.className) {
		elm.className = "folder";
	}
	if ("open-disabled" == elm.className) {
		elm.className = "open";
		enableLink(elm);
	}
	if ("closed-disabled" == elm.className) {
		elm.className = "closed";
		enableLink(elm);
	}
	if ("folder-disabled" == elm.className) {
		elm.className = "folder";
		enableLink(elm);
	}

}

function disable(elm) {
	if ("item" == elm.className) {
		elm.className = "item-hidden";
	}
	if ("open-hidden" == elm.className || "open" == elm.className) {
		elm.className = "open-disabled";
		disableLink(elm);
	}
	if ("closed-hidden" == elm.className || "closed" == elm.className) {
		elm.className = "closed-disabled";
		disableLink(elm);
	}
	if ("folder-hidden" == elm.className || "folder" == elm.className) {
		elm.className = "folder-disabled";
		disableLink(elm);
	}
}

function hide(elm) {

	if ("item" == elm.className) {
		elm.className = "item-hidden";
	}
	if ("open" == elm.className || "open-disabled" == elm.className) {
		elm.className = "open-hidden";
	}
	if ("closed" == elm.className || "closed-disabled" == elm.className) {
		elm.className = "closed-hidden";
	}
	if ("folder" == elm.className || "folder-disabled" == elm.className) {
		elm.className = "folder-hidden";
	}
}



function enableLink(elm) {
  var a = findLink(elm);
  if (a) {
    a.onclick="";
  }
}

function disableLink(elm) {
  var a = findLink(elm);
  if (a) {
    a.onclick=function(){
      return false;
    };
  }
}

function findLink(elm) {
  if (!elm) return 0;

  var img = elm.firstChild;

  if (!img)
    return 0;

  var a = img.nextSibling;

  if (a && "A" == a.nodeName) {
    return a;
  }

  return 0;
}


