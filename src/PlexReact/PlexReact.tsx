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
import { SelectionContextProvider } from './context/SelectionProvider/SelectionProvider';
import { SelectionViewer } from './components/SelectionViewer/SelectionViewer';

const queryClient = new QueryClient();

export enum PlexComponent {
  SettingsForm = "SettingsForm",
  PlexReactTest = "PlexReactTest",
  MusicLibraryGrid = "MusicLibraryGrid",
  SelectionViewer = "SelectionViewer",
}

registerComponent(SettingsForm, PlexComponent.SettingsForm);
registerComponent(PlexReactTest, PlexComponent.PlexReactTest);
registerComponent(PlexMusicLibraryGrid, PlexComponent.MusicLibraryGrid);
registerComponent(SelectionViewer, PlexComponent.SelectionViewer)

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
    componentName: PlexComponent.MusicLibraryGrid,
    id: "plexReactTest"
  }]
}];

export const PlexReact: FC = () => {

  return (
    <QueryClientProvider client={queryClient}>
    <PlexAuthProvider>
    <PlexReactConfigProvider>
    <SelectionContextProvider>
    <EditLayoutProvider initialLayout={defaultLayout}>
      <Navbar />
      <Layout />
    </EditLayoutProvider>
    </SelectionContextProvider>
    </PlexReactConfigProvider>
    </PlexAuthProvider>
    </QueryClientProvider>
  )
}
 