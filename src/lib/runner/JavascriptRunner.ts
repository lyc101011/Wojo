import { TestCase } from "@/types/problem";

export interface ExecutionResult {
    id?: string;
    status: "passed" | "failed" | "error";
    input?: any[];
    expected?: any;
    actual?: any;
    error?: string;
    time?: number;
    memory?: number;
}

export interface RunnerOutput {
    results: ExecutionResult[];
    logs: string[];
}

export class JavascriptRunner {
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

            this.worker = new Worker('/wasm-worker.js');

            const timeoutId = setTimeout(() => {
                this.worker?.terminate();
                reject(new Error("Execution timed out (10s limit)"));
            }, 10000);

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

    private cleanup() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
    }
}
