const handleInjection = (index: number, array: unknown[]) => {
  const newIndex = index as unknown | string | number;
  const boolValue = !!array[parseInt(newIndex as string, 10)];
  return boolValue;
};

export default handleInjection;
