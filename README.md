# 🔍 Folder Analyzer

> **Advanced Project Structure Analysis & Visualization Tool**

A powerful web application that automatically analyzes folder structures, maps file dependencies, ranks file importance, and visualizes project relationships with interactive graphs and diagrams.

![Folder Analyzer](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-18-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

### 📊 **Comprehensive Analysis**
- **Project Type Detection** - Automatically identifies project type (Web App, Python Application, etc.)
- **Framework Recognition** - Detects frameworks like React, FastAPI, Django, Express, etc.
- **Multi-Language Support** - Python, JavaScript, TypeScript, Java, C/C++, HTML, CSS, Markdown

### 📈 **Advanced Visualizations**
- **Interactive Dependency Graph** - D3.js force-directed graph showing file relationships
  - Zoom, pan, and drag nodes
  - Color-coded by file type
  - Node size reflects importance
  - Hover for detailed information

- **File Type Distribution Chart** - Animated bar chart with percentages
  - Visual breakdown of all file types
  - Legend with counts and percentages
  - Modern glassmorphic design

- **File Importance Ranking** - Sortable table with intelligent scoring
  - Color-coded importance levels (Critical, Important, Moderate, Low)
  - Shows incoming references and outgoing dependencies
  - Identifies entry points
  - Search functionality

- **Execution Flow Diagram** - Mermaid flowchart visualization
  - Shows how code execution flows from entry points
  - Visual representation of call graphs
  - Entry point badges

### 🎯 **Smart Analysis**
- **Dependency Mapping** - Traces import/require statements across files
- **Importance Scoring** - PageRank-based algorithm considering:
  - Number of files that depend on this file (40%)
  - Position in dependency network (40%)
  - Special file bonuses (main.py, index.js, etc.) (20%)
- **Project Structure Recognition** - Identifies source code, tests, docs, config

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and npm
- **Python** 3.8+
- **pip** (Python package manager)

### Installation

1. **Clone or download the project**
   ```bash
   cd folder-analyzer
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ..  # Return to project root
   npm install
   ```

### Running the Application

You need to run both backend and frontend servers:

**Terminal 1 - Backend (FastAPI):**
```bash
cd backend
python main.py
```
Backend will start at: `http://localhost:8000`

**Terminal 2 - Frontend (React + Vite):**
```bash
npm run dev
```
Frontend will start at: `http://localhost:3000`

### Usage

1. Open your browser to `http://localhost:3000`
2. Upload a folder or ZIP file containing your project
3. Wait for analysis to complete (usually 5-10 seconds)
4. Explore the interactive visualizations!

---

## 📁 Project Structure

```
folder-analyzer/
├── backend/                    # FastAPI backend
│   ├── analyzer/              # Analysis modules
│   │   ├── dependency_analyzer.py    # Dependency graph construction
│   │   ├── importance_scorer.py      # File importance calculation
│   │   ├── project_summarizer.py     # Project type detection
│   │   └── flow_analyzer.py          # Execution flow generation
│   ├── main.py                # FastAPI application entry point
│   ├── requirements.txt       # Python dependencies
│   └── sessions/              # Temporary session storage
│
├── src/                       # React frontend
│   ├── components/            # React components
│   │   ├── UploadArea.jsx            # File upload interface
│   │   ├── SummaryPanel.jsx          # Project summary display
│   │   ├── FileTypeChart.jsx         # Bar chart visualization
│   │   ├── DependencyGraph.jsx       # D3.js network graph
│   │   ├── ImportanceTable.jsx       # File ranking table
│   │   └── FlowDiagram.jsx           # Mermaid flowchart
│   ├── styles/                # CSS stylesheets
│   └── App.jsx                # Main React application
│
├── public/                    # Static assets
├── index.html                 # HTML entry point
├── package.json               # Node.js dependencies
├── vite.config.js             # Vite configuration
├── README.md                  # This file
└── FEATURE_CHECKLIST.md       # Complete feature documentation
```

---

## 🎨 Screenshots

### Project Summary & File Type Distribution
Shows project type, statistics, languages, and an animated file type breakdown chart.

### Interactive Dependency Graph
Force-directed graph where files with dependencies are positioned closer together.
- **Blue nodes** - Python/TypeScript
- **Orange nodes** - JavaScript
- **Red nodes** - Java
- **Green nodes** - CSS

### File Importance Ranking
Intelligent scoring system that identifies critical files:
- **🟢 Green (80-100)** - Critical files (most dependencies)
- **🔵 Blue (60-80)** - Important files
- **🟡 Orange (40-60)** - Moderate importance
- **⚪ Gray (0-40)** - Low importance

### Execution Flow
Visual flowchart showing how code execution flows from entry points through dependencies.

---

## 🔧 Technologies Used

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **D3.js** - Interactive data visualizations
- **Mermaid** - Flowchart diagrams
- **Modern CSS** - Glassmorphism, gradients, animations

### Backend
- **FastAPI** - High-performance Python web framework
- **uvicorn** - ASGI web server
- **NetworkX** - Graph algorithms and analysis
- **Python AST** - Abstract Syntax Tree parsing for Python
- **Regex parsers** - Multi-language import detection

### Algorithms
- **PageRank** - Importance scoring based on dependency centrality
- **Force-Directed Layout** - D3.js graph positioning
- **Breadth-First Search** - Execution flow traversal
- **AST Parsing** - Code structure analysis

---

## 📚 How It Works

### 1. Upload & Extraction
- Accepts folders or ZIP files
- Extracts and stores files in temporary sessions
- Maintains directory structure

### 2. Dependency Analysis
- **Python** - Uses AST parsing to extract `import` and `from ... import` statements
- **JavaScript/TypeScript** - Regex-based parsing of `import` and `require()`
- **Java** - Detects `import` statements
- **C/C++** - Finds `#include` directives

### 3. Graph Construction
- Creates directed graph with files as nodes
- Edges represent dependencies
- Calculates centrality metrics using NetworkX

### 4. Importance Scoring
```
Score = (0.4 × PageRank) + (0.4 × Centrality) + (0.2 × Special Bonuses)
```
- **PageRank** - How many files depend on this file
- **Centrality** - Position in the dependency network
- **Special Bonuses** - Entry point files (main.py, index.js, app.py, etc.)

### 5. Flow Analysis
- Identifies entry point files (main, app, index, etc.)
- Performs BFS traversal from each entry point
- Generates Mermaid flowchart syntax
- Creates textual description of execution flow

### 6. Project Summarization
- Detects project type from file structure and content
- Identifies frameworks from package.json, requirements.txt, imports
- Analyzes directory structure (src/, tests/, docs/, config/)
- Groups files into key modules

---

## 🎯 Supported File Types

| Category | File Extensions |
|----------|----------------|
| **Python** | `.py` |
| **JavaScript** | `.js`, `.jsx` |
| **TypeScript** | `.ts`, `.tsx` |
| **Java** | `.java` |
| **C/C++** | `.c`, `.cpp`, `.h`, `.hpp` |
| **Web** | `.html`, `.css` |
| **Documentation** | `.md`, `.txt`, `.rst` |
| **Configuration** | `.json`, `.yaml`, `.yml`, `.toml`, `.ini`, `.env` |

---

## 🛠️ API Endpoints

### Backend API (http://localhost:8000)

- **POST `/upload/zip`** - Upload ZIP file
  - Body: `multipart/form-data` with `file` field
  - Returns: `{ session_id, status, ... }`

- **POST `/upload/folder`** - Upload folder (multiple files)
  - Body: `multipart/form-data` with multiple `files`
  - Returns: `{ session_id, status, ... }`

- **GET `/analysis/{session_id}`** - Retrieve analysis results
  - Returns: Complete analysis data (dependencies, importance, summary, flow)

- **DELETE `/analysis/{session_id}`** - Clean up session
  - Deletes temporary files and session data

- **GET `/health`** - Health check
  - Returns: `{ status: "healthy" }`

- **GET `/docs`** - Interactive API documentation (Swagger UI)

---

## 🔍 Example Analysis Output

```json
{
  "status": "success",
  "session_id": "abc123",
  "dependencies": {
    "nodes": [
      {
        "id": "main.py",
        "path": "main.py",
        "file_type": ".py",
        "in_degree": 0,
        "out_degree": 2
      }
    ],
    "edges": [
      { "source": "main.py", "target": "utils.py" }
    ]
  },
  "importance": [
    {
      "file": "utils.py",
      "score": 100.0,
      "in_degree": 3,
      "out_degree": 0
    }
  ],
  "summary": {
    "project_type": "Python Application",
    "framework": "FastAPI",
    "description": "A web API...",
    "key_modules": [...]
  },
  "flow": {
    "has_flow": true,
    "entry_points": ["main.py"],
    "mermaid_diagram": "graph TD...",
    "flow_description": "Execution starts from..."
  },
  "statistics": {
    "total_files": 15,
    "total_lines": 450,
    "languages": ["Python", "JavaScript"],
    "file_types": {
      ".py": 10,
      ".js": 3,
      ".md": 2
    }
  }
}
```

---

## 🌟 Key Features in Detail

### Feature-Based File Grouping
The dependency graph uses a **force-directed layout** algorithm that naturally positions related files closer together. Files with strong dependency relationships (imports/requires) are connected by edges and the physics simulation pulls them together while pushing unrelated files apart.

### Intelligent Importance Scoring
The scoring algorithm combines multiple metrics:
1. **Incoming References** - Files that are imported by many other files score higher
2. **Network Centrality** - Files that are central to the dependency graph score higher
3. **Entry Point Detection** - Special files like `main.py`, `index.js`, `app.py` receive bonus points

This creates a comprehensive view of which files are most critical to the project's functionality.

### Multi-Language Support
The analyzer uses different parsing strategies for each language:
- **Python** - Full AST (Abstract Syntax Tree) parsing for accuracy
- **JavaScript/TypeScript** - Regex patterns to match import/require statements
- **Java** - Package and import statement detection
- **C/C++** - Include directive parsing

---

## 💡 Use Cases

- **Code Review** - Quickly understand project structure before reviewing code
- **Onboarding** - Help new developers understand large codebases
- **Refactoring** - Identify highly-coupled files that may need refactoring
- **Documentation** - Generate visual documentation of project structure
- **Dependency Analysis** - Find circular dependencies and coupling issues
- **Technical Debt** - Identify files with high coupling that may need attention

---

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Add support for more programming languages (Ruby, PHP, Go, Rust, etc.)
- Enhanced dependency detection (decorators, dynamic imports, etc.)
- Export features (PDF reports, PNG/SVG exports)
- Metrics dashboard (cyclomatic complexity, code quality scores)
- Historical analysis (track changes over time)

---

## 📄 License

MIT License - Feel free to use this project for any purpose.

---

## 🎓 Learn More

- **D3.js Documentation** - https://d3js.org/
- **Mermaid Documentation** - https://mermaid.js.org/
- **FastAPI Documentation** - https://fastapi.tiangolo.com/
- **NetworkX Documentation** - https://networkx.org/
- **React Documentation** - https://react.dev/

---

## 🐛 Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed: `python --version`
- Install dependencies: `pip install -r backend/requirements.txt`
- Check if port 8000 is available

### Frontend won't start
- Ensure Node.js 16+ is installed: `node --version`
- Install dependencies: `npm install`
- Check if port 3000 is available
- Clear npm cache: `npm cache clean --force`

### Analysis fails
- Check backend logs for error messages
- Ensure uploaded folder contains supported file types
- Try with a smaller project first

### Graph not rendering
- Check browser console for errors (F12)
- Ensure you're using a modern browser (Chrome, Firefox, Edge, Safari)
- Try refreshing the page

---

## 📞 Support

For issues, questions, or suggestions, please create an issue in the project repository.

---

**Built with ❤️ using React, D3.js, Mermaid, FastAPI, and NetworkX**

*Analyze smarter, code better.*
