# @opuu/inview

Ultra-lightweight JavaScript library for viewport detection. Perfect for lazy loading, scroll animations, infinite scroll, and element visibility tracking with TypeScript support.

[![npm version](https://badge.fury.io/js/%40opuu%2Finview.svg)](https://badge.fury.io/js/%40opuu%2Finview)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@opuu/inview)](https://bundlephobia.com/package/@opuu/inview)

## Features

- **Zero dependencies** - Pure JavaScript implementation
- **Ultra-lightweight** - Only ~1KB gzipped
- **High performance** - Uses native Intersection Observer API
- **Cross-platform** - Works on all modern browsers
- **Precision control** - Low, medium, and high precision modes
- **Easy to use** - Simple, intuitive API
- **TypeScript ready** - Full TypeScript support with type definitions
- **Framework agnostic** - Works with any JavaScript framework

## Installation

```bash
npm install @opuu/inview
```

## Quick Start

```javascript
import InView from "@opuu/inview";

// Basic usage
new InView(".my-element").on("enter", (event) => {
	console.log("Element entered viewport!", event.percentage);
});

// With configuration
new InView({
	selector: ".animate-on-scroll",
	delay: 100,
	precision: "high",
})
	.on("enter", (event) => {
		event.target.classList.add("animate");
	})
	.on("exit", (event) => {
		event.target.classList.remove("animate");
	});
```

## API Reference

### Constructor

```typescript
new InView(config: InViewConfig | string)
```

**Configuration:**

```typescript
interface InViewConfig {
	selector: string; // CSS selector
	delay?: number; // Delay in ms (default: 0)
	precision?: "low" | "medium" | "high"; // (default: "medium")
	single?: boolean; // Observe only first element (default: false)
}
```

### Methods

```javascript
// Listen for events
instance.on("enter", callback);
instance.on("exit", callback);

// Control observer
instance.pause();
instance.resume();
instance.destroy();
```

### Event Object

```typescript
interface InViewEvent {
	percentage: number; // Visibility percentage (0-100)
	target: Element; // The observed element
	event: "enter" | "exit"; // Event type
	// ... additional properties
}
```

## Examples

### Lazy Loading

```javascript
new InView("img[data-src]").on("enter", (event) => {
	const img = event.target;
	img.src = img.dataset.src;
	img.removeAttribute("data-src");
});
```

### Scroll Animations

```javascript
new InView(".animate").on("enter", (event) => {
	event.target.classList.add("fade-in");
});
```

## Browser Support

Works on all modern browsers that support Intersection Observer API:

- Chrome 51+, Firefox 55+, Safari 12.1+, Edge 15+

## License

MIT
