import { Avatar, AvatarProps } from "@mui/material";
import { UserData } from "../../types";
import { forwardRef } from "react";

type UserAvatarProps = AvatarProps & {
  user: UserData;
};

export const UserAvatar = forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ user, ...props }, ref) => {
    const initials = user.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase();

    return (
      <Avatar alt={user.name} src={user.avatar} {...props}>
        {!user.avatar && initials}
      </Avatar>
    );
  }
);
