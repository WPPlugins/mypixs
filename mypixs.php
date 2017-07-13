<?php
/*
Plugin Name: MyPixs
Plugin URI: http://bertramakers.com/mypixs/wordpress/
Description:
Version: 0.2.1
Author: Bert Ramakers
Author URI: http://bertramakers.com
License: GNU General Public License (GPL) version 3
*/

/* LICENSE :
    Copyright (C) 2007 Bert Ramakers

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

 /*
 // add the mypixs data in every head-tag
 */
 
 function mypixs_header() {
  $path = get_bloginfo("wpurl");
  $fullpath = $path . "/wp-content/plugins";
  ?>
  
  
   <!-- start mypixs, wp plugin -->
   <!-- get this @ bertramakers.com/mypixs/ -->
   <link href="<?php echo $fullpath; ?>/mypixs/mypixs.css" rel="stylesheet" type="text/css" />
   <script type="text/javascript" src="<?php echo $fullpath; ?>/mypixs/mypixs.js"></script>
   <!--[if gte IE 5.5]><![if lt IE 7]><style type="text/css">
    @import '<?php echo $fullpath; ?>/mypixs/iepng.css';
   </style><![endif]><![endif]-->  
   <script type="text/javascript">
    pathToCreateThumbFile = '<?php echo $fullpath; ?>/mypixs/createthumb.php'; // url to the createthumb file
    closeButtonUrl = '<?php echo $fullpath; ?>/mypixs/img/closebutton.png'; // url to the close button image
    loadImageUrl = '<?php echo $fullpath; ?>/mypixs/img/loader.gif'; // url to the load image
    prevButtonImage = '<?php echo $fullpath; ?>/mypixs/img/previousbutton.png'; // url to previous button
    nextButtonImage = '<?php echo $fullpath; ?>/mypixs/img/nextbutton.png'; // url to next button   
   </script>
   <!-- end mypixs -->
   
   
  <?php
 }
 
 add_action("wp_head", "mypixs_header");
 
 
 /*
 // add quicktag to editor
 */
 
 function mypixs_quicktag() {
  
  $url = false;
  $urls = array("post.php", "post-new.php", "page-new.php", "bookmarklet.php");
  for ($u_index = 0; $u_index < count($urls); $u_index++) {
   $this_url = $urls[$u_index];
   if (strstr($_SERVER["REQUEST_URI"], $this_url) == true) {
    $url = true;
   }
  }
  
  if ($url == true) {
   mypixs_header();
   ?>
   
    <link href="<?php echo get_bloginfo('wpurl'); ?>/wp-content/plugins/mypixs/admin.css" rel="stylesheet" type="text/css" />
    <!--[if gte IE 5.5]><![if lt IE 7]><style type="text/css">
     @import '<?php echo get_bloginfo('wpurl'); ?>/wp-content/plugins/mypixs/ieadmin.css';
    </style><![endif]><![endif]--> 
   
    <script type="text/javascript">
     
     var editor_toolbar = document.getElementById("ed_toolbar");
     
     if (editor_toolbar) {
      var newButton = document.createElement("input");
      newButton.type = 'button';
      newButton.value = 'MyPixs';
      newButton.onclick = addMyPixs;
      newButton.className = 'ed_button';
      newButton.title = 'MyPixs';
      newButton.setAttribute("id", "ed_mypixs");
      newButton.style.color = '#143650';
      editor_toolbar.appendChild(newButton);
     }
     
     function addMyPixs() {
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
      
      var holderBody = document.createElement("div");
      holderBody.setAttribute("id", "holderbody");
      holder.appendChild(holderBody);
      
      window.setTimeout("animateHolderSize('550', '450', '', '');", 500);  
      
      insertHolderContent();
     }
     
     function insertHolderContent() {
      var imageHolder = document.getElementById("imageholder");
      var imgs = imageHolder.getElementsByTagName("img");
      
      if (imgs.length > 0) {
                  
       createHolderContent("html");
       createHolderLinks();
       
      } else {
       window.setTimeout("insertHolderContent()", 20);
      }
     }
     
     function createHolderContent(type) {
     
      var holder = document.getElementById("holderbody");
      
      var content = document.createElement("div");
      content.setAttribute("id", "holdercontent");
      
      var h1 = document.createElement("h1");
      h1.innerHTML = 'MyPixs';
      holder.appendChild(h1);
      
      if (type == "html") {
       var infoP = document.createElement("p");
       infoP.innerHTML = 'Enter all the url\'s of your photos below.<br />(All url\'s have to start with "http://")';
       
       var textarea = document.createElement("textarea");
       textarea.className = 'mypixs_urls_textarea';
       textarea.setAttribute("id", "mypixs_htmltextarea");
       textarea.value = 'http://www.mydomain.com/myphoto.jpg';
       
       var submitP = document.createElement("p");
       submitP.className = 'mypixs_html_submit';
       var submitButton = document.createElement("input");
       submitButton.setAttribute("type", "submit");
       submitButton.setAttribute("value", "Insert photos");
       
       if (window.addEventListener) {
        submitButton.addEventListener("click", parseHTMLPhotos, false);
       } else if (window.attachEvent) {
        submitButton.attachEvent("onclick", parseHTMLPhotos);
       }
       
       submitP.appendChild(submitButton);
       
       content.appendChild(infoP);
       content.appendChild(textarea);
       content.appendChild(submitP);
      }
            
      holder.appendChild(content);
      
     }
     
     function createHolderLinks() {
     }
     
     function parseHTMLPhotos() {
      var textarea = document.getElementById("mypixs_htmltextarea");
      var links = textarea.value;
      var linksarray = links.split("http://");
      var newlinks = new Array();
      for (var i = 0; i < linksarray.length; i++) {
       var link = linksarray[i];
       if (link != "") {
        link = removeWhiteSpace(link);
        link = "http://" + link;
        newlinks[newlinks.length] = link;
       }
      }
      insertCodeFromArray(newlinks);
     }
     
     function insertCodeFromArray(array) {
      var allCode = '';
      
      allCode += '<!-- start mypixs photoset -->';
      
      var date = new Date();
      var seconds = date.getSeconds();
      var minutes = date.getMinutes();
      var hour = date.getHours();
      var day = date.getDay();
      var month = date.getMonth();
      var year = date.getYear();
      
      var divId = 'mypixs_' + year + '_' + month + '_' + day + '_' + hour + '_' + minutes + '_' + seconds;
      allCode += '<!-- start div -->';
      allCode += '<div id="' + divId + '">';
      for (var i = 0; i < array.length; i++) {
       var data = array[i];
       allCode += '<img src="' + data + '" />';
      }
      allCode += '<\/div>';
      allCode += '<!-- end div -->';
      allCode += '<script type="text/javascript"> createPhotoSet("' + divId + '"); <\/script>';
      
      allCode += '<!-- end mypixs photoset -->';
      
      editorTextArea = document.getElementById("content");
      edInsertContent(editorTextArea, allCode);
      closeMyPixsHolder();
     }
     
     function closeMyPixsHolder() {
      var fog = document.getElementById("imagefog");
      var holder = document.getElementById("imageholder");
      var body = document.getElementsByTagName("body")[0];
      body.removeChild(fog);
      body.removeChild(holder);     
     }
   
     function removeWhiteSpace(string) {
      var newString = '';
      for (i = 0; i < string.length; i++) {
       if ((string.charAt(i) != " ") && (string.charAt(i) != "\n")) {
        newString += string.charAt(i);
       }
      }
      return newString;
     }    
    </script>
    
   <?php
  }     
 }
 
 add_filter("admin_footer", "mypixs_quicktag");
 
?>