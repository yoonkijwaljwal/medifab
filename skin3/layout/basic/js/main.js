/** MEDIFAB main.js **/
jQuery(document).ready(function() {

	var homeRoot = document.querySelector('.pg-home');
	if (homeRoot) {
		var heroRoot = homeRoot.querySelector('[data-hero]');
		if (heroRoot) {
			var pager = heroRoot.querySelector('[data-hero-pager]');
			var current = 0;
			var timer = null;
			var slides = [];
			var started = false;

			function tokenEmpty(val) {
				var t = String(val || '').replace(/^\s+|\s+$/g, '');
				return !t || t.indexOf('{#') !== -1;
			}

			function hasMedia(slide) {
				var media = slide.querySelectorAll('img, video, iframe');
				var i;
				for (i = 0; i < media.length; i++) {
					if (media[i].getAttribute('src')) return true;
				}
				return false;
			}

			function tidySlide(slide) {
				var mo = slide.querySelector('.home-hero__mo');
				var pc = slide.querySelector('.home-hero__pc');
				if (mo && !hasMedia(mo) && pc && hasMedia(pc)) {
					mo.style.display = 'none';
					pc.className += (pc.className.indexOf('is-only') === -1 ? ' is-only' : '');
				}
				var brand = slide.querySelector('.home-hero__brand');
				if (brand && tokenEmpty(brand.textContent)) brand.style.display = 'none';
				var title = slide.querySelector('.home-hero__title');
				if (title && tokenEmpty(title.textContent)) title.style.display = 'none';
				var desc = slide.querySelector('.home-hero__desc');
				if (desc && tokenEmpty(desc.textContent)) desc.style.display = 'none';
				var link = slide.querySelector('.home-link');
				if (link && tokenEmpty(link.getAttribute('href'))) link.style.display = 'none';
			}

			function collectSlides() {
				var all = heroRoot.querySelectorAll('.home-hero__slide');
				var out = [];
				var i;
				for (i = 0; i < all.length; i++) {
					tidySlide(all[i]);
					if (hasMedia(all[i])) out.push(all[i]);
					else all[i].style.display = 'none';
				}
				return out;
			}

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

			function buildPager() {
				if (!pager || !slides.length) return;
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

			function startHero() {
				slides = collectSlides();
				if (!slides.length) return false;
				if (started && heroRoot.getAttribute('data-hero-count') === String(slides.length)) return true;
				started = true;
				heroRoot.setAttribute('data-hero-count', String(slides.length));
				heroRoot.classList.add('is-ready');
				buildPager();
				go(0);
				play();
				return true;
			}

			heroRoot.addEventListener('mouseenter', stop);
			heroRoot.addEventListener('mouseleave', play);

			startHero();
			window.addEventListener('load', startHero);
			setTimeout(startHero, 500);
			setTimeout(startHero, 1500);
			setTimeout(startHero, 3000);
			if (typeof MutationObserver !== 'undefined') {
				var obs = new MutationObserver(function() {
					startHero();
				});
				obs.observe(heroRoot, { childList: true, subtree: true, characterData: true, attributes: true });
			}
		}

		var resetMargin = function() {
			var contents = document.getElementById('contents');
			if (contents) contents.style.marginTop = '0px';
		};
		window.addEventListener('scroll', resetMargin, { passive: true });
		resetMargin();
	}

});
