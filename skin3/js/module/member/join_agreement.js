window.addEventListener('DOMContentLoaded', function() {
	var root = document.querySelector('.pg-gate.is-agree') || document.querySelector('.pg-gate.is-join') || document;
	var toggles = root.querySelectorAll('.btnToggle');
	toggles.forEach(function(toggle) {
		toggle.addEventListener('click', function(e) {
			e.preventDefault();
			var parent = toggle.closest('.agreeArea');
			if (!parent) return;
			parent.classList.toggle('on');
		});
	});

	var nextBtn = document.getElementById('agreeNextBtn') || root.querySelector('.ec-base-button .btnSubmitFix');
	if (!nextBtn) return;

	function isVisible(el) {
		if (!el) return false;
		if (el.classList && el.classList.contains('displaynone')) return false;
		var area = el.closest('.agreeArea, .displaynone');
		if (area && area.classList.contains('displaynone')) return false;
		return el.offsetParent !== null || el.getClientRects().length > 0;
	}

	function requiredOk() {
		var ids = ['agree_service_check0', 'agree_privacy_check0'];
		for (var i = 0; i < ids.length; i++) {
			var el = document.getElementById(ids[i]);
			if (!el || !isVisible(el)) continue;
			if (!el.checked) return false;
		}
		return true;
	}

	function syncNext() {
		var ok = requiredOk();
		if (ok) {
			nextBtn.classList.remove('is-disabled');
			nextBtn.removeAttribute('disabled');
			nextBtn.setAttribute('aria-disabled', 'false');
		} else {
			nextBtn.classList.add('is-disabled');
			nextBtn.setAttribute('aria-disabled', 'true');
		}
	}

	nextBtn.addEventListener('click', function(e) {
		if (nextBtn.classList.contains('is-disabled') || nextBtn.getAttribute('aria-disabled') === 'true') {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	}, true);

	root.addEventListener('change', function(e) {
		if (e.target && e.target.type === 'checkbox') syncNext();
	});
	syncNext();
});
