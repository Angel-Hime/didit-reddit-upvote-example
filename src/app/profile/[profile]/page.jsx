import { db } from "@/db";
import Link from "next/link";
import { Pagination } from "@/components/Pagination";
import { Vote } from "@/components/Vote";
import { POSTS_PER_PAGE } from "@/config";
import { LoginButton } from "@/components/LoginButton";
import { auth } from "@/auth";
import Image from "next/image";

export default async function profile({
  currentPage = 1,
  params,
  searchParams,
}) {
  const { profile } = await params;
  console.log(profile);
  const session = await auth();

  // get user data related to variable 'profile'
  // get posts related to variable 'profile'
  // get comments related to posts

  const { rows: posts } = await db.query(
    `SELECT post.id, post.title, post.body, post.created_at, users.name, votes.vote, users.image, 
    COALESCE(SUM(votes.vote), 0) AS vote_total,
    COALESCE(COUNT(votes.vote)) AS interactions
     FROM post 
     JOIN users ON post.user_id = users.id
     LEFT JOIN votes ON votes.post_id = post.id
     WHERE post.user_id = $1
     GROUP BY post.id, users.image, votes.vote, users.name
     ORDER BY vote_total DESC
     LIMIT ${POSTS_PER_PAGE}
     OFFSET ${POSTS_PER_PAGE * (currentPage - 1)}`,
    [profile],
  );

  const queryString = await searchParams;

  console.log(posts[0].vote);
  console.log(posts[1].vote);

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

        <span className="font-bold text-5xl p-10">{posts[0].name}'s Posts</span>
      </div>
      <div className="max-w-4xl flex flex-row gap-3">
        <fieldset className="border-2 p-4">
          <legend className="ml-3"> Sort By Recent </legend>
          <Link href={`/profile/${profile}/?sort=asc`}>
            {" "}
            Sort Oldest First{" "}
          </Link>{" "}
          |
          <Link href={`/profile/${profile}/?sort=desc`}>
            {" "}
            Sort Newest First{" "}
          </Link>
        </fieldset>
        <fieldset className="border-2 p-4">
          <legend className="ml-3"> Sort By Votes </legend>
          <Link href={`/profile/${profile}/?vote=asc`}> Top Voted </Link> |
          <Link href={`/profile/${profile}/?vote=desc`}> Least Voted </Link>
        </fieldset>
        <fieldset className="border-2 p-4">
          <legend className="ml-3"> Sort By Interaction </legend>
          <Link href={`/profile/${profile}/?interact=asc`}>
            {" "}
            Most Interacted{" "}
          </Link>{" "}
          |
          <Link href={`/profile/${profile}/?interact=desc`}>
            {" "}
            Least Interacted{" "}
          </Link>
        </fieldset>
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
