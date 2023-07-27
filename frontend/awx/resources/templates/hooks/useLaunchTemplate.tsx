import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getJobOutputUrl } from '../../../views/jobs/jobUtils';
import { RouteObj } from '../../../../Routes';
import { postRequest, requestGet } from '../../../../common/crud/Data';
import { usePageAlertToaster } from '../../../../../framework';
import { launchWithParams } from '../../../common/util/launchHandlers';
import canLaunchWithoutPrompt from './canLaunchWithoutPrompt';
import type { Launch } from '../../../interfaces/Launch';
import type { UnifiedJob } from '../../../interfaces/UnifiedJob';
import type { Job } from '../../../interfaces/Job';
import type { JobTemplate } from '../../../interfaces/JobTemplate';
import type { WorkflowJobTemplate } from '../../../interfaces/WorkflowJobTemplate';

type UnifiedJobTemplate = JobTemplate | WorkflowJobTemplate;

function getPromptOnLaunchRoute(template: UnifiedJobTemplate) {
  if (template.type === 'job_template') {
    return RouteObj.JobTemplatePrompt.replace(':id', template.id.toString());
  } else if (template.type === 'workflow_job_template') {
    return RouteObj.WorkflowJobTemplatePrompt.replace(':id', template.id.toString());
  } else {
    return '';
  }
}

function getLaunchConfigUrl(template: UnifiedJobTemplate) {
  if (template.type === 'job_template') {
    return `/api/v2/job_templates/${template.id}/launch/`;
  } else if (template.type === 'workflow_job_template') {
    return `/api/v2/workflow_job_templates/${template.id}/launch/`;
  }
}

export function useLaunchTemplate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const alertToaster = usePageAlertToaster();

  return async (template: UnifiedJobTemplate) => {
    const launchConfigUrl = getLaunchConfigUrl(template);

    if (!launchConfigUrl) {
      return Promise.reject(new Error('Unable to retrieve launch configuration'));
    }

    try {
      const launchConfig = await requestGet<Launch>(launchConfigUrl);

      let launchRoute;
      if (canLaunchWithoutPrompt(launchConfig)) {
        const job = await launchWithParams(template.type, template.id, {} as Launch);
        launchRoute = getJobOutputUrl(job as UnifiedJob);
      } else {
        launchRoute = getPromptOnLaunchRoute(template);
      }

      navigate(launchRoute);
    } catch (error) {
      alertToaster.addAlert({
        variant: 'danger',
        title: t('Failed to launch template'),
        children: error instanceof Error && error.message,
      });
    }
  };
}
