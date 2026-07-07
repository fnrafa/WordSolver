# Word Solver

- Creator: `fnrafa`
- Repository: `https://github.com/fnrafa/WordSolver`
- Version: `1.0.1`

Local word solver built with:

- Vite
- React
- TypeScript
- Tailwind CSS

It uses local dictionary files in `public/` and runs fully on the client.

## Features

- Per-letter input boxes
- English and Indonesian dictionaries
- Finds valid words from the given letters
- Respects letter frequency limits
- Sorts by longest word first, then alphabetically
- Groups results by word length

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run start
```

## Environment

Copy `.env.example` to `.env` if you want to change local settings.

Default values:

```env
APP_PORT=5173
APP_NETWORK_EXPOSE=false
APP_OPEN_BROWSER=false
APP_BASE_PATH=/
APP_ALLOWED_HOSTS=
```

For Vercel deployment, you typically do not need to set any environment variables.

## Deploy to Vercel

This project is a static Vite app. Vercel only needs to run the build and serve `dist/`.

Included config:

- [vercel.json](D:/Project/word-solver/vercel.json:1)

### Option 1: Import the Git repository

1. Push this project to GitHub, GitLab, or Bitbucket.
2. Import the repository in Vercel.
3. Vercel should detect it as a Vite project.
4. Build command: `npm run build`
5. Output directory: `dist`

### Option 2: Deploy with Vercel CLI

```bash
npm i -g vercel
vercel
```

For production deploy:

```bash
vercel --prod
```

## Notes

- Dictionaries are local files in `public/`.
- `public/dictionary-en.txt` is used for English.
- `public/dictionary-id.txt` is used for Indonesian.
