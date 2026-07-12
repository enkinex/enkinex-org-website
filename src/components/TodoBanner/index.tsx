import React, {type ReactNode} from 'react';

import styles from './styles.module.css';

/**
 * The common #TODO banner for docs that are drafted but not yet written.
 * Drop it right under the page title in any MDX file:
 *
 *   import TodoBanner from '@site/src/components/TodoBanner';
 *
 *   <TodoBanner>What this page will cover, in one or two sentences.</TodoBanner>
 *
 * The children are optional — without them the banner shows only the
 * default drafting-board note.
 */
export default function TodoBanner({children}: {children?: ReactNode}): React.ReactElement {
  return (
    <aside className={styles.banner}>
      <span className={styles.stamp} aria-hidden="true">
        #TODO
      </span>
      <div className={styles.body}>
        <p className={styles.note}>
          This sheet is still on the drafting board — the content lands here as the library
          matures.
        </p>
        {children && <div className={styles.scope}>{children}</div>}
      </div>
    </aside>
  );
}
