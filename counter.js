class ScrollCounter {
  constructor(selector = '.counter-value', options = {}) {
    this.selector = selector;
    this.defaultOptions = {
      duration: 2000,
      easing: 'linear',
      once: true,
      replay: false,
      prefix: '',
      suffix: '',
      onComplete: null,
    };
    this.options = { ...this.defaultOptions, ...options };
    this.observed = new Set();
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersect.bind(this),
        { threshold: 0.6 }
      );

      document.querySelectorAll(this.selector).forEach((el) => {
        el.dataset.originalValue = el.textContent.replace(/[^\d.-]/g, '') || "0"; // store initial value
        this.observer.observe(el);
      });
    } else {
      window.addEventListener('scroll', this.handleScrollFallback.bind(this));
    }
  }

  handleScrollFallback() {
    document.querySelectorAll(this.selector).forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (isVisible && (!this.options.once || !this.observed.has(el))) {
        this.animateCounter(el);
        if (this.options.once) this.observed.add(el);
      }
    });
  }

  handleIntersect(entries) {
    entries.forEach((entry) => {
      const el = entry.target;

      if (entry.isIntersecting) {
        if (!this.options.replay && this.observed.has(el)) return;

        // Reset start value if replay is enabled
        if (this.options.replay) {
          const original = parseFloat(el.dataset.originalValue || "0");
          el.textContent = this.applyFormat(original, el);
        }

        this.animateCounter(el);
        if (this.options.once) this.observed.add(el);
      } else if (this.options.replay) {
        this.observed.delete(el);
      }
    });
  }

  animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count')) || 0;
    const duration = parseInt(el.getAttribute('data-duration')) || this.options.duration;
    const prefix = el.getAttribute('data-prefix') || this.options.prefix || '';
    const suffix = el.getAttribute('data-suffix') || this.options.suffix || '';
    const easing = this.getEasing(el.getAttribute('data-easing') || this.options.easing);

    const start = parseFloat(el.dataset.originalValue || "0");
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const value = Math.floor(start + (target - start) * easedProgress);

      el.textContent = `${prefix}${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
        if (typeof this.options.onComplete === 'function') {
          this.options.onComplete(el);
        }
      }
    };

    requestAnimationFrame(animate);
  }

  applyFormat(value, el) {
    const prefix = el.getAttribute('data-prefix') || this.options.prefix || '';
    const suffix = el.getAttribute('data-suffix') || this.options.suffix || '';
    return `${prefix}${value}${suffix}`;
  }

  getEasing(type) {
    const easings = {
      linear: (t) => t,
      easeIn: (t) => t * t,
      easeOut: (t) => t * (2 - t),
      easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    };
    return easings[type] || easings.linear;
  }
}

window.ScrollCounter = ScrollCounter;
