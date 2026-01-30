import { TestCase } from "@/types/problem";
import { Runner, RunnerOutput } from "./types";

export class PythonRunner implements Runner {
    private worker: Worker | null = null;
    private timeoutId: NodeJS.Timeout | null = null;

    async run(
        code: string,
        testCases: TestCase[],
        entryPoint: string = 'solution',
    ): Promise<RunnerOutput> {
        return new Promise((resolve, reject) => {
            if (this.worker) {
                this.worker.terminate();
            }

            this.worker = new Worker('/python-worker.js');

            // 15s timeout for Python (loading pyodide can take time initially)
            const timeoutDuration = 15000;

            const timeoutId = setTimeout(() => {
                this.worker?.terminate();
                reject(new Error(`Execution timed out (${timeoutDuration / 1000}s limit)`));
            }, timeoutDuration);

            this.worker.onmessage = (e) => {
                clearTimeout(timeoutId);
                const { results, logs, error } = e.data;
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve({ results, logs });
                }
            };

            this.worker.onerror = (e) => {
                clearTimeout(timeoutId);
                reject(new Error(`Worker Error: ${e.message}`));
            };

            this.worker.postMessage({ code, testCases, entryPoint });
        });
    }

    terminate() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
    }
}
