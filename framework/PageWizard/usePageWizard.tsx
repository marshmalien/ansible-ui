import { ReactNode } from 'react';
import { useReducer } from 'react';
import { createContext, useContext } from 'react';
import type { JobTemplate } from '../../frontend/awx/interfaces/JobTemplate';

interface PageWizardState extends JobTemplate {
  errors: object;
}
type Initialize = { type: 'INITIALIZE'; payload: PageWizardState };
type Update = { type: 'UPDATE'; payload: PageWizardState };
type Errors = { type: 'ERRORS'; payload: { errors: object } };
type PageWizardActions = Initialize | Update | Errors;

const initialState = {};
const reducer = (state: PageWizardState, action: PageWizardActions): PageWizardState => {
  const { type, payload } = action;
  switch (type) {
    case 'INITIALIZE':
      return payload;
    case 'UPDATE':
      return { ...state, ...payload };
    case 'ERRORS':
      return {
        ...state,
        errors: payload,
      };
    default:
      throw new Error('Invalid action type');
  }
};

export const PageWizardContext = createContext(initialState);
export function PageWizardProvider(props: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState as PageWizardState);

  return (
    <PageWizardContext.Provider value={{ state, dispatch }}>
      {props.children}
    </PageWizardContext.Provider>
  );
}

export function usePageWizard() {
  const context = useContext(PageWizardContext);
  if (!context) {
    throw new Error('usePageWizard must be used within the PageWizardProvider');
  }
  return context;
}
