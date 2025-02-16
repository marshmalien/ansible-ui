import { Bullseye, Spinner } from '@patternfly/react-core';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AutomationServers } from '../automation-servers/AutomationServers';
import Debug from '../common/Debug';
import { RouteObj, useRoutesWithoutPrefix } from '../Routes';
import { CreateOrganization, EditOrganization } from './access/organizations/OrganizationForm';
import { OrganizationPage } from './access/organizations/OrganizationPage/OrganizationPage';
import { Organizations } from './access/organizations/Organizations';
import { AddRolesToTeam } from './access/teams/components/AddRolesToTeam';
import { CreateTeam, EditTeam } from './access/teams/TeamForm';
import { TeamPage } from './access/teams/TeamPage/TeamPage';
import { Teams } from './access/teams/Teams';
import { AddRolesToUser } from './access/users/components/AddRolesToUser';
import { CreateUser, EditUser } from './access/users/UserForm';
import { UserPage } from './access/users/UserPage/UserPage';
import { Users } from './access/users/Users';
import { ExecutionEnvironments } from './administration/execution-environments/ExecutionEnvironments';
import { InstanceGroups } from './administration/instance-groups/InstanceGroups';
import { EditInstance } from './administration/instances/EditInstance';
import { InstanceDetails } from './administration/instances/InstanceDetails';
import { Instances } from './administration/instances/Instances';
import Dashboard from './dashboard/Dashboard';
import { Credentials } from './resources/credentials/Credentials';
import { Hosts } from './resources/hosts/Hosts';
import { Inventories } from './resources/inventories/Inventories';
import { Projects } from './resources/projects/Projects';
import { ProjectPage } from './resources/projects/ProjectPage/ProjectPage';
import { TemplateDetail } from './resources/templates/TemplateDetail';
import { CreateJobTemplate } from './resources/templates/TemplateForm';
import { Templates } from './resources/templates/Templates';
import Settings from './settings/Settings';
import Jobs from './views/jobs/Jobs';
import { WorkflowJobTemplateDetail } from './resources/templates/WorkflowJobTemplateDetail';

export function AwxRouter() {
  const RouteObjWithoutPrefix = useRoutesWithoutPrefix(RouteObj.AWX);

  return (
    <Suspense
      fallback={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
    >
      <Routes>
        <Route path={RouteObjWithoutPrefix.AwxAutomationServers} element={<AutomationServers />} />
        <Route path={RouteObjWithoutPrefix.Dashboard} element={<Dashboard />} />
        <Route path={RouteObjWithoutPrefix.Jobs} element={<Jobs />} />
        {/* <Route path={RouteObjWithoutPrefix.Schedules} element={<Schedules />} /> */}
        {/* <Route path={RouteObjWithoutPrefix.ActivityStream} element={<ActivityStreeam />} /> */}
        {/* <Route path={RouteObjWithoutPrefix.WorkflowApprovals} element={<WorkflowApprovals />} /> */}

        <Route path={RouteObjWithoutPrefix.Templates} element={<Templates />} />
        <Route path={RouteObjWithoutPrefix.JobTemplateDetails} element={<TemplateDetail />} />
        <Route
          path={RouteObjWithoutPrefix.WorkflowJobTemplateDetails}
          element={<WorkflowJobTemplateDetail />}
        />
        <Route path={RouteObjWithoutPrefix.CreateJobTemplate} element={<CreateJobTemplate />} />

        <Route path={RouteObjWithoutPrefix.Credentials} element={<Credentials />} />

        <Route path={RouteObjWithoutPrefix.Projects} element={<Projects />} />
        <Route path={RouteObjWithoutPrefix.ProjectDetails} element={<ProjectPage />} />
        {/* <Route path={RouteObjWithoutPrefix.ProjectEdit} element={<ProjectEdit />} /> */}

        <Route path={RouteObjWithoutPrefix.Inventories} element={<Inventories />} />

        <Route path={RouteObjWithoutPrefix.Hosts} element={<Hosts />} />

        <Route path={RouteObjWithoutPrefix.Organizations} element={<Organizations />} />
        <Route path={RouteObjWithoutPrefix.OrganizationDetails} element={<OrganizationPage />} />
        <Route path={RouteObjWithoutPrefix.CreateOrganization} element={<CreateOrganization />} />
        <Route path={RouteObjWithoutPrefix.EditOrganization} element={<EditOrganization />} />

        <Route path={RouteObjWithoutPrefix.Users} element={<Users />} />
        <Route path={RouteObjWithoutPrefix.UserDetails} element={<UserPage />} />
        <Route path={RouteObjWithoutPrefix.CreateUser} element={<CreateUser />} />
        <Route path={RouteObjWithoutPrefix.EditUser} element={<EditUser />} />
        <Route path={RouteObjWithoutPrefix.AddRolesToUser} element={<AddRolesToUser />} />

        <Route path={RouteObjWithoutPrefix.Teams} element={<Teams />} />
        <Route path={RouteObjWithoutPrefix.TeamDetails} element={<TeamPage />} />
        <Route path={RouteObjWithoutPrefix.CreateTeam} element={<CreateTeam />} />
        <Route path={RouteObjWithoutPrefix.EditTeam} element={<EditTeam />} />
        <Route path={RouteObjWithoutPrefix.AddRolesToTeam} element={<AddRolesToTeam />} />

        {/* <Route path={RouteObjWithoutPrefix.CredentialTypes} element={<CredentialTypes />} /> */}
        {/* <Route path={RouteObjWithoutPrefix.Notifications} element={<Notifications />} /> */}
        {/* <Route path={RouteObjWithoutPrefix.ManagementJobs} element={<ManagementJobs />} /> */}

        <Route path={RouteObjWithoutPrefix.InstanceGroups} element={<InstanceGroups />} />

        <Route path={RouteObjWithoutPrefix.Instances} element={<Instances />} />
        <Route path={RouteObjWithoutPrefix.InstanceDetails} element={<InstanceDetails />} />
        <Route path={RouteObjWithoutPrefix.EditInstance} element={<EditInstance />} />

        {/* <Route path={RouteObjWithoutPrefix.Applications} element={<Applications />} /> */}
        <Route
          path={RouteObjWithoutPrefix.ExecutionEnvironments}
          element={<ExecutionEnvironments />}
        />

        <Route path={RouteObjWithoutPrefix.Settings} element={<Settings />} />

        <Route path={RouteObjWithoutPrefix.AwxDebug} element={<Debug />} />
      </Routes>
    </Suspense>
  );
}
