# HearthHub Installation Guide

This guide walks you through setting up HearthHub locally for development.

---

## Software Requirments

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn package manager
- Git

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/CSCI4830-UNO/HearthHub.git
cd HearthHub
```

### 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

Or if you prefer pnpm:

```bash
pnpm install
```

### 3. Configure Environment Variables

Copy the environment template file:

```bash
cp .env.example .env.local
```

Open `.env.local` and add the following environment variables. You'll need values from your Supabase project:


> **Note:** These keys are available in the project documentation or your Supabase dashboard.

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the HearthHub application running.

---

## Verification

After starting the dev server, verify the installation by:

1. Navigating to http://localhost:3000
2. Testing the authentication flow (sign up / login)
3. Checking that the app loads without errors in the browser console

If you encounter any issues, see the [Troubleshooting](#troubleshooting) section below.

---

## Available Scripts

Once the project is set up, you can use these npm scripts:

- `npm run dev` — Start the development server (port 3000)
- `npm run build` — Build the project for production
- `npm run start` — Start the production server (requires `npm run build` first)
- `npm run lint` — Run ESLint to check code quality
- `npm run format` — Format code (if configured)

Run `npm run` to see the full list of available scripts in `package.json`.

---

## Troubleshooting

### Port 3000 Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
npm run dev -- -p 3001
```

### Authentication Errors (401)

If you're seeing authentication errors:
1. Verify your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
2. Ensure the values match your Supabase project settings
3. Restart the development server after updating `.env.local`

### Missing Components

If shadcn/ui components are missing:
1. Check `components.json` exists in the project root
2. Refer to the main README for component setup instructions
3. You may need to regenerate components using the shadcn CLI

### Styling Issues

If Tailwind CSS styles are not applied:
1. Clear your browser cache
2. Restart the development server
3. Check that `tailwind.config.ts` is properly configured

---

## Next Steps

After installation:
1. Read the main [README.md](./README.md) for project overview
2. Explore the [Project Structure](./README.md#project-structure) to understand the codebase
3. Review the [UI and Components](./README.md#ui-and-components) section for styling details
4. Check out the authentication flow in `app/auth/` for how login works
5. Add the local environment variables from the word doc to a .env.local file in the root of the project file structure

---

## Support

For issues or questions:
- Check the main README for additional context
- Open an issue on the [GitHub repository](https://github.com/CSCI4830-UNO/HearthHub/issues)
- Review environment variable configuration if things don't work as expected
