# JobTracker Pro - Full-Stack Job Application Tracker

A modern, responsive job application tracking system built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### 🔐 Authentication
- JWT-based authentication with Supabase
- Secure user registration and login
- Role-based access (Applicant/Admin)

### 📋 Job Application Management
- Full CRUD operations for job applications
- Track company name, job title, application status, applied date, and notes
- Status tracking: Applied, Interview, Offer, Rejected, Accepted

### 📊 Dashboard & Analytics
- Real-time statistics and success rate tracking
- Visual dashboard with key metrics
- Application status distribution

### 🔍 Advanced Filtering & Sorting
- Filter applications by status
- Sort by application date (ascending/descending)
- Real-time search and filtering

### 📱 Responsive Design
- Mobile-first responsive design
- Modern UI with smooth animations
- Professional gradient color schemes
- Hover states and micro-interactions

### 🔔 Real-time Notifications
- Toast notifications for all CRUD operations
- Success/error feedback for user actions
- Real-time updates across the application

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-application-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Copy `.env.example` to `.env` and fill in your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Set up the database**
   
   Run the following SQL in your Supabase SQL editor:

   ```sql
   -- Create user profiles table
   CREATE TABLE user_profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT NOT NULL,
     role TEXT DEFAULT 'applicant' CHECK (role IN ('applicant', 'admin')),
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

   -- Create policy for user profiles
   CREATE POLICY "Users can read own profile"
     ON user_profiles
     FOR SELECT
     TO authenticated
     USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile"
     ON user_profiles
     FOR UPDATE
     TO authenticated
     USING (auth.uid() = id);

   -- Create job applications table
   CREATE TABLE job_applications (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     company_name TEXT NOT NULL,
     job_title TEXT NOT NULL,
     status TEXT DEFAULT 'Applied' CHECK (status IN ('Applied', 'Interview', 'Offer', 'Rejected', 'Accepted')),
     applied_date DATE NOT NULL,
     notes TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

   -- Create policies for job applications
   CREATE POLICY "Users can read own applications"
     ON job_applications
     FOR SELECT
     TO authenticated
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own applications"
     ON job_applications
     FOR INSERT
     TO authenticated
     WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own applications"
     ON job_applications
     FOR UPDATE
     TO authenticated
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete own applications"
     ON job_applications
     FOR DELETE
     TO authenticated
     USING (auth.uid() = user_id);

   -- Create function to automatically create user profile
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.user_profiles (id, email)
     VALUES (NEW.id, NEW.email);
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Create trigger for new user registration
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

5. **Configure Supabase Auth**
   - Go to Authentication > Settings in your Supabase dashboard
   - Disable email confirmation for development (optional)
   - Configure your site URL and redirect URLs

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Register a new account or sign in

## Usage

### Adding Job Applications
1. Click the "Add Application" button
2. Fill in the company name, job title, status, applied date, and optional notes
3. Click "Add Application" to save

### Managing Applications
- **Edit**: Click the edit icon on any job card to modify details
- **Delete**: Click the trash icon and confirm to remove an application
- **Filter**: Use the status filter buttons to view specific application types
- **Sort**: Use the date sorting dropdown to organize by newest or oldest first

### Dashboard Analytics
- View total applications, pending applications, interviews scheduled
- Monitor your success rate (offers + accepted / total applications)
- Track application status distribution

## Deployment

### Frontend Deployment (Vercel)

1. **Prepare for deployment**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   - Push your code to a Git repository (GitHub, GitLab, or BitBucket)
   - Visit [Vercel](https://vercel.com/) and sign in 
   - Click "Add New Project" and import your repository
   - Set the framework preset to "Vite"
   - Add your environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy"
   - Your app is now live at your Vercel domain!

### Frontend Deployment (Render)

1. **Prepare for deployment**
   - Ensure your repository contains the `render.yaml` file

2. **Deploy to Render**
   - Push your code to a Git repository
   - Visit [Render](https://render.com/) and sign in
   - Click "New" and select "Blueprint"
   - Connect your repository
   - Add your environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Apply" and your app will deploy automatically

### Backend (Supabase)
- Supabase handles all backend functionality
- Database, authentication, and real-time features are managed automatically
- No additional backend deployment required

### Important Configuration Steps

1. **CORS Configuration in Supabase**
   - Go to your Supabase project dashboard
   - Navigate to Settings > API > CORS
   - Add your Vercel/Render deployment URLs to the allowed origins
   - Save your changes

2. **Supabase Authentication Configuration**
   - Navigate to Authentication > URL Configuration
   - Update the Site URL to your deployed app URL
   - Add the same URL to the Redirect URLs list

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthForm.tsx    # Authentication form
│   ├── Dashboard.tsx   # Analytics dashboard
│   ├── Header.tsx      # Application header
│   ├── JobCard.tsx     # Individual job application card
│   ├── JobFilters.tsx  # Filtering and sorting controls
│   └── JobForm.tsx     # Add/edit job application form
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── lib/                # Utility libraries
│   └── supabase.ts     # Supabase client configuration
├── store/              # State management
│   ├── authStore.ts    # Authentication state
│   └── jobStore.ts     # Job applications state
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@jobtracker.com or create an issue in the repository.