# ScrollCounter ✨

A powerful, lightweight, and highly customizable JavaScript library for animated scroll counters. Perfect for showcasing statistics, metrics, and numbers with smooth scroll-triggered animations.

## 🚀 Features

- **🎯 Scroll-triggered animations** - IntersectionObserver with fallback support
- **💰 Currency formatting** - Built-in currency symbols and separators  
- **📈 Smart abbreviations** - Automatic K/M/B/T formatting for large numbers
- **🔢 Decimal precision** - Support for any number of decimal places
- **🌊 Advanced easing** - 15+ easing functions including bounce, back, and elastic
- **🎮 Manual controls** - Programmatic trigger, reset, and control
- **📱 Performance optimized** - Throttled events and memory cleanup
- **🔧 Developer friendly** - TypeScript ready, callbacks, and flexible configuration
- **📦 Zero dependencies** - Pure vanilla JavaScript
- **🌐 Universal support** - Works with all module systems (ES6, CommonJS, AMD, Global)

## 📦 Installation

### CDN (Quick Start)
```html
<script src="https://cdn.jsdelivr.net/gh/Spiddyyy/counter-scroll@latest/scroll-counter.min.js"></script>
```

### NPM
```bash
npm install scrollcounter
```

### Yarn
```bash
yarn add scrollcounter
```

## 🎯 Quick Start

### HTML
```html
<div class="counter-value" data-count="1250">0</div>
<div class="counter-value" data-count="99.9" data-decimals="1" data-suffix="%">0%</div>
<div class="counter-value" data-count="1500000" data-currency="true" data-abbreviate="true">$0</div>
```

### JavaScript
```javascript
// Simple initialization
const counter = new ScrollCounter();

// Advanced configuration
const counter = new ScrollCounter('.counter-value', {
    duration: 2000,
    easing: 'easeOutQuart',
    decimals: 0,
    currency: false,
    onComplete: (element, value) => {
        console.log('Animation completed!', value);
    }
});
```

## 🛠️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | Number | `2000` | Animation duration in milliseconds |
| `easing` | String | `'easeOutQuart'` | Animation easing function |
| `once` | Boolean | `true` | Animate only once when scrolled into view |
| `replay` | Boolean | `false` | Re-animate when scrolling back into view |
| `decimals` | Number | `0` | Number of decimal places to show |
| `separator` | String | `','` | Thousands separator character |
| `decimal` | String | `'.'` | Decimal point character |
| `prefix` | String | `''` | Text to prepend to the number |
| `suffix` | String | `''` | Text to append to the number |
| `currency` | Boolean | `false` | Enable currency formatting |
| `currencySymbol` | String | `'$'` | Currency symbol to use |
| `abbreviate` | Boolean | `false` | Use K/M/B/T abbreviations for large numbers |
| `useGrouping` | Boolean | `true` | Add thousand separators |
| `step` | Number | `1` | Increment step (e.g., count by 5s, 10s) |
| `onStart` | Function | `null` | Callback when animation starts |
| `onUpdate` | Function | `null` | Callback during animation |
| `onComplete` | Function | `null` | Callback when animation completes |

## 🎨 Available Easing Functions

```javascript
'linear', 'easeIn', 'easeOut', 'easeInOut',
'easeInQuad', 'easeOutQuad', 'easeInOutQuad',
'easeInCubic', 'easeOutCubic', 'easeInOutCubic',
'easeInQuart', 'easeOutQuart', 'easeInOutQuart',
'easeInQuint', 'easeOutQuint', 'easeInOutQuint',
'easeInSine', 'easeOutSine', 'easeInOutSine',
'easeInExpo', 'easeOutExpo', 'easeInOutExpo',
'easeInBack', 'easeOutBack', 'easeInOutBack',
'bounce'
```

## 📊 Data Attributes

Override global options with HTML data attributes:

| Attribute | Example | Description |
|-----------|---------|-------------|
| `data-count` | `data-count="1250"` | Target number to count to |
| `data-duration` | `data-duration="3000"` | Animation duration |
| `data-easing` | `data-easing="bounce"` | Easing function |
| `data-decimals` | `data-decimals="2"` | Decimal places |
| `data-prefix` | `data-prefix="$"` | Prefix text |
| `data-suffix` | `data-suffix="%"` | Suffix text |
| `data-separator` | `data-separator="."` | Thousands separator |
| `data-decimal` | `data-decimal=","` | Decimal point |
| `data-currency` | `data-currency="true"` | Enable currency mode |
| `data-currency-symbol` | `data-currency-symbol="€"` | Currency symbol |
| `data-abbreviate` | `data-abbreviate="true"` | Enable abbreviations |
| `data-grouping` | `data-grouping="false"` | Disable grouping |
| `data-step` | `data-step="5"` | Count increment |
| `data-threshold` | `data-threshold="0.8"` | Visibility threshold (0-1) |

## 💡 Usage Examples

### Basic Counter
```html
<div class="counter-value" data-count="1250">0</div>
```

### Currency with Decimals
```html
<div class="counter-value" 
     data-count="1599.99" 
     data-currency="true" 
     data-decimals="2">$0.00</div>
```

### Large Numbers with Abbreviations
```html
<div class="counter-value" 
     data-count="1500000" 
     data-abbreviate="true" 
     data-currency="true">$0</div>
<!-- Result: $1.5M -->
```

### Percentage with Custom Easing
```html
<div class="counter-value" 
     data-count="95" 
     data-suffix="%" 
     data-easing="bounce" 
     data-duration="3000">0%</div>
```

### European Formatting
```html
<div class="counter-value" 
     data-count="1234.56" 
     data-separator="." 
     data-decimal="," 
     data-decimals="2">0,00</div>
<!-- Result: 1.234,56 -->
```

### Custom Step Counting
```html
<div class="counter-value" 
     data-count="100" 
     data-step="5">0</div>
<!-- Counts: 0, 5, 10, 15, 20... 100 -->
```

## 🎮 API Methods

### Manual Control
```javascript
const counter = new ScrollCounter();

// Trigger all counters
counter.trigger();

// Trigger specific counters
counter.trigger('.stats-counter');

// Reset all counters
counter.reset();

// Reset specific counters
counter.reset('.stats-counter');

// Cleanup (remove observers and events)
counter.destroy();
```

### Static Initialization
```javascript
// One-liner initialization
const counter = ScrollCounter.init('.counter-value', {
    duration: 3000,
    easing: 'easeOutBack'
});
```

## 🔧 Advanced Configuration

### With Callbacks
```javascript
const counter = new ScrollCounter('.counter-value', {
    duration: 2000,
    easing: 'easeOutQuart',
    onStart: (element, startValue, targetValue) => {
        element.style.color = '#007bff';
        console.log(`Starting animation from ${startValue} to ${targetValue}`);
    },
    onUpdate: (element, currentValue, progress) => {
        // Update progress bar, change colors, etc.
        const opacity = 0.5 + (progress * 0.5);
        element.style.opacity = opacity;
    },
    onComplete: (element, finalValue) => {
        element.style.color = '#28a745';
        console.log(`Animation completed! Final value: ${finalValue}`);
    }
});
```

### Multiple Instances
```javascript
// Different configurations for different sections
const statsCounters = new ScrollCounter('.stats-counter', {
    duration: 3000,
    easing: 'easeOutBack',
    currency: true,
    abbreviate: true
});

const achievementCounters = new ScrollCounter('.achievement-counter', {
    duration: 1500,
    easing: 'bounce',
    suffix: '%'
});
```

## 🌐 Module System Support

### ES6 Modules
```javascript
import ScrollCounter from 'scrollcounter';
const counter = new ScrollCounter();
```

### CommonJS
```javascript
const ScrollCounter = require('scrollcounter');
const counter = new ScrollCounter();
```

### AMD
```javascript
define(['scrollcounter'], function(ScrollCounter) {
    const counter = new ScrollCounter();
});
```

## ⚡ Performance Features

- **IntersectionObserver** - Efficient scroll detection with automatic fallback
- **Throttled events** - Optimized scroll event handling
- **Memory management** - Proper cleanup of observers and event listeners
- **Animation prevention** - Prevents overlapping animations on same elements
- **Minimal DOM queries** - Cached selectors and optimized queries

## 🎯 Browser Support

- **Modern browsers** - Full IntersectionObserver support
- **Legacy browsers** - Automatic fallback to scroll events
- **Mobile optimized** - Touch-friendly and performant on mobile devices
- **IE11+** - With polyfill for IntersectionObserver

## 📱 Framework Integration

### React Hook
```javascript
import { useEffect, useRef } from 'react';
import ScrollCounter from 'scrollcounter';

function useScrollCounter(options = {}) {
    const ref = useRef();
    
    useEffect(() => {
        if (ref.current) {
            const counter = new ScrollCounter(ref.current, options);
            return () => counter.destroy();
        }
    }, []);
    
    return ref;
}

// Usage
function StatsComponent() {
    const counterRef = useScrollCounter({ duration: 3000 });
    
    return (
        <div ref={counterRef} className="counter-value" data-count="1250">
            0
        </div>
    );
}
```

### Vue.js Directive
```javascript
// Vue directive
app.directive('scroll-counter', {
    mounted(el, binding) {
        new ScrollCounter(el, binding.value || {});
    }
});

// Usage in template
<div v-scroll-counter="{ duration: 3000 }" class="counter-value" data-count="1250">0</div>
```

## 🚀 CDN Quick Setup

For immediate use without installation:

```html
<!DOCTYPE html>
<html>
<head>
    <title>ScrollCounter Demo</title>
</head>
<body>
    <!-- Your counter elements -->
    <div class="counter-value" data-count="1250">0</div>
    <div class="counter-value" data-count="99" data-suffix="%">0%</div>
    
    <!-- Include library -->
    <script src="https://cdn.jsdelivr.net/gh/Spiddyyy/counter-scroll@latest/scroll-counter.min.js"></script>
    
    <!-- Initialize -->
    <script>
        const counter = new ScrollCounter();
    </script>
</body>
</html>
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: support@scrollcounter.dev
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/scrollcounter/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/scrollcounter/discussions)
- 📖 **Documentation**: [Full Documentation](https://scrollcounter.dev/docs)

## 🎉 Examples & Demos

- 🌐 **Live Demo**: [https://scrollcounter.dev/demo](https://scrollcounter.dev/demo)
- 📊 **CodePen Collection**: [ScrollCounter Examples](https://codepen.io/collection/scrollcounter)
- 🎮 **Interactive Playground**: [Try it online](https://scrollcounter.dev/playground)

---

<div align="center">

**⭐ If you found ScrollCounter helpful, please give it a star on GitHub! ⭐**

Made with ❤️ for the developer community

[Demo](https://scrollcounter.dev/demo) • [Documentation](https://scrollcounter.dev/docs) • [GitHub](https://github.com/your-username/scrollcounter)

</div>
