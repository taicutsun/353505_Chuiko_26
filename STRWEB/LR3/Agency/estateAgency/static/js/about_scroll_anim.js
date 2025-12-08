// about_scroll_anim.js
// Scroll-driven animation: houses move apart and magnifier scales, works in both directions
(function () {
  'use strict';

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('scroll-anim');
    if (!container) return;
    
    const left = container.querySelector('.house-left');
    const center = container.querySelector('.house-center');
    const right = container.querySelector('.house-right');
    const magnifier = document.getElementById('magnifier');

    if (!left || !center || !right || !magnifier) return;

    let ticking = false;

    function update() {
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;

      // Start animation when element enters viewport (near top)
      const animationStart = vh * 0.15; // Start when element is 15% from top
      // End much earlier - when element reaches about 25% of viewport (well before half container)
      const animationEnd = vh * 0.25;   // End at 25% of viewport (completes early)
      const animationRange = animationEnd - animationStart;
      
      // Calculate progress: 0 when element top is at animationStart, 1 when at animationEnd
      // Works in both directions (scrolling up and down)
      const elementTop = rect.top;
      const progRaw = (animationStart - elementTop) / animationRange;
      const prog = clamp(progRaw, 0, 1);

      // If element is completely out of view, reset to initial state
      if (rect.bottom < 0 || rect.top > vh) {
        if (left) left.style.transform = 'translateX(0) translateY(0) scale(1)';
        if (right) right.style.transform = 'translateX(0) translateY(0) scale(1)';
        if (center) center.style.transform = 'translateY(0) scale(1)';
        if (magnifier) {
          magnifier.style.transform = 'translateX(-50%) scale(0.6)';
          magnifier.style.opacity = '0.25';
        }
        ticking = false;
        return;
      }

      // Calculate offsets - houses move apart
      const maxOffset = Math.min(260, Math.round(vw * 0.22));
      const leftOffset = -Math.round(maxOffset * prog);
      const rightOffset = Math.round(maxOffset * prog);
      const centerLift = -Math.round(18 * prog);

      // Baseline scales for subtle parallax
      const baseScaleLeft = 1 - 0.01 * prog;
      const baseScaleRight = 1 - 0.01 * prog;
      const baseScaleCenter = 1 + 0.01 * prog;

      // Apply house transforms (will be combined with zoom effect below)
      const contWidth = rect.width || container.offsetWidth;
      const magCenter = contWidth / 2;

      // Process each house with zoom effect
      const houses = [
        { el: left, offsetX: leftOffset, offsetY: 0, baseScale: baseScaleLeft },
        { el: center, offsetX: 0, offsetY: centerLift, baseScale: baseScaleCenter },
        { el: right, offsetX: rightOffset, offsetY: 0, baseScale: baseScaleRight }
      ];

      houses.forEach(function (house) {
        if (!house.el) return;
        
        // Calculate zoom based on distance from magnifier center
        const elRect = house.el.getBoundingClientRect();
        const elCenter = (elRect.left - rect.left) + (elRect.width || house.el.offsetWidth || 0) / 2;
        const dist = Math.abs(elCenter - magCenter);
        const maxDist = contWidth * 0.6;
        const norm = clamp(dist / maxDist, 0, 1);
        const zoom = 1 + (0.35 * (1 - norm) * prog);
        
        // Combine baseline scale with zoom
        const finalScale = house.baseScale * zoom;
        
        // Apply transform
        house.el.style.transform = `translateX(${house.offsetX}px) translateY(${house.offsetY}px) scale(${finalScale})`;
      });

      // Magnifier: scale and opacity synchronized with houses
      if (magnifier) {
        const magMin = 0.6;
        const magMax = 2.0;
        const magScale = magMin + (magMax - magMin) * prog;
        magnifier.style.transform = `translateX(-50%) scale(${magScale})`;
        magnifier.style.opacity = (prog > 0.02 ? '1' : '0.25');
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    
    // Initial call to set starting state
    update();
  });

})();
