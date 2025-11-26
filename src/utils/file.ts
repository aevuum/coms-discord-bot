import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

export const importModule = async (relativePath: string) => {
	const absolutePath = join(import.meta.dirname, relativePath);
	const url = pathToFileURL(absolutePath).href;
	return await import(url);
};
