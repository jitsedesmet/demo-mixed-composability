import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

function buildEnginePlugin() {
	return {
		name: 'build-engine',
		config() {
			try {
				execSync('cd comunica && yarn install --production=false && cd ..', { stdio: 'inherit' });
			} catch (e) {
				throw new Error(`build:engine failed: ${e instanceof Error ? e.message : e}`);
			}
		}
	};
}

export default defineConfig({
	plugins: [buildEnginePlugin(), sveltekit()],
	resolve: {
		preserveSymlinks: true
	},
	server: {
		fs: {
			allow: [fileURLToPath(new URL('./comunica', import.meta.url))]
		}
	}
});
