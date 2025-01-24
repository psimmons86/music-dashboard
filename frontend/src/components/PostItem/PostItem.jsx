export default function PostItem({ post }) {
  return (
    <article>
      <h4>{new Date(post.createdAt).toLocaleDateString()}</h4>
      <p>{post.content}</p>
      <h4>🕺{post.user.name}</h4>
    </article>
  );
}
