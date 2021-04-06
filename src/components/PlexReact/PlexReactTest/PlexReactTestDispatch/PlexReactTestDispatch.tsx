import { Box, Spinner } from "@chakra-ui/react";
import { AxiosError, AxiosResponse } from "axios";
import React, { FC } from "react";
import { useQuery } from "react-query";
import { plexQueryFn, PlexRequestOptions } from "../../../../services/plex-api";
import { AxiosErrorViewer } from "../AxiosErrorViewer/AxiosErrorViewer";
import { AxiosResponseViewer } from "../AxiosResponseViewer/AxiosResponseViewer";

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
  const { data, isLoading, isError, error } = useQuery<AxiosResponse, unknown, AxiosResponse, [string, PlexRequestOptions]>(['testDispatch', {
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
            {data && <AxiosResponseViewer data={data} />}
          </Box>}
    </Box>
  );
}
