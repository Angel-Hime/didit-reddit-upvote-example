import { auth } from "@/auth";
import { CommentForm } from "@/components/CommentForm";
import { CommentList } from "@/components/CommentList";
import { LoginButton } from "@/components/LoginButton";
import { Vote } from "@/components/Vote";
import { db } from "@/db";
import Link from "next/link";

export default async function SinglePostPage({ params }) {
  const session = await auth();

  const { postId } = await params;

  const { rows: posts } = await db.query(
    `SELECT post.id, post.title, post.body, post.created_at, post.user_id, users.name, 
    COALESCE(SUM(votes.vote), 0) AS vote_total
    FROM post
    JOIN users ON post.user_id = users.id
    LEFT JOIN votes ON votes.post_id = post.id
    WHERE post.id = $1
    GROUP BY post.id, users.name
    LIMIT 1;`,
    [postId],
  );
  const post = posts[0];

  const { rows: votes } = await db.query(
    `SELECT *, users.name from votes
     JOIN users on votes.user_id = users.id`,
  );

  if (!session) {
    return (
      <div className="max-w-5xl mx-auto p-4 mt-10">
        You need to login to open a post <LoginButton />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pt-4 pr-4">
      <div className="flex space-x-6">
        <Vote postId={post.id} votes={post.vote_total} />
        <div className="">
          <h1 className="text-2xl">{post.title}</h1>
          <p className="text-zinc-400 mb-4">
            Posted by{" "}
            <Link
              className="text-lg hover:text-pink-500"
              href={`/profile/${post.user_id}`}
            >
              {post.name}
            </Link>
          </p>
        </div>
      </div>
      <main className="whitespace-pre-wrap m-4">{post.body}</main>

      <CommentForm postId={post.id} />
      <CommentList postId={post.id} />
    </div>
  );
}
