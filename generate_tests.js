
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/lib/problems/two-sum.json');
const problem = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Generate large test case 1: N=2000, answer at the end
const N1 = 2000;
const nums1 = Array.from({ length: N1 }, (_, i) => i);
const target1 = (N1 - 2) + (N1 - 1);
// Expected: [N1-2, N1-1]

// Generate large test case 2: N=5000, answer at the end
const N2 = 5000;
const nums2 = Array.from({ length: N2 }, (_, i) => i * 2);
const target2 = (N2 - 2) * 2 + (N2 - 1) * 2;
// Expected: [N2-2, N2-1]

// Create new test cases
const newTestCases = [
    {
        id: "tc_large_1",
        input: [nums1, target1],
        expected: [N1 - 2, N1 - 1]
    },
    {
        id: "tc_large_2",
        input: [nums2, target2],
        expected: [N2 - 2, N2 - 1]
    }
];

// Keep existing validationTestCases, but REPLACE testCases with a mix of small and large
// Actually, let's keep the small ones too for correctness, but maybe fewer.
// The user wants "testCases" to be used for submission.
// Let's keep the first 3 small ones and add the large ones.

const smallTestCases = problem.validationTestCases; // Use the simple ones as base base

problem.testCases = [
    ...smallTestCases,
    ...newTestCases
];

fs.writeFileSync(filePath, JSON.stringify(problem, null, 4));
console.log("Updated two-sum.json with large test cases");
