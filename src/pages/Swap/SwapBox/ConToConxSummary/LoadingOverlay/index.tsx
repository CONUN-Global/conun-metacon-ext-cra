import React from 'react'
import Spinner from 'src/components/Spinner'

import styles from "./LoadingOverlay.module.scss"

function LoadingOverlay() {
  return (
    <div className={styles.LoadingOverlay}>
      <Spinner/>
    </div>
  )
}

export default LoadingOverlay
