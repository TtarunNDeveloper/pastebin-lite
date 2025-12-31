import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Pastebin Lite</h1>
      <p>Use the API to create and view pastes.</p>
    </main>
    </div>
  );
}
