import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Timetable } from '../../types/timetable';

interface ConflictResolutionDialogProps {
  open: boolean;
  onClose: () => void;
  timetable: Timetable | null;
}

const ConflictResolutionDialog: React.FC<ConflictResolutionDialogProps> = ({
  open,
  onClose,
  timetable,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Timetable Conflicts</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          The following conflicts were found in the timetable:
        </Typography>
        <List>
          {/* Add conflict list items here */}
          <ListItem>
            <ListItemText
              primary="No conflicts found"
              secondary="The timetable appears to be valid"
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConflictResolutionDialog;