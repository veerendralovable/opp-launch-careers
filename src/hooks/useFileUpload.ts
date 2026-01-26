import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FileUploadOptions {
  bucket: string;
  folder?: string;
  allowedTypes?: string[];
  maxSize?: number; // in bytes
}

export const useFileUpload = (options: FileUploadOptions) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!user) throw new Error('User not authenticated');

    const { allowedTypes, maxSize = 10 * 1024 * 1024 } = options;

    // Validate file type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`);
    }

    // Validate file size
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
    }

    setUploading(true);
    setProgress(0);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = options.folder ? `${options.folder}/${fileName}` : fileName;

      // Track file upload in analytics
      await supabase
        .from('analytics')
        .insert({
          user_id: user.id,
          event_type: 'file_upload',
          event_data: {
            file_name: file.name,
            file_path: filePath,
            file_size: file.size,
            file_type: file.type,
            upload_status: 'uploading'
          },
          page_url: window.location.href
        });

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(filePath);

      setProgress(100);
      return publicUrl;

    } catch (error: any) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return { uploadFile, uploading, progress };
};
