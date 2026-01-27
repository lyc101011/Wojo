"use client"

import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ProblemPanel() {
    return (
        <div className="h-full flex flex-col bg-background">
            <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-2xl font-bold">1. Two Sum</h1>
                            <Badge>Easy</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground flex gap-4">
                            <span>Acceptance: 48.2%</span>
                            <span>Tags: Array, Hash Table</span>
                        </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-sm">
                        <p>
                            Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.
                        </p>
                        <p>
                            You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.
                        </p>
                        <p>
                            You can return the answer in any order.
                        </p>

                        <h3>Example 1:</h3>
                        <pre>
                            Input: nums = [2,7,11,15], target = 9{"\n"}
                            Output: [0,1]{"\n"}
                            Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
                        </pre>

                        <h3>Constraints:</h3>
                        <ul>
                            <li><code>2 &lt;= nums.length &lt;= 10^4</code></li>
                            <li><code>-10^9 &lt;= nums[i] &lt;= 10^9</code></li>
                            <li><code>-10^9 &lt;= target &lt;= 10^9</code></li>
                        </ul>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
