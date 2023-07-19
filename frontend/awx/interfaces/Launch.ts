import type { SummaryFieldCredential } from './summary-fields/summary-fields';
import type { SummaryFieldsExecutionEnvironment } from './summary-fields/summary-fields';
export interface Launch {
  ask_inventory_on_launch: boolean;
  ask_limit_on_launch: boolean;
  ask_scm_branch_on_launch: boolean;
  can_start_without_user_input: boolean;
  defaults: {
    credentials: SummaryFieldCredential[];
    diff_mode: boolean;
    execution_environment: SummaryFieldsExecutionEnvironment;
    extra_vars: string;
    instance_groups: {
      id: number;
      name: string;
    };
    inventory: {
      id: number;
      name: string;
    };
    job_slice_count: number;
    job_tags: string;
    job_type: 'run' | 'check';
    labels: {
      count: number;
      results: {
        id: number;
        name: string;
      }[];
    };
    limit: number;
    scm_branch: string;
    skip_tags: string;
    timeout: number;
    verbosity: number;
  };
  survey_enabled: boolean;
  variables_needed_to_start: string[];
  node_templates_missing: number[];
  node_prompts_rejected: number[];
  workflow_job_template_data: {
    name: string;
    id: number;
    description: string;
  };
  credential_passwords: { [key: string]: string | number | boolean | undefined };
  ask_variables_on_launch: boolean;
  ask_labels_on_launch: boolean;
  ask_skip_tags_on_launch: boolean;
  ask_tags_on_launch: boolean;
  ask_execution_environment_on_launch: boolean;
  ask_forks_on_launch: boolean;
  ask_job_slice_count_on_launch: boolean;
  ask_timeout_on_launch: boolean;
  ask_instance_groups_on_launch: boolean;
  passwords_needed_to_start: string[];
  [index: string]:
    | string
    | number
    | boolean
    | string[]
    | object
    | { [key: string]: string | number | boolean }
    | undefined;
}
