"use client"

import * as React from "react"
import Editor, { OnMount, loader } from "@monaco-editor/react"
import { useTheme } from "next-themes"

// Configure Monaco to load from local files instead of CDN
loader.config({
    paths: {
        vs: "/monaco/vs"
    }
})

interface CodeEditorProps {
    language: string
    value: string
    onChange: (value: string | undefined) => void
    theme?: string
}

export function CodeEditor({ language, value, onChange }: CodeEditorProps) {
    const { theme } = useTheme()
    const editorTheme = theme === "dark" ? "vs-dark" : "light"

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        // Configure editor settings here if needed
        editor.updateOptions({
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
        })
    }

    return (
        <div className="h-full w-full border rounded-md overflow-hidden bg-background">
            <Editor
                height="100%"
                defaultLanguage="javascript"
                language={language}
                value={value}
                theme={editorTheme}
                onChange={onChange}
                onMount={handleEditorDidMount}
                options={{
                    automaticLayout: true,
                }}
            />
        </div>
    )
}
