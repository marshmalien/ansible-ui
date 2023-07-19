// Will move this component to awx/pages/templates once it's ready
// Currently only used in TemplateLaunch and TemplateSchema
export function parseStringToTagArray(str: string) {
  return str?.split(',')?.map((tag) => ({ name: tag, label: tag, value: tag }));
}
