/**
 * Generate table of contents from markdown/html content
 */
export interface TOCItem {
	id: string;
	text: string;
	level: number;
}

export function generateTOC(content: string): TOCItem[] {
	const toc: TOCItem[] = [];

	// Match markdown headings: # Heading, ## Heading, etc.
	const headingRegex = /^(#{1,6})\s+(.+)$/gm;
	let match;

	while ((match = headingRegex.exec(content)) !== null) {
		const level = match[1].length;
		const text = match[2].trim();
		// Generate ID from heading text
		const id = text
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/^-+|-+$/g, '');

		// Only include h2 and h3 (## and ###)
		if (level >= 2 && level <= 3) {
			toc.push({ id, text, level });
		}
	}

	return toc;
}
