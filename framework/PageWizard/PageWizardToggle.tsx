import { useCallback, useContext } from 'react';
import { CaretDownIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Wizard/wizard';
import { PageWizardContext } from './PageWizardContext';

export default function PageWizardToggle() {
  const { activeStep, isToggleExpanded, setToggleExpanded } = useContext(PageWizardContext);
  const toggleNavExpanded = useCallback(
    () => setToggleExpanded((isNavExpanded) => !isNavExpanded),
    [setToggleExpanded]
  );
  return (
    <button
      onClick={toggleNavExpanded}
      className={css(styles.wizardToggle, isToggleExpanded && 'pf-m-expanded')}
      // aria-label={ariaLabel}
      aria-expanded={isToggleExpanded}
    >
      <span className={css(styles.wizardToggleList)}>
        <span className={css(styles.wizardToggleListItem)}>
          <span className={css(styles.wizardToggleNum)}>{1}</span> {activeStep?.label}
          {/* {isActiveSubStep && (
              <AngleRightIcon className={css(styles.wizardToggleSeparator)} aria-hidden="true" />
            )} */}
        </span>
        {/* {isActiveSubStep && (
            <span className={css(styles.wizardToggleListItem)}>{activeStep?.name}</span>
          )} */}
      </span>

      <span className={css(styles.wizardToggleIcon)}>
        <CaretDownIcon aria-hidden="true" />
      </span>
    </button>
  );
}
