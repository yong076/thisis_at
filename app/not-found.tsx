import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="page">
      <section className="card dash-card">
        <h1>404</h1>
        <p className="subtitle">This profile or page does not exist.</p>
        <Link href="/" className="button-link" style={{ maxWidth: 240, marginTop: '0.8rem' }}>
          Back Home
        </Link>
      </section>
    </main>
  );
}
