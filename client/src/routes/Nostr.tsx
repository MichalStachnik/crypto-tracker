import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Relay, relayInit } from 'nostr-tools';

const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('en-us', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

const Nostr = () => {
  const [relays, setRelays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectedRelay, setConnectedRelay] = useState<Relay | null>(null);
  const [events, setEvents] = useState<any>(null);

  useEffect(() => {
    fetch('https://api.nostr.watch/v1/online')
      .then((res) => res.json())
      .then((res) => {
        setRelays(res);
        handleRelayConnect(res[0]);
      })
      .catch((err) => console.error('Error', err));
  }, []);

  const handleRelayConnect = async (selectedRelay: string) => {
    const relay = relayInit(selectedRelay);
    await relay.connect();

    relay.on('connect', () => {
      setConnectedRelay(relay);
      getEvents(relay);
    });

    relay.on('error', () => {
      console.error('error');
    });
  };

  const getEvents = async (relay: Relay) => {
    setIsLoading(true);
    const events = await relay.list([{ kinds: [0, 1] }]);
    setEvents(events);
    setIsLoading(false);
  };

  return (
    <Box display="flex" width="80%" margin="0 auto" gap="20px">
      <Box width="40%">
        {connectedRelay ? (
          <Box>Connected to {connectedRelay.url}</Box>
        ) : (
          <Box>Not connected</Box>
        )}
        <Typography>Available Relays</Typography>
        {relays.map((relay) => {
          return (
            <Button
              key={relay}
              fullWidth
              variant="outlined"
              onClick={() => handleRelayConnect(relay)}
              sx={{
                textTransform: 'none',
                marginBottom: 1,
                borderColor: (theme) => theme.palette.info.dark,
              }}
            >
              {relay}
            </Button>
          );
        })}
      </Box>
      <Box width="60%">
        {isLoading ? (
          <Box display="flex" justifyContent="center" flex={1}>
            <Typography mt={1} mr={1}>
              Fetching events...
            </Typography>
            <CircularProgress />
          </Box>
        ) : null}
        {events ? (
          <>
            <Typography>Latest Events</Typography>
            <Button
              variant="outlined"
              onClick={() => connectedRelay && getEvents(connectedRelay)}
              sx={{ margin: 1 }}
              disabled={isLoading}
            >
              Refetch
            </Button>
            {events.map((event: any) => {
              console.log('the event', event);
              // console.log(JSON.parse(event.content));
              const json = isJson(event.content);
              const { created_at, pubkey } = event;
              if (json) {
                console.log(event.content);
                const { name, picture, about } = JSON.parse(event.content);
                return (
                  <Box
                    key={event.id}
                    display="flex"
                    flexDirection="column"
                    p={1}
                    mb={1}
                    border={1}
                    borderRadius={1}
                    borderColor="info.dark"
                  >
                    <Box display="flex" alignItems="center">
                      <Avatar src={picture} />
                      <Typography ml={1}>{name}</Typography>
                    </Box>
                    <Typography align="left">
                      Created At: {formatDate(new Date(created_at * 1000))}
                    </Typography>
                    <Typography align="left">About: {about}</Typography>
                    <Typography align="left">Public Key: {pubkey}</Typography>
                  </Box>
                );
              } else {
                return (
                  <Box
                    key={event.id}
                    display="flex"
                    flexDirection="column"
                    p={1}
                    mb={1}
                    border={1}
                    borderRadius={1}
                    borderColor="info.dark"
                  >
                    <Typography key={event.id} align="left">
                      {event.content}
                    </Typography>
                    <Typography align="left">
                      Created At: {formatDate(new Date(created_at * 1000))}
                    </Typography>
                  </Box>
                );
              }
            })}
          </>
        ) : null}
      </Box>
    </Box>
  );
};

export default Nostr;
