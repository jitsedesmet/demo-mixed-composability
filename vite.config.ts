import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { execSync } from 'child_process';

function buildEnginePlugin() {
	return {
		name: 'build-engine',
		config() {
			try {
				execSync('cd comunica && yarn install && cd ..', { stdio: 'inherit' });
			} catch (e) {
				throw new Error(`build:engine failed: ${e instanceof Error ? e.message : e}`);
			}
		}
	};
}

export default defineConfig({
	plugins: [buildEnginePlugin(), sveltekit()]
});
