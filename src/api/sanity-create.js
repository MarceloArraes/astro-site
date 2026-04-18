/**
 * Cloudflare Worker / Serverless Function for creating Sanity posts
 *
 * Deploy options:
 * 1. Cloudflare Workers: wrangler deploy
 * 2. As a route in Astro with Node adapter
 * 3. Any serverless platform that supports fetch
 *
 * Environment variables needed:
 * - SANITY_PROJECT_ID
 * - SANITY_API_TOKEN (must be a write token from sanity.io/manage)
 * - ADMIN_SECRET (your custom secret for auth)
 */

export default {
	async fetch(request, env) {
		// Only accept POST requests
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		// Check admin secret
		const adminSecret = request.headers.get('X-Admin-Secret');
		if (!adminSecret || adminSecret !== env.ADMIN_SECRET) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Parse request body
		let body;
		try {
			body = await request.json();
		} catch (e) {
			return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Validate required fields
		if (!body.title || !body.mdxContent) {
			return new Response(JSON.stringify({ error: 'Title and content are required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Build Sanity document
		const document = {
			_type: 'blogPost',
			title: body.title,
			mdxContent: body.mdxContent,
			author: body.author || 'Anonymous',
			publishedAt: body.publishedAt || new Date().toISOString(),
			slug: body.slug
				? { _type: 'slug', current: body.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
				: { _type: 'slug', current: body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 50) },
		};

		// Create document in Sanity
		const response = await fetch(
			`https://${env.SANITY_PROJECT_ID}.api.sanity.io/v1/data/muts/production`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${env.SANITY_API_TOKEN}`,
				},
				body: JSON.stringify({
					mutations: [
						{ create: document }
					]
				}),
			}
		);

		const result = await response.json();

		if (!response.ok) {
			return new Response(JSON.stringify({ error: result.message || 'Failed to create post' }), {
				status: response.status,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Trigger rebuild webhook (optional - if you want auto-rebuild)
		if (env.COOLIFY_DEPLOYMENT_HOOK && env.COOLIFY_API_TOKEN) {
			try {
				await fetch(env.COOLIFY_DEPLOYMENT_HOOK, {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${env.COOLIFY_API_TOKEN}`,
					},
				});
			} catch (e) {
				console.error('Failed to trigger rebuild:', e);
				// Don't fail the request if rebuild fails
			}
		}

		return new Response(JSON.stringify({
			success: true,
			id: result.results[0].document._id
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	},
};
