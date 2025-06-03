/**
 * This script checks if all required SOGS data files exist
 */

const requiredFiles = [
  "meta.json",
  "means_l.webp",
  "means_u.webp",
  "quats.webp",
  "scales.webp",
  "sh0.webp",
  "opacities.webp",
  "shN_centroids.webp",
  "shN_labels.webp",
];

async function checkDataFiles() {
  console.log("Checking for SOGS data files...");
  const dataPath = "./data";

  const results = await Promise.all(
    requiredFiles.map(async (file) => {
      const url = `${dataPath}/${file}`;
      try {
        const response = await fetch(url, { method: "HEAD" });
        const exists = response.ok;
        console.log(`${file}: ${exists ? "✓" : "✗"}`);
        return { file, exists };
      } catch (error) {
        console.error(`Error checking ${file}:`, error);
        return { file, exists: false };
      }
    })
  );

  const missingFiles = results.filter((r) => !r.exists).map((r) => r.file);

  if (missingFiles.length > 0) {
    console.error(`Missing required files: ${missingFiles.join(", ")}`);
    return false;
  } else {
    console.log("All required files found!");
    return true;
  }
}

// Export the check function
export { checkDataFiles };
