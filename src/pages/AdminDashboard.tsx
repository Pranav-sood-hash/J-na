import { Award, Play, Globe } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const contentTypes = [
  { id: 'certificate', name: 'Certificates', icon: Award },
  { id: 'video', name: 'Videos', icon: Play },
  { id: 'website', name: 'Websites', icon: Globe },
] as const;

const AdminDashboard = () => {
  const content: any[] = [];

  const getContentByType = (type: string) => {
    return content.filter(item => item.type === type);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Database functionality has been removed. Portfolio content is managed statically.
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-12">
        {contentTypes.map(({ id, name, icon: Icon }) => {
          const items = getContentByType(id);

          return (
            <section key={id}>
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{name}</h2>
                  <p className="text-sm text-muted-foreground">{items.length} items</p>
                </div>
              </div>

              {/* Content Grid */}
              <div className="bg-muted/30 border border-dashed border-border rounded-xl p-8 text-center">
                <Icon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No {name.toLowerCase()} available. Database has been removed.</p>
              </div>
            </section>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
