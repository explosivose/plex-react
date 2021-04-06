import React, { FC, useState } from 'react';
import { SettingsForm } from './SettingsForm/SettingsForm';
import { PlexReactTest } from './PlexReactTest/PlexReactTest'
import { PlexAuthProvider } from './PlexAuthProvider/PlexAuthProvider';

export const PlexReact: FC = () => {

  const [plexUrl, setPlexUrl] = useState<string>();
  const [plexUsername, setPlexUsername] = useState<string>();
  const [plexPassword, setPlexPassword] = useState<string>();

  return (
    <PlexAuthProvider>
      <div>
        <SettingsForm
          plexUrl={plexUrl}
          plexPassword={plexPassword}
          plexUsername={plexUsername}
          setPlexUrl={setPlexUrl}
          setPlexPassword={setPlexPassword}
          setPlexUsername={setPlexUsername}
        />
        {plexUrl !== undefined && (
          <PlexReactTest
            plexUrl={plexUrl}
          />
        )}
      </div>
    </PlexAuthProvider>
  )
}