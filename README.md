# Gitmage

GitHub Repository Manager (UI dwibahasa Indonesia/English, bisa diganti dari navbar, halaman login, atau Settings): kelola, buat, dan hapus repository GitHub, lalu deploy ke Vercel. Dibuat dengan React, TypeScript, Vite, Tailwind CSS, Lucide React, dan Vercel Functions.

## Struktur

```
api/                 Backend serverless (Vercel Functions)
  _lib.ts            Session terenkripsi, CSRF guard, helper GitHub
  auth/              login (PKCE), callback, logout
  me.ts repos.ts branches.ts vercel.ts
src/
  components/        UI reusable, dialog, layout
  hooks/             auth, theme, repos
  lib/               api client, utils
  pages/             Login, Overview, Repositories, Deployments, Settings
```

## Environment variables

Salin `.env.example`. Di Vercel isi lewat Project Settings, Environment Variables.

| Variable | Wajib | Keterangan |
|---|---|---|
| GITHUB_CLIENT_ID | ya | Client ID OAuth App |
| GITHUB_CLIENT_SECRET | ya | Client secret (hanya di server) |
| SESSION_SECRET | ya | Minimal 32 karakter. `openssl rand -base64 48` |
| APP_URL | tidak | Contoh `https://gitmage.vercel.app` |
| VERCEL_TOKEN | untuk Deployments | Token dari vercel.com/account/tokens |
| VERCEL_TEAM_ID | tidak | Jika project ada di team |

## Setup GitHub OAuth

1. GitHub, Settings, Developer settings, OAuth Apps, New OAuth App.
2. Homepage URL: `https://DOMAIN-KAMU`.
3. Authorization callback URL: `https://DOMAIN-KAMU/api/auth/callback`.
4. Salin Client ID, buat Client secret, masukkan ke env Vercel.
5. Scope yang diminta: `repo` dan `delete_repo`.

## Deploy ke Vercel

1. Push project ini ke repository GitHub.
2. Vercel, Add New Project, pilih repository. Framework terdeteksi Vite.
3. Isi environment variables di atas, lalu Deploy.
4. Update callback URL OAuth App sesuai domain Vercel.

## Setup integrasi Vercel (Deployments)

1. Buat token di vercel.com/account/tokens, simpan sebagai `VERCEL_TOKEN`.
2. Di Vercel, buat project yang terhubung ke repository GitHub yang ingin dideploy.
3. Redeploy Gitmage. Halaman Deployments akan menampilkan form deploy.

## Pengembangan di Android (Termux)

```
pkg install nodejs git
npm install
npm run dev:web        # hanya UI, API tidak aktif
```

Fungsi login dan GitHub butuh serverless API, jadi cara paling praktis: edit kode di Termux atau editor, `git push`, lalu buka hasil deploy Vercel di browser Android. `npm run dev` (vercel dev) membutuhkan Vercel CLI dan bisa tidak stabil di Termux. Untuk testing OAuth lokal, buat OAuth App terpisah dengan callback `http://localhost:3000/api/auth/callback`.

## Keamanan

- Token GitHub tidak pernah ke browser: disimpan di cookie sesi terenkripsi (AES-256-GCM), HttpOnly, SameSite=Lax, Secure di production.
- OAuth Authorization Code Flow dengan PKCE dan parameter state.
- CSRF: request mutasi wajib header `X-Gitmage` dan Origin yang sama.
- Hapus repository divalidasi di server: session, nama, konfirmasi, dan izin admin dari GitHub.
- Client secret dan token Vercel hanya ada di environment server.
- Gitmage tidak membuat OTP sendiri. Jika GitHub meminta verifikasi tambahan, lakukan di github.com.
