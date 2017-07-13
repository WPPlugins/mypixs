<?php 

 $source = $_REQUEST["source"];
 $thumb_size = $_REQUEST["size"];
 
 $size = getimagesize($source);
 $width = $size[0];
 $height = $size[1];
 $type = $size[2];
 
 if ($type == 1) {
  $header = 'gif';
 } else if ($type == 2) {
  $header = 'jpeg';
 } else if ($type == 3) {
  $header = 'png';
 }
 
 header("Content-type: image/" . $header);

 if ($width > $height) {
  $x = ceil(($width - $height) / 2 );
  $width = $height;
 } else if ($height > $width) {
  $y = ceil(($height - $width) / 2);
  $height = $width;
 }

 $new_im = ImageCreatetruecolor($thumb_size,$thumb_size);
 
 if ($type == 1) {
  $im = imagecreatefromgif($source);
 } else if ($type == 2) {
  $im = imagecreatefromjpeg($source);
 } else if ($type == 3) {
  $im = imagecreatefrompng($source);
 }

 imagecopyresampled($new_im,$im,0,0,$x,$y,$thumb_size,$thumb_size,$width,$height);
 
 if ($type == 1) {
  imagegif($new_im);
 } else if ($type == 2) {
  imagejpeg($new_im, null, 100);
 } else if ($type == 3) {
  imagepng($new_im);
 }
  
 imagedestroy($im);
 imagedestroy($new_im);

?>  