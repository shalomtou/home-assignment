import express, { Express, Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const usersFilePath = path.join(__dirname, "../db/users.json");
const postsFilePath = path.join(__dirname, "../db/posts.json");

interface PostData {
  id: number;
  userId: number;
  date: string;
  content: string;
  imageUrl?: string;
}

const app: Express = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.put("/posts/:postId", (req: Request, res: Response) => {
  const postId = +req.params.postId;
  const updatedPostData = req.body as PostData;

  try {
    const postsData = JSON.parse(fs.readFileSync(postsFilePath, "utf-8"));
    const postIndex = postsData.findIndex(
      (post: PostData) => post.id === postId
    );

    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    updatedPostData.date = new Date().toISOString();
    postsData[postIndex] = { ...postsData[postIndex], ...updatedPostData };

    fs.writeFileSync(postsFilePath, JSON.stringify(postsData, null, 2));

    res.json({ message: "Post updated successfully", data: updatedPostData });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/posts/:postId", (req: Request, res: Response) => {
  const postId = +req.params.postId;

  try {
    const postsData = JSON.parse(fs.readFileSync(postsFilePath, "utf-8"));
    const updatedPosts = postsData.filter(
      (post: PostData) => post.id !== postId
    );

    fs.writeFileSync(postsFilePath, JSON.stringify(updatedPosts, null, 2));

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/posts", (req: Request, res: Response) => {
  const newPostData = req.body as PostData;

  newPostData.date = new Date().toISOString();

  try {
    const postsData = JSON.parse(fs.readFileSync(postsFilePath, "utf-8"));
    const lastPostId =
      postsData.length > 0 ? postsData[postsData.length - 1].id : 0;

    newPostData.id = lastPostId + 1;
    postsData.push(newPostData);

    fs.writeFileSync(postsFilePath, JSON.stringify(postsData, null, 2));

    res.json({ message: "Post added successfully", data: newPostData });
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/users", (req: Request, res: Response) => {
  try {
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
    res.json(usersData);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/posts", (req: Request, res: Response) => {
  try {
    const postsData = JSON.parse(fs.readFileSync(postsFilePath, "utf-8"));
    const _posts = postsData.sort(
      (a: PostData, b: PostData) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    res.json(_posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Server is up!");
});

app.listen(port, () => {
  console.log(`🔋 Server is running at http://localhost:${port}`);
});
