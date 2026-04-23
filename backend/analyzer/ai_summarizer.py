import os
from pathlib import Path
from typing import Dict, List, Optional

# Try to import Google Generative AI, but make it optional
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except Exception as e:
    print(f"Warning: Google Generative AI not available: {e}")
    GENAI_AVAILABLE = False
    genai = None

class AISummarizer:
    """Generate AI-powered intelligent project summaries using Google Gemini"""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize with optional API key"""
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        self.model = None
        
        if self.api_key and GENAI_AVAILABLE:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-pro')
            except Exception as e:
                print(f"Warning: Failed to initialize Gemini AI: {e}")
                self.model = None
    
    def generate_summary(self, analysis_data: Dict, file_contents: Dict[str, str]) -> Dict:
        """Generate comprehensive AI summary of the project"""
        
        # If AI is not available, return rule-based summary
        if not self.model:
            return self._generate_fallback_summary(analysis_data)
        
        try:
            # Build context for AI
            context = self._build_context(analysis_data, file_contents)
            
            # Generate AI summary
            prompt = self._create_summary_prompt(context)
            response = self.model.generate_content(prompt)
            
            # Parse response
            ai_summary = response.text
            
            return {
                'ai_enabled': True,
                'summary': ai_summary,
                'insights': self._extract_insights(ai_summary),
                'recommendations': self._extract_recommendations(ai_summary)
            }
            
        except Exception as e:
            print(f"AI summarization failed: {e}")
            return self._generate_fallback_summary(analysis_data)
    
    def _build_context(self, analysis_data: Dict, file_contents: Dict[str, str]) -> str:
        """Build context string from analysis data"""
        context_parts = []
        
        # Project metadata
        summary = analysis_data.get('summary', {})
        stats = analysis_data.get('statistics', {})
        
        context_parts.append(f"PROJECT TYPE: {summary.get('project_type', 'Unknown')}")
        context_parts.append(f"FRAMEWORK: {summary.get('framework', 'None')}")
        context_parts.append(f"LANGUAGES: {', '.join(stats.get('languages', []))}")
        context_parts.append(f"TOTAL FILES: {stats.get('total_files', 0)}")
        context_parts.append(f"LINES OF CODE: {stats.get('total_lines', 0)}")
        
        # File structure
        context_parts.append("\nFILE STRUCTURE:")
        for file_path in list(file_contents.keys())[:20]:  # Limit to 20 files
            context_parts.append(f"  - {file_path}")
        
        # Important files content (top 5)
        importance = analysis_data.get('importance', [])
        if importance:
            context_parts.append("\nKEY FILES CONTENT:")
            top_files = sorted(importance, key=lambda x: x.get('score', 0), reverse=True)[:5]
            
            for file_info in top_files:
                file_name = file_info.get('file', '')
                if file_name in file_contents:
                    content = file_contents[file_name]
                    # Limit content length
                    if len(content) > 500:
                        content = content[:500] + "..."
                    context_parts.append(f"\n--- {file_name} ---")
                    context_parts.append(content)
        
        # Dependencies
        deps = analysis_data.get('dependencies', {})
        edges = deps.get('edges', [])
        if edges:
            context_parts.append(f"\nDEPENDENCIES: {len(edges)} connections found")
            sample_deps = edges[:10]
            for edge in sample_deps:
                context_parts.append(f"  {edge.get('source')} -> {edge.get('target')}")
        
        return '\n'.join(context_parts)
    
    def _create_summary_prompt(self, context: str) -> str:
        """Create prompt for AI summarization"""
        prompt = f"""You are an expert software analyst. Analyze this project and provide a comprehensive summary.

{context}

Please provide a detailed analysis covering:

1. **Executive Summary** (2-3 sentences): What is this project and what does it do?

2. **Project Purpose**: Explain the main purpose and goals of this project.

3. **Key Features**: List the main features and capabilities you can identify from the code.

4. **Technology Stack**: Describe the technologies, frameworks, and libraries used.

5. **Architecture**: Explain how the project is structured and organized.

6. **Use Cases**: What are the likely use cases for this project?

7. **Code Quality Insights**: Any observations about code organization, best practices, or potential improvements.

8. **Recommendations**: 2-3 actionable recommendations for improving or extending the project.

Please be specific and reference actual files or code patterns you observe. Write in a professional but accessible tone.
"""
        return prompt
    
    def _extract_insights(self, ai_summary: str) -> List[str]:
        """Extract key insights from AI summary"""
        insights = []
        
        # Look for insight markers
        lines = ai_summary.split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('- ') or line.startswith('* '):
                insights.append(line[2:].strip())
            elif any(keyword in line.lower() for keyword in ['uses', 'implements', 'provides', 'features']):
                if len(line) > 20 and len(line) < 200:
                    insights.append(line)
        
        return insights[:10]  # Limit to 10 insights
    
    def _extract_recommendations(self, ai_summary: str) -> List[str]:
        """Extract recommendations from AI summary"""
        recommendations = []
        
        # Look for recommendations section
        if 'Recommendations' in ai_summary or 'recommendations' in ai_summary:
            lines = ai_summary.split('\n')
            in_recommendations = False
            
            for line in lines:
                if 'recommendation' in line.lower():
                    in_recommendations = True
                    continue
                
                if in_recommendations:
                    line = line.strip()
                    if line.startswith(('1.', '2.', '3.', '- ', '* ')):
                        # Remove numbering/bullets
                        rec = line.lstrip('0123456789.-* ').strip()
                        if rec:
                            recommendations.append(rec)
                    elif line and not line.startswith('#'):
                        # Stop if we hit a new section
                        if line.startswith('**') or line.isupper():
                            break
        
        return recommendations[:5]  # Limit to 5 recommendations
    
    def _generate_fallback_summary(self, analysis_data: Dict) -> Dict:
        """Generate rule-based summary when AI is not available"""
        summary = analysis_data.get('summary', {})
        stats = analysis_data.get('statistics', {})
        importance = analysis_data.get('importance', [])
        
        # Create basic summary
        project_type = summary.get('project_type', 'Unknown Project')
        framework = summary.get('framework', 'None detected')
        total_files = stats.get('total_files', 0)
        total_lines = stats.get('total_lines', 0)
        languages = ', '.join(stats.get('languages', []))
        
        fallback_text = f"""**Executive Summary**

This is a {project_type.lower()}"""
        
        if framework != 'None detected':
            fallback_text += f" built with {framework}"
        
        fallback_text += f". The project contains {total_files} files with approximately {total_lines:,} lines of code"
        
        if languages:
            fallback_text += f", written primarily in {languages}"
        
        fallback_text += ".\n\n**Project Analysis**\n\n"
        
        # Add description
        if summary.get('description'):
            fallback_text += summary['description'] + "\n\n"
        
        # Add key modules
        if summary.get('key_modules'):
            fallback_text += "**Key Components**\n\n"
            for module in summary['key_modules']:
                fallback_text += f"- **{module['name']}**: {module['role']} ({module['file_count']} files)\n"
            fallback_text += "\n"
        
        # Add important files
        if importance:
            top_files = sorted(importance, key=lambda x: x.get('score', 0), reverse=True)[:5]
            fallback_text += "**Most Critical Files**\n\n"
            for file_info in top_files:
                score = file_info.get('score', 0)
                file_name = file_info.get('file', '')
                fallback_text += f"- {file_name} (Importance: {score:.1f}/100)\n"
        
        return {
            'ai_enabled': False,
            'summary': fallback_text,
            'insights': [],
            'recommendations': [
                "Consider adding comprehensive documentation",
                "Implement automated testing for critical components",
                "Review code for optimization opportunities"
            ]
        }
