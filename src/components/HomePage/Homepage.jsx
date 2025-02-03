import HomePageCanvas from "../HomePageCanvas/HomePageCanvas";
import styles from "./styles.module.css";
const HomePage = () => {
  return (
    <div className={styles.homepage}>
      <HomePageCanvas className={styles.homepageCanvas} />
      <div className={styles.title}>
        <h1>CREATIVE STUDIO</h1>
      </div>
    </div>
  );
};

export default HomePage;
