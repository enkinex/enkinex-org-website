import type {ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import LibraryCatalog from '@site/src/components/LibraryCatalog';

import styles from './index.module.css';

export default function Home(): ReactNode {
  return (
    <Layout description="Semantic & Governance as Code — Three foundational pillars converge at the Enkinex Framework.">
      <main className={styles.hero}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowTick} aria-hidden="true" />
          Semantic &amp; Governance as Code
        </p>

        <Heading as="h1" className={styles.title}>
          Three foundational pillars
          <br className={styles.brThree} /> converge at
          <br className={styles.brTwo} /> the{' '}
          <span className={styles.titleTeal}>Enkinex&nbsp;Framework</span>.
        </Heading>

        <div className={styles.board}>
          <i className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
          <i className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
          <i className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
          <i className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />
          <BrowserOnly fallback={<div className={styles.diagramFallback} />}>
            {() => {
              const ConvergenceDiagram =
                require('@site/src/components/ConvergenceDiagram').default;
              return <ConvergenceDiagram />;
            }}
          </BrowserOnly>
        </div>

        <div className={styles.cta}>
          <Link className={styles.ctaBtn} to="/docs/why-enkinex">
            Why Enkinex
          </Link>
          <Link className={`${styles.ctaBtn} ${styles.ctaBtnAccent}`} to="/docs/architecture">
            Architecture Tour
          </Link>
        </div>
      </main>

      <LibraryCatalog />
    </Layout>
  );
}
