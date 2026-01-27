"use client"

import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"

interface ExecutionResult {
    id?: string;
    status: "passed" | "failed" | "error";
    input?: any[];
    expected?: any;
    actual?: any;
    error?: string;
    time?: number;
    memory?: number;
}

interface ResultPanelProps {
    status: "idle" | "running" | "success" | "error"
    output: string
    error?: string
    results?: ExecutionResult[]
    executionTime?: number
    mode?: "run" | "submit"
}

export function ResultPanel({ status, output, error, results, executionTime, mode = "run" }: ResultPanelProps) {
    const passedCount = results?.filter(r => r.status === 'passed').length || 0;
    const totalCount = results?.length || 0;
    // Considered "success" if specifically 'status' prop says so, OR if all tests passed and we are not in error state.
    const isAllPassed = passedCount === totalCount && totalCount > 0 && status === 'success';

    // Calculate simple stats
    const totalTime = results?.reduce((acc, r) => acc + (r.time || 0), 0) || 0;
    const maxMemory = results?.reduce((acc, r) => Math.max(acc, r.memory || 0), 0) || 0;

    const [activeTab, setActiveTab] = React.useState("output")

    // Auto-switch tabs based on status and mode
    React.useEffect(() => {
        if (status === "running") {
            setActiveTab("output")
        } else if (status === "success" || status === "error") {
            if (mode === "submit") {
                setActiveTab("summary")
            } else {
                setActiveTab("testcases")
            }
        }
    }, [status, mode])

    return (
        <div className="h-full flex flex-col bg-background">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                    <TabsList className="h-8">
                        <TabsTrigger value="output" className="text-xs">Output</TabsTrigger>
                        <TabsTrigger value="testcases" className="text-xs">
                            Test Cases {results?.length ? `(${passedCount}/${totalCount})` : ''}
                        </TabsTrigger>
                        {mode === "submit" && status !== "idle" && (
                            <TabsTrigger value="summary" className="text-xs">Submission</TabsTrigger>
                        )}
                    </TabsList>

                    <div className="flex items-center gap-2">
                        {status === "running" && <Badge variant="secondary">Running...</Badge>}
                        {status === "success" && (
                            <Badge variant="default" className="bg-green-600">
                                {mode === "submit" ? (isAllPassed ? "Accepted" : "Wrong Answer") : "Accepted"}
                            </Badge>
                        )}
                        {status === "error" && <Badge variant="destructive">Error</Badge>}
                        {executionTime && mode !== "submit" && <span className="text-xs text-muted-foreground">{executionTime.toFixed(2)}ms</span>}
                    </div>
                </div>

                <TabsContent value="summary" className="flex-1 p-0 m-0 relative overflow-hidden">
                    <ScrollArea className="h-full w-full">
                        <div className="p-6 space-y-6">
                            <div className={`text-2xl font-bold ${status === "error" ? "text-destructive" : (isAllPassed ? "text-green-500" : "text-red-500")}`}>
                                {status === "error" ? "Runtime Error" : (isAllPassed ? "Accepted" : "Wrong Answer")}
                            </div>

                            {status === "error" ? (
                                <div className="p-4 border border-destructive/20 bg-destructive/5 rounded text-sm text-destructive font-mono whitespace-pre-wrap">
                                    {error || "An unknown error occurred during execution."}
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Runtime</div>
                                            <div className="text-xl font-mono font-medium">{totalTime.toFixed(2)} ms</div>
                                        </div>
                                        <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Memory</div>
                                            <div className="text-xl font-mono font-medium">{(maxMemory / 1024).toFixed(2)} KB</div>
                                        </div>
                                    </div>

                                    {!isAllPassed && (
                                        <div className="p-4 border border-destructive/20 bg-destructive/5 rounded text-sm text-destructive">
                                            {totalCount - passedCount} test cases failed. Check the "Test Cases" tab for details.
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="output" className="flex-1 p-0 m-0 relative overflow-hidden">
                    <ScrollArea className="h-full w-full">
                        <div className="p-4 font-mono text-sm whitespace-pre-wrap">
                            {output}
                            {error && <span className="text-destructive block mt-2">{error}</span>}
                            {!output && !error && status === "idle" && (
                                <span className="text-muted-foreground italic">Run code to see output...</span>
                            )}
                        </div>
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="testcases" className="flex-1 p-0 m-0 relative overflow-hidden">
                    <ScrollArea className="h-full w-full">
                        <div className="p-4 space-y-4">
                            {!results && (
                                <p className="text-sm text-muted-foreground">Run code to see test case results.</p>
                            )}
                            {results?.map((result, index) => (
                                <div key={index} className="border rounded-lg p-3 space-y-2">
                                    <div className="flex items-center gap-2">
                                        {result.status === "passed" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                        {result.status === "failed" && <XCircle className="w-4 h-4 text-red-500" />}
                                        {result.status === "error" && <XCircle className="w-4 h-4 text-destructive" />}

                                        <span className="font-medium text-sm">Test Case {index + 1}</span>
                                        <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
                                            {result.memory !== undefined && <span>{(result.memory / 1024).toFixed(2)}KB</span>}
                                            {result.time !== undefined && <span>{result.time.toFixed(2)}ms</span>}
                                        </div>
                                    </div>

                                    {result.status !== "passed" && (
                                        <div className="grid grid-cols-[80px_1fr] gap-2 text-xs font-mono bg-muted/50 p-2 rounded">
                                            <span className="text-muted-foreground">Input:</span>
                                            <span>{JSON.stringify(result.input)}</span>

                                            <span className="text-muted-foreground">Expected:</span>
                                            <span>{JSON.stringify(result.expected)}</span>

                                            <span className="text-muted-foreground">Actual:</span>
                                            <span className={result.status === "error" ? "text-destructive" : ""}>
                                                {result.error || JSON.stringify(result.actual)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    )
}
