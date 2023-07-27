import type { Launch } from '../../../interfaces/Launch';

export default function canLaunchWithoutPrompt(launchData: Launch) {
  return (
    launchData.can_start_without_user_input &&
    !launchData.ask_credential_on_launch &&
    !launchData.ask_diff_mode_on_launch &&
    !launchData.ask_execution_environment_on_launch &&
    !launchData.ask_forks_on_launch &&
    !launchData.ask_instance_groups_on_launch &&
    !launchData.ask_inventory_on_launch &&
    !launchData.ask_job_slice_count_on_launch &&
    !launchData.ask_job_type_on_launch &&
    !launchData.ask_labels_on_launch &&
    !launchData.ask_limit_on_launch &&
    !launchData.ask_scm_branch_on_launch &&
    !launchData.ask_skip_tags_on_launch &&
    !launchData.ask_tags_on_launch &&
    !launchData.ask_timeout_on_launch &&
    !launchData.ask_variables_on_launch &&
    !launchData.ask_verbosity_on_launch &&
    !launchData.survey_enabled &&
    (!launchData.passwords_needed_to_start || launchData.passwords_needed_to_start.length === 0) &&
    (!launchData.variables_needed_to_start || launchData.variables_needed_to_start.length === 0)
  );
}
