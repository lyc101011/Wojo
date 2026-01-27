"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const SUPPORTED_LANGUAGES = [
    { id: "javascript", name: "JavaScript", icon: "JS" },
    { id: "python", name: "Python", icon: "PY" },
    { id: "c", name: "C (WASM)", icon: "C" },
    { id: "cpp", name: "C++ (WASM)", icon: "C++" },
    { id: "rust", name: "Rust", icon: "RS" },
    { id: "java", name: "Java", icon: "JV" },
]

interface LanguageSelectProps {
    value: string
    onValueChange: (value: string) => void
}

export function LanguageSelect({ value, onValueChange }: LanguageSelectProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id}>
                        <span className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-muted-foreground w-6 text-center">
                                {lang.icon}
                            </span>
                            {lang.name}
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
