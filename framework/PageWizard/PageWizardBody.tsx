import { useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormState } from 'react-hook-form';
import { PageSection } from '@patternfly/react-core';
import { PageForm } from '../PageForm/PageForm';
import { PageWizardContext } from './PageWizardContext';
import PageWizardFooter from './PageWizardFooter';

export default function PageWizardBody<T>(props: {
  onCancel?: () => void;
  onSubmit: (wizardData: T) => Promise<void>;
}) {
  const navigate = useNavigate();
  const { onSubmit, onCancel } = props;
  const { activeStep, steps, stepData, wizardData, setWizardData, setStepData, setActiveStep } =
    useContext(PageWizardContext);

  const onClose = useCallback((): void => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  }, [navigate, onCancel]);

  const onNext = useCallback(
    (formData: object) => {
      const isLastStep = activeStep?.id === steps[steps.length - 1].id;
      if (isLastStep) {
        return onSubmit(wizardData as T);
      }

      const activeStepIndex = steps.findIndex((step) => step.id === activeStep.id);
      let nextStep = steps[activeStepIndex + 1];

      for (let i = activeStepIndex + 1; i < steps.length; i++) {
        if (!steps[i].isHidden) {
          nextStep = steps[i];
          break;
        }
      }

      setWizardData((prev: object) => ({ ...prev, ...formData }));
      setStepData((prev) => ({ ...prev, [activeStep.id]: formData }));

      setActiveStep(nextStep);
      return Promise.resolve();
    },
    [activeStep, wizardData, onSubmit, steps, setWizardData, setStepData, setActiveStep]
  );

  const onBack = useCallback(() => {
    const activeStepIndex = steps.findIndex((step) => step.id === activeStep.id);
    let previousStep = steps[activeStepIndex - 1];

    for (let i = activeStepIndex - 1; i >= 0; i--) {
      if (!steps[i].isHidden) {
        previousStep = steps[i];
        break;
      }
    }

    setActiveStep(previousStep);
  }, [activeStep, steps, setActiveStep]);

  return (
    <>
      {activeStep && 'inputs' in activeStep ? (
        <PageForm
          key={activeStep.id}
          onSubmit={onNext}
          footer={<PageWizardFooter onBack={onBack} onCancel={onClose} />}
          disableBody
          defaultValue={stepData[activeStep.id]}
        >
          <StepErrors />
          {activeStep.inputs}
        </PageForm>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <PageSection variant="light" isFilled hasOverflowScroll>
            {activeStep?.element}
          </PageSection>
          <PageWizardFooter onNext={() => void onNext({})} onBack={onBack} onCancel={onClose} />
        </div>
      )}
    </>
  );
}

function StepErrors() {
  const { activeStep, setStepError } = useContext(PageWizardContext);
  const { errors } = useFormState();
  const formErrors = JSON.stringify(errors);

  useEffect(() => {
    if (Object.keys(errors).length === 0) {
      setStepError({});
    } else {
      setStepError({ [activeStep.id]: errors });
    }
  }, [errors, activeStep.id, setStepError, formErrors]);

  return null;
}
