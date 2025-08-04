class h {
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
  constructor(e) {
    this.items = null, this.paused = !1, this.delay = 0, this.threshold = [], this.single = !1, this.observers = [], this.debounceTimers = /* @__PURE__ */ new WeakMap();
    let s = 0.01;
    typeof e == "string" ? (this.items = document.querySelectorAll(e), this.delay = 0) : typeof e == "object" && (e.delay && (this.delay = e.delay), e.single && (this.single = e.single), e.precision === "low" ? s = 0.1 : e.precision === "medium" ? s = 0.01 : e.precision === "high" && (s = 1e-3), this.single ? this.items = document.querySelector(e.selector) : this.items = document.querySelectorAll(e.selector));
    for (let i = 0; i <= 1; i += s)
      this.threshold.push(i);
  }
  /**
   * Debounce function to delay callback execution
   *
   * @param {Element} element - The element triggering the event
   * @param {CallableFunction} callback - The callback to execute
   * @param {InViewEvent} event - The event object to pass to callback
   */
  debounceCallback(e, s, i) {
    const r = this.debounceTimers.get(e);
    if (r && clearTimeout(r), this.delay > 0) {
      const t = window.setTimeout(() => {
        this.debounceTimers.delete(e), s(i);
      }, this.delay);
      this.debounceTimers.set(e, t);
    } else
      s(i);
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
  pause() {
    return this.paused = !0, this;
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
  resume() {
    return this.paused = !1, this;
  }
  /**
   * Set the debounce delay
   *
   * @param {number} delay - Debounce delay in ms
   *
   * @returns {InView} - Returns the InView instance
   *
   * @example
   * const inview = new InView(".selector");
   * inview.on("enter", (e) => {});
   * // set debounce delay to 1000ms
   * inview.setDelay(1000);
   */
  setDelay(e) {
    return this.delay = e, this;
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
  destroy() {
    if (this.items instanceof Element) {
      const e = this.debounceTimers.get(this.items);
      e && clearTimeout(e);
    } else this.items instanceof NodeList && this.items.forEach((e) => {
      const s = this.debounceTimers.get(e);
      s && clearTimeout(s);
    });
    return this.debounceTimers = /* @__PURE__ */ new WeakMap(), this.observers.forEach((e) => {
      e.disconnect();
    }), this.observers = [], this.paused = !1, this.items = null, this;
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
  on(e, s) {
    if ("IntersectionObserver" in window) {
      const i = new IntersectionObserver(
        (r) => {
          r.forEach((t) => {
            if (e === "enter" && t.intersectionRatio > 0 || e === "exit" && t.intersectionRatio === 0) {
              const o = {
                percentage: t.intersectionRatio * 100,
                rootBounds: t.rootBounds,
                boundingClientRect: t.boundingClientRect,
                intersectionRect: t.intersectionRect,
                target: t.target,
                time: t.time,
                event: e
              };
              this.paused || this.debounceCallback(t.target, s, o);
            }
          });
        },
        {
          threshold: this.threshold
        }
      );
      this.items instanceof Element ? i.observe(this.items) : this.items instanceof NodeList ? this.items.forEach((r) => {
        i.observe(r);
      }) : console.error("InView: No items found."), this.observers.push(i);
    } else
      console.error("InView: IntersectionObserver not supported.");
    return this;
  }
}
export {
  h as default
};
