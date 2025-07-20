# Tiny D6 RPG Content Manager

A simple Next.js application for managing and sharing Tiny D6 RPG content (traits, objects, classes, and ancestries) with your players.

## Features

- **Content Management**: Add, view, and delete traits, objects, classes, and ancestries
- **Search & Filter**: Find content by name, description, tags, or type
- **Admin System**: Simple local authentication to manage hidden content
- **Markdown Support**: Rich text formatting and export to markdown files
- **Real-time Updates**: Changes are saved to Supabase database
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Next.js 15** with TypeScript
- **Supabase** for database and authentication
- **Tailwind CSS** for styling
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (optional for demo mode)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd tiny-d6-rpg-site
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Supabase Setup (Optional)

To use real data storage instead of demo data:

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Create the `d6_content` table with this SQL:

```sql
CREATE TABLE d6_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('trait', 'object', 'class', 'ancestry')),
  description TEXT,
  rules TEXT,
  tags TEXT[],
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional)
ALTER TABLE d6_content ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for demo purposes)
CREATE POLICY "Allow all operations" ON d6_content FOR ALL USING (true);
```

3. Get your Supabase URL and anon key from your project settings

4. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Restart the development server

## Usage

### Player View (Default)

- Players can view all non-hidden content
- Search and filter functionality available
- No admin controls visible

### Admin Features

- **Login**: Click "Admin Login" and enter password (default: `admin123`)
- **Delete Content**: Remove content (only available when logged in)
- **Export to Markdown**: Download all content as a markdown file
- **Hide Content**: Mark content as hidden from players

### Adding Content

1. Click the "Add Content" button
2. Fill in the form:
   - **Name**: The name of the trait/object/class/ancestry
   - **Type**: Select the content type
   - **Description**: Brief description of the content
   - **Rules**: Game mechanics and rules
   - **Tags**: Comma-separated tags for easy searching
   - **Hide from players**: Checkbox to hide content (admin only)
   - **Markdown Content**: Rich text formatting (optional)

### Markdown Support

The app supports basic markdown formatting:

- **Headers**: `# H1`, `## H2`, `### H3`
- **Bold**: `**text**`
- **Italic**: `*text*`
- **Lists**: `* item`
- **Code**: `` `code` `` or ` `code block` `
- **Line breaks**: Automatic

### Searching and Filtering

- Use the search bar to find content by name, description, or tags
- Use the filter buttons to show only specific content types
- The stats cards show the count of each content type

### Sharing with Players

Simply share the URL with your players. They can view all non-hidden content and search/filter to find what they need during sessions.

## Admin Configuration

### Changing the Admin Password

Edit the `ADMIN_PASSWORD` constant in `src/app/page.tsx`:

```typescript
const ADMIN_PASSWORD = "your-new-password";
```

### Content Visibility

- **Public Content**: Visible to all players
- **Hidden Content**: Only visible to admins (marked with an eye-off icon)
- **Admin Controls**: Toggle hidden content visibility, export to markdown, delete content

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page component
│   └── globals.css     # Global styles
├── components/          # Reusable components
│   └── AdminLogin.tsx  # Admin login modal
├── lib/                # Library configurations
│   └── supabase.ts     # Supabase client
├── types/              # TypeScript type definitions
│   ├── content.ts      # Content-related types
│   └── supabase.ts     # Database types
└── utils/              # Utility functions
    ├── supabase.ts     # Supabase operations
    └── markdown.ts     # Markdown parsing utilities
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. The app uses a modular structure - add new components in `src/components/`
2. Database operations are centralized in `src/utils/supabase.ts`
3. Types are defined in `src/types/` directory
4. Markdown utilities are in `src/utils/markdown.ts`

## License

MIT License - feel free to use this project for your own RPG campaigns!
