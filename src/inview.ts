/**
 * The configuration object for the InView class
 *
 * @typedef {Object} InViewConfig
 *
 * @property {string} selector - CSS selector
 * @property {number} delay - Delay in ms (default: 0)
 * @property {"low" | "medium" | "high"} precision - Precision of the observer (default: medium)
 * @property {boolean} single - Only observe the first element (default: false)
 *
 * @example
 * const config: InViewConfig = {
 *    selector: ".class",
 *    delay: 0,
 *    precision: "medium",
 *    single: true
 * }
 */
interface InViewConfig {
	selector: string;
	delay?: number;
	precision?: "low" | "medium" | "high";
	single?: boolean;
}

/**
 * The event object for the InView class
 *
 * @typedef {Object} InViewEvent
 *
 * @property {number} percentage - Percentage of the element in the viewport
 * @property {DOMRectReadOnly} rootBounds - The bounds of the viewport
 * @property {DOMRectReadOnly} boundingClientRect - The bounds of the element
 * @property {DOMRectReadOnly} intersectionRect - The bounds of the intersection
 * @property {Element} target - The observed element
 * @property {number} time - The time of the event
 * @property {"enter" | "exit"} event - The event type
 *
 * @example
 * new InView(".selector").on("enter", (e: InViewEvent) => {
 *   console.log(e);
 * });
 */
interface InViewEvent {
	percentage: number;
	rootBounds: DOMRectReadOnly | null;
	boundingClientRect: DOMRectReadOnly;
	intersectionRect: DOMRectReadOnly;
	target: Element;
	time: number;
	event: "enter" | "exit";
}

/**
 * InView
 *
 * Check if element is visible in viewport
 *
 * @example
 * new InView(".selector").on("enter", (e) => {
 *   console.log(e.percentage);
 * });
 *
 * @example
 * new InView({
 *   selector: ".selector",
 *   delay: 1000,
 *   precision: "low",
 *   single: true
 * }).on("enter", (e) => {
 *   console.log(e.percentage);
 * }).on("exit", (e) => {
 *   console.log("exit");
 * });
 */
class InView {
	/**
	 * List of elements to observe or single element
	 */
	private items: NodeListOf<Element> | Element | null = null;

	/**
	 * Is the observer is paused
	 */
	private paused: boolean = false;

	/**
	 * Delay the callback
	 */
	private delay: number = 0;

	/**
	 * Threshold
	 */
	private threshold: Array<number> = [];

	/**
	 * Single element observer
	 */
	private single: boolean = false;

	/**
	 * Array to store all observers for cleanup
	 */
	private observers: IntersectionObserver[] = [];

	/**
	 * Constructor
	 *
	 * Create a new InView instance
	 *
	 * @param {InViewConfig | string} config - Configuration object or CSS selector
	 *
	 * @example
	 * new InView(".selector");
	 *
	 * @example
	 * new InView({
	 *   selector: ".selector",
	 *   delay: 1000,
	 *   precision: "low",
	 *   single: true
	 * });
	 */
	constructor(config: InViewConfig | string) {
		// default threshold increment
		let increment: number = 0.01;

		// check if config is a string or an object
		if (typeof config === "string") {
			this.items = document.querySelectorAll(config);
			this.delay = 0;
		} else if (typeof config === "object") {
			if (config.delay) {
				this.delay = config.delay;
			}

			if (config.single) {
				this.single = config.single;
			}

			if (config.precision === "low") {
				increment = 0.1;
			} else if (config.precision === "medium") {
				increment = 0.01;
			} else if (config.precision === "high") {
				increment = 0.001;
			}

			if (this.single) {
				this.items = document.querySelector(config.selector);
			} else {
				this.items = document.querySelectorAll(config.selector);
			}
		}

		// create threshold array (Doing this way to save download size at cost of little bit of performance)
		for (let i = 0; i <= 1; i += increment) {
			this.threshold.push(i);
		}
	}

	/**
	 * Pause the observer
	 *
	 * @returns {InView} - Returns the InView instance
	 *
	 * @example
	 * const inview = new InView(".selector");
	 * inview.on("enter", (e) => {});
	 * // pause on specific needs
	 * inview.pause();
	 */
	public pause(): InView {
		this.paused = true;
		return this;
	}

	/**
	 * Resume the observer
	 *
	 * @returns {InView} - Returns the InView instance
	 *
	 * @example
	 * const inview = new InView(".selector");
	 * inview.on("enter", (e) => {});
	 * // pause the observer
	 * inview.pause();
	 * // resume the observer again
	 * inview.resume();
	 */
	public resume(): InView {
		this.paused = false;
		return this;
	}

	/**
	 * Set the delay
	 *
	 * @param {number} delay - Delay in ms
	 *
	 * @returns {InView} - Returns the InView instance
	 *
	 * @example
	 * const inview = new InView(".selector");
	 * inview.on("enter", (e) => {});
	 * // set delay to 1000ms
	 * inview.setDelay(1000);
	 */
	public setDelay(delay: number): InView {
		this.delay = delay;
		return this;
	}

	/**
	 * Destroy the observer and clean up all resources
	 *
	 * @returns {InView} - Returns the InView instance
	 *
	 * @example
	 * const inview = new InView(".selector");
	 * inview.on("enter", (e) => {});
	 * // Clean up when done
	 * inview.destroy();
	 */
	public destroy(): InView {
		// Disconnect all observers
		this.observers.forEach((observer) => {
			observer.disconnect();
		});

		// Clear the observers array
		this.observers = [];

		// Reset other properties
		this.paused = false;
		this.items = null;

		return this;
	}

	/**
	 * Listen for enter or exit events
	 *
	 * @param {"enter" | "exit"} event - Event type
	 * @param {CallableFunction} callback - Callback function
	 *
	 * @returns {InView} - Returns the InView instance
	 *
	 * @example
	 * const inview = new InView({...});
	 * inview.on("enter", (e: InViewEvent) => {
	 *  console.log(e.percentage);
	 * });
	 *
	 * inview.on("exit", (e: InViewEvent) => {
	 *  console.log("exit");
	 * });
	 *
	 * @example
	 * new InView(".selector").on("enter", (e: InViewEvent) => {
	 *  console.log(e.percentage);
	 * }).on("exit", (e: InViewEvent) => {
	 *  console.log("exit");
	 * });
	 */
	public on(event: "enter" | "exit", callback: CallableFunction): InView {
		/**
		 * Check if IntersectionOberver is available
		 */
		if ("IntersectionObserver" in window) {
			/**
			 * New observer to check for each items position
			 */
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						/**
						 * Determine if element exited or entered the viewport
						 */
						if (
							(event === "enter" && entry.intersectionRatio > 0) ||
							(event === "exit" && entry.intersectionRatio === 0)
						) {
							/**
							 * Create output object
							 */
							const e: InViewEvent = {
								percentage: entry.intersectionRatio * 100,
								rootBounds: entry.rootBounds,
								boundingClientRect: entry.boundingClientRect,
								intersectionRect: entry.intersectionRect,
								target: entry.target,
								time: entry.time,
								event: event,
							};

							/**
							 * Call the callback function if not paused and if delay is over
							 */
							if (!this.paused) {
								if (this.delay > 0) {
									setTimeout(() => {
										callback(e);
									}, this.delay);
								} else {
									callback(e);
								}
							}
						}
					});
				},
				{
					threshold: this.threshold,
				}
			);

			// if single element observer
			if (this.items instanceof Element) {
				// observe single item
				observer.observe(this.items as Element);
			} else if (this.items instanceof NodeList) {
				// observe each item
				this.items.forEach((item) => {
					observer.observe(item);
				});
			} else {
				console.error("InView: No items found.");
			}

			// Store the observer for cleanup
			this.observers.push(observer);
		} else {
			console.error("InView: IntersectionObserver not supported.");
		}

		return this;
	}
}

export default InView;
export type { InViewConfig, InViewEvent };
