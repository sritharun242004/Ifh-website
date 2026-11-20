import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminToken } from "@/landing/lib/admin-auth";
import Board from "./Board";
import Login from "./Login";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const token = adminToken();
  const authed = !!token && cookies().get(ADMIN_COOKIE)?.value === token;

  // Signed out: the login is its own centered screen.
  if (token != null && !authed) return <Login />;

  return (
    <main className="admin">
      <header className="admin__bar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo.png" alt="" width={38} height={25} style={{ alignSelf: "center" }} />
        <strong>iFindHouse</strong>
        <span>Admin</span>
      </header>
      {token == null ? (
        <p className="admin__note">
          Admin isn&rsquo;t configured. Set <code>ADMIN_PASSWORD</code> in the environment and redeploy.
        </p>
      ) : (
        <Board />
      )}
    </main>
  );
}
