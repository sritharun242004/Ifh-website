import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminToken } from "@/landing/lib/admin-auth";
import Board from "./Board";
import Login from "./Login";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const token = adminToken();
  const authed = !!token && cookies().get(ADMIN_COOKIE)?.value === token;
  return (
    <main className="admin">
      <header className="admin__bar">
        <strong>iFindHouse</strong>
        <span>Owner leads</span>
      </header>
      {token == null ? (
        <p className="admin__note">
          Admin isn&rsquo;t configured. Set <code>ADMIN_PASSWORD</code> in the environment and redeploy.
        </p>
      ) : authed ? (
        <Board />
      ) : (
        <Login />
      )}
    </main>
  );
}
