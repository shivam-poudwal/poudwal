export default function Home() {
  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 640, margin: '80px auto', textAlign: 'center' }}>
      <h1>🚀 {{appName}}</h1>
      <p>Scaffolded with <strong>poudwal</strong> — Next.js + MongoDB + JWT Auth</p>
      <hr />
      <h2>Available API Endpoints</h2>
      <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2 }}>
        <li><code>POST /api/auth/register</code> — Register a new user</li>
        <li><code>POST /api/auth/login</code> — Login &amp; receive JWT</li>
      </ul>
      <p style={{ color: '#888', fontSize: 14 }}>
        Edit <code>app/page.{{ext}}</code> to get started.
      </p>
    </main>
  );
}
