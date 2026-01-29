-- Insert sample opportunities data
INSERT INTO public.opportunities (title, description, type, domain, company, location, deadline, tags, source_url, is_approved, featured, remote_work_allowed, experience_required, salary_min, salary_max, salary_currency)
VALUES
  ('Software Engineering Intern - Summer 2026', 'Join our team as a Software Engineering Intern! Work on cutting-edge technology projects and learn from industry experts. You''ll contribute to real products used by millions of users worldwide.', 'Internship', 'Tech', 'Google', 'Mountain View, CA', '2026-03-15', ARRAY['Python', 'Java', 'Machine Learning', 'Cloud'], 'https://careers.google.com', true, true, true, 'Entry Level', 8000, 12000, 'USD'),
  
  ('Full Stack Developer', 'We''re looking for a passionate Full Stack Developer to join our growing team. Build modern web applications using React and Node.js. Great opportunity for career growth.', 'Job', 'Tech', 'Microsoft', 'Seattle, WA', '2026-04-30', ARRAY['React', 'Node.js', 'TypeScript', 'Azure'], 'https://careers.microsoft.com', true, true, true, 'Mid Level', 120000, 180000, 'USD'),
  
  ('Data Science Fellowship', 'A 6-month fellowship program for aspiring data scientists. Learn from top researchers and work on real-world data problems in healthcare, finance, and climate.', 'Fellowship', 'Tech', 'MIT', 'Cambridge, MA', '2026-02-28', ARRAY['Python', 'Machine Learning', 'Statistics', 'R'], 'https://mit.edu/fellowship', true, true, false, 'Entry Level', 5000, 7000, 'USD'),
  
  ('Global Hackathon 2026', 'Compete with developers worldwide in this 48-hour hackathon. Build innovative solutions and win prizes worth $100,000. Open to all skill levels.', 'Contest', 'Tech', 'GitHub', 'Remote', '2026-05-15', ARRAY['Open Source', 'Innovation', 'Collaboration'], 'https://github.com/hackathon', true, true, true, 'All Levels', NULL, NULL, 'USD'),
  
  ('STEM Excellence Scholarship', 'Full scholarship for outstanding students pursuing STEM degrees. Covers tuition, books, and living expenses for up to 4 years.', 'Scholarship', 'Education', 'Gates Foundation', 'Global', '2026-04-01', ARRAY['STEM', 'Undergraduate', 'Full Ride'], 'https://gatesfoundation.org/scholarship', true, true, false, 'Entry Level', 50000, 75000, 'USD'),
  
  ('UX Design Internship', 'Learn user experience design from industry professionals. Work on real projects for Fortune 500 clients and build your portfolio.', 'Internship', 'Design', 'IDEO', 'San Francisco, CA', '2026-03-01', ARRAY['UX Design', 'Figma', 'User Research', 'Prototyping'], 'https://ideo.com/careers', true, false, true, 'Entry Level', 6000, 8000, 'USD'),
  
  ('Product Manager - Early Career', 'Launch your product management career with our structured program. Rotate through different product teams and learn the full product lifecycle.', 'Job', 'Tech', 'Amazon', 'Seattle, WA', '2026-05-30', ARRAY['Product Management', 'Analytics', 'Strategy'], 'https://amazon.jobs', true, false, true, 'Entry Level', 100000, 150000, 'USD'),
  
  ('AI Research Internship', 'Work with our AI research team on frontier machine learning projects. Publish papers and contribute to open-source AI tools.', 'Internship', 'Tech', 'OpenAI', 'San Francisco, CA', '2026-02-15', ARRAY['AI', 'Deep Learning', 'Python', 'Research'], 'https://openai.com/careers', true, true, true, 'Graduate', 10000, 15000, 'USD'),
  
  ('Women in Tech Scholarship', 'Supporting women pursuing careers in technology. Includes mentorship, networking opportunities, and financial support.', 'Scholarship', 'Tech', 'Anita Borg Institute', 'Global', '2026-03-30', ARRAY['Women in Tech', 'Diversity', 'STEM'], 'https://anitab.org/scholarship', true, false, false, 'All Levels', 25000, 35000, 'USD'),
  
  ('Startup Weekend Competition', 'Turn your ideas into a real startup in just 54 hours. Network with investors, mentors, and fellow entrepreneurs.', 'Contest', 'Marketing', 'Techstars', 'Austin, TX', '2026-04-20', ARRAY['Entrepreneurship', 'Startup', 'Pitch'], 'https://techstars.com/startup-weekend', true, false, true, 'All Levels', NULL, NULL, 'USD'),
  
  ('Financial Analyst Program', 'Two-year rotational program for aspiring financial analysts. Gain exposure to investment banking, asset management, and corporate finance.', 'Job', 'Finance', 'Goldman Sachs', 'New York, NY', '2026-06-15', ARRAY['Finance', 'Excel', 'Financial Modeling', 'Analytics'], 'https://goldmansachs.com/careers', true, false, true, 'Entry Level', 85000, 110000, 'USD'),
  
  ('Healthcare Innovation Challenge', 'Design solutions to improve healthcare delivery and patient outcomes. Winners receive funding and mentorship to develop their ideas.', 'Contest', 'Healthcare', 'Johnson & Johnson', 'New Brunswick, NJ', '2026-05-01', ARRAY['Healthcare', 'Innovation', 'MedTech'], 'https://jnj.com/innovation', true, false, true, 'All Levels', NULL, NULL, 'USD');

-- Update view counts for some opportunities to make them look active
UPDATE public.opportunities SET view_count = floor(random() * 500 + 50)::int WHERE is_approved = true;