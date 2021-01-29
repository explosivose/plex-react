import React, { FC, useState } from 'react';
import { SettingsForm } from './SettingsForm/SettingsForm';
import { PlexReactTest } from './PlexReactTest/PlexReactTest'

export const PlexReact: FC = () => {

  const [plexUrl, setPlexUrl] = useState<string>();

  return (
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
  )
}