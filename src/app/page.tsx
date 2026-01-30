"use client"

import * as React from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { CodeEditor } from "@/components/CodeEditor"
import { LanguageSelect } from "@/components/LanguageSelect"
import { ResultPanel } from "@/components/ResultPanel"
import { ProblemPanel } from "@/components/ProblemPanel"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { Problem } from "@/types/problem"
import { JavascriptRunner } from "@/lib/runner/JavascriptRunner"
import { PythonRunner } from "@/lib/runner/PythonRunner"
import { Runner, ExecutionResult } from "@/lib/runner/types"
import { toast } from "sonner"

export default function Home() {
  const [problems, setProblems] = React.useState<Problem[]>([])
  const [problem, setProblem] = React.useState<Problem | undefined>(undefined)

  const [language, setLanguage] = React.useState("javascript")
  const [code, setCode] = React.useState("")
  const [output, setOutput] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "running" | "success" | "error">("idle")
  const [results, setResults] = React.useState<ExecutionResult[]>([])
  const [executionTime, setExecutionTime] = React.useState<number>(0)
  const [mode, setMode] = React.useState<"run" | "submit">("run")

  const runnerRef = React.useRef<Runner | null>(null)

  // Initialize runner when language changes
  React.useEffect(() => {
    // Cleanup previous runner if it has a terminate method
    if (runnerRef.current?.terminate) {
      runnerRef.current.terminate();
    }

    if (language === 'javascript') {
      runnerRef.current = new JavascriptRunner();
    } else if (language === 'python') {
      runnerRef.current = new PythonRunner();
    } else {
      runnerRef.current = null; // Others not implemented yet
    }

    return () => {
      if (runnerRef.current?.terminate) {
        runnerRef.current.terminate();
      }
    }
  }, [language])

  // Fetch problems
  React.useEffect(() => {
    async function fetchProblems() {
      try {
        const res = await fetch("/api/problems")
        const data = await res.json()
        setProblems(data)
        if (data.length > 0) {
          setProblem(data[0])
        }
      } catch (error) {
        toast.error("Failed to load problems")
      }
    }
    fetchProblems()
  }, [])

  // Update code when problem changes
  React.useEffect(() => {
    if (problem) {
      const template = problem.templates.find(t => t.language === language)
      if (template) {
        setCode(template.code)
      } else {
        setCode(`// No template for ${language} yet`)
      }
      // Reset results
      setResults([])
      setOutput("")
      setStatus("idle")
      setMode("run")
    }
  }, [problem, language])

  const executeCode = async (cases: Problem['testCases'], isSubmit: boolean = false) => {
    if (!problem || !runnerRef.current) {
      toast.error("Runner not initialized for this language");
      return;
    }

    setMode(isSubmit ? "submit" : "run")
    setStatus("running")
    setOutput(isSubmit ? "Submitting..." : "Running...")
    setResults([])

    const starTime = performance.now()
    try {
      const { results, logs } = await runnerRef.current.run(
        code,
        cases,
        problem.entryFunctionName
      )

      const endTime = performance.now()
      setExecutionTime(endTime - starTime)

      setOutput(logs.join('\n'))
      setResults(results)

      const hasError = results.some(r => r.status === 'error')
      const hasFailure = results.some(r => r.status === 'failed')

      if (hasError) {
        setStatus("error")
      } else if (hasFailure) {
        setStatus("error")
      } else {
        setStatus("success")
      }

    } catch (err: any) {
      setStatus("error")
      setOutput(`Execution Error: ${err.message}`)
    }
  }

  const handleRun = () => problem && executeCode(problem.validationTestCases || problem.testCases, false)
  const handleSubmit = () => problem && executeCode(problem.testCases, true)

  return (
    <main className="h-screen w-full flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
            W
          </div>
          <span className="font-bold text-lg">Wojo</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Problem Selector (Simple for now) */}
          <select
            className="bg-transparent text-sm border rounded px-2 py-1"
            value={problem?.id || ""}
            onChange={(e) => {
              const p = problems.find(p => p.id === e.target.value)
              if (p) setProblem(p)
            }}
          >
            {problems.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          <LanguageSelect value={language} onValueChange={setLanguage} />
          <Button size="sm" onClick={handleRun} disabled={status === "running" || !problem}>
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button size="sm" variant="secondary" onClick={handleSubmit} disabled={status === "running" || !problem}>
            Submit
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal">

          {/* Problem Description */}
          <ResizablePanel defaultSize={40} minSize={20}>
            <ProblemPanel problem={problem} />
          </ResizablePanel>

          <ResizableHandle />

          {/* Editor & Result */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <ResizablePanelGroup orientation="vertical">

              {/* Code Editor */}
              <ResizablePanel defaultSize={70} minSize={30}>
                <div className="h-full flex flex-col">
                  <CodeEditor
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle />

              {/* Result Panel */}
              <ResizablePanel defaultSize={30} minSize={10}>
                <ResultPanel
                  status={status}
                  output={output}
                  results={results}
                  executionTime={executionTime}
                  mode={mode}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </main>
  )
}
