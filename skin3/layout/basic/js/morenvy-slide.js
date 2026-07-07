(function () {
	function hasSlideContent(banner) {
		if (!banner || !banner.innerHTML.trim()) return false;

		var img = banner.querySelector("img");
		if (img && img.getAttribute("src")) return true;

		var iframe = banner.querySelector("iframe");
		if (iframe && iframe.getAttribute("src")) return true;

		var video = banner.querySelector("video");
		if (video && (video.getAttribute("src") || video.querySelector("source"))) return true;

		return false;
	}

	function getSlideImageSrc(banner) {
		var img = banner.querySelector("img");
		if (img && img.getAttribute("src")) return img.getAttribute("src");

		var video = banner.querySelector("video");
		if (video && video.getAttribute("poster")) return video.getAttribute("poster");

		return "";
	}

	function destroySwiper(area) {
		if (area._mvMainSwiper && area._mvMainSwiper.destroy) {
			area._mvMainSwiper.destroy(true, true);
			area._mvMainSwiper = null;
		}

		if (area._mvThumbSwiper && area._mvThumbSwiper.destroy) {
			area._mvThumbSwiper.destroy(true, true);
			area._mvThumbSwiper = null;
		}
	}

	function setActiveThumb(area, index) {
		var items = area.querySelectorAll(".mv-main-banner__thumb-item");
		var i;

		for (i = 0; i < items.length; i++) {
			items[i].classList.toggle("is-active", i === index);
		}
	}

	function buildThumbs(area, slides) {
		var thumbList = area.querySelector(".mv-main-banner__thumb-list");
		var html = "";
		var i;
		var src;

		if (!thumbList) return;

		for (i = 0; i < slides.length; i++) {
			src = getSlideImageSrc(slides[i]);
			if (!src) continue;

			html +=
				'<div class="swiper-slide mv-main-banner__thumb-item' +
				(i === 0 ? " is-active" : "") +
				'">' +
				'<button type="button" data-mv-thumb-index="' +
				i +
				'" aria-label="배너 ' +
				(i + 1) +
				'">' +
				'<img src="' +
				src +
				'" alt="">' +
				"</button>" +
				"</div>";
		}

		thumbList.innerHTML = html;
	}

	function bindThumbClicks(area, slideTo) {
		var buttons = area.querySelectorAll("[data-mv-thumb-index]");
		var b;

		for (b = 0; b < buttons.length; b++) {
			buttons[b].addEventListener("click", function () {
				var index = parseInt(this.getAttribute("data-mv-thumb-index"), 10);
				if (!isNaN(index)) slideTo(index);
			});
		}
	}

	function initSlide(area) {
		if (typeof Swiper === "undefined") return;

		var sliderEl = area.querySelector(".mv-main-banner__slider");
		var thumbEl = area.querySelector(".mv-main-banner__thumb");
		var prevEl = area.querySelector(".mv-main-banner__prev");
		var nextEl = area.querySelector(".mv-main-banner__next");
		var slides = [];
		var allSlides = area.querySelectorAll(".mv-main-banner__slider > .swiper-wrapper > .morenvy-banner");
		var i;

		for (i = 0; i < allSlides.length; i++) {
			if (hasSlideContent(allSlides[i])) {
				slides.push(allSlides[i]);
			}
		}

		if (!sliderEl || !slides.length) {
			destroySwiper(area);
			return;
		}

		var slideKey = slides.length + ":" + slides[0].innerHTML.length;
		if (area.getAttribute("data-mv-slide-key") === slideKey && area._mvMainSwiper) {
			return;
		}

		destroySwiper(area);
		area.setAttribute("data-mv-slide-key", slideKey);

		buildThumbs(area, slides);

		var useLoop = slides.length > 3;
		var swiperOptions = {
			slidesPerView: 1.15,
			spaceBetween: 8,
			speed: 450,
			loop: useLoop,
			watchOverflow: true,
			breakpoints: {
				768: {
					slidesPerView: 2,
					spaceBetween: 0
				},
				1025: {
					slidesPerView: 3,
					spaceBetween: 0
				}
			}
		};

		if (prevEl && nextEl) {
			swiperOptions.navigation = {
				nextEl: nextEl,
				prevEl: prevEl
			};
		}

		area._mvMainSwiper = new Swiper(sliderEl, swiperOptions);

		if (thumbEl && area.querySelector(".mv-main-banner__thumb-item")) {
			area._mvThumbSwiper = new Swiper(thumbEl, {
				slidesPerView: "auto",
				spaceBetween: 8,
				freeMode: true,
				watchOverflow: true
			});
		}

		var slideTo = function (index) {
			if (useLoop && area._mvMainSwiper.slideToLoop) {
				area._mvMainSwiper.slideToLoop(index);
			} else {
				area._mvMainSwiper.slideTo(index);
			}
		};

		bindThumbClicks(area, slideTo);

		area._mvMainSwiper.on("slideChange", function () {
			var index = typeof area._mvMainSwiper.realIndex === "number"
				? area._mvMainSwiper.realIndex
				: area._mvMainSwiper.activeIndex;
			setActiveThumb(area, index);

			if (area._mvThumbSwiper) {
				area._mvThumbSwiper.slideTo(index);
			}
		});
	}

	function observeArea(area) {
		if (area._mvObserved) return;

		area._mvObserved = true;

		if (typeof MutationObserver !== "undefined") {
			var observer = new MutationObserver(function () {
				initSlide(area);
			});

			observer.observe(area, {
				childList: true,
				subtree: true,
				characterData: true
			});
		}
	}

	function boot() {
		var areas = document.querySelectorAll(".morenvy-banner-area[data-mv-morenvy-slide]");
		var a;

		for (a = 0; a < areas.length; a++) {
			observeArea(areas[a]);
			initSlide(areas[a]);
		}
	}

	boot();
	document.addEventListener("DOMContentLoaded", boot);
	window.addEventListener("load", boot);
	setTimeout(boot, 500);
	setTimeout(boot, 1500);
	setTimeout(boot, 3000);
})();
