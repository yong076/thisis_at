'use client';

import type { BlockFormProps } from '../block-edit-dialog';

type ScheduleItem = { day: string; open: string; close: string; closed?: boolean };

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { day: '월', open: '09:00', close: '18:00', closed: false },
  { day: '화', open: '09:00', close: '18:00', closed: false },
  { day: '수', open: '09:00', close: '18:00', closed: false },
  { day: '목', open: '09:00', close: '18:00', closed: false },
  { day: '금', open: '09:00', close: '18:00', closed: false },
  { day: '토', open: '10:00', close: '15:00', closed: false },
  { day: '일', open: '', close: '', closed: true },
];

export function BusinessHoursForm({ config, onChange }: BlockFormProps) {
  const schedule = (config.schedule as ScheduleItem[]) ?? DEFAULT_SCHEDULE;

  function updateItem(index: number, field: keyof ScheduleItem, value: string | boolean) {
    const updated = schedule.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange({ ...config, schedule: updated });
  }

  return (
    <div className="form-group">
      <label>영업시간</label>
      <div className="hours-form-grid">
        {schedule.map((item, i) => (
          <div key={i} className="hours-form-row">
            <span className="hours-form-day">{item.day}</span>
            <label className="hours-form-closed">
              <input
                type="checkbox"
                checked={item.closed ?? false}
                onChange={(e) => updateItem(i, 'closed', e.target.checked)}
              />
              <span>휴무</span>
            </label>
            {!item.closed && (
              <>
                <input
                  type="time"
                  value={item.open}
                  onChange={(e) => updateItem(i, 'open', e.target.value)}
                />
                <span className="hours-form-sep">~</span>
                <input
                  type="time"
                  value={item.close}
                  onChange={(e) => updateItem(i, 'close', e.target.value)}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
