self.onmessage = function (e) {
    const { code, testCases } = e.data;
    const results = [];
    const logs = [];

    // Capture console.log
    const originalConsoleLog = console.log;
    console.log = function (...args) {
        logs.push(args.map(a => String(a)).join(' '));
    };

    try {
        // Execute user code in global scope using indirect eval
        // This ensures 'var' declarations attach to 'self'
        (0, eval)(code);

        // entryPoint defaults are handled in Runner, but let's be safe
        let entryPoint = e.data.entryPoint || 'solution';

        // Check if function exists
        // Note: const/let in global scope do NOT attach to 'self' in strictly compliant environments,
        // but in worker global scope they usually are accessible if we just eval'd.
        // However, checking self[entryPoint] works for 'var' and 'function'. 
        // For 'const'/'let' defined functions, we might need a different check or just try to eval the name.

        let fn;
        if (typeof self[entryPoint] === 'function') {
            fn = self[entryPoint];
        } else {
            // Try to find it via evaluation (handles const/let in some scopes)
            try {
                const evaluated = eval(entryPoint);
                if (typeof evaluated === 'function') {
                    fn = evaluated;
                }
            } catch (ignore) {
                // Function not found
            }
        }

        if (!fn) {
            throw new Error(`Function '${entryPoint}' not found. Make sure to define 'var ${entryPoint} = ...' or 'function ${entryPoint}(...)'`);
        }

        // Run Test Cases
        for (const tc of testCases) {
            const inputCopy = JSON.parse(JSON.stringify(tc.input)); // Deep copy to prevent mutation
            const expected = tc.expected;

            let result;
            let status = 'passed';
            let error = null;
            const startMem = (performance.memory && performance.memory.usedJSHeapSize) || 0;
            const startTime = performance.now();

            try {
                result = fn(...inputCopy);
            } catch (err) {
                status = 'error';
                error = err.toString();
            }

            const endTime = performance.now();
            const endMem = (performance.memory && performance.memory.usedJSHeapSize) || 0;
            // Delta is notoriously unreliable in JS because of GC occurring or not occurring.
            // Using endMem gives a rough idea of the heap size at the end of execution.
            // For rigorous testing we'd need a more controlled environment (e.g. Node vm or Puppeteer).
            const memUsage = endMem;

            // Compare result
            if (status === 'passed') {
                if (JSON.stringify(result) !== JSON.stringify(expected)) {
                    status = 'failed';
                }
            }

            results.push({
                id: tc.id,
                status,
                input: tc.input,
                expected,
                actual: result,
                error,
                time: endTime - startTime,
                memory: memUsage
            });
        }

    } catch (err) {
        results.push({
            status: 'error',
            error: 'Runtime Error: ' + err.toString()
        });
    } finally {
        // Restore console
        console.log = originalConsoleLog;
    }

    self.postMessage({ results, logs });
};
