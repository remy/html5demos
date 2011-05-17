<?php
$request = preg_replace('/[^0-9a-z-_]/', '', preg_replace('/^\//', '', preg_replace('/\/$/', '', preg_replace('/\?.*$/', '', $_SERVER['REQUEST_URI']))));
if (file_exists('demos/' . $request . '.html')) {
  $file = file_get_contents('demos/' . $request . '.html');
  preg_match('/<title>(.*)<\/title>/', $file, $matches);
  $file = preg_replace('/<title>(.*?)<\/title>/', '', $file);
  $title = $matches[1];

  $manifest = '';
  if ($request == 'offlineapp') { // specific change to support <html manifest=xyz>
    $manifest = ' manifest="html5demo.appcache"';
  }
  
  include('includes/header.php');
  echo $file;
  include('includes/footer.php');
} else {
  header("HTTP/1.0 404 Not Found");
  echo 'File not found';
}

?>
