# 🚀 AI Career Catalyst

An intelligent career development platform powered by AI that helps professionals accelerate their career growth through personalized guidance, smart resume building, and expert interview preparation.

![AI Career Catalyst](https://img.shields.io/badge/AI-Career%20Catalyst-blue?style=for-the-badge&logo=artificial-intelligence)
![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)


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

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15.1.4 with React 18 and TypeScript
- **Styling**: Tailwind CSS with custom components and glass-morphism effects
- **Authentication**: Clerk for user management and security
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: Google Gemini 2.5 Flash for content generation
- **UI Components**: Radix UI primitives with custom styling
- **Charts**: Recharts for data visualization
- **PDF Generation**: html2pdf.js for document export

### Project Structure
```
├── app/                    # Next.js 15 app router
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   ├── globals.css        # Global styles and utilities
│   └── layout.js          # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (buttons, cards, etc.)
│   ├── header.jsx        # Navigation header
│   ├── hero.jsx          # Landing page hero section
│   └── scroll-to-top.jsx # Scroll restoration component
├── actions/              # Server actions
│   ├── dashboard.js      # Industry insights and AI generation
│   ├── resume.js         # Resume management
│   ├── cover-letter.js   # Cover letter generation
│   ├── interview.js      # Interview prep and assessments
│   └── user.js           # User management and onboarding
├── lib/                  # Utility libraries
│   ├── prisma.js         # Database client
│   ├── checkUser.js      # User authentication helper
│   └── utils.js          # Common utilities
├── data/                 # Static data files
│   ├── features.js       # Feature definitions
│   ├── testimonials.js   # Customer testimonials
│   ├── faqs.js          # Frequently asked questions
│   └── howItWorks.js    # Process flow data
└── prisma/              # Database schema and migrations
    ├── schema.prisma     # Database schema
    └── migrations/       # Database migration files
```

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

## 🗃️ Database Schema

### Core Models
- **User** - User profiles with industry and skill information
- **Resume** - Resume content and metadata
- **CoverLetter** - Generated cover letters with job details
- **Assessment** - Interview assessment results and feedback
- **IndustryInsight** - AI-generated market intelligence data

### Key Features
- **Automatic user creation** from Clerk authentication
- **Industry-specific insights** with AI-generated content
- **Progress tracking** with detailed analytics
- **Secure data isolation** per user

## 🤖 AI Integration

### Google Gemini 2.5 Flash
- **Resume Enhancement** - Improves resume content with industry-specific optimization
- **Cover Letter Generation** - Creates personalized cover letters based on job descriptions
- **Interview Questions** - Generates technical interview questions by industry and skills
- **Industry Insights** - Provides real-time market analysis and trending skills
- **Improvement Tips** - Offers personalized feedback based on assessment results

### AI Features
- Context-aware content generation
- Industry-specific customization
- Real-time data processing
- Intelligent content optimization

## 🎨 UI/UX Design

### Design System
- **Glass-morphism** effects with backdrop blur
- **Gradient backgrounds** and text styling
- **Responsive design** for all device sizes
- **Smooth animations** and micro-interactions
- **Dark mode support** with theme switching

### Components
- Custom UI components built on Radix UI
- Consistent spacing and typography
- Accessible form controls and navigation
- Interactive charts and data visualization

## 🔐 Security & Authentication

### Clerk Integration
- Enterprise-grade authentication
- Social login support (Google, GitHub, etc.)
- Secure session management
- User profile synchronization

### Data Security
- Server-side validation for all user inputs
- Secure API endpoints with authentication checks
- Database isolation per user
- Environment variable protection for sensitive data

## 📊 Features Overview

### Resume Builder
- **Form-based editor** with guided sections
- **Markdown preview** with real-time updates
- **AI enhancement** for content optimization
- **PDF export** with professional formatting
- **ATS optimization** for applicant tracking systems

### Cover Letter Generator
- **Job-specific customization** with company and role details
- **AI-powered personalization** based on user profile
- **Industry-tailored content** with relevant keywords
- **Multiple format support** with export options

### Interview Preparation
- **Technical question generation** by industry and skills
- **Multiple choice assessments** with instant feedback
- **Performance tracking** with detailed analytics
- **Improvement recommendations** with personalized tips

### Industry Dashboard
- **Real-time market data** with salary insights
- **Trending skills analysis** with growth projections
- **Industry outlook** with market forecasts
- **Personalized recommendations** for skill development

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
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically with each push

### Docker
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup
- Configure PostgreSQL database (Railway, Supabase, or AWS RDS)
- Set up Clerk authentication with production keys
- Configure Google Gemini API access
- Update CORS and domain settings

## 📈 Performance

### Optimization Features
- **Server-side rendering** with Next.js 15
- **Image optimization** with next/image
- **Code splitting** for faster load times
- **Caching strategies** for API responses
- **Progressive loading** for enhanced UX

### Monitoring
- Real-time error tracking
- Performance metrics monitoring
- User analytics and insights
- Database query optimization

## 🔧 Advanced Configuration

### Customization Options
- **Theme configuration** in `tailwind.config.js`
- **API endpoints** in server actions
- **UI components** in `/components` directory
- **Database schema** in `prisma/schema.prisma`

### Feature Flags
```javascript
// Enable/disable features
const features = {
  aiEnhancement: true,
  pdfExport: true,
  industryInsights: true,
  interviewPrep: true,
}
```

## 📱 Mobile Support

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Touch-friendly interfaces
- Optimized layouts for all screen sizes
- Progressive Web App (PWA) capabilities

## 🧪 Testing

### Test Setup
```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Testing Stack
- **Jest** for unit testing
- **React Testing Library** for component testing
- **Playwright** for end-to-end testing
- **MSW** for API mocking

## 🛠️ Troubleshooting

### Common Issues
1. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check PostgreSQL service status
   - Ensure network connectivity

2. **Authentication Issues**
   - Verify Clerk API keys
   - Check domain configuration
   - Review CORS settings

3. **AI API Errors**
   - Validate GEMINI_API_KEY
   - Check API quota limits
   - Review request formatting

4. **Transaction Timeout Errors**
   - AI generation may take 10-15 seconds
   - System automatically retries failed operations
   - Check network connectivity

### Debug Mode
```bash
# Enable debug logging
DEBUG=true npm run dev
```

## 📚 Documentation

### API Documentation
- Server actions documented with JSDoc
- Database schema with detailed comments
- Component props with TypeScript definitions

### User Guides
- Getting started tutorial
- Feature walkthroughs
- Best practices guide
- Troubleshooting tips

## 🤝 Contributing

We welcome contributions to AI Career Catalyst! Here's how you can help:

### Development Process
1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** with proper testing
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request** with detailed description

### Code Standards
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Issues and Bugs
- Use GitHub Issues for bug reports
- Provide detailed reproduction steps
- Include system information and error logs
- Label issues appropriately

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