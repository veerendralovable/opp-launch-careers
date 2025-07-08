
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResumeData {
  personalInfo: any;
  experience: any[];
  education: any[];
  skills: string[];
  projects: any[];
  template: string;
  colorTheme: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData }: { resumeData: ResumeData } = await req.json();

    // Generate HTML for PDF conversion
    const htmlContent = generateResumeHTML(resumeData);

    // In a real implementation, you would use a service like:
    // - Puppeteer
    // - jsPDF
    // - External PDF API service

    // For now, return the HTML content
    return new Response(
      JSON.stringify({
        success: true,
        html: htmlContent,
        downloadUrl: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate PDF" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});

function generateResumeHTML(data: ResumeData): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>${data.personalInfo.name} - Resume</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: 'Arial', sans-serif; 
        line-height: 1.6; 
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
      }
      .header {
        text-align: center;
        border-bottom: 3px solid ${data.colorTheme};
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      .header h1 {
        font-size: 2.5em;
        color: ${data.colorTheme};
        margin-bottom: 10px;
      }
      .contact-info {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 20px;
        margin-top: 10px;
      }
      .section {
        margin-bottom: 25px;
      }
      .section-title {
        font-size: 1.3em;
        color: ${data.colorTheme};
        border-bottom: 2px solid ${data.colorTheme};
        padding-bottom: 5px;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .item {
        margin-bottom: 15px;
        page-break-inside: avoid;
      }
      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 5px;
      }
      .item-title {
        font-weight: bold;
        font-size: 1.1em;
      }
      .item-subtitle {
        color: #666;
        font-style: italic;
      }
      .item-date {
        color: #888;
        font-size: 0.9em;
        white-space: nowrap;
      }
      .skills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .skill {
        background: ${data.colorTheme};
        color: white;
        padding: 4px 12px;
        border-radius: 15px;
        font-size: 0.9em;
      }
      .description {
        margin-top: 8px;
        color: #555;
      }
      .projects .item {
        border-left: 3px solid ${data.colorTheme};
        padding-left: 15px;
      }
      @media print {
        body { padding: 20px; }
        .header { page-break-after: avoid; }
        .section { page-break-inside: avoid; }
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>${data.personalInfo.name}</h1>
      <div class="contact-info">
        ${data.personalInfo.email ? `<span>${data.personalInfo.email}</span>` : ''}
        ${data.personalInfo.phone ? `<span>${data.personalInfo.phone}</span>` : ''}
        ${data.personalInfo.location ? `<span>${data.personalInfo.location}</span>` : ''}
      </div>
      ${data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.portfolio ? `
      <div class="contact-info" style="margin-top: 10px;">
        ${data.personalInfo.linkedin ? `<span>LinkedIn: ${data.personalInfo.linkedin}</span>` : ''}
        ${data.personalInfo.github ? `<span>GitHub: ${data.personalInfo.github}</span>` : ''}
        ${data.personalInfo.portfolio ? `<span>Portfolio: ${data.personalInfo.portfolio}</span>` : ''}
      </div>` : ''}
    </div>

    ${data.personalInfo.summary ? `
    <div class="section">
      <h2 class="section-title">Professional Summary</h2>
      <p class="description">${data.personalInfo.summary}</p>
    </div>` : ''}

    ${data.experience.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Experience</h2>
      ${data.experience.map(exp => `
      <div class="item">
        <div class="item-header">
          <div>
            <div class="item-title">${exp.title}</div>
            <div class="item-subtitle">${exp.company} • ${exp.location}</div>
          </div>
          <div class="item-date">${exp.start_date} - ${exp.current ? 'Present' : exp.end_date}</div>
        </div>
        ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}

    ${data.education.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Education</h2>
      ${data.education.map(edu => `
      <div class="item">
        <div class="item-header">
          <div>
            <div class="item-title">${edu.degree}</div>
            <div class="item-subtitle">${edu.institution} • ${edu.location}</div>
          </div>
          <div class="item-date">${edu.start_date} - ${edu.end_date}</div>
        </div>
        ${edu.gpa ? `<div class="description">GPA: ${edu.gpa}</div>` : ''}
        ${edu.description ? `<div class="description">${edu.description}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}

    ${data.skills.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Skills</h2>
      <div class="skills">
        ${data.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
      </div>
    </div>` : ''}

    ${data.projects.length > 0 ? `
    <div class="section projects">
      <h2 class="section-title">Projects</h2>
      ${data.projects.map(project => `
      <div class="item">
        <div class="item-title">${project.title}</div>
        <div class="description">${project.description}</div>
        ${project.technologies.length > 0 ? `
        <div class="description"><strong>Technologies:</strong> ${project.technologies.join(', ')}</div>` : ''}
        ${project.url ? `<div class="description"><strong>URL:</strong> ${project.url}</div>` : ''}
        ${project.github ? `<div class="description"><strong>GitHub:</strong> ${project.github}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}
  </body>
  </html>`;
}
