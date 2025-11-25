# qoupl - Find Your Perfect Match

A beautiful, modern landing page for the qoupl dating app built with Next.js, Tailwind CSS, Shadcn UI, and Framer Motion.

## Features

- **Modern UI**: Built with Shadcn UI components and Tailwind CSS
- **Animations**: Smooth animations powered by Framer Motion
- **Dark/Light Mode**: Fully responsive theme switching
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Purple Theme**: Beautiful purple gradient design matching the qoupl brand
- **Optimized**: Built with Next.js for optimal performance

## Tech Stack

- **Framework**: Next.js 16.0.3 with App Router
- **Styling**: Tailwind CSS v3
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **Theme**: next-themes for dark/light mode
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build

To build the project for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Deploy on Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

### Quick Deploy

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Click "Deploy"

### Manual Deploy

You can also deploy using the Vercel CLI:

```bash
npm install -g vercel
vercel
```

Follow the prompts to deploy your application.

## Project Structure

```
couple/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles and CSS variables
├── components/
│   ├── navbar.tsx          # Navigation bar
│   ├── theme-toggle.tsx    # Dark/light mode toggle
│   ├── theme-provider.tsx  # Theme provider wrapper
│   ├── sections/
│   │   ├── hero.tsx        # Hero section
│   │   ├── features.tsx    # Features section
│   │   ├── coming-soon.tsx # Coming soon CTA section
│   │   └── footer.tsx      # Footer section
│   └── ui/                 # Shadcn UI components
├── lib/
│   └── utils.ts            # Utility functions
└── public/                 # Static assets

```

## Customization

### Colors

The purple theme is configured in `app/globals.css`. You can modify the CSS variables to change the brand colors:

```css
--primary: 271 91% 65%; /* Purple color */
```

### Content

Edit the content in the component files under `components/sections/` to customize the text and features.

## License

This project is licensed under the MIT License.

## Support

For any questions or issues, please open an issue in the repository.
