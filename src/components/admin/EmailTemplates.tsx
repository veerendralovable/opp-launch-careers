import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Eye,
  Save
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'opportunity' | 'welcome' | 'reminder' | 'newsletter' | 'custom';
  created_at: string;
}

const EmailTemplates = ({ onSelectTemplate }: { onSelectTemplate: (template: EmailTemplate) => void }) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Welcome Email',
      subject: 'Welcome to OpportunityHub!',
      content: `Dear {{name}},

Welcome to OpportunityHub! We're excited to have you join our community of students and professionals seeking amazing opportunities.

Here's what you can do:
• Browse thousands of internships and job opportunities
• Discover scholarships and contests
• Bookmark your favorite opportunities
• Get personalized recommendations

Best regards,
The OpportunityHub Team`,
      type: 'welcome',
      created_at: '2024-01-15'
    },
    {
      id: '2',
      name: 'New Opportunity Alert',
      subject: 'New {{opportunity_type}} Opportunity: {{title}}',
      content: `Hi {{name}},

We found a new {{opportunity_type}} that matches your interests:

**{{title}}**
Company: {{company}}
Location: {{location}}
Deadline: {{deadline}}

{{description}}

Apply now: {{apply_link}}

Best regards,
OpportunityHub`,
      type: 'opportunity',
      created_at: '2024-01-16'
    },
    {
      id: '3',
      name: 'Application Reminder',
      subject: 'Don\'t forget! {{title}} deadline approaching',
      content: `Hi {{name}},

This is a friendly reminder that the application deadline for "{{title}}" is approaching.

Deadline: {{deadline}}
Days remaining: {{days_remaining}}

Don't miss out on this opportunity!

Apply now: {{apply_link}}

Best regards,
OpportunityHub`,
      type: 'reminder',
      created_at: '2024-01-17'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'custom' as EmailTemplate['type']
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) return;

    const template: EmailTemplate = {
      id: Date.now().toString(),
      ...newTemplate,
      created_at: new Date().toISOString().split('T')[0]
    };

    setTemplates([...templates, template]);
    setNewTemplate({ name: '', subject: '', content: '', type: 'custom' });
    setIsCreating(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handleDuplicateTemplate = (template: EmailTemplate) => {
    const duplicated: EmailTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      created_at: new Date().toISOString().split('T')[0]
    };
    setTemplates([...templates, duplicated]);
  };

  const getTypeColor = (type: EmailTemplate['type']) => {
    switch (type) {
      case 'welcome': return 'bg-green-100 text-green-800';
      case 'opportunity': return 'bg-blue-100 text-blue-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'newsletter': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Templates</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Create/Edit Template Form */}
      {(isCreating || editingTemplate) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Create New Template' : 'Edit Template'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Template Name</label>
                <Input
                  value={editingTemplate ? editingTemplate.name : newTemplate.name}
                  onChange={(e) => editingTemplate 
                    ? setEditingTemplate({...editingTemplate, name: e.target.value})
                    : setNewTemplate({...newTemplate, name: e.target.value})
                  }
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingTemplate ? editingTemplate.type : newTemplate.type}
                  onChange={(e) => editingTemplate
                    ? setEditingTemplate({...editingTemplate, type: e.target.value as EmailTemplate['type']})
                    : setNewTemplate({...newTemplate, type: e.target.value as EmailTemplate['type']})
                  }
                >
                  <option value="custom">Custom</option>
                  <option value="welcome">Welcome</option>
                  <option value="opportunity">Opportunity</option>
                  <option value="reminder">Reminder</option>
                  <option value="newsletter">Newsletter</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Subject Line</label>
              <Input
                value={editingTemplate ? editingTemplate.subject : newTemplate.subject}
                onChange={(e) => editingTemplate
                  ? setEditingTemplate({...editingTemplate, subject: e.target.value})
                  : setNewTemplate({...newTemplate, subject: e.target.value})
                }
                placeholder="Enter email subject"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email Content</label>
              <Textarea
                value={editingTemplate ? editingTemplate.content : newTemplate.content}
                onChange={(e) => editingTemplate
                  ? setEditingTemplate({...editingTemplate, content: e.target.value})
                  : setNewTemplate({...newTemplate, content: e.target.value})
                }
                placeholder="Enter email content. Use {{variable}} for dynamic content."
                rows={10}
              />
              <p className="text-sm text-gray-500 mt-2">
                Available variables: {'{{name}}'}, {'{{email}}'}, {'{{title}}'}, {'{{company}}'}, {'{{location}}'}, {'{{deadline}}'}, {'{{apply_link}}'}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={editingTemplate ? () => {
                setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
                setEditingTemplate(null);
              } : handleCreateTemplate}>
                <Save className="h-4 w-4 mr-2" />
                {editingTemplate ? 'Update' : 'Create'} Template
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false);
                  setEditingTemplate(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates List */}
      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                    <Badge className={getTypeColor(template.type)}>
                      {template.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Subject:</strong> {template.subject}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(template.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingTemplate(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDuplicateTemplate(template)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {template.content}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmailTemplates;
