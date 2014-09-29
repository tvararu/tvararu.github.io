var loadCSS = function (path) {
  var cb = function () {
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = path;
    var h = document.getElementsByTagName('head')[0]; h.parentNode.insertBefore(l, h);
  };
  var raf = requestAnimationFrame || mozRequestAnimationFrame ||
      webkitRequestAnimationFrame || msRequestAnimationFrame;
  if (raf) {
    raf(cb);
  } else {
    window.addEventListener('load', cb);
  }
};

$(document).ready(function() {
  loadCSS('http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600&subset=latin,latin-ext');
  loadCSS('css/main.css');

  $('.links .email').html("<a href='mailto:&#116;&#104;&#101;&#111;&#64;" +
  "&#118;&#97;&#114;&#97;&#114;&#117;&#46;&#111;&#114;&#103;'>Email</a>");

  var browsers = ['-ms-', '-webkit-', '-moz-', '-o-', ''];
  var $wrapper = $('.container');
  var $logo = $('#logo');

  var lookAtMouse = function(event) {
    cx = Math.ceil($logo.width() / 2.0);
    cy = Math.ceil($logo.height() / 2.0);

    var off = $logo.offset();
    dx = event.pageX - cx - off.left;
    dy = event.pageY - cy - off.top;

    tiltx = -(dy / cy);
    tilty = (dx / cx);
    radius = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2));
    degree = (radius * 20);

    for (var i = 0, len = browsers.length; i < len; i++) {
      $logo.css(
        browsers[i] + 'transform',
        'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)'
      );
    }
  };

  $wrapper.mousemove(lookAtMouse);

  if (Modernizr.touch) {
    for (var i = 0, len = browsers.length; i < len; i++) {
      $logo.css(browsers[i] + 'transition', 'all 0.2s');
    }
  } else {
    $wrapper.mouseenter(function() {
      for (var i = 0, len = browsers.length; i < len; i++) {
        $logo.css(browsers[i] + 'transition', 'none');
      }
    });

    $wrapper.mouseleave(function() {
      for (var i = 0, len = browsers.length; i < len; i++) {
        $logo.css(browsers[i] + 'transition', 'all 0.2s');
        $logo.css(browsers[i] + 'transform', 'none');
      }
    });
  }

  impulseLogo = Impulse($('#logo-wrapper'))
    .style('translate', function(x, y) {
      return x + 'px, ' + y + 'px';
    });

  var x = (window.innerWidth / 2) - 128;
  var y = 96;
  
  $(window).resize(function () {
    x = (window.innerWidth / 2) - 128;
  });

  impulseLogo.position(x, y);

  impulseLogo.drag()
    .on('move', function () {
      console.log('hi');
    })
    .on('end', function() {
      impulseLogo.spring({ tension: 50, damping: 5 }).to(x, y).start();
    });
});
