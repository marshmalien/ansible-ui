import { useState } from 'react';
import { FormProvider, useForm, Form, useFormContext, FieldValues } from 'react-hook-form';
import { Wizard, WizardStep, WizardStepType } from '@patternfly/react-core/next';
import { ajvResolver } from '@hookform/resolvers/ajv';

interface PageWizardProps {
  initialValues: FieldValues;
  onClose: () => void;
  onSubmit: () => void;
  reviewStep: (values: any) => React.ReactNode;
  schema: {
    type: 'object';
    properties: {
      [key: string]: object;
    };
  };
  steps: { name: string; id: string; isHidden?: boolean; children: React.ReactNode }[];
}

export function PageWizard(props: PageWizardProps) {
  const { onSubmit, onClose, schema, steps, reviewStep, initialValues } = props;
  const [visitedSteps, setVisitedSteps] = useState<string[]>([]);

  const form = useForm({
    defaultValues: initialValues,
    resolver: async (data, context, options) => {
      if (visitedSteps.includes('review-step')) {
        return ajvResolver(schema)(data, context, options);
      } else {
        const prunedSchema = JSON.parse(JSON.stringify(schema));
        for (const step of steps) {
          if (!visitedSteps.includes(step.id)) {
            delete prunedSchema.properties[step.id];
          }
        }

        return ajvResolver(prunedSchema)(data, context, options);
      }
    },
  });

  function hasStepError(step: { id: string }) {
    return Boolean(form.getFieldState(step.id).error);
  }

  const handleStepChange = (
    _: React.MouseEvent<HTMLElement, MouseEvent>,
    currentStep: WizardStepType
  ) => {
    setVisitedSteps([...new Set([...visitedSteps, currentStep.id])]);
  };

  return (
    <FormProvider {...form}>
      <Form
        className="pf-c-form"
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: 0,
        }}
      >
        <Wizard
          onSave={form.handleSubmit(onSubmit)}
          onClose={onClose}
          onStepChange={handleStepChange}
        >
          {steps.map((step) => {
            if (step.isHidden) return null;
            return (
              <WizardStep
                key={step.id}
                status={hasStepError(step) ? 'error' : 'default'}
                {...step}
              />
            );
          })}
          <WizardStep
            name="Review"
            id="review-step"
            footer={{
              nextButtonText: 'Launch',
              isNextDisabled:
                !form.formState.isValid || Object.keys(form.formState.errors).length > 0,
            }}
          >
            <ReviewStep render={reviewStep} />
          </WizardStep>
        </Wizard>
      </Form>
    </FormProvider>
  );
}

interface ReviewStepProps {
  render: (values: any) => React.ReactNode;
}
function ReviewStep(props: ReviewStepProps) {
  const { render } = props;
  const { getValues } = useFormContext();
  return render(getValues());
}
