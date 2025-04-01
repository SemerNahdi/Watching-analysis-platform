# Watch Platform Analysis

A modern web application for analyzing and tracking watch platform metrics, built with Next.js and powered by AI.

## Features

- 🤖 AI-powered video analysis
- 📊 Advanced engagement metrics
- 💬 Interactive chat interface
- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- 🌙 Dark/Light mode support
- 📱 Responsive design
- 🔒 Secure authentication with Supabase
- ⚡ Fast performance with Next.js App Router

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Supabase](https://supabase.com) - Backend and authentication
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Spline](https://spline.design) - 3D graphics
- [Google AI SDK](https://ai.google.dev/) - AI capabilities

## Getting Started

1. Clone the repository:

   ```bash
   git clone [your-repo-url]
   cd watch-platform-analysis
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                 # Next.js app router pages
├── components/         # React components
├── lib/               # Utility functions and configurations
├── types/             # TypeScript type definitions
├── hooks/             # Custom React hooks
├── utils/             # Helper functions
└── public/            # Static assets
```

## Features in Detail

### Pricing Tiers

- **Hobbyist**: Free tier for casual creators
- **Creator**: $29/month for growing creators
- **Pro**: $99/month for professional content creators
- **Enterprise**: Custom pricing for teams and agencies

### Key Components

- Hero section with 3D graphics
- Feature showcase
- Interactive pricing section
- FAQ section
- AI-powered chat interface
- Google Gemini effect demo

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
