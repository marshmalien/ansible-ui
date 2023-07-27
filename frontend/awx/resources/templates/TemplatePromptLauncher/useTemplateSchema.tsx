// Will move this component to awx/pages/templates once it's ready
import componentTypes from '../../../../../framework/PageWizard/Utils/componentTypes';
import { TemplatePreview } from './steps/TemplatePreview';
import { parseStringToTagArray, showCredentialPasswordsStep } from './helpers';
// import { useFormContext } from 'react-hook-form';
// import SurveyStep from './steps/SurveyStep';
import type { Launch } from '../../../interfaces/Launch';
import type { JobTemplate } from '../../../interfaces/JobTemplate';

export const useTemplateSchema = (launchConfig: Launch, template: JobTemplate) => {
  return {
    steps: [
      {
        title: 'Inventory',
        name: 'inventory',
        hidden: !launchConfig.ask_inventory_on_launch,
        fields: [
          {
            component: componentTypes.AWX_INVENTORY_SELECT,
            name: 'inventory',
            label: `Inventory`,
            isRequired: true,
          },
        ],
      },
      {
        title: 'Credentials',
        name: 'credentials',
        hidden: !launchConfig.ask_credential_on_launch,
        fields: [
          {
            component: componentTypes.AWX_CREDENTIAL_MULTI_SELECT,
            name: 'credentials',
            label: `Credentials`,
            isMultiple: true,
          },
        ],
      },
      {
        title: 'Execution Environment',
        name: 'execution_environment',
        hidden: !launchConfig.ask_execution_environment_on_launch,
        fields: [
          {
            component: componentTypes.AWX_EXECUTION_ENVIRONMENT_SELECT,
            name: 'execution_environment.name',
            label: `Execution Environment`,
          },
        ],
      },
      {
        title: 'Instance Groups',
        name: 'instance_groups',
        hidden: !launchConfig.ask_instance_groups_on_launch,
        fields: [
          {
            component: componentTypes.AWX_INSTANCE_GROUP_MULTI_SELECT,
            name: 'instance_groups',
            label: `Instance Groups`,
          },
        ],
      },
      {
        title: 'Other prompts',
        name: 'other',
        hidden: !shouldShowOtherStep(launchConfig),
        fields: [
          {
            component: componentTypes.SELECT,
            name: 'job_type',
            label: `Job Type`,
            hidden: !launchConfig.ask_job_type_on_launch,
            options: [
              { label: 'Check', value: 'check' },
              { label: 'Run', value: 'run' },
            ],
          },
          {
            component: componentTypes.AWX_LABEL_SELECT,
            name: 'labels',
            label: `Labels`,
            hidden: !launchConfig.ask_labels_on_launch,
          },
          {
            component: componentTypes.TEXT,
            name: 'forks',
            label: `Forks`,
            type: 'number',
            hidden: !launchConfig.ask_forks_on_launch,
          },
          {
            component: componentTypes.TEXT,
            name: 'limit',
            label: `Limit`,
            hidden: !launchConfig.ask_limit_on_launch,
          },
          {
            component: componentTypes.TEXT,
            name: 'verbosity',
            label: `Verbosity`,
            type: 'number',
            hidden: !launchConfig.ask_verbosity_on_launch,
          },
          {
            component: componentTypes.TEXT,
            name: 'job_slice_count',
            label: `Job slicing`,
            type: 'number',
            hidden: !launchConfig.ask_job_slice_count_on_launch,
          },
          {
            component: componentTypes.TEXT,
            name: 'timeout',
            label: `Timeout`,
            type: 'number',
            hidden: !launchConfig.ask_timeout_on_launch,
          },
          {
            component: componentTypes.SWITCH,
            name: 'diff_mode',
            label: `Show changes`,
            hidden: !launchConfig.ask_diff_mode_on_launch,
          },
          {
            component: componentTypes.CREATE_SELECT,
            name: 'job_tags',
            label: `Job tags`,
            options: parseStringToTagArray(template?.job_tags) || [],
            hidden: !launchConfig.ask_tags_on_launch,
          },
          {
            component: componentTypes.CREATE_SELECT,
            name: 'skip_tags',
            label: `Skip tags`,
            options: parseStringToTagArray(template?.skip_tags) || [],
            hidden: !launchConfig.ask_skip_tags_on_launch,
          },
          {
            component: componentTypes.DATA_EDITOR,
            name: 'extra_vars',
            label: 'Variables',
            isExpandable: true,
          },
        ],
      },
      {
        title: 'Preview',
        name: 'preview',
        mode: 'Details',
        fields: [
          {
            component: TemplatePreview,
            name: 'preview',
            label: `Preview`,
            data: template,
          },
        ],
        footer: {
          nextButtonText: 'Launch',
        },
      },
    ],
  };
};

function shouldShowOtherStep(launchData: Launch) {
  return (
    launchData.ask_job_type_on_launch ||
    launchData.ask_limit_on_launch ||
    launchData.ask_verbosity_on_launch ||
    launchData.ask_tags_on_launch ||
    launchData.ask_skip_tags_on_launch ||
    launchData.ask_variables_on_launch ||
    launchData.ask_scm_branch_on_launch ||
    launchData.ask_diff_mode_on_launch ||
    launchData.ask_labels_on_launch ||
    launchData.ask_forks_on_launch ||
    launchData.ask_job_slice_count_on_launch ||
    launchData.ask_timeout_on_launch
  );
}
