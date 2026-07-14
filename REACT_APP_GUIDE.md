# React Portfolio Application - Complete Guide

## Overview
A fully functional React portfolio application with admin panel, built with TypeScript, React Router, and Vite.

## Features
- **Portfolio Display**: Beautiful, responsive portfolio showcase
- **Admin Dashboard**: Full-featured content management system
- **Authentication**: Secure login system with password protection
- **Dynamic Routing**: React Router for seamless navigation
- **Real-time Preview**: Preview portfolio changes instantly
- **Data Persistence**: LocalStorage for data management
- **Export/Import**: JSON-based data backup and restore

## Application Structure

### Routes
- `/` - Portfolio homepage (public)
- `/portfolio/:username` - User-specific portfolio view (public)
- `/login` - Admin login page
- `/admin` - Admin dashboard (protected)

### Key Components
- **PortfolioDisplay**: Main portfolio showcase
- **AdminDashboard**: Content management interface
- **Login**: Authentication page
- **Navigation**: Portfolio navigation with admin link
- **Sidebar**: Admin panel navigation

## Getting Started

### Installation
```bash
cd app
npm install
```

### Development Server
```bash
npm run dev
```
Access at: http://localhost:5173/

### Build for Production
```bash
npm run build
```

## Usage

### Viewing Portfolio
1. Open http://localhost:5173/
2. Browse the portfolio sections
3. Click the settings icon to access admin panel

### Admin Access
1. Navigate to http://localhost:5173/login
2. Enter password: `admin123`
3. Access the admin dashboard


### Managing Content
1. **Personal Info**: Update name, title, contact details
2. **Social Links**: Add/edit social media profiles
3. **About Section**: Edit bio and highlights
4. **Skills**: Manage technical skills with proficiency levels
5. **Projects**: Add/edit/delete portfolio projects
6. **Experience**: Manage work experience entries
7. **Education**: Update educational background
8. **Certifications**: Add professional certifications
9. **Achievements**: Showcase awards and accomplishments

### Preview Portfolio
1. Click "Preview Portfolio" in the admin sidebar
2. Opens in new tab with URL: `/portfolio/your-name`
3. View real-time changes to your portfolio

### Data Management
- **Export**: Download portfolio data as JSON
- **Import**: Upload previously exported JSON data
- **Reset**: Restore default portfolio configuration

## Technical Stack
- **React 19**: Latest React with hooks
- **TypeScript**: Type-safe development
- **React Router**: Client-side routing
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Lucide Icons**: Beautiful icon library
- **Sonner**: Toast notifications

## Default Credentials
- **Username**: Not required
- **Password**: `admin123`

## Data Storage
All portfolio data is stored in browser LocalStorage:
- Key: `portfolio_admin_data`
- Format: JSON
- Persists across sessions

## Customization
Edit `/src/config/portfolio.ts` to change default portfolio data.

## Production Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure server for client-side routing (redirect all routes to index.html)

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Development Tips
- Hot reload enabled in dev mode
- TypeScript errors shown in terminal
- Use React DevTools for debugging
- Check browser console for errors
