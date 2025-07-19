-- Create volunteer opportunities table
CREATE TABLE IF NOT EXISTS public.volunteer_opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    duration TEXT NOT NULL,
    requirements TEXT,
    benefits TEXT,
    application_deadline DATE,
    start_date DATE,
    end_date DATE,
    type TEXT NOT NULL DEFAULT 'volunteer', -- volunteer, internship, job, tender
    status TEXT NOT NULL DEFAULT 'active', -- active, inactive, closed, filled
    category TEXT,
    tags TEXT[], -- array of tags
    contact_email TEXT,
    contact_phone TEXT,
    application_url TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_active ON public.volunteer_opportunities(active);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_status ON public.volunteer_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_type ON public.volunteer_opportunities(type);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_category ON public.volunteer_opportunities(category);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_order ON public.volunteer_opportunities(order_index);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_created_at ON public.volunteer_opportunities(created_at);

-- Enable Row Level Security
ALTER TABLE public.volunteer_opportunities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow all users to read active opportunities
CREATE POLICY "Allow public read access to active opportunities" ON public.volunteer_opportunities
    FOR SELECT USING (active = true AND status = 'active');

-- Allow authenticated users to create opportunities
CREATE POLICY "Allow authenticated users to create opportunities" ON public.volunteer_opportunities
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own opportunities
CREATE POLICY "Allow users to update own opportunities" ON public.volunteer_opportunities
    FOR UPDATE USING (auth.uid() = created_by);

-- Allow users to delete their own opportunities
CREATE POLICY "Allow users to delete own opportunities" ON public.volunteer_opportunities
    FOR DELETE USING (auth.uid() = created_by);

-- Allow admins to manage all opportunities
CREATE POLICY "Allow admins to manage all opportunities" ON public.volunteer_opportunities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_volunteer_opportunities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_volunteer_opportunities_updated_at
    BEFORE UPDATE ON public.volunteer_opportunities
    FOR EACH ROW
    EXECUTE FUNCTION update_volunteer_opportunities_updated_at();

-- Insert some sample opportunities
INSERT INTO public.volunteer_opportunities (
    title, 
    description, 
    location, 
    duration, 
    requirements, 
    benefits, 
    type, 
    status, 
    category, 
    tags, 
    order_index
) VALUES 
    (
        'Field Program Assistant',
        'Support water and sanitation projects in rural communities. Work directly with local communities to implement sustainable development solutions.',
        'Kenya',
        '6-12 months',
        'Background in development studies, community work experience preferred, willingness to work in remote areas',
        'Hands-on field experience, cultural immersion, professional development, networking opportunities',
        'volunteer',
        'active',
        'Field Work',
        ARRAY['water', 'sanitation', 'community', 'rural'],
        1
    ),
    (
        'Education Coordinator',
        'Help implement girls'' education programs and community outreach. Develop and deliver educational content, train local teachers, and monitor program effectiveness.',
        'Bangladesh',
        '12 months',
        'Education background, teaching experience, strong communication skills, cultural sensitivity',
        'Leadership experience, educational impact, cross-cultural skills, professional growth',
        'volunteer',
        'active',
        'Education',
        ARRAY['education', 'girls', 'teaching', 'outreach'],
        2
    ),
    (
        'Digital Marketing Volunteer',
        'Create content and manage social media campaigns. Help raise awareness about our programs and impact through digital channels.',
        'Remote',
        '3-6 months',
        'Marketing or communications background, social media experience, creative writing skills',
        'Portfolio building, remote work experience, digital marketing skills, flexible schedule',
        'volunteer',
        'active',
        'Digital',
        ARRAY['marketing', 'social media', 'content', 'remote'],
        3
    ),
    (
        'Grant Writer',
        'Research and write funding proposals for development projects. Help secure funding for critical programs and initiatives.',
        'Remote',
        'Ongoing',
        'Grant writing experience, research skills, excellent writing ability, attention to detail',
        'Professional development, networking, impact on funding, flexible commitment',
        'volunteer',
        'active',
        'Fundraising',
        ARRAY['grants', 'funding', 'proposals', 'research'],
        4
    ),
    (
        'Translation Services',
        'Translate documents and materials into local languages. Help make our resources accessible to diverse communities.',
        'Remote',
        'Flexible',
        'Native language proficiency, translation experience, cultural understanding, attention to detail',
        'Language skills development, cultural exchange, flexible hours, remote work',
        'volunteer',
        'active',
        'Language',
        ARRAY['translation', 'language', 'cultural', 'remote'],
        5
    ),
    (
        'Monitoring & Evaluation',
        'Assess impact and effectiveness of climate resilience programs. Collect and analyze data to measure program success.',
        'Guatemala',
        '6 months',
        'M&E experience, data analysis skills, field research background, Spanish proficiency preferred',
        'Research experience, data analysis skills, field work, professional development',
        'volunteer',
        'active',
        'Research',
        ARRAY['monitoring', 'evaluation', 'climate', 'research'],
        6
    ),
    (
        'Community Health Worker',
        'Support health education and basic medical services in underserved communities. Work with local health systems to improve access to care.',
        'Uganda',
        '8 months',
        'Health background, community work experience, cultural sensitivity, adaptability',
        'Healthcare experience, community impact, cultural immersion, professional growth',
        'volunteer',
        'active',
        'Health',
        ARRAY['health', 'community', 'education', 'medical'],
        7
    ),
    (
        'Environmental Conservation Specialist',
        'Work on reforestation and wildlife conservation projects. Help protect natural resources and promote sustainable practices.',
        'Tanzania',
        '9 months',
        'Environmental science background, field work experience, physical fitness, passion for conservation',
        'Conservation experience, outdoor work, environmental impact, professional development',
        'volunteer',
        'active',
        'Environment',
        ARRAY['conservation', 'environment', 'wildlife', 'sustainability'],
        8
    ); 