/**
 * Calculate reading time for content
 * Based on average reading speed of ~200-250 words per minute
 */
export function calculateReadingTime(content: string): number {
	const wordsPerMinute = 225;
	const wordCount = content.trim().split(/\s+/).length;
	const minutes = Math.ceil(wordCount / wordsPerMinute);
	return Math.max(1, minutes); // Minimum 1 minute
}
