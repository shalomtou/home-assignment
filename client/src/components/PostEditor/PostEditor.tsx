import React, { useState } from "react";
import {
  Button,
  TextField,
  TextareaAutosize,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { PostEditorProps } from "../../types";

export const PostEditor = ({
  open,
  onClose,
  onSubmit,
  post,
}: PostEditorProps) => {

  const [content, setContent] = useState(post ? post.content : "");
  const [imageUrl, setImageUrl] = useState(post ? post.imageUrl : "");

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };

  const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value?.trim());
  };

  const handleSubmit = () => {
    if (imageUrl && imageUrl !== "" && !isValidUrl(imageUrl)) {
      alert("Please ennter valid URL");
      return;
    }

    const obj = {
      content,
      imageUrl,
      id: post ? post.id : null,
      userId: post ? post.userId : null,
    };

    onSubmit(obj);
    handleOnClose();
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleOnClose = () => {
    setContent("");
    setImageUrl("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth='sm'>
      <DialogTitle>Post</DialogTitle>
      <DialogContent className='post-editor-content'>
        <TextareaAutosize
          className='text-area-autosize'
          placeholder='Enter your post content...'
          value={content}
          onChange={handleContentChange}
          minRows={3}
          maxRows={15}
          style={{
            width: "100%",
            margin: "auto auto 1rem auto",
            fontSize: "1rem",
            padding: "16.5px 14px",
          }}
        />
        <TextField
          label='Image URL'
          variant='outlined'
          fullWidth
          value={imageUrl}
          onChange={handleImageUrlChange}
          placeholder='Enter valid image url'
          style={{
            margin: "auto",
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose} color='secondary'>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color='primary'
          variant='contained'
          disabled={!content}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
