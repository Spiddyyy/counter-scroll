// counter.js
class ScrollCounter {
  constructor(selector = '.counter-value', options = {}) {
    this.selector = selector;
    this.duration = options.duration || 4000;
    this.easing = options.easing || 'linear';
    this.once = options.once !== false;
    this.animated = false;

    this.init();
  }

  init() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll() {
    const counters = document.querySelectorAll(this.selector);
    if (!counters.length) return;

    const firstCounter = counters[0].closest('.since-cards') || counters[0];
    const topOffset = firstCounter.getBoundingClientRect().top + window.scrollY;
    const windowHeight = window.innerHeight;

    if ((!this.once || !this.animated) && window.scrollY > (topOffset - windowHeight)) {
      counters.forEach(counter => this.animateCounter(counter));
      this.animated = true;
    }
  }

  animateCounter(counter) {
    const target = +counter.getAttribute('data-count');
    const start = +counter.innerText;
    const duration = this.duration;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * (target - start) + start);
      counter.innerText = value;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        counter.innerText = target;
      }
    };

    requestAnimationFrame(animate);
  }
}

// To use:
window.ScrollCounter = ScrollCounter;
