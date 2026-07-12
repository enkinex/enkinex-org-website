import React from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

/**
 * Enkinex Libraries — the landing catalog.
 *
 * Each library is drawn as an engineer's title block: a bordered sheet
 * divided by hairlines into an icon cell, a name/reference row, the
 * description field, and a bottom strip of link cells. Groups follow the
 * three framework pillars and reuse their colours (gold / teal / blue).
 * Unstarted libraries carry a #TODO stamp and link only to internal docs.
 */

const GOLD = 'var(--ekx-gold)';
const TEAL = 'var(--ekx-teal)';
const BLUE = 'var(--ekx-blue)';

type LibraryStatus = 'in-progress' | 'todo';

type Library = {
  name: string;
  /** Drawing number lettered in the title block. */
  ref: string;
  version?: string;
  description: string;
  docs: string;
  standard?: string;
  github?: string;
  status: LibraryStatus;
};

type Group = {
  title: string;
  color: string;
  items: Library[];
};

const GROUPS: Group[] = [
  {
    title: 'Semantic Driven Design',
    color: GOLD,
    items: [
      {
        name: 'Enkinex Ossie',
        ref: 'SDD-01',
        version: '0.2.0.dev0',
        description:
          'Typed KCL schemas for the Apache Ossie core metadata specification — author and validate semantic models exchanged across the analytics, AI, and BI ecosystem.',
        docs: '/docs/semantic/ossie/overview',
        standard: 'https://github.com/apache/ossie',
        github: 'https://github.com/enkinex/enkinex-ossie',
        status: 'in-progress',
      },
      {
        name: 'Enkinex OKF',
        ref: 'SDD-02',
        version: 'v0.1-draft',
        description:
          'A modular KCL implementation of the Open Knowledge Format — author, type-check, and validate vendor-neutral knowledge shipped as plain Markdown with YAML frontmatter, readable by humans and agents alike.',
        docs: '/docs/semantic/okf/overview',
        standard: 'https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf',
        github: 'https://github.com/enkinex/enkinex-okf',
        status: 'in-progress',
      },
    ],
  },
  {
    title: 'Contract Driven Lifecycle',
    color: TEAL,
    items: [
      {
        name: 'Enkinex ODCS',
        ref: 'CDL-01',
        version: 'v3.1.0-draft',
        description:
          'A modular KCL implementation of the Open Data Contract Standard — author, type-check, and validate data contracts as governance-as-code.',
        docs: '/docs/governance/odcs/overview',
        standard: 'https://github.com/bitol-io/open-data-contract-standard',
        github: 'https://github.com/enkinex/enkinex-odcs',
        status: 'in-progress',
      },
      {
        name: 'Enkinex ODPS',
        ref: 'CDL-02',
        version: 'v1.0.0-draft',
        description:
          'A modular KCL implementation of the Open Data Product Standard — describe, type-check, and validate data products across their lifecycle.',
        docs: '/docs/governance/odps/overview',
        standard: 'https://github.com/bitol-io/open-data-product-standard',
        github: 'https://github.com/enkinex/enkinex-odps',
        status: 'in-progress',
      },
    ],
  },
  {
    title: 'Composable Flow Architecture',
    color: BLUE,
    items: [
      {
        name: 'Enkinex Pipelines',
        ref: 'CFA-01',
        description: 'Higher level adapters for emerging declarative approaches.',
        docs: '/docs/composable-architecture/pipelines/overview',
        status: 'todo',
      },
      {
        name: 'Enkinex Applications',
        ref: 'CFA-02',
        description: 'KCL standard cloud-native and OpenAPI applications.',
        docs: '/docs/composable-architecture/applications/overview',
        status: 'todo',
      },
    ],
  },
];

/* Tabler `package` (MIT) — the catalog's standard library icon. */
function PackageIcon({color}: {color: string}) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
      <path d="M12 12l8 -4.5" />
      <path d="M12 12l0 9" />
      <path d="M12 12l-8 -4.5" />
      <path d="M16 5.25l-8 4.5" />
    </svg>
  );
}

function LibraryCard({lib, color}: {lib: Library; color: string}) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHead}>
        <span className={styles.iconCell} aria-hidden="true">
          <PackageIcon color={color} />
        </span>
        <div className={styles.nameCell}>
          <Heading as="h4" className={styles.name}>
            {lib.name}
          </Heading>
          <span className={styles.ref}>
            {lib.ref}
            {lib.version ? ` · ${lib.version}` : ''} · KCL
          </span>
        </div>
        {lib.status === 'todo' ? (
          <span className={styles.stampTodo}>#TODO</span>
        ) : (
          <span className={styles.chipProgress}>In progress</span>
        )}
      </div>
      <p className={styles.desc}>{lib.description}</p>
      <div className={styles.linkRow}>
        <Link className={styles.linkCell} to={lib.docs}>
          Docs <span aria-hidden="true">→</span>
        </Link>
        {lib.standard && (
          <a className={styles.linkCell} href={lib.standard} target="_blank" rel="noopener noreferrer">
            Standard <span aria-hidden="true">↗</span>
          </a>
        )}
        {lib.github && (
          <a className={styles.linkCell} href={lib.github} target="_blank" rel="noopener noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function LibraryCatalog(): React.ReactElement {
  return (
    <section className={styles.catalog} id="libraries">
      <p className={styles.eyebrow}>
        <span className={styles.eyebrowTick} aria-hidden="true" />
        Enkinex Libraries
      </p>
      <Heading as="h2" className={styles.title}>
        A curated catalog of KCL libraries
      </Heading>
      <p className={styles.lead}>
        Each pillar of the framework is delivered as typed, composable KCL code module.
      </p>

      {GROUPS.map((group) => (
        <div key={group.title} className={styles.group}>
          <div className={styles.groupHead}>
            <span className={styles.groupTick} style={{background: group.color}} aria-hidden="true" />
            <Heading as="h3" className={styles.groupTitle}>
              {group.title}
            </Heading>
            <span className={styles.groupRule} aria-hidden="true" />
          </div>
          <div className={styles.grid}>
            {group.items.map((lib) => (
              <LibraryCard key={lib.ref} lib={lib} color={group.color} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
