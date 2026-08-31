window.addEventListener('load', function(){
    handleNav();
    fixedHeader();
	mfHeaderTone();
	mfSearchPanel();
	mfSearchKeyword();
	mfDetailPage();
	mfProductBrandOnly();
	mfAcademyPage();
	mfAcademyRead();
	mfAcademyContact();
	mfAccountPage();
	bottomNav();
    //quickGoTop(); 사용안함 210805 서정환 수정
    //searchLayer(); 사용안함 210804 서정환 수정
    //toggleClass('.xans-layout-info.info__customer', '.xans-layout-info.info__customer .toggle', 'selected'); 사용안함 210805 서정환 수정
    //topBanner(); 사용안함 210804 서정환 수정
	handleScroll();
});

function handleScroll(){
	var scrollPosition = 0;
	var ticking = false;
	var quickMenu = document.querySelector('#quick');
	var scrollY = window.scrollY || window.pageYOffset;
	//setQuickScrollEvent(scrollY, quickMenu); 사용안함 210805 서정환 수정
	window.addEventListener('scroll', function(e) {
        scrollPosition = window.scrollY || window.pageYOffset;
        if (ticking) return;
        window.requestAnimationFrame(function() {
            fixedHeader();
			mfHeaderTone();
            //setQuickScrollEvent(scrollPosition, quickMenu) 사용안함 210805 서정환 수정
            ticking = false;
        });
        ticking = true;
	});
	window.addEventListener('resize', function() {
		mfHeaderTone();
	});
}

/* 헤더 아래 배경 밝기에 따라 텍스트 색 전환 (data-hd="light"|"dark") */
function mfHeaderTone() {
	var header = document.getElementById('header');
	if (!header || !header.classList.contains('mf-hd')) return;

	var y = (header.offsetHeight || 100) * 0.5;
	var zones = document.querySelectorAll('[data-hd]');
	var tone = null;
	var i;
	var rect;

	for (i = 0; i < zones.length; i++) {
		rect = zones[i].getBoundingClientRect();
		if (rect.height <= 0 && rect.width <= 0) continue;
		if (rect.top <= y && rect.bottom >= y) {
			/* 트리 순서로 덮어씀 → 안쪽(자식) data-hd가 최종 반영 */
			tone = zones[i].getAttribute('data-hd');
		}
	}

	if (tone === 'light') {
		header.classList.add('mf-hd--on-light');
		header.classList.remove('mf-hd--on-dark');
	} else if (tone === 'dark') {
		header.classList.add('mf-hd--on-dark');
		header.classList.remove('mf-hd--on-light');
	} else {
		header.classList.remove('mf-hd--on-light');
		header.classList.remove('mf-hd--on-dark');
	}
}

function mfSearchPanel() {
	var root = document.querySelector('#header.mf-hd .mf-hd__search');
	var openBtns = document.querySelectorAll('[data-search-open]');
	if (!root || !openBtns.length) return;

	function openPanel() {
		root.classList.add('is-open');
		document.body.classList.add('mf-search-open');
		var input = root.querySelector('#keyword');
		if (input) {
			input.setAttribute('placeholder', 'Search');
			window.setTimeout(function() { input.focus(); }, 280);
		}
	}

	function closePanel() {
		root.classList.remove('is-open');
		document.body.classList.remove('mf-search-open');
	}

	openBtns.forEach(function(btn) {
		btn.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			openPanel();
		});
	});

	root.querySelectorAll('[data-search-close]').forEach(function(el) {
		el.addEventListener('click', function(e) {
			e.preventDefault();
			closePanel();
		});
	});

	root.addEventListener('click', function(e) {
		if (e.target === root) closePanel();
	});

	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') closePanel();
	});

	var keyword = root.querySelector('#keyword');
	var submitBtn = root.querySelector('.btnSearch');
	if (keyword && submitBtn) {
		keyword.addEventListener('keydown', function(e) {
			if (e.key === 'Enter') {
				e.preventDefault();
				submitBtn.click();
			}
		});
	}
}

function mfSearchKeyword() {
	var el = document.querySelector('[data-search-keyword]');
	if (!el) return;
	var params = new URLSearchParams(window.location.search);
	var q = params.get('keyword') || '';
	try {
		q = decodeURIComponent(q.replace(/\+/g, ' '));
	} catch (err) {}
	el.textContent = q ? '\u2018' + q + '\u2019' : '';
}

function mfDetailPage() {
	var page = document.querySelector('.pg-detail');
	if (!page) return;

	var detailArea = page.querySelector('.detailArea');
	var imgArea = page.querySelector('.imgArea');
	var desc = page.querySelector('.pg-detail__long') || page.querySelector('#prdDetail > div');
	if (desc) {
		desc.classList.add('pg-detail__long');
		var placeLong = function () {
			if (!desc || !detailArea) return;
			if (window.matchMedia('(max-width: 1024px)').matches) {
				if (detailArea.parentNode && desc.previousSibling !== detailArea) {
					detailArea.parentNode.insertBefore(desc, detailArea.nextSibling);
				}
			} else if (imgArea && desc.parentNode !== imgArea) {
				imgArea.appendChild(desc);
			}
		};
		placeLong();
		if (!page._mfDetailLongBound) {
			page._mfDetailLongBound = true;
			window.addEventListener('resize', placeLong);
		}
	}

	/* brand 정리는 mfProductBrandOnly에서 처리 */

	/* 제목 아래 판매가 숫자만 오면 ₩ 포맷 */
	(function formatHeadingPrice() {
		var el = page.querySelector('.pg-detail__price');
		if (!el) return;
		var raw = (el.textContent || '').replace(/\s+/g, '').trim();
		if (!/^\d+$/.test(raw)) return;
		var n = parseInt(raw, 10);
		if (!n) return;
		el.textContent = '\uFFE6' + n.toLocaleString('ko-KR');
	})();

	/* 옵션 테이블: 실제 옵션이 있으면 displaynone 해제 + Size 라벨 정규화 */
	page.querySelectorAll('table.xans-product-option').forEach(function (table) {
		var hasOption = !!(table.querySelector('select, .ec-product-button li, input[type="radio"], input[type="checkbox"]'));
		if (hasOption) {
			table.classList.remove('displaynone');
			table.style.removeProperty('display');
		}
	});
	page.querySelectorAll('.xans-product-option th').forEach(function (th) {
		var t = String(th.textContent || '').replace(/\s+/g, ' ').trim();
		if (/사이즈|용량|size/i.test(t)) th.textContent = 'Size';
	});

	/* 시작부터 Quantity 노출 + 15ml 선택 + Total 세팅 */
	(function initDefaultBuyState() {
		var totalBox = page.querySelector('#totalProducts');
		var totalPriceEl = page.querySelector('.totalPrice');

		function readProductPrice() {
			var info = document.getElementById('ec-product-price-info');
			if (info) {
				var n = parseInt(String(info.getAttribute('ec-data-price') || '').replace(/[^\d]/g, ''), 10);
				if (n > 0) return n;
			}
			var hp = page.querySelector('.pg-detail__price');
			if (hp) {
				var n2 = parseInt(String(hp.textContent || '').replace(/[^\d]/g, ''), 10);
				if (n2 > 0) return n2;
			}
			return 0;
		}
		function hasProductLine() {
			return !!(totalBox && totalBox.querySelector('tr.option_product, .quantity_opt, .quantity input, input.quantity_opt'));
		}
		function showQuantity(forceHide) {
			var tpQty = !!(totalBox && totalBox.querySelector('.quantity input, input.quantity_opt, .quantity_opt, .quantity'));
			var hideForm = forceHide === true || tpQty;
			page.classList.toggle('has-tp-qty', hideForm);
			page.querySelectorAll('.xans-product-option tr.xans-product-quantity, .ec-base-desc.quantity').forEach(function (el) {
				if (hideForm) {
					el.style.setProperty('display', 'none', 'important');
				} else {
					el.classList.remove('displaynone');
					el.style.setProperty('display', 'flex', 'important');
				}
			});
			if (hideForm && totalBox) {
				totalBox.querySelectorAll('tr.option_product, tr.add_product, #totalProducts > table > tbody > tr').forEach(function (tr) {
					if (!tr.querySelector('.quantity, .quantity_opt, input.quantity_opt')) return;
					tr.classList.remove('displaynone');
					tr.style.setProperty('display', 'flex', 'important');
				});
			}
		}
		function ensureTotalLabel() {
			if (!totalPriceEl) return;
			var label = totalPriceEl.querySelector('.pg-detail__total-label');
			if (!label) {
				label = document.createElement('span');
				label.className = 'pg-detail__total-label';
				label.textContent = 'Total';
				var priceSpan = totalPriceEl.querySelector('span.total, strong.total');
				if (priceSpan) totalPriceEl.insertBefore(label, priceSpan);
				else totalPriceEl.insertBefore(label, totalPriceEl.firstChild);
			} else {
				label.textContent = 'Total';
			}
		}
		function fillTotal() {
			if (!totalPriceEl) return;
			ensureTotalLabel();
			var em = totalPriceEl.querySelector('span.total em, strong.total em, .total em');
			if (!em) return;
			var cur = parseInt(String(em.textContent || '').replace(/[^\d]/g, ''), 10) || 0;
			if (cur > 0) return;
			var price = readProductPrice();
			if (price > 0) em.textContent = price.toLocaleString('ko-KR');
		}
		function fireClick(node) {
			if (!node) return;
			var a = node.tagName === 'A' ? node : (node.querySelector('a') || node);
			var $ = window.jQuery;
			try {
				if ($ && $.fn) {
					$(a).trigger('click');
					$(node).trigger('click');
				} else {
					a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
				}
			} catch (err) {}
		}
		function syncSelect(li) {
			var wrap = li.closest('td') || li.closest('table') || page;
			var label = (li.textContent || '').replace(/\s+/g, ' ').trim();
			var $ = window.jQuery;
			wrap.querySelectorAll('select').forEach(function (sel) {
				for (var i = 0; i < sel.options.length; i++) {
					var ot = (sel.options[i].text || '').replace(/\s+/g, ' ').trim();
					if (!ot || /^[-*]|선택/.test(ot)) continue;
					if (ot === label || ot.indexOf(label) !== -1 || label.indexOf(ot) !== -1) {
						sel.selectedIndex = i;
						try {
							if ($ && $.fn) $(sel).val(sel.options[i].value).trigger('change');
							else sel.dispatchEvent(new Event('change', { bubbles: true }));
						} catch (err) {}
						break;
					}
				}
			});
		}
		function pickLi(list) {
			var items = list.querySelectorAll('li');
			var fallback = null;
			for (var i = 0; i < items.length; i++) {
				var li = items[i];
				if (li.classList.contains('ec-product-soldout') || li.classList.contains('ec-product-disabled')) continue;
				var text = (li.textContent || '').replace(/\s+/g, ' ').trim();
				if (!fallback) fallback = li;
				if (/^15\s*ml$/i.test(text)) return li;
			}
			return fallback;
		}
		function pickOther(list, target) {
			var other = null;
			list.querySelectorAll('li').forEach(function (item) {
				if (other || item === target) return;
				if (item.classList.contains('ec-product-soldout') || item.classList.contains('ec-product-disabled')) return;
				other = item;
			});
			return other;
		}
		function clickPushButton() {
			var btn = page.querySelector('.xans-product-option .selectButton a, [id*="option_push"] a, .selectButton a');
			if (!btn) return;
			var row = btn.closest('tr, .selectButton, td');
			if (row && (row.classList.contains('displaynone') || window.getComputedStyle(row).display === 'none')) return;
			fireClick(btn);
		}
		function selectDefaultOption() {
			page.querySelectorAll('.xans-product-option .ec-product-button').forEach(function (list) {
				var target = pickLi(list);
				if (!target) return;
				if (target.classList.contains('ec-product-selected') && hasProductLine()) return;

				syncSelect(target);
				var other = pickOther(list, target);
				if (other) {
					fireClick(other);
					setTimeout(function () {
						syncSelect(target);
						fireClick(target);
						setTimeout(clickPushButton, 60);
						setTimeout(function () { showQuantity(); fillTotal(); }, 120);
					}, 100);
				} else {
					target.classList.remove('ec-product-selected');
					fireClick(target);
					setTimeout(clickPushButton, 60);
					setTimeout(function () { showQuantity(); fillTotal(); }, 120);
				}
			});
		}

		showQuantity();
		fillTotal();

		var tries = 0;
		(function tick() {
			tries += 1;
			showQuantity();
			fillTotal();
			if (!page.querySelector('.xans-product-option .ec-product-button li')) {
				if (tries < 40) setTimeout(tick, 100);
				return;
			}
			if (!hasProductLine()) selectDefaultOption();
			showQuantity();
			fillTotal();
			if (!hasProductLine() && tries < 25) setTimeout(tick, 250);
			else {
				showQuantity();
				fillTotal();
				setTimeout(function () { showQuantity(); fillTotal(); }, 400);
			}
		})();

		if (totalBox && window.MutationObserver && !totalBox.getAttribute('data-mf-qty-mo')) {
			totalBox.setAttribute('data-mf-qty-mo', '1');
			var t = null;
			new MutationObserver(function () {
				if (t) clearTimeout(t);
				t = setTimeout(function () { showQuantity(); fillTotal(); }, 30);
			}).observe(totalBox, { childList: true, subtree: true });
		}

		/* 옵션 클릭 시 폼 Quantity → #totalProducts Quantity 전환 */
		page.addEventListener('click', function (e) {
			if (!e.target.closest('.xans-product-option .ec-product-button, .xans-product-option select')) return;
			showQuantity(true);
			setTimeout(function () { showQuantity(true); fillTotal(); }, 80);
			setTimeout(function () { showQuantity(); fillTotal(); }, 300);
		});
	})();

	/* Cafe24가 totalPrice를 다시 그리면 Total 라벨 정리 — 가격 노드(em)는 건드리지 않음 */
	var totalPrice = page.querySelector('.totalPrice');
	var totalMo = null;
	var totalSyncing = false;
	function readProductPrice() {
		var info = document.getElementById('ec-product-price-info');
		if (info) {
			var raw = info.getAttribute('ec-data-price') || '';
			var n = parseInt(String(raw).replace(/[^\d]/g, ''), 10);
			if (n > 0) return n;
		}
		var hp = page.querySelector('.pg-detail__price');
		if (hp) {
			var n2 = parseInt(String(hp.textContent || '').replace(/[^\d]/g, ''), 10);
			if (n2 > 0) return n2;
		}
		return 0;
	}
	function fillTotalIfZero() {
		if (!totalPrice) return;
		var em = totalPrice.querySelector('span.total em, strong.total em, .total em');
		if (!em) return;
		var cur = parseInt(String(em.textContent || '').replace(/[^\d]/g, ''), 10) || 0;
		if (cur > 0) return;
		var price = readProductPrice();
		if (price > 0) em.textContent = price.toLocaleString('ko-KR');
	}
	function syncTotalLabel() {
		if (!totalPrice || totalSyncing) return;
		totalSyncing = true;
		if (totalMo) totalMo.disconnect();
		try {
			var label = totalPrice.querySelector('.pg-detail__total-label');
			if (!label) {
				label = document.createElement('span');
				label.className = 'pg-detail__total-label';
				label.textContent = 'Total';
			} else if (label.textContent !== 'Total') {
				label.textContent = 'Total';
			}

			var priceSpan = null;
			var kids = totalPrice.children;
			for (var i = 0; i < kids.length; i++) {
				var el = kids[i];
				if (!el || el === label) continue;
				if (el.classList && el.classList.contains('pg-detail__total-label')) continue;
				var tag = el.tagName;
				if (tag !== 'SPAN' && tag !== 'STRONG') continue;
				var cls = el.className || '';
				if (/(^|\s)total(\s|$)/.test(cls) || el.querySelector('em')) {
					priceSpan = el;
					break;
				}
			}
			if (priceSpan) {
				if (label.parentNode !== totalPrice || label.nextSibling !== priceSpan) {
					totalPrice.insertBefore(label, priceSpan);
				}
			} else if (label.parentNode !== totalPrice) {
				totalPrice.insertBefore(label, totalPrice.firstChild);
			}
			fillTotalIfZero();
		} finally {
			totalSyncing = false;
			if (totalMo && totalPrice) {
				totalMo.observe(totalPrice, { childList: true });
			}
		}
	}
	syncTotalLabel();
	setTimeout(fillTotalIfZero, 700);
	setTimeout(fillTotalIfZero, 1200);
	if (totalPrice && window.MutationObserver && !totalPrice.getAttribute('data-mf-total-mo')) {
		totalPrice.setAttribute('data-mf-total-mo', '1');
		var totalMoTimer = null;
		totalMo = new MutationObserver(function () {
			if (totalSyncing) return;
			if (totalMoTimer) clearTimeout(totalMoTimer);
			totalMoTimer = setTimeout(syncTotalLabel, 50);
		});
		totalMo.observe(totalPrice, { childList: true });
	}
	page.addEventListener('click', function (e) {
		if (!e.target.closest('.xans-product-option .ec-product-button, .xans-product-option select')) return;
		setTimeout(fillTotalIfZero, 80);
		setTimeout(fillTotalIfZero, 300);
	});

	var tabs = page.querySelector('[data-detail-tabs]');
	var panels = page.querySelector('[data-detail-panels]');
	if (!tabs || !panels) return;

	/* 상품간략설명: 탭이 비면 상품정보표시(detaildesign)에서 보강 */
	(function fillSimpleDesc() {
		var slot = panels.querySelector('[data-mf-simple-slot]');
		if (!slot) return;
		var text = (slot.textContent || '').replace(/\s+/g, ' ').trim();
		if (text) return;
		var rows = page.querySelectorAll('.xans-product-detaildesign tr');
		for (var i = 0; i < rows.length; i++) {
			var th = rows[i].querySelector('th');
			var td = rows[i].querySelector('td');
			if (!th || !td) continue;
			var title = (th.textContent || '').replace(/\s+/g, ' ').trim();
			if (!/간략|simple|brief/i.test(title)) continue;
			var html = (td.innerHTML || '').trim();
			var body = (td.textContent || '').replace(/\s+/g, ' ').trim();
			if (!body) continue;
			slot.innerHTML = html;
			return;
		}
	})();

	var folds = page.querySelectorAll('#prdInfo .detail_guide .ec-base-fold .contents');
	var pay = panels.querySelector('[data-panel="pay"]');
	var ship = panels.querySelector('[data-panel="ship"]');
	var ret = panels.querySelector('[data-panel="ret"]');
	if (pay && folds[0]) pay.innerHTML = folds[0].innerHTML;
	if (ship && folds[1]) ship.innerHTML = folds[1].innerHTML;
	if (ret && folds[2]) ret.innerHTML = folds[2].innerHTML;

	tabs.addEventListener('click', function(e) {
		var btn = e.target.closest('[data-tab]');
		if (!btn) return;
		e.preventDefault();
		var id = btn.getAttribute('data-tab');
		tabs.querySelectorAll('[data-tab]').forEach(function(item) {
			item.classList.toggle('is-on', item === btn);
		});
		panels.querySelectorAll('[data-panel]').forEach(function(panel) {
			if (panel.getAttribute('data-panel') === id) {
				panel.removeAttribute('hidden');
			} else {
				panel.setAttribute('hidden', 'hidden');
			}
		});
	});
}

/* 상품카드/상세 브랜드줄: 브랜드 → 제조사 → 목록표시항목 순 */
function mfProductBrandOnly() {
	var roots = document.querySelectorAll('.pg-home, .pg-list, .pg-search, .pg-detail');
	if (!roots.length) return;

	var hideRe = /^(자체제작|자체브랜드|자체공급|제조사|브랜드|상품명|판매가|기본트렌드)$/i;
	var brandTitleRe = /제조사|브랜드|brand|manufacturer/i;
	var priceRe = /[₩￦]|\d{1,3}(,\d{3})+|원\s*$/;
	var brandByProduct = {};

	function cleanText(v) {
		return String(v || '').replace(/\s+/g, ' ').trim();
	}

	function isUsable(text) {
		return !!(text && !hideRe.test(text) && !priceRe.test(text));
	}

	function productNoFrom(el) {
		var li = el.closest('li[id^="anchorBoxId_"]');
		if (li && li.id) {
			var m = li.id.match(/anchorBoxId_(\d+)/);
			if (m) return m[1];
		}
		var img = el.querySelector('img[id*="eListPrdImage"]');
		if (img && img.id) {
			var m2 = img.id.match(/eListPrdImage(\d+)/);
			if (m2) return m2[1];
		}
		return '';
	}

	function pickFromBrandEl(brandEl) {
		var picked = '';
		brandEl.querySelectorAll('[data-mf-brand-src]').forEach(function (span) {
			if (picked) return;
			var t = cleanText(span.textContent);
			if (isUsable(t)) picked = t;
		});
		if (!picked) {
			brandEl.querySelectorAll('[data-mf-manu]').forEach(function (span) {
				if (picked) return;
				var t = cleanText(span.textContent);
				if (isUsable(t)) picked = t;
			});
		}
		return picked;
	}

	function applyBrand(brandEl, picked) {
		brandEl.querySelectorAll('[data-mf-brand-src], [data-mf-manu]').forEach(function (span) {
			span.textContent = '';
		});
		if (picked) {
			brandEl.textContent = picked;
			brandEl.style.display = '';
			brandEl.removeAttribute('hidden');
		} else {
			brandEl.textContent = '';
			brandEl.style.display = 'none';
		}
	}

	roots.forEach(function (root) {
		root.querySelectorAll('[data-mf-brand], .prdList__brand, .pg-detail__brand').forEach(function (brandEl) {
			var item = brandEl.closest('.prdList__item') || brandEl.closest('.infoArea') || root;
			var picked = pickFromBrandEl(brandEl);

			if (!picked && item) {
				item.querySelectorAll('.spec > li').forEach(function (li) {
					if (picked) return;
					var titleEl = li.querySelector('.title');
					var title = cleanText(titleEl ? titleEl.textContent : '');
					var body = cleanText(li.textContent.replace(title, '').replace(/^:/, ''));
					if (priceRe.test(body) || li.classList.contains('price') || li.classList.contains('sale')) return;
					if (brandTitleRe.test(title) && isUsable(body)) picked = body;
					/* 타이틀 숨김 상태에서도 브랜드값만 있는 경우 */
					if (!picked && !titleEl && isUsable(body) && !priceRe.test(body)) {
						/* skip generic - only when title matches */
					}
				});
			}

			/* ListItem 타이틀이 displaynone이어도 본문이 브랜드명인 경우 (판매가 제외) */
			if (!picked && item) {
				item.querySelectorAll('.spec > li').forEach(function (li) {
					if (picked) return;
					var titleEl = li.querySelector('.title');
					var title = cleanText(titleEl ? titleEl.textContent.replace(/:/g, '') : '');
					var body = cleanText(String(li.textContent || '').replace(titleEl ? titleEl.textContent : '', '').replace(/^[\s:]*/, ''));
					if (priceRe.test(body) || li.classList.contains('price')) return;
					if (brandTitleRe.test(title) && isUsable(body)) picked = body;
				});
			}

			if (!picked && brandEl.classList.contains('pg-detail__brand')) {
				var cate = root.querySelector('.path ol li:nth-child(2) a');
				if (cate) {
					var ct = cleanText(cate.textContent);
					if (isUsable(ct)) picked = ct;
				}
			}

			var pno = productNoFrom(item);
			if (picked && pno) brandByProduct[pno] = picked;
			brandEl.setAttribute('data-mf-pno', pno || '');
			applyBrand(brandEl, picked);
		});

		/* 같은 상품번호면 New/Best 서로 브랜드 맞춤 */
		root.querySelectorAll('[data-mf-brand], .prdList__brand').forEach(function (brandEl) {
			var pno = brandEl.getAttribute('data-mf-pno') || '';
			var cur = cleanText(brandEl.textContent);
			if ((!cur || brandEl.style.display === 'none') && pno && brandByProduct[pno]) {
				applyBrand(brandEl, brandByProduct[pno]);
			}
		});
	});
}

function toggleClass(element, handler, className){
	var _handler = document.querySelector(handler);
	var _element = document.querySelector(element);

    _handler.addEventListener('click', function(){
        if ( _element.classList.contains(className) ) {
            _element.classList.remove( className );
        } else {
            _element.classList.add( className );
        }
    });
}

function fixedHeader() { // 210804 서정환 수정
    var header = document.getElementById("header");
	var fixed_margin = document.getElementById("contents");
	if (!header) return;
	var scrollY = window.pageYOffset || document.documentElement.scrollTop;
	var header_height = header.scrollHeight+'px';

	if(scrollY > header.offsetTop) {
        header.classList.add("fixed");
		if (fixed_margin) {
			if (header.classList.contains('mf-hd')) {
				fixed_margin.style.marginTop = '0px';
			} else {
				fixed_margin.style.marginTop = header_height;
			}
		}
    } else {
        header.classList.remove("fixed");
		if (fixed_margin) fixed_margin.style.marginTop  = '0px';
    }
}

function handleNav() {
    var btnNavs = document.querySelectorAll('.eNavFold');
    var btnClose = document.querySelector('#aside .btnClose');
    var dimmed = document.querySelector('#layoutDimmed');
    var aside = document.getElementById('aside');

    function openNav() {
        document.body.classList.add('expand');
        if (aside) aside.setAttribute('aria-hidden', 'false');
    }
    function closeNav() {
        document.body.classList.remove('expand');
        if (aside) aside.setAttribute('aria-hidden', 'true');
    }

    btnNavs.forEach(function(btnNav) {
        btnNav.addEventListener('click', openNav);
    });
    if (btnClose) {
        btnClose.addEventListener('click', closeNav);
    }
    if (dimmed) {
        handleDimmed(dimmed, document.body, 'expand');
        dimmed.addEventListener('click', function() {
            if (aside) aside.setAttribute('aria-hidden', 'true');
        });
    }

    if (!aside || !aside.classList.contains('mf-mo')) return;

    aside.addEventListener('click', function(e) {
        var btn = e.target.closest('.mf-mo__btn');
        if (btn) {
            var item = btn.closest('.mf-mo__item');
            var sub = item ? item.querySelector('.mf-mo__sub') : null;
            if (!item || !sub) return;
            var isOpen = item.classList.contains('is-open');
            aside.querySelectorAll('.mf-mo__item.is-open').forEach(function(el) {
                el.classList.remove('is-open');
                var b = el.querySelector('.mf-mo__btn');
                var s = el.querySelector('.mf-mo__sub');
                if (b) b.setAttribute('aria-expanded', 'false');
                if (s) s.hidden = true;
            });
            if (!isOpen) {
                item.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
                sub.hidden = false;
            }
            return;
        }

        var link = e.target.closest('a[href]');
        if (link && link.getAttribute('href') && link.getAttribute('href') !== '#') {
            closeNav();
        }
    });

    aside.querySelectorAll('.mf-mo__lang-btn').forEach(function(langBtn) {
        langBtn.addEventListener('click', function() {
            aside.querySelectorAll('.mf-mo__lang-btn').forEach(function(b) {
                b.classList.remove('is-active');
            });
            langBtn.classList.add('is-active');
            var lang = langBtn.getAttribute('data-lang');
            var combo = document.querySelector('.goog-te-combo');
            if (combo && lang) {
                combo.value = lang;
                if (typeof combo.dispatchEvent === 'function') {
                    combo.dispatchEvent(new Event('change'));
                }
            }
        });
    });
}


function searchLayer() {
    var btnSearchs = document.querySelectorAll('.eSearch');
    var btnClose = document.querySelector('.xans-layout-searchheader  .btnClose');
    btnSearchs.forEach( function(btnSearch) {
        btnSearch.addEventListener('click', function(){
            document.body.classList.add('searchExpand');
            var input = document.querySelector('#keyword');
            input.focus();
        });
    });
    btnClose.addEventListener('click', function(){
        document.body.classList.remove('searchExpand');
    });
    var dimmed = document.querySelector('#layoutDimmed');
    handleDimmed(dimmed, document.body, 'searchExpand');
}

function handleDimmed(target, element, className){
    target.addEventListener('click', function(){
        element.classList.remove(className);
    });
}

function bottomScroll(){
    var lastScrollTop = 0;
    var delta = 5;
    var fixBox = document.querySelector('.bottom-nav__top');
    var fixBoxHeight = fixBox.offsetHeight;
    var didScroll;

    window.onscroll = function(e) {
        didScroll = true;
    };

    setInterval(function(){
        if(didScroll){
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled(){
        var nowScrollTop = window.scrollY;
        if(Math.abs(lastScrollTop - nowScrollTop) <= delta){
            return;
        }
        if(nowScrollTop > lastScrollTop && nowScrollTop > fixBoxHeight){
            //Scroll down
            var scrollTop = window.scrollTop();
            var innerHeight = window.innerHeight();
            var scrollHeight = $('body').prop('scrollHeight');
            if (scrollTop + innerHeight >= scrollHeight) {
                fixBox.classList.add('bottom-nav--hide');
                return true;
            }
        }else{
            if(nowScrollTop + window.innerHeight < document.body.offsetHeight){
                //Scroll up
                fixBox.classList.remove('bottom-nav--hide');
            }
        }
        lastScrollTop = nowScrollTop;
    }
}

function mfAcademyPage() {
	var root = document.querySelector('.pg-acd');
	if (!root) return;

	var params = new URLSearchParams(window.location.search);
	var boardNo = params.get('board_no') || '';
	var path = window.location.pathname || '';
	var tabName = 'market';
	if (/consult|inquiry/i.test(path)) {
		tabName = 'contact';
	} else if (boardNo === '1002') {
		tabName = 'academic';
	} else if (boardNo === '5' || !boardNo) {
		tabName = 'market';
	}
	root.querySelectorAll('.pg-acd__tab').forEach(function (tab) {
		tab.classList.toggle('is-active', tab.getAttribute('data-acd-tab') === tabName);
	});

	var select = root.querySelector('.pg-acd__sort select');
	var chipsWrap = root.querySelector('[data-acd-chips]');
	if (select && chipsWrap && !chipsWrap.getAttribute('data-ready')) {
		chipsWrap.setAttribute('data-ready', '1');
		var selected = String(select.value || '');
		var options = select.options || [];
		var i;
		var opt;
		var value;
		var label;
		var btn;
		if (!options.length) {
			chipsWrap.style.display = 'none';
		}
		for (i = 0; i < options.length; i++) {
			opt = options[i];
			value = String(opt.value || '');
			label = String(opt.text || '').replace(/^\s+|\s+$/g, '');
			if (!value && (/^전체$|^all$/i.test(label) || !label)) label = 'All';
			btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'pg-acd__chip' + (value === selected ? ' is-active' : '');
			btn.setAttribute('data-value', value);
			btn.textContent = label;
			chipsWrap.appendChild(btn);
		}
		chipsWrap.addEventListener('click', function (e) {
			var chip = e.target.closest('.pg-acd__chip');
			if (!chip) return;
			var next = chip.getAttribute('data-value') || '';
			if (next && (next.indexOf('list.html') !== -1 || next.charAt(0) === '/' || next.indexOf('http') === 0)) {
				window.location.href = next;
				return;
			}
			if (select) {
				select.value = next;
				if (typeof select.onchange === 'function') {
					select.onchange();
					return;
				}
				try {
					select.dispatchEvent(new Event('change', { bubbles: true }));
				} catch (err) {
					var ev = document.createEvent('HTMLEvents');
					ev.initEvent('change', true, false);
					select.dispatchEvent(ev);
				}
			}
			try {
				var url = new URL(window.location.href);
				if (next) {
					url.searchParams.set('category_no', next);
				} else {
					url.searchParams.delete('category_no');
					url.searchParams.delete('category');
				}
				window.location.href = url.toString();
			} catch (navErr) {}
		});
	}

	var searchInput = root.querySelector('.pg-acd__search input[type="text"], .pg-acd__search #search');
	if (searchInput && !searchInput.getAttribute('placeholder')) {
		searchInput.setAttribute('placeholder', 'Search');
	}

	var next = root.querySelector('.pg-acd__pager-next, .pg-acd__pager > a:last-child');
	var more = root.querySelector('.pg-acd__more');
	if (more && next) {
		var href = next.getAttribute('href') || '';
		var dead = !href || href === '#none' || next.classList.contains('nolink');
		if (dead) {
			more.setAttribute('hidden', 'hidden');
		} else {
			more.removeAttribute('hidden');
			more.setAttribute('href', href);
		}
	} else if (more) {
		more.setAttribute('hidden', 'hidden');
	}
}

function mfAcademyRead() {
	var root = document.querySelector('.pg-acd-read');
	if (!root) return;

	var media = root.querySelector('.pg-acd-read__media');
	if (media && !media.querySelector('img, video, iframe, embed, object')) {
		media.classList.add('is-empty');
	}

	var cat = root.querySelector('.pg-acd-read__cat');
	if (cat && !String(cat.textContent || '').replace(/\s+/g, '')) {
		cat.style.display = 'none';
	}

	var files = root.querySelector('[data-acd-files]');
	if (!files || files.getAttribute('data-ready') === '1') return;
	var links = files.querySelectorAll('a[href]');
	if (!links.length) {
		files.classList.add('is-empty');
		return;
	}
	files.setAttribute('data-ready', '1');

	var frag = document.createDocumentFragment();
	var i;
	var a;
	var name;
	var ext;
	var meta;
	var match;
	var size;
	var row;
	var info;
	var title;
	var sub;
	var list = [];
	for (i = 0; i < links.length; i++) {
		list.push(links[i]);
	}
	for (i = 0; i < list.length; i++) {
		a = list[i];
		name = String(a.textContent || '').replace(/^\s+|\s+$/g, '');
		if (!name) name = a.getAttribute('href') || 'Download';
		meta = '';
		match = name.match(/\.([a-z0-9]{2,5})(?:\s|$|\))/i);
		ext = match ? match[1].toUpperCase() : '';
		size = '';
		match = (a.parentNode && a.parentNode.textContent ? a.parentNode.textContent : '').match(/(\d+(?:\.\d+)?\s?(?:KB|MB|GB|bytes|바이트))/i);
		if (match) size = match[1];
		if (ext || size) meta = [ext, size].filter(Boolean).join(' · ');
		row = document.createElement('div');
		row.className = 'pg-acd-read__file';
		info = document.createElement('div');
		info.className = 'pg-acd-read__file-info';
		title = document.createElement('p');
		title.className = 'pg-acd-read__file-name';
		title.textContent = name;
		info.appendChild(title);
		if (meta) {
			sub = document.createElement('p');
			sub.className = 'pg-acd-read__file-meta';
			sub.textContent = meta;
			info.appendChild(sub);
		}
		a.className = 'pg-acd-read__dl';
		a.textContent = 'Download';
		row.appendChild(info);
		row.appendChild(a);
		frag.appendChild(row);
	}
	files.innerHTML = '';
	files.appendChild(frag);
}

function mfAcademyContact() {
	var root = document.querySelector('.pg-acd-ct');
	if (!root) return;

	var writer = root.querySelector('#writer, input[name="writer"]');
	var nameFb = root.querySelector('#acdName');
	if (writer && nameFb) {
		nameFb.style.display = 'none';
		if (!writer.getAttribute('placeholder')) writer.setAttribute('placeholder', '홍길동');
	}

	var emailWrap = root.querySelector('.pg-acd-ct__email');
	if (emailWrap && emailWrap.getAttribute('data-ready') !== '1') {
		var formBox = root.querySelector('form') || root;
		var e1 = formBox.querySelector('#email1, input[name="email1"]');
		var e2 = formBox.querySelector('#email2, input[name="email2"]');
		var e3 = formBox.querySelector('#email3, select[name="email3"]');
		var one = formBox.querySelector('#email, input[name="email"]');
		function unlockMail(el) {
			if (!el || !el.tagName || el.tagName !== 'INPUT') return el;
			if (el.type === 'hidden' || el.type === 'email') {
				try { el.type = 'text'; } catch (err) {}
			}
			el.removeAttribute('readonly');
			el.removeAttribute('disabled');
			el.removeAttribute('hidden');
			el.readOnly = false;
			el.disabled = false;
			el.style.display = 'block';
			el.style.pointerEvents = 'auto';
			return el;
		}
		function ensureText(el, name, id) {
			if (el) return unlockMail(el);
			el = document.createElement('input');
			el.type = 'text';
			el.name = name;
			el.id = id;
			el.className = 'inputTypeText';
			el.setAttribute('autocomplete', name === 'email1' ? 'username' : 'off');
			return el;
		}
		function setDirectDomain() {
			if (!e3 || !e3.options) return;
			var i;
			for (i = 0; i < e3.options.length; i++) {
				if (e3.options[i].value === 'etc') {
					e3.selectedIndex = i;
					return;
				}
			}
		}
		if (e1 || e2 || e3 || one) {
			emailWrap.setAttribute('data-ready', '1');
			if (one && !e1 && !e2) {
				unlockMail(one);
				if (!one.getAttribute('placeholder')) one.setAttribute('placeholder', 'name@example.com');
			} else {
				e1 = ensureText(e1, 'email1', 'email1');
				e2 = ensureText(e2, 'email2', 'email2');
				var extras = [];
				var nodes = emailWrap.querySelectorAll('input, select, textarea');
				var n;
				for (n = 0; n < nodes.length; n++) {
					if (nodes[n] !== e1 && nodes[n] !== e2 && nodes[n] !== e3 && nodes[n] !== one) extras.push(nodes[n]);
				}
				var left = document.createElement('div');
				left.className = 'pg-acd-ct__email-local';
				var mid = document.createElement('span');
				mid.className = 'pg-acd-ct__at';
				mid.textContent = '@';
				var right = document.createElement('div');
				right.className = 'pg-acd-ct__email-domain';
				left.appendChild(e1);
				right.appendChild(e2);
				if (e3) {
					e3.className = (e3.className ? e3.className + ' ' : '') + 'pg-acd-ct__email-pick';
					right.appendChild(e3);
				}
				emailWrap.innerHTML = '';
				emailWrap.appendChild(left);
				emailWrap.appendChild(mid);
				emailWrap.appendChild(right);
				for (n = 0; n < extras.length; n++) emailWrap.appendChild(extras[n]);
				setDirectDomain();
				unlockMail(e1);
				unlockMail(e2);
				e2.addEventListener('input', function () {
					setDirectDomain();
					unlockMail(e2);
				});
				e2.addEventListener('focus', function () {
					setDirectDomain();
					unlockMail(e2);
				});
				if (e3) {
					e3.addEventListener('change', function () {
						if (e3.value && e3.value !== 'etc') e2.value = e3.value;
						unlockMail(e2);
					});
				}
				[0, 80, 400].forEach(function (t) {
					setTimeout(function () {
						setDirectDomain();
						unlockMail(e1);
						unlockMail(e2);
					}, t);
				});
			}
		}
	}

	function markPh(sel) {
		if (!sel) return;
		function sync() {
			var empty = !sel.value || sel.selectedIndex <= 0 || /선택|전체/.test(sel.options[sel.selectedIndex].text || '');
			if (empty) sel.classList.add('is-ph');
			else sel.classList.remove('is-ph');
		}
		sel.addEventListener('change', sync);
		sync();
	}
	var typeSel = root.querySelector('.pg-acd-ct__select select, select[name="board_category"]');
	if (typeSel && typeSel.options.length && typeSel.options[0].value !== '') {
		var ph = document.createElement('option');
		ph.value = '';
		ph.textContent = '문의 유형 선택';
		typeSel.insertBefore(ph, typeSel.options[0]);
		if (!typeSel.value) typeSel.selectedIndex = 0;
	}
	markPh(typeSel);

	var upload = root.querySelector('[data-acd-upload]');
	if (upload) {
		upload.addEventListener('click', function () {
			var inputs = root.querySelectorAll('.pg-acd-ct__file-list input[type="file"]');
			var i;
			for (i = 0; i < inputs.length; i++) {
				if (!inputs[i].value) {
					inputs[i].click();
					return;
				}
			}
			if (inputs.length) inputs[inputs.length - 1].click();
		});
	}

	function fillSubject() {
		var subject = root.querySelector('#subject, input[name="subject"]');
		if (!subject) return;
		var cat = root.querySelector('.pg-acd-ct__select select, select[name="board_category"]');
		var typeText = '';
		if (cat && cat.selectedIndex >= 0) {
			typeText = String(cat.options[cat.selectedIndex].text || '').replace(/^\s+|\s+$/g, '');
		}
		if (!typeText || typeText === '선택' || /전체|문의 유형/.test(typeText)) typeText = '문의';
		var name = '';
		if (writer && writer.value) name = writer.value;
		else if (nameFb && nameFb.value) name = nameFb.value;
		if (writer && !writer.value && name) writer.value = name;
		var org = root.querySelector('#acdOrg');
		var orgVal = org ? String(org.value || '').replace(/^\s+|\s+$/g, '') : '';
		var parts = [typeText];
		if (name) parts.push(name);
		if (orgVal) parts.push(orgVal);
		subject.value = parts.join(' - ');
	}

	var submit = root.querySelector('[data-acd-submit]');
	var writeBtn = root.querySelector('[data-acd-write]');
	if (submit && writeBtn) {
		submit.addEventListener('click', function (e) {
			e.preventDefault();
			var agree = root.querySelector('#acdAgree');
			if (agree && !agree.checked) {
				window.alert('개인정보 수집 및 이용에 동의해 주세요.');
				return;
			}
			fillSubject();
			if (typeof writeBtn.onclick === 'function') {
				writeBtn.onclick();
				return;
			}
			writeBtn.click();
		});
	}
}

function mfAccountPage() {
	var root = document.querySelector('.pg-acc');
	if (!root) return;
	var isSub = root.className.indexOf('pg-acc--sub') !== -1;
	var i;

	var points = root.querySelector('[data-acc-stat="points"]');
	if (points) {
		var pt = String(points.textContent || '').replace(/^\s+|\s+$/g, '');
		pt = pt.replace(/원|점/g, '').replace(/\s+/g, '');
		if (!pt) pt = '0';
		if (!/P$/i.test(pt)) points.textContent = pt + ' P';
	}
	var coupons = root.querySelector('[data-acc-stat="coupons"]');
	if (coupons) {
		var cp = String(coupons.textContent || '').replace(/개/g, '').replace(/\s+/g, '');
		coupons.textContent = cp || '0';
	}
	var orderStat = root.querySelector('[data-acc-stat="orders"]');
	if (orderStat && !String(orderStat.textContent || '').replace(/\s+/g, '')) {
		orderStat.textContent = '0';
	}

	var empty = root.querySelector('.ec-base-prdEmpty');
	if (empty) {
		var emptyTxt = empty.childNodes;
		for (i = 0; i < emptyTxt.length; i++) {
			if (emptyTxt[i].nodeType === 3 && String(emptyTxt[i].textContent || '').replace(/\s+/g, '')) {
				emptyTxt[i].textContent = '아직 주문 내역이 없습니다.';
			}
		}
	}

	var orders = root.querySelectorAll('.xans-myshop-orderhistorylistitem .order');
	for (i = 0; i < orders.length; i++) {
		if (!isSub && i >= 2) orders[i].style.display = 'none';
		var dateEl = orders[i].querySelector('.date');
		if (dateEl) {
			dateEl.textContent = String(dateEl.textContent || '')
				.replace(/[/-]/g, '.')
				.replace(/\s+\d{1,2}:\d{2}.*$/, '')
				.replace(/^\s+|\s+$/g, '');
		}
		var numEl = orders[i].querySelector('.number');
		if (numEl) {
			var numA = numEl.querySelector('a');
			var raw = String((numA ? numA.textContent : numEl.textContent) || '').replace(/[()]/g, '').replace(/^\s+|\s+$/g, '');
			if (raw && raw.indexOf('Order') === -1) {
				if (numA) numA.textContent = 'Order No. ' + raw;
				else numEl.textContent = 'Order No. ' + raw;
			}
		}
		var st = orders[i].querySelector('.txtStatus');
		if (st) {
			var stt = st.textContent || '';
			st.classList.remove('is-cancel', 'is-progress', 'is-done', 'is-pending');
			if (/취소|반품|교환/.test(stt)) st.classList.add('is-cancel');
			else if (/배송중|배송준비|출고/.test(stt)) st.classList.add('is-progress');
			else if (/배송완료|구매확정/.test(stt)) st.classList.add('is-done');
			else if (/입금|결제대기/.test(stt)) st.classList.add('is-pending');
		}
		if (isSub) {
			var gRight = orders[i].querySelector('.prdFoot .gRight');
			var csBtns = orders[i].querySelector('.ec-base-button');
			if (gRight && csBtns) {
				var csLinks = csBtns.querySelectorAll('a');
				var c;
				for (c = 0; c < csLinks.length; c++) {
					if (csLinks[c].className.indexOf('displaynone') !== -1) continue;
					csLinks[c].textContent = 'Cancel or Return';
					gRight.appendChild(csLinks[c]);
				}
			}
			if (gRight) {
				var tr = gRight.querySelectorAll('a');
				var t;
				for (t = 0; t < tr.length; t++) {
					var label = String(tr[t].textContent || '');
					if (/후기|철회|확정/.test(label)) {
						tr[t].style.display = 'none';
						continue;
					}
					if (label.indexOf('배송조회') !== -1) tr[t].textContent = 'Track';
				}
			}
		}
	}

	if (isSub) {
		mfAccOrderListChrome(root);
		mfAccCsType(root);
		mfAccCouponStrip(root);
		mfAccPointStrip(root);
		mfAccAddrBadge(root);
		mfAccInquiryWrite(root);
		mfAccPaginate(root);
	}

	var path = String(location.pathname || '');
	var links = root.querySelectorAll('.xans-myshop-main a[href]');
	for (i = 0; i < links.length; i++) {
		var href = links[i].getAttribute('href') || '';
		var base = href.split('?')[0];
		if (!base || base === '/') continue;
		var on = false;
		if (path.indexOf('/myshop/order/') === 0 && base.indexOf('/myshop/order/') === 0) on = true;
		else if (path.indexOf('/myshop/addr/') === 0 && base.indexOf('/myshop/addr/') === 0) on = true;
		else if (path.indexOf('/myshop/coupon/') === 0 && base.indexOf('/myshop/coupon/') === 0) on = true;
		else if (path.indexOf('/myshop/mileage/') === 0 && base.indexOf('/myshop/mileage/') === 0) on = true;
		else if (path.indexOf('/board/consult/') === 0 && base.indexOf('/board/consult/') === 0) on = true;
		else if (path === base || (base !== '/myshop/index.html' && path.indexOf(base) === 0)) on = true;
		if (on) links[i].classList.add('is-on');
	}
}

function mfAccFmtDate(v) {
	return String(v || '').replace(/[/-]/g, '.').replace(/\s+\d{1,2}:\d{2}.*$/, '').replace(/^\s+|\s+$/g, '');
}

function mfAccOrderListChrome(root) {
	var head = root.querySelector('.xans-myshop-orderhistoryhead');
	if (!head) return;
	if (!head.querySelector('.pg-acc__range')) {
		var start = head.querySelector('input[name="start_date"], #start_date, input.fText[id*="start"]');
		var end = head.querySelector('input[name="end_date"], #end_date, input.fText[id*="end"]');
		var inputs = head.querySelectorAll('.datepicker input[type="text"]');
		var s = start ? start.value : (inputs[0] ? inputs[0].value : '');
		var e = end ? end.value : (inputs[1] ? inputs[1].value : '');
		if (s && e) {
			var p = document.createElement('p');
			p.className = 'pg-acc__range';
			p.textContent = mfAccFmtDate(s) + ' ~ ' + mfAccFmtDate(e);
			head.appendChild(p);
		}
	}
	var listMod = root.querySelector('.xans-myshop-orderhistorylistitem');
	if (listMod && !root.querySelector('.pg-acc__toolbar')) {
		var n = root.querySelectorAll('.xans-myshop-orderhistorylistitem .order').length;
		if (root.querySelector('.ec-base-prdEmpty')) n = 0;
		var bar = document.createElement('div');
		bar.className = 'pg-acc__toolbar';
		var tot = document.createElement('p');
		tot.className = 'pg-acc__total';
		tot.textContent = 'Total ' + n;
		bar.appendChild(tot);
		if (listMod.parentNode) listMod.parentNode.insertBefore(bar, listMod);
	}
	var year = head.querySelector('.period a[days="365"]');
	if (year && typeof window.jQuery === 'function') {
		window.jQuery(year).off('click.mfAccYear').on('click.mfAccYear', function (ev) {
			ev.preventDefault();
			var $ = window.jQuery;
			var days = 365;
			var end = new Date();
			var start = new Date();
			start.setDate(start.getDate() - days);
			function pad(n) { return n < 10 ? '0' + n : '' + n; }
			function fmt(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
			var $s = $('input[name="start_date"]');
			var $e = $('input[name="end_date"]');
			if ($s.length) $s.val(fmt(start));
			if ($e.length) $e.val(fmt(end));
			var sub = head.querySelector('input[type="submit"], .btnSubmit input, .btnSubmit a, button[type="submit"]');
			if (sub) sub.click();
		});
	}
}

function mfAccCsType(root) {
	if (!root.querySelector('.xans-myshop-orderhistoryapplycancel, .xans-myshop-orderhistoryapplyreturn, .xans-myshop-orderhistoryapplyexchange')) return;
	if (root.querySelector('.pg-acc--cs-type')) return;
	var q = String(location.search || '');
	var wrap = document.createElement('div');
	wrap.className = 'pg-acc--cs-type';
	var items = [
		{ href: '/myshop/order/cancel.html' + q, label: '주문 취소', key: 'cancel' },
		{ href: '/myshop/order/return.html' + q, label: '반품 신청', key: 'return' },
		{ href: '/myshop/order/exchange.html' + q, label: '교환 신청', key: 'exchange' }
	];
	var path = String(location.pathname || '');
	var i;
	for (i = 0; i < items.length; i++) {
		var a = document.createElement('a');
		a.href = items[i].href;
		a.textContent = items[i].label;
		if (path.indexOf(items[i].key + '.html') !== -1) a.className = 'is-on';
		wrap.appendChild(a);
	}
	var content = root.querySelector('.pg-acc__content');
	if (content && content.firstChild) content.insertBefore(wrap, content.firstChild);
}

function mfAccCouponStrip(root) {
	var list = root.querySelector('.xans-myshop-couponlist');
	if (!list || root.querySelector('.pg-acc__strip')) return;
	var rows = list.querySelectorAll('.ec-base-table tbody tr:nth-child(odd)');
	var n = 0;
	var r;
	for (r = 0; r < rows.length; r++) {
		if (rows[r].querySelector('.coupon_name')) n++;
	}
	var strip = document.createElement('div');
	strip.className = 'pg-acc__strip';
	strip.innerHTML = '<div class="pg-acc__strip-cell"><span class="pg-acc__strip-l">Coupons</span><span class="pg-acc__strip-v">' + n + '</span></div>';
	if (list.parentNode) list.parentNode.insertBefore(strip, list);
}

function mfAccPointStrip(root) {
	var data = root.querySelector('.xans-myshop-summary .data');
	if (!data) return;
	var v = String(data.textContent || '').replace(/원|점/g, '').replace(/\s+/g, '');
	if (v && !/P$/i.test(v)) data.textContent = v + ' P';
}

function mfAccAddrBadge(root) {
	var cells = root.querySelectorAll('.xans-myshop-addrlist tbody.center tr td');
	var i;
	for (i = 0; i < cells.length; i++) {
		if (cells[i].querySelector('img[alt="기본"]') && !cells[i].querySelector('.pg-acc__badge--default')) {
			var b = document.createElement('span');
			b.className = 'pg-acc__badge--default';
			b.textContent = '기본 배송지';
			cells[i].appendChild(b);
		}
	}
}

function mfAccInquiryWrite(root) {
	var btn = root.querySelector('.xans-board-buttonlist-9 .btnSubmitFix, .xans-board-buttonlist-9 a[href*="write"]');
	if (btn && /글쓰기/.test(btn.textContent || '')) btn.textContent = 'New Inquiry';
}

function mfAccPaginate(root) {
	var pagers = root.querySelectorAll('.ec-base-paginate');
	var p;
	for (p = 0; p < pagers.length; p++) {
		var pager = pagers[p];
		var cur = pager.querySelector('a.this');
		var curHref = cur ? (cur.getAttribute('href') || '') : '';
		var arrows = [];
		var kids = pager.children;
		var k;
		for (k = 0; k < kids.length; k++) {
			var el = kids[k];
			if (el.tagName !== 'A') continue;
			var cls = el.className || '';
			if (cls.indexOf('first') !== -1 || cls.indexOf('last') !== -1) continue;
			arrows.push(el);
		}
		if (arrows[0] && curHref && (arrows[0].getAttribute('href') || '') === curHref) {
			arrows[0].classList.add('is-off');
		}
		if (arrows[1] && curHref && (arrows[1].getAttribute('href') || '') === curHref) {
			arrows[1].classList.add('is-off');
		}
	}
}

function bottomNav(){
    var lastScrollTop = 0;
    var btnTop = document.querySelector('.bottom-nav__top');
    var fixedButton = document.getElementById("orderFixArea");
    if(fixedButton){
        document.body.classList.add("button--fixed");
    };
	if (!btnTop) return;

	window.addEventListener("scroll", function(){
		var scroll = window.pageYOffset || document.documentElement.scrollTop;
        var nav = document.querySelector('.bottom-nav');
		if (nav) {
			if (scroll > lastScrollTop){
				nav.classList.add('bottom-nav--hide');
			} else {
				nav.classList.remove('bottom-nav--hide');
			}
			if(scroll === document.body.scrollHeight - document.documentElement.offsetHeight){
				nav.classList.remove('bottom-nav--hide');
			}
		}
		lastScrollTop = scroll <= 0 ? 0 : scroll;

        var currentScrollPercentage = getCurrentScrollPercentage();
        if(currentScrollPercentage > 30){
        	btnTop.classList.add('bottom-nav__top--show');
        } else {
			btnTop.classList.remove('bottom-nav__top--show');
        }
	});

    btnTop.addEventListener('click', function(){
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
    });
}

function getOffset(element){
    if (!element.getClientRects().length)
    {
      return { top: 0, left: 0 };
    }

    var rect = element.getBoundingClientRect();
    var win = element.ownerDocument.defaultView;
    return (
    {
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset
    });
}

function getQuickPosition(){
	var role = document.querySelector("meta[name='path_role']").getAttribute('content');
	if (role === "MAIN") {
		return getMainQuickPosition();
	} else {
		return getSubQuickPosition();
	}
}

function getMainQuickPosition(){
	var quickMenu = document.querySelector('#quick');
	var collection = document.querySelector('.collection');
	var snsItem = document.querySelector('.snsItem');

	var mainTopSpace = 115;
	var mainFooterSpace = 34;

	var top = collection.offsetTop + collection.clientHeight + mainTopSpace;
    var footTop = getOffset(snsItem).top + mainFooterSpace;
	var maxY = footTop - quickMenu.offsetHeight;

	return [top, maxY]
}

function getSubQuickPosition(){
	var quickMenu = document.querySelector('#quick');
	var footer = document.querySelector("#footer");

	var footerSpace = 60;
	var top = 284;
    var footTop = getOffset(footer).top;
	var maxY = footTop - quickMenu.offsetHeight - footerSpace;

	return [top, maxY]
}

function setQuickScrollEvent(y, quick){
	var header = document.querySelector('#header');
	var position = getQuickPosition();
	var scrollY = y;
	if (scrollY >= position[0] - header.offsetHeight){
		if (scrollY < position[1]) {
			quick.classList.add('fixed');
			quick.removeAttribute('style');
        } else {
			quick.classList.remove('fixed');
			quick.style.position = 'absolute';
			quick.style.top = position[1] + 'px';
        }
	} else {
		quick.style.top = position[0] + 'px';
        quick.classList.remove('fixed');
    }
}

function quickGoTop(){
    var btnTop = document.querySelector('#quick .pageTop');
	btnTop.addEventListener('click', function(){
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
    });
}

function topBanner(){
    var banner = document.querySelector('#topBanner');
    if(!banner) return;
    var btnClose = banner.querySelector('.btnClose');
    btnClose.addEventListener('click', function(){
        banner.classList.add("hidden");
    });
}


function getCurrentScrollPercentage(){
	return (window.scrollY + window.innerHeight) / document.body.clientHeight * 100
}


jQuery(document).ready(function() {

	/* 카테고리가 대량일때 나머지 숨김
	jQuery("#header .inner .top_nav_box .top_category").each(function(){
		var top_category_length = jQuery(' > ul > li',this).length;
		if ( top_category_length > 20 ) {
			jQuery(this).append('<div class="cate_more"></div>');
		}
		jQuery(' > ul > li:lt(20)',this).show();
	}); */

	/* 카테고리가 대량일때 이상일때 출력버튼
	jQuery("#header .inner .top_nav_box .top_category .cate_more").click(function() {
		var cate_more_on = jQuery(this).hasClass('on');
		if ( cate_more_on == false )  {
			jQuery('#header .inner .top_nav_box .top_category > ul > li').show();
			jQuery('#header .inner .top_nav_box .top_category .cate_more').addClass("on");
		} else {
			jQuery('#header .inner .top_nav_box .top_category .cate_more').removeClass("on");
			jQuery('#header .inner .top_nav_box .top_category > ul > li').hide();
			jQuery('#header .inner .top_nav_box .top_category > ul > li:lt(20)').show();
		}
	}); */

	/* 최상단배너 하루동안 닫기 - 서정환 */
    jQuery(".main_top_banner .top_banner_box_inner .top_banner_close .icon").bind("click", function() {
		if(jQuery("#top_banner_box_cloase").is(":checked")){
			jQuery(".main_top_banner").slideUp("fast");
			setCookiem("top_banner_cookie", "top_banner_cookie", 1);
		 } else {
			jQuery(".main_top_banner").slideUp("fast");
		 }
    });

	var main_top_banner_diplay = jQuery(".main_top_banner").attr("data-ez-display");
	if (!getCookiem("top_banner_cookie") && (main_top_banner_diplay == 'visible')) {
		jQuery(".main_top_banner").slideDown("fast");
	}

	/* 최상단배너 닫기버튼 없을시 높이 수정 */
	if(jQuery(".top_banner_close").css("display") == "none"){
		jQuery(".main_top_banner").addClass('close_none');
		if (main_top_banner_diplay == 'visible') {
			jQuery(".main_top_banner").slideDown("fast");
		}
	}

	/* 상단 고객센터 - 서정환 */
	jQuery("#header .inner .toparea .toparea_state .toparea_state_board").click(function() {
		var theme_cl = jQuery(this).attr('class');
		jQuery(this).toggleClass('on');
	});

	/* 상단검색 팝업 - 서정환 */
	jQuery('#header .inner .top_nav_box .top_mypage .eSearch, .bottom-nav__tabBar li .eSearch').bind("click", function() {
		jQuery(".xans-layout-searchheader").css('display', 'block');
		jQuery('body').addClass('not_scroll').bind('scroll touchmove mousewheel', function(e){ // 브라우저 스크롤막기
			e.preventDefault();
			e.stopPropagation();
			return false;
		});
	})
	jQuery('.xans-layout-searchheader fieldset .top_search_box .btnClose').bind("click", function() {
		jQuery(".xans-layout-searchheader").css('display', 'none');
		jQuery('body').removeClass('not_scroll').unbind('scroll touchmove mousewheel'); // 브라우저 스크롤풀기
	})

	/* 로그인폼 placeholder 추가 - 서정환 */
	if (jQuery('.xans-member-login').val() != undefined) {
		jQuery('#member_passwd').attr('placeholder', '비밀번호');
	}

	/* 비회원 주문조회페이지 placeholder 추가 - 서정환 */
	setTimeout(function(){
		if (jQuery('.xans-myshop-orderhistorynologin').val() != undefined) {
			jQuery('#order_name').attr('placeholder', '주문자명');
			jQuery('#order_id').attr('placeholder', '주문번호(하이픈(-) 포함)');
			jQuery('#order_password').attr('placeholder', '비회원주문 비밀번호');
		}
	}, 100);

	/* 검색페이지 인풋박스에서 텍스트 삭제 - 서정환 */
	jQuery('#ec-product-searchdata-searchkeyword_form').find('button.btnDelete').bind('click', function() {
		jQuery('#ec-product-searchdata-keyword').val('').focus();
	});

	/* 검색페이지 정렬 텍스트 변경 */
	jQuery("#order_by").each(function(){
		jQuery('option:first-child', this).text('- 정렬방식 -');
	});

	/* 멀티샵 없을경우 숨김 */
	jQuery(".xans-layout-multishoplist").each(function(){
		var multishoplist_count = jQuery('li', this).length;
		if ( multishoplist_count == 1 ) {
			jQuery(this).hide();
		}
	});

	/* 하단 에스크로 사용하면 출력 */
	jQuery("#footer .inner .bt_escrow").each(function(){
		var bt_escrow = jQuery(this).attr("data-ez-escrow");
		if ( !bt_escrow == '' ) {
			var bt_escrow_name = jQuery("a img[data-ez-escrow-id="+ bt_escrow +"]", this).addClass('on');
			jQuery(this).css('display','flex');
		}
	});

	/* 로그인페이지 SNS 사용하면 출력 */
	jQuery(".xans-member-login .login__sns .wrap_sns_log a").each(function(){
		var wrap_sns_log = jQuery(this).hasClass('displaynone');
		if( wrap_sns_log == false){
			jQuery(".xans-member-login .login__sns").css('display','block');
		}
	});

	/* 기획전 레이아웃변경에 따른 타겟고정위치 변경 */
	var header_height = document.getElementById("header").scrollHeight;
	jQuery('.xans-project-list h3 span').css('top',-header_height+40);

	/* 모바일에서 쇼핑큐레이션 */
	jQuery('#shoppQbtn').click(function(){
		if (jQuery("#searchContent.xans-product-searchdata").is(":hidden")) {
			jQuery('#searchContent.xans-product-searchdata').slideDown('normal');
			jQuery(this).text('상세검색 닫기');
			jQuery(this).css('margin-top','0');
		} else {
			jQuery('#searchContent.xans-product-searchdata').slideUp('normal');
			jQuery(this).text('상세검색');
		}
	});

	/* 모바일에서 쇼핑큐레이션 없을시 버튼 숨김 */
	jQuery("#searchContent").each(function(){
		var prdCount_count = jQuery("#ec-searchdata-area", this).length;
		if ( prdCount_count == '0' ) {
			jQuery('#shoppQbtn').hide();
		}
	});

	/* 마이페이지 나의게시글 없을때 메시지 표시 */
	jQuery(".xans-myshop-boardpackage").each(function(){
		var boardlist = jQuery(".xans-myshop-boardlist table", this).length;
		if ( boardlist == '0' ) {
			jQuery('.myshop_boardlist_empty').css('display','flex');
		}
	});

	/* 더보기 클릭시 */
	jQuery('.btnMore').click(function(){
		setTimeout(function(){
			ifmore();
		},600)
	});
	setTimeout(function(){
		ifmore();
	},300)

	/* 상단 카테고리 변경 감지 */
	top_category(); // 상단카테고리
	observeTopCategory(); // 상단카테고리 변경 감지
});

/* 상단 카테고리 변경 감지 */
function observeTopCategory(){
	var targetNode = jQuery('#header .xans-layout-category > ul')[0];

	// MutationObserver 인스턴스 생성
	var observer = new MutationObserver(function(mutationsList, observer) {
			// 변경 감지된 경우 상단카테고리 실행
			top_category();
	});

	// 상단 카테고리가 있는 경우 변경 감지
	if (targetNode) {
			observer.observe(targetNode, { childList: true, subtree: true });
	}
}

/* 우측퀵바 하단오면 멈추기 */
function checkOffset() {
	var a = jQuery(document).scrollTop() + window.innerHeight;
	var b = jQuery('#footer').offset().top;
	if (a < b) {
		jQuery('#right_quick').css('bottom', '');
	} else {
		jQuery('#right_quick').css('bottom', (30+(a-b))+'px');
	}
}
jQuery(document).ready(checkOffset);
jQuery(window).scroll(checkOffset);

/* 상단 카테고리 */
function top_category(){
	/* 상단카테고리 */
	jQuery('#header .top_category li').mouseenter(function(e) {
		var $this = jQuery(this).addClass('on')
	}).mouseleave(function(e) {
		jQuery(this).removeClass('on');
	});

	/* 상단카테고리 중분류체크 */
	jQuery('#header .top_category ul.sub_cate01 li').each(function() {
		if (jQuery(this).children('ul').length == 0) {
			jQuery(this).addClass('noChild');
		}
	});
}

/* 최상단배너 쿠키 스크립트 - 서정환 */
function setCookiem(cookie_name, cookie_value, expire_date) {
    var today = new Date();
    var expire = new Date();
    expire.setTime(today.getTime() + 3600000 * 24 * expire_date);
    cookies = cookie_name + '=' + cookie_value + '; path=/;';
    if (expire_date != 0) cookies += 'expires=' + expire.toGMTString();
    document.cookie = cookies;
}

function delCookiem(cookie_name) {
	var _today = new Date();
	var value = '';
	_today.setDate(_today.getDate() - 1);
	document.cookie = cookie_name + "=" + value + '; path=/;' + "; expires=" + _today.toGMTString();
}

function getCookiem(name) {
    lims = document.cookie;
    var index = lims.indexOf(name + "=");
    if (index == -1) {
        return null;
    }
    index = lims.indexOf("=", index) + 1; // first character
    var endstr = lims.indexOf(';', index);
    if (endstr == -1) {
        endstr = lims.length; // last character
    }
    return unescape(lims.substring(index, endstr));
}

/* 더보기 클릭시 */
function ifmore(){
	/* 상품 썸네일 관심상품 출력 & 숨김 */
	setTimeout(function(){
		jQuery('.ec-base-product .prdList .icon__box .wish').each(function(){
			var isstatus = jQuery(this).children('img').attr('icon_status');
			if ( isstatus == 'on' ) {
				jQuery(this).addClass('on');
			}
		});
		jQuery('.ec-base-product .prdList .icon__box .wish').click(function(){
			var isstatus = jQuery(this).children('img').attr('icon_status');
			if ( isstatus == 'off' ) {
				jQuery(this).addClass('on');
			} else {
				jQuery(this).removeClass('on');
			}
		});
	},200)
	jQuery('.ec-base-product .prdList > li').each(function(){
		/* 상품진열 장바구니 사용안할시 숨김 */
		if (jQuery(".icon__box .cart > .ec-admin-icon", this).length == 1) {
		} else {
			jQuery('.icon__box .cart', this).hide();
		}
		/* 상품진열 옵션미리보기 사용안할시 숨김 */
		if (jQuery(".icon__box .option > a", this).length == 1) {
		} else {
			jQuery('.icon__box .option', this).hide();
		}
		/* 상품진열 관심상품 사용안할시 숨김 */
		if (jQuery(".icon__box .wish > .ec-product-listwishicon", this).length == 1) {
		} else {
			jQuery('.icon__box .wish', this).hide();
		}
	});
}
