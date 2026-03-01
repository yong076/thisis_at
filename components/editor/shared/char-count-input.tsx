'use client';

import { type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

type BaseProps = {
  maxLength: number;
  label?: string;
  showCount?: boolean;
};

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { multiline?: false };
type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true };

type Props = InputProps | TextareaProps;

export function CharCountInput(props: Props) {
  const { maxLength, label, showCount = true, multiline, className = '', ...rest } = props;
  const value = String(rest.value ?? '');
  const count = value.length;
  const isOver = count > maxLength;

  return (
    <div className="char-count-wrapper">
      {label && <span className="char-count-label">{label}</span>}
      {multiline ? (
        <textarea
          className={`char-count-input ${className}`}
          maxLength={maxLength}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={`char-count-input ${className}`}
          maxLength={maxLength}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {showCount && (
        <span className={`char-count ${isOver ? 'char-count--over' : ''}`}>
          {count}/{maxLength}
        </span>
      )}
    </div>
  );
}
