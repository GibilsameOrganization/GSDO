# Video Management System

## Overview

The GSDO website now includes a comprehensive video management system that allows admins to upload, manage, and display videos throughout the website. The system supports video uploads, automatic thumbnail generation, categorization, and flexible display options.

## Features

### 🎥 Video Management
- **Upload Support**: MP4, WebM, MOV, AVI formats (up to 100MB)
- **Automatic Thumbnails**: Auto-generated from video content
- **Categorization**: Organize videos by category and tags
- **Order Control**: Set display order for videos
- **Active/Inactive**: Toggle video visibility

### 🎨 Display Options
- **VideoPlayer**: Responsive video player with custom controls
- **VideoGallery**: Grid layout with search and filtering
- **VideoSection**: Curated sections for specific pages
- **Modal Playback**: Click to play videos in modal overlay

### 🔧 Admin Features
- **CRUD Operations**: Create, read, update, delete videos
- **Bulk Management**: Manage multiple videos efficiently
- **Upload Progress**: Real-time upload progress tracking
- **File Validation**: Automatic file type and size validation

## Database Schema

### Videos Table
```sql
CREATE TABLE videos (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration INTEGER, -- seconds
    file_size INTEGER, -- bytes
    category TEXT,
    tags TEXT[], -- array
    active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by UUID REFERENCES auth.users(id)
);
```

### Storage Bucket
- **Bucket Name**: `videos`
- **File Size Limit**: 100MB
- **Supported Formats**: MP4, WebM, MOV, AVI, JPEG, PNG
- **Public Access**: Videos are publicly accessible

## Setup Instructions

### 1. Database Setup
Run the SQL script in your Supabase dashboard:

```sql
-- Execute supabase/videos_setup.sql in Supabase SQL Editor
```

### 2. Storage Bucket
The script automatically creates the `videos` storage bucket with proper policies.

### 3. Component Integration

#### Admin Panel
The VideoManager is already integrated into the admin panel at `/manage` under the "Videos" tab.

#### Public Pages
Add video sections to any page:

```tsx
import VideoSection from '@/components/VideoSection';
import VideoGallery from '@/components/VideoGallery';

// For a curated section
<VideoSection 
  title="Our Impact Videos"
  description="See our work in action"
  category="impact"
  limit={3}
  layout="featured"
/>

// For a full gallery
<VideoGallery 
  title="All Videos"
  showFilters={true}
/>
```

## Components

### VideoUploader
Handles video file uploads with validation and progress tracking.

**Props:**
- `onUploadComplete`: Callback when upload completes
- `folder`: Storage folder name (default: 'videos')

### VideoPlayer
Responsive video player with custom controls.

**Props:**
- `src`: Video URL
- `poster`: Thumbnail URL
- `title`: Video title
- `controls`: Show/hide controls
- `aspectRatio`: 16:9, 4:3, or 1:1

### VideoGallery
Grid layout with search and filtering capabilities.

**Props:**
- `category`: Filter by category
- `limit`: Maximum videos to show
- `showFilters`: Enable search/filter UI
- `title`: Section title
- `description`: Section description

### VideoSection
Curated video sections for specific pages.

**Props:**
- `title`: Section title
- `description`: Section description
- `category`: Filter by category
- `limit`: Maximum videos to show
- `layout`: 'grid', 'carousel', or 'featured'
- `showViewAll`: Show "View All" button

### VideoManager
Admin interface for managing videos.

**Features:**
- Upload videos with metadata
- Edit video information
- Delete videos
- Toggle active status
- Set display order

## Usage Examples

### 1. Add Videos to Hero Section
```tsx
// In HeroSlidesManager.tsx
<VideoUploader 
  onUploadComplete={(url, thumbnail) => {
    // Handle video upload for hero slides
  }}
/>
```

### 2. Add Videos to Stories
```tsx
// In StoriesManager.tsx
<VideoUploader 
  onUploadComplete={(url, thumbnail) => {
    // Handle video upload for stories
  }}
/>
```

### 3. Create Video-Focused Page
```tsx
// In a new page component
import VideoGallery from '@/components/VideoGallery';

const VideosPage = () => {
  return (
    <div>
      <VideoGallery 
        title="Our Video Library"
        description="Explore our collection of impact videos"
        showFilters={true}
      />
    </div>
  );
};
```

### 4. Add Video Section to Homepage
```tsx
// In Index.tsx or any page
import VideoSection from '@/components/VideoSection';

<VideoSection 
  title="Featured Videos"
  description="See our work in action"
  category="featured"
  limit={3}
  layout="featured"
/>
```

## File Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── VideoManager.tsx      # Admin video management
│   │   └── VideoUploader.tsx     # Video upload component
│   ├── VideoPlayer.tsx           # Video player component
│   ├── VideoGallery.tsx          # Video gallery component
│   └── VideoSection.tsx          # Video section component
├── integrations/supabase/
│   └── types.ts                  # Updated with videos table
└── pages/
    └── Admin.tsx                 # Updated with video tab
```

## Security

### Row Level Security (RLS)
- Public read access to active videos
- Authenticated users can create videos
- Users can update/delete their own videos
- Admins can manage all videos

### Storage Policies
- Public read access to videos
- Authenticated users can upload
- Users can update/delete their own files
- File type and size validation

## Performance Considerations

### Video Optimization
- Automatic thumbnail generation
- File size validation (100MB limit)
- Supported format validation
- Progress tracking for large uploads

### Display Optimization
- Lazy loading for video galleries
- Responsive design for all screen sizes
- Modal playback to avoid page navigation
- Caching for frequently accessed videos

## Troubleshooting

### Common Issues

1. **Upload Fails**
   - Check file size (max 100MB)
   - Verify file format (MP4, WebM, MOV, AVI)
   - Ensure user is authenticated

2. **Videos Not Displaying**
   - Check if video is marked as active
   - Verify storage bucket permissions
   - Check browser console for errors

3. **Thumbnail Not Generating**
   - Video format may not support thumbnail generation
   - Check browser console for errors
   - Manual thumbnail upload available

### Debug Commands
```javascript
// Test video upload
const { data, error } = await supabase.storage
  .from('videos')
  .upload('test.mp4', file);

// Test video fetch
const { data, error } = await supabase
  .from('videos')
  .select('*')
  .eq('active', true);
```

## Future Enhancements

### Planned Features
- Video playlists
- Video analytics
- Advanced video editing
- Video compression
- Live streaming support
- Video comments and ratings

### Integration Opportunities
- YouTube/Vimeo integration
- Social media sharing
- Video transcripts
- Accessibility features
- Multi-language support

## Support

For issues or questions about the video system:
1. Check the browser console for errors
2. Verify Supabase storage bucket setup
3. Test with different video formats
4. Review RLS policies in Supabase dashboard 