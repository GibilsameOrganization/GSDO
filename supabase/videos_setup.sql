-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration INTEGER, -- in seconds
    file_size INTEGER, -- in bytes
    category TEXT,
    tags TEXT[], -- array of tags
    active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_active ON public.videos(active);
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_order ON public.videos(order_index);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at);

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow all users to read active videos
CREATE POLICY "Allow public read access to active videos" ON public.videos
    FOR SELECT USING (active = true);

-- Allow authenticated users to create videos
CREATE POLICY "Allow authenticated users to create videos" ON public.videos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own videos
CREATE POLICY "Allow users to update own videos" ON public.videos
    FOR UPDATE USING (auth.uid() = created_by);

-- Allow users to delete their own videos
CREATE POLICY "Allow users to delete own videos" ON public.videos
    FOR DELETE USING (auth.uid() = created_by);

-- Allow admins to manage all videos
CREATE POLICY "Allow admins to manage all videos" ON public.videos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create videos storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'videos',
    'videos',
    true,
    104857600, -- 100MB limit
    ARRAY['video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime', 'image/jpeg', 'image/png']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for videos bucket
CREATE POLICY "Allow public read access to videos" ON storage.objects
    FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Allow authenticated users to upload videos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'videos' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Allow users to update own videos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'videos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Allow users to delete own videos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'videos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON public.videos
    FOR EACH ROW
    EXECUTE FUNCTION update_videos_updated_at();

-- Insert some sample videos (optional)
-- INSERT INTO public.videos (title, description, video_url, category, tags, active, order_index)
-- VALUES 
--     ('Welcome to GSDO', 'Learn about our mission and impact', 'https://example.com/video1.mp4', 'Introduction', ARRAY['mission', 'impact'], true, 1),
--     ('Our Work in Action', 'See how we make a difference', 'https://example.com/video2.mp4', 'Impact', ARRAY['work', 'difference'], true, 2),
--     ('Community Stories', 'Hear from the communities we serve', 'https://example.com/video3.mp4', 'Stories', ARRAY['community', 'stories'], true, 3); 