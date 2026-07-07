/** MEDIFAB main.js **/
jQuery(document).ready(function() {

	/* 아코디언 */
	var accRoot = document.querySelector('[data-acc]');
	if (accRoot) {
		accRoot.addEventListener('click', function(e) {
			var btn = e.target.closest('[data-acc-btn]');
			if (!btn) return;
			var item = btn.closest('.home-acc__item');
			var body = item.querySelector('[data-acc-body]');
			var isOpen = item.classList.contains('is-open');

			accRoot.querySelectorAll('.home-acc__item').forEach(function(el) {
				el.classList.remove('is-open');
				var b = el.querySelector('[data-acc-body]');
				if (b) b.hidden = true;
			});

			if (!isOpen) {
				item.classList.add('is-open');
				body.hidden = false;
			}
		});
	}

	/* 언어 버튼 */
	var langBtn = document.getElementById('mfLangBtn');
	var translateWrap = document.getElementById('mfTranslate');
	if (langBtn && translateWrap) {
		langBtn.addEventListener('click', function() {
			translateWrap.classList.toggle('is-open');
			translateWrap.hidden = false;
		});
	}

	/* 홈: 워프 스크롤 (hero → intro 슬라이드 → rd) */
	var homeRoot = document.querySelector('.pg-home');
	if (homeRoot) {
		var heroSection = homeRoot.querySelector('.home-hero');
		var introSection = homeRoot.querySelector('.home-intro');
		var rdSection = homeRoot.querySelector('.home-rd');
		var introSlideRoot = homeRoot.querySelector('[data-intro-slide]');
		var introTrack = introSlideRoot ? introSlideRoot.querySelector('.home-intro__track') : null;
		var introBarFill = homeRoot.querySelector('.home-intro__bar-fill');
		var introSlides = introTrack ? introTrack.querySelectorAll('p') : [];

		if (heroSection && introSection && rdSection && introTrack && introBarFill && introSlides.length) {
			var warpStage = 'hero';
			var warpSlide = 0;
			var warpAnimating = false;
			var warpInputLock = false;
			var warpSlideHeight = 0;
			var warpTouchY = 0;
			var warpSwipeThreshold = 50;
			var warpDuration = 900;

			function warpEase(t) {
				return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
			}

			function warpScrollY(el) {
				return window.pageYOffset + el.getBoundingClientRect().top;
			}

			function warpOffsets() {
				return {
					hero: warpScrollY(heroSection),
					intro: warpScrollY(introSection),
					rd: warpScrollY(rdSection)
				};
			}

			function warpSetLock(on) {
				document.body.classList.toggle('home-warp-lock', on);
			}

			function warpSetSlideHeight() {
				var maxH = 0;
				introSlides.forEach(function(slide) {
					slide.style.minHeight = 'auto';
					maxH = Math.max(maxH, slide.scrollHeight);
				});
				introSlides.forEach(function(slide) {
					slide.style.minHeight = maxH + 'px';
				});
				warpSlideHeight = maxH;
				introSlideRoot.style.height = maxH + 'px';
				introTrack.style.transform = 'translateY(-' + (warpSlide * warpSlideHeight) + 'px)';
			}

			function warpUpdateBar() {
				introBarFill.style.width = ((warpSlide + 1) / introSlides.length * 100) + '%';
			}

			function warpGoSlide(index, instant) {
				if (index < 0 || index >= introSlides.length) return;
				warpSlide = index;
				if (instant) introTrack.style.transition = 'none';
				introTrack.style.transform = 'translateY(-' + (warpSlide * warpSlideHeight) + 'px)';
				warpUpdateBar();
				if (instant) {
					void introTrack.offsetHeight;
					introTrack.style.transition = '';
				}
			}

			function warpAnimateScroll(target, callback) {
				warpAnimating = true;
				var start = window.pageYOffset;
				var startTime = performance.now();

				function step(now) {
					var t = Math.min(1, (now - startTime) / warpDuration);
					window.scrollTo(0, start + (target - start) * warpEase(t));
					if (t < 1) {
						requestAnimationFrame(step);
					} else {
						warpAnimating = false;
						if (callback) callback();
					}
				}
				requestAnimationFrame(step);
			}

			function warpSnapIntro() {
				var introY = warpOffsets().intro;
				if (Math.abs(window.pageYOffset - introY) > 2) {
					window.scrollTo(0, introY);
				}
			}

			function warpEnterIntro() {
				warpStage = 'intro';
				warpSetLock(true);
				warpGoSlide(0, true);
				warpSnapIntro();
			}

			function warpToIntro() {
				warpInputLock = true;
				warpAnimateScroll(warpOffsets().intro, function() {
					warpEnterIntro();
					window.setTimeout(function() { warpInputLock = false; }, 200);
				});
			}

			function warpToHero() {
				warpInputLock = true;
				warpSetLock(false);
				warpStage = 'hero';
				warpGoSlide(0, true);
				warpAnimateScroll(warpOffsets().hero, function() {
					window.setTimeout(function() { warpInputLock = false; }, 200);
				});
			}

			function warpToRd() {
				warpInputLock = true;
				warpSetLock(false);
				warpStage = 'free';
				warpAnimateScroll(warpOffsets().rd, function() {
					window.setTimeout(function() { warpInputLock = false; }, 200);
				});
			}

			function warpHandleDelta(delta) {
				if (warpAnimating || warpInputLock) return;

				if (warpStage === 'hero') {
					if (delta > 0) warpToIntro();
					return;
				}

				if (warpStage === 'intro') {
					if (delta > 0) {
						if (warpSlide < introSlides.length - 1) {
							warpInputLock = true;
							warpGoSlide(warpSlide + 1);
							window.setTimeout(function() { warpInputLock = false; }, 680);
						} else {
							warpToRd();
						}
					} else if (warpSlide > 0) {
						warpInputLock = true;
						warpGoSlide(warpSlide - 1);
						window.setTimeout(function() { warpInputLock = false; }, 680);
					} else {
						warpToHero();
					}
				}
			}

			function warpOnWheel(e) {
				if (warpStage === 'free') return;
				if (Math.abs(e.deltaY) < 2) return;

				if (warpAnimating || warpInputLock) {
					e.preventDefault();
					return;
				}

				if (warpStage === 'hero') {
					if (e.deltaY > 0) {
						e.preventDefault();
						warpHandleDelta(e.deltaY);
					}
					return;
				}

				if (warpStage === 'intro') {
					e.preventDefault();
					warpHandleDelta(e.deltaY);
				}
			}

			function warpOnScroll() {
				if (warpAnimating) return;
				var offsets = warpOffsets();
				var scrollY = window.pageYOffset;

				if (warpStage === 'intro') {
					warpSnapIntro();
					return;
				}

				if (warpStage === 'free') {
					if (scrollY < offsets.rd - 20) {
						var rect = introSection.getBoundingClientRect();
						var vh = window.innerHeight;
						if (rect.top <= 2 && rect.bottom >= vh - 2) {
							warpEnterIntro();
							warpGoSlide(introSlides.length - 1, true);
						}
					}
					if (scrollY < offsets.intro - 50) {
						warpStage = 'hero';
						warpGoSlide(0, true);
					}
					return;
				}

				if (warpStage === 'hero' && scrollY >= offsets.intro - 10) {
					warpEnterIntro();
					warpGoSlide(0, true);
					warpSnapIntro();
				}
			}

			function warpInitStage() {
				var offsets = warpOffsets();
				var scrollY = window.pageYOffset;
				if (scrollY >= offsets.rd - 20) {
					warpStage = 'free';
					warpSetLock(false);
				} else if (scrollY >= offsets.intro - 10) {
					warpEnterIntro();
					warpGoSlide(0, true);
					warpSnapIntro();
				} else {
					warpStage = 'hero';
					warpSetLock(false);
					warpGoSlide(0, true);
				}
			}

			warpSetSlideHeight();
			warpUpdateBar();
			warpInitStage();

			window.addEventListener('wheel', warpOnWheel, { passive: false });
			window.addEventListener('scroll', warpOnScroll, { passive: true });
			window.addEventListener('resize', function() {
				warpSetSlideHeight();
				if (warpStage === 'intro') warpSnapIntro();
			});

			introSection.addEventListener('touchstart', function(e) {
				if (!e.touches.length) return;
				warpTouchY = e.touches[0].clientY;
			}, { passive: true });

			introSection.addEventListener('touchmove', function(e) {
				if (warpStage !== 'intro' || !e.touches.length) return;
				if (!warpAnimating && !warpInputLock) e.preventDefault();
			}, { passive: false });

			heroSection.addEventListener('touchmove', function(e) {
				if (warpStage !== 'hero' || !e.touches.length) return;
				var diff = warpTouchY - e.touches[0].clientY;
				if (diff > 0) e.preventDefault();
			}, { passive: false });

			heroSection.addEventListener('touchstart', function(e) {
				if (!e.touches.length) return;
				warpTouchY = e.touches[0].clientY;
			}, { passive: true });

			function warpOnTouchEnd(e) {
				if (warpStage === 'free' || warpAnimating || warpInputLock) return;
				var diff = warpTouchY - e.changedTouches[0].clientY;
				if (Math.abs(diff) < warpSwipeThreshold) return;
				warpHandleDelta(diff);
			}

			heroSection.addEventListener('touchend', warpOnTouchEnd, { passive: true });
			introSection.addEventListener('touchend', warpOnTouchEnd, { passive: true });
		}
	}

	/* 홈: fixed 헤더 시 contents 여백 제거 */
	if (document.querySelector('.pg-home')) {
		var resetMargin = function() {
			var contents = document.getElementById('contents');
			if (contents) contents.style.marginTop = '0px';
		};
		window.addEventListener('scroll', resetMargin, { passive: true });
		resetMargin();
	}

});
