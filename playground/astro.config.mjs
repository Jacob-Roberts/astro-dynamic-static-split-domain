import node from '@astrojs/node';
import dynamicStaticSplitDomain from 'astro-dynamic-static-split-domain';
// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	adapter: node({
		mode: 'standalone',
	}),
	integrations: [
		dynamicStaticSplitDomain({
			dynamicBase: 'https://api.mysite.com',
		}),
	],
});
