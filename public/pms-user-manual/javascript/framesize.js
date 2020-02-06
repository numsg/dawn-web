/***
	Dependencies: Requires utils.js
****/


var interval;
var frameset;

function adjustFrameSize(framesetname, framename, animated, max, otheroffset, fixed) {
  	
  var iframe = searchFrameEl(framename);
  
  frameset = searchFrameEl(framesetname);
  
  if (!otheroffset)
  	otheroffset = 0;
  
  if (iframe && frameset) {
  
  		var currentHeight = getFirst(frameset.getAttribute("rows"));
  
    	if (iframe.contentDocument) {   
    		
    		var offset;
    		
    		if (fixed) {
    			offset = iframe.Document.body.offsetHeight + otheroffset;
    		} else {
    			offset = max;
    		}
    						
      		if (animated) {
				animateSizeChange(currentHeight, offset, 5, 1);
		    } else 
				frameset.setAttribute("rows", offset +",*");
					
	    } else if (iframe.Document) {	 
    		var offset = iframe.Document.body.scrollHeight + otheroffset;
						
    		if (!offset || offset > max) {
   				offset = max;
   			}

      		if (animated) {
				animateSizeChange(currentHeight, offset, 5, 1);
    		} else {
				frameset.setAttribute("rows", offset +",*");
     			}
   		} 

  }
}


function increaseFrameHeight(max, increment) {
  var height = getFirst(frameset.getAttribute("rows"));

  if (Number(height) >= max) {
    clearInterval(interval);
    return;
  }
  
  height = Number(height) + Number(increment);
  
  frameset.setAttribute("rows", height + ",*");

}

function decreaseFrameHeight(min, increment) {
  var height = getFirst(frameset.getAttribute("rows"));

  if (Number(height) <= min) {
    clearInterval(interval);
    return;
  }
  
  height = Number(height) - Number(increment);
  
  frameset.setAttribute("rows", height + ",*");
}


function animateIncreaseFrameSize(max, increment, timer) {
  var expression = "increaseFrameHeight(" +  max + ", " + increment + ")";
  //alert(expression);
  interval = setInterval(expression, timer);
}

function animateDecreaseFrameSize(min, increment, timer) {
  var expression = "decreaseFrameHeight(" +  min + ", " + increment + ")";
  //alert(expression);
  interval = setInterval(expression, timer);
}

function animateSizeChange (startSize, endSize, increment, timer) {

  if (Number(startSize) == Number(endSize)) {
    return;
  } else if (Number(startSize) < Number(endSize)) {
    //alert("increase size: " + startSize + " " + endSize);
    animateIncreaseFrameSize(endSize, increment, timer);
  } else {
    //alert("decrease size: "  + startSize + " " + endSize);
    animateDecreaseFrameSize(endSize, increment, timer);
  }
}

function getFirst(s) {
	if (!s)
		return s;
	var ar = s.split(",");
	return ar[0];
}

function getSecond(s) {
	if (!s)
		return s;		
	var ar = s.split(",");
	return ar[1];
}



