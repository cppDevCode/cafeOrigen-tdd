import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const backendDir = fileURLToPath(
    new URL('../../../backend/', import.meta.url)
);

export function prepararDatos(): void {
    execFileSync('pnpm', ['seed'], {
        cwd: backendDir,
        stdio: 'pipe',
        env: {
        ...process.env,
        NODE_ENV: 'development',
        DB_HOST: 'localhost',
        DB_PORT: '5433'
        },
        shell: process.platform === 'win32'
    });
}