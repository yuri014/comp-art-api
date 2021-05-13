/**
 * Função para previnir Generic Object Injection Sink
 */
const handleInjectionSink = (index: number, array: unknown[]) => {
  const newIndex = index as unknown | string | number;
  const arrayValue = array[parseInt(newIndex as string, 10)];
  return arrayValue;
};

export default handleInjectionSink;
