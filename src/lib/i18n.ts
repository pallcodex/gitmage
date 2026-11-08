export type Lang = 'en' | 'id'
const KEY = 'gitmage-lang'

let lang: Lang = (() => {
  try { const s = localStorage.getItem(KEY); if (s === 'en' || s === 'id') return s } catch { /* abaikan */ }
  return navigator.language?.toLowerCase().startsWith('id') ? 'id' : 'en'
})()
if (typeof document !== 'undefined') document.documentElement.lang = lang

export const getLang = () => lang
export function setLang(l: Lang) {
  lang = l
  try { localStorage.setItem(KEY, l) } catch { /* abaikan */ }
  document.documentElement.lang = l
}

const en = {
  'nav.overview': 'Overview', 'nav.repositories': 'Repositories', 'nav.deployments': 'Deployments', 'nav.settings': 'Settings',
  search: 'Search repositories', searchShort: 'Search', theme: 'Theme', 'theme.light': 'Light', 'theme.dark': 'Dark', 'theme.system': 'System',
  lang: 'Language', profileMenu: 'Profile menu', githubProfile: 'GitHub profile', logout: 'Log out',
  cancel: 'Cancel', close: 'Close', retry: 'Try again', open: 'Open', public: 'Public', private: 'Private', refresh: 'Refresh',
  'login.desc': 'Manage your GitHub repositories and deploy them to Vercel from one place.',
  'login.cta': 'Continue with GitHub',
  'login.p1': 'Read and manage your repositories (repo scope).',
  'login.p2': 'Delete repositories only after you confirm by typing the name (delete_repo scope).',
  'login.p3': 'Your GitHub password is never shared with Gitmage.',
  'login.errState': 'The sign-in request could not be verified. Please try again.',
  'login.errFail': 'GitHub sign-in failed. Please try again.',
  'login.expired': 'Your session expired. Please sign in again.',
  'ov.create': 'Create Repository', 'ov.import': 'Import Repository', 'ov.total': 'Repositories', 'ov.last': 'Last updated:',
  'ov.recent': 'Recent repositories', 'ov.viewAll': 'View all', 'ov.emptyTitle': 'No repositories yet',
  'ov.emptyText': 'Create your first repository or import an existing one.', 'ov.manage': 'Manage',
  'ov.vncTitle': 'Vercel is not connected', 'ov.vncText': 'Add a Vercel token on the server to deploy from Gitmage.',
  'ov.seeSetup': 'See setup', 'ov.noDepsTitle': 'No deployments yet', 'ov.noDepsText': 'Deployments you trigger will show up here.',
  'repo.noDesc': 'No description', 'repo.updated': 'Updated {time}', 'repo.open': 'Open {name} on GitHub', 'repo.delete': 'Delete {name}',
  'cr.title': 'Create repository', 'cr.name': 'Repository name', 'cr.nameErr': 'Use letters, numbers, ".", "-" and "_" only (max 100).',
  'cr.desc': 'Description (optional)', 'cr.visibility': 'Visibility', 'cr.none': 'None', 'cr.license': 'License',
  'cr.readme': 'Initialize with README', 'cr.submit': 'Create', 'cr.success': 'Repository {name} created.',
  'im.title': 'Import repository', 'im.text': 'Copies a public GitHub repository into your account as a fork.',
  'im.label': 'Repository', 'im.ph': 'owner/repository or GitHub URL', 'im.err': 'Use the format owner/repository.',
  'im.submit': 'Import', 'im.success': 'Fork of {name} requested. GitHub may take a moment to finish copying.',
  'del.title': 'Delete repository', 'del.warn': 'This action is permanent. Everything in this repository will be deleted from GitHub:',
  'del.confirm': 'Type "{name}" to confirm',
  'del.hint': 'If GitHub asked for extra verification, complete it on github.com. If the delete_repo permission is missing, log out and sign in again to grant it.',
  'del.submit': 'Delete', 'del.success': 'Repository {name} was deleted.',
  'rp.all': 'All', 'rp.sort': 'Sort', 'rp.sortUpdated': 'Recently updated', 'rp.sortName': 'Name',
  'rp.noMatch': 'No matching repositories', 'rp.noMatchText': 'Try a different search or filter.',
  'rp.emptyText': 'Create your first repository to get started.', 'rp.prev': 'Previous page', 'rp.next': 'Next page', 'rp.page': 'Page {cur} of {pages}',
  'dp.s1': 'Create a token at vercel.com/account/tokens.',
  'dp.s2': 'Add VERCEL_TOKEN to your Gitmage project environment variables (add VERCEL_TEAM_ID if you use a team).',
  'dp.s3': 'Redeploy Gitmage, then reload this page.',
  'dp.s4': 'In Vercel, create a project connected to the GitHub repository you want to deploy.',
  'dp.connect': 'Connect Vercel', 'dp.tokenNote': 'The token stays on the server and is never sent to your browser.',
  'dp.repo': 'Repository', 'dp.selectRepo': 'Select a repository', 'dp.branch': 'Branch', 'dp.project': 'Vercel project',
  'dp.selectProject': 'Select a project', 'dp.noProjects': 'No Vercel projects found. Create one in Vercel and connect it to the repository first.',
  'dp.deploy': 'Deploy', 'dp.created': 'Deployment created. Status will update below.', 'dp.recent': 'Recent deployments',
  'dp.emptyText': 'Pick a repository above and deploy it.', 'dp.openSite': 'Open site',
  'st.READY': 'Ready', 'st.BUILDING': 'Building', 'st.INITIALIZING': 'Starting', 'st.QUEUED': 'Queued', 'st.ERROR': 'Failed', 'st.CANCELED': 'Canceled',
  'set.appearance': 'Appearance', 'set.language': 'Language', 'set.access': 'Access',
  'set.accessText': 'GitHub scopes: repo, delete_repo. Your token lives only in an encrypted HttpOnly cookie on the server session.',
  'set.vercelOn': 'Vercel integration: configured', 'set.vercelOff': 'Vercel integration: not configured',
  'err.name': 'Invalid repository name. Use letters, numbers, ".", "-" and "_" only.',
  'err.confirm': 'Confirmation does not match the repository name.', 'err.admin': 'You do not have admin permission on this repository.',
  'err.invalid': 'Invalid repository.', 'err.required': 'Repository, branch and project are required.',
  'err.csrf': 'Request rejected (CSRF protection).', 'err.vercel': 'Vercel is not configured.',
  'err.request': 'Request failed ({n})', 'err.generic': 'Something went wrong',
} as const

export type Key = keyof typeof en

const id: Record<Key, string> = {
  'nav.overview': 'Ringkasan', 'nav.repositories': 'Repositori', 'nav.deployments': 'Deployment', 'nav.settings': 'Pengaturan',
  search: 'Cari repositori', searchShort: 'Cari', theme: 'Tema', 'theme.light': 'Terang', 'theme.dark': 'Gelap', 'theme.system': 'Sistem',
  lang: 'Bahasa', profileMenu: 'Menu profil', githubProfile: 'Profil GitHub', logout: 'Keluar',
  cancel: 'Batal', close: 'Tutup', retry: 'Coba lagi', open: 'Buka', public: 'Publik', private: 'Privat', refresh: 'Muat ulang',
  'login.desc': 'Kelola repositori GitHub dan deploy ke Vercel dari satu tempat.',
  'login.cta': 'Lanjutkan dengan GitHub',
  'login.p1': 'Membaca dan mengelola repositori kamu (scope repo).',
  'login.p2': 'Menghapus repositori hanya setelah kamu konfirmasi dengan mengetik namanya (scope delete_repo).',
  'login.p3': 'Password GitHub kamu tidak pernah dibagikan ke Gitmage.',
  'login.errState': 'Permintaan login tidak dapat diverifikasi. Silakan coba lagi.',
  'login.errFail': 'Login GitHub gagal. Silakan coba lagi.',
  'login.expired': 'Sesi kamu berakhir. Silakan login lagi.',
  'ov.create': 'Buat Repositori', 'ov.import': 'Impor Repositori', 'ov.total': 'Repositori', 'ov.last': 'Terakhir diperbarui:',
  'ov.recent': 'Repositori terbaru', 'ov.viewAll': 'Lihat semua', 'ov.emptyTitle': 'Belum ada repositori',
  'ov.emptyText': 'Buat repositori pertamamu atau impor yang sudah ada.', 'ov.manage': 'Kelola',
  'ov.vncTitle': 'Vercel belum terhubung', 'ov.vncText': 'Tambahkan token Vercel di server untuk deploy dari Gitmage.',
  'ov.seeSetup': 'Lihat setup', 'ov.noDepsTitle': 'Belum ada deployment', 'ov.noDepsText': 'Deployment yang kamu jalankan akan muncul di sini.',
  'repo.noDesc': 'Tanpa deskripsi', 'repo.updated': 'Diperbarui {time}', 'repo.open': 'Buka {name} di GitHub', 'repo.delete': 'Hapus {name}',
  'cr.title': 'Buat repositori', 'cr.name': 'Nama repositori', 'cr.nameErr': 'Hanya huruf, angka, ".", "-" dan "_" (maks 100).',
  'cr.desc': 'Deskripsi (opsional)', 'cr.visibility': 'Visibilitas', 'cr.none': 'Tidak ada', 'cr.license': 'Lisensi',
  'cr.readme': 'Inisialisasi dengan README', 'cr.submit': 'Buat', 'cr.success': 'Repositori {name} berhasil dibuat.',
  'im.title': 'Impor repositori', 'im.text': 'Menyalin repositori GitHub publik ke akunmu sebagai fork.',
  'im.label': 'Repositori', 'im.ph': 'owner/repositori atau URL GitHub', 'im.err': 'Gunakan format owner/repositori.',
  'im.submit': 'Impor', 'im.success': 'Fork {name} diminta. GitHub mungkin butuh waktu untuk menyelesaikan penyalinan.',
  'del.title': 'Hapus repositori', 'del.warn': 'Tindakan ini permanen. Semua isi repositori ini akan dihapus dari GitHub:',
  'del.confirm': 'Ketik "{name}" untuk konfirmasi',
  'del.hint': 'Jika GitHub meminta verifikasi tambahan, selesaikan di github.com. Jika izin delete_repo belum ada, keluar lalu login lagi untuk memberikannya.',
  'del.submit': 'Hapus', 'del.success': 'Repositori {name} berhasil dihapus.',
  'rp.all': 'Semua', 'rp.sort': 'Urutkan', 'rp.sortUpdated': 'Terbaru diperbarui', 'rp.sortName': 'Nama',
  'rp.noMatch': 'Tidak ada repositori yang cocok', 'rp.noMatchText': 'Coba pencarian atau filter lain.',
  'rp.emptyText': 'Buat repositori pertamamu untuk memulai.', 'rp.prev': 'Halaman sebelumnya', 'rp.next': 'Halaman berikutnya', 'rp.page': 'Halaman {cur} dari {pages}',
  'dp.s1': 'Buat token di vercel.com/account/tokens.',
  'dp.s2': 'Tambahkan VERCEL_TOKEN ke environment variables project Gitmage (tambahkan VERCEL_TEAM_ID jika memakai team).',
  'dp.s3': 'Redeploy Gitmage, lalu muat ulang halaman ini.',
  'dp.s4': 'Di Vercel, buat project yang terhubung ke repositori GitHub yang ingin dideploy.',
  'dp.connect': 'Hubungkan Vercel', 'dp.tokenNote': 'Token tetap di server dan tidak pernah dikirim ke browser kamu.',
  'dp.repo': 'Repositori', 'dp.selectRepo': 'Pilih repositori', 'dp.branch': 'Branch', 'dp.project': 'Project Vercel',
  'dp.selectProject': 'Pilih project', 'dp.noProjects': 'Project Vercel tidak ditemukan. Buat dulu di Vercel dan hubungkan ke repositori.',
  'dp.deploy': 'Deploy', 'dp.created': 'Deployment dibuat. Status akan diperbarui di bawah.', 'dp.recent': 'Deployment terbaru',
  'dp.emptyText': 'Pilih repositori di atas lalu deploy.', 'dp.openSite': 'Buka situs',
  'st.READY': 'Siap', 'st.BUILDING': 'Membangun', 'st.INITIALIZING': 'Memulai', 'st.QUEUED': 'Antre', 'st.ERROR': 'Gagal', 'st.CANCELED': 'Dibatalkan',
  'set.appearance': 'Tampilan', 'set.language': 'Bahasa', 'set.access': 'Akses',
  'set.accessText': 'Scope GitHub: repo, delete_repo. Token kamu hanya disimpan di cookie HttpOnly terenkripsi pada sesi server.',
  'set.vercelOn': 'Integrasi Vercel: terkonfigurasi', 'set.vercelOff': 'Integrasi Vercel: belum dikonfigurasi',
  'err.name': 'Nama repositori tidak valid. Hanya huruf, angka, ".", "-" dan "_".',
  'err.confirm': 'Konfirmasi tidak cocok dengan nama repositori.', 'err.admin': 'Kamu tidak punya izin admin pada repositori ini.',
  'err.invalid': 'Repositori tidak valid.', 'err.required': 'Repositori, branch, dan project wajib diisi.',
  'err.csrf': 'Request ditolak (proteksi CSRF).', 'err.vercel': 'Vercel belum dikonfigurasi.',
  'err.request': 'Permintaan gagal ({n})', 'err.generic': 'Terjadi kesalahan',
}

export function t(k: Key, v?: Record<string, string | number>): string {
  let s: string = (lang === 'id' ? id : en)[k]
  if (v) for (const [a, b] of Object.entries(v)) s = s.split(`{${a}}`).join(String(b))
  return s
}

// Pesan error dari server (bahasa Inggris) dipetakan ke teks terjemahan; pesan GitHub/Vercel ditampilkan apa adanya.
const SERVER: Record<string, Key> = {
  'Invalid repository name. Use letters, numbers, ".", "-" and "_" only.': 'err.name',
  'Confirmation does not match the repository name.': 'err.confirm',
  'You do not have admin permission on this repository.': 'err.admin',
  'Invalid repository.': 'err.invalid',
  'Repository, branch and project are required.': 'err.required',
  'Use the format owner/repository.': 'im.err',
  'Request rejected (CSRF protection)': 'err.csrf',
  vercel_not_configured: 'err.vercel',
}
export const translateServer = (msg: string) => (SERVER[msg] ? t(SERVER[msg]) : msg)
