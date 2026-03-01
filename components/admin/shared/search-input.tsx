'use client';

import { useState, useEffect, useRef } from 'react';

export function SearchInput({
  value,
  onChange,
  placeholder = '검색...',
  delay = 400,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
}) {
  const [local, setLocal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setLocal(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setLocal(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(v), delay);
  }

  return (
    <input
      type="text"
      className="adm-search"
      placeholder={placeholder}
      value={local}
      onChange={handleChange}
    />
  );
}
