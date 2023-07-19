// Will move this component to awx/pages/templates once it's ready
import { useParams, useNavigate } from 'react-router-dom';
import { parseStringToTagArray } from './helpers';
import { PageWizard } from './PageWizard';
import { useTemplateSchema } from './useTemplateSchema';
import { usePageAlertToaster } from '../PageAlertToaster';
import { LoadingPage } from '../components/LoadingPage';
import { RouteObj } from '../../frontend/Routes';
import { AwxError } from '../../frontend/awx/common/AwxError';
import { useGet } from '../../frontend/common/crud/useGet';
import { useGetItem } from '../../frontend/common/crud/useGetItem';
import { postRequest } from '../../frontend/common/crud/Data';
import { getJobOutputUrl } from '../../frontend/awx/views/jobs/jobUtils';
import type { JobTemplate } from '../../frontend/awx/interfaces/JobTemplate';
import type { Launch } from '../../frontend/awx/interfaces/Launch';

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

export const TemplateLaunch = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const resourceId = params.id?.toString() ?? '';
  const { data: config, error, refresh } = useLaunchConfig(resourceId);
  const { data: template } = useGetItem<JobTemplate>('/api/v2/job_templates', resourceId);
  const alertToaster = usePageAlertToaster();

  if (error) return <AwxError error={error} handleRefresh={refresh} />;
  if (!config && !template) return <LoadingPage breadcrumbs tabs />;

  const { defaults, ...launchConfig } = config;
  const initialValues = {
    ...defaults,
    job_tags: parseStringToTagArray(defaults?.job_tags),
    skip_tags: parseStringToTagArray(defaults?.skip_tags),
  };
  const schema = useTemplateSchema(launchConfig as Launch, template as JobTemplate);

  const handleSubmit = async (formValues: LaunchPrompt) => {
    console.log('formValues', formValues);

    if (formValues) {
      const payload = {
        credentials: formValues.credentials?.map((cred) => cred.id),
        diff_mode: formValues.diff_mode,
        execution_environment: formValues.execution_environment?.id,
        extra_vars: formValues.extra_vars,
        forks: formValues.forks,
        instance_groups: formValues.instance_groups?.map((ig) => ig.id),
        inventory: formValues.inventory?.id,
        job_slice_count: formValues.job_slice_count,
        job_tags: formValues.job_tags?.map((tag) => tag.name).join(','),
        job_type: formValues.job_type,
        labels: formValues.labels?.map((label) => label.id),
        limit: formValues.limit,
        scm_branch: formValues.scm_branch,
        skip_tags: formValues.skip_tags?.map((tag) => tag.name).join(','),
        timeout: formValues.timeout,
        verbosity: formValues.verbosity,
      };

      try {
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
