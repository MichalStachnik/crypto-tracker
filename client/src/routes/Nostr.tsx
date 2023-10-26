import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import {
  Relay,
  relayInit,
  Event,
  generatePrivateKey,
  getPublicKey,
  finishEvent,
} from 'nostr-tools';
import NostrForm from '../components/NostrForm';

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
  const [relays, setRelays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectedRelay, setConnectedRelay] = useState<Relay | null>(null);
  const [events, setEvents] = useState<Event<0 | 1>[] | null>(null);
  const [privateKey, setPrivateKey] = useState('');

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
      setConnectedRelay(null);
    });
  };

  const getEvents = async (relay: Relay) => {
    setIsLoading(true);
    const events = await relay.list([{ kinds: [1] }]);
    setEvents(events);
    setIsLoading(false);
  };

  const getMyEvents = async (relay: Relay) => {
    setIsLoading(true);
    const publicKey = getPublicKey(privateKey);
    const events = await relay.list([{ kinds: [0, 1], authors: [publicKey] }]);
    setEvents(events);
    setIsLoading(false);
  };

  const handleGeneratePrivateKey = () => {
    if (!connectedRelay) return;
    const pk = generatePrivateKey();
    setPrivateKey(pk);

    const publicKey = getPublicKey(pk);

    const subscription = connectedRelay.sub([
      {
        kinds: [0, 1],
        authors: [publicKey],
      },
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subscription.on('event', (_event: Event<0 | 1>) => {
      // console.log('got a new event:', event);
    });
  };

  const handlePostEvent = async (message: string) => {
    if (!privateKey || !message || !connectedRelay) return;

    const publicKey = getPublicKey(privateKey);
    const event = {
      kind: 1,
      pubkey: publicKey,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: message,
      id: '',
      sig: '',
    };

    const signedEvent = finishEvent(event, privateKey);
    await connectedRelay.publish(signedEvent);
    getEvents(connectedRelay);
  };

  const handlePostEventClick = (message: string) => {
    handlePostEvent(message);
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
              disabled={relay === connectedRelay?.url}
            >
              {relay}
            </Button>
          );
        })}
      </Box>
      <Box width="60%">
        <Box>
          <TextField
            placeholder="private key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            fullWidth
            sx={{
              marginBottom: 2,
              input: {
                color: 'white',
                fontSize: '0.8rem',
              },
              fieldset: {
                borderColor: 'white',
              },
            }}
          />
          <Button
            variant="outlined"
            onClick={handleGeneratePrivateKey}
            fullWidth
          >
            Generate Private Key
          </Button>
        </Box>
        <NostrForm onPostEventClick={handlePostEventClick} />
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
            <Button
              variant="outlined"
              onClick={() => connectedRelay && getMyEvents(connectedRelay)}
              sx={{ margin: 1 }}
              disabled={isLoading}
            >
              Get My Events
            </Button>
            {events.map((event: Event) => {
              const json = isJson(event.content);
              const { created_at, pubkey } = event;
              if (json) {
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
                    <Typography align="left" fontSize="0.8rem">
                      Public Key: {pubkey}
                    </Typography>
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
                    <Typography
                      align="left"
                      fontSize="0.7rem"
                      overflow="scroll"
                    >
                      Public Key: {pubkey}
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
