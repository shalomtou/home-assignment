export type PostData = {
  id: number;
  userId: number;
  content: string;
  date: string;
  imageUrl?: string;
  likes?: number;
};

export type UserData = {
  [x: string]: boolean;
  id: number;
  name: string;
  avatar?: string;
};

export type PostItemProps = {
  post: PostData;
  user: UserData;
  isCurrentUser: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onLike: (post: PostData) => void;
};

export interface PostEditorProps {
  open: boolean;
  onClose: () => void;
  onSubmit: ({ content, imageUrl }: PostEditorSubmitData) => void;
  post?: PostData;
}

export interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export type PostEditorSubmitData = {
  content: string;
  imageUrl?: string;
  id?: number | null;
  userId?: number;
};
