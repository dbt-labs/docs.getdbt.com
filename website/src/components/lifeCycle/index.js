import React from 'react'
import styles from './styles.module.css';

// function Item ({ status }) {
//     if (status) {
//         return null;
//     }
    
//     return <span className={styles.lifecycle}>{status}</span>;
// }

export default function Lifecycle(props) {
    if (!props.status) {
        return null;
    }
    return (
        <span className={styles.lifecycle}>{props.status}</span>
    );
}
