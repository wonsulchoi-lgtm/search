import path from 'path';
import { fileURLToPath } from 'url';
import { app } from './src/server/app.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

// Full-stack Vite handling
if (process.env.NODE_ENV === 'production') {
  app.use(expressStatic(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

function expressStatic(dirPath: string) {
  return (req: any, res: any, next: any) => {
    import('express').then((express) => {
      express.default.static(dirPath)(req, res, next);
    });
  };
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mobility Career AI Agent server listening on port ${PORT}`);
});
