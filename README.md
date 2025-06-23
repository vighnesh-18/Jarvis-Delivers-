# Jarvis Delivers! 🤖🍕

A comprehensive full-stack AI-powered food delivery application with intelligent food recommendations using CrewAI agents. This project demonstrates modern web development practices with React, Node.js, Python FastAPI, and advanced AI integration.

## 📋 Table of Contents
- [🌟 Features](#-features)
- [🏗️ Architecture](#-architecture)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Configuration](#-configuration)
- [🎯 Usage](#-usage)
- [🤖 AI Agents](#-ai-agents)
- [📱 API Endpoints](#-api-endpoints)
- [🛠️ Tech Stack](#-tech-stack)
- [🔧 Development](#-development)
- [🎨 UI/UX Features](#-uiux-features)
- [🚀 Deployment](#-deployment)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Features

### Core Functionality
- **🤖 AI-Powered Recommendations**: Advanced CrewAI agents provide personalized food suggestions based on user preferences, mood, budget, and dietary restrictions
- **💬 Smart Chat Interface**: Natural language processing with real-time chat, typing indicators, and conversation history
- **🏪 Restaurant Discovery**: Browse local restaurants with detailed information, ratings, and menu items
- **🛒 Shopping Cart**: Persistent cart functionality with localStorage, quantity management, and real-time updates
- **🔐 User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **📦 Order Management**: Complete order lifecycle from cart to checkout with order tracking
- **📍 Address Management**: Save and manage multiple delivery addresses
- **📱 Responsive Design**: Mobile-first design that works seamlessly across all devices

### Advanced Features
- **🧠 Multi-Agent AI System**: Specialized agents for intent recognition, discovery, evaluation, and recommendations
- **💾 Data Persistence**: Chat history, cart state, and user preferences saved locally and in database
- **🔄 Real-time Updates**: Live cart updates, message delivery, and status changes
- **🎨 Modern UI/UX**: Beautiful gradients, animations, and micro-interactions
- **⚡ Performance Optimized**: Fast loading, efficient API calls, and optimized database queries
- **🛡️ Error Handling**: Comprehensive error handling with user-friendly messages and fallbacks

## 🏗️ Architecture

### System Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   AI Service   │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Python)      │
│   Port: 5173    │    │   Port: 5002    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       ▼
         │              ┌─────────────────┐    ┌─────────────────┐
         │              │   MongoDB       │    │   OpenAI API    │
         │              │   Database      │    │   (GPT Models)  │
         └──────────────┤   Port: 27017   │    │                 │
                        └─────────────────┘    └─────────────────┘
```

### Frontend (React + Vite)
- **Framework**: React 18 with modern hooks (useState, useEffect, useContext, useRef)
- **Styling**: Tailwind CSS with custom gradients and animations
- **Routing**: React Router v6 with protected routes
- **State Management**: Context API for global state (Auth, Cart, Address)
- **HTTP Client**: Axios with interceptors for API communication
- **Build Tool**: Vite for fast development and optimized builds
- **Features**: 
  - Component-based architecture
  - Custom hooks for reusable logic
  - Responsive design with mobile-first approach
  - Real-time chat interface with typing indicators
  - Persistent state management with localStorage

### Backend (Node.js + Express)
- **Framework**: Express.js with RESTful API design
- **Database**: MongoDB with Mongoose ODM for schema modeling
- **Authentication**: JWT tokens with bcryptjs for password hashing
- **Middleware**: CORS, error handling, authentication middleware
- **Architecture**: MVC pattern with controllers, models, and routes
- **Features**:
  - User authentication and authorization
  - Restaurant and food item management
  - Order processing and management
  - Address management
  - Chat integration with AI service
  - Database seeding with sample data

### AI Service (Python + FastAPI)
- **Framework**: FastAPI for high-performance async API
- **AI Framework**: CrewAI for multi-agent orchestration
- **Language Model**: OpenAI GPT integration for natural language processing
- **Architecture**: Agent-based system with specialized roles
- **Features**:
  - Intent recognition and understanding
  - Contextual food recommendations
  - Multi-turn conversation handling
  - Fallback mechanisms for API limits
  - Structured response formatting

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm (for frontend and backend)
- **Python** 3.8+ (for AI service)
- **MongoDB** (local installation or cloud instance)
- **OpenAI API Key** (for AI functionality)
- **Git** (for version control)

### Quick Start Guide

#### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd jarvis-delivers

# Install root dependencies
npm install
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration (see Configuration section)
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
```

#### 4. AI Service Setup
```bash
cd ai-service

# Create virtual environment
python -m venv ai_env

# Activate virtual environment
# Windows:
ai_env\Scripts\activate
# macOS/Linux:
source ai_env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Add your OpenAI API key
```

#### 5. Database Setup
```bash
# Start MongoDB (if running locally)
# Windows: mongod
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Seed the database with sample data
cd backend
node seedDatabase.js
```

#### 6. Start All Services
```bash
# Terminal 1: Backend
cd backend
npm run dev
# Runs on http://localhost:5002

# Terminal 2: AI Service
cd ai-service
# Activate virtual environment first
python main.py
# Runs on http://localhost:8000

# Terminal 3: Frontend
cd frontend
npm run dev
# Runs on http://localhost:5173
```

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
PORT=5002
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/jarvis-delivers

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# External Services
AI_SERVICE_URL=http://localhost:8000
```

#### AI Service (.env)
```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Service Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CrewAI Configuration
CREW_MODEL=gpt-3.5-turbo
MAX_ITERATIONS=3
```

#### Frontend Configuration
The frontend uses environment variables through Vite:

```env
# API Configuration
VITE_BACKEND_URL=http://localhost:5002
VITE_AI_SERVICE_URL=http://localhost:8000
```

### Database Configuration

#### MongoDB Setup Options

**Option 1: Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/jarvis-delivers`

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster and database
3. Get connection string and update MONGODB_URI

#### Sample Data
The project includes a comprehensive seeder script that creates:
- 5 restaurants with different cuisines
- 50+ food items distributed across restaurants
- Categories and pricing variety
- Realistic descriptions and metadata

```bash
cd backend
node seedDatabase.js
```

## 🎯 Usage

### User Journey

#### 1. Authentication
- **Register**: Create new account with email and password
- **Login**: Access existing account
- **Profile**: View and manage account details

#### 2. Address Management
- **Add Address**: Set delivery location with detailed address
- **Multiple Addresses**: Save work, home, and other locations
- **Default Selection**: Choose primary delivery address

#### 3. AI-Powered Food Discovery
- **Natural Conversation**: Chat with Jarvis using natural language
  - "I'm feeling like Italian food tonight"
  - "Show me healthy options under $15"
  - "What's good for a family dinner?"
- **Contextual Recommendations**: AI considers preferences, budget, and mood
- **Interactive Suggestions**: Browse recommended items with descriptions

#### 4. Shopping Experience
- **Add to Cart**: One-click addition with visual feedback
- **Cart Management**: View, modify quantities, and remove items
- **Persistent Cart**: Items saved across sessions
- **Real-time Updates**: Live cart totals and item counts

#### 5. Checkout Process
- **Review Order**: Confirm items, quantities, and prices
- **Address Selection**: Choose delivery location
- **Order Placement**: Complete purchase flow
- **Confirmation**: Receive order details and tracking

### Chat Interface Features

#### Conversation Types
- **Food Discovery**: "What should I eat today?"
- **Cuisine Preferences**: "I want something spicy"
- **Budget Constraints**: "Show me options under $20"
- **Dietary Restrictions**: "I need vegetarian options"
- **Mood-based**: "I'm feeling comfort food"

#### AI Capabilities
- **Understanding Context**: Maintains conversation history
- **Personalized Suggestions**: Learns from user interactions
- **Fallback Responses**: Handles API limitations gracefully
- **Structured Responses**: Formats recommendations consistently

## 🤖 AI Agents

### CrewAI Agent Architecture

The application uses a sophisticated multi-agent system built with CrewAI:

#### 1. Intent Agent
**Role**: Natural Language Understanding
- **Purpose**: Analyzes user messages to understand intent and extract preferences
- **Capabilities**:
  - Cuisine type detection
  - Budget extraction
  - Dietary restriction identification
  - Mood and occasion understanding
- **Output**: Structured intent data for other agents

#### 2. Discovery Agent
**Role**: Food and Restaurant Search
- **Purpose**: Finds relevant restaurants and food items based on user criteria
- **Capabilities**:
  - Database querying with complex filters
  - Location-based restaurant discovery
  - Menu item search and categorization
  - Price range filtering
- **Output**: Curated list of potential matches

#### 3. Evaluator Agent
**Role**: Quality Assessment and Ranking
- **Purpose**: Analyzes and scores food options based on multiple criteria
- **Capabilities**:
  - Rating analysis and scoring
  - Price-value assessment
  - Dietary compatibility checking
  - Popularity and trending analysis
- **Output**: Ranked and scored recommendations

#### 4. Advisor Agent
**Role**: Personalized Recommendation
- **Purpose**: Provides final recommendations with explanations
- **Capabilities**:
  - Preference matching
  - Contextual suggestions
  - Explanation generation
  - Alternative option suggestions
- **Output**: Final recommendations with reasoning

### Agent Collaboration Flow
```
User Query → Intent Agent → Discovery Agent → Evaluator Agent → Advisor Agent → Response
```

### AI Features
- **Context Awareness**: Maintains conversation history and user preferences
- **Learning Capability**: Improves recommendations based on user interactions
- **Fallback Mechanisms**: Handles API rate limits and errors gracefully
- **Structured Output**: Consistent response format for frontend integration

## 📱 API Endpoints

### Backend API (Port 5002)

#### Authentication Endpoints
```
POST /api/auth/register
Body: { name, email, password }
Response: { user, token }

POST /api/auth/login
Body: { email, password }
Response: { user, token }

GET /api/auth/profile
Headers: { Authorization: Bearer <token> }
Response: { user }
```

#### Restaurant Endpoints
```
GET /api/restaurants
Query: { cuisine?, priceRange?, rating? }
Response: [{ _id, name, cuisine, rating, address, image }]

GET /api/restaurants/:id
Response: { _id, name, cuisine, rating, address, image, menu }

GET /api/restaurants/:id/menu
Response: [{ _id, name, price, description, category }]
```

#### Food Item Endpoints
```
GET /api/food-items
Query: { restaurant?, category?, priceMin?, priceMax?, search? }
Response: [{ _id, name, price, description, restaurant, image }]

GET /api/food-items/:id
Response: { _id, name, price, description, restaurant, category, image }

POST /api/food-items/search
Body: { query, filters }
Response: [{ _id, name, price, description, restaurant }]
```

#### Order Endpoints
```
POST /api/orders
Headers: { Authorization: Bearer <token> }
Body: { items, address, totalAmount }
Response: { _id, orderNumber, status, items, totalAmount }

GET /api/orders
Headers: { Authorization: Bearer <token> }
Response: [{ _id, orderNumber, status, items, createdAt }]

GET /api/orders/:id
Headers: { Authorization: Bearer <token> }
Response: { _id, orderNumber, status, items, address, totalAmount }
```

#### Address Endpoints
```
POST /api/addresses
Headers: { Authorization: Bearer <token> }
Body: { street, city, state, zipCode, type }
Response: { _id, street, city, state, zipCode, type }

GET /api/addresses
Headers: { Authorization: Bearer <token> }
Response: [{ _id, street, city, state, zipCode, type }]

DELETE /api/addresses/:id
Headers: { Authorization: Bearer <token> }
Response: { message }
```

#### Chat Integration
```
POST /api/chat
Body: { message, userAddress, userId, conversationHistory }
Response: { message, recommendations, actionRequired }
```

### AI Service API (Port 8000)

#### Chat Endpoints
```
POST /chat
Body: {
  message: string,
  user_address: object,
  user_id: string,
  conversation_history: array
}
Response: {
  message: string,
  recommendations: array,
  action_required: object
}
```

#### Health Check
```
GET /health
Response: { status: "healthy", timestamp: "..." }
```

#### Agent Status
```
GET /agents/status
Response: {
  intent_agent: "active",
  discovery_agent: "active",
  evaluator_agent: "active",
  advisor_agent: "active"
}
```

### Response Formats

#### Recommendation Object
```json
{
  "id": "string",
  "name": "string",
  "price": number,
  "description": "string",
  "restaurant": {
    "id": "string",
    "name": "string",
    "cuisine": "string"
  },
  "category": "string",
  "image": "string",
  "rating": number,
  "dietary_info": ["vegetarian", "gluten-free"]
}
```

#### Error Response
```json
{
  "error": "string",
  "message": "string",
  "code": "string",
  "timestamp": "ISO-8601"
}
```

## 🛠️ Tech Stack

### Frontend Technologies
- **React 18.2.0**: Modern React with hooks and concurrent features
- **Vite 4.4.5**: Fast build tool and development server
- **React Router 6.15.0**: Declarative routing for React
- **Tailwind CSS 3.3.0**: Utility-first CSS framework
- **Axios 1.5.0**: Promise-based HTTP client
- **Context API**: Built-in React state management

### Backend Technologies
- **Node.js 18+**: JavaScript runtime environment
- **Express.js 4.18.2**: Fast, unopinionated web framework
- **MongoDB 7.0**: NoSQL document database
- **Mongoose 8.16.0**: MongoDB object modeling for Node.js
- **JWT (jsonwebtoken 9.0.2)**: JSON Web Token implementation
- **bcryptjs 3.0.2**: Password hashing library
- **CORS 2.8.5**: Cross-Origin Resource Sharing middleware
- **dotenv 16.5.0**: Environment variable loader

### AI Service Technologies
- **Python 3.8+**: Programming language for AI service
- **FastAPI 0.104.1**: Modern, fast web framework for building APIs
- **CrewAI 0.36.0**: Multi-agent framework for AI applications
- **OpenAI 1.3.0**: OpenAI API client for GPT models
- **Pydantic 2.4.0**: Data validation using Python type annotations
- **Uvicorn 0.24.0**: ASGI server for FastAPI

### Database and Storage
- **MongoDB**: Primary database for structured data
- **localStorage**: Browser storage for cart and chat persistence
- **File System**: Static asset storage for images

### Development Tools
- **ESLint**: JavaScript/React linting
- **Prettier**: Code formatting
- **Nodemon**: Development server auto-restart
- **Git**: Version control
- **npm**: Package management

### Deployment Technologies
- **Docker**: Containerization (optional)
- **Vercel/Netlify**: Frontend deployment options
- **Heroku/Railway**: Backend deployment options
- **MongoDB Atlas**: Cloud database hosting
- **Environment Variables**: Configuration management

## 🔧 Development

### Project Structure
```
jarvis-delivers/
├── README.md                    # Project documentation
├── package.json                 # Root package configuration
├── .gitignore                   # Git ignore rules
├── .env.example                 # Environment template
│
├── frontend/                    # React frontend application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── ChatBot.jsx      # AI chat interface
│   │   │   ├── Checkout.jsx     # Order checkout
│   │   │   ├── Login.jsx        # User authentication
│   │   │   └── ...
│   │   ├── context/             # React context providers
│   │   │   └── AppContext.jsx   # Global state management
│   │   ├── utils/               # Utility functions
│   │   │   └── api.js           # API client configuration
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # App entry point
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite configuration
│   └── tailwind.config.js       # Tailwind CSS configuration
│
├── backend/                     # Node.js backend API
│   ├── controllers/             # Request handlers
│   │   ├── authController.js    # Authentication logic
│   │   ├── chatController.js    # AI integration
│   │   ├── orderController.js   # Order management
│   │   └── ...
│   ├── models/                  # Database schemas
│   │   ├── User.js              # User model
│   │   ├── Restaurant.js        # Restaurant model
│   │   ├── FoodItem.js          # Food item model
│   │   └── Order.js             # Order model
│   ├── routes/                  # API route definitions
│   ├── middleware/              # Custom middleware
│   ├── app.js                   # Express app configuration
│   ├── seedDatabase.js          # Database seeding script
│   └── package.json             # Backend dependencies
│
└── ai-service/                  # Python AI service
    ├── src/
    │   ├── agents/              # CrewAI agent definitions
    │   │   ├── intent_agent.py  # Intent recognition
    │   │   ├── discovery_agent.py # Food discovery
    │   │   ├── evaluator_agent.py # Recommendation scoring
    │   │   └── advisor_agent.py # Final recommendations
    │   ├── crews/               # Agent crew orchestration
    │   │   └── food_crew.py     # Food recommendation crew
    │   ├── tasks/               # Agent task definitions
    │   │   └── food_tasks.py    # Food-related tasks
    │   ├── tools/               # Custom tools for agents
    │   └── config/              # Configuration management
    ├── main.py                  # FastAPI application
    ├── requirements.txt         # Python dependencies
    └── .env                     # Environment variables
```

### Key Features Implemented
- ✅ AI-powered food recommendations with CrewAI multi-agent system
- ✅ Real-time chat interface with typing indicators and history
- ✅ Shopping cart functionality with persistent localStorage
- ✅ User authentication with JWT and secure password hashing
- ✅ Order management system with complete checkout flow
- ✅ Address management for delivery locations
- ✅ Responsive design with mobile-first approach
- ✅ Comprehensive error handling and user feedback
- ✅ Data persistence across sessions
- ✅ Modern UI with gradients and smooth animations

### Database Schema

#### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  addresses: [AddressSchema],
  orders: [ObjectId],
  preferences: {
    cuisines: [String],
    dietary: [String],
    budget: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Restaurant Schema
```javascript
{
  _id: ObjectId,
  name: String,
  cuisine: String,
  rating: Number,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  image: String,
  priceRange: String,
  isActive: Boolean,
  createdAt: Date
}
```

#### Food Item Schema
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  restaurant: ObjectId (ref: Restaurant),
  image: String,
  dietary: [String],
  isAvailable: Boolean,
  rating: Number,
  createdAt: Date
}
```

#### Order Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [{
    foodItem: ObjectId (ref: FoodItem),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String (enum),
  deliveryAddress: AddressSchema,
  orderNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Modern gradients with purple, blue, and green accents
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent padding and margins using Tailwind's spacing scale
- **Shadows**: Layered shadows for depth and modern feel

### Interactive Elements
- **Gradient Buttons**: Beautiful gradient backgrounds with hover effects
- **Smooth Animations**: CSS transitions for state changes
- **Loading States**: Skeleton loaders and spinning indicators
- **Micro-interactions**: Hover effects, button presses, and form feedback

### Responsive Design
- **Mobile-First**: Designed for mobile and scaled up
- **Breakpoint System**: Tailwind's responsive breakpoints
- **Touch-Friendly**: Large tap targets and gesture support
- **Cross-Browser**: Compatible with modern browsers

### Chat Interface
- **Real-time Messaging**: Instant message delivery with WebSocket-like experience
- **Typing Indicators**: Visual feedback when AI is processing
- **Message History**: Persistent conversation storage in localStorage
- **Rich Responses**: Formatted recommendations with images and actions
- **Smart Cart Integration**: Seamless add-to-cart without leaving chat

### Shopping Experience
- **Visual Cart**: Real-time cart updates with item counts in header
- **Persistent State**: Cart survives page refreshes and browser sessions
- **Quick Actions**: One-click add to cart and checkout navigation
- **Visual Feedback**: Success messages and error handling with animations

## 🚀 Deployment

### Environment Setup

#### Production Environment Variables
```env
# Backend Production
NODE_ENV=production
PORT=5002
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jarvis-delivers
JWT_SECRET=complex-production-secret-key-min-32-characters
AI_SERVICE_URL=https://your-ai-service.railway.app

# AI Service Production
OPENAI_API_KEY=your-production-openai-key
HOST=0.0.0.0
PORT=8000
DEBUG=False
CREW_MODEL=gpt-3.5-turbo
```

### Deployment Options

#### Option 1: Individual Service Deployment

**Frontend (Vercel/Netlify)**
```bash
# Build for production
cd frontend
npm run build

# Deploy to Vercel
npm install -g vercel
vercel --prod

# Or deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Backend (Railway/Heroku)**
```bash
# Deploy to Railway
npm install -g @railway/cli
railway login
railway init
railway up

# Or deploy to Heroku
heroku create jarvis-delivers-backend
git subtree push --prefix backend heroku main
```

**AI Service (Railway/Heroku)**
```bash
# Deploy to Railway
cd ai-service
railway init
railway up

# Or deploy to Heroku with Python buildpack
heroku create jarvis-delivers-ai
heroku buildpacks:set heroku/python
git subtree push --prefix ai-service heroku main
```

### Performance Optimization

#### Frontend Optimizations
- **Code Splitting**: Lazy loading of components with React.lazy()
- **Image Optimization**: WebP format and responsive images
- **Bundle Analysis**: Regular bundle size monitoring with Vite
- **Caching**: Browser caching strategies for static assets

#### Backend Optimizations
- **Database Indexing**: Optimized queries with proper MongoDB indexes
- **Response Compression**: Gzip compression for API responses
- **Rate Limiting**: Prevent API abuse with express-rate-limit
- **Connection Pooling**: Efficient MongoDB connection management

#### AI Service Optimizations
- **Response Caching**: Cache common queries to reduce OpenAI API calls
- **Model Optimization**: Use gpt-3.5-turbo for cost-effective performance
- **Async Processing**: Non-blocking request handling with FastAPI
- **Graceful Fallbacks**: Handle OpenAI rate limits with mock responses

## 🧪 Testing

### Testing Strategy

#### Frontend Testing
```bash
# Unit tests with Jest and React Testing Library
npm run test

# Component tests
npm run test:components

# E2E tests with Playwright
npm run test:e2e
```

#### Backend Testing
```bash
# API tests with Jest and Supertest
npm run test

# Integration tests
npm run test:integration

# Database tests
npm run test:db
```

#### AI Service Testing
```bash
# Unit tests with pytest
pytest

# Agent behavior tests
pytest tests/agents/

# API endpoint tests
pytest tests/api/
```

### Test Coverage
- **Frontend**: Component rendering, user interactions, API integration, cart functionality
- **Backend**: API endpoints, authentication middleware, database operations, error handling
- **AI Service**: Agent responses, error handling, API integration, fallback mechanisms

## 🤝 Contributing

### Contribution Guidelines

1. **Fork the Repository**
   ```bash
   git fork https://github.com/vighnesh-18/jarvis-delivers
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Follow Code Standards**
   - Use ESLint and Prettier for JavaScript/React
   - Follow PEP 8 for Python code
   - Write meaningful commit messages
   - Add tests for new features

4. **Commit Changes**
   ```bash
   git commit -m 'feat: add amazing feature with detailed description'
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/amazing-feature
   # Create Pull Request on GitHub
   ```

### Development Guidelines
- **Code Quality**: Maintain high code quality with linting and testing
- **Documentation**: Update README and code comments for new features
- **Testing**: Add comprehensive tests for new features and bug fixes
- **Performance**: Consider performance implications of changes
- **Security**: Follow security best practices for authentication and data handling

### Issue Reporting
- Use the GitHub issue template
- Provide detailed reproduction steps
- Include relevant logs and screenshots
- Tag issues appropriately (bug, enhancement, documentation)

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CrewAI Team** for the incredible multi-agent framework that powers our AI recommendations
- **OpenAI** for providing powerful language models that understand natural language queries
- **MongoDB** for the flexible NoSQL database that handles our complex data relationships
- **React Team** for the amazing frontend framework that enables rich user experiences
- **FastAPI** for the high-performance Python web framework that powers our AI service
- **Tailwind CSS** for the utility-first CSS framework that makes beautiful UIs easy
- **Vite** for the blazing fast build tool that improves developer experience
- **Open Source Community** for the countless libraries, tools, and inspiration

### Special Thanks
- **Food delivery platforms** for inspiration on user experience patterns
- **AI/ML community** for sharing knowledge about practical AI applications
- **Web development community** for best practices and modern development patterns

---

**Built with ❤️ and AI by @vighnesh-18**

*Jarvis Delivers - Where artificial intelligence meets appetite!* 🤖🍕✨

**🔗 Links**
- **Repository**: [GitHub](https://github.com/vighnesh-18/jarvis-delivers)
- **Live Demo**: [Coming Soon]
- **API Documentation**: [Coming Soon]
- **Contributing Guide**: [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Issue Tracker**: [GitHub Issues](https://github.com/vighnesh-18/jarvis-delivers/issues)

**📊 Project Stats**
- **Languages**: JavaScript, Python, HTML, CSS
- **Frameworks**: React, Node.js, FastAPI, Express
- **Database**: MongoDB
- **AI**: CrewAI, OpenAI GPT
- **Deployment**: Railway, Vercel, Netlify compatible
