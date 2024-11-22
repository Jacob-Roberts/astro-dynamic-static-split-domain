import tailwind from '@astrojs/tailwind';
import { createResolver } from 'astro-integration-kit';
import { hmrIntegration } from 'astro-integration-kit/dev';
import { defineConfig } from 'astro/config';

const { default: dynamicStaticSplitDomain } = await import(
	'astro-dynamic-static-split-domain'
);

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		dynamicStaticSplitDomain({
			dynamicBase: 'https://dynamic.example',
		}),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve('../package/dist'),
		}),
	],
});
