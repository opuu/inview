# InView

A lightweight JavaScript library for detecting when elements enter or exit the viewport.

[![npm version](https://badge.fury.io/js/%40opuu%2Finview.svg)](https://badge.fury.io/js/%40opuu%2Finview)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @opuu/inview
```

## Quick Start

```javascript
import InView from "@opuu/inview";

const observer = new InView(".my-element");

observer.on("enter", (event) => {
	console.log("Element visible:", event.percentage + "%");
});

observer.on("exit", (event) => {
	console.log("Element hidden");
});
```

## Common Examples

### Lazy Loading Images

```javascript
import InView from "@opuu/inview";

const observer = new InView(".lazy-image");

observer.on("enter", (event) => {
	const img = event.target;
	img.src = img.dataset.src;
	img.classList.add("loaded");
});
```

### Scroll Animations

```javascript
import InView from "@opuu/inview";

const observer = new InView(".animate-on-scroll");

observer.on("enter", (event) => {
	event.target.classList.add("animate");
});

observer.on("exit", (event) => {
	event.target.classList.remove("animate");
});
```

### Infinite Scrolling

```javascript
import InView from "@opuu/inview";

const observer = new InView(".load-more-trigger");

observer.on("enter", (event) => {
	loadMoreContent();
});
```

## API Reference

## Configuration

You can pass options when creating an InView instance:

```javascript
const observer = new InView({
	selector: ".my-element",
	delay: 100, // Debounce delay in ms
	precision: "high", // "low", "medium", or "high"
	single: true, // Only observe first element
});
```

| Option      | Default    | Description                             |
| ----------- | ---------- | --------------------------------------- |
| `selector`  | required   | CSS selector for elements to observe    |
| `delay`     | `0`        | Debounce delay in milliseconds          |
| `precision` | `"medium"` | Observation precision level             |
| `single`    | `false`    | Only observe the first matching element |

## Methods

```javascript
observer.on("enter", callback); // Element enters viewport
observer.on("exit", callback); // Element exits viewport
observer.pause(); // Pause observation
observer.resume(); // Resume observation
observer.setDelay(100); // Update debounce delay
observer.destroy(); // Clean up
```

## Event Object

Callbacks receive an event object with:

```javascript
{
	percentage: 75,           // Visibility percentage (0-100)
	target: Element,          // The observed element
	time: 1234567890,         // Timestamp
	event: "enter" | "exit"   // Event type
	// ... other properties
}
```

## CDN Usage

```html
<script type="module">
	import InView from "https://cdn.jsdelivr.net/npm/@opuu/inview/dist/inview.js";
</script>
```

## License

MIT

## Common Use Cases

### Lazy Loading Images

```javascript
import InView from "@opuu/inview";

const imageObserver = new InView(".lazy-image");

imageObserver.on("enter", (event) => {
	const img = event.target;
	if (img.dataset.src) {
		img.src = img.dataset.src;
		img.removeAttribute("data-src");
		img.classList.add("loaded");
	}
});
```

### Scroll-Triggered Animations

```javascript
import InView from "@opuu/inview";

const animationObserver = new InView({
	selector: ".animate-on-scroll",
	precision: "medium",
});

animationObserver.on("enter", (event) => {
	if (event.percentage > 50) {
		// Trigger when 50% visible
		event.target.classList.add("animate-in");
	}
});

animationObserver.on("exit", (event) => {
	event.target.classList.remove("animate-in");
});
```

### Infinite Scrolling

```javascript
import InView from "@opuu/inview";

const infiniteObserver = new InView({
	selector: ".load-more-trigger",
	single: true,
	delay: 200, // Debounce to prevent multiple rapid loads
});

infiniteObserver.on("enter", async (event) => {
	try {
		const newContent = await loadMoreContent();
		document.getElementById("content").appendChild(newContent);
	} catch (error) {
		console.error("Failed to load content:", error);
	}
});
```

### Performance Monitoring

```javascript
import InView from "@opuu/inview";

const performanceObserver = new InView({
	selector: ".track-visibility",
	delay: 300, // Debounce analytics calls
});

performanceObserver.on("enter", (event) => {
	// Track when important content becomes visible
	analytics.track("element_viewed", {
		element_id: event.target.id,
		visibility_percentage: event.percentage,
		timestamp: event.time,
	});
});
```

## Framework Integration

### React

```jsx
import { useEffect, useRef } from "react";
import InView from "@opuu/inview";

function LazyImage({ src, alt }) {
	const imgRef = useRef(null);

	useEffect(() => {
		const observer = new InView({
			selector: imgRef.current,
			single: true,
		});

		observer.on("enter", (event) => {
			event.target.src = src;
			event.target.classList.add("loaded");
		});

		return () => observer.destroy();
	}, [src]);

	return <img ref={imgRef} alt={alt} className="lazy-image" />;
}
```

### Vue.js

For Vue.js applications, use the dedicated [@opuu/inview-vue](https://www.npmjs.com/package/@opuu/inview-vue) package which provides `v-inview` and `v-outview` directives.

```bash
npm install @opuu/inview-vue
```

### Angular

```typescript
import { Component, ElementRef, OnInit, OnDestroy } from "@angular/core";
import InView from "@opuu/inview";

@Component({
	selector: "app-lazy-content",
	template: '<div class="lazy-content">Content</div>',
})
export class LazyContentComponent implements OnInit, OnDestroy {
	private observer: InView;

	constructor(private elementRef: ElementRef) {}

	ngOnInit() {
		this.observer = new InView({
			selector: this.elementRef.nativeElement,
			single: true,
		});

		this.observer.on("enter", (event) => {
			event.target.classList.add("visible");
		});
	}

	ngOnDestroy() {
		this.observer?.destroy();
	}
}
```

## Best Practices

### Performance Optimization

1. **Use appropriate precision levels**: Start with "medium" and only use "high" when necessary
2. **Clean up observers**: Always call `destroy()` when components unmount
3. **Debounce rapid changes**: Use the `delay` option for expensive operations
4. **Single element optimization**: Use `single: true` when observing only one element

### Memory Management

```javascript
// Good: Clean up when done
const observer = new InView(".my-element");
// ... use observer
observer.destroy(); // Important!

// Good: Store reference for cleanup
class MyComponent {
	constructor() {
		this.observer = new InView(".element");
	}

	destroy() {
		this.observer.destroy();
	}
}
```

## Browser Support

InView is built on the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and supports all modern browsers:

- Chrome 51+
- Firefox 55+
- Safari 12.1+
- Edge 15+

For older browser support, consider using an [Intersection Observer polyfill](https://github.com/w3c/IntersectionObserver/tree/main/polyfill).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT License](LICENSE) - feel free to use this project in your commercial and personal projects.

## Author

**Obaydur Rahman**

- GitHub: [@opuu](https://github.com/opuu)
- Website: [opu.rocks](https://opu.rocks)

## Related Projects

- [@opuu/inview-vue](https://www.npmjs.com/package/@opuu/inview-vue) - Vue.js directives for InView
