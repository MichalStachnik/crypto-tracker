import { useState } from 'react';
import { Box, Button, FormControl, TextField } from '@mui/material';

interface NostrFormProps {
  onPostEventClick: (message: string) => void;
}

const NostrForm = ({ onPostEventClick }: NostrFormProps) => {
  const [message, setMessage] = useState('');

  const handlePostEventClick = () => {
    if (!message) return;
    onPostEventClick(message);
  };

  return (
    <Box my={2} component="div">
      <FormControl fullWidth>
        <TextField
          placeholder="your message to the nostr network"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
          onClick={handlePostEventClick}
          disabled={!message}
        >
          Post Event
        </Button>
      </FormControl>
    </Box>
  );
};

export default NostrForm;
