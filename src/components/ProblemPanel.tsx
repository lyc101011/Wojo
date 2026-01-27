"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Problem } from "@/types/problem"

interface ProblemPanelProps {
    problem?: Problem;
}

export function ProblemPanel({ problem }: ProblemPanelProps) {
    if (!problem) {
        return (
            <div className="h-full flex flex-col bg-background items-center justify-center text-muted-foreground">
                <p>No problem selected.</p>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-background">
            <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-2xl font-bold">{problem.title}</h1>
                            <Badge>{problem.difficulty}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground flex gap-4">
                            {problem.tags.map(tag => (
                                <span key={tag}>{tag}</span>
                            ))}
                        </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-sm">
                        <ReactMarkdown>{problem.description}</ReactMarkdown>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
