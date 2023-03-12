import styles from "./App.module.scss";

import gradientize from "../gradientize/gradientize";
import AppLine from "./AppLine";

type ImportedFile = {
  key: string;
  asset: string;
};

const importAll = (context: any): ImportedFile[] =>
  context
    .keys()
    .map((item: string, index: any) => ({
      key: item.replace("./", ""),
      asset: context(item),
    }))
    .sort((a: ImportedFile, b: ImportedFile) => a.key > b.key);

// @ts-ignore
const images = importAll(require.context("../assets/", false, /\.(png|jpe?g|svg)$/));

const App = () => {
  return (
    <section className={styles.app}>
      <header className={styles.header}>Gradientize</header>
      <main className={styles.main}>
        {images.map(({ key, asset }) => (
          <AppLine key={key} image={asset} gradientize={gradientize} />
        ))}
      </main>
    </section>
  );
};

export default App;
