import { createContext, ReactNode, useState } from 'react';

import type { PageWizardStep, PageWizardState } from './types';

export const PageWizardContext = createContext<PageWizardState>({} as PageWizardState);

export function PageWizardProvider(props: {
  children: ReactNode;
  steps: PageWizardStep[];
  defaultValue?: Record<string, object>;
}) {
  const [isToggleExpanded, setToggleExpanded] = useState(false);
  const [activeStep, setActiveStep] = useState<PageWizardStep>(props.steps[0]); // active step object
  const [wizardData, setWizardData] = useState({}); // flat wizard data
  const [stepData, setStepData] = useState<Record<string, object>>(props.defaultValue ?? {}); // wizard data by step id
  const [stepError, setStepError] = useState<Record<string, object>>({}); // wizard error by step id

  return (
    <PageWizardContext.Provider
      value={{
        wizardData,
        setWizardData: setWizardData,
        stepData,
        setStepData: setStepData,
        steps: props.steps,
        activeStep,
        setActiveStep: setActiveStep,
        stepError,
        setStepError: setStepError,
        isToggleExpanded: isToggleExpanded,
        setToggleExpanded: setToggleExpanded,
      }}
    >
      {props.children}
    </PageWizardContext.Provider>
  );
}
