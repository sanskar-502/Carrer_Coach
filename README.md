# 🚀 AI Career Coach

A comprehensive AI-powered career development platform built with Next.js, designed to help professionals accelerate their career growth through personalized guidance, interview preparation, and smart resume creation.


## ✨ Features

### 🧠 AI-Powered Career Guidance
- Personalized career advice and insights powered by advanced AI technology
- Industry-specific recommendations and growth strategies
- Real-time career path analysis and suggestions

### 💼 Interview Preparation
- Practice with role-specific questions across 50+ industries
- Instant feedback and performance analytics
- Behavioral and technical interview simulations
- AI-generated improvement tips and strategies

### 📊 Industry Insights
- Real-time industry trends and market analysis
- Salary data and compensation insights
- Demand level analysis and growth projections
- Top skills identification for each industry

### 📝 Smart Resume Creation
- ATS-optimized resume generation with AI assistance
- Industry-specific formatting and keyword optimization
- Real-time feedback and scoring
- Professional templates and customization options

### 🎯 Cover Letter Generator
- AI-powered cover letter creation
- Job-specific customization
- Professional tone and structure optimization
- Multiple format options

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful and accessible UI components
- **Lucide React** - Icon library
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend & Database
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database (Neon DB)
- **Clerk** - Authentication and user management
- **Inngest** - Background job processing

### AI & External Services
- **Google Gemini AI** - AI-powered features
- **React Markdown** - Markdown rendering
- **Recharts** - Data visualization
- **HTML2PDF.js** - PDF generation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon DB recommended)
- Clerk account for authentication
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sanskar-502/Carrer_Coach.git
   cd Carrer_Coach/ai-career-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="your_postgresql_connection_string"
   
   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
   
   # AI Services
   GEMINI_API_KEY="your_gemini_api_key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai-career-coach/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   │   ├── dashboard/     # User dashboard
│   │   ├── resume/        # Resume builder
│   │   ├── interview/     # Interview preparation
│   │   ├── ai-cover-letter/ # Cover letter generator
│   │   └── onboarding/    # User onboarding
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   ├── header.jsx        # Navigation header
│   └── hero.jsx          # Landing page hero
├── data/                 # Static data and content
├── lib/                  # Utility functions and configurations
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── hooks/                # Custom React hooks
```

## 🎯 Key Features Explained

### Dashboard
- Personalized career insights and recommendations
- Progress tracking and goal setting
- Recent activity and performance metrics

### Resume Builder
- AI-powered resume creation with industry-specific optimization
- ATS scoring and feedback
- Multiple template options and customization

### Interview Preparation
- Comprehensive question bank across various categories
- Performance analytics and improvement suggestions
- Mock interview simulations with AI feedback

### Cover Letter Generator
- Job-specific cover letter creation
- AI-powered content optimization
- Professional formatting and structure

## 🔧 Configuration

### Database Setup
The application uses PostgreSQL with Prisma ORM. Make sure to:
1. Set up a PostgreSQL database (Neon DB recommended for production)
2. Update the `DATABASE_URL` in your `.env` file
3. Run database migrations: `npx prisma db push`

### Authentication
Clerk handles all authentication. Configure:
1. Create a Clerk application
2. Add your Clerk keys to the environment variables
3. Configure sign-in/sign-up URLs

### AI Integration
Google Gemini AI powers the intelligent features:
1. Get a Gemini API key from Google AI Studio
2. Add the key to your environment variables
3. The AI will provide personalized career guidance and content generation

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Clerk](https://clerk.com/) for authentication
- [Prisma](https://www.prisma.io/) for database management
- [Google Gemini AI](https://ai.google.dev/) for AI capabilities

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Reach out to the maintainers

---

**Built with ❤️ by Sanskar**

*Empowering careers with AI-driven insights and guidance.* 
