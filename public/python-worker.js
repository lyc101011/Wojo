// public/python-worker.js
importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');

async function loadPyodideAndPackages() {
    self.pyodide = await loadPyodide();
    // await self.pyodide.loadPackage(['numpy']); // Example if needed later
}

let pyodideReadyPromise = loadPyodideAndPackages();

self.onmessage = async function (e) {
    await pyodideReadyPromise;
    const { code, testCases, entryPoint } = e.data;
    const results = [];
    const logs = [];

    // --- 1. Setup Environment ---
    // Redirect stdout to capture print() statements
    self.pyodide.setStdout({
        batched: (msg) => {
            logs.push(msg);
        }
    });

    try {
        // --- 2. Load User Code ---
        // We run the user code globally to define functions/classes
        await self.pyodide.runPythonAsync(code);

        // Check availability of entry point
        const globals = self.pyodide.globals;
        const fnName = entryPoint || 'solution';

        if (!globals.get(fnName)) {
            throw new Error(`Function '${fnName}' not found. Please define 'def ${fnName}(...):'`);
        }

        const solutionFn = globals.get(fnName);

        // --- 3. Run Test Cases ---
        for (const tc of testCases) {
            let status = 'passed';
            let error = null;
            let actual = null;
            let time = 0;
            let memory = 0; // Not easily accurate in WASM

            try {
                // Prepare arguments
                // We need to convert JS objects to Python objects if they are complex
                // Pyodide handles basic types (int, string, array, dict) automatically.

                const args = tc.input; // Array of arguments

                const start = performance.now();
                // Execute
                const result = solutionFn(...args);
                const end = performance.now();
                time = end - start;

                // Handle return value
                // If it's a PyProxy, we need to convert it to JS
                if (result && result.toJs) {
                    actual = result.toJs({ dict_converter: Object.fromEntries });
                } else {
                    actual = result;
                }

                // Cleanup PyProxy if needed (memory management)
                if (result && result.destroy) {
                    result.destroy();
                }

                // Verify Result
                // Simple JSON stringify comparison
                if (JSON.stringify(actual) !== JSON.stringify(tc.expected)) {
                    status = 'failed';
                }

            } catch (err) {
                status = 'error';
                error = err.toString();
            }

            results.push({
                id: tc.id,
                status,
                input: tc.input,
                expected: tc.expected,
                actual,
                error,
                time,
                memory
            });
        }

    } catch (err) {
        // Global script error (e.g. SyntaxError)
        results.push({
            status: 'error',
            error: err.toString()
        });
    }

    self.postMessage({ results, logs });
};
