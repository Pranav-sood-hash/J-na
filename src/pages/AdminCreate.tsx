import { Award, Play, Globe } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

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
  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Content</h1>
          <p className="text-muted-foreground">
            Database functionality has been removed. Content creation is no longer available.
          </p>
        </div>

        {/* Type Selection - Disabled */}
        <div className="grid sm:grid-cols-3 gap-4">
          {contentTypes.map(({ id, name, icon: Icon, description }) => (
            <div
              key={id}
              className="opacity-50 cursor-not-allowed bg-card border border-border rounded-xl p-6 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{name}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCreate;
