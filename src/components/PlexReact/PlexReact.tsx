import React, { FC } from 'react';
import { SettingsForm } from './SettingsForm/SettingsForm';
import { PlexReactTest } from './PlexReactTest/PlexReactTest'
import { PlexAuthProvider } from './PlexAuthProvider/PlexAuthProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Layout, LayoutNode } from '../Layout/Layout';
import { ResizableSplit } from '../Layout/ResizableSplit';
import { PlexReactConfigProvider } from './PlexReactConfigProvider/PlexReactConfigProvider';

const queryClient = new QueryClient();

const defaultLayout: LayoutNode[] = [{
  Component: ResizableSplit,
  id: "rootSplit",
  childNodes: [{
    Component: SettingsForm,
    id: "settingsForm"
  }, {
    Component: PlexReactTest,
    id: "plexReactTest"
  }]
}];

export const PlexReact: FC = () => {

  return (
    <QueryClientProvider client={queryClient}>
    <PlexAuthProvider>
    <PlexReactConfigProvider>
      <Layout layout={defaultLayout} />
    </PlexReactConfigProvider>
    </PlexAuthProvider>
    </QueryClientProvider>
  )
}
 