import { PostItemProps } from "../../types";
import {
  Badge,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { Edit, Delete, ThumbUp } from "@mui/icons-material";
import { UserAvatar } from "../UserAvatar";
import "./styles.css";

export const PostItem = ({
  post,
  user,
  isCurrentUser,
  onEdit,
  onDelete,
  onLike,
}: PostItemProps) => {
  const handleOnLike = () => {
    onLike(post);
  };

  return (
    <Card className='post-card'>
      <CardHeader
        avatar={<UserAvatar user={user} />}
        title={user?.name}
        subheader={new Date(post.date).toLocaleString()}
      />
      {post.imageUrl && (
        <CardMedia
          className='post-image'
          image={post?.imageUrl}
          title='Post Image'
        />
      )}
      <CardContent>
        <Typography variant='body1' color='textPrimary' component='p'>
          {post.content}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          {isCurrentUser && (
            <>
              <IconButton onClick={onEdit}>
                <Edit />
              </IconButton>
              <IconButton onClick={onDelete}>
                <Delete />
              </IconButton>
            </>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleOnLike}>
            <Badge
              badgeContent={post.likes || 0}
              color='primary'
              style={{ padding: ".1rem" }}
            >
              <ThumbUp />
            </Badge>
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};
