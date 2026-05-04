import React from 'react';
import { NexusMark } from './NexusMark';
import { WedgeMark } from './WedgeMark';
import { type WordmarkProps, Wordmark } from "./Wordmark"

export type LogoMark = 'nexus' | 'wedge';
export type LogoLayout = 'horizontal' | 'vertical' | 'mark-only' | 'wordmark-only';

export interface LogoProps {
  /**
   * Which icon mark to use
   * @default 'nexus'
   */
  mark?: LogoMark;
  /**
   * Layout of mark + wordmark
   * @default 'horizontal'
   */
  layout?: LogoLayout;
  /**
   * Icon size in pixels. Wordmark scales proportionally.
   * @default 40
   */
  iconSize?: number;
  /**
   * Wordmark variant
   * @default 'split-weight'
   */
  wordmarkVariant?: WordmarkProps['variant'];
  /**
   * Wordmark text color (for bold/split-weight variants)
   * @default '#ffffff'
   */
  wordmarkColor?: string;
  /**
   * Show tagline below wordmark
   * @default false
   */
  showTagline?: boolean;
  /**
   * Monochrome mode (for print / single-color contexts)
   * @default false
   */
  mono?: boolean;
  /**
   * Is the background dark?
   * @default true
   */
  onDark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Enkinex — Primary Logo Component
 *
 * Combines the icon mark (Nexus or Wedge) with the wordmark
 * in horizontal, vertical, or standalone configurations.
 *
 * Usage:
 *   // Default — horizontal Nexus lockup
 *   <Logo />
 *
 *   // Vertical stacked
 *   <Logo layout="vertical" iconSize={80} />
 *
 *   // Wedge mark, split-color wordmark
 *   <Logo mark="wedge" wordmarkVariant="split-color" />
 *
 *   // Icon only (e.g. favicon, app icon)
 *   <Logo layout="mark-only" iconSize={32} />
 *
 *   // Wordmark only (e.g. email header)
 *   <Logo layout="wordmark-only" wordmarkVariant="bold" />
 *
 *   // Light background
 *   <Logo onDark={false} wordmarkColor={colors.dark} />
 *
 *   // Print / monochrome
 *   <Logo mono wordmarkColor="black" />
 */
export function Logo({
  mark             = 'nexus',
  layout           = 'horizontal',
  iconSize         = 40,
  wordmarkVariant  = 'split-weight',
  wordmarkColor    = '#ffffff',
  showTagline      = false,
  mono             = false,
  onDark           = true,
  className,
  style,
}: LogoProps) {

  // Wordmark font size scales with icon size
  const wmSize = Math.round(iconSize * 0.58);
  const taglineSize = Math.round(iconSize * 0.18);
  const gap = Math.round(iconSize * 0.30);

  const MarkComponent = mark === 'nexus' ? NexusMark : WedgeMark;

  const markEl = (
    <MarkComponent size={iconSize} mono={mono} onDark={onDark} />
  );

  const wordmarkEl = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(iconSize * 0.16) }}>
      <Wordmark
        size={wmSize}
        variant={wordmarkVariant}
        color={wordmarkColor}
      />
      {showTagline && (
        <span style={{
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontSize:   taglineSize,
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color:      mono
            ? (onDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)')
            : (onDark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.38)'),
          lineHeight: 1,
        }}>
          Where Data Becomes Wisdom
        </span>
      )}
    </div>
  );

  if (layout === 'mark-only') {
    return (
      <div className={className} style={style}>
        {markEl}
      </div>
    );
  }

  if (layout === 'wordmark-only') {
    return (
      <div className={className} style={style}>
        <Wordmark
          size={wmSize}
          variant={wordmarkVariant}
          color={wordmarkColor}
        />
      </div>
    );
  }

  if (layout === 'vertical') {
    return (
      <div
        className={className}
        style={{
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          gap,
          ...style,
        }}
      >
        {markEl}
        {wordmarkEl}
      </div>
    );
  }

  // horizontal (default)
  return (
    <div
      className={className}
      style={{
        display:     'flex',
        flexDirection: 'row',
        alignItems:  'center',
        gap,
        ...style,
      }}
    >
      {markEl}
      {wordmarkEl}
    </div>
  );
}

// ─── Convenience size presets ───────────────────────────────────

/** Navbar / header — 32px icon */
export const LogoNavbar = (props: Omit<LogoProps, 'iconSize'>) =>
  <Logo {...props} iconSize={32} />;

/** Hero / landing — 56px icon */
export const LogoHero = (props: Omit<LogoProps, 'iconSize'>) =>
  <Logo {...props} iconSize={56} />;

/** Favicon — 16px mark only */
export const LogoFavicon = (props: Omit<LogoProps, 'iconSize' | 'layout'>) =>
  <Logo {...props} iconSize={16} layout="mark-only" />;

/** App icon — 128px mark only */
export const LogoAppIcon = (props: Omit<LogoProps, 'iconSize' | 'layout'>) =>
  <Logo {...props} iconSize={128} layout="mark-only" />;
