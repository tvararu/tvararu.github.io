$(document).ready(function() {
  var browsers = ['-ms-', '-webkit-', '-moz-', '-o-', ''];
  var $wrapper = $('.container');
  var $logo = $('#logo');

  $wrapper.mousemove(function(event) {
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
  });

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
});
