// eslint-disable-next-line @typescript-eslint/ban-types
export function throttle(func: Function, timeout: number) {
    let ready = true;
    return (...args: unknown[]) => {
      if (!ready) return;
      ready = false;
      func(...args);
      setTimeout(() => {
        ready = true;
      }, timeout);
    };
  }