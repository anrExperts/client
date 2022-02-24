import path from 'path';
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

import { optimizeImports, elements, icons, pictograms } from 'carbon-preprocess-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		optimizeImports(),
		elements(),
		icons(),
		pictograms(),
		preprocess()
	],

	kit: {
		adapter: adapter(),
		
		vite: {
			resolve: {
				alias: {
					$components: path.resolve('./src/components'),
				}
			}
		}
	}
};

export default config;
