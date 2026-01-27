
export interface TestCase {
    id: string;
    input: any[]; // Arguments to pass to the function
    expected: any; // Expected return value
    isHidden?: boolean; // If true, don't show expected output to user on failure
}

export interface ProblemTemplate {
    language: string;
    code: string;
}

export interface Problem {
    id: string;
    title: string;
    description: string; // Markdown supported
    difficulty: "Easy" | "Medium" | "Hard";
    tags: string[];
    templates: ProblemTemplate[];
    validationTestCases: TestCase[]; // For "Run Code" - usually visible
    testCases: TestCase[]; // For "Submit" - comprehensive and hidden
    entryFunctionName?: string; // The name of the function to call (e.g. "twoSum")
    referenceAnswer?: {
        language: string;
        code: string;
    };
}
