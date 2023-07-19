import componentTypes from './componentTypes';
import { PageFormCreatableSelect } from '../PageForm/Inputs/PageFormCreatableSelect';
import { PageFormDataEditor } from '../PageForm/Inputs/PageFormDataEditor';
import { PageFormSelectOption } from '../PageForm/Inputs/PageFormSelectOption';
import { PageFormSwitch } from '../PageForm/Inputs/PageFormSwitch';
import { PageFormTextInput } from '../PageForm/Inputs/PageFormTextInput';
import { PageFormCredentialSelect } from '../../frontend/awx/resources/credentials/components/PageFormCredentialSelect';
import { PageFormExecutionEnvironmentSelect } from '../../frontend/awx/administration/execution-environments/components/PageFormExecutionEnvironmentSelect';
import { PageFormInstanceGroupSelect } from '../../frontend/awx/administration/instance-groups/components/PageFormInstanceGroupSelect';
import { PageFormInventorySelect } from '../../frontend/awx/resources/inventories/components/PageFormInventorySelect';
import { PageFormLabelSelect } from '../../frontend/awx/common/PageFormLabelSelect';

export default {
  [componentTypes.AWX_CREDENTIAL_MULTI_SELECT]: PageFormCredentialSelect,
  [componentTypes.AWX_EXECUTION_ENVIRONMENT_SELECT]: PageFormExecutionEnvironmentSelect,
  [componentTypes.AWX_INSTANCE_GROUP_MULTI_SELECT]: PageFormInstanceGroupSelect,
  [componentTypes.AWX_INVENTORY_SELECT]: PageFormInventorySelect,
  [componentTypes.AWX_LABEL_SELECT]: PageFormLabelSelect,
  [componentTypes.CREATE_SELECT]: PageFormCreatableSelect,
  [componentTypes.DATA_EDITOR]: PageFormDataEditor,
  [componentTypes.SELECT]: PageFormSelectOption,
  [componentTypes.SWITCH]: PageFormSwitch,
  [componentTypes.TEXT]: PageFormTextInput,
};
