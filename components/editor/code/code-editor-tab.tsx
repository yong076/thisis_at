'use client';

import { useState, useEffect, useTransition } from 'react';
import type { ProfileBlock, BlockType } from '@/lib/types';

type CodeBlock = {
  type: BlockType;
  title?: string;
  enabled: boolean;
  config: Record<string, unknown>;
};

type Props = {
  blocks: ProfileBlock[];
  handle: string;
  onBlocksChange: (blocks: ProfileBlock[]) => void;
};

export function CodeEditorTab({ blocks, handle, onBlocksChange }: Props) {
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState('');
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // Sync code from blocks
  useEffect(() => {
    const codeBlocks: CodeBlock[] = blocks.map((b) => ({
      type: b.type,
      title: b.title || undefined,
      enabled: b.enabled,
      config: b.config,
    }));
    setCode(JSON.stringify(codeBlocks, null, 2));
    setValidationResult(null);
  }, [blocks]);

  function handleValidate() {
    setError('');
    setValidationResult(null);
    try {
      const parsed = JSON.parse(code);
      if (!Array.isArray(parsed)) {
        setValidationResult({ valid: false, message: 'JSON은 배열이어야 합니다.' });
        return;
      }

      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (!item.type || typeof item.type !== 'string') {
          setValidationResult({ valid: false, message: `블록 #${i + 1}: type이 필요합니다.` });
          return;
        }
        if (typeof item.config !== 'object' || item.config === null) {
          setValidationResult({ valid: false, message: `블록 #${i + 1}: config 객체가 필요합니다.` });
          return;
        }
      }

      setValidationResult({ valid: true, message: `✓ ${parsed.length}개 블록이 유효합니다.` });
    } catch (e) {
      setValidationResult({
        valid: false,
        message: `JSON 파싱 오류: ${e instanceof Error ? e.message : '알 수 없는 오류'}`,
      });
    }
  }

  function handleApply() {
    setError('');

    let parsed: CodeBlock[];
    try {
      parsed = JSON.parse(code);
      if (!Array.isArray(parsed)) {
        setError('JSON은 배열이어야 합니다.');
        return;
      }
    } catch {
      setError('유효하지 않은 JSON입니다. 먼저 검증을 실행하세요.');
      return;
    }

    startTransition(async () => {
      try {
        // Strategy: delete all existing blocks, then create new ones in order
        // 1. Delete existing blocks
        for (const block of blocks) {
          await fetch(`/api/editor/${encodeURIComponent(handle)}/blocks/${block.id}`, {
            method: 'DELETE',
          });
        }

        // 2. Create new blocks in order
        const newBlocks: ProfileBlock[] = [];
        for (const item of parsed) {
          const res = await fetch(`/api/editor/${encodeURIComponent(handle)}/blocks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: item.type,
              title: item.title || null,
              config: item.config,
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            setError(`블록 "${item.type}" 생성 실패: ${data.error}`);
            // Refresh to get current state
            const listRes = await fetch(`/api/editor/${encodeURIComponent(handle)}/blocks`);
            const listData = await listRes.json();
            if (listRes.ok) {
              onBlocksChange(listData.blocks);
            }
            return;
          }

          newBlocks.push(data.block);
        }

        // 3. Handle enabled status (newly created blocks are enabled by default)
        for (let i = 0; i < parsed.length; i++) {
          if (parsed[i].enabled === false && newBlocks[i]) {
            await fetch(`/api/editor/${encodeURIComponent(handle)}/blocks/${newBlocks[i].id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ enabled: false }),
            });
            newBlocks[i] = { ...newBlocks[i], enabled: false };
          }
        }

        onBlocksChange(newBlocks);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch {
        setError('네트워크 오류가 발생했습니다.');
      }
    });
  }

  return (
    <section style={{ marginTop: '1rem' }}>
      <div className="card dash-card animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ margin: 0 }}>JSON 블록 편집기</h3>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              className="button-secondary"
              onClick={handleValidate}
              disabled={isPending}
              type="button"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
            >
              검증
            </button>
            <button
              className="button-primary"
              onClick={handleApply}
              disabled={isPending}
              type="button"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
            >
              {isPending ? '적용 중...' : saved ? '✓ 적용됨' : '적용'}
            </button>
          </div>
        </div>

        <p className="subtitle" style={{ marginBottom: '0.75rem', fontSize: '0.82rem' }}>
          블록을 JSON 형식으로 직접 편집합니다. 수정 후 &quot;검증&quot;으로 유효성을 확인하고,
          &quot;적용&quot;으로 저장하세요.
        </p>

        {/* Validation Result */}
        {validationResult && (
          <div
            className={`code-validation ${validationResult.valid ? 'code-validation--ok' : 'code-validation--error'}`}
          >
            {validationResult.message}
          </div>
        )}

        {/* Error */}
        {error && <div className="form-error" style={{ marginBottom: '0.5rem' }}>{error}</div>}

        {/* Code textarea */}
        <textarea
          className="code-editor-textarea"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setValidationResult(null);
          }}
          spellCheck={false}
          rows={Math.max(10, code.split('\n').length + 2)}
        />
      </div>
    </section>
  );
}
