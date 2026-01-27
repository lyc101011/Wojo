// Load QuickJS library (assumes quickjs.js is in public folder)
importScripts('/quickjs.js');

self.onmessage = async function (e) {
    const { code, testCases } = e.data;
    const results = [];
    const logs = [];

    let quickjs = null;
    let vm = null;

    try {
        const QuickJS = self.QJS || self.quickjsEmscripten || self.QuickJSEmscripten;

        if (!QuickJS) {
            console.error("Available globals:", Object.keys(self));
            throw new Error("QuickJS library not found or failed to load.");
        }

        quickjs = await QuickJS.getQuickJS();
        const Scope = QuickJS.Scope;

        Scope.withScope(scope => {
            vm = scope.manage(quickjs.newContext());

            // --- 1. Setup Console ---
            const logHandle = scope.manage(vm.newFunction("log", (...args) => {
                const nativeArgs = args.map(arg => vm.getString(arg));
                logs.push(nativeArgs.join(' '));
            }));

            const consoleHandle = scope.manage(vm.newObject());
            vm.setProp(consoleHandle, "log", logHandle);

            const globalHandle = scope.manage(vm.global);
            vm.setProp(globalHandle, "console", consoleHandle);

            // --- 2. Evaluate User Code ---
            const result = vm.evalCode(code);
            if (result.error) {
                const errorHandle = scope.manage(result.error);
                const errorDump = vm.dump(errorHandle);
                throw new Error(errorDump.toString());
            } else {
                scope.manage(result.value);
            }

            // --- 3. Find Entry Point ---
            const entryFunctionName = e.data.entryPoint || 'solution';
            const entryFunc = scope.manage(vm.getProp(globalHandle, entryFunctionName));

            if (vm.typeof(entryFunc) !== 'function') {
                throw new Error(`Function '${entryFunctionName}' not found.`);
            }

            // Singleton handles (reuse them)
            const undefinedHandle = scope.manage(vm.undefined);

            // --- 4. Run Test Cases ---
            for (const tc of testCases) {
                Scope.withScope(testScope => {
                    const argHandles = tc.input.map(arg => {
                        const jsonStr = JSON.stringify(arg);
                        const parseResult = vm.evalCode(`(${jsonStr})`);
                        if (parseResult.error) {
                            const err = testScope.manage(parseResult.error);
                            throw new Error("Failed to parse input arg: " + vm.dump(err));
                        }
                        return testScope.manage(parseResult.value);
                    });

                    const startTime = performance.now();
                    const callResult = vm.callFunction(entryFunc, undefinedHandle, ...argHandles);
                    const endTime = performance.now();

                    // Memory usage (Compute returns a handle to a JS object in some versions, or a primitive?)
                    // To be safe, we treat it as potentially returning a handle we need to dump then dispose.
                    // The .memory_used_size property access suggests it returns a handle to an object, 
                    // OR it returns a JS object directly.
                    // Using `scope.manage` on it is safe if it's a handle, unsafe if it's a primitive (but manage checks alive?).
                    // Wait, `vm.runtime.computeMemoryUsage()` might return a handle to a QuickJS object `{ memory_used_size: 123 }`.
                    let endMem = 0;
                    try {
                        const memHandle = vm.runtime.computeMemoryUsage();
                        // If it's a handle, we must manage it.
                        // If it's a JS object, `manage` might crash or do nothing?
                        // QuickJS-emscripten docs say computeMemoryUsage returns `QuickJSHandle`.
                        testScope.manage(memHandle);

                        const memDump = vm.dump(memHandle);
                        endMem = memDump.memory_used_size;
                    } catch (e) {
                        // Fallback or ignore if not supported/different signature
                        console.error("Memory tracking error:", e);
                    }

                    let status = 'passed';
                    let error = null;
                    let actual = null;

                    if (callResult.error) {
                        status = 'error';
                        const errorHandle = testScope.manage(callResult.error);
                        error = JSON.stringify(vm.dump(errorHandle));
                    } else {
                        const valueHandle = testScope.manage(callResult.value);
                        actual = vm.dump(valueHandle);
                        if (JSON.stringify(actual) !== JSON.stringify(tc.expected)) {
                            status = 'failed';
                        }
                    }

                    results.push({
                        id: tc.id,
                        status,
                        input: tc.input,
                        expected: tc.expected,
                        actual,
                        error,
                        time: endTime - startTime,
                        memory: Number(endMem)
                    });
                });
            }
        });

    } catch (err) {
        results.push({
            status: 'error',
            error: 'Runtime Error: ' + err.toString()
        });
    }

    self.postMessage({ results, logs });
};
