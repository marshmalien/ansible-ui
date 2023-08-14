import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { parseStringToTagArray } from './helpers';
import { LoadingPage } from '../../../../../framework/components/LoadingPage';
import { RouteObj } from '../../../../Routes';
import { useGet } from '../../../../common/crud/useGet';
import { postRequest } from '../../../../common/crud/Data';
import { useGetItem } from '../../../../common/crud/useGetItem';
import { PageFormInventorySelect } from '../../inventories/components/PageFormInventorySelect';
import {
  PageWizard,
  PageFormTextInput,
  PageFormSelect,
  PageFormGrid,
  PageFormSwitch,
  PageFormDataEditor,
} from '../../../../../framework';
import { getJobOutputUrl } from '../../../views/jobs/jobUtils';
import { usePageAlertToaster } from '../../../../../framework';
import { PageFormInstanceGroupSelect } from '../../../administration/instance-groups/components/PageFormInstanceGroupSelect';
import { PageFormCredentialSelect } from '../../credentials/components/PageFormCredentialSelect';
import { PageFormExecutionEnvironmentSelect } from '../../../administration/execution-environments/components/PageFormExecutionEnvironmentSelect';
import { PageFormLabelSelect } from '../../../common/PageFormLabelSelect';
import { PageFormCreatableSelect } from '../../../../../framework/PageForm/Inputs/PageFormCreatableSelect';
import { TemplateLaunchReviewStep } from './TemplateLaunchReviewStep';
import { requestGet } from '../../../../common/crud/Data';
import { AwxItemsResponse } from '../../../common/AwxItemsResponse';
import { launchValidationSchema } from './validationSchema';
import type { ExecutionEnvironment } from '../../../interfaces/ExecutionEnvironment';
import type { Inventory } from '../../../interfaces/Inventory';
import type { JobTemplate } from '../../../interfaces/JobTemplate';
import type { Label } from '../../../interfaces/Label';
import type { LaunchConfiguration } from '../../../interfaces/LaunchConfiguration';
import type { Organization } from '../../../interfaces/Organization';
import type { UnifiedJob } from '../../../interfaces/UnifiedJob';

export type TemplateWizardPrompts = LaunchConfiguration['defaults'] & {
  job_tags: { name: string; label: string; value: string }[];
  skip_tags: { name: string; label: string; value: string }[];
};

function useLaunchConfig(templateId?: string): {
  data: LaunchConfiguration | undefined;
  error: Error | undefined;
  refresh: () => void;
} {
  const url = templateId ? `/api/v2/job_templates/${templateId}/launch/` : undefined;
  const { data, error, refresh } = useGet<LaunchConfiguration>(url);
  return { data, error, refresh };
}

export function TemplateLaunchWizard() {
  const { t } = useTranslation();
  const alertToaster = usePageAlertToaster();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const resourceId = params.id?.toString() ?? '';
  const { data: config } = useLaunchConfig(resourceId);
  const { data: template } = useGetItem<JobTemplate>('/api/v2/job_templates', resourceId);

  const createLabelPayload = useCallback(
    async (labels: { name: string; id?: number }[], template: JobTemplate) => {
      let organizationId = template?.summary_fields?.organization?.id;
      const existingLabels = labels.filter((label) => label.id);
      const newLabels = labels.filter((label) => !label.id);
      let createdLabels: Label[] = [];

      try {
        if (!organizationId) {
          const data = await requestGet<AwxItemsResponse<Organization>>('/api/v2/organizations/');
          organizationId = data.results[0].id;
        }

        const labelRequests = [];
        for (const label of newLabels || []) {
          labelRequests.push(
            postRequest<Label>(`/api/v2/labels/`, {
              name: label.name,
              organization: organizationId,
            })
          );
        }

        createdLabels = await Promise.all(labelRequests);
      } catch (err) {
        alertToaster.addAlert({
          variant: 'danger',
          title: t('Failed to create new label'),
          children: err instanceof Error && err.message,
        });
      }
      return [...existingLabels, ...createdLabels].map((label) => label.id);
    },
    [alertToaster, t]
  );

  if (!config || !template) return <LoadingPage breadcrumbs tabs />;

  const { defaults } = config;
  const initialValues = {
    'inventory-step': {
      inventory: defaults.inventory,
    },
    'credentials-step': {
      credentials: defaults.credentials,
    },
    'execution-environment-step': {
      execution_environment: defaults.execution_environment,
    },
    'instance-groups-step': {
      instance_groups: defaults.instance_groups,
    },
    'other-prompts-step': {
      diff_mode: defaults.diff_mode,
      scm_branch: defaults.scm_branch,
      extra_vars: defaults.extra_vars,
      forks: defaults.forks,
      job_slice_count: defaults.job_slice_count,
      job_tags: parseStringToTagArray(defaults.job_tags),
      job_type: defaults.job_type,
      labels: defaults.labels,
      limit: defaults.limit,
      skip_tags: parseStringToTagArray(defaults.skip_tags),
      timeout: defaults.timeout,
      verbosity: defaults.verbosity,
    },
  };

  const handleSubmit = async (formValues: TemplateLaunchProps) => {
    if (formValues) {
      const { inventory } = formValues['inventory-step'];
      const { credentials } = formValues['credentials-step'];
      const { instance_groups } = formValues['instance-groups-step'];
      const { execution_environment } = formValues['execution-environment-step'];
      const {
        diff_mode,
        scm_branch,
        extra_vars,
        forks,
        job_slice_count,
        job_tags,
        job_type,
        labels,
        limit,
        skip_tags,
        timeout,
        verbosity,
      } = formValues['other-prompts-step'];
      try {
        const labelPayload = await createLabelPayload(labels, template);
        const payload = {
          credentials: credentials?.map((cred) => cred.id),
          diff_mode: diff_mode,
          execution_environment: execution_environment?.id,
          extra_vars: extra_vars,
          forks: forks,
          instance_groups: instance_groups?.map((ig) => ig.id),
          inventory: inventory?.id,
          job_slice_count: job_slice_count,
          job_tags: job_tags?.map((tag) => tag.name).join(','),
          job_type: job_type,
          labels: labelPayload,
          limit: limit,
          scm_branch: scm_branch,
          skip_tags: skip_tags?.map((tag) => tag.name).join(','),
          timeout: timeout,
          verbosity: verbosity,
        };
        const job = await postRequest(`/api/v2/job_templates/${resourceId}/launch/`, payload);
        if (job) {
          navigate(getJobOutputUrl(job as UnifiedJob));
        }
      } catch (err) {
        alertToaster.addAlert({
          variant: 'danger',
          title: 'Failure to launch',
          children: err instanceof Error && err.message,
        });
      }
    }
  };

  return (
    <PageWizard
      onClose={() => navigate(RouteObj.Templates)}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      schema={launchValidationSchema}
      steps={[
        {
          name: 'Inventory',
          id: 'inventory-step',
          isHidden: !template.ask_inventory_on_launch,
          children: (
            <PageFormInventorySelect
              name="inventory-step.inventory"
              shouldUnregister={false}
              isRequired
            />
          ),
        },
        {
          name: 'Credentials',
          id: 'credentials-step',
          isHidden: !template.ask_credential_on_launch,
          children: (
            <PageFormCredentialSelect
              name="credentials-step.credentials"
              shouldUnregister={false}
              label={t('Credentials')}
              placeholder={t('Add credentials')}
              labelHelpTitle={t('Credentials')}
              labelHelp={t(
                'Select credentials for accessing the nodes this job will be ran against. You can only select one credential of each type. For machine credentials (SSH), checking "Prompt on launch" without selecting credentials will require you to select a machine credential at run time. If you select credentials and check "Prompt on launch", the selected credential(s) become the defaults that can be updated at run time.'
              )}
              isMultiple
            />
          ),
        },
        {
          name: 'Execution Environment',
          id: 'execution-environment-step',
          isHidden: !template.ask_execution_environment_on_launch,
          children: (
            <PageFormExecutionEnvironmentSelect
              name="execution-environment-step.execution_environment.name"
              executionEnvironmentPath="execution-environment-step.execution_environment"
              organizationId={template.organization?.toString() ?? ''}
              shouldUnregister={false}
            />
          ),
        },
        {
          name: 'Instance Groups',
          id: 'instance-groups-step',
          isHidden: !template.ask_instance_groups_on_launch,
          children: (
            <PageFormInstanceGroupSelect
              name="instance-groups-step.instance_groups"
              labelHelp={t(`Select the instance groups for this template to run on.`)}
              shouldUnregister={false}
              isRequired
            />
          ),
        },
        {
          name: 'Other prompts',
          id: 'other-prompts-step',
          isHidden: !shouldShowOtherStep(config),
          children: (
            <PageFormGrid isVertical singleColumn>
              <ConditionalField isHidden={!config.ask_job_type_on_launch}>
                <PageFormSelect
                  shouldUnregister={false}
                  isRequired
                  id="job_type"
                  label={t('Job type')}
                  labelHelpTitle={t('Job type')}
                  labelHelp={t('Select a job type for this job template.')}
                  name="other-prompts-step.job_type"
                  options={[
                    { label: t('Check'), value: 'check' },
                    { label: t('Run'), value: 'run' },
                  ]}
                  placeholderText={t('Select job type')}
                />
              </ConditionalField>
              <ConditionalField isHidden={!config.ask_scm_branch_on_launch}>
                <PageFormTextInput
                  shouldUnregister={false}
                  name="other-prompts-step.scm_branch"
                  placeholder={t('Add a source control branch')}
                  labelHelpTitle={t('Source control branch')}
                  labelHelp={t(
                    'Branch to use in job run. Project default used if blank. Only allowed if project allow_override field is set to true.'
                  )}
                  label={t('Source control branch')}
                />
              </ConditionalField>
              <ConditionalField isHidden={!config.ask_labels_on_launch}>
                <PageFormLabelSelect
                  shouldUnregister={false}
                  labelHelpTitle={t('Labels')}
                  labelHelp={t(
                    `Optional labels that describe this job template, such as 'dev' or 'test'. Labels can be used to group and filter job templates and completed jobs.`
                  )}
                  name="other-prompts-step.labels"
                />
              </ConditionalField>
              <ConditionalField isHidden={!config.ask_forks_on_launch}>
                <PageFormTextInput
                  shouldUnregister={false}
                  id="forks"
                  label={t('Forks')}
                  labelHelpTitle={t('Forks')}
                  labelHelp={t(
                    'The number of parallel or simultaneous processes to use while executing the playbook. An empty value, or a value less than 1 will use the Ansible default which is usually 5. The default number of forks can be overwritten with a change to ansible.cfg. Refer to the Ansible documentation for details about the configuration file.'
                  )}
                  name="other-prompts-step.forks"
                  type="number"
                  placeholder={t('Add number of forks')}
                  min={0}
                />
              </ConditionalField>
              <ConditionalField isHidden={!config.ask_limit_on_launch}>
                <PageFormTextInput
                  shouldUnregister={false}
                  id="limit"
                  label={t('Limit')}
                  labelHelpTitle={t('Limit')}
                  labelHelp={t(
                    'Provide a host pattern to further constrain the list of hosts that will be managed or affected by the playbook. Multiple patterns are allowed. Refer to Ansible documentation for more information and examples on patterns.'
                  )}
                  name="other-prompts-step.limit"
                  placeholder={t('Add a limit to reduce number of hosts.')}
                />
              </ConditionalField>
              <ConditionalField isHidden={!config.ask_verbosity_on_launch}>
                <PageFormSelect
                  shouldUnregister={false}
                  name="other-prompts-step.verbosity"
                  label={t('Verbosity')}
                  labelHelpTitle={t('Verbosity')}
                  labelHelp={t(
                    'Control the level of output ansible will produce as the playbook executes.'
                  )}
                  options={[
                    { label: t`0 (Normal)`, value: 0 },
                    { label: t`1 (Verbose)`, value: 1 },
                    { label: t`2 (More Verbose)`, value: 2 },
                    { label: t`3 (Debug)`, value: 3 },
                    { label: t`4 (Connection Debug)`, value: 4 },
                    { label: t`5 (WinRM Debug)`, value: 5 },
                  ]}
                  placeholderText={t('Select a verbosity value')}
                />
              </ConditionalField>
              <ConditionalField isHidden={!config.ask_job_slice_count_on_launch}>
                <PageFormTextInput
                  shouldUnregister={false}
                  id="job_slice_count"
                  label={t('Job slicing')}
                  labelHelpTitle={t('Job slicing')}
                  labelHelp={t(
                    'Divide the work done by this job template into the specified number of job slices, each running the same tasks against a portion of the inventory.'
                  )}
                  name="other-prompts-step.job_slice_count"
                  type="number"
                  placeholder={t('Add number of slices')}
                />
              </ConditionalField>
              <ConditionalField isHidden={!config.ask_timeout_on_launch}>
                <PageFormTextInput
                  shouldUnregister={false}
                  id="timeout"
                  label={t('Timeout')}
                  labelHelpTitle={t('Timeout')}
                  labelHelp={t(
                    'The amount of time (in seconds) to run before the task is canceled and considered failed. A value of 0 means no timeout.'
                  )}
                  name="other-prompts-step.timeout"
                  type="number"
                  placeholder={t('Add timeout')}
                />
              </ConditionalField>
              <ConditionalField isHidden={!config.ask_diff_mode_on_launch}>
                <PageFormSwitch
                  shouldUnregister={false}
                  id="diff_mode"
                  label={t('On')}
                  labelOff={t('Off')}
                  formLabel={t('Show changes')}
                  labelHelpTitle={t('Show changes')}
                  labelHelp={t(
                    `If enabled, show the changes made by Ansible tasks, where supported. This is equivalent to Ansible's --diff mode.`
                  )}
                  name="other-prompts-step.diff_mode"
                />
              </ConditionalField>
              <ConditionalField isHidden={!config.ask_tags_on_launch}>
                <PageFormCreatableSelect
                  shouldUnregister={false}
                  labelHelpTitle={t('Job tags')}
                  labelHelp={t(
                    'Tags are useful when you have a large playbook, and you want to run a specific part of a play or task. Use commas to separate multiple tags. Refer to the documentation for details on the usage of tags.'
                  )}
                  name="other-prompts-step.job_tags"
                  placeholderText={t('Select or create job tags')}
                  label={t('Job tags')}
                  options={parseStringToTagArray(template?.job_tags) || []}
                />
              </ConditionalField>
              <ConditionalField isHidden={!config.ask_skip_tags_on_launch}>
                <PageFormCreatableSelect
                  shouldUnregister={false}
                  labelHelpTitle={t('Job tags')}
                  labelHelp={t(
                    'Skip tags are useful when you have a large playbook, and you want to skip specific parts of a play or task. Use commas to separate multiple tags. Refer to the documentation for details on the usage of tags.'
                  )}
                  name="other-prompts-step.skip_tags"
                  placeholderText={t('Select or create skip tags')}
                  label={t('Skip tags')}
                  options={parseStringToTagArray(template?.skip_tags) || []}
                />
              </ConditionalField>
              <ConditionalField isHidden={!config.ask_variables_on_launch}>
                <PageFormDataEditor
                  labelHelpTitle={t('Variables')}
                  labelHelp={t(`Optional extra variables to be applied to job template`)}
                  toggleLanguages={['yaml', 'json']}
                  label={t('Variables')}
                  name="other-prompts-step.extra_vars"
                  isExpandable
                  shouldUnregister={false}
                  defaultExpanded
                />
              </ConditionalField>
            </PageFormGrid>
          ),
        },
      ]}
      reviewStep={(values: TemplateLaunchProps) => (
        <TemplateLaunchReviewStep values={values} template={template} />
      )}
    />
  );
}

function shouldShowOtherStep(launchData: LaunchConfiguration) {
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

export function ConditionalField({
  isHidden = false,
  children,
}: {
  isHidden: boolean;
  children: React.ReactNode;
}) {
  return isHidden ? null : <>{children}</>;
}

export interface TemplateLaunchProps {
  'inventory-step'?: {
    inventory: Inventory;
  };
  'credentials-step'?: {
    credentials: Credential[];
  };
  'instance-groups-step'?: {
    instance_groups: { id: number; name: string }[];
  };
  'execution-environment-step'?: {
    execution_environment: ExecutionEnvironment;
  };
  'other-prompts-step'?: {
    diff_mode: boolean;
    extra_vars: string;
    forks: string | number;
    job_slice_count: string | number;
    job_tags: { name: string }[];
    job_type: string;
    labels: { name: string; id: string }[];
    limit: string;
    scm_branch: string;
    skip_tags: { name: string }[];
    timeout: string | number;
    verbosity: number;
  };
}
