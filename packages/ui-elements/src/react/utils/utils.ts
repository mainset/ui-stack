const msDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
) => {
  let inDebounce: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    const context = this;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

export { msDebounce };
