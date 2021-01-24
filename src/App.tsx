import React, { FC } from 'react';
import { ThemeProvider } from '@emotion/react'
import theme from '@rebass/preset'
import { SettingsForm } from './components/SettingsForm/SettingsForm';

const App: FC = (props) =>
  <ThemeProvider theme={theme}>
    <SettingsForm />
    {props.children}
  </ThemeProvider>

export default App;
