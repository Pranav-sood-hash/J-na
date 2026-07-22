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
    repo_url: initialData?.repo_url || '',
    tags: initialData?.tags?.join(', ') || '',
    editingStyle: initialData?.tags?.[0] || '',
    is_visible: initialData?.is_visible ?? true,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload file to Supabase Storage
      const filename = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('portfolio-media')
        .upload(filename, file);

      if (error) {
        throw new Error(error.message || 'Upload failed');
      }

      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filename);

      setFormData(prev => ({ ...prev, media_url: publicUrlData.publicUrl }));

      toast({
        title: 'File uploaded',
        description: 'Your file has been uploaded successfully.',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Combine editing style with other tags
      let allTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

      if (formData.type === 'video' && formData.editingStyle) {
        // Add editing style as first tag if not already present
        if (!allTags.includes(formData.editingStyle)) {
          allTags = [formData.editingStyle, ...allTags];
        }
      }

      await onSubmit({
        type: formData.type as 'certificate' | 'video' | 'website',
        title: formData.title,
        description: formData.description || null,
        media_url: formData.media_url || null,
        external_link: formData.external_link || null,
        repo_url: formData.type === 'website' ? (formData.repo_url || null) : null,
        tags: allTags.length > 0 ? allTags : null,
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
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" fill="%23999" text-anchor="middle" dy=".3em" font-size="16"%3EImage Preview%3C/text%3E%3C/svg%3E';
                  }}
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

          {formData.type === 'video' && formData.external_link && !formData.media_url && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <iframe
                src={formData.external_link.includes('youtube') ? formData.external_link.replace('watch?v=', 'embed/') : formData.external_link}
                title="Video Preview"
                className="w-full h-full"
                allowFullScreen
              />
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
            {formData.type === 'video' ? 'Video URL (YouTube, Vimeo, etc.)' : 'Live Website URL'}
          </Label>
          <Input
            id="external_link"
            type="url"
            value={formData.external_link}
            onChange={(e) => setFormData(prev => ({ ...prev, external_link: e.target.value }))}
            placeholder={formData.type === 'video' ? 'https://youtube.com/...' : 'https://example.com'}
          />
          {formData.external_link && formData.type === 'website' && (
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              <a
                href={formData.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm break-all"
              >
                {formData.external_link}
              </a>
            </div>
          )}
        </div>
      )}

      {/* GitHub Repository URL (ONLY for websites) */}
      {formData.type === 'website' && (
        <div className="space-y-2">
          <Label htmlFor="repo_url">GitHub Repository URL</Label>
          <Input
            id="repo_url"
            type="url"
            value={formData.repo_url}
            onChange={(e) => setFormData(prev => ({ ...prev, repo_url: e.target.value }))}
            placeholder="https://github.com/username/repository"
          />
        </div>
      )}

      {/* Editing Style (for videos) */}
      {formData.type === 'video' && (
        <div className="space-y-2">
          <Label>Editing Style</Label>
          <Select
            value={formData.editingStyle}
            onValueChange={(value) => {
              setFormData(prev => ({ ...prev, editingStyle: value }));
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
