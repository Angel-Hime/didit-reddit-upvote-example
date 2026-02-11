import { PostList } from "../components/PostList";

export default async function Home({ searchParams }) {
  const queryString = await searchParams;
  console.log(queryString);

  return <PostList queryString={queryString} />;
}
