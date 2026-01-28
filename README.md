# Wojo - Browser-native Online Judge

![Wojo Preview](https://via.placeholder.com/1200x600?text=Wojo+Platform+Preview+Coming+Soon)

**Wojo** is a privacy-first, zero-latency Online Judge platform that runs primarily in your browser using **WebAssembly**. By bringing the execution environment to the client, we deliver instant feedback and meaningful privacy while reducing server costs.

## 🚀 Key Features

- **Zero Latency**: Code compilation and execution happen locally.
- **Privacy Focused**: Your code stays in your browser (Stage 1).
- **Multi-Language Support**:
  - **JavaScript**: Web Worker Sandbox
  - **Python**: Pyodide (WASM) [Planned]
  - **C/C++**: Clang WASM [Planned]
  - **Rust**: WASM Toolchain [Planned]
  - **Java**: CheerpJ/TeaVM [Planned]
- **Modern UI**: Built with Next.js 16, Tailwind v4, and shadcn/ui.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.1](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Build System**: Turbopack
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/) + Tailwind CSS v4
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)

## 🏁 Getting Started

To run the project locally from source:

```bash
git clone https://github.com/yourusername/wojo.git
cd wojo
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
