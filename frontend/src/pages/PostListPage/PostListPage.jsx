import { useState, useEffect } from 'react';
import * as postService from '../../services/postService';
import './PostListPage.css';
import PostItem from '../../components/PostItem/PostItem';

export default function PostListPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const posts = await postService.index();
      setPosts(posts);
    }
    fetchPosts();
  }, []);

  const postItems = posts.map((p) => <PostItem key={p._id} post={p} />);

  return (
    <>
      <h1>Post List</h1>
      <section className="post-item-container">{postItems}</section>
    </>
  );
}
