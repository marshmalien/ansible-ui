import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Label, LabelGroup } from '@patternfly/react-core';
import { RouteObj } from '../../../../Routes';
import { PageDetail, PageDetails } from '../../../../../framework';
import { PageDetailCodeEditor } from '../../../../../framework/PageDetails/PageDetailCodeEditor';
import { CredentialLabel } from '../../../common/CredentialLabel';
import { useGetItem } from '../../../../common/crud/useGetItem';
import { useVerbosityString } from '../../../common/useVerbosityString';
import type { Credential } from '../../../interfaces/Credential';
import type { JobTemplate } from '../../../interfaces/JobTemplate';
import type { TemplateLaunchProps } from './TemplateLaunchWizard';

export function TemplateLaunchReviewStep(props: {
  values: TemplateLaunchProps;
  template: JobTemplate;
}) {
  const { values, template } = props;
  const { t } = useTranslation();
  const { inventory } = values['inventory-step'];
  const { credentials } = values['credentials-step'];
  const { instance_groups } = values['instance-groups-step'];
  const { execution_environment } = values['execution-environment-step'];
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
  } = values['other-prompts-step'];
  const verbosityString = useVerbosityString(verbosity);

  return (
    <PageDetails numberOfColumns="single">
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
      {template.type === 'job_template' && (
        <PageDetail label={t`Project`} isEmpty={!template.summary_fields.project}>
          <Link
            to={RouteObj.ProjectDetails.replace(
              ':id',
              template.summary_fields?.project?.id.toString() ?? ''
            )}
          >
            {template.summary_fields.project?.name}
          </Link>
        </PageDetail>
      )}
      <PageDetail
        label={t`Execution environment`}
        isEmpty={Object.keys(execution_environment).length === 0}
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
      {template.type === 'job_template' && (
        <PageDetail label={t('Playbook')}>{template?.playbook}</PageDetail>
      )}
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
      <PageDetailCodeEditor label={t('Extra vars')} value={extra_vars} />
    </PageDetails>
  );
}

function CredentialDetail({ credential }: { credential: Credential }) {
  const { data: credentialData } = useGetItem<Credential>(
    '/api/v2/credentials',
    credential.id.toString()
  );
  if (!credentialData) return null;
  return <CredentialLabel credential={credentialData} key={credential.id} />;
}
