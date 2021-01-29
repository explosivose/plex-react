import { AxiosError } from 'axios';
import React, { FC } from 'react';
import { Box, Code, Container, Divider, Heading, Stack } from '@chakra-ui/react';

interface Props {
  error: AxiosError;
}

export const AxiosErrorViewer: FC<Props> = ({error}) => {
  console.log(JSON.stringify(error.response, undefined, 2));
  return (
    <Box>
      <Stack>
        <Heading colorScheme='red'>
          {error.name}
        </Heading>
        <Code colorScheme='red'>
          {error.message}
        </Code>
        {error.response && (
          <Container>
            <Heading>
              {error.response.status} {error.response.statusText}
            </Heading>
            <Code overflowY='auto' colorScheme='yellow' whiteSpace='break-spaces' h={200}>
              Response: {JSON.stringify(error.response, undefined, 2)}
            </Code>
          </Container>
        )}
        <Code overflowY='auto' colorScheme='red' whiteSpace='break-spaces' h={200} w={600}>
          Stack: {error.stack}
        </Code>
      </Stack>
    </Box>
  )
}
