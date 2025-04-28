# Financial Insight Game

A gamified financial insights application that turns your banking data into an interactive Mario-style game experience.

## Overview

This application connects to your banking data through AdaTree's API and transforms your financial transactions into:

1. Interactive visualizations
2. Engaging game elements
3. Meaningful financial insights

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- AdaTree API credentials:
  - CDR Arrangement ID
  - Consent ID
  - Consumer ID

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd financial-insight-game
```

2. Install dependencies:

```bash
npm install
```

3. Create environment variables:
   - Copy `.env.template` to `.env`
   - Fill in your AdaTree API credentials:

```env
REACT_APP_CDR_ARRANGEMENT_ID=your_cdr_arrangement_id
REACT_APP_CONSENT_ID=your_consent_id
REACT_APP_CONSUMER_ID=your_consumer_id
```

4. Start the development server:

```bash
npm start
```

## Features

### Phase 1 (Current)

- AdaTree API integration
- Transaction data retrieval
- In-memory data storage
- Basic error handling

### Upcoming Features

- Financial visualizations
- Transaction categorization
- Mario-style game mechanics
- Financial insights dashboard

## Technology Stack

- Frontend: React with TypeScript
- State Management: Zustand
- Styling: Tailwind CSS
- Visualization: Recharts
- Game Engine: Phaser.js

## Project Structure

```
src/
├── components/     # React components
├── services/      # API and data services
│   ├── adatree.ts    # AdaTree API integration
│   └── storage.ts    # Data storage service
├── utils/         # Utility functions
└── types/         # TypeScript type definitions
```

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting

## Security

- Environment variables for sensitive data
- No storage of sensitive financial data
- Secure API communication

## License

[Your License Here]

## Contributing

[Contribution Guidelines]
