import  React, { FC } from 'react';
import { Box, Code, Stack } from '@chakra-ui/react';

interface Props<T = unknown> {
  data: T;
}

export const ResponseViewer: FC<Props> = ({data}) => {
  return (
    <Box>
      <Stack>
        <Code overflowY='auto' whiteSpace='pre-wrap'>
          {JSON.stringify(data, undefined, 2)}
        </Code>
      </Stack>
    </Box>
  )
}