import React, { useEffect, useRef } from 'react';

interface ProgressRingProps {
  value: number;
  label: string;
  sizePx?: number;
  thicknessPx?: number;
  fillColor?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  label,
  sizePx = 60,
  thicknessPx = 6,
  fillColor = '#990000',
}) => {
  const progressRef = useRef<HTMLProgressElement | null>(null);
  const clampedValue = Math.max(0, Math.min(100, Math.round(value)));

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;

    // Fallback for browsers that do not support CSS attr(value type(<number>))
    if (typeof CSS !== 'undefined' && !CSS.supports('width: attr(value type(<number>))')) {
      el.style.setProperty('--value', String(clampedValue));
      const observer = new MutationObserver(() => {
        el.style.setProperty('--value', el.getAttribute('value') ?? '0');
      });
      observer.observe(el, {
        attributes: true,
        attributeFilter: ['value'],
      });
      return () => observer.disconnect();
    } else {
      el.style.setProperty('--value', String(clampedValue));
    }
  }, [clampedValue]);

  return (
    <div className="progress-ring-wrapper" title={`${label}: ${clampedValue}%`}>
      <progress
        ref={progressRef}
        value={clampedValue}
        max={100}
        aria-label={label}
        className="progress-ring"
        style={
          {
            '--size': `${sizePx}px`,
            '--thickness': `${thicknessPx}px`,
            '--fill-color': clampedValue === 100 ? '#10b981' : fillColor,
            '--value': clampedValue,
          } as React.CSSProperties
        }
      />
      <div className="progress-ring-content">{clampedValue}%</div>
    </div>
  );
};
