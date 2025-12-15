# Barangay Information System

A comprehensive information management system for barangay (village) administration and services built with modern web technologies.

## Overview

This system helps barangay officials efficiently manage resident information, issue certificates, track document requests, and maintain organized records.

## Features

- **Resident Management**: Complete resident profiles with demographic information
- **Certificate Issuance**: Generate various barangay certificates (Clearance, Residency, Indigency, etc.)
- **Request Tracking**: Monitor and process document requests with priority levels
- **Officials Management**: Track current and historical barangay officials
- **Dashboard Analytics**: Real-time statistics and trends visualization
- **User Management**: Role-based access control (Admin, Staff, Clerk)
- **Activity Logging**: Comprehensive audit trail of system actions

## Technologies Used

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** for authentication
- **Joi** for validation
- **bcryptjs** for password hashing

### Frontend
- **React.js 18** with **Vite**
- **React Router** for navigation
- **Axios** for API communication
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons
- **React Toastify** for notifications
- **Zustand** for state management

### DevOps
- **Docker** & Docker Compose
- **PostgreSQL 15** Alpine

## Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for local development)
- Git

## Installation

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/gladysobmerga/brgy_infosys.git
   cd brgy_infosys
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Update environment variables in `.env` as needed.

4. Start all services:
   ```bash
   docker-compose up --build -d
   ```

5. Access the application:
   - **Frontend**: http://localhost:7685
   - **Backend API**: http://localhost:7000
   - **Database**: localhost:5432

6. Check service status:
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

### Local Development Setup

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your database credentials
npm run dev
```

#### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Default Credentials

- **Username**: `admin`
- **Password**: `Admin@123`

⚠️ **Important**: Change the default password after first login!

## Quick Start Guide

1. **Start the system**:
   ```bash
   docker-compose up -d
   ```

2. **Open your browser** and navigate to: http://localhost:7685

3. **Login** with default credentials (admin / Admin@123)

4. **Explore the features**:
   - View dashboard statistics
   - Manage residents
   - Issue certificates
   - Track document requests
   - Manage barangay officials

## Database Schema

The system includes the following main tables:
- `users` - System users with role-based access
- `residents` - Resident information with complete profiles
- `certificates` - Issued certificates with tracking
- `certificate_types` - Available certificate types and fees
- `document_requests` - Document requests from residents
- `barangay_officials` - Current and historical officials
- `activity_logs` - Complete system audit trail

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify JWT token

### Residents
- `GET /api/residents` - List all residents (paginated, searchable)
- `GET /api/residents/:id` - Get resident details
- `POST /api/residents` - Create new resident
- `PUT /api/residents/:id` - Update resident information
- `DELETE /api/residents/:id` - Deactivate resident

### Certificates
- `GET /api/certificates` - List certificates (paginated)
- `GET /api/certificates/types` - Get available certificate types
- `GET /api/certificates/:id` - Get certificate details
- `POST /api/certificates` - Issue new certificate
- `PATCH /api/certificates/:id/status` - Update certificate status

### Requests
- `GET /api/requests` - List document requests (with filters)
- `POST /api/requests` - Create new document request
- `PATCH /api/requests/:id/status` - Update request status

### Officials
- `GET /api/officials/current` - Get current barangay officials
- `GET /api/officials` - Get all officials (including history)
- `POST /api/officials` - Add new official (admin only)
- `PUT /api/officials/:id` - Update official information
- `PATCH /api/officials/:id/end-term` - End official's term

### Dashboard
- `GET /api/dashboard/stats` - Get system statistics
- `GET /api/dashboard/activities` - Get recent activities
- `GET /api/dashboard/certificates/by-type` - Certificate statistics by type
- `GET /api/dashboard/certificates/trends` - Monthly certificate trends

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Start with rebuild
docker-compose up --build -d

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart a service
docker-compose restart backend

# Check service status
docker-compose ps

# Access database CLI
docker-compose exec db psql -U brgy_admin -d brgy_infosys

# Access backend container
docker-compose exec backend sh
```

## Project Structure

```
brgy_infosys/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # API route handlers
│   │   └── index.js        # Main server file
│   ├── sql/
│   │   ├── schema.sql      # Database schema
│   │   └── seed.sql        # Initial seed data
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context (Auth)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── App.js          # Main app component
│   │   ├── index.js        # Entry point
│   │   └── index.css       # Global styles
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── docker-compose.yml
├── .env.example
└── README.md
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access Control**: Admin, Staff, Clerk roles
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Configurable origins
- **Rate Limiting**: API request throttling
- **HTTP Security Headers**: Helmet.js integration
- **Input Validation**: Joi schema validation

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :7685  # Frontend
lsof -i :7000  # Backend

# Stop the process or change ports in docker-compose.yml
```

### Database Connection Issues
```bash
# Check if database is healthy
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Frontend Not Loading
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up --build frontend
```

### Backend API Not Responding
```bash
# Check backend logs
docker-compose logs backend

# Check if routes are loaded
docker-compose exec backend ls -la src/routes/

# Restart backend
docker-compose restart backend
```

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Style

The project follows standard JavaScript/React conventions. Use ESLint and Prettier for code formatting.

### Adding New Features

1. Create feature branch
2. Implement backend API endpoint
3. Add frontend component/page
4. Test thoroughly
5. Submit pull request

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=7000
DB_HOST=db
DB_PORT=5432
DB_USER=brgy_admin
DB_PASSWORD=brgy_pass_2024
DB_NAME=brgy_infosys
JWT_SECRET=your_secret_key
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:7000
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Email: admin@barangay.local
- Documentation: See README.md

## Roadmap

- [x] User authentication and authorization
- [x] Resident management system
- [x] Certificate issuance tracking
- [x] Document request management
- [x] Dashboard with analytics
- [ ] SMS notifications for certificate status
- [ ] Mobile responsive improvements
- [ ] Digital signature for certificates
- [ ] Online payment integration
- [ ] PDF certificate generation
- [ ] Blotter records management
- [ ] Household profiling system
- [ ] Advanced reporting module

## Acknowledgments

- Built for barangay administration modernization
- Inspired by best practices in government information systems
- Community-driven development

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintainer**: gladysobmerga
