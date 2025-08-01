# Gogo - Ride-Hailing Service Platform

A simplified clone of Grab's ride-hailing system, built with Python Flask and MongoDB.

## Project Overview

Gogo is a web-based ride-hailing service that connects passengers with nearby drivers. The platform features real-time location tracking, intelligent driver matching, and a dual-interface system for both passengers and drivers.

## Key Features

### For Passengers
- Interactive map-based ride booking
- Real-time location selection (pickup and destination)
- Weather information integration
- User registration and authentication
- Ride history tracking
- Contact and feedback submission

### For Drivers
- Toggle availability status
- Real-time order notifications
- Trip management interface
- Automated distance-based matching
- Driver registration and authentication

### For Administrators
- Dashboard for system monitoring
- User and driver management
- Trip analytics
- Feedback management

## Technical Stack

### Frontend
- **HTML5/CSS3/JavaScript**
- **Bootstrap 5.3** - UI Framework
- **Font Awesome 6.4** - Icons
- **Google Maps API** - Location Services
- **TikTok Sans** - Primary Font
- **XHR** - API Communication
- **Component System** - Modular HTML structure

### Backend
- **Python Flask** - Server Framework
- **MongoDB** - Database
- **Google Maps API** - Distance Matrix
- **Weather API** - Real-time Weather Data

## Color Scheme
- Primary Blue: `#093FB4`
- Pure White: `#FFFCFB`
- Light Pink: `#FFD8D8`
- Accent Red: `#ED3500`

## Project Structure
```
├── main.py                 # Server initialization and API routes
├── database.py            # MongoDB connection and database operations
├── static/
│   ├── components/        # Reusable HTML components
│   │   ├── footer.html
│   │   └── header.html
│   ├── css/
│   │   └── variables.css  # CSS variables and theming
│   ├── js/
│   │   └── component-loader.js  # Component integration system
│   └── img/              # Image assets
├── templates/
│   ├── index.html        # Portal page
│   ├── home.html         # Main user interface
│   ├── driver.html       # Driver interface
│   ├── about.html        # Company information
│   ├── contact.html      # Contact form
│   ├── dashboard.html    # Admin dashboard
│   ├── auth/
│   │   ├── user/        # User authentication pages
│   │   └── driver/      # Driver authentication pages
└── start.bat             # Server startup script
```

## API Endpoints (Planned)

### User Endpoints
- `POST /api/auth/user/register` - User registration
- `POST /api/auth/user/login` - User login
- `POST /api/rides/request` - Create ride request
- `GET /api/rides/status/:id` - Check ride status

### Driver Endpoints
- `POST /api/auth/driver/register` - Driver registration
- `POST /api/auth/driver/login` - Driver login
- `PUT /api/driver/status` - Update availability status
- `GET /api/driver/orders` - Get assigned orders
- `PUT /api/rides/complete/:id` - Mark ride as complete

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/drivers` - Driver management

## Database Schema (Planned)

### Users Collection
```json
{
    "id": "ObjectId",
    "name": "String",
    "phone": "String",
    "email": "String",
    "password": "String(hashed)",
    "created_at": "DateTime"
}
```

### Drivers Collection
```json
{
    "id": "ObjectId",
    "name": "String",
    "phone": "String",
    "email": "String",
    "password": "String(hashed)",
    "vehicle_info": {
        "type": "String",
        "plate": "String"
    },
    "status": "String(available/busy)",
    "current_location": {
        "lat": "Number",
        "lng": "Number"
    },
    "created_at": "DateTime"
}
```

### Rides Collection
```json
{
    "id": "ObjectId",
    "user_id": "ObjectId",
    "driver_id": "ObjectId",
    "pickup": {
        "lat": "Number",
        "lng": "Number",
        "address": "String"
    },
    "destination": {
        "lat": "Number",
        "lng": "Number",
        "address": "String"
    },
    "status": "String(pending/accepted/completed/cancelled)",
    "created_at": "DateTime",
    "completed_at": "DateTime"
}
```

## Setup Instructions (To be implemented)

1. Install Python dependencies
2. Set up MongoDB local instance
3. Configure environment variables
4. Run the server using start.bat

## Development Phases

### Phase 1 - Core Setup
- Basic project structure
- Database connection
- Authentication system
- Basic UI components

### Phase 2 - Ride Features
- Map integration
- Location selection
- Driver matching algorithm
- Real-time notifications

### Phase 3 - Enhanced Features
- Weather integration
- Trip history
- Rating system
- Analytics dashboard

### Phase 4 - Optimization
- Performance improvements
- UI/UX enhancements
- Security hardening
- Testing and debugging

## Contributing

This is a learning project. Contributions and suggestions are welcome.

## License

This project is for educational purposes only.
