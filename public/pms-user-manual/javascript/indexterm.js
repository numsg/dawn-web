var SELECTED = "selected__";
var BACKUP_ID = "backup_id__";
var INDEX_ARRAY = new Array();

function opendoc(e) {

	var elm = document.getElementById(SELECTED);

	if (!elm)
		return;

	var alink = getFirstChildByElementName(elm, "a");

	if (!alink)
		return;

	var el = searchFrameEl("content");

	if (el) {
		if (alink.hash == "#_see_also_") {
			var idref = alink.getAttribute("idref");
			if (idref)
				findReference(idref);
		} else
			el.src = alink.className;
	}
}

function search(e, str) {

	if (!str || str.length == 0)
		return;

	removeElementId(SELECTED);

	for ( var i = 0; i < INDEX_ARRAY.length; i++) {
		elm = INDEX_ARRAY[i];

		var text = getFirstTextChild(elm);
		var title = text.nodeValue;

		if (!title || title.length == 0 || title.length < str.length)
			continue;

		if (str.toLowerCase() == title.substr(0, str.length).toLowerCase()) {
			scrollIntoView(window, elm);
			if (text.parentNode.id) {
				text.parentNode.setAttribute(BACKUP_ID, text.parentNode.id);
			}
			text.parentNode.id = SELECTED;
			return;
		}
	}

}

function removeElementId(id) {
	var elm = document.getElementById(id);
	if (elm) {
		var old = elm.getAttribute(BACKUP_ID);
		if (old) {
			elm.setAttribute("id", old);
		} else
			elm.removeAttribute("id");
	}
}

function navigate(e, navigate) {
	if (navigate != 38 && navigate != 40)
		return;

	var elm = document.getElementById(SELECTED);

	if (navigate == 38) { // going up
		if (!elm) {
			var nodes = document.getElementsByTagName("li");

			for ( var i = nodes.length - 1; i >= 0; i--) {
				var node = nodes.item(i);
				if ("item" != node.className && "folder" != node.className)
					continue;
				_showInInputBox(node);
				return;
			}
		} else {
			var node = findPreviousElement(elm);
			while (node) {
				if ("item" != node.className && "folder" != node.className) {
					node = findPreviousElement(node);
				} else {
					break;
				}
			}

			if (node) {
				_showInInputBox(node);
				return;
			}
		}
		return;
	}
	// going down
	if (!elm) {
		var nodes = document.getElementsByTagName("li");

		for ( var i = 0; i < nodes.length; i++) {
			var node = nodes.item(i);
			if ("item" != node.className && "folder" != node.className) {
				continue;
			}
			_showInInputBox(node);
			return;
		}

	} else {
		var node = findNextElement(elm);
		while (node) {
			if (!node.className
					|| ("item" != node.className && "folder" != node.className)) {
				node = findNextElement(node);
			} else {
				break;
			}
		}

		if (node) {
			_showInInputBox(node);
			return;
		}
	}
}

function findPreviousElement(elm) {
	var li = getContainingLI(elm);

	var next = li.previousSibling;

	while (next && (next.nodeType != 1 || ("LI" != next.tagName.toUpperCase())))
		next = next.previousSibling;

	if (next) {
		var node = getLastChildLI(next);
		if (!node)
			return next;

		return node;
	}

	return getPreviousParentLI(li);
}

function findNextElement(elm) {

	var li = getContainingLI(elm);

	var next = getFirstChildLI(li);

	if (next)
		return next;

	next = li.nextSibling;

	while (next && (next.nodeType != 1 || ("LI" != next.tagName.toUpperCase())))
		next = next.nextSibling;

	if (next)
		return next;

	return getNextParentLI(li);
}

function getContainingLI(elm) {
	if (!elm)
		return null;
	while (elm) {
		if (elm.tagName && "LI" == elm.tagName.toUpperCase())
			return elm;
		elm = elm.parentNode;
	}
	return null;
}

function getFirstChildLI(elm) {
	if (!elm)
		return null;

	var nodes = elm.getElementsByTagName("li");

	if (nodes.length > 0)
		return nodes.item(0);

	return null;
}

function getLastChildLI(elm) {
	if (!elm)
		return null;

	var nodes = elm.getElementsByTagName("li");

	if (nodes.length > 0)
		return nodes.item(nodes.length - 1);

	return null;
}

function getNextParentLI(elm) {
	if (!elm)
		return null;
	elm = elm.parentNode;

	while (elm) {
		if (elm.tagName && "LI" == elm.tagName.toUpperCase())
			break;
		elm = elm.parentNode;
	}

	if (!elm)
		return null;

	var next = elm.nextSibling;

	while (next && (next.nodeType != 1 || ("LI" != next.tagName.toUpperCase())))
		next = next.nextSibling;

	if (next)
		return next;

	return getNextParentLI(elm);

}

function getPreviousParentLI(elm) {

	if (!elm)
		return null;

	elm = elm.parentNode;

	while (elm) {
		if (elm.tagName && "LI" == elm.tagName.toUpperCase())
			break;
		elm = elm.parentNode;
	}

	if (!elm)
		return null;

	return elm;
}

function showInInputBox(e) {

	e = (e) ? e : ((event) ? event : null);
	if (!e) {
		alert("can't capture event");
		return false;
	}

	var elem = (e.srcElement) ? e.srcElement : (e.target) ? e.target
			: (e.currentTarget) ? e.currentTarget : null;

	return _showInInputBox(elem);
}

function _showInInputBox(elem) {

	if (!elem)
		return false;

	removeElementId(SELECTED);

	elem.id = SELECTED;

	var text = getFirstTextChild(elem);

	var title = (text) ? text.nodeValue : "";

	var tabs = searchFrameEl('tabToolbarFrame');

	var content = null;

	if (tabs)
		content = getFrameContentDocument(tabs);

	if (!content)
		return false;

	var input = content.getElementById("input");

	if (input) {
		input.value = title;
	}

	return false;

}

function linkOver(e) {
	e = (e) ? e : ((event) ? event : null);
	if (!e) {
		alert("can't capture event");
		return false;
	}

	var elem = (e.srcElement) ? e.srcElement : (e.target) ? e.target
			: (e.currentTarget) ? e.currentTarget : null;

	var el = searchFrameEl("content");

	if (el) {
		while (elem && !elem.className) {
			elem = elem.parentNode;
		}

		el.src = elem.className;
	}
}

function initIndexTerm() {

	initIndexSearch();

	for ( var i = 0; i < document.links.length; i++) {
		document.links[i].onclick = showInInputBox;
		if (!document.links[i].ondblclick)
			document.links[i].ondblclick = linkOver;
	}

	return false;

}

function initIndexSearch() {

	var nodes = document.getElementsByTagName("ul");

	var j = 0;

	for ( var i = 0; i < nodes.length; i++) {
		elm = nodes.item(i);

		if ("primary_index" != elm.className)
			continue;

		var children = elm.childNodes;

		for ( var k = 0; k < children.length; k++) {
			if (children[k].nodeType == 1) {
				INDEX_ARRAY[j++] = children[k];
			}
		}
	}

}

function findReference(reference) {
	removeElementId(SELECTED);
	var elm = document.getElementById(reference);
	if (elm) {
		elm.setAttribute(BACKUP_ID, reference);
		elm.id = SELECTED;
		scrollIntoView(window, elm);
	}
}

function showIdx(reference, e) {
	e = (e) ? e : ((event) ? event : null);

	if (!e)
		return;

	var elem = (e.srcElement) ? e.srcElement : (e.target) ? e.target
			: (e.currentTarget) ? e.currentTarget : null;

	if (!elem)
		return;

	var elm = elem.parentNode.nextSibling;

	if (!elm)
		return;
	if (elm.className == "multidx-hidden") {
		elm.className = "multidx-show"
	} else {
		elm.className = "multidx-hidden"
	}

}