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
    this.items = null, this.paused = !1, this.delay = 0, this.threshold = [], this.single = !1, this.observers = [];
    let t = 0.01;
    typeof e == "string" ? (this.items = document.querySelectorAll(e), this.delay = 0) : typeof e == "object" && (e.delay && (this.delay = e.delay), e.single && (this.single = e.single), e.precision === "low" ? t = 0.1 : e.precision === "medium" ? t = 0.01 : e.precision === "high" && (t = 1e-3), this.single ? this.items = document.querySelector(e.selector) : this.items = document.querySelectorAll(e.selector));
    for (let i = 0; i <= 1; i += t)
      this.threshold.push(i);
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
    return this.observers.forEach((e) => {
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
  on(e, t) {
    if ("IntersectionObserver" in window) {
      const i = new IntersectionObserver(
        (r) => {
          r.forEach((s) => {
            if (e === "enter" && s.intersectionRatio > 0 || e === "exit" && s.intersectionRatio === 0) {
              const o = {
                percentage: s.intersectionRatio * 100,
                rootBounds: s.rootBounds,
                boundingClientRect: s.boundingClientRect,
                intersectionRect: s.intersectionRect,
                target: s.target,
                time: s.time,
                event: e
              };
              this.paused || (this.delay > 0 ? setTimeout(() => {
                t(o);
              }, this.delay) : t(o));
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
