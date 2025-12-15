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
- **React.js** with React Router
- **Axios** for API communication
- **Tailwind CSS** for styling
- **Headless UI** for components
- **Recharts** for data visualization

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
   docker-compose up -d
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

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

## Database Schema

The system includes the following main tables:
- `users` - System users with role-based access
- `residents` - Resident information
- `certificates` - Issued certificates
- `certificate_types` - Types of certificates available
- `document_requests` - Document requests from residents
- `barangay_officials` - Current and historical officials
- `activity_logs` - System audit trail

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify token

### Residents
- `GET /api/residents` - List all residents (paginated)
- `GET /api/residents/:id` - Get resident details
- `POST /api/residents` - Create new resident
- `PUT /api/residents/:id` - Update resident
- `DELETE /api/residents/:id` - Deactivate resident

### Certificates
- `GET /api/certificates` - List certificates (paginated)
- `GET /api/certificates/types` - Get certificate types
- `POST /api/certificates` - Issue new certificate
- `PATCH /api/certificates/:id/status` - Update certificate status

### Requests
- `GET /api/requests` - List document requests
- `POST /api/requests` - Create new request
- `PATCH /api/requests/:id/status` - Update request status

### Officials
- `GET /api/officials/current` - Get current officials
- `POST /api/officials` - Add new official (admin only)
- `PATCH /api/officials/:id/end-term` - End official's term

### Dashboard
- `GET /api/dashboard/stats` - Get system statistics
- `GET /api/dashboard/activities` - Get recent activities
- `GET /api/dashboard/certificates/by-type` - Certificate statistics
- `GET /api/dashboard/certificates/trends` - Monthly trends

## Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild services
docker-compose up -d --build

# Access database
docker-compose exec db psql -U brgy_user -d brgy_system
```

## Project Structure

```
brgy_infosys/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Authentication middleware
│   │   └── routes/         # API route handlers
│   ├── sql/
│   │   ├── schema.sql      # Database schema
│   │   └── seed.sql        # Initial data
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── .env.example
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based authorization
- SQL injection prevention with parameterized queries
- CORS protection
- Rate limiting
- Helmet.js for HTTP headers security

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
- Contact: admin@barangay.local

## Roadmap

- [ ] SMS notifications for certificate status
- [ ] Mobile application
- [ ] Digital signature for certificates
- [ ] Online payment integration
- [ ] Report generation (PDF exports)
- [ ] Blotter records management
- [ ] Household profiling

## Acknowledgments

- Built for barangay administration modernization
- Inspired by best practices in government information systems
