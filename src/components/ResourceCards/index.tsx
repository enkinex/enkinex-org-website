import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

/**
 * A row of resource cards for library docs pages.
 *
 * Same title block as the landing catalog — a bordered sheet split by a
 * hairline into an icon cell and a name/reference row — shrunk to a
 * three-across strip and made clickable end to end. Drop it under the
 * intro of any library sheet:
 *
 *   import ResourceCards from '@site/src/components/ResourceCards';
 *
 *   <ResourceCards items={[
 *     {title: 'Library Code', icon: 'package', accent: 'teal',
 *      href: 'https://github.com/enkinex/enkinex-odcs',
 *      meta: 'GitHub', description: 'The KCL schema library.'},
 *   ]} />
 */

type Accent = 'teal' | 'blue' | 'gold';

export type ResourceCard = {
  title: string;
  /** Title-block reference line, lettered small under the name. */
  meta: string;
  description: string;
  href: string;
  icon: IconName;
  accent: Accent;
};

/* Tabler icons (MIT), inlined as path markup — https://tabler.io/icons */
const ICON_PATHS = {
  package: (
    <>
      <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
      <path d="M12 12l8 -4.5" />
      <path d="M12 12l0 9" />
      <path d="M12 12l-8 -4.5" />
      <path d="M16 5.25l-8 4.5" />
    </>
  ),
  'brand-github': (
    <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
  ),
  'book-2': (
    <>
      <path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12" />
      <path d="M19 16h-12a2 2 0 0 0 -2 2" />
      <path d="M9 8h6" />
    </>
  ),
} satisfies Record<string, ReactNode>;

type IconName = keyof typeof ICON_PATHS;

function CardIcon({name}: {name: IconName}): React.ReactElement {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  );
}

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

function Card({card}: {card: ResourceCard}): React.ReactElement {
  const body = (
    <>
      <span className={styles.iconCell} aria-hidden="true">
        <CardIcon name={card.icon} />
      </span>
      <span className={styles.nameCell}>
        <Heading as="h4" className={styles.name}>
          {card.title}
        </Heading>
        <span className={styles.ref}>
          {card.meta} <span aria-hidden="true">{isExternal(card.href) ? '↗' : '→'}</span>
        </span>
      </span>
    </>
  );

  return (
    <article className={`${styles.card} ${styles[card.accent]}`}>
      {isExternal(card.href) ? (
        <a className={styles.head} href={card.href} target="_blank" rel="noopener noreferrer">
          {body}
        </a>
      ) : (
        <Link className={styles.head} to={card.href}>
          {body}
        </Link>
      )}
      <p className={styles.desc}>{card.description}</p>
    </article>
  );
}

export default function ResourceCards({items}: {items: ResourceCard[]}): React.ReactElement {
  return (
    <div className={styles.grid}>
      {items.map((card) => (
        <Card key={card.href} card={card} />
      ))}
    </div>
  );
}
