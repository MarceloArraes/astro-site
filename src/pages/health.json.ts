// Health check endpoint for monitoring
// Returns status of the site and Sanity connection

import type { APIRoute } from 'astro';
import { sanityClient } from 'sanity:client';

export const GET: APIRoute = async () => {
	const healthStatus: {
		status: string;
		timestamp: string;
		sanity: {
			connected: boolean;
			error: string | null;
		};
	} = {
		status: 'healthy',
		timestamp: new Date().toISOString(),
		sanity: {
			connected: false,
			error: null,
		},
	};

	// Check Sanity connection
	try {
		await sanityClient.fetch('*[_type == "blogPost"] | order(_createdAt desc)[0..1]');
		healthStatus.sanity.connected = true;
	} catch (error) {
		healthStatus.sanity.error = error instanceof Error ? error.message : 'Unknown error';
		healthStatus.status = 'degraded';
	}

	return new Response(JSON.stringify(healthStatus, null, 2), {
		status: healthStatus.status === 'healthy' ? 200 : 503,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache',
		},
	});
};
