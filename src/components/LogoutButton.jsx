import { signOut } from "@/auth";

export function LogoutButton() {
  async function handleLogout() {
    "use server";
    await signOut();
  }

  return (
    <form action={handleLogout} className="inline">
      <button className="bg-pink-300 cursor-pointer hover:bg-zinc-300 text-black px-3 py-2 rounded">
        Logout
      </button>
    </form>
  );
}
