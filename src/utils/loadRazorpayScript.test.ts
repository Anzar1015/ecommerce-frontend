import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadRazorpayScript } from './loadRazorpayScript';

describe('loadRazorpayScript', () => {
  beforeEach(() => {
    document.querySelectorAll('script').forEach((el) => el.remove());
    delete window.Razorpay;
    vi.resetModules();
  });

  afterEach(() => {
    delete window.Razorpay;
  });

  it('resolves immediately without injecting a script if Razorpay is already on window', async () => {
    // @ts-expect-error — a minimal stand-in is enough to prove the short-circuit.
    window.Razorpay = function () {};

    const result = await loadRazorpayScript();

    expect(result).toBe(true);
    expect(document.querySelector('script[src*="checkout.razorpay.com"]')).toBeNull();
  });

  it('injects the checkout script into the document', async () => {
    const { loadRazorpayScript: freshLoader } = await import('./loadRazorpayScript');
    const promise = freshLoader();

    const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    expect(script).not.toBeNull();

    script?.dispatchEvent(new Event('load'));
    await expect(promise).resolves.toBe(true);
  });

  it('resolves false when the script fails to load', async () => {
    vi.resetModules();
    const { loadRazorpayScript: freshLoader } = await import('./loadRazorpayScript');
    const promise = freshLoader();

    const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    script?.dispatchEvent(new Event('error'));

    await expect(promise).resolves.toBe(false);
  });

  it('only injects one script tag across repeated calls', async () => {
    vi.resetModules();
    const { loadRazorpayScript: freshLoader } = await import('./loadRazorpayScript');

    const first = freshLoader();
    const second = freshLoader();

    const scripts = document.querySelectorAll('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    expect(scripts).toHaveLength(1);

    scripts[0].dispatchEvent(new Event('load'));
    await expect(first).resolves.toBe(true);
    await expect(second).resolves.toBe(true);
  });
});
