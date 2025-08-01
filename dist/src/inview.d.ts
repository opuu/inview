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
declare class InView {
    /**
     * List of elements to observe or single element
     */
    private items;
    /**
     * Is the observer is paused
     */
    private paused;
    /**
     * Delay the callback
     */
    private delay;
    /**
     * Threshold
     */
    private threshold;
    /**
     * Single element observer
     */
    private single;
    /**
     * Array to store all observers for cleanup
     */
    private observers;
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
    constructor(config: InViewConfig | string);
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
    pause(): InView;
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
    resume(): InView;
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
    setDelay(delay: number): InView;
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
    destroy(): InView;
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
    on(event: "enter" | "exit", callback: CallableFunction): InView;
}
export default InView;
export type { InViewConfig, InViewEvent };
