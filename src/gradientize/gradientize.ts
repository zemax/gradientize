export type Gradient = {
  gradient: string;
  debug?: string;
};

export type Color = number[];

const CENTER_SIZE = 35;
const GRADIENT_SPREAD = 60;
const BLACK = [0, 0, 0];

const rgba = (c: Color, alpha = 1) => (alpha === 1 ? `rgb(${c.join(",")})` : `rgba(${[...c, alpha].join(",")})`);

const dominantColor = (colors: Color[]): Color => {
  const c = colors.reduce((c, nc) => [c[0] + nc[0], c[1] + nc[1], c[2] + nc[2]], BLACK).map((c) => Math.max(0, Math.min(255, Math.round(c / colors.length))));

  return c;
};

const gradientize = (imageData: ImageData): Gradient => {
  const { width, height } = imageData;
  const hWidth = width >> 1;
  const hHeight = height >> 1;

  const center = 0.5 - 0.5 * 0.01 * CENTER_SIZE;
  const xMainColorMin = Math.round(center * width);
  const xMainColorMax = width - xMainColorMin;
  const yMainColorMin = Math.round(center * height);
  const yMainColorMax = height - yMainColorMin;

  const centerPixels: Color[] = [];
  const quarterPixels: Color[][] = [[], [], [], []];

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const i = 4 * (y * width + x);
      const c: Color = [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]];

      const xq = x < hWidth ? 0 : 1;
      const yq = y < hHeight ? 0 : 1;

      quarterPixels[yq * 2 + xq].push(c);

      if (x > xMainColorMin && x < xMainColorMax && y > yMainColorMin && y < yMainColorMax) {
        centerPixels.push(c);
      }
    }
  }

  const centerColor = dominantColor(centerPixels);
  const quarterColors = quarterPixels.map((pixels) => dominantColor(pixels));

  const [tl, tr, bl, br] = quarterColors;

  const a = 0;
  const s = `${GRADIENT_SPREAD}%`;
  const d = [
    `linear-gradient(${rgba(centerColor)}, ${rgba(centerColor)}) no-repeat center / ${100 - 2 * center * 100}% ${100 - 2 * center * 100}%`,
    `linear-gradient(to right, ${rgba(tl)} 50%, ${rgba(tr)} 50%) no-repeat 0 0 / 100% 50%`,
    `linear-gradient(to right, ${rgba(bl)} 50%, ${rgba(br)} 50%) no-repeat`,
  ].join(", ");

  const g = [
    `linear-gradient(to right top,${rgba(bl)},${rgba(bl, 0)} ${s})`,
    `linear-gradient(to left top,${rgba(br)},${rgba(br, 0)} ${s})`,
    `linear-gradient(to left bottom,${rgba(tr)},${rgba(tr, 0)} ${s})`,
    `linear-gradient(to right bottom,${rgba(tl)},${rgba(tl, 0)} ${s})`,
    `${rgba(centerColor)}`,
  ].join(", ");

  return { gradient: g, debug: d };
};

export default gradientize;
