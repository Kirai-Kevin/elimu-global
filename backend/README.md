# Elimu Global Backend

A comprehensive e-learning platform backend built with NestJS, MongoDB, and Prisma.

## Features

- Course Management (CRUD operations)
- Video Upload and Management
- User Authentication and Authorization
- Course Search and Filtering
- Course Content Generation using AI
- Student Enrollment System
- Instructor Management

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd elimu-global/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your configuration.

4. Generate Prisma client:
```bash
npx prisma generate
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Documentation

### Course Management
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create a new course
- `PUT /api/courses/:id` - Update course details
- `DELETE /api/courses/:id` - Delete a course
- `POST /api/courses/:id/upload` - Upload course video
- `GET /api/courses/search` - Search courses

### User Management
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Environment Variables

Required environment variables:

```env
DATABASE_URL=mongodb://localhost:27017/your_database
JWT_SECRET=your-jwt-secret
API_URL=http://localhost:3000
GROQ_API_KEY=your-groq-api-key
```

See `.env.example` for all available options.

## File Structure

```
backend/
├── src/
│   ├── courses/         # Course management
│   ├── users/           # User management
│   ├── auth/            # Authentication
│   └── common/          # Shared utilities
├── prisma/
│   └── schema.prisma    # Database schema
├── uploads/             # Uploaded files
└── test/               # Test files
```

## Security

- All sensitive data is stored in environment variables
- File uploads are validated and sanitized
- JWT authentication for protected routes
- Input validation using class-validator
- CORS protection enabled

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
