import  React, { FC } from 'react';
import { Box, Code, Heading, Stack } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';

interface Props {
  data: AxiosResponse;
}

export const AxiosResponseViewer: FC<Props> = ({data}) => {
  return (
    <Box>
      <Stack>
        <Heading>
          {data.status}:{data.statusText}
        </Heading>
        <Code overflowY='auto'>
          {JSON.stringify(data.data, undefined, 2)}
        </Code>
      </Stack>
    </Box>
  )
}