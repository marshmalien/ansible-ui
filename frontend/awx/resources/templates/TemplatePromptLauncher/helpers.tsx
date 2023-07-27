import jsyaml from 'js-yaml';

// Will move this component to awx/pages/templates once it's ready
// Currently only used in TemplateLaunch and TemplateSchema
export function parseStringToTagArray(str: string) {
  if (str === '') return [];
  return str?.split(',')?.map((tag) => ({ name: tag, label: tag, value: tag }));
}

export function mergeExtraVars(extraVars = '', survey = {}) {
  const vars = jsyaml.load(extraVars) || {};
  return {
    ...vars,
    ...survey,
  };
}

export function showCredentialPasswordsStep(launchConfig, credentials = []) {
  if (!launchConfig?.ask_credential_on_launch && launchConfig?.passwords_needed_to_start) {
    return launchConfig.passwords_needed_to_start.length > 0;
  }

  let credentialPasswordStepRequired = false;

  credentials.forEach((credential) => {
    if (!credential.inputs) {
      const launchConfigCredential = launchConfig.defaults.credentials.find(
        (defaultCred) => defaultCred.id === credential.id
      );

      if (launchConfigCredential?.passwords_needed.length > 0) {
        credentialPasswordStepRequired = true;
      }
    } else if (
      credential?.inputs?.password === 'ASK' ||
      credential?.inputs?.become_password === 'ASK' ||
      credential?.inputs?.ssh_key_unlock === 'ASK' ||
      credential?.inputs?.vault_password === 'ASK'
    ) {
      credentialPasswordStepRequired = true;
    }
  });

  return credentialPasswordStepRequired;
}
