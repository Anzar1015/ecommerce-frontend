const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

let loadPromise: Promise<boolean> | null = null;

/** Dynamically injects the Razorpay Checkout script — only when it's
 * actually needed (checkout time), not globally in index.html, so pages
 * that never touch payment don't pay for it. Safe to call repeatedly;
 * the script is only ever injected once. */
export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window !== 'undefined' && window.Razorpay) {
    return Promise.resolve(true);
  }
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      loadPromise = null; // allow retrying on a later attempt
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return loadPromise;
}
