import { SparkleLayer } from '@/components/public/sparkle-layer';
import { TopNav } from '@/components/public/top-nav';

export default function AccountSettingsPage() {
  return (
    <>
      <SparkleLayer />
      <main className="page">
        <TopNav />
        <section className="card dash-card">
          <h1>Account Settings</h1>
          <p className="subtitle">Auth and identity model prepared for PHONE, GOOGLE, KAKAO linkage.</p>
          <ul>
            <li>Primary auth method: PHONE</li>
            <li>Linked identities: GOOGLE, KAKAO (planned)</li>
            <li>Status: ACTIVE</li>
          </ul>
        </section>
      </main>
    </>
  );
}
