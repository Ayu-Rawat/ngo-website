import React from 'react';
import styles from '../styles/Home.module.css';
import ExampleComponent from '../components/ExampleComponent';

const Home: React.FC = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Hello World 1 2 3</h1>
            <ExampleComponent />
        </div>
    );
};

export default Home;