import { useState } from 'react';
import { Award, Play, Globe, Check } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ContentForm from '@/components/admin/ContentForm';
import { useToast } from '@/hooks/use-toast';

interface PortfolioContent {
  id: string;
  type: 'certificate' | 'video' | 'website';
  title: string;
  description: string | null;
  media_url: string | null;
  external_link: string | null;
  tags: string[] | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

const contentTypes = [
  { 
    id: 'certificate' as const, 
    name: 'Certificate', 
    icon: Award,
    description: 'Add a certificate or achievement'
  },
  { 
    id: 'video' as const, 
    name: 'Video', 
    icon: Play,
    description: 'Add a video project'
  },
  { 
    id: 'website' as const, 
    name: 'Website', 
    icon: Globe,
    description: 'Add a website project'
  },
];

const AdminCreate = () => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<'certificate' | 'video' | 'website' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCreate = async (data: Omit<PortfolioContent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Create a new content item with generated ID
      const newContent: PortfolioContent = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Store in localStorage
      const existingContent = localStorage.getItem('portfolio_content');
      const contentArray = existingContent ? JSON.parse(existingContent) : [];
      contentArray.push(newContent);
      localStorage.setItem('portfolio_content', JSON.stringify(contentArray));

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedType(null);
      }, 2000);
      toast({
        title: 'Content created',
        description: 'Your new content has been added to the portfolio.',
      });
    } catch (error) {
      console.error('Create error:', error);
      toast({
        title: 'Creation failed',
        description: 'Failed to create content. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (showSuccess) {
    return (
      <AdminLayout>
        <div className="max-w-md mx-auto py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Content Created!</h2>
          <p className="text-muted-foreground">Your new content has been added to the portfolio.</p>
        </div>
      </AdminLayout>
    );
  }

  if (selectedType) {
    const typeInfo = contentTypes.find(t => t.id === selectedType);

    return (
      <AdminLayout>
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {typeInfo && <typeInfo.icon className="w-6 h-6 text-primary" />}
              <h1 className="text-2xl font-bold text-foreground">
                Add New {typeInfo?.name}
              </h1>
            </div>
            <p className="text-muted-foreground">
              Fill in the details below to add a new {selectedType} to your portfolio.
            </p>
          </div>

          {/* Form */}
          <div className="bg-card border border-border rounded-xl p-6">
            <ContentForm
              contentType={selectedType}
              onSubmit={handleCreate}
              onCancel={() => setSelectedType(null)}
            />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Content</h1>
          <p className="text-muted-foreground">
            Choose the type of content you want to add to your portfolio.
          </p>
        </div>

        {/* Type Selection */}
        <div className="grid sm:grid-cols-3 gap-4">
          {contentTypes.map(({ id, name, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => setSelectedType(id)}
              className="group bg-card border border-border rounded-xl p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{name}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCreate;
