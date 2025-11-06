export default function PostCard({ post }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="text-sm text-gray-500 mb-2">by {post.author}</p>
      <p>{post.content}</p>
    </div>
  );
}
