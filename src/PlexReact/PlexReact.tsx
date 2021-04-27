import React, { FC } from 'react';
import { SettingsForm } from './components/SettingsForm/SettingsForm';
import { PlexReactTest } from './components/PlexReactTest/PlexReactTest'
import { PlexAuthProvider } from './context/PlexAuthProvider/PlexAuthProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { PlexReactConfigProvider } from './context/PlexReactConfigProvider/PlexReactConfigProvider';
import { Navbar } from './components/Navbar/Navbar';
import { Layout } from '../Layout/Layout';
import { LayoutNode, SimpleProps } from '../Layout/services/tree';
import { ResizableSplit, SplitDirection } from '../Layout/components/ResizableSplit';
import { LayoutComponent } from '../Layout/services/layoutComponent.enum';
import { EditLayoutProvider } from '../Layout/context/EditLayoutProvider';
import { registerComponent } from '../Layout/services/layoutRegistry';
import { PlexMusicLibraryGrid } from './components/PlexMusicLibraryGrid/PlexMusicLibraryGrid';

const queryClient = new QueryClient();

export enum PlexComponent {
  SettingsForm = "SettingsForm",
  PlexReactTest = "PlexReactTest",
  MusicLibrary = "MusicLibrary",
}

registerComponent(SettingsForm, PlexComponent.SettingsForm);
registerComponent(PlexReactTest, PlexComponent.PlexReactTest);
registerComponent(PlexMusicLibraryGrid, PlexComponent.MusicLibrary);

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
    componentName: PlexComponent.MusicLibrary,
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
 