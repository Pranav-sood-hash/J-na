import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PortfolioContent } from '@/hooks/usePortfolioContent';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isVideoUrl } from '@/utils/mediaUtils';

interface ContentFormProps {
  initialData?: PortfolioContent | null;
  contentType?: 'certificate' | 'video' | 'website';
  onSubmit: (data: Omit<PortfolioContent, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

const editingStyles = [
  'Typography',
  'Motion Graphics',
  'Vlog',
  'Documentary',
  'Cinematic',
  'Reels',
];

const ContentForm = ({ initialData, contentType, onSubmit, onCancel }: ContentFormProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    type: initialData?.type || contentType || 'certificate',
    title: initialData?.title || '',
    description: initialData?.description || '',
    media_url: initialData?.media_url || '',
    external_link: initialData?.external_link || '',
    tags: initialData?.tags?.join(', ') || '',
    is_visible: initialData?.is_visible ?? true,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Convert file to data URL for local storage
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setFormData(prev => ({ ...prev, media_url: dataUrl }));

        toast({
          title: 'File uploaded',
          description: 'Your file has been uploaded successfully.',
        });
        setIsUploading(false);
      };
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        type: formData.type as 'certificate' | 'video' | 'website',
        title: formData.title,
        description: formData.description || null,
        media_url: formData.media_url || null,
        external_link: formData.external_link || null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : null,
        is_visible: formData.is_visible,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Content Type */}
      {!contentType && (
        <div className="space-y-2">
          <Label>Content Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: 'certificate' | 'video' | 'website') => setFormData(prev => ({ ...prev, type: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
            <SelectContent>
              <SelectItem value="certificate">Certificate</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="website">Website</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter title"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter description"
          rows={4}
        />
      </div>

      {/* Media Upload */}
      <div className="space-y-2">
        <Label>Media File</Label>
        <div className="space-y-3">
          {formData.media_url && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              {formData.type === 'video' && isVideoUrl(formData.media_url) ? (
                <video
                  src={formData.media_url}
                  controls
                  controlsList="nodownload"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                  preload="metadata"
                />
              ) : (
                <img
                  src={formData.media_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, media_url: '' }))}
                className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept={formData.type === 'video' ? 'video/*,image/*' : 'image/*'}
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Upload File
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* External Link (for videos and websites) */}
      {(formData.type === 'video' || formData.type === 'website') && (
        <div className="space-y-2">
          <Label htmlFor="external_link">
            {formData.type === 'video' ? 'Video URL (YouTube, Vimeo, etc.)' : 'Website URL'}
          </Label>
          <Input
            id="external_link"
            type="url"
            value={formData.external_link}
            onChange={(e) => setFormData(prev => ({ ...prev, external_link: e.target.value }))}
            placeholder={formData.type === 'video' ? 'https://youtube.com/...' : 'https://example.com'}
          />
        </div>
      )}

      {/* Editing Style (for videos) */}
      {formData.type === 'video' && (
        <div className="space-y-2">
          <Label>Editing Style</Label>
          <Select
            value={formData.tags?.split(',')[0]?.trim() || ''}
            onValueChange={(value) => {
              const otherTags = formData.tags?.split(',').slice(1).join(',') || '';
              setFormData(prev => ({ 
                ...prev, 
                tags: value + (otherTags ? `, ${otherTags}` : '') 
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select editing style" />
            </SelectTrigger>
            <SelectContent>
              {editingStyles.map((style) => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="React, TypeScript, Web Development"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.title}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            initialData ? 'Update' : 'Create'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ContentForm;
