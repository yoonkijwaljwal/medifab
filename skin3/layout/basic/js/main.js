/** MEDIFAB main.js **/
jQuery(document).ready(function() {

	var homeRoot = document.querySelector('.pg-home');
	if (homeRoot) {
		var heroRoot = homeRoot.querySelector('[data-hero]');
		if (heroRoot) {
			var slides = heroRoot.querySelectorAll('.home-hero__slide');
			var pager = heroRoot.querySelector('[data-hero-pager]');
			var current = 0;
			var timer = null;

			function go(index) {
				if (!slides.length) return;
				current = (index + slides.length) % slides.length;
				slides.forEach(function(slide, i) {
					slide.classList.toggle('is-on', i === current);
				});
				if (pager) {
					pager.querySelectorAll('.home-hero__dot').forEach(function(dot, i) {
						dot.classList.toggle('is-on', i === current);
					});
				}
			}

			function play() {
				stop();
				if (slides.length < 2) return;
				timer = window.setInterval(function() {
					go(current + 1);
				}, 5000);
			}

			function stop() {
				if (timer) {
					window.clearInterval(timer);
					timer = null;
				}
			}

			if (pager && slides.length) {
				pager.innerHTML = '';
				slides.forEach(function(_, i) {
					var btn = document.createElement('button');
					btn.type = 'button';
					btn.className = 'home-hero__dot' + (i === 0 ? ' is-on' : '');
					btn.setAttribute('aria-label', (i + 1) + '번째 배너');
					btn.addEventListener('click', function() {
						go(i);
						play();
					});
					pager.appendChild(btn);
				});
			}

			go(0);
			play();
			heroRoot.addEventListener('mouseenter', stop);
			heroRoot.addEventListener('mouseleave', play);
		}

		var resetMargin = function() {
			var contents = document.getElementById('contents');
			if (contents) contents.style.marginTop = '0px';
		};
		window.addEventListener('scroll', resetMargin, { passive: true });
		resetMargin();
	}

});
