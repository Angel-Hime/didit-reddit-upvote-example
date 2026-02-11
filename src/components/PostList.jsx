import Link from "next/link";
import { Pagination } from "./Pagination";
import { Vote } from "./Vote";
import { db } from "@/db";
import { POSTS_PER_PAGE } from "@/config";
import { LoginButton } from "./LoginButton";
import { auth } from "@/auth";

export async function PostList({ currentPage = 1 }) {
  const session = await auth();
  const user = await auth();
  console.log(user?.name);
  console.log(user?.id); // current user id

  const { rows: posts } =
    await db.query(`SELECT post.id, post.title, post.body, post.created_at, post.user_id, users.name, 
    COALESCE(SUM(votes.vote), 0) AS vote_total
     FROM post
     JOIN users ON post.user_id = users.id
     LEFT JOIN votes ON votes.post_id = post.id
     GROUP BY post.id, users.name
     ORDER BY vote_total DESC
     LIMIT ${POSTS_PER_PAGE}
     OFFSET ${POSTS_PER_PAGE * (currentPage - 1)}`);

  if (!session) {
    return (
      <div className="max-w-5xl mx-auto p-4 mt-10">
        Login to view posts! <LoginButton />
      </div>
    );
  }

  return (
    <>
      <ul className="max-w-5xl mx-auto p-4 mb-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className=" py-4 flex space-x-6 hover:bg-zinc-200 rounded-lg"
          >
            <Vote postId={post.id} votes={post.vote_total} />
            <div>
              <Link
                href={`/post/${post.id}`}
                className="text-3xl hover:text-pink-500"
              >
                {post.title}
              </Link>
              <p className="text-zinc-700">
                posted by{" "}
                <Link
                  className="text-lg hover:text-pink-500"
                  href={`/profile/${post.user_id}`}
                >
                  {post.name}
                </Link>
              </p>
            </div>
          </li>
        ))}
      </ul>
      <Pagination currentPage={currentPage} />
    </>
  );
}
