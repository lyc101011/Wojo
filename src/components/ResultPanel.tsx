"use client"

import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface ResultPanelProps {
    status: "idle" | "running" | "success" | "error"
    output: string
    error?: string
    executionTime?: number
}

export function ResultPanel({ status, output, error, executionTime }: ResultPanelProps) {
    return (
        <div className="h-full flex flex-col bg-background">
            <Tabs defaultValue="output" className="w-full h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                    <TabsList className="h-8">
                        <TabsTrigger value="output" className="text-xs">Output</TabsTrigger>
                        <TabsTrigger value="testcases" className="text-xs">Test Cases</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        {status === "running" && <Badge variant="secondary">Running...</Badge>}
                        {status === "success" && <Badge variant="default" className="bg-green-600">Accepted</Badge>}
                        {status === "error" && <Badge variant="destructive">Error</Badge>}
                        {executionTime && <span className="text-xs text-muted-foreground">{executionTime}ms</span>}
                    </div>
                </div>

                <TabsContent value="output" className="flex-1 p-0 m-0 relative">
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

                <TabsContent value="testcases" className="flex-1 p-4">
                    <div className="text-sm text-muted-foreground">
                        Test cases visualization will be implemented here.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
