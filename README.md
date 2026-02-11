## Upvote

Upvote is a Reddit-esque web application that allows users to create posts, upvote and downvote posts, and comment on posts in a multi-threaded, nested list.

The project is built using Next.js with the /app router and [Tailwind CSS](https://tailwindcss.com/), and uses [Auth.js (formerly Next Auth)](https://authjs.dev/) for user authentication. The data is stored in a Postgres database, which is created and accessed with raw SQL queries using the `pg` package.

The project is a work in progress and is not yet complete.

## Features

- [x] View a list of posts
- [x] View a single post
- [x] Create a post
- [x] Upvote and downvote posts
- [x] Pagination of posts
- [x] Comment on posts
- [x] Nested comments (recursive lists)
- [x] User authentication

## Setup instructions

1. Fork the repository (check "copy the main branch only") and clone your fork to your local machine
2. Run `npm install`
3. Create a `.env.local` file in the root directory and add the following environment variables:
   - `DATABASE_URL` - the URL of your Postgres database (eg. the Supabase connection string)
   - `AUTH_SECRET` - the Next Auth secret string (this can be anything at all like a password, but keep it secret!)
   - `AUTH_GITHUB_ID` - the GitHub OAuth client ID (create yours in [Github developer settings](https://github.com/settings/developers)
   - `AUTH_GITHUB_SECRET` - the GitHub OAuth client secret (create this in [Github developer settings](https://github.com/settings/developers))
4. Create the database schema by running the SQL commands in `schema.sql` in your database (eg. by running the commands in Supabase Query Editor)
5. Run `npm run dev` to start the development server
6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the site

## Potential future features

- [x] User profiles
- [x] Sorting posts by recent (date posted), top (most upvotes), and most controversial (most upvotes _and_ downvotes)
- [ ] User karma scores
- [ ] User badges / trophies (awards for achievements like number of posts, years on the site, etc.)
- [ ] User settings (eg. number of posts per page, theme, etc.)
- [ ] Moderation tools / reporting or flagging objectionable comments for removable by admins
- [ ] Searching posts (possibly using simple SQL LIKE '%some search%', or [Postgres text search](https://www.crunchydata.com/blog/postgres-full-text-search-a-search-engine-in-a-database))
- [ ] Subreddits (separate communities, that isn't just one big list of posts, that can be created by users)
- [ ] User notifications
- [ ] User private messaging
- [ ] User blocking
- [ ] User following
- [ ] User feed (posts from users you follow)
- [ ] User flair

## Reflection

I took ages trying to figure out the errors because of a dependency issue but I didn't know why these were happening so I ultimately ended up using the command 'npm i --legacy-peer-deps' on vercel to make this work for vercel hosting. Once I had an up and running render, I began working on creating a page for user profiles. However!!! The errors returned after this push and I was at a lost, which was super frustrating and I was ready to just leave it alone. I updated the dependencies and then fixed a auth() server issue and things seemed to work but this did create a concern when it came to pushing any further versions to github and redeploying.

I fixed the issues noted with the authority for viewing the postslist and the posts individual page, which is what originally caused the server issue that was fixed with ? in the posting.

I was able to complete the profile page and the sorting functionalities (I wasn't sure what was originally meant in terms of the overall interactions part but once Bertie clarified, that was just an addition to the SQL mainly). I intially struggled with making the sorting work but ultimately read how searchParams worked when using components,as I hadn't done this previously; so I was able to add this to the "/" and "/profile" routes for post sorting.

I was also able to clean up a couple of ux bugs that I noticed: the 'add post' window did not have a return link if the user wanted to not post; the colour made it difficult to interact with the window; the submit button for the 'add post' window, the logout button, and the log in button all had the same concerns, so I changed those to have some feedback for the user.

I also notice that useFormState was replaced with [useActionState], but I didn't have the time to read about and fix this. (https://react.dev/reference/react/useActionState)

I think that I did these things propely but I couldn't find how to spoof users, so I wasn't able to test much functionality with the remaining time that I had remaining and focussed on just getting what I had done and submitted.

I just didn't have any more time to think about the others as I messed everything up early on, so there isn't anything else to say about those.
