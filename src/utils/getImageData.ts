export const getImageData = (img: HTMLImageElement, size = 60) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = size;
  canvas.height = size;

  ctx?.drawImage(img, 0, 0, size, size);
  return ctx?.getImageData(0, 0, size, size);
};
