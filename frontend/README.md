# Mental Math Trainer - Frontend

Next.js frontend for the Mental Math Trainer application.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── GameSession.tsx    # Main game component
│   ├── SettingsForm.tsx   # Settings configuration
│   └── SessionHistory.tsx # Session history viewer
├── lib/
│   ├── api.ts            # API client for backend
│   ├── types.ts          # TypeScript interfaces
│   └── problemGenerator.ts # Math problem generation
└── public/               # Static assets
```

## Features

### GameSession Component
- Displays random math problems based on settings
- Tracks time spent per problem
- Counts typos/backspaces
- Auto-advances on correct answer
- 120-second countdown timer
- Real-time score tracking

### SettingsForm Component
- Configure operation types (add, subtract, multiply, divide)
- Set min/max ranges for each operation
- Persists settings to backend

### SessionHistory Component
- View all past sessions
- Click to see detailed problem breakdown
- Shows time spent and typos per problem
- Displays correct/incorrect answers

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Key Components

### Problem Generation

Problems are generated client-side using the `ProblemGenerator` class:

```typescript
import { ProblemGenerator } from '@/lib/problemGenerator';

const generator = new ProblemGenerator(settings);
const problem = generator.generateProblem();
// Returns: { question: "5 × 7", answer: 35, operation: "multiplication" }
```

### API Integration

The API client handles all backend communication:

```typescript
import { api } from '@/lib/api';

// Create a session
const session = await api.createSession();

// Submit a problem
await api.submitProblem(sessionId, {
  question: "5 × 7",
  answer: 35,
  user_answer: 35,
  time_spent_ms: 2500,
  typo_count: 1
});

// Complete session
await api.completeSession(sessionId, score);
```

## Customization

### Changing Session Duration

Edit `GameSession.tsx`:

```typescript
const [timeRemaining, setTimeRemaining] = useState(120); // Change from 120
```

### Styling

The app uses TailwindCSS. Customize colors in `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Change primary color
      }
    }
  }
}
```

### Adding New Operations

1. Update `Settings` interface in `lib/types.ts`
2. Add generation logic in `lib/problemGenerator.ts`
3. Update `SettingsForm.tsx` UI

## Performance Optimization

- All API calls include error handling
- Settings are cached in state to avoid refetching
- Components use React hooks for efficient re-renders
- TailwindCSS provides optimized CSS bundle

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set environment variable in Vercel dashboard:
- `NEXT_PUBLIC_API_URL`: Your production API URL

### Other Platforms

Build the static export:

```bash
npm run build
```

Deploy the `.next` folder to any static hosting service.

## Troubleshooting

### "Failed to fetch" errors
- Ensure backend is running
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify CORS is configured on backend

### TypeScript errors
```bash
npm run build
```

### Styling issues
Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

## Future Enhancements

- [ ] Add user authentication
- [ ] Implement charts for progress tracking
- [ ] Add keyboard shortcuts
- [ ] Mobile-optimized interface
- [ ] PWA support for offline play
- [ ] Sound effects and animations
- [ ] Multiplayer mode
- [ ] Customizable themes
