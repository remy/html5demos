<?php
$demos = json_decode(file_get_contents('demos.json'));

function support($support, $url) {
  $browsers = explode(' ', 'ie firefox opera safari chrome'); // big 5 - should I add iPhone (for geo, etc)?

  $live = isset($support->live) ? explode(' ', $support->live) : array();
  $nightly = isset($support->nightly) ? explode(' ', $support->nightly) : array();

  $html = '<span title="unknown browser support" class="yourbrowser tag" id="test-' . $url . '"></span> ';

  foreach ($browsers as $browser) {
    $class = '';
    if (in_array($browser, $live)) {
      $class .= ' live';
    } else if (in_array($browser, $nightly)) {
      $class .= ' nightly';
    } else {
      $class .= ' none';
    }

    $html .= '<span title="' . trim($class) . '" class="tag ' . $browser . $class . '">' . $browser . ':' . $class . '</span> ';
  }

  return $html;
}

function spans($list) {
  $items = explode(' ', $list);
  $html = '';
  foreach ($items as $item) {
    $html .= '<span class="tag">' . $item . '</span> ';
  }

  return $html;
}
?>
<!DOCTYPE html>
<html id="home" lang="en">
<head>
<meta charset=utf-8 />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HTML5 Demos and Examples</title>
<link rel="stylesheet" href="/css/html5demos.css" />
<script src="/js/h5utils.js"></script>
<script src="/js/modernizr.custom.js"></script>
</head>
<body>
<section id="wrapper">
  <script async type="text/javascript" src="//cdn.carbonads.com/carbon.js?zoneid=1673&serve=C6AILKT&placement=html5demoscom" id="_carbonads_js"></script>
    <header>
      <h1><abbr>HTML</abbr> 5 Demos and Examples</h1>
    </header>
    <article>
      <p><abbr>HTML</abbr> 5 experimentation and demos I've hacked together. Click on the browser support icon or the technology tag to filter the demos (the filter is an <code>OR</code> filter).</p>
<?php /*
      <section>
        <a href="http://introducinghtml5.com" id="ih5">
          <p><strong>Introducing HTML5</strong> by Bruce Lawson &amp; Remy Sharp is the first full length book dedicated to HTML5.</p><p>Get it now and kick some HTML5 ass!</p>
        </a>
      </section>
*/ ?>

  <section>
    <a href="https://terminal.training?utm_source=html5demos&utm_medium=banner&utm_campaign=banner" target="_blank" id="promo">
      <img src="/images/terminal-training.png">
    </a>
  </section>
      <p id="tags" class="tags">

      </p>
      <table id="demos">
        <thead>
          <tr>
            <th>Demo</th>
            <th>Support</th>
            <th>Technology</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($demos as $demo) :?>
          <tr>
            <td class="demo"><a href="<?php echo $demo->url?>"><?php echo $demo->desc?></a><?php if (isset($demo->note)) { echo ' <small>' . $demo->note . '</small>'; }?></td>
            <td class="support"><?php echo support($demo->support, $demo->url)?></td>
            <td class="tags"><?php echo spans($demo->tags)?></td>
          </tr>
          <?php endforeach ?>
        </tbody>
      </table>

	<p>All content, code, video and audio is <a rel="license" href="http://creativecommons.org/licenses/by-sa/2.0/uk/">Creative Commons Share Alike 2.0</a></p>
    </article>
    <a id="html5badge" href="http://www.w3.org/html/logo/">
    <img src="https://www.w3.org/html/logo/badge/html5-badge-h-connectivity-device-graphics-multimedia-performance-semantics-storage.png" width="325" height="64" alt="HTML5 Powered with Connectivity / Realtime, Device Access, Graphics, 3D &amp; Effects, Multimedia, Performance &amp; Integration, Semantics, and Offline &amp; Storage" title="HTML5 Powered with Connectivity / Realtime, Device Access, Graphics, 3D &amp; Effects, Multimedia, Performance &amp; Integration, Semantics, and Offline &amp; Storage">
    </a>
    <footer><a id="built" href="https://twitter.com/rem">@rem built this</a></footer>
</section>
<a id="forkme" href="https://github.com/remy/html5demos"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png" alt="Fork me on GitHub" /></a>
<script
  src="https://code.jquery.com/jquery-1.12.4.min.js"
  integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ="
  crossorigin="anonymous"></script>
<script>
(function() {

  var tags = [];
  $(document).delegate('span.tag', 'click', function () {
    var $tag = $(this), tag = $tag.text(), type = $tag.closest('td').attr('class') || 'tags';

    if ($tag.is('.selected')) {
      $('.' + type + ' span:contains(' + tag + ')').removeClass('selected');
    } else {
      $('.' + type + ' span:contains(' + tag + ')').addClass('selected');
    }

    // it's an AND filter
    var $trs = $('.' + type + ':has(span.selected)').closest('tr');
    if ($trs.length) {
      $('tbody tr').hide();
      $trs.show();
    } else {
      $('tbody tr').show();
    }
  });

  var html = [];
  $('.tags span.tag').each(function () {
    var $tag = $(this), tag = $tag.text();

    if (!tags[tag]) {
      tags[tag] = true;
      html.push('<span class="tag">' + tag + '</span> ');
    }
  });

  $('#tags').append('<strong>Filter demos:</strong> ' + html.sort().join(''));

  $.getJSON('demos.json', function (data) {
    var i = data.length, $test;
    while (i--) {
      if (data[i].test && (new Function('return ' + data[i].test))()) {
        $('#test-' + data[i].url).addClass('supported').attr('title', 'your browser is supported');
      } else if (data[i].test) {
        $('#test-' + data[i].url).addClass('not-supported').attr('title', 'your browser is NOT supported');
      }
    }
  });

// $('tr td.demo').click(function () {
//   window.location = $(this).find('a').attr('href');
// });

}());

var _gaq = [['_setAccount', 'UA-1656750-18'], ['_trackPageview']];
(function(d, t) {
  var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
  g.async = 1;
  g.src = '//www.google-analytics.com/ga.js';
  s.parentNode.insertBefore(g, s);
}(document, 'script'));
</script>
</body>
</html>
