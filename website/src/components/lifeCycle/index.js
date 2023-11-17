import React from 'react'
import styles from './styles.module.css';

export default function Lifecycle(props) {
    return (
        <span className={styles.lifecycle}>{props.status}</span>
    );
}
