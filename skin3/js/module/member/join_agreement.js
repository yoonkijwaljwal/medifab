window.addEventListener('DOMContentLoaded', function() {
	var root = document.querySelector('.pg-gate.is-join') || document;
	var toggles = root.querySelectorAll('.btnToggle');
	toggles.forEach(function(toggle) {
		toggle.addEventListener('click', function(e) {
			e.preventDefault();
			var parent = toggle.closest('.agreeArea');
			if (!parent) return;
			parent.classList.toggle('on');
		});
	});
});
