# tradingPlatform
.
├── dist/                     # Compiled JavaScript output
├── node_modules/             # Project dependencies
├── src/                      # Source code
│   ├── api/                  # Backend/API layer
│   │   ├── controllers/      # Request handlers
│   │   ├── middlewares/      # Express middlewares
│   │   ├── routes/           # API routes
│   │   └── services/         # Business logic for API
│   ├── core/                 # Core business logic and engine
│   │   ├── engine/           # Trading engine logic
│   │   └── services/         # Core services (e.g., risk management)
│   ├── clients/              # Frontend client applications
│   │   ├── web/              # Web client (e.g., React, Angular, Vue)
│   │   └── mobile/           # Mobile client (e.g., React Native)
│   ├── config/               # Application configuration
│   ├── data/                 # Database and data-related logic
│   │   ├── models/           # Data models/schemas
│   │   ├── repositories/     # Data access layer
│   │   └── migrations/       # Database migrations
│   ├── infrastructure/       # External service integrations
│   │   ├── price-poller/     # Price polling service
│   │   └── websocket/        # WebSocket server logic
│   ├── shared/               # Shared utilities, types, and interfaces
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Utility functions
│   └── tests/                # Automated tests
├── .env                      # Environment variables
├── .eslintrc.json            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── package.json              # Project metadata and dependencies
└── tsconfig.json             # TypeScript compiler optionsa
 
# tradi
