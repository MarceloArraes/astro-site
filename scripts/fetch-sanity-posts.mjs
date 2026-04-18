/**
 * Fetch all blog posts from Sanity and save as markdown files
 *
 * Usage: node scripts/fetch-sanity-posts.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env file manually
const envPath = path.join(rootDir, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#][^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

const SANITY_PROJECT_ID = process.env.VITE_SANITY_PROJECT_ID;
const OUTPUT_DIR = path.join(rootDir, 'blogmdfiles');

if (!SANITY_PROJECT_ID) {
  console.error('Error: VITE_SANITY_PROJECT_ID not found in .env file');
  process.exit(1);
}

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created directory: ${OUTPUT_DIR}`);
}

async function fetchSanityPosts() {
  const query = `*[_type=='blogPost'] | order(_createdAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    author,
    publishedAt,
    mdxContent
  }`;

  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/production?query=${encodeURIComponent(query)}`;

  console.log(`Fetching posts from Sanity project: ${SANITY_PROJECT_ID}`);
  console.log(`URL: ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sanity API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    if (!data.result || !Array.isArray(data.result)) {
      throw new Error('Unexpected response format from Sanity API');
    }

    return data.result;
  } catch (error) {
    console.error('Failed to fetch posts:', error.message);
    throw error;
  }
}

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

function generateFrontmatter(post) {
  const lines = [
    '---',
    `title: "${(post.title || 'Untitled').replace(/"/g, '\\"')}"`,
    `slug: "${post.slug?.current || sanitizeFilename(post.title || 'untitled')}"`,
  ];

  if (post.author) {
    lines.push(`author: "${post.author.replace(/"/g, '\\"')}"`);
  }

  if (post.publishedAt) {
    lines.push(`publishedAt: "${post.publishedAt}"`);
  }

  if (post._createdAt) {
    lines.push(`createdAt: "${post._createdAt}"`);
  }

  if (post._updatedAt) {
    lines.push(`updatedAt: "${post._updatedAt}"`);
  }

  lines.push('---');
  lines.push('');

  return lines.join('\n');
}

function savePostToFile(post, index) {
  const frontmatter = generateFrontmatter(post);
  const content = post.mdxContent || '';
  const filename = `${sanitizeFilename(post.title || `post-${index}`)}.md`;
  const filepath = path.join(OUTPUT_DIR, filename);

  const fullContent = frontmatter + content;

  fs.writeFileSync(filepath, fullContent, 'utf-8');

  return {
    title: post.title || 'Untitled',
    filename,
    filepath
  };
}

async function main() {
  console.log('Starting Sanity blog post fetch...\n');

  let posts;
  try {
    posts = await fetchSanityPosts();
  } catch (error) {
    console.error('\nFailed to fetch posts from Sanity.');
    console.error('Make sure your .env file has the correct VITE_SANITY_PROJECT_ID');
    process.exit(1);
  }

  if (posts.length === 0) {
    console.log('\nNo blog posts found in Sanity.');
    return;
  }

  console.log(`Found ${posts.length} blog post(s)\n`);

  const savedFiles = [];

  posts.forEach((post, index) => {
    const result = savePostToFile(post, index);
    savedFiles.push(result);
    console.log(`  [${index + 1}/${posts.length}] Saved: ${result.filename}`);
  });

  console.log(`\nDone! Saved ${savedFiles.length} blog post(s) to: ${OUTPUT_DIR}`);
}

main().catch(console.error);
