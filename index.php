<?php
$demos = json_decode(file_get_contents('demos.json'));

function support($support) {
  $browsers = split(' ', 'ie firefox opera safari chrome'); // big 5 - should I add iPhone (for geo, etc)?

  $live = isset($support->live) ? split(' ', $support->live) : array();
  $nightly = isset($support->nightly) ? split(' ', $support->nightly) : array();
  
  $html = '';
  
  foreach ($browsers as $browser) {
    $class = '';
    if (in_array($browser, $live)) {
      $class .= ' live';
    } else if (in_array($browser, $nightly)) {
      $class .= ' nightly';
    } else {
      $class .= ' none';
    }
    
    $html .= '<span title="' . trim($class) . '" class="' . $browser . $class . '">' . $browser . ':' . $class . '</span> ';
  }
  
  return $html;
}

function spans($list) {
  $items = split(' ', $list);
  $html = '';
  foreach ($items as $item) {
    $html .= '<span>' . $item . '</span> ';
  }
  
  return $html;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset=utf-8 />
<meta name="viewport" content="width=620" />
<title>HTML5 Demos and Examples</title>
<link rel="stylesheet" href="/css/html5demos.css" type="text/css" />
</head>
<body>
<section id="wrapper">
    <header>
      <h1><abbr>HTML</abbr> 5 Demos and Examples</h1>
    </header>
    <article>
      <p><abbr>HTML</abbr> 5 experimentation and demos I've hacked together. Click on the browser support icon or the technology tag to filter the demos (the filter is an <code>and</code> filter).</p>
      <table id="demos">
        <thead>
          <th>Demo</th>
          <th>Support</th>
          <th>Technology</th>
        </thead>
        <tbody>
          <?php foreach ($demos as $demo) :?>
          <tr>
            <td class="demo"><a href="<?=$demo->url?>"><?=$demo->desc?></a><?php if (isset($demo->note)) { echo ' <small>' . $demo->note . '</small>'; }?></td>
            <td class="support"><?=support($demo->support)?></td>
            <td class="tags"><?=spans($demo->tags)?></td>
          </tr>
          <?php endforeach ?>
        </tbody>
      </table>
      
      <!-- <section>
        <a href="http://full-frontal.org" id="ffad" title="JavaScript Conference: Full Frontal, 20th November">
          <img src="http://2009.full-frontal.org/images/ff.gif" alt="Full Frontal Logo" width="70" />
          <p><b>Want to learn more about JavaScript?</b></p>
          <p>Full Frontal is a <strong>JavaScript conference</strong>, <em>run by</em> front end developers <em>for</em> front end developers, held in the UK on 20th November.</p>
          <p>Early bird tickets start at £100. Find out more: <em class="url">http://full-frontal.org</em></p>
        </a>
      </section> -->
	<p>All content, code, video and audio is <a rel="license" href="http://creativecommons.org/licenses/by-sa/2.0/uk/">Creative Commons Share Alike 2.0</a></p>
    </article>
    <footer><a id="built" href="http://twitter.com/rem">@rem built this</a></footer> 
</section>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<script>
$('tr span').click(function () {
  var $tag = $(this), tag = $tag.text(), type = $tag.closest('td').attr('class');
  if ($tag.is('.selected')) {
    $('.' + type + ' span:contains(' + tag + ')').removeClass('selected');
  } else {
    $('.' + type + ' span:contains(' + tag + ')').addClass('selected');
  }

  // it's an AND filter
  var $trs = $('.' + type + ':has(span.selected)').closest('tr');
  if ($trs.length) {
    $('tr').hide();
    $trs.show();
  } else {
    $('tr').show();
  }
});

// $('tr td.demo').click(function () {
//   window.location = $(this).find('a').attr('href');
// });

</script>
<a href="http://github.com/remy/html5demos"><img style="position: absolute; top: 0; left: 0; border: 0;" src="http://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png" alt="Fork me on GitHub" /></a>
<script>
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script>
try {
var pageTracker = _gat._getTracker("UA-1656750-18");
pageTracker._trackPageview();
} catch(err) {}</script>
</body>
</html>
