import React from 'react';
import ImageAnnotationTool from './components.js/ImageAnnotationTool';
import styles from '../src/App.module.css';

function App() {
  return (
    <div className={styles.myApp}>
      <ImageAnnotationTool />
    </div>
  );
}

export default App;
