import app from './src/app.js' // after build, Vercel uses compiled JS

export default function handler(req:any, res:any) {
  return app(req, res);
}