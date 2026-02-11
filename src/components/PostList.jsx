import Link from "next/link";
import { Pagination } from "./Pagination";
import { Vote } from "./Vote";
import { db } from "@/db";
import { POSTS_PER_PAGE } from "@/config";
import { LoginButton } from "./LoginButton";
import { auth } from "@/auth";

export async function PostList({ currentPage = 1, queryString }) {
  const session = await auth();

  const { rows: posts } =
    await db.query(`SELECT post.id, post.title, post.body, post.created_at, post.user_id, users.name, 
    COALESCE(SUM(votes.vote), 0) AS vote_total,
    COALESCE(COUNT(votes.vote)) AS interactions
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

  if (queryString?.sort === "desc") {
    posts.sort((a, b) => {
      return b.created_at
        .toLocaleString("en-CA")
        .localeCompare(a.created_at.toLocaleString("en-CA"));
    });
  } else if (queryString?.sort === "asc") {
    posts.sort((a, b) => {
      return a.created_at
        .toLocaleString("en-CA")
        .localeCompare(b.created_at.toLocaleString("en-CA"));
    });
  } else if (queryString?.vote === "desc") {
    posts.sort((a, b) => {
      return a.vote_total.localeCompare(b.vote_total);
    });
  } else if (queryString?.vote === "asc") {
    posts.sort((a, b) => {
      return b.vote_total.localeCompare(a.vote_total);
    });
  } else if (queryString?.interact === "desc") {
    posts.sort((a, b) => {
      return a.interactions.localeCompare(b.interactions);
    });
  } else if (queryString?.interact === "asc") {
    posts.sort((a, b) => {
      return b.interactions.localeCompare(a.interactions);
    });
  }

  return (
    <>
      <ul className="max-w-5xl mx-auto p-4 mb-4">
        <div className="max-w-4xl flex flex-row gap-3">
          <fieldset className="border-2 p-4">
            <legend className="ml-3"> Sort By Recent </legend>
            <Link href={`/?sort=asc`}> Sort Oldest First </Link> |
            <Link href={`/?sort=desc`}> Sort Newest First </Link>
          </fieldset>
          <fieldset className="border-2 p-4">
            <legend className="ml-3"> Sort By Votes </legend>
            <Link href={`/?vote=asc`}> Top Voted </Link> |
            <Link href={`/?vote=desc`}> Least Voted </Link>
          </fieldset>
          <fieldset className="border-2 p-4">
            <legend className="ml-3"> Sort By Interaction </legend>
            <Link href={`?interact=asc`}> Most Interacted </Link> |
            <Link href={`?interact=desc`}> Least Interacted </Link>
          </fieldset>
        </div>
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
                </Link>{" "}
              </p>
              <p className="text-zinc-700 text-sm">
                at {post.created_at.toLocaleString("en-CA")}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <Pagination currentPage={currentPage} />
    </>
  );
}
