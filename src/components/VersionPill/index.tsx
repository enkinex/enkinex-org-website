import React from 'react';

import styles from './styles.module.css';

/**
 * A title-block stamp for the current release of a library sheet.
 * Two cells split by a hairline — the field label, then the value:
 *
 *   <VersionPill label="Current version" value="v3.1.0" />
 */
export default function VersionPill({
  label = 'Current version',
  value,
}: {
  label?: string;
  value: string;
}): React.ReactElement {
  return (
    <span className={styles.pill}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </span>
  );
}
