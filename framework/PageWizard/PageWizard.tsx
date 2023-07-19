import { useEffect } from 'react';
import { Wizard, WizardStep } from '@patternfly/react-core/next';
import { PageWizardFooter } from './PageWizardFooter';
import { PageWizardStep } from './PageWizardStep';
import { usePageWizard, PageWizardProvider } from './usePageWizard';
import type { Launch } from '../../frontend/awx/interfaces/Launch';
import type { LaunchPrompt } from './TemplateLaunch';
import type { WizardStepProps } from './PageWizardStep';

interface WizardWrapperProps {
  onClose: () => void;
  onSubmit: (val: object) => void;
  initialValues?: LaunchPrompt;
  schema: {
    steps: WizardStepProps[];
  };
}
export function WizardWrapper(props: WizardWrapperProps) {
  const { dispatch, state } = usePageWizard();
  const { onClose, onSubmit, initialValues, schema } = props;

  useEffect(() => {
    dispatch({
      type: 'UPDATE',
      payload: initialValues,
    });
  }, [dispatch, initialValues]);

  const visibleSteps = schema.steps.filter((step) => !step.hidden);

  const handleSave = () => {
    onSubmit(state as Launch);
  };

  if (Object.keys(state).length === 0) return null; // remove later

  return (
    <Wizard footer={<PageWizardFooter />} onClose={onClose} onSave={handleSave}>
      {visibleSteps.map((step, index) => (
        <WizardStep
          name={step.title}
          id={`${step.name}-step`}
          footer={step.footer}
          key={index}
          status={step?.name === 'inventory' && state?.errors?.inventory ? 'error' : 'default'}
        >
          <PageWizardStep step={step} />
        </WizardStep>
      ))}
    </Wizard>
  );
}

export const PageWizard = (props: WizardWrapperProps) => {
  return (
    <PageWizardProvider>
      <WizardWrapper {...props} />
    </PageWizardProvider>
  );
};
