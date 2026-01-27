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

export default function Home() {
  const [language, setLanguage] = React.useState("javascript")
  const [code, setCode] = React.useState("// Write your code here\nconsole.log('Hello World!');")
  const [output, setOutput] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "running" | "success" | "error">("idle")

  const handleRun = () => {
    setStatus("running")
    setOutput("Running code...\n")

    // Simulation
    setTimeout(() => {
      setOutput("Hello World!\n")
      setStatus("success")
    }, 1000)
  }

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
          <LanguageSelect value={language} onValueChange={setLanguage} />
          <Button size="sm" onClick={handleRun} disabled={status === "running"}>
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button size="sm" variant="secondary" disabled>
            Submit
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal">

          {/* Problem Description */}
          <ResizablePanel defaultSize={40} minSize={20}>
            <ProblemPanel />
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
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </main>
  )
}
