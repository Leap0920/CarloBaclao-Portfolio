# Carlo Baclao - Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Clean White Theme**: Minimalist design with maximized spacing
- **Sidebar Navigation**: Persistent navigation with Home, About, Achievements, and Projects sections
- **Resume Modal**: Interactive resume display that keeps the sidebar visible
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **TypeScript**: Full type safety throughout the application
- **Modern Stack**: Built with Next.js 14+, TypeScript, and Tailwind CSS

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── contexts/           # React Context providers
├── data/              # Static data and content
├── types/             # TypeScript type definitions
└── ...
```

## Key Components

- **Sidebar**: Navigation with user profile and menu
- **UserProfile**: Profile photo, name, title, and resume button
- **NavigationMenu**: Four-section navigation (Home, About, Achievements, Projects)
- **ResumeModal**: Modal overlay for resume display
- **ContentArea**: Dynamic content display for each section

## Customization

### Profile Information
Update the profile data in `src/data/resume.ts` and `src/data/content.tsx`

### Profile Photo
Replace `public/profile-placeholder.svg` with your actual profile photo

### Content
Modify the content for each section in `src/data/content.tsx`

## Technologies Used

- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Context**: State management
- **Next.js Image**: Optimized image loading

## License

© 2026 Carlo Baclao. All rights reserved.
