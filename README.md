# MicroHabit

A minimalist habit tracking app focused on building just 3 daily habits. Built with React and TypeScript.

## Features

- **Simple & Focused**: Track only 3 habits to avoid overwhelm
- **Visual Growth**: Watch your habits grow from seeds to trees
- **Streak Tracking**: Monitor consecutive days of habit completion
- **AI-Powered Insights** (Premium): Get personalized motivation and habit suggestions
- **Data Export** (Premium): Export your progress data
- **Custom Themes** (Premium): Personalize your experience

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthScreen.tsx
│   ├── Dashboard.tsx
│   ├── DashboardHeader.tsx
│   ├── HabitCard.tsx
│   ├── OnboardingScreen.tsx
│   ├── PremiumCTA.tsx
│   ├── SettingsScreen.tsx
│   ├── SplashScreen.tsx
│   └── index.ts
├── config/              # Configuration and constants
│   └── constants.ts
├── hooks/               # Custom React hooks
│   ├── useAI.ts
│   ├── useLocalStorage.ts
│   └── index.ts
├── services/            # External services
│   ├── aiService.ts
│   ├── authService.ts
│   └── index.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── helpers.ts
└── App.tsx              # Main application component
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure AI service (optional):
   - Open `src/config/constants.ts`
   - Replace `YOUR_OPENROUTER_API_KEY` with your actual OpenRouter API key

3. Start the development server:
   ```bash
   npm start
   ```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Local Storage** - Data persistence
- **OpenRouter AI** - AI-powered features (Premium)

## Key Concepts

### Plant Growth System
Habits are visualized as growing plants:
- 🌱 (0-3 days): Seedling
- 🌿 (4-7 days): Sprout
- 🍀 (8-14 days): Young plant
- 🌳 (15-30 days): Tree
- 🌲 (30+ days): Mature tree

### Premium Features
- AI motivational messages
- Smart habit suggestions
- Weekly insights
- Custom themes
- Data export functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
