// Will move this component to awx/pages/templates once it's ready
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { mergeExtraVars, parseStringToTagArray } from './helpers';
import { PageWizard } from '../../../../../framework/PageWizard/PageWizard';
import { useTemplateSchema } from './useTemplateSchema';
import { usePageAlertToaster } from '../../../../../framework/PageAlertToaster';
import { LoadingPage } from '../../../../../framework/components/LoadingPage';
import { RouteObj } from '../../../../Routes';
import { AwxError } from '../../../common/AwxError';
import { AwxItemsResponse } from '../../../common/AwxItemsResponse';
import { useGet } from '../../../../common/crud/useGet';
import { useGetItem } from '../../../../common/crud/useGetItem';
import { postRequest, requestGet } from '../../../../common/crud/Data';
import { getJobOutputUrl } from '../../../views/jobs/jobUtils';
import type { JobTemplate } from '../../../interfaces/JobTemplate';
import type { Label } from '../../../interfaces/Label';
import type { Launch } from '../../../interfaces/Launch';
import type { Organization } from '../../../interfaces/Organization';

function useLaunchConfig(templateId?: string): {
  data: Launch | undefined;
  error: Error | undefined;
  refresh: () => void;
} {
  const url = templateId ? `/api/v2/job_templates/${templateId}/launch/` : undefined;
  const { data, error, refresh } = useGet<Launch>(url);
  return { data, error, refresh };
}

export type LaunchPrompt = Launch['defaults'] & {
  job_tags: { name: string; label: string; value: string }[];
  skip_tags: { name: string; label: string; value: string }[];
};

export const TemplatePromptLauncher = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const resourceId = params.id?.toString() ?? '';
  const { data: config, error, refresh } = useLaunchConfig(resourceId);
  const { data: template } = useGetItem<JobTemplate>('/api/v2/job_templates', resourceId);
  const alertToaster = usePageAlertToaster();

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

  if (error) return <AwxError error={error} handleRefresh={refresh} />;
  if (!config || !template) return <LoadingPage breadcrumbs tabs />;

  const { defaults, ...launchConfig } = config;
  const initialValues = {
    ...defaults,
    inventory: defaults?.inventory?.id ? defaults?.inventory : null,
    job_tags: parseStringToTagArray(defaults?.job_tags),
    skip_tags: parseStringToTagArray(defaults?.skip_tags),
  };
  const schema = useTemplateSchema(launchConfig as Launch, template as JobTemplate);

  const handleSubmit = async (formValues: LaunchPrompt) => {
    if (formValues) {
      try {
        const surveyValues = {}; // TODO: survey
        const labelPayload = await createLabelPayload(formValues.labels, template);
        const payload = {
          credentials: formValues.credentials?.map((cred) => cred.id),
          diff_mode: formValues.diff_mode,
          execution_environment: formValues.execution_environment?.id,
          extra_vars: mergeExtraVars(formValues.extra_vars, surveyValues),
          forks: formValues.forks,
          instance_groups: formValues.instance_groups?.map((ig) => ig.id),
          inventory: formValues.inventory?.id,
          job_slice_count: formValues.job_slice_count,
          job_tags: formValues.job_tags?.map((tag) => tag.name).join(','),
          job_type: formValues.job_type,
          labels: labelPayload,
          limit: formValues.limit,
          scm_branch: formValues.scm_branch,
          skip_tags: formValues.skip_tags?.map((tag) => tag.name).join(','),
          timeout: formValues.timeout,
          verbosity: formValues.verbosity,
        };

        const job = await postRequest(`/api/v2/job_templates/${resourceId}/launch/`, payload);
        if (job) {
          navigate(getJobOutputUrl(job));
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
      schema={schema}
    />
  );
};
