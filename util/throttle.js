/**
 * Simple throttle function that executes a passed function only once in the specified timeout
 * @param handlerFunc
 * @param [timeout] the throttle interval
 */
export function throttle(handlerFunc, timeout = 66) {
  let resizeTimeout;
  if (!resizeTimeout) {
    resizeTimeout = setTimeout(() => {
      resizeTimeout = null;
      handlerFunc();
      // The actualResizeHandler will execute at a rate of 15fps
    }, timeout);
  }
}
