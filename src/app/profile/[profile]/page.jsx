import { db } from "@/db";
import Link from "next/link";
import { Pagination } from "@/components/Pagination";
import { Vote } from "@/components/Vote";
import { POSTS_PER_PAGE } from "@/config";
import { LoginButton } from "@/components/LoginButton";
import { auth } from "@/auth";
import Image from "next/image";

export default async function profile({ currentPage = 1, params }) {
  const { profile } = await params;
  console.log(profile);
  const session = await auth();

  // get user data related to variable 'profile'
  // get posts related to variable 'profile'
  // get comments related to posts

  const { rows: posts } = await db.query(
    `SELECT post.id, post.title, post.body, post.created_at, users.name, users.image, 
    COALESCE(SUM(votes.vote), 0) AS vote_total
     FROM post 
     JOIN users ON post.user_id = users.id
     LEFT JOIN votes ON votes.post_id = post.id
     WHERE post.user_id = $1
     GROUP BY post.id, users.image, users.name
     ORDER BY vote_total DESC
     LIMIT ${POSTS_PER_PAGE}
     OFFSET ${POSTS_PER_PAGE * (currentPage - 1)}`,
    [profile],
  );

  if (!session) {
    return (
      <div className="max-w-5xl mx-auto p-4 mt-10">
        Login to view posts! <LoginButton />
      </div>
    );
  }

  return (
    <>
      <div className="flex space-x-3 items-center pb-2">
        <Image
          src={posts[0].image}
          alt={posts[0].name}
          width={64}
          height={64}
          className="rounded-full"
        />

        <span className="font-bold text-5xl p-10">{posts[0].name}' Posts</span>
      </div>
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
              <p className="text-zinc-700">posted by {post.name}</p>
            </div>
          </li>
        ))}
      </ul>
      <Pagination currentPage={currentPage} />
    </>
  );
}
