import { useState, useEffect } from "react";
import { DeleteConfirmationDialog, Header } from "./components";
import { PostEditorSubmitData, PostData, UserData } from "./types";
import { PostItem, PostEditor } from "./components";
import "./index.css";
const { VITE_BASE_URL, VITE_CONSOLE_LOG } = import.meta.env;

function App() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [currentPost, setCurrentPost] = useState<PostData | null>(null);
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [IsDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [usedUserIds, setUsedUserIds] = useState<number[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData>();

  useEffect(() => {
    handleFetchUsers();
  }, []);

  useEffect(() => {
    if (users.length) chooseRandomUserId();
  }, [users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(VITE_BASE_URL + "/users");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("fail to fetch users", error);
      return [];
    }
  };

  const handleFetchUsers = async () => {
    const users = await fetchUsers();
    const posts = await fetchPosts();
    setUsers(users);
    setPosts(posts);
  };

  const chooseRandomUserId = () => {
    let unusedUserIds = Array.from(
      { length: 10 },
      (_, index) => index + 1
    ).filter((id) => !usedUserIds.includes(id));

    if (unusedUserIds.length === 0) {
      unusedUserIds = Array.from({ length: 10 }, (_, index) => index + 1);
    }

    const randomIndex = Math.floor(Math.random() * unusedUserIds.length);
    const randomUserId = unusedUserIds[randomIndex];

    const selectedUser = users.find((user) => user.id === randomUserId);
    VITE_CONSOLE_LOG && console.log("selectedUser", selectedUser);

    setSelectedUserId(randomUserId);
    setSelectedUser(selectedUser);

    VITE_CONSOLE_LOG &&
      console.log(randomUserId, [...usedUserIds, randomUserId]);
    setUsedUserIds([...usedUserIds, randomUserId]);
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(VITE_BASE_URL + "/posts");
      const data = await response.json();
      VITE_CONSOLE_LOG && console.log(data);
      return data;
    } catch (error) {
      console.error("fail to fetch users", error);
      return [];
    }
  };

  const submitPost = async (postData: PostEditorSubmitData) => {
    try {
      let path = "/posts";
      let method = "POST";
      let object = { ...postData, userId: selectedUserId };

      if (postData.id) {
        path += "/" + postData.id;
        method = "PUT";
        object.userId = postData.userId;
      }

      const response = await fetch(VITE_BASE_URL + path, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(object),
      });

      const { data } = await response.json();
      const postIndex = posts.findIndex((post) => post.id === data.id);

      let updatedPosts;
      if (postIndex !== -1) {
        updatedPosts = [...posts];
        updatedPosts[postIndex] = data;
      } else {
        updatedPosts = [data, ...posts.filter((post) => post.id !== data.id)];
      }

      setPosts(updatedPosts);

      return data;
    } catch (error) {
      console.error("Failed to submit post:", error);
      return;
    }
  };

  const deletePost = async () => {
    try {
      if (!currentPost) return;
      const response = await fetch(VITE_BASE_URL + `/posts/${currentPost.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts(posts.filter((post) => post.id !== currentPost.id));

      VITE_CONSOLE_LOG && console.log("Post deleted successfully");
      return true;
    } catch (error) {
      console.error("Failed to delete post:", error);
      return;
    }
  };

  const handleSetLikes = (post: PostData) => {
    const postIndex = posts.findIndex((el) => el.id === post.id);
    let updatedPost;
    if (postIndex !== -1) {
      updatedPost = { ...post, likes: (post.likes || 0) + 1 };
      const updatedPosts = [...posts];
      updatedPosts[postIndex] = updatedPost;
      setPosts(updatedPosts);
    }
    submitPost(updatedPost);
  };

  const openEditor = () => setIsPostEditorOpen((prev) => !prev);

  const handleOpenEditor = (post: PostData) => {
    setCurrentPost(post);
    openEditor();
  };

  const openDelete = () => setIsDeleteOpen((prev) => !prev);

  const handleOpenDelete = (post: PostData) => {
    setCurrentPost(post);
    openDelete();
  };

  const closeDelete = () => {
    setIsDeleteOpen(false);
  };

  return (
    <>
      <Header
        openPostEditor={openEditor}
        onAvatarClick={chooseRandomUserId}
        currentUser={selectedUser}
      />
      <div className='posts-wrapper'>
        {selectedUser &&
          users &&
          posts.length &&
          posts.map((post, index) => {
            return (
              <PostItem
                key={index}
                post={post}
                user={users[post.userId - 1]}
                isCurrentUser
                onEdit={() => handleOpenEditor(post)}
                onDelete={() => handleOpenDelete(post)}
                onLike={handleSetLikes}
              />
            );
          })}
      </div>

      {isPostEditorOpen && (
        <PostEditor
          open={isPostEditorOpen}
          onSubmit={submitPost}
          onClose={openEditor}
          post={currentPost}
        />
      )}

      {IsDeleteOpen && (
        <DeleteConfirmationDialog
          open={IsDeleteOpen}
          onClose={closeDelete}
          onDelete={deletePost}
        />
      )}
    </>
  );
}

export default App;
