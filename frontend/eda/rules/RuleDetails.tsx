import {
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  PageSection,
  Skeleton,
  Stack,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  PageDetail,
  PageDetails,
  PageHeader,
  PageLayout,
  PageTab,
  PageTabs,
} from '../../../framework';
import { useGet } from '../../common/useItem';
import { RouteObj } from '../../Routes';
import { EdaRule } from '../interfaces/EdaRule';
import { formatDateString } from '../../../framework/utils/formatDateString';
import React from 'react';
import { PageDetailsSection } from '../common/PageDetailsSection';
import { API_PREFIX } from '../constants';

export function RuleDetails() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const { data: rule } = useGet<EdaRule>(`${API_PREFIX}/rules/${params.id ?? ''}/`);
  const [copied, setCopied] = React.useState(false);

  const clipboardCopyFunc = (event: React.MouseEvent, text: { toString: () => string }) => {
    void navigator.clipboard.writeText(text.toString());
  };
  const onClick = (event: React.MouseEvent, text: { toString: () => string }) => {
    clipboardCopyFunc(event, text);
    setCopied(true);
  };

  const actions = (
    <React.Fragment>
      <CodeBlockAction>
        <ClipboardCopyButton
          id="basic-copy-button"
          textId="code-content"
          aria-label="Copy to clipboard"
          onClick={(e) => onClick(e, rule?.conditions || '')}
          exitDelay={copied ? 1500 : 600}
          maxWidth="110px"
          variant="plain"
          onTooltipHidden={() => setCopied(false)}
        >
          {copied ? 'Successfully copied to clipboard!' : 'Copy to clipboard'}
        </ClipboardCopyButton>
      </CodeBlockAction>
    </React.Fragment>
  );

  const renderRuleDetailsTab = (rule: EdaRule | undefined): JSX.Element => {
    return (
      <React.Fragment>
        <PageDetails>
          <PageDetail label={t('Name')}>{rule?.name || ''}</PageDetail>
          <PageDetail label={t('Description')}>{rule?.description || ''}</PageDetail>
          <PageDetail label={t('Rule set')}>{rule?.ruleset || ''}</PageDetail>
          <PageDetail label={t('Action type')}>
            {rule?.action ? Object.keys(rule?.action) : ''}
          </PageDetail>
          <PageDetail label={t('Project')}>{rule?.project?.name || ''}</PageDetail>
          <PageDetail label={t('Rule type')}>{rule?.type || ''}</PageDetail>
          <PageDetail label={t('Fire count')}>{rule?.fired_stats?.fire_count || 0}</PageDetail>
          <PageDetail label={t('Last fired date')}>
            {rule?.fired_stats?.fired_date ? formatDateString(rule?.fired_stats?.fired_date) : ''}
          </PageDetail>
          <PageDetail label={t('Created')}>
            {rule?.created_at ? formatDateString(rule.created_at) : ''}
          </PageDetail>
          <PageDetail label={t('Modified')}>
            {rule?.modified_at ? formatDateString(rule.modified_at) : ''}
          </PageDetail>
        </PageDetails>
        <PageDetailsSection>
          <PageDetail label={t('Conditions')}>
            <CodeBlock actions={actions}>
              <CodeBlockCode id="code-content">{rule?.conditions || ''} </CodeBlockCode>
            </CodeBlock>
          </PageDetail>
        </PageDetailsSection>
      </React.Fragment>
    );
  };

  return (
    <PageLayout>
      <PageHeader
        title={rule?.name}
        breadcrumbs={[{ label: t('Rules'), to: RouteObj.EdaRules }, { label: rule?.name }]}
      />
      {rule ? (
        <PageTabs>
          <PageTab label={t('Details')}>{renderRuleDetailsTab(rule)}</PageTab>
        </PageTabs>
      ) : (
        <PageTabs>
          <PageTab>
            <PageSection variant="light">
              <Stack hasGutter>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </Stack>
            </PageSection>
          </PageTab>
        </PageTabs>
      )}
    </PageLayout>
  );
}
