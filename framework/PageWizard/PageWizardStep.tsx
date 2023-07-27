import { useEffect, ReactNode, Fragment } from 'react';
import { Form } from '@patternfly/react-core';
import { useWizardContext, WizardFooterProps } from '@patternfly/react-core/next';
import { FormProvider, useForm, useFormState, useFormContext } from 'react-hook-form';
import { PageFormGrid } from '../PageForm/PageForm';
import { usePageWizard } from './usePageWizard';
import componentMapper from './Utils/componentMapper';

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
  mode?: 'Details' | 'Form';
}

export function PageWizardStep(props: { step: WizardStepProps }) {
  const { step } = props;
  const { dispatch, state } = usePageWizard();
  const { goToNextStep } = useWizardContext();
  const form = useForm({ defaultValues: state });

  useEffect(() => {
    // STEP debugger
    // console.log('------- useEffect() -------', state);
    // console.log('usePageWizard state', state.inventory);
    // console.log('react-hook-form getValues()', form.getValues().inventory);
  }, [state]);

  const saveData = (data: WizardStepProps) => {
    dispatch({ type: 'UPDATE', payload: { ...data } });
    goToNextStep();
  };

  if (step.mode === 'Details') {
    return (
      <Fragment>
        {step?.fields?.map((field, index) => {
          return <DetailsField key={index} {...field} />;
        })}
      </Fragment>
    );
  }

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(saveData)} id="my-form">
        <PageFormGrid singleColumn>
          {step?.fields?.map((field, index) => {
            return <FormField key={index} {...field} />;
          })}
        </PageFormGrid>
      </Form>
    </FormProvider>
  );
}

function parseComponent(component: string, props) {
  const componentBinding = componentMapper[component];
  let componentProps = props;

  let Component;
  if (typeof component === 'string' && typeof componentBinding === 'function') {
    Component = componentBinding;
  } else if (
    typeof componentBinding === 'object' &&
    Object.prototype.hasOwnProperty.call(componentBinding, 'component')
  ) {
    const { component, ...mapperProps } = componentBinding;
    Component = component;
    componentProps = { ...mapperProps, ...componentProps };
  } else {
    Component = component;
  }
  return { Component, componentProps };
}

function DetailsField(props) {
  const { component, ...rest } = props;
  const { Component, componentProps } = parseComponent(component, rest);
  return <Component {...componentProps} />;
}

function FormField(props) {
  const { errors } = useFormState();
  const { dispatch } = usePageWizard();
  const { component, ...rest } = props;
  const { Component, componentProps } = parseComponent(component, rest);

  useEffect(() => {
    console.log('errors', errors);
    dispatch({ type: 'ERRORS', payload: errors });
  }, [errors.inventory, dispatch]);

  return <Component {...componentProps} />;
}
