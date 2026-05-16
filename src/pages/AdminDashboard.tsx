import { useState } from 'react';
import { Award, Play, Globe, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ContentCard from '@/components/admin/ContentCard';
import ContentForm from '@/components/admin/ContentForm';
import { usePortfolioContent, PortfolioContent } from '@/hooks/usePortfolioContent';
import { useToast } from '@/hooks/use-toast';
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
  const { content, isLoading, updateContent, deleteContent, toggleVisibility } = usePortfolioContent(true);
  const { toast } = useToast();
  const [editingContent, setEditingContent] = useState<PortfolioContent | null>(null);

  const handleEdit = (item: PortfolioContent) => {
    setEditingContent(item);
  };

  const handleUpdate = async (data: Omit<PortfolioContent, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingContent) return;

    try {
      await updateContent(editingContent.id, data);
      setEditingContent(null);
      toast({
        title: 'Content updated',
        description: 'Your changes have been saved.',
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update content. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContent(id);
      toast({
        title: 'Content deleted',
        description: 'The content has been removed.',
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: 'Failed to delete content. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleVisibility = async (id: string, isVisible: boolean) => {
    try {
      await toggleVisibility(id, isVisible);
      toast({
        title: isVisible ? 'Content visible' : 'Content hidden',
        description: isVisible
          ? 'The content is now visible on your portfolio.'
          : 'The content is now hidden from your portfolio.',
      });
    } catch (error) {
      console.error('Toggle visibility error:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update visibility. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getContentByType = (type: string) => {
    return content.filter(item => item.type === type);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your portfolio content. Total items: {content.length}
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
              {items.length === 0 ? (
                <div className="bg-muted/30 border border-dashed border-border rounded-xl p-8 text-center">
                  <Icon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No {name.toLowerCase()} yet.</p>
                  <a
                    href="/admin/create"
                    className="text-primary hover:underline text-sm mt-2 inline-block"
                  >
                    Add your first {id}
                  </a>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((item) => (
                    <ContentCard
                      key={item.id}
                      content={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleVisibility={handleToggleVisibility}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingContent} onOpenChange={(open) => !open && setEditingContent(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {editingContent?.type}</DialogTitle>
          </DialogHeader>
          {editingContent && (
            <ContentForm
              initialData={editingContent}
              onSubmit={handleUpdate}
              onCancel={() => setEditingContent(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDashboard;
