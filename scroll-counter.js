class ScrollCounter {
  constructor(selector = '.counter-value', options = {}) {
    this.selector = selector;
    this.defaultOptions = {
      duration: 2000,
      easing: 'easeOutQuart',
      once: true,
      replay: false,
      prefix: '',
      suffix: '',
      decimals: 0,
      separator: ',',
      decimal: '.',
      step: 1,
      useGrouping: true,
      currency: false,
      currencySymbol: '$',
      abbreviate: false,
      onStart: null,
      onUpdate: null,
      onComplete: null,
    };
    this.options = { ...this.defaultOptions, ...options };
    this.observed = new Set();
    this.animating = new Set();
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersect.bind(this),
        { threshold: [0.1, 0.25, 0.5, 0.75, 1.0] }
      );

      document.querySelectorAll(this.selector).forEach((el) => {
        this.setupElement(el);
        this.observer.observe(el);
      });
    } else {
      window.addEventListener('scroll', this.throttle(this.handleScrollFallback.bind(this), 16));
    }
  }

  setupElement(el) {
    const originalText = el.textContent;
    const originalNumber = this.extractNumber(originalText);
    
    el.dataset.originalValue = originalNumber.toString();
    el.dataset.originalText = originalText;
    
    // Set initial display
    el.textContent = this.formatNumber(originalNumber, el);
  }

  extractNumber(text) {
    // Extract number from text, handling various formats
    const cleaned = text.replace(/[^\d.-]/g, '');
    const number = parseFloat(cleaned) || 0;
    return number;
  }

  handleScrollFallback() {
    document.querySelectorAll(this.selector).forEach((el) => {
      const rect = el.getBoundingClientRect();
      const threshold = this.getThreshold(el);
      const viewportHeight = window.innerHeight;
      const elementHeight = rect.height;
      const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
      const visibilityRatio = visibleHeight / elementHeight;

      if (visibilityRatio >= threshold && (!this.options.once || !this.observed.has(el))) {
        this.animateCounter(el);
        if (this.options.once) this.observed.add(el);
      }
    });
  }

  handleIntersect(entries) {
    entries.forEach((entry) => {
      const el = entry.target;
      const threshold = this.getThreshold(el);

      if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
        if (!this.options.replay && this.observed.has(el)) return;
        if (this.animating.has(el)) return; // Prevent overlapping animations

        // Reset if replay is enabled
        if (this.options.replay && this.observed.has(el)) {
          const original = parseFloat(el.dataset.originalValue || "0");
          el.textContent = this.formatNumber(original, el);
        }

        this.animateCounter(el);
        if (this.options.once) this.observed.add(el);
      } else if (this.options.replay && !entry.isIntersecting) {
        this.observed.delete(el);
      }
    });
  }

  getThreshold(el) {
    return parseFloat(el.getAttribute('data-threshold')) || 0.6;
  }

  animateCounter(el) {
    if (this.animating.has(el)) return;
    
    const target = parseFloat(el.getAttribute('data-count')) || parseFloat(el.dataset.originalValue) || 0;
    const start = parseFloat(el.dataset.originalValue) || 0;
    const duration = parseInt(el.getAttribute('data-duration')) || this.options.duration;
    const easing = this.getEasing(el.getAttribute('data-easing') || this.options.easing);
    const step = parseFloat(el.getAttribute('data-step')) || this.options.step;

    this.animating.add(el);
    
    // Trigger onStart callback
    if (typeof this.options.onStart === 'function') {
      this.options.onStart(el, start, target);
    }

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      
      let value;
      if (step === 1) {
        value = start + (target - start) * easedProgress;
      } else {
        value = Math.floor((start + (target - start) * easedProgress) / step) * step;
      }

      el.textContent = this.formatNumber(value, el);

      // Trigger onUpdate callback
      if (typeof this.options.onUpdate === 'function') {
        this.options.onUpdate(el, value, progress);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        el.textContent = this.formatNumber(target, el);
        this.animating.delete(el);
        
        // Trigger onComplete callback
        if (typeof this.options.onComplete === 'function') {
          this.options.onComplete(el, target);
        }
      }
    };

    requestAnimationFrame(animate);
  }

  formatNumber(value, el) {
    const decimals = parseInt(el.getAttribute('data-decimals')) ?? this.options.decimals;
    const separator = el.getAttribute('data-separator') || this.options.separator;
    const decimal = el.getAttribute('data-decimal') || this.options.decimal;
    const prefix = el.getAttribute('data-prefix') || this.options.prefix;
    const suffix = el.getAttribute('data-suffix') || this.options.suffix;
    const useGrouping = el.getAttribute('data-grouping') !== 'false' && this.options.useGrouping;
    const currency = el.getAttribute('data-currency') === 'true' || this.options.currency;
    const currencySymbol = el.getAttribute('data-currency-symbol') || this.options.currencySymbol;
    const abbreviate = el.getAttribute('data-abbreviate') === 'true' || this.options.abbreviate;

    let formattedValue = value;

    // Handle abbreviations (K, M, B, T)
    if (abbreviate) {
      formattedValue = this.abbreviateNumber(value, decimals);
    } else {
      // Round to specified decimals
      formattedValue = Number(value.toFixed(decimals));

      // Add thousand separators if enabled
      if (useGrouping) {
        const parts = formattedValue.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        formattedValue = parts.join(decimal);
      } else if (decimals > 0) {
        formattedValue = formattedValue.toString().replace('.', decimal);
      }
    }

    // Apply currency formatting
    if (currency) {
      return `${currencySymbol}${formattedValue}`;
    }

    // Apply prefix and suffix
    return `${prefix}${formattedValue}${suffix}`;
  }

  abbreviateNumber(value, decimals = 1) {
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const tier = Math.floor(Math.log10(Math.abs(value)) / 3);
    
    if (tier === 0) return value.toFixed(decimals);
    
    const suffix = suffixes[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = value / scale;
    
    return scaled.toFixed(decimals) + suffix;
  }

  getEasing(type) {
    const easings = {
      linear: (t) => t,
      easeIn: (t) => t * t,
      easeOut: (t) => t * (2 - t),
      easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
      easeInQuad: (t) => t * t,
      easeOutQuad: (t) => t * (2 - t),
      easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
      easeInCubic: (t) => t * t * t,
      easeOutCubic: (t) => (--t) * t * t + 1,
      easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
      easeInQuart: (t) => t * t * t * t,
      easeOutQuart: (t) => 1 - (--t) * t * t * t,
      easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
      easeInQuint: (t) => t * t * t * t * t,
      easeOutQuint: (t) => 1 + (--t) * t * t * t * t,
      easeInOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
      easeInSine: (t) => 1 - Math.cos(t * Math.PI / 2),
      easeOutSine: (t) => Math.sin(t * Math.PI / 2),
      easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
      easeInExpo: (t) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
      easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
      easeInOutExpo: (t) => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
        return (2 - Math.pow(2, -20 * t + 10)) / 2;
      },
      easeInBack: (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return c3 * t * t * t - c1 * t * t;
      },
      easeOutBack: (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      },
      easeInOutBack: (t) => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return t < 0.5
          ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
          : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
      },
      bounce: (t) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
          return n1 * t * t;
        } else if (t < 2 / d1) {
          return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
          return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
          return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
      }
    };
    return easings[type] || easings.easeOutQuart;
  }

  // Utility function for throttling scroll events
  throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  // Manual trigger method
  trigger(selector) {
    const elements = selector ? document.querySelectorAll(selector) : document.querySelectorAll(this.selector);
    elements.forEach(el => {
      if (!this.animating.has(el)) {
        this.animateCounter(el);
      }
    });
  }

  // Reset method
  reset(selector) {
    const elements = selector ? document.querySelectorAll(selector) : document.querySelectorAll(this.selector);
    elements.forEach(el => {
      this.animating.delete(el);
      this.observed.delete(el);
      const original = parseFloat(el.dataset.originalValue || "0");
      el.textContent = this.formatNumber(original, el);
    });
  }

  // Cleanup method
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener('scroll', this.handleScrollFallback);
    this.observed.clear();
    this.animating.clear();
  }

  // Static method for easy initialization
  static init(selector, options) {
    return new ScrollCounter(selector, options);
  }
}

// Auto-initialize if data-auto-init attribute is present
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('[data-auto-init="scroll-counter"]')) {
    new ScrollCounter();
  }
});

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrollCounter;
} else if (typeof define === 'function' && define.amd) {
  define([], () => ScrollCounter);
} else {
  window.ScrollCounter = ScrollCounter;
}
