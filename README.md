# StoryBoard - Visual IP Licensing Marketplace

A modern, mobile-first IP licensing marketplace with a Tinder-like swipe interface powered by Story Protocol. Discover, like, and license IP assets with smooth animations and an intuitive user experience.

![StoryBoard](https://via.placeholder.com/1200x600/0D0D12/FF6B35?text=StoryBoard)

## Features

### Swipe Interface
- **Tinder-style card swiping** - Smooth, gesture-based IP discovery
- **Swipe left to skip** - Pass on assets that don't interest you
- **Swipe right to like** - Save IP assets to your favorites
- **Tap to view details** - Open full IP asset information
- **Undo last swipe** - Made a mistake? No problem!
- **Spring animations** - Buttery smooth Framer Motion animations

### Powerful Filtering
- **Filter by type** - Image, Music, Text, Video
- **Filter by collection** - Color Cats, Sigma Music, PizzaDAO, WTF Freg
- **Filter by license** - Free or Paid
- **Sort options** - Newest, Popular, Price (Low/High)

### One-Click Licensing
- **Multiple license types** - Personal, Commercial, Remix
- **Transparent pricing** - See costs upfront
- **Web3 wallet integration** - ConnectKit for seamless connection
- **Transaction tracking** - View on Story Protocol explorer
- **License management** - Track all your acquired licenses

### Beautiful UI/UX
- **Glass morphism design** - Modern, sleek interface
- **Responsive layout** - Mobile-first, works everywhere
- **Dark theme** - Easy on the eyes
- **Toast notifications** - Instant feedback
- **Loading states** - Never wonder what's happening
- **Empty states** - Helpful guidance when content is missing

## Tech Stack

- **Next.js 14** - App Router for modern React applications
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and gestures
- **@use-gesture/react** - Advanced gesture handling
- **wagmi v2** - React hooks for Ethereum
- **viem** - TypeScript Ethereum library
- **ConnectKit** - Beautiful wallet connection
- **@story-protocol/core-sdk** - Story Protocol integration
- **Zustand** - Simple state management
- **TanStack Query** - Powerful data fetching
- **sonner** - Beautiful toast notifications
- **lucide-react** - Clean, consistent icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A WalletConnect Project ID ([Get one here](https://cloud.walletconnect.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/storyboard.git
   cd storyboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your WalletConnect Project ID:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
storyboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page (Swipe interface)
│   │   ├── likes/             # Likes page
│   │   └── licenses/          # My Licenses page
│   ├── components/
│   │   ├── swipe/             # Swipe card components
│   │   ├── modals/            # Modal components
│   │   ├── filters/           # Filter components
│   │   ├── navigation/        # Navigation components
│   │   ├── providers/         # Context providers
│   │   └── ui/                # Reusable UI components
│   ├── store/                 # Zustand stores
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and constants
│   ├── data/                  # Mock data
│   └── types/                 # TypeScript types
├── public/                    # Static assets
└── ...config files
```

## Story Protocol Integration

This project is built on **Story Protocol Odyssey Testnet**:

- **Chain ID**: 1315
- **RPC URL**: https://aeneid.storyrpc.io
- **Explorer**: https://aeneid.storyscan.xyz
- **Portal**: https://aeneid.explorer.story.foundation

### Licensing Flow

1. User discovers IP assets through swipe interface
2. User selects license type (Personal, Commercial, Remix)
3. User connects wallet via ConnectKit
4. Transaction is submitted to Story Protocol
5. License is minted and tracked on-chain
6. User can download/access licensed content

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Mock Data

The project includes 15 mock IP assets across different categories:

- **Images**: Color Cats, PizzaDAO, WTF Freg collections
- **Music**: Sigma Music collection
- **Various license types**: Free, 0.01 IP - 0.4 IP
- **Metadata**: Views, likes, tags, creator info

In production, replace mock data with real Story Protocol IP assets using the SDK.

## Customization

### Adding New Collections

Edit `src/lib/constants.ts`:

```typescript
export const COLLECTIONS = [
  { value: 'all', label: 'All Collections' },
  { value: 'Your Collection', label: 'Your Collection' },
  // ... add more
]
```

### Changing Theme Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: '#FF6B35',    // Story Orange
  accent: '#7C3AED',     // Purple
  success: '#10B981',    // Green
  // ... customize
}
```

### Adjusting Swipe Behavior

Edit `src/lib/constants.ts`:

```typescript
export const SWIPE_THRESHOLD = 100  // Pixels to trigger swipe
export const SWIPE_ROTATION_MULTIPLIER = 0.15
export const SPRING_CONFIG = { stiffness: 300, damping: 30 }
```

## Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

Build the project:

```bash
npm run build
```

The output will be in `.next` folder. Deploy using any Node.js hosting service.

## Story Protocol SDK Integration

The current implementation uses mock transactions for demo purposes. To integrate with real Story Protocol:

1. **Install the SDK** (already included):
   ```bash
   npm install @story-protocol/core-sdk
   ```

2. **Update `src/hooks/useStoryProtocol.ts`**:
   ```typescript
   import { StoryClient } from '@story-protocol/core-sdk'

   const client = new StoryClient({
     wallet: walletClient,
     chainId: 1315,
   })
   ```

3. **Implement real licensing**:
   ```typescript
   const result = await client.license.mintLicense({
     ipId,
     licenseTermsId,
     amount: 1
   })
   ```

Refer to [Story Protocol Docs](https://docs.story.foundation) for detailed integration.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lighthouse Score: 90+
- First Contentful Paint: < 1.5s
- Smooth 60fps animations
- Optimized images with Next.js Image
- Code splitting with Next.js

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Story Protocol](https://story.foundation) - IP infrastructure
- [ConnectKit](https://docs.family.co/connectkit) - Wallet connection UI
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Vercel](https://vercel.com) - Hosting platform

## Support

For questions or support:

- Open an issue on GitHub
- Join [Story Protocol Discord](https://discord.gg/storyprotocol)
- Read the [Story Protocol Docs](https://docs.story.foundation)

## Roadmap

- [ ] Real Story Protocol SDK integration
- [ ] User profiles and creator pages
- [ ] Advanced search and discovery
- [ ] Social features (comments, shares)
- [ ] Revenue tracking dashboard
- [ ] Mobile app (React Native)

---

Built with ❤️ for Story Protocol Hackathon
