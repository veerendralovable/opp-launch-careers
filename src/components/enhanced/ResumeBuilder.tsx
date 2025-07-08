
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useFileUpload } from '@/hooks/useFileUpload';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  Download, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  Upload,
  Palette,
  Users
} from 'lucide-react';

interface ResumeData {
  id?: string;
  personal_info: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    start_date: string;
    end_date: string;
    gpa?: string;
    description: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
  }>;
  template: 'modern' | 'classic' | 'creative';
  color_theme: string;
}

const defaultResumeData: ResumeData = {
  personal_info: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  template: 'modern',
  color_theme: '#3b82f6'
};

const ResumeBuilder: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeTab, setActiveTab] = useState('personal');
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedResumes, setSavedResumes] = useState<any[]>([]);
  
  const { user } = useAuth();
  const { uploadFile, uploading } = useFileUpload({
    bucket: 'resumes',
    folder: 'pdfs',
    allowedTypes: ['application/pdf'],
    maxSize: 5 * 1024 * 1024
  });

  useEffect(() => {
    if (user) {
      loadSavedResumes();
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setResumeData(prev => ({
          ...prev,
          personal_info: {
            ...prev.personal_info,
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            location: profile.location || '',
            linkedin: profile.linkedin_url || '',
            github: profile.github_url || '',
            portfolio: profile.portfolio_url || '',
          }
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadSavedResumes = async () => {
    try {
      const { data } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      setSavedResumes(data || []);
    } catch (error) {
      console.error('Error loading resumes:', error);
    }
  };

  const saveResume = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const resumeJson = JSON.stringify(resumeData);
      
      if (resumeData.id) {
        await supabase
          .from('resumes')
          .update({ 
            name: resumeData.personal_info.name || 'My Resume',
            extracted_text: resumeJson 
          })
          .eq('id', resumeData.id);
      } else {
        const { data } = await supabase
          .from('resumes')
          .insert([{
            user_id: user.id,
            name: resumeData.personal_info.name || 'My Resume',
            extracted_text: resumeJson
          }])
          .select()
          .single();
        
        if (data) {
          setResumeData(prev => ({ ...prev, id: data.id }));
        }
      }
      
      await loadSavedResumes();
    } catch (error) {
      console.error('Error saving resume:', error);
    } finally {
      setSaving(false);
    }
  };

  const loadResume = (resume: any) => {
    try {
      const data = JSON.parse(resume.extracted_text);
      setResumeData({ ...data, id: resume.id });
    } catch (error) {
      console.error('Error loading resume:', error);
    }
  };

  const generatePDF = async () => {
    // This would typically use a library like jsPDF or puppeteer
    // For now, we'll create a simplified HTML version
    const htmlContent = generateHTMLResume();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personal_info.name || 'resume'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateHTMLResume = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${resumeData.personal_info.name} - Resume</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .section-title { color: ${resumeData.color_theme}; border-bottom: 2px solid ${resumeData.color_theme}; padding-bottom: 5px; margin-bottom: 15px; }
        .experience-item, .education-item, .project-item { margin-bottom: 15px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background: ${resumeData.color_theme}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${resumeData.personal_info.name}</h1>
        <p>${resumeData.personal_info.email} | ${resumeData.personal_info.phone} | ${resumeData.personal_info.location}</p>
        ${resumeData.personal_info.linkedin ? `<p>LinkedIn: ${resumeData.personal_info.linkedin}</p>` : ''}
        ${resumeData.personal_info.github ? `<p>GitHub: ${resumeData.personal_info.github}</p>` : ''}
      </div>
      
      ${resumeData.personal_info.summary ? `
      <div class="section">
        <h2 class="section-title">Professional Summary</h2>
        <p>${resumeData.personal_info.summary}</p>
      </div>` : ''}
      
      ${resumeData.experience.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Experience</h2>
        ${resumeData.experience.map(exp => `
        <div class="experience-item">
          <h3>${exp.title} at ${exp.company}</h3>
          <p><em>${exp.location} | ${exp.start_date} - ${exp.current ? 'Present' : exp.end_date}</em></p>
          <p>${exp.description}</p>
        </div>`).join('')}
      </div>` : ''}
      
      ${resumeData.education.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Education</h2>
        ${resumeData.education.map(edu => `
        <div class="education-item">
          <h3>${edu.degree}</h3>
          <p><em>${edu.institution} | ${edu.location} | ${edu.start_date} - ${edu.end_date}</em></p>
          ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
          ${edu.description ? `<p>${edu.description}</p>` : ''}
        </div>`).join('')}
      </div>` : ''}
      
      ${resumeData.skills.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills">
          ${resumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
        </div>
      </div>` : ''}
      
      ${resumeData.projects.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Projects</h2>
        ${resumeData.projects.map(project => `
        <div class="project-item">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
          ${project.url ? `<p><strong>URL:</strong> ${project.url}</p>` : ''}
          ${project.github ? `<p><strong>GitHub:</strong> ${project.github}</p>` : ''}
        </div>`).join('')}
      </div>` : ''}
    </body>
    </html>`;
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      current: false,
      description: ''
    };
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      start_date: '',
      end_date: '',
      gpa: '',
      description: ''
    };
    setResumeData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: [],
      url: '',
      github: ''
    };
    setResumeData(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  if (previewMode) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <Button onClick={() => setPreviewMode(false)} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Exit Preview
            </Button>
            <div className="flex gap-2">
              <Button onClick={generatePDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={saveResume} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
          
          <div dangerouslySetInnerHTML={{ __html: generateHTMLResume() }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <div className="flex gap-2">
            <Button onClick={() => setPreviewMode(true)} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={saveResume} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with saved resumes */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Saved Resumes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savedResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => loadResume(resume)}
                    >
                      <p className="font-medium truncate">{resume.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(resume.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {savedResumes.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No saved resumes</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Full Name"
                        value={resumeData.personal_info.name}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personal_info: { ...prev.personal_info, name: e.target.value }
                        }))}
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={resumeData.personal_info.email}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personal_info: { ...prev.personal_info, email: e.target.value }
                        }))}
                      />
                      <Input
                        placeholder="Phone"
                        value={resumeData.personal_info.phone}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personal_info: { ...prev.personal_info, phone: e.target.value }
                        }))}
                      />
                      <Input
                        placeholder="Location"
                        value={resumeData.personal_info.location}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personal_info: { ...prev.personal_info, location: e.target.value }
                        }))}
                      />
                      <Input
                        placeholder="LinkedIn URL"
                        value={resumeData.personal_info.linkedin}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personal_info: { ...prev.personal_info, linkedin: e.target.value }
                        }))}
                      />
                      <Input
                        placeholder="GitHub URL"
                        value={resumeData.personal_info.github}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personal_info: { ...prev.personal_info, github: e.target.value }
                        }))}
                      />
                    </div>
                    <Input
                      placeholder="Portfolio URL"
                      value={resumeData.personal_info.portfolio}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personal_info: { ...prev.personal_info, portfolio: e.target.value }
                      }))}
                    />
                    <Textarea
                      placeholder="Professional Summary"
                      rows={4}
                      value={resumeData.personal_info.summary}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personal_info: { ...prev.personal_info, summary: e.target.value }
                      }))}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Work Experience</CardTitle>
                    <Button onClick={addExperience}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.experience.map((exp, index) => (
                      <div key={exp.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">Experience {index + 1}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setResumeData(prev => ({
                              ...prev,
                              experience: prev.experience.filter(e => e.id !== exp.id)
                            }))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Job Title"
                            value={exp.title}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              experience: prev.experience.map(item =>
                                item.id === exp.id ? { ...item, title: e.target.value } : item
                              )
                            }))}
                          />
                          <Input
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              experience: prev.experience.map(item =>
                                item.id === exp.id ? { ...item, company: e.target.value } : item
                              )
                            }))}
                          />
                          <Input
                            placeholder="Location"
                            value={exp.location}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              experience: prev.experience.map(item =>
                                item.id === exp.id ? { ...item, location: e.target.value } : item
                              )
                            }))}
                          />
                          <div className="flex gap-2">
                            <Input
                              placeholder="Start Date"
                              type="month"
                              value={exp.start_date}
                              onChange={(e) => setResumeData(prev => ({
                                ...prev,
                                experience: prev.experience.map(item =>
                                  item.id === exp.id ? { ...item, start_date: e.target.value } : item
                                )
                              }))}
                            />
                            <Input
                              placeholder="End Date"
                              type="month"
                              value={exp.end_date}
                              disabled={exp.current}
                              onChange={(e) => setResumeData(prev => ({
                                ...prev,
                                experience: prev.experience.map(item =>
                                  item.id === exp.id ? { ...item, end_date: e.target.value } : item
                                )
                              }))}
                            />
                          </div>
                        </div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              experience: prev.experience.map(item =>
                                item.id === exp.id ? { ...item, current: e.target.checked, end_date: e.target.checked ? '' : item.end_date } : item
                              )
                            }))}
                          />
                          Currently working here
                        </label>
                        <Textarea
                          placeholder="Job description and achievements"
                          rows={3}
                          value={exp.description}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            experience: prev.experience.map(item =>
                              item.id === exp.id ? { ...item, description: e.target.value } : item
                            )
                          }))}
                        />
                      </div>
                    ))}
                    {resumeData.experience.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No work experience added yet. Click "Add Experience" to start.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Education</CardTitle>
                    <Button onClick={addEducation}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.education.map((edu, index) => (
                      <div key={edu.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">Education {index + 1}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setResumeData(prev => ({
                              ...prev,
                              education: prev.education.filter(e => e.id !== edu.id)
                            }))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              education: prev.education.map(item =>
                                item.id === edu.id ? { ...item, degree: e.target.value } : item
                              )
                            }))}
                          />
                          <Input
                            placeholder="Institution"
                            value={edu.institution}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              education: prev.education.map(item =>
                                item.id === edu.id ? { ...item, institution: e.target.value } : item
                              )
                            }))}
                          />
                          <Input
                            placeholder="Location"
                            value={edu.location}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              education: prev.education.map(item =>
                                item.id === edu.id ? { ...item, location: e.target.value } : item
                              )
                            }))}
                          />
                          <Input
                            placeholder="GPA (optional)"
                            value={edu.gpa}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              education: prev.education.map(item =>
                                item.id === edu.id ? { ...item, gpa: e.target.value } : item
                              )
                            }))}
                          />
                          <Input
                            placeholder="Start Date"
                            type="month"
                            value={edu.start_date}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              education: prev.education.map(item =>
                                item.id === edu.id ? { ...item, start_date: e.target.value } : item
                              )
                            }))}
                          />
                          <Input
                            placeholder="End Date"
                            type="month"
                            value={edu.end_date}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              education: prev.education.map(item =>
                                item.id === edu.id ? { ...item, end_date: e.target.value } : item
                              )
                            }))}
                          />
                        </div>
                        <Textarea
                          placeholder="Additional details, honors, coursework"
                          rows={2}
                          value={edu.description}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            education: prev.education.map(item =>
                              item.id === edu.id ? { ...item, description: e.target.value } : item
                            )
                          }))}
                        />
                      </div>
                    ))}
                    {resumeData.education.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No education added yet. Click "Add Education" to start.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Input
                        placeholder="Add a skill and press Enter"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const skill = e.currentTarget.value.trim();
                            if (skill && !resumeData.skills.includes(skill)) {
                              setResumeData(prev => ({
                                ...prev,
                                skills: [...prev.skills, skill]
                              }));
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <button
                              onClick={() => setResumeData(prev => ({
                                ...prev,
                                skills: prev.skills.filter((_, i) => i !== index)
                              }))}
                              className="ml-1 hover:text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      {resumeData.skills.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No skills added yet. Type a skill and press Enter to add it.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Projects</CardTitle>
                    <Button onClick={addProject}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.projects.map((project, index) => (
                      <div key={project.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">Project {index + 1}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setResumeData(prev => ({
                              ...prev,
                              projects: prev.projects.filter(p => p.id !== project.id)
                            }))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Project Title"
                          value={project.title}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            projects: prev.projects.map(item =>
                              item.id === project.id ? { ...item, title: e.target.value } : item
                            )
                          }))}
                        />
                        <Textarea
                          placeholder="Project Description"
                          rows={3}
                          value={project.description}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            projects: prev.projects.map(item =>
                              item.id === project.id ? { ...item, description: e.target.value } : item
                            )
                          }))}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Project URL (optional)"
                            value={project.url}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              projects: prev.projects.map(item =>
                                item.id === project.id ? { ...item, url: e.target.value } : item
                              )
                            }))}
                          />
                          <Input
                            placeholder="GitHub URL (optional)"
                            value={project.github}
                            onChange={(e) => setResumeData(prev => ({
                              ...prev,
                              projects: prev.projects.map(item =>
                                item.id === project.id ? { ...item, github: e.target.value } : item
                              )
                            }))}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Add technology and press Enter"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const tech = e.currentTarget.value.trim();
                                if (tech && !project.technologies.includes(tech)) {
                                  setResumeData(prev => ({
                                    ...prev,
                                    projects: prev.projects.map(item =>
                                      item.id === project.id 
                                        ? { ...item, technologies: [...item.technologies, tech] }
                                        : item
                                    )
                                  }));
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.technologies.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="outline" className="flex items-center gap-1">
                                {tech}
                                <button
                                  onClick={() => setResumeData(prev => ({
                                    ...prev,
                                    projects: prev.projects.map(item =>
                                      item.id === project.id
                                        ? { ...item, technologies: item.technologies.filter((_, i) => i !== techIndex) }
                                        : item
                                    )
                                  }))}
                                  className="ml-1 hover:text-red-500"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    {resumeData.projects.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No projects added yet. Click "Add Project" to start.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Design & Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Template Style</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(['modern', 'classic', 'creative'] as const).map((template) => (
                          <div
                            key={template}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              resumeData.template === template
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setResumeData(prev => ({ ...prev, template }))}
                          >
                            <div className="text-center">
                              <div className="font-medium capitalize">{template}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                {template === 'modern' && 'Clean and professional'}
                                {template === 'classic' && 'Traditional and formal'}
                                {template === 'creative' && 'Bold and unique'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Color Theme</h3>
                      <div className="flex flex-wrap gap-3">
                        {[
                          '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
                          '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
                        ].map((color) => (
                          <div
                            key={color}
                            className={`w-10 h-10 rounded-full cursor-pointer border-4 ${
                              resumeData.color_theme === color
                                ? 'border-gray-800 scale-110'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setResumeData(prev => ({ ...prev, color_theme: color }))}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
