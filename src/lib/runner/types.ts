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

export interface Runner {
    run(
        code: string,
        testCases: TestCase[],
        entryPoint?: string,
    ): Promise<RunnerOutput>;

    terminate?(): void;
}
