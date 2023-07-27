import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Label, LabelGroup } from '@patternfly/react-core';
import { usePageWizard } from '../../../../../../framework/PageWizard/usePageWizard';
import { LoadingPage } from '../../../../../../framework/components/LoadingPage';
import { PageDetail } from '../../../../../../framework/PageDetails/PageDetail';
import { PageDetails } from '../../../../../../framework/PageDetails/PageDetails';
import { PageDetailCodeEditor } from '../../../../../../framework/PageDetails/PageDetailCodeEditor';
import { RouteObj } from '../../../../../Routes';
import { useGetItem } from '../../../../../common/crud/useGetItem';
import { CredentialLabel } from '../../../../common/CredentialLabel';
import { useVerbosityString } from '../../../../common/useVerbosityString';
import type { JobTemplate } from '../../../../interfaces/JobTemplate';
import type { WorkflowJobTemplate } from '../../../../interfaces/WorkflowJobTemplate';
import type { Credential } from '../../../../interfaces/Credential';
import type { SummaryFieldCredential } from '../../../../interfaces/summary-fields/summary-fields';
import type { SummaryFieldsExecutionEnvironment } from '../../../../interfaces/summary-fields/summary-fields';

type Resources = JobTemplate | WorkflowJobTemplate;
type PreviewValues = Resources & {
  credentials?: SummaryFieldCredential[] | [];
  diff_mode?: boolean;
  execution_environment?: SummaryFieldsExecutionEnvironment;
  extra_vars?: string;
  forks?: number;
  instance_groups?: { id: number; name: string }[];
  inventory?: { id: number; name: string };
  job_slice_count?: number;
  job_tags?: { name: string }[];
  job_type?: string;
  labels?: { id: number; name: string }[];
  limit?: string;
  scm_branch?: string;
  skip_tags?: { name: string }[];
  timeout?: number;
  verbosity?: number;
};

export function TemplatePreview({ data: template }: { data: Resources }) {
  const { t } = useTranslation();
  const { state } = usePageWizard();
  const {
    credentials,
    diff_mode,
    execution_environment,
    extra_vars,
    forks,
    instance_groups,
    inventory,
    job_slice_count,
    job_tags,
    job_type,
    labels,
    limit,
    scm_branch,
    skip_tags,
    timeout,
    verbosity,
  } = state as PreviewValues;
  console.log({ skip_tags, job_tags, labels });

  const verbosityString = useVerbosityString(verbosity);
  if (!template) return <LoadingPage breadcrumbs tabs />;

  return (
    <PageDetails>
      <PageDetail label={t('Name')}>{template.name}</PageDetail>
      <PageDetail label={t('Job type')}>{job_type}</PageDetail>
      <PageDetail label={t('Organization')} isEmpty={!template.summary_fields.organization}>
        <Link
          to={RouteObj.OrganizationDetails.replace(
            ':id',
            template.summary_fields?.organization?.id?.toString() ?? ''
          )}
        >
          {template.summary_fields?.organization?.name}
        </Link>
      </PageDetail>
      <PageDetail label={t`Inventory`} isEmpty={!inventory?.id}>
        <Link to={RouteObj.ProjectDetails.replace(':id', inventory?.id?.toString() ?? '')}>
          {inventory?.name}
        </Link>
      </PageDetail>
      <PageDetail label={t`Project`} isEmpty={!template.summary_fields.project}>
        <Link
          to={RouteObj.ProjectDetails.replace(
            ':id',
            template.summary_fields.project?.id.toString() ?? ''
          )}
        >
          {template.summary_fields.project?.name}
        </Link>
      </PageDetail>
      <PageDetail
        label={t`Execution environment`}
        isEmpty={
          Object.keys(execution_environment as SummaryFieldsExecutionEnvironment).length === 0
        }
      >
        <Link
          to={RouteObj.ExecutionEnvironmentDetails.replace(
            ':id',
            execution_environment?.id?.toString() ?? ''
          )}
        >
          {execution_environment?.name}
        </Link>
      </PageDetail>
      <PageDetail label={t('Source control branch')}>{scm_branch}</PageDetail>
      <PageDetail label={t('Playbook')}>{template?.playbook}</PageDetail>
      <PageDetail label={t('Credentials')} isEmpty={credentials?.length === 0}>
        <LabelGroup>
          {credentials?.map((credential) => (
            <CredentialDetail credential={credential} key={credential.id} />
          ))}
        </LabelGroup>
      </PageDetail>
      <PageDetail
        label={t`Instance groups`}
        helpText={t`The instance groups for this job template to run on.`}
        isEmpty={instance_groups?.length === 0}
      >
        <LabelGroup>
          {instance_groups?.map((ig) => (
            <Label color="blue" key={ig.id}>
              <Link to={RouteObj.InstanceGroupDetails.replace(':id', (ig.id ?? 0).toString())}>
                {ig.name}
              </Link>
            </Label>
          ))}
        </LabelGroup>
      </PageDetail>
      <PageDetail label={t('Forks')}>{forks || 0}</PageDetail>
      <PageDetail label={t('Limit')}>{limit}</PageDetail>
      <PageDetail label={t('Verbosity')}>{verbosityString}</PageDetail>
      <PageDetail label={t('Timeout')}>{timeout || 0}</PageDetail>
      <PageDetail label={t('Show changes')}>{diff_mode ? t`On` : t`Off`}</PageDetail>
      <PageDetail label={t('Job slicing')}>{job_slice_count}</PageDetail>
      <PageDetail label={t('Labels')} isEmpty={labels?.length === 0}>
        <LabelGroup>
          {labels?.map((label) => (
            <Label key={label.id}>{label.name}</Label>
          ))}
        </LabelGroup>
      </PageDetail>
      <PageDetail label={t('Job tags')} isEmpty={job_tags?.length === 0}>
        <LabelGroup>
          {job_tags?.map(({ name }) => (
            <Label key={name}>{name}</Label>
          ))}
        </LabelGroup>
      </PageDetail>
      <PageDetail label={t('Skip tags')} isEmpty={skip_tags?.length === 0}>
        <LabelGroup>
          {skip_tags?.map(({ name }) => (
            <Label key={name}>{name}</Label>
          ))}
        </LabelGroup>
      </PageDetail>
      <PageDetailCodeEditor label={t('Extra vars')} value={extra_vars as string} />
    </PageDetails>
  );
}

function CredentialDetail({ credential }: { credential: SummaryFieldCredential }) {
  const { data: credentialData } = useGetItem<Credential>(
    '/api/v2/credentials',
    credential.id.toString()
  );
  if (!credentialData) return null;
  return <CredentialLabel credential={credentialData} key={credential.id} />;
}
