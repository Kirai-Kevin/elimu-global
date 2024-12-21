# Elimu Global

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp frontend/.env.example frontend/.env
```

2. Add your API keys to the `.env` file:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

3. Never commit the `.env` file to version control

## Deployment on Render

### Prerequisites

1. Create a [Render](https://render.com) account
2. Connect your GitHub repository to Render
3. Set up your environment variables in Render's dashboard

### Deployment Steps

1. Frontend Deployment:
   - Create a new "Static Site" service in Render
   - Connect your repository
   - Set build command: `cd frontend && npm install && npm run build`
   - Set publish directory: `frontend/dist`
   - Add environment variables from `.env.example`

2. Backend Deployment:
   - Create a new "Web Service" in Render
   - Connect your repository
   - Set build command: `cd backend && npm install && npm run build`
   - Set start command: `cd backend && npm run start:prod`
   - Add environment variables:
     - `NODE_ENV=production`
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `GROQ_API_KEY`

3. Database Setup:
   - Create a new PostgreSQL database in Render
   - Add the database URL to your backend service's environment variables

### Automatic Deployments

The project is configured for automatic deployments:
- Frontend and backend will deploy automatically on pushes to the main branch
- Pull request previews are enabled for the frontend
- Health checks are configured for the backend

### Monitoring

- Backend health check endpoint: `/api/health`
- Monitor your services in the Render dashboard
- Check logs and metrics in real-time

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
elimu-global/
├── frontend/           # React frontend
│   ├── src/           # Source files
│   ├── public/        # Static files
│   └── dist/          # Build output
├── backend/           # NestJS backend
│   ├── src/           # Source files
│   └── dist/          # Build output
└── render.yaml        # Render deployment config