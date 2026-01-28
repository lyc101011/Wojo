import fs from 'fs';
import path from 'path';
import { Problem } from '@/types/problem';

if (!process.env.WOJO_PROBLEMS_DIR) {
    throw new Error('Missing environment variable: WOJO_PROBLEMS_DIR. Please check your .env file or configuration.');
}

const PROBLEMS_DIR = path.resolve(process.cwd(), process.env.WOJO_PROBLEMS_DIR);

export function getProblems(): Problem[] {
    if (!fs.existsSync(PROBLEMS_DIR)) {
        return [];
    }
    const files = fs.readdirSync(PROBLEMS_DIR);
    const problems: Problem[] = [];

    for (const file of files) {
        if (file.endsWith('.json')) {
            try {
                const content = fs.readFileSync(path.join(PROBLEMS_DIR, file), 'utf-8');
                const problem = JSON.parse(content) as Problem;
                problems.push(problem);
            } catch (error) {
                console.error(`Failed to load problem from ${file}:`, error);
            }
        }
    }
    return problems;
}

export function getProblem(id: string): Problem | undefined {
    const problems = getProblems();
    return problems.find((p) => p.id === id);
}
