import {
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { PostData, UserData } from "../../types";
import "./styles.css";
import { UserAvatar } from "../UserAvatar";
const { VITE_CONSOLE_LOG } = import.meta.env;

type HeaderProps = {
  openPostEditor: (post:PostData) => void;
  onAvatarClick: () => void;
  currentUser: UserData | undefined;
};

export const Header: React.FC<HeaderProps> = ({
  openPostEditor,
  onAvatarClick,
  currentUser,
}) => {
  const user: UserData | Object = currentUser || { id: 0, name: "" };
  VITE_CONSOLE_LOG && console.log("Header", user);

  return (
    <AppBar position='static'>
      <Toolbar disableGutters className='app-toolbar'>
        <Tooltip title='Switch User' onClick={onAvatarClick}>
          <IconButton>
            <UserAvatar user={user} className='user-avatar' />
          </IconButton>
        </Tooltip>
        <div>
          <Typography className='app-title main' variant='h6'>
            BriefCam Social
          </Typography>
          <Typography className='app-title' variant='subtitle1' lineHeight={1}>
            {user?.name}
          </Typography>
        </div>
        <Tooltip title='Add Post'>
          <IconButton onClick={openPostEditor}>
            <AddOutlined htmlColor='white' />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
