import React, { FC } from 'react';
import { SettingsForm } from './SettingsForm/SettingsForm';
import { PlexReactTest } from './PlexReactTest/PlexReactTest'
import { PlexAuthProvider } from './PlexAuthProvider/PlexAuthProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Layout, LayoutNode, SimpleProps } from '../Layout/Layout';
import { ResizableSplit, SplitDirection } from '../Layout/ResizableSplit';
import { PlexReactConfigProvider } from './PlexReactConfigProvider/PlexReactConfigProvider';
import { registerComponent } from '../Layout/layoutRegistry';
import { Navbar } from './Navbar/Navbar';
import { EditLayoutProvider, LayoutComponent } from '../Layout/EditLayoutProvider';

const queryClient = new QueryClient();

export enum PlexComponent {
  SettingsForm = "SettingsForm",
  PlexReactTest = "PlexReactTest",
}

registerComponent(SettingsForm, PlexComponent.SettingsForm);
registerComponent(PlexReactTest, PlexComponent.PlexReactTest);

const defaultLayout: LayoutNode[] = [{
  componentName: LayoutComponent.ResizableSplit,
  componentProps: {
    splitDirection: SplitDirection.Vertical,
  } as SimpleProps<typeof ResizableSplit>,
  id: "rootSplit",
  childNodes: [{
    componentName: PlexComponent.SettingsForm,
    id: "settingsForm"
  }, {
    componentName: PlexComponent.PlexReactTest,
    id: "plexReactTest"
  }]
}];

export const PlexReact: FC = () => {

  return (
    <QueryClientProvider client={queryClient}>
    <PlexAuthProvider>
    <PlexReactConfigProvider>
    <EditLayoutProvider initialLayout={defaultLayout}>
      <Navbar />
      <Layout />
    </EditLayoutProvider>
    </PlexReactConfigProvider>
    </PlexAuthProvider>
    </QueryClientProvider>
  )
}
 