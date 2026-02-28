import { DefaultShell } from '@/components/public/default-shell';
import { EditorContent } from '@/components/editor/editor-content';
import type { PublicProfile } from '@/lib/types';

/**
 * Test page for previewing the editor UI without authentication.
 * Uses mock data to render the EditorContent component.
 * Access at: /test/editor
 */

const MOCK_PROFILE: PublicProfile = {
  id: 'test-001',
  handle: 'demo_artist',
  displayName: 'Demo Artist',
  type: 'ARTIST',
  bio: 'This is a demo artist profile for testing the editor UI.',
  location: 'Seoul, KR',
  avatarUrl: undefined,
  coverUrl: undefined,
  blocks: [
    {
      id: 'block-1',
      type: 'LINK_BUTTON',
      title: 'My Website',
      enabled: true,
      order: 0,
      config: { url: 'https://example.com', label: 'Visit my website' },
    },
    {
      id: 'block-2',
      type: 'SOCIAL_ROW',
      title: 'Social Links',
      enabled: true,
      order: 1,
      config: {
        links: [
          { label: 'Instagram', url: 'https://instagram.com/demo' },
          { label: 'YouTube', url: 'https://youtube.com/@demo' },
        ],
      },
    },
    {
      id: 'block-3',
      type: 'TEXT_ANNOUNCEMENT',
      title: 'New Album Out!',
      enabled: true,
      order: 2,
      config: { text: 'Check out our latest album, available on all platforms!' },
    },
    {
      id: 'block-4',
      type: 'LINK_BUTTON',
      title: 'Listen on Spotify',
      enabled: false,
      order: 3,
      config: { url: 'https://spotify.com', label: 'Listen now' },
    },
    {
      id: 'block-5',
      type: 'FAQ',
      title: 'FAQ',
      enabled: true,
      order: 4,
      config: {
        items: [
          { question: 'When is the next concert?', answer: 'TBA' },
        ],
      },
    },
  ],
  events: [],
  showVisitorCount: true,
  customization: {
    themeId: 'radiant',
    fontBody: 'pretendard',
    fontDisplay: 'fraunces',
    buttonStyle: 'gradient',
    cardStyle: 'glass',
    showSparkles: true,
  },
};

export default function TestEditorPage() {
  return (
    <DefaultShell>
      <EditorContent profile={MOCK_PROFILE} />
    </DefaultShell>
  );
}
