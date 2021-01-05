
// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(func: Function, timeout: number) {
  let timer: number;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}