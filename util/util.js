import fs from "fs";
import path from "path";
import os from "os";
import fetch from "node-fetch";
import JimpPkg from "jimp";

const { read } = JimpPkg;

// filterImageFromURL
export async function filterImageFromURL(inputURL) {
  const response = await fetch(inputURL);

  if (!response.ok) {
    throw new Error("Invalid image URL");
  }

  const buffer = await response.buffer();
  const image = await read(buffer);

  const outpath = path.join(
    os.tmpdir(),
    `filtered.${Math.floor(Math.random() * 2000)}.jpg`
  );

  await image
    .resize(256, 256)
    .quality(60)
    .greyscale()
    .writeAsync(outpath);

  return outpath;
}

// deleteLocalFiles
export async function deleteLocalFiles(files) {
  for (const file of files) {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    } catch (_) {
      // ignore cleanup errors
    }
  }
}
