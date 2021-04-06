import React, { FC, useState } from 'react';
import { SettingsForm } from './SettingsForm/SettingsForm';
import { PlexReactTest } from './PlexReactTest/PlexReactTest'
import { PlexAuthProvider } from './PlexAuthProvider/PlexAuthProvider';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export const PlexReact: FC = () => {

  const [plexUrl, setPlexUrl] = useState<string>('');

  return (
    <QueryClientProvider client={queryClient}>
      <PlexAuthProvider>
        <div>
          <SettingsForm
            plexUrl={plexUrl}
            setPlexUrl={setPlexUrl}
          />
          {plexUrl !== undefined && (
            <PlexReactTest
              plexUrl={plexUrl}
            />
          )}
        </div>
      </PlexAuthProvider>
    </QueryClientProvider>
  )
}