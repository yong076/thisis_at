'use client';

import type { BlockFormProps } from '../block-edit-dialog';

type Member = { name: string; role?: string; imageUrl?: string; url?: string };

export function TeamMembersForm({ config, onChange }: BlockFormProps) {
  const members = (config.members as Member[]) ?? [];

  function updateMember(index: number, field: keyof Member, value: string) {
    const updated = members.map((m, i) => (i === index ? { ...m, [field]: value } : m));
    onChange({ ...config, members: updated });
  }

  function addMember() {
    onChange({ ...config, members: [...members, { name: '', role: '', imageUrl: '', url: '' }] });
  }

  function removeMember(index: number) {
    onChange({ ...config, members: members.filter((_, i) => i !== index) });
  }

  return (
    <div className="form-group">
      <label>팀원 목록</label>
      {members.map((member, i) => (
        <div key={i} className="form-array-block">
          <div className="form-array-block-header">
            <strong>팀원 #{i + 1}</strong>
            <button type="button" className="form-array-remove" onClick={() => removeMember(i)}>✕</button>
          </div>
          <input
            type="text"
            value={member.name}
            onChange={(e) => updateMember(i, 'name', e.target.value)}
            placeholder="이름"
            required
          />
          <input
            type="text"
            value={member.role ?? ''}
            onChange={(e) => updateMember(i, 'role', e.target.value)}
            placeholder="역할 (선택)"
          />
          <input
            type="url"
            value={member.imageUrl ?? ''}
            onChange={(e) => updateMember(i, 'imageUrl', e.target.value)}
            placeholder="프로필 이미지 URL (선택)"
          />
          <input
            type="url"
            value={member.url ?? ''}
            onChange={(e) => updateMember(i, 'url', e.target.value)}
            placeholder="링크 URL (선택)"
          />
        </div>
      ))}
      <button type="button" className="form-array-add" onClick={addMember}>
        + 팀원 추가
      </button>
    </div>
  );
}
