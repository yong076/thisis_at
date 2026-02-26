import Link from 'next/link';
import { SparkleLayer } from '@/components/public/sparkle-layer';

export default function NotFoundPage() {
  return (
    <>
      <SparkleLayer />
      <main className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80dvh' }}>
        <section className="card animate-fade-up" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: 420 }}>
          <h1 style={{ fontSize: '3.5rem', margin: '0 0 0.5rem' }}>
            <span className="gradient-text">404</span>
          </h1>
          <p className="subtitle" style={{ marginBottom: '1.5rem' }}>
            이 프로필 또는 페이지는 아직 존재하지 않습니다.
          </p>
          <Link href="/" className="button-primary">
            홈으로 돌아가기
          </Link>
        </section>
      </main>
    </>
  );
}
