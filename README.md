# InView: Is the element in viewport?

A lightweight, high-performance JavaScript library for detecting element visibility in the viewport. Built with TypeScript and powered by the Intersection Observer API for optimal performance.

[![npm version](https://badge.fury.io/js/%40opuu%2Finview.svg)](https://badge.fury.io/js/%40opuu%2Finview)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@opuu/inview)](https://bundlephobia.com/package/@opuu/inview)
[![JSDelivr Hits](https://data.jsdelivr.com/v1/package/npm/@opuu/inview/badge?style=rounded)](https://www.jsdelivr.com/package/npm/@opuu/inview)

## Why InView?

InView provides a simple yet powerful API for tracking element visibility, making it perfect for:

- **Lazy Loading**: Load images, videos, and content as they come into view
- **Scroll Animations**: Trigger animations when elements enter the viewport
- **Infinite Scrolling**: Load more content as users scroll down
- **Analytics Tracking**: Track element visibility for user engagement metrics
- **Performance Optimization**: Reduce initial page load by deferring non-critical content

## Key Features

- **Ultra-lightweight**: Only ~1KB gzipped with zero dependencies
- **TypeScript Support**: Complete type definitions included
- **High Performance**: Built on native Intersection Observer API
- **Flexible Configuration**: Customizable precision, delay, and observation modes
- **Framework Agnostic**: Works with React, Vue, Angular, or vanilla JavaScript
- **Modern Browser Support**: Compatible with all browsers supporting Intersection Observer

## Installation

```bash
npm install @opuu/inview
```

```bash
pnpm add @opuu/inview
```

```bash
yarn add @opuu/inview
```

### CDN Usage

<!-- hit counter -->

```html
<script type="module">
	import InView from "https://cdn.jsdelivr.net/npm/@opuu/inview/dist/inview.js";
</script>
```

## Quick Start

```javascript
import InView from "@opuu/inview";

// Basic usage - observe elements by CSS selector
const observer = new InView(".my-element");

observer.on("enter", (event) => {
	console.log("Element is now visible:", event.percentage + "%");
	event.target.classList.add("visible");
});

observer.on("exit", (event) => {
	console.log("Element is no longer visible");
	event.target.classList.remove("visible");
});
```

## Advanced Configuration

```javascript
import InView from "@opuu/inview";

const observer = new InView({
	selector: ".lazy-image",
	delay: 100, // 100ms debounce delay - callbacks are debounced for better performance
	precision: "high", // High precision tracking (0.1% increments)
	single: true, // Only observe the first matching element
});

observer.on("enter", (event) => {
	// Load image when it enters viewport
	// This callback is debounced - rapid scroll events won't trigger multiple times
	const img = event.target;
	img.src = img.dataset.src;
	img.classList.add("loaded");
});
```

## API Reference

### Constructor

Create a new InView instance:

```javascript
// Using CSS selector
const observer = new InView(".my-selector");

// Using configuration object
const observer = new InView({
	selector: ".my-selector",
	delay: 100,
	precision: "medium",
	single: false,
});
```

### Configuration Options

| Option      | Type                              | Default      | Description                                                |
| ----------- | --------------------------------- | ------------ | ---------------------------------------------------------- |
| `selector`  | `string`                          | **required** | CSS selector for elements to observe                       |
| `delay`     | `number`                          | `0`          | Debounce delay in milliseconds before triggering callbacks |
| `precision` | `"low"` \| `"medium"` \| `"high"` | `"medium"`   | Intersection detection precision                           |
| `single`    | `boolean`                         | `false`      | Whether to observe only the first matching element         |

#### Precision Levels

- **`"low"`**: 10% increments (0.1) - Best performance, less precise
- **`"medium"`**: 1% increments (0.01) - Balanced performance and precision
- **`"high"`**: 0.1% increments (0.001) - Highest precision, slight performance cost

### Methods

#### `on(event, callback)`

Register event listeners for visibility changes:

```javascript
observer.on("enter", (event) => {
	// Element entered viewport
	console.log(`${event.percentage}% visible`);
});

observer.on("exit", (event) => {
	// Element exited viewport
	event.target.classList.remove("visible");
});
```

**Parameters:**

- `event`: `"enter"` | `"exit"` - The event type to listen for
- `callback`: `(event: InViewEvent) => void` - Function to call when event occurs

#### `pause()`

Temporarily pause observation (stops triggering callbacks):

```javascript
observer.pause();
```

#### `resume()`

Resume observation after pausing:

```javascript
observer.resume();
```

#### `setDelay(delay)`

Update the debounce delay:

```javascript
observer.setDelay(200); // Set 200ms debounce delay
```

#### `destroy()`

Clean up and disconnect all observers:

```javascript
observer.destroy();
```

### InViewEvent Object

Event callbacks receive an `InViewEvent` object with the following properties:

```typescript
interface InViewEvent {
	percentage: number; // Visibility percentage (0-100)
	rootBounds: DOMRectReadOnly | null; // Viewport rectangle
	boundingClientRect: DOMRectReadOnly; // Element rectangle
	intersectionRect: DOMRectReadOnly; // Intersection rectangle
	target: Element; // The observed element
	time: number; // Event timestamp
	event: "enter" | "exit"; // Event type
}
```

## TypeScript Support

InView includes complete TypeScript definitions:

```typescript
import InView, { InViewConfig, InViewEvent } from "@opuu/inview";

const config: InViewConfig = {
	selector: ".my-element",
	delay: 100,
	precision: "high",
	single: true,
};

const observer: InView = new InView(config);

observer.on("enter", (event: InViewEvent) => {
	console.log(`Element ${event.target.id} is ${event.percentage}% visible`);
});
```

## Performance & Debouncing

InView includes intelligent debouncing to optimize performance during rapid scrolling:

### How Debouncing Works

When a `delay` is configured, InView will debounce callback execution:

- **Without debouncing**: Each scroll event triggers callbacks immediately
- **With debouncing**: Callbacks are delayed and previous pending callbacks are cancelled

```javascript
const observer = new InView({
	selector: ".element",
	delay: 100, // 100ms debounce delay
});

observer.on("enter", (event) => {
	// This callback is debounced - only executes after 100ms of no new events
	console.log("Element entered viewport");
});
```

### Benefits of Debouncing

- **Reduced CPU Usage**: Fewer callback executions during rapid scrolling
- **Smoother Performance**: Prevents callback spam that can cause frame drops
- **Battery Efficiency**: Less processing on mobile devices
- **Better UX**: More predictable behavior during fast scrolling

### Recommended Delay Values

- **Lazy Loading**: `50-100ms` - Balance between responsiveness and performance
- **Animations**: `100-200ms` - Prevents animation flickering during scroll
- **Analytics**: `200-500ms` - Ensures user has settled on content
- **Real-time Updates**: `0ms` (no debouncing) - Immediate response needed

```javascript
// Example: Different delays for different use cases
const lazyLoader = new InView({ selector: ".lazy", delay: 50 });
const animator = new InView({ selector: ".animate", delay: 150 });
const tracker = new InView({ selector: ".track", delay: 300 });
```

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
