import { AxiosError } from 'axios';
import React, { FC } from 'react';
import { Box, Code, Container, Heading, Stack } from '@chakra-ui/react';

interface Props {
  error: AxiosError;
}

export const AxiosErrorViewer: FC<Props> = ({error}) => {
  return (
    <Box>
      <Stack>
        <Container>
          <Code colorScheme='red'>
            {error.name}: {error.message}
          </Code>
        </Container>
        {error.response && (
          <Container>
            <Heading>
              {error.response.status} {error.response.statusText}
            </Heading>
            <Code overflowY='auto' colorScheme='yellow' whiteSpace='break-spaces' h={200} w={600}>
              Response: {JSON.stringify(error.response, undefined, 2)}
            </Code>
          </Container>
        )}
        <Container>
          <Code overflowY='auto' colorScheme='red' whiteSpace='break-spaces' h={200} w={600}>
            Stack: {error.stack}
          </Code>
        </Container>
      </Stack>
    </Box>
  )
}
