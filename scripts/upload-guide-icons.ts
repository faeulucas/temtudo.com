import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";

const files = [
  "guide-health.webp",
  "guide-security.webp",
  "guide-emergencies.webp",
  "guide-workshops.webp",
  "guide-services.webp",
  "guide-businesses.webp",
].map((f) => path.join("client/public/icons/things", f));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function run() {
  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.warn("skip (not found):", file);
      continue;
    }
    const res = await cloudinary.uploader.upload(file, {
      folder: process.env.CLOUDINARY_FOLDER || "norte-vivo/icons",
      resource_type: "image",
      overwrite: true,
      use_filename: true,
      unique_filename: false,
    });
    console.log(path.basename(file), "=>", res.secure_url);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
