export default function Sidebar() {
  return (
    <aside className="w-64 border-r p-5">
      <h2 className="text-xl font-bold">DocVault</h2>

      <nav className="mt-6 space-y-3">
        <a href="/dashboard">Dashboard</a>
        <br />
        <a href="/documents">Documents</a>
        <br />
        <a href="/profile">Profile</a>
      </nav>
    </aside>
  );
}