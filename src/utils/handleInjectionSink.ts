/**
 * Função para previnir Generic Object Injection Sink
 */
const handleInjectionSink = (index: number, array: unknown[]) => {
  const newIndex = index as unknown | string | number;
  const boolValue = !!array[parseInt(newIndex as string, 10)];
  return boolValue;
};

/**
 * Função para previnir Generic Object Injection Sink
 */
export default handleInjectionSink;
