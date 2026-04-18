import rss from '@astrojs/rss';
import { sanityClient } from 'sanity:client';
import type { BlogPost } from '../Sanity';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context: { site: string }) {
	let posts: BlogPost[] = [];

	try {
		posts = await sanityClient.fetch(
			`*[_type=='blogPost'] | order(publishedAt desc)[0..20]`,
		);
	} catch (error) {
		console.warn('Failed to fetch posts for RSS feed:', error);
		// Return empty feed if Sanity is unavailable (e.g., during local build)
	}

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.title,
			description: post.author,
			pubDate: new Date(post.publishedAt || post._createdAt),
			link: `/sanity-blog/${post._id}/`,
		})),
	});
}
