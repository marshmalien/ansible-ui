/**
 * componentMapper - Maps schema component fields (switch) to form components (PageFormSwitch)
 * @property {React.Component} - The component or object (with the component and props) to be rendered.
 * @description - The wizard step will display a form with fields based on the
 *    schema data and mapping defined in the `componentMapper` object. Each
 *    component in the mapper must have an unique key that corresponds to a
 *    component field defined in componentTypes constants file.
 */

import { PageFormCredentialSelect } from '../../../frontend/awx/resources/credentials/components/PageFormCredentialSelect';
import { PageFormExecutionEnvironmentSelect } from '../../../frontend/awx/administration/execution-environments/components/PageFormExecutionEnvironmentSelect';
import { PageFormInstanceGroupSelect } from '../../../frontend/awx/administration/instance-groups/components/PageFormInstanceGroupSelect';
import { PageFormInventorySelect } from '../../../frontend/awx/resources/inventories/components/PageFormInventorySelect';
import { PageFormLabelSelect } from '../../../frontend/awx/common/PageFormLabelSelect';
import { PageFormCreatableSelect } from '../../PageForm/Inputs/PageFormCreatableSelect';
import { PageFormDataEditor } from '../../PageForm/Inputs/PageFormDataEditor';
import { PageFormSelectOption } from '../../PageForm/Inputs/PageFormSelectOption';
import { PageFormSwitch } from '../../PageForm/Inputs/PageFormSwitch';
import { PageFormTextInput } from '../../PageForm/Inputs/PageFormTextInput';
import componentTypes from './componentTypes';

export default {
  [componentTypes.AWX_CREDENTIAL_MULTI_SELECT]: PageFormCredentialSelect,
  [componentTypes.AWX_EXECUTION_ENVIRONMENT_SELECT]: PageFormExecutionEnvironmentSelect,
  [componentTypes.AWX_INSTANCE_GROUP_MULTI_SELECT]: PageFormInstanceGroupSelect,
  [componentTypes.AWX_INVENTORY_SELECT]: PageFormInventorySelect,
  [componentTypes.AWX_LABEL_SELECT]: PageFormLabelSelect,
  [componentTypes.CREATE_SELECT]: PageFormCreatableSelect,
  [componentTypes.DATA_EDITOR]: PageFormDataEditor,
  [componentTypes.PASSWORD]: { component: PageFormTextInput, type: 'password' },
  [componentTypes.SELECT]: PageFormSelectOption,
  [componentTypes.SWITCH]: PageFormSwitch,
  [componentTypes.TEXT]: PageFormTextInput,
};
