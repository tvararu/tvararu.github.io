var loadCSS = function(path) {
  var cb = function() {
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = path;
    var h = document.getElementsByTagName('head')[0]; h.parentNode.insertBefore(l, h);
  };
  var raf = requestAnimationFrame || window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  if (raf) {
    raf(cb);
  } else {
    window.addEventListener('load', cb);
  }
};

$(document).ready(function() {
  loadCSS('//fonts.googleapis.com/css?family=Source+Sans+Pro:400,600&subset=latin,latin-ext');
  loadCSS('css/main.css');

  document.addEventListener('touchmove', function(evt) {
    evt.preventDefault();
  });

  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;

  var VIEW_ANGLE = 45;
  var ASPECT = WIDTH / HEIGHT;
  var NEAR = 0.1;
  var FAR = 10000;

  var $container = $('.container');

  var renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  var camera = new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR
  );

  var scene = new THREE.Scene();

  scene.add(camera);

  camera.position.z = 300;

  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0x1F181E, 1);

  $container.append(renderer.domElement);

  var particleCount = 1800 / 4;
  var particles = new THREE.Geometry();
  var pMaterial = new THREE.PointCloudMaterial({
    color: 0xFFFFFF,
    size: 20,
    map: THREE.ImageUtils.loadTexture('img/disc.png'),
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });

  for (var p = 0; p < particleCount; p++) {
    var pX = Math.random() * 500 - 250;
    var pY = Math.random() * 500 - 250;
    var pZ = Math.random() * 500 - 250;
    var particle = new THREE.Vector3(pX, pY, pZ);

    particle.velocity = new THREE.Vector3(0, 0, 0);

    particles.vertices.push(particle);
  }

  var particleSystem = new THREE.PointCloud(particles, pMaterial);

  particleSystem.sortParticles = true;

  scene.add(particleSystem);

  var composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));

  var filmEffect = new THREE.ShaderPass(THREE.FilmShader);
  filmEffect.renderToScreen = true;
  composer.addPass(filmEffect);

  function render() {
    // particleSystem.rotation.y += 0.01;
    // filmGrain.uniforms['timer'].value += 0.001;

    var pCount = particleCount;
    while (pCount--) {
      var particle = particles.vertices[pCount];

      ['x', 'y', 'z']
        .map(function(dim) {
          particle.velocity[dim] += _.random(-1, 1) * Math.random() * 0.01 / 2;
          if (particle[dim] > 250 || particle[dim] < -250) {
            particle[dim] = (particle[dim] > 0) ? 250 : -250;
            particle.velocity[dim] *= -0.5;
          }
        });

      particle.add(particle.velocity);
    }

    particleSystem.geometry.verticesNeedUpdate = true;

    composer.render();

    requestAnimationFrame(render);
  }

  render();

//   $('.links .email').html('<a href=\'mailto:&#116;&#104;&#101;&#111;&#64;' +
//   '&#118;&#97;&#114;&#97;&#114;&#117;&#46;&#111;&#114;&#103;\'>Email</a>');
//
//   var browsers = ['-ms-', '-webkit-', '-moz-', '-o-', ''];
//   var $wrapper = $('.container');
//   var $logo = $('#logo');
//
//   var lookAtMouse = function(event) {
//     var cx = Math.ceil($logo.width() / 2.0);
//     var cy = Math.ceil($logo.height() / 2.0);
//
//     var off = $logo.offset();
//     var dx = event.pageX - cx - off.left;
//     var dy = event.pageY - cy - off.top;
//
//     var tiltx = -(dy / cy);
//     var tilty = (dx / cx);
//     var radius = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2));
//     var degree = (radius * 20);
//
//     for (var i = 0, len = browsers.length; i < len; i++) {
//       $logo.css(
//         browsers[i] + 'transform',
//         'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)'
//       );
//     }
//   };
//
//   if (Modernizr.touch) {
//     for (var i = 0, len = browsers.length; i < len; i++) {
//       $logo.css(browsers[i] + 'transition', 'all 0.2s');
//     }
//   } else {
//     $wrapper.mouseenter(function() {
//       for (var i = 0, len = browsers.length; i < len; i++) {
//         $logo.css(browsers[i] + 'transition', 'none');
//       }
//     });
//
//     $wrapper.mouseleave(function() {
//       for (var i = 0, len = browsers.length; i < len; i++) {
//         $logo.css(browsers[i] + 'transition', 'all 0.2s');
//         $logo.css(browsers[i] + 'transform', 'none');
//       }
//     });
//   }
//
//   var impulseLogo = window.Impulse($('#logo-wrapper'))
//     .style('translate', function(x, y) {
//       return x + 'px, ' + y + 'px';
//     });
//
//   var x = (window.innerWidth / 2) - 128;
//   var y = 96;
//
//   $(window).resize(function() {
//     x = (window.innerWidth / 2) - 128;
//   });
//
//   impulseLogo.position(x, y);
//
//   impulseLogo.drag()
//     .on('end', function() {
//       impulseLogo.spring({ tension: 100, damping: 5 }).to(x, y).start();
//     });
//
//   $.Velocity.animate($('.js-velocity-hook'), 'transition.slideUpIn', { duration: 350, stagger: 100 })
//     .then(function() {
//       return $.Velocity.animate($('.js-logo-hook'), 'transition.slideDownIn', { duration: 350 });
//     })
//     .then(function() {
//       return $.Velocity.animate($('#logo-background'), { scale: 0.99 });
//     })
//     .then(function() {
//       return $.Velocity.animate($('#logo-foreground'), { translateZ: 10 });
//     })
//     .then(function() {
//       $wrapper.mousemove(lookAtMouse);
//     });
});
