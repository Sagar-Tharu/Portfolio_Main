# Portfolio React Application

A modern, fully-featured portfolio website with an integrated admin panel for content management.

## 🚀 Quick Start

### Option 1: Using the Start Script (Windows)
```bash
start.bat
```

### Option 2: Manual Start
```bash
npm install
npm run dev
```

The application will be available at:
- **Portfolio**: http://localhost:5173/
- **Admin Panel**: http://localhost:5173/admin
- **Login**: http://localhost:5173/login

## 🔑 Default Credentials
- **Password**: `admin123`

## ✨ Features

### Portfolio Website
- Responsive design with modern UI
- Animated hero section with particles
- Skills showcase with proficiency levels
- Project gallery with filtering
- Work experience timeline
- Education and certifications
- Contact form
- Social media links

### Admin Dashboard
- Secure authentication
- Real-time content editing
- Portfolio preview in new tab
- Data export/import (JSON)
- Reset to defaults
- Persistent storage (LocalStorage)

## 📁 Project Structure

```
app/
├── src/
│   ├── components/       # Reusable components
│   │   ├── admin/       # Admin dashboard components
│   │   └── ui/          # UI component library
│   ├── sections/        # Portfolio sections
│   ├── pages/           # Page components
│   ├── context/         # React context providers
│   ├── config/          # Configuration files
│   ├── types/           # TypeScript types
│   └── lib/             # Utility functions
├── public/              # Static assets
└── dist/                # Production build
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Lucide Icons** - Icon library
- **Sonner** - Toast notifications

## 📝 Usage Guide

### Viewing the Portfolio
1. Navigate to http://localhost:5173/
2. Browse through different sections
3. Click the settings icon (⚙️) to access admin panel


### Managing Content
1. Go to http://localhost:5173/login
2. Enter password: `admin123`
3. Edit content in the admin dashboard:
   - Personal Information
   - Social Links
   - About Section
   - Skills
   - Projects
   - Experience
   - Education
   - Certifications
   - Achievements

### Preview Changes
1. Click "Preview Portfolio" in the admin sidebar
2. Opens in new tab with URL: `/portfolio/your-name`
3. See your changes in real-time

### Data Management
- **Export**: Download your portfolio data as JSON
- **Import**: Upload previously exported data
- **Reset**: Restore default configuration

## 🏗️ Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

### Deployment
1. Build the application
2. Upload the `dist` folder to your hosting service
3. Configure your server to redirect all routes to `index.html` (for client-side routing)

#### Example Nginx Configuration
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Example Apache Configuration (.htaccess)
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 🎨 Customization

### Default Portfolio Data
Edit `src/config/portfolio.ts` to change the default portfolio content.

### Styling
- Tailwind configuration: `tailwind.config.js`
- Global styles: `src/index.css`
- Component styles: Inline with Tailwind classes

### Authentication
Change the default password in `src/context/AuthContext.tsx`:
```typescript
const ADMIN_PASSWORD = 'your-new-password';
```

## 📱 Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Portfolio homepage | Public |
| `/portfolio/:username` | User-specific portfolio | Public |
| `/login` | Admin login | Public |
| `/admin` | Admin dashboard | Protected |

## 🔒 Security Notes

- Password is stored in code (for demo purposes)
- In production, use proper backend authentication
- Implement JWT tokens or session management
- Use environment variables for sensitive data
- Add rate limiting for login attempts

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is busy, Vite will automatically use the next available port.

### Build Errors
```bash
npm run lint
npm run build
```

### Clear Cache
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Additional Documentation

See `REACT_APP_GUIDE.md` for detailed technical documentation.
