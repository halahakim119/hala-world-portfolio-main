import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('./dist/client/',import.meta.url);
const hashes=new Set();
for(const file of await readdir(root)){
 if(!file.endsWith('.html'))continue;
 const html=await readFile(new URL(file,root),'utf8');
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
  if(!/\bsrc\s*=/.test(m[1])&&m[2])hashes.add(`'sha256-${createHash('sha256').update(m[2]).digest('base64')}'`);
 }
}
const csp=`default-src 'self'; script-src 'self' ${[...hashes].join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests`;
await writeFile(new URL('_headers',root),`/*\n  Content-Security-Policy: ${csp}\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()\n  Strict-Transport-Security: max-age=31536000\n`);
console.log('Static response security headers generated.');
