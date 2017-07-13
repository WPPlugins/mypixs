 /* MYPIXS JS v0.2.1 */
 
 /* configuration options */
 
 // *note : colors can be edited in the css stylesheet 
 
 //------------------
 // edit the following properties as well in the mypixs.css file
 //
 imageSize = 90; // width of the thumbnail, in px
 imageSurrounding = 6; // space surrounding the thumbnail (padding container, margin, border, etc), in px (default : margin: 5px + border: 1px = 6px)

 imageHolderPadding = 20; // px
 imageHolderBorder = 0; // px 
 
 loadImageSize = 100 // width & height of the load image that appears when opening a photo, in px
 loadImageMargin = loadImageSize / 2 + ((imageHolderPadding + imageHolderBorder) / 2); // do not change this line
 //
 // end css file properties
 //------------------
 
 numberOfColsInSmallSet = 3; // number of columns in set with "amount of photos < 10"
 numberOfColsInMedSet = 4 // number of columns in set with "9 > amount of photos < 26"
 numberOfColsInBigSet = 4 // number of columns in set with "25 > amount of photos"
 
 /*
 pathToCreateThumbFile = '/mypixs/createthumb.php'; // url to the createthumb file
 closeButtonUrl = '/mypixs/img/closebutton.png'; // url to the close button image
 loadImageUrl = '/mypixs/img/loader.gif'; // url to the load image
 prevButtonImage = '/mypixs/img/previousbutton.png'; // url to previous button
 nextButtonImage = '/mypixs/img/nextbutton.png'; // url to next button
 */
  
 /* end configuration options */
  
 /*
  creates a photoset
 */
 function createPhotoSet(id) {
  var obj = document.getElementById(id);
  if (obj) {
   var imagearray = obj.getElementsByTagName("img");
   var array = new Array('');
   for (i = 0; i < imagearray.length; i++) {
    array[i] = imagearray[i].src;   
   }
   createPhotoSetFromArray(id, array);
  } else {
   window.setTimeout("createPhotoSet('" + id + "')", 50);
  }
 }
 
 function createPhotoSetFromArray(id, array) {
  var obj = document.getElementById(id);
  if (obj) {
  
   // preload close button
   var closebutton = new Image();
   closebutton.src = closeButtonUrl;
   
   if (!array[0]) {
    var imageArray = array.split(",");
   } else {
    var imageArray = array;
   }
       
   obj.innerHTML = '';
   obj.className += ' photoset';
   if (window.addEventListener) {
    obj.setAttribute("onclick", 'javascript: expandSet("' + id + '", "open");');
   } else if (window.attachEvent) {
    obj.onclick = function() { expandSet(id, 'open'); }
   }
  
   var numberOfPhotos = imageArray.length;
   if (numberOfPhotos < 10) {
    var numberOfCols = numberOfColsInSmallSet;
   } else if ((numberOfPhotos > 9) && (numberOfPhotos < 26)) {
    var numberOfCols = numberOfColsInMedSet;
   } else {
    var numberOfCols = numberOfColsInBigSet;
   }
   var numberOfRows = Math.ceil(numberOfPhotos / numberOfCols);
    
   var table = document.createElement("table");
   obj.appendChild(table);  
  
   var loaddiv = document.createElement("div");
   loaddiv.className = 'setloading';
   loaddiv.style.backgroundImage = 'url(' + loadImageUrl + ')';
   obj.appendChild(loaddiv);  
  
   var imgNumber = 0;
   for (i = 0; i < numberOfRows; i++) {
    var tr = table.insertRow(i);
    for (t = 0; t < numberOfCols; t++) {
     var td = tr.insertCell(t);
     if (imageArray[imgNumber]) {
      var img = document.createElement("img");
      img.setAttribute("src", pathToCreateThumbFile + "?size=" + imageSize + "&source=" + imageArray[imgNumber]);
      td.appendChild(img);
     } 
     imgNumber += 1;    
    }
   }  
    
   stopLoadingSet(id);
  } else {
   window.setTimeout("createPhotoSet('" + id + "', '" + array + "')", 50);
  }
 } 
 
 function stopLoadingSet(id) {
  var obj = document.getElementById(id);
  var imgs = obj.getElementsByTagName("img");
  var img = imgs[imgs.length - 1];
  if (window.attachEvent) {
   var image = new Image();
   image.src = img.src;
  } else {
   var image = img; 
  }
  if ((image.width == imageSize) || (image.height == imageSize)) {
   var divs = obj.getElementsByTagName("div");
   for (i = 0; i < divs.length; i++) {
    var div = divs[i];
    if (div.className.indexOf("setloading") != -1) {
     div.style.display = 'none';
    }
   }
  } else {
   window.setTimeout("stopLoadingSet('" + id + "')", 100);
  }
 }
 
 /*
  opens or closes a photoset
 */
 function expandSet(id, action) {
  var obj = document.getElementById(id);
  var totalThumbSize = imageSize + (imageSurrounding * 2);
  
  var allRows = obj.getElementsByTagName("tr");
  var totalRows = allRows.length;
  var totalCellsInRow = allRows[0].getElementsByTagName("td").length;
  var totalImgsInRow = allRows[0].getElementsByTagName("img").length;

  if (totalCellsInRow > totalImgsInRow) {
   totalCellsInRow = totalImgsInRow;
  }
    
  var tableLength = totalCellsInRow * totalThumbSize;
  var tableHeight = totalRows * totalThumbSize;
    
  if (action == "close") {
   removeCloseButton(id);
   obj.style.overflow = 'hidden';
   obj.style.cursor = 'pointer';
   if (window.addEventListener) {
    obj.setAttribute('onclick', 'javascript: expandSet("' + id + '", "open");');
   } else if (window.attachEvent) {
    obj.onclick = function() { expandSet(id, "open"); }
   }
  } else if (action == "open") {
   obj.setAttribute("onclick", "");
   obj.onclick = function() { }
   obj.style.cursor = 'default';   
  }
  
  var objWidth = obj.style.width.replace("px", "");
  var objHeight = obj.style.height.replace("px", "");
  if ((objWidth == "") || (objWidth == "undefined") || (objHeight == "") || (objHeight == "undefined")) {
   objWidth = totalThumbSize;
   objHeight = totalThumbSize;   
  } else {
   objWidth = parseInt(objWidth);
   objHeight = parseInt(objHeight);
  }
      
  var mainAdd = 20;
  if (tableLength >= tableHeight) {
   var addWidth = mainAdd;
   if (tableHeight == totalThumbSize) {
    var addHeight = 0;
   } else {
    var addHeight = tableHeight / (tableLength / addWidth);
   } 
  } else {
   var addHeight = mainAdd;
   var addWidth = tableLength / (tableHeight / addHeight);
  }
  
  if (action == "open") {
   var newObjWidth = objWidth + addWidth;
   var newObjHeight = objHeight + addHeight;
  } else if (action == "close") {
   var newObjWidth = objWidth - addWidth;
   var newObjHeight = objHeight - addHeight;
  }
  
  if (((newObjWidth <= tableLength) && (action == "open")) || ((newObjWidth <= tableLength) && (action == "close"))) {
   obj.style.width = newObjWidth + 'px';
  }
  
  if (((newObjHeight <= tableHeight) && (action == "open")) || ((newObjHeight <= tableHeight) && (action == "close"))) {
   obj.style.height = newObjHeight + 'px';
  } 
      
  if (((newObjWidth >= tableLength) && (tableLength >= tableHeight)) || ((newObjHeight > tableHeight) && (tableHeight > tableLength)) && (action == "open")) {
  
   // adjust size to fit perfectly
   var perfectObjWidth = tableLength;
   var perfectObjHeight = tableHeight;
   obj.style.width = perfectObjWidth + 'px';
   obj.style.height = perfectObjHeight + 'px';
   
   var allCells = obj.getElementsByTagName("td");
   for (c = 0; c < allCells.length; c++) {
    var cell = allCells[c];
    var img = cell.getElementsByTagName("img")[0];
    if (img) {
     var imgSrc = img.getAttribute("src");
     imgSrc = filterImgSrc(imgSrc);
     
     if (c > 0) {
      var prevImg = allCells[c - 1].getElementsByTagName("img")[0];
      var prevUrl = filterImgSrc(prevImg.src);
     } else {
      var prevUrl = '';
     }
     
     if (c < allCells.length - 1) {
      var nextImg = allCells[c + 1].getElementsByTagName("img")[0];
      if (nextImg) {
       var nextUrl = filterImgSrc(nextImg.src);
      } else {
       var nextUrl = '';
      }
     } else {
      var nextUrl = '';
     }
     
     var a = document.createElement("a");
     a.setAttribute("href", "javascript: showPhoto('" + imgSrc + "', '" + prevUrl + "', '" + nextUrl + "');");
     a.style.cursor = 'pointer';
     cell.appendChild(a);
     a.appendChild(img);
    } 
   }
   
   obj.style.overflow = 'visible';
   createCloseButton(id, "photoset");
         
  } else if (((newObjWidth <= totalThumbSize) || ((newObjHeight <= totalThumbSize) && (tableHeight != totalThumbSize))) && (action == "close")) {
   
   // adjust size to fit perfectly
   var perfectObjWidth = totalThumbSize;
   var perfectObjHeight = totalThumbSize;
   obj.style.width = perfectObjWidth + 'px';
   obj.style.height = perfectObjHeight + 'px';
   
   var allCells = obj.getElementsByTagName("td");
   for (i = 0; i < allCells.length; i++) {
    var cell = allCells[i];
    var img = cell.getElementsByTagName("img")[0];
    if (img) {
     var a = cell.getElementsByTagName("a")[0];
     cell.removeChild(a);
     cell.appendChild(img);
    } 
   }   
   
  } else {
   window.setTimeout("expandSet('" + id + "', '" + action + "')", 20);
  }
 }
 
 function filterImgSrc(url) {
  var httpCounter = 0;
  var keyword = 'http://';
  var maxCount = 2;
  for (index = 0; index < url.length; index++) {
   var newstring = '';
   for (aIndex = 0; aIndex < keyword.length; aIndex++) {
    var character = url.charAt(index + aIndex);
    newstring += character;
    if (newstring == keyword) {
     httpCounter += 1;
    }
    if ((httpCounter == maxCount) && (newstring == keyword)) {
     var startNumber = index;
    }
   }
  }
  
  if (httpCounter >= maxCount) {
   var newurl = '';
   for (index = startNumber; index < url.length; index++) {
    newurl += url.charAt(index);
   }
  } else {
   newurl = url.replace(pathToCreateThumbFile + '?size=' + imageSize + '&source=', "");
  }
  
  return newurl;
 }
 
 /*
  creates or removes a close button for photosets and opened photos
 */
 function createCloseButton(id, type) {
  var obj = document.getElementById(id);
  
  var closeButton = document.createElement("div");
  closeButton.className = 'closebutton';
  var closeButtonImg = document.createElement("img");
  closeButtonImg.setAttribute("src", closeButtonUrl);
  if (window.attachEvent) {
   closeButton.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + closeButtonUrl + '");';
  }
  closeButton.appendChild(closeButtonImg);
  closeButton.setAttribute("id", type + "_closebutton_" + id);
  closeButtonImg.setAttribute("id", type + "_closebutton_" + id)
  
  if (window.addEventListener) {
   closeButton.addEventListener("click", closeObject, false);
  } else if (window.attachEvent) {
   closeButton.attachEvent("onclick", closeObject);
  }
  
  obj.appendChild(closeButton);
 }
 
 function removeCloseButton(id) {
  var obj = document.getElementById(id);
  var alldivs = obj.getElementsByTagName("div");
  for (i = 0; i < alldivs.length; i++) {
   var div = alldivs[i];
   if (div.className.indexOf("closebutton") != -1) {
    obj.removeChild(div);
   }
  }
 }
 
 /*
  closes an object (photoset or photo)
 */
 
 function closeObject() {
  if (window.addEventListener) {
   var element = this;
  } else {
   var element = event.srcElement;
  }
  
  var id = element.getAttribute("id");
  if (id.indexOf("photoset_") != -1) {
   id = id.replace("photoset_closebutton_", "");
   window.setTimeout("expandSet('" + id + "', 'close')", 1);
  } else if (id == "imageholder_closebutton_imageholder") {
   var fog = document.getElementById("imagefog");
   var holder = document.getElementById("imageholder");
   var body = document.getElementsByTagName("body")[0];
   body.removeChild(fog);
   body.removeChild(holder);
  }
 }
 
 /*
  opens a photo
 */
 function showPhoto(url, prevUrl, nextUrl) {  
  var body = document.getElementsByTagName("body")[0];
  
  if (!document.getElementById("imagefog")) {
   var fog = document.createElement("div");
   fog.setAttribute("id", "imagefog");
   body.appendChild(fog);
  }
  
  var holder = document.createElement("div");
  holder.setAttribute("id", "imageholder");
  holder.style.width = loadImageSize + 'px';
  holder.style.height = loadImageSize + 'px';
  holder.style.marginTop = '-' + loadImageMargin + 'px';
  holder.style.marginLeft = '-' + loadImageMargin + 'px';
  holder.style.backgroundImage = 'url(' + loadImageUrl + ')';
  body.appendChild(holder);
  
  var img = document.createElement("img");
  img.setAttribute("src", url);
  img.style.display = 'none'; // preload image
  img.style.width = img.width + 'px';
  img.style.height = img.height + 'px';
  holder.appendChild(img);
  
  checkImageLoadStatus(url, prevUrl, nextUrl);
 }
 
 function checkImageLoadStatus(url, prevUrl, nextUrl) {
  if ((window.attachEvent) || (navigator.userAgent.indexOf("Safari/4") != -1)) {
   var img = new Image();
   img.src = url;
  } else {
   var img = document.getElementById("imageholder").getElementsByTagName("img")[0];
  } 
  if ((img.width != 0) || (img.height != 0)) {
   window.setTimeout("animateHolderSize(" + img.width + ", " + img.height + ", '" + prevUrl + "', '" + nextUrl + "')", 500);
  } else {
   window.setTimeout("checkImageLoadStatus('" + url + "', '" + prevUrl + "', '" + nextUrl + "')", 200);
  }
 }
 
 function animateHolderSize(newWidth, newHeight, prevUrl, nextUrl) {
  var holder = document.getElementById("imageholder");
  var width = parseInt(holder.style.width.replace("px", ""));
  var height = parseInt(holder.style.height.replace("px", ""));
  holder.style.backgroundImage = '';
    
  var mainAdd = 25;
  if (newWidth > newHeight) {
   var addWidth = mainAdd;
   var addHeight = newHeight / (newWidth / addWidth);
  } else {
   var addHeight = mainAdd;
   var addWidth = newWidth / (newHeight / addHeight);
  }
  addWidth = Math.ceil(addWidth);
  addHeight = Math.ceil(addHeight);
  
  var objWidth = width + addWidth;
  var objHeight = height + addHeight;
  var objMarginRight = (imageHolderPadding + imageHolderBorder) / 2;
  var objMarginBottom = (imageHolderPadding + imageHolderBorder) / 2;
  var objMarginTop = objHeight / 2 + objMarginBottom;
  var objMarginLeft = (objWidth / 2) + objMarginRight;
  
  objWidth = Math.ceil(objWidth);
  objHeight = Math.ceil(objHeight);
  objMarginRight = Math.ceil(objMarginRight);
  objMarginTop = Math.ceil(objMarginTop);
  objMarginLeft = Math.ceil(objMarginLeft)
  
  holder.style.width = objWidth + 'px';
  holder.style.height = objHeight + 'px';
  holder.style.marginLeft = '-' + objMarginLeft + 'px';
  holder.style.marginTop = '-' + objMarginTop + 'px';
  
  if ((objWidth > newWidth) || (objHeight > newHeight)) {
   
   var holderMarginTop = newHeight / 2 + ((imageHolderPadding + imageHolderBorder) / 2);
   var holderMarginLeft = (newWidth / 2) + ((imageHolderPadding + imageHolderBorder) / 2);
   holderMarginTop = Math.ceil(holderMarginTop);
   holderMarginLeft = Math.ceil(holderMarginLeft);
   
   holder.style.height = newHeight + 'px';
   holder.style.width = newWidth + 'px';
   holder.style.marginTop = '-' + holderMarginTop + 'px';
   holder.style.marginLeft = '-' + holderMarginLeft + 'px';
   
   var img = holder.getElementsByTagName("img")[0];
   if (img) {
    img.style.display = 'block';
    img.style.width = newWidth + 'px';
    img.style.height = newHeight + 'px';
   }
   
   createCloseButton("imageholder", "imageholder");
   
   if (prevUrl != "") {
    var prevButton = document.createElement("a");
    prevButton.className = 'prevbutton';
    prevButton.style.backgroundImage = "url(" + prevButtonImage + ")";
    if (window.attachEvent) {
     prevButton.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + prevButtonImage + '")';
    }
    prevButton.setAttribute("href", "javascript: goToPhoto('" + prevUrl + "', '" + nextUrl + "')");
    holder.appendChild(prevButton);
   }
   
   if (nextUrl != "") {
    var nextButton = document.createElement("a");
    nextButton.className = 'nextbutton';
    nextButton.style.backgroundImage = "url(" + nextButtonImage + ")";
    if (window.attachEvent) {
     nextButton.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + nextButtonImage + '")';    
    }
    nextButton.onclick = function() { goToPhoto(nextUrl, prevUrl); }
    nextButton.setAttribute("href", "javascript: goToPhoto('" + nextUrl + "', '" + prevUrl + "')");
    holder.appendChild(nextButton);
   }
   
   // finished animation!
   
  } else {
   window.setTimeout("animateHolderSize(" + newWidth + ", " + newHeight + ", '" + prevUrl + "', '" + nextUrl + "')", 20);
  }
 }
 
 function goToPhoto(url, doubleCheck) {
  var divs = document.getElementsByTagName("*");
  for (i = 0; i < divs.length; i++) {
   var div = divs[i];
   if (div.className.indexOf("photoset") != -1) {
    var imgs = div.getElementsByTagName("img");
    for (a = 0; a < imgs.length; a++) {
     var img = imgs[a];

     if (a >= 2) {
      if (imgs[a - 2].src.indexOf(doubleCheck) != -1) {
       var backImg = true;
      }
     }
     
     if (a < imgs.length - 2) {
      if (imgs[a + 2].src.indexOf(doubleCheck) != -1) {
       var fwdImg = true;
      }
     }
     
     if ((img.src.indexOf(url) != -1) && ((backImg == true) || (fwdImg == true))) {
      if (a != 0) {
       var prevUrl = filterImgSrc(imgs[a - 1].src);
      } else {
       var prevUrl = '';
      }
      if (a != imgs.length - 2) {
       var nextUrl = filterImgSrc(imgs[a + 1].src);
      } else {
       var nextUrl = '';
      }
      deletePhotoHolder();
      showPhoto(url, prevUrl, nextUrl);
     }
    }
   }
  }
 }
 
 function deletePhotoHolder() {
  var holder = document.getElementById("imageholder");
  var body = document.getElementsByTagName("body")[0];
  body.removeChild(holder);
 }