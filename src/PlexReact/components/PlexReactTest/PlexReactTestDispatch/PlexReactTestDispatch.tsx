import { Box, Spinner } from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { FC } from "react";
import { useQuery } from "react-query";
import { plexQueryFn, PlexRequestOptions } from "../../../services/plex-api";
import { AxiosErrorViewer } from "../AxiosErrorViewer/AxiosErrorViewer";
import { ResponseViewer } from "../ResponseViewer/ResponseViewer";

interface Props {
  authToken: string;
  apiUrl: string;
  endpoint: string;
}

export const PlexReactTestDispatch: FC <Props> = ({
  authToken,
  apiUrl,
  endpoint,
}) => {
  const {
    data,
    isLoading, 
    isError,
    error
  } = useQuery<unknown, unknown, unknown, [string, PlexRequestOptions]>(['testDispatch', {
    authToken,
    apiUrl,
    endpoint,
  }], plexQueryFn);

  return (
    <Box>
      {isLoading 
        ? <Spinner />
        : isError
          ? <Box>
            <AxiosErrorViewer error={error as AxiosError} />
          </Box>
          : <Box>
            {data !== undefined ? <ResponseViewer data={data} /> : null}
          </Box>}
    </Box>
  );
}
