import { useTranslation } from 'react-i18next';
import { Button } from '@patternfly/react-core';
import { useWizardContext, WizardFooterWrapper } from '@patternfly/react-core/next';

export function PageWizardFooter() {
  const { t } = useTranslation();
  const { goToPrevStep, activeStep, close } = useWizardContext();
  return (
    <WizardFooterWrapper>
      <Button type="submit" form="my-form">
        {t`Next`}
      </Button>
      <Button variant="secondary" onClick={goToPrevStep} isDisabled={activeStep.index === 1}>
        {t`Back`}
      </Button>
      <Button variant="link" onClick={close}>
        {t`Cancel`}
      </Button>
    </WizardFooterWrapper>
  );
}
