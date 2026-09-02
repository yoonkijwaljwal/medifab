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

			function mediaSrc(el) {
				return el.getAttribute('src') || el.getAttribute('data-src') || el.getAttribute('data-original') || '';
			}

			function hasToken(slide) {
				return (slide.innerHTML || '').indexOf('{#') !== -1;
			}

			function hasMedia(root) {
				var media = root.querySelectorAll('img, video, iframe, source');
				var i;
				var src;
				for (i = 0; i < media.length; i++) {
					src = mediaSrc(media[i]);
					if (src && src.indexOf('{#') === -1) return true;
				}
				return false;
			}

			function tidySlide(slide) {
				var mo = slide.querySelector('.home-hero__mo');
				if (mo && hasMedia(mo)) {
					slide.classList.add('has-mo');
				} else {
					slide.classList.remove('has-mo');
					if (mo) mo.style.display = 'none';
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
				var slide;
				for (i = 0; i < all.length; i++) {
					slide = all[i];
					if (hasToken(slide)) continue;
					tidySlide(slide);
					if (hasMedia(slide)) {
						slide.style.display = '';
						out.push(slide);
					} else {
						slide.style.display = 'none';
					}
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
				if (heroRoot.getAttribute('data-hero-busy') === '1') return false;
				heroRoot.setAttribute('data-hero-busy', '1');
				try {
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
				} finally {
					heroRoot.removeAttribute('data-hero-busy');
				}
			}

			heroRoot.addEventListener('mouseenter', stop);
			heroRoot.addEventListener('mouseleave', play);

			startHero();
			window.addEventListener('load', startHero);
			setTimeout(startHero, 500);
			setTimeout(startHero, 1500);
			setTimeout(startHero, 3000);
			if (typeof MutationObserver !== 'undefined') {
				var heroWait;
				var obs = new MutationObserver(function() {
					window.clearTimeout(heroWait);
					heroWait = window.setTimeout(startHero, 80);
				});
				obs.observe(heroRoot, { childList: true, subtree: true, characterData: true });
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
