// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce<T extends Function>(cb: T, wait = 20) {
  let h = 0;
  const callable = (...args: unknown[]) => {
      clearTimeout(h);
      h = setTimeout(() => cb(...args), wait);
  };
  return callable as unknown as T;
}