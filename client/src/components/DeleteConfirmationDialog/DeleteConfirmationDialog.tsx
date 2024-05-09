import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { DeleteConfirmationProps } from "../../types";

export const DeleteConfirmationDialog = ({
  open,
  onClose,
  onDelete,
}: DeleteConfirmationProps) => {
  const handleOnDelete = () => {
    onDelete();
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Post</DialogTitle>
      <DialogContent>Are you sure you want to delete this post?</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleOnDelete} color='primary'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
