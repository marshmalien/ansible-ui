import { useContext } from 'react';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { PageWizardContext } from './PageWizardContext';

export default function PageWizardNavigation() {
  const { activeStep, steps, isToggleExpanded, setActiveStep, stepError } =
    useContext(PageWizardContext);
  const navClassName = isToggleExpanded ? 'pf-c-wizard__nav pf-m-expanded' : 'pf-c-wizard__nav';

  const goToStepByIndex = (index: number) => {
    const step = steps[index];
    if (step) {
      setActiveStep(step);
    }
  };

  return (
    <nav className={navClassName} aria-label="Steps">
      <ol className="pf-c-wizard__nav-list">
        {steps.map((step, index) => {
          const activeStepIndex = steps.findIndex((step) => step.id === activeStep.id);
          const isDisabled = index > activeStepIndex;

          const className =
            'pf-c-wizard__nav-link' + // eslint-disable-line i18next/no-literal-string
            (activeStep.id === step.id ? ' pf-m-current' : '') + // eslint-disable-line i18next/no-literal-string
            (isDisabled ? ' pf-m-disabled' : ''); // eslint-disable-line i18next/no-literal-string

          if (step.isHidden) {
            return;
          }

          return (
            <li className="pf-c-wizard__nav-item" key={step.id}>
              <button
                className={className}
                onClick={() => goToStepByIndex(index)}
                disabled={isDisabled}
              >
                {' '}
                {step.label}
                {stepError[step.id] && activeStep.id === step.id && (
                  <span style={{ marginLeft: '8px' }}>
                    <ExclamationCircleIcon color="#C9190B" />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
