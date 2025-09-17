import app from './src/app.js'; // after build, Vercel uses compiled JS
export default function handler(req, res) {
    return app(req, res);
}
