import type {ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

export default function Home(): ReactNode {
  return (
    <Layout description="Semantic & Governance as Code — three foundational pillars converge at the Enkinex API to establish a semantic-driven framework.">
      <main className={styles.hero}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowTick} aria-hidden="true" />
          Semantic &amp; Governance as Code
        </p>

        <Heading as="h1" className={styles.title}>
          Three foundational pillars converge at the{' '}
          <span className={styles.titleTeal}>Enkinex&nbsp;Framework</span>.
        </Heading>

        <div className={styles.board}>
          <i className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
          <i className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
          <i className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
          <i className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />
          <span className={styles.figLabel}>fig. 01 · convergence</span>
          <BrowserOnly fallback={<div className={styles.diagramFallback} />}>
            {() => {
              const ConvergenceDiagram =
                require('@site/src/components/ConvergenceDiagram').default;
              return <ConvergenceDiagram />;
            }}
          </BrowserOnly>
        </div>
      </main>
    </Layout>
  );
}
