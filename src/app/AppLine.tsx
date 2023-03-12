import { useRef, useState } from "react";
import styles from "./AppLine.module.scss";

import { getImageData } from "../utils/getImageData";
import { Gradient } from "../gradientize/gradientize";

const AppLine = ({ image, gradientize }: { image: any; gradientize: (imageData: ImageData) => Gradient }) => {
  const [gradient, setGradient] = useState<Gradient>({ gradient: "", debug: "" });
  const imageRef = useRef<HTMLImageElement>(null);

  const buildGradients = (gradientize: (imageData: ImageData) => Gradient) => {
    const img = imageRef.current;
    if (!img) {
      return;
    }

    const imageData = getImageData(img);
    if (!imageData) {
      return;
    }

    setGradient(gradientize(imageData));
  };

  return (
    <section className={styles.line}>
      <div>
        <img ref={imageRef} src={image} alt="" onClick={() => buildGradients(gradientize)} />
      </div>
      <div style={{ background: gradient.debug }}></div>
      <div style={{ background: gradient.gradient }}></div>
    </section>
  );
};

export default AppLine;
