// Set current year in footer
document.addEventListener("DOMContentLoaded", () => {
	const yearSpans = document.querySelectorAll("#year");
	const year = new Date().getFullYear();
	yearSpans.forEach(s => s.textContent = String(year));
});

// Mobile navigation toggle
(() => {
	const toggle = document.querySelector(".nav-toggle");
	const links = document.querySelector(".nav-links");
	if (!toggle || !links) return;

	const setExpanded = (expanded) => {
		toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
		links.classList.toggle("open", expanded);
	};

	let isOpen = false;
	toggle.addEventListener("click", () => {
		isOpen = !isOpen;
		setExpanded(isOpen);
	});

	links.addEventListener("click", (e) => {
		const target = e.target;
		if (target && target.tagName === "A" && isOpen) {
			isOpen = false;
			setExpanded(false);
		}
	});
})();

// Smooth scroll for in-page anchors (JS approach for wider browser support)
(() => {
	document.addEventListener("click", (e) => {
		const link = e.target && (e.target.closest ? e.target.closest("a[href^='#']") : null);
		if (!link) return;
		const hash = link.getAttribute("href");
		if (!hash || hash === "#") return;
		const target = document.querySelector(hash);
		if (!target) return;
		e.preventDefault();
		target.scrollIntoView({ behavior: "smooth", block: "start" });
	});
})();

// Optional: nudge hover animation for cards on pointer devices
(() => {
	const media = window.matchMedia("(pointer:fine)");
	if (!media.matches) return;
	document.querySelectorAll(".menu-card").forEach((card) => {
		card.addEventListener("mouseenter", () => card.classList.add("hover"));
		card.addEventListener("mouseleave", () => card.classList.remove("hover"));
	});
})();

// Hero background image shuffler (index.html)
(() => {
	const heroBg = document.querySelector(".hero .hero-bg");
	if (!heroBg) return;

	// Existing images aus dem /images Ordner (aktuelle Dateinamen)
	const heroImages = [
		"images/Pizza 1.jpg",
		"images/Pizza 2.jpg",
		"images/Pizza 3.jpg",
		"images/Pizza 4.jpg",
		"images/Speise 1.jpg",
		"images/Speise 2.jpg",
		"images/Speise 4.jpg",
		"images/Speise 5.jpg",
		"images/Speise 6.jpg"
	];

	// Preload images (best-effort)
	heroImages.forEach(src => { const i = new Image(); i.src = src; });

	// Shuffle order once
	for (let i = heroImages.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[heroImages[i], heroImages[j]] = [heroImages[j], heroImages[i]];
	}

	let idx = 0;
	const change = () => {
		idx = (idx + 1) % heroImages.length;
		// fade out, swap, fade in
		heroBg.style.opacity = "0";
		setTimeout(() => {
			heroBg.style.backgroundImage = `url('${heroImages[idx]}')`;
			heroBg.style.opacity = "1";
		}, 300);
	};

	// Start after a short delay so the first frame shows the initial image
	let timer = setInterval(change, 6000);

	// Pause when tab hidden
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			clearInterval(timer);
		} else {
			timer = setInterval(change, 6000);
		}
	});
})();


