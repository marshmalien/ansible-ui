import jsyaml from 'js-yaml';

export function parseStringToTagArray(str: string) {
  if (str.trim().length === 0) return [];
  return str?.split(',')?.map((tag) => ({ name: tag, label: tag, value: tag }));
}

export function mergeExtraVars(extraVars = '', survey = {}) {
  const vars = jsyaml.load(extraVars) || {};
  return {
    ...vars,
    ...survey,
  };
}
