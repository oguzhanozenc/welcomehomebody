import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDir = path.resolve(__dirname, "src", "posts");
const outputDir = path.resolve(__dirname, "public", "data");

// Vite configuration
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  publicDir: "public",
});

// Function to generate posts JSON
const generatePostsJSON = async () => {
  try {
    // Create the output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    const filenames = await fs.readdir(postsDir);
    const posts = await Promise.all(
      filenames.map(async (filename) => {
        const filePath = path.join(postsDir, filename);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        // Transform markdown content to HTML
        const htmlContent = marked(content);

        // Additional data
        const tags = data.tags || [];

        return {
          title: data.title,
          author: data.author,
          date: data.date,
          thumbnail: data.thumbnail.startsWith("http")
            ? data.thumbnail
            : `${data.thumbnail}`,
          featuredText: data.featuredText,
          content: htmlContent,
          tags: tags,
        };
      })
    );

    // Sort posts by date in descending order (latest to oldest)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Write posts to a JSON file
    await fs.writeFile(
      path.join(outputDir, "posts.json"),
      JSON.stringify(posts, null, 2)
    );

    console.log("Posts JSON generated successfully!");
  } catch (error) {
    console.error("Error generating posts JSON:", error);
  }
};

// Generate initial posts JSON
generatePostsJSON();

// Watch for changes in posts directory
fs.watch(postsDir, async (eventType, filename) => {
  try {
    if (filename) {
      const filePath = path.join(postsDir, filename);
      const exists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);

      switch (eventType) {
        case "rename":
        case "change":
          if (exists) {
            await generatePostsJSON();
          } else {
            // Handle file deletion
            await generatePostsJSON();
          }
          break;
        case "delete":
        case "add":
        case "unlink":
        case "unlinkDir":
          await generatePostsJSON();
          break;
        default:
          console.warn(`Unhandled event type: ${eventType}`);
      }
    }
  } catch (error) {
    console.error("Error occurred while watching for changes:", error);
  }
});
