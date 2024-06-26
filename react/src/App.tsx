import AnnouncementAlert from './components/AnnouncementAlert';
import BAIErrorBoundary, { ErrorView } from './components/BAIErrorBoundary';
import {
  DefaultProvidersForReactRoot,
  RoutingEventHandler,
} from './components/DefaultProviders';
import Flex from './components/Flex';
import MainLayout from './components/MainLayout/MainLayout';
import { useSuspendedBackendaiClient, useWebUINavigate } from './hooks';
import Page401 from './pages/Page401';
import Page404 from './pages/Page404';
import { theme } from 'antd';
import React from 'react';
import { FC } from 'react';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

const Information = React.lazy(() => import('./components/Information'));
const ServingListPage = React.lazy(() => import('./pages/ServingListPage'));
const EnvironmentPage = React.lazy(() => import('./pages/EnvironmentPage'));
const MyEnvironmentPage = React.lazy(() => import('./pages/MyEnvironmentPage'));
const StorageHostSettingPage = React.lazy(
  () => import('./pages/StorageHostSettingPage'),
);
const RoutingListPage = React.lazy(() => import('./pages/RoutingListPage'));
const UserSettingsPage = React.lazy(() => import('./pages/UserSettingsPage'));
const SessionListPage = React.lazy(() => import('./pages/SessionListPage'));
const SessionLauncherPage = React.lazy(
  () => import('./pages/SessionLauncherPage'),
);
const NeoSessionLauncherSwitchAlert = React.lazy(
  () => import('./components/NeoSessionLauncherSwitchAlert'),
);

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorView />,
    element: (
      <QueryParamProvider
        adapter={ReactRouter6Adapter}
        options={
          {
            // searchStringToObject: queryString.parse,
            // objectToSearchString: queryString.stringify,
          }
        }
      >
        <MainLayout />
        <RoutingEventHandler />
      </QueryParamProvider>
    ),
    handle: { labelKey: 'webui.menu.Summary' },
    children: [
      {
        path: '/',
        element: <Navigate to="/summary" replace />,
      },
      {
        //for electron dev mode
        path: '/build/electron-app/app/index.html',
        element: <Navigate to="/summary" replace />,
      },
      {
        //for electron prod mode
        path: '/app/index.html',
        element: <Navigate to="/summary" replace />,
      },
      {
        path: '/summary',
        Component: () => {
          const { token } = theme.useToken();
          return (
            <AnnouncementAlert
              showIcon
              icon={undefined}
              banner={false}
              style={{ marginBottom: token.paddingContentVerticalLG }}
              closable
            />
          );
        },
        handle: { labelKey: 'webui.menu.Summary' },
      },
      {
        path: '/job',
        handle: { labelKey: 'webui.menu.Sessions' },
        Component: () => {
          const { token } = theme.useToken();
          useSuspendedBackendaiClient(); // make sure the client is ready
          return (
            <NeoSessionLauncherSwitchAlert
              style={{ marginBottom: token.paddingContentVerticalLG }}
            />
          );
        },
      },
      {
        path: '/serving',
        element: (
          <BAIErrorBoundary>
            <ServingListPage />
          </BAIErrorBoundary>
        ),
        handle: { labelKey: 'webui.menu.Serving' },
      },
      {
        path: '/serving/:serviceId',
        element: (
          <BAIErrorBoundary>
            <RoutingListPage />
          </BAIErrorBoundary>
        ),
        handle: { labelKey: 'modelService.RoutingInfo' },
      },
      {
        path: '/import',
        handle: { labelKey: 'webui.menu.Import&Run' },
      },
      {
        path: '/data',
        handle: { labelKey: 'webui.menu.Data&Storage' },
      },
      {
        path: '/my-environment',
        element: (
          <BAIErrorBoundary>
            <MyEnvironmentPage />
          </BAIErrorBoundary>
        ),
        handle: { labelKey: 'webui.menu.MyEnvironments' },
      },
      {
        path: '/agent-summary',
        handle: { labelKey: 'webui.menu.AgentSummary' },
      },
      {
        path: '/statistics',
        handle: { labelKey: 'webui.menu.Statistics' },
      },
      {
        path: '/environment',
        handle: { labelKey: 'webui.menu.Environments' },
        Component: EnvironmentPage,
      },
      {
        path: '/agent',
        handle: { labelKey: 'webui.menu.ComputationResources' },
      },
      {
        path: '/settings',
        handle: { labelKey: 'webui.menu.Configurations' },
      },
      {
        path: '/maintenance',
        handle: { labelKey: 'webui.menu.Environments&Presets' },
      },
      {
        path: '/storage-settings/:hostname',
        handle: { labelKey: 'storageHost.StorageSetting' },
        Component: StorageHostSettingPage,
      },
      {
        path: '/information',
        handle: { labelKey: 'webui.menu.Information' },
        Component: Information,
      },
      {
        path: '/usersettings',
        handle: { labelKey: 'webui.menu.Settings&Logs' },
        Component: UserSettingsPage,
      },
      {
        path: '/credential',
        handle: { labelKey: 'webui.menu.UserCredentials&Policies' },
      },
      {
        path: '/logs',
        handle: { labelKey: 'webui.menu.Logs' },
      },
      {
        path: '/error',
        Component: Page404,
      },
      {
        path: '/unauthorized',
        handle: { labelKey: 'webui.UNAUTHORIZEDACCESS' },
        Component: Page401,
      },
      {
        path: '/session',
        handle: { labelKey: 'webui.menu.Sessions' },
        Component: SessionListPage,
      },
      {
        path: '/session/start',
        handle: { labelKey: 'session.launcher.StartNewSession' },
        Component: () => {
          const webuiNavigate = useWebUINavigate();
          const { token } = theme.useToken();
          return (
            <Flex
              direction="column"
              gap={token.paddingContentVerticalLG}
              align="stretch"
              style={{ paddingBottom: token.paddingContentVerticalLG }}
            >
              <NeoSessionLauncherSwitchAlert
                onChange={(value) => {
                  if (value === 'current') {
                    webuiNavigate('/job');
                  }
                }}
              />
              <SessionLauncherPage />
            </Flex>
          );
        },
      },
      // Leave empty tag for plugin pages.
      {
        path: '*',
        element: <></>,
      },
    ],
  },
]);

const App: FC = () => {
  return (
    <RecoilRoot>
      <DefaultProvidersForReactRoot>
        <RouterProvider router={router} />
      </DefaultProvidersForReactRoot>
    </RecoilRoot>
  );
};

export default App;
