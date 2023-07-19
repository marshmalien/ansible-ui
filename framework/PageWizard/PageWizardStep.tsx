import { useEffect, ReactNode } from 'react';
import { Form } from '@patternfly/react-core';
import { useWizardContext, WizardFooterProps } from '@patternfly/react-core/next';
import { FormProvider, useForm, useFormState, useFormContext } from 'react-hook-form';
import { PageFormGrid } from '../PageForm/PageForm';
import { usePageWizard } from './usePageWizard';
import componentMapper from './componentMapper';

export interface WizardStepProps {
  title: string;
  name: string;
  hidden?: boolean;
  fields?: {
    component: ReactNode;
    name: string;
    label: string;
  }[];
  footer?: WizardFooterProps;
}

export function PageWizardStep(props: { step: WizardStepProps }) {
  const { step } = props;
  const { dispatch, state } = usePageWizard();
  const { goToNextStep } = useWizardContext();
  const form = useForm({ defaultValues: state });

  useEffect(() => {
    console.log('------- useEffect() -------', state);
    // console.log('usePageWizard state', state.inventory);
    // console.log('react-hook-form getValues()', form.getValues().inventory);
  }, [state]);

  const saveData = (data: WizardStepProps) => {
    dispatch({ type: 'UPDATE', payload: { ...data } });
    goToNextStep();
  };

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(saveData)} id="my-form">
        <PageFormGrid>
          {step?.fields?.map((field, index) => {
            return <Field key={index} {...field} />;
          })}
        </PageFormGrid>
      </Form>
    </FormProvider>
  );
}

function Field(props) {
  const { errors } = useFormState();
  const { dispatch } = usePageWizard();
  const componentBinding = componentMapper[props.component];

  let Component;
  if (typeof props.component === 'string' && typeof componentBinding === 'function') {
    Component = componentBinding;
  } else {
    Component = props.component;
  }

  useEffect(() => {
    dispatch({ type: 'ERRORS', payload: errors });
  }, [errors.inventory, dispatch]);

  return <Component {...props} />;
}
