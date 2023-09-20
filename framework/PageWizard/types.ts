import { SetStateAction } from 'react';

export interface PageWizardStep {
  id: string;
  label: string;
  inputs?: React.ReactNode;
  element?: React.ReactNode;
  isHidden?: boolean;
}

export interface PageWizardState {
  activeStep: PageWizardStep;
  isToggleExpanded: boolean;
  setActiveStep: (step: PageWizardStep) => void;
  setStepData: React.Dispatch<SetStateAction<Record<string, object>>>;
  setStepError: React.Dispatch<SetStateAction<Record<string, object>>>;
  setToggleExpanded: (update: (toggleNavExpanded: boolean) => boolean) => void;
  setWizardData: (data: object) => void;
  stepData: Record<string, object>;
  stepError: Record<string, object>;
  steps: PageWizardStep[];
  wizardData: object;
}
