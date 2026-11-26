# Deploy Eunomia ke VPS dengan Coolify

Panduan ini mengasumsikan **VPS sudah siap dan Coolify v4 sudah terinstal** serta bisa diakses dari browser. Semua langkah dilakukan lewat dashboard Coolify — tidak perlu SSH ke server kecuali untuk backup/troubleshooting.

---

## 1. Gambaran Arsitektur

```
Browser ──HTTPS──▶ Coolify Proxy (Traefik, SSL Let's Encrypt otomatis)
                          │
                          ▼
              ┌───────────────────────┐        ┌──────────────────────┐
              │  Eunomia (container)   │──────▶│ PostgreSQL 16         │
              │  Next.js, port 3000    │ intern│ (Coolify Database)    │
              │  /app/uploads ◀── volume│        └──────────────────────┘
              └───────────┬───────────┘
                          │ HTTPS keluar (cek lisensi harian)
                          ▼
                   Supabase (license server)
```

Yang sudah disiapkan di repo:

| File | Fungsi |
|---|---|
| [`Dockerfile`](../Dockerfile) | Build multi-stage (Node 24), image produksi berjalan sebagai user non-root `node` |
| [`docker/entrypoint.sh`](../docker/entrypoint.sh) | Saat container start: validasi env wajib → `prisma migrate deploy` → seed framework (idempotent) → jalankan app |
| [`.dockerignore`](../.dockerignore) | Mencegah `.env`, `uploads/`, `node_modules` ikut ke image |
| `GET /api/health` | Endpoint healthcheck (cek koneksi DB), dipakai oleh Docker `HEALTHCHECK` dan Coolify |

> **Penting — hanya 1 instance.** Evidence disimpan di filesystem lokal dan rate limiter sign-in berbasis memori. Jangan menjalankan lebih dari 1 replica / container Eunomia untuk satu database.

---

## 2. Prasyarat

| Item | Keterangan |
|---|---|
| VPS + Coolify v4 | RAM minimal **2 GB** (build Next.js cukup berat; tambahkan swap jika RAM 2 GB), disk ≥ 20 GB |
| Domain / subdomain | Contoh `compliance.perusahaan.co.id`, buat **A record** mengarah ke IP VPS |
| Akses repo Git | Repo GitHub/GitLab yang berisi kode Eunomia (private repo → hubungkan via GitHub App atau Deploy Key di Coolify) |
| Supabase | Project dengan tabel `license_keys` dan 1 baris lisensi aktif (lihat [CLAUDE.md](../CLAUDE.md#supabase-license-server-setup-one-time)) |
| SMTP (opsional) | Untuk email notifikasi; jika kosong, fitur email otomatis non-aktif |
| Firewall VPS | Hanya buka port **22, 80, 443** (dan port dashboard Coolify `8000` bila belum diproteksi domain) |

---

## 3. Langkah Deploy

### Langkah 1 — Buat Project

1. Dashboard Coolify → **Projects** → **+ Add** → beri nama `Eunomia`.
2. Pilih environment `production`.

### Langkah 2 — Buat Database PostgreSQL

1. Di dalam project → **+ New** → **Database** → **PostgreSQL** (pilih versi **16**).
2. Isi:
   - **Name**: `eunomia-db`
   - **Username**: `eunomia`
   - **Password**: biarkan yang di-generate Coolify (atau isi password kuat)
   - **Initial Database**: `eunomia`
3. **Jangan** centang *Make it publicly available*. Database cukup diakses lewat jaringan internal Docker.
4. Klik **Start**. Tunggu status *Running*.
5. Salin **Postgres URL (internal)**, bentuknya kira-kira:

   ```
   postgres://eunomia:<password>@<uuid-database>:5432/eunomia
   ```

   URL ini dipakai untuk `DATABASE_URL` di langkah 4.

> Jika password mengandung karakter khusus (`!`, `$`, `@`, `#`, `/`), lakukan *percent-encode* di URL (contoh `!` → `%21`, `$` → `%24`, `@` → `%40`).

### Langkah 3 — Buat Aplikasi

1. Di project yang sama → **+ New** → pilih sumber repo:
   - **Private Repository (with GitHub App)** — rekomendasi untuk repo private, atau
   - **Public Repository** jika repo publik.
2. Pilih repository dan branch **`main`**.
3. **Build Pack**: pilih **Dockerfile** (bukan Nixpacks).
   - *Base Directory*: `/`
   - *Dockerfile Location*: `/Dockerfile`
4. **Ports Exposes**: `3000`.
5. Simpan. Di tab **General**:
   - **Domains**: `https://compliance.perusahaan.co.id` (gunakan `https://` agar Coolify membuat sertifikat SSL otomatis).

> Pastikan aplikasi dan database berada di **project/environment yang sama** supaya bisa saling terhubung lewat jaringan internal Coolify.

### Langkah 4 — Environment Variables

Tab **Environment Variables** → tambahkan variabel berikut (mode *Developer view* memudahkan paste sekaligus).

**Wajib** (container akan menolak start jika kosong):

```env
DATABASE_URL=postgres://eunomia:<password>@<uuid-database>:5432/eunomia
NEXTAUTH_SECRET=<hasil: openssl rand -base64 48>
NEXTAUTH_URL=https://compliance.perusahaan.co.id
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Opsional:**

```env
MAX_FILE_SIZE_MB=50
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=noreply@example.com
EMAIL_SERVER_PASSWORD=<password-smtp>
EMAIL_FROM=Eunomia <noreply@example.com>

# Default keduanya "true". Set "false" bila ingin migrasi/seed dijalankan manual.
RUN_MIGRATIONS=true
RUN_SEED=true
```

Catatan:

- **`NEXTAUTH_SECRET`** minimal 32 karakter. Generate di laptop: `openssl rand -base64 48`. Secret ini juga dipakai menandatangani cookie lisensi — **jangan diganti** setelah produksi berjalan (semua user akan ter-logout dan lisensi harus di-refresh).
- **`NEXTAUTH_URL`** harus sama persis dengan domain publik (pakai `https://`, tanpa `/` di akhir). Salah isi = redirect ke `localhost` atau login gagal.
- **Jangan** centang *Build Variable* — semua variabel di atas hanya dibutuhkan saat runtime.
- `UPLOAD_DIR` **tidak perlu diisi**; image sudah men-set `/app/uploads`.

### Langkah 5 — Persistent Storage untuk Evidence

Tanpa volume, semua file evidence **hilang setiap redeploy**.

1. Tab **Persistent Storage** (atau **Storages**) → **+ Add** → **Volume**.
2. Isi:
   - **Name**: `eunomia-uploads`
   - **Destination Path**: `/app/uploads`
3. Simpan.

> Gunakan **volume** (bukan *bind mount* ke folder host). Volume baru otomatis mewarisi kepemilikan user `node` (UID 1000) dari image sehingga bisa ditulisi. Jika terpaksa memakai bind mount, jalankan di VPS: `sudo chown -R 1000:1000 /path/folder-host`.

### Langkah 6 — Healthcheck

Image sudah memiliki `HEALTHCHECK` bawaan ke `/api/health`. Jika ingin diatur dari Coolify (tab **Healthcheck**):

| Field | Nilai |
|---|---|
| Enabled | ✅ |
| Path | `/api/health` |
| Port | `3000` |
| Scheme | `http` |
| Start Period | `60` detik (migrasi + seed butuh waktu saat start pertama) |

`/api/health` mengembalikan `200 {"status":"ok","database":"up"}` bila DB terhubung, dan `503` bila tidak.

### Langkah 7 — Deploy

1. Klik **Deploy**.
2. Pantau **Deployments → Logs**. Build pertama ± 3–8 menit tergantung spesifikasi VPS.
3. Setelah container start, log runtime normal terlihat seperti ini:

   ```
   [entrypoint] Applying database migrations...
   All migrations have been successfully applied.
   [entrypoint] Seeding framework data...
   Done. 3 frameworks, 22 domains, 262 controls.
   [entrypoint] Starting Eunomia on port 3000...
    ✓ Ready in 150ms
   ```

4. Status aplikasi berubah menjadi **Running (healthy)**.

---

## 4. Setup Pertama Setelah Deploy

1. Buka `https://compliance.perusahaan.co.id` → otomatis diarahkan ke **`/activate`**.
2. Masukkan **license key** (dari tabel `license_keys` di Supabase).
3. Daftarkan **user pertama** → otomatis menjadi **Super Admin**. Setelah itu registrasi publik tertutup.
4. Masuk ke **Settings → Security Policy** untuk mengatur masa berlaku password & lockout.
5. Buat **Tenant** → buat user via halaman **Users** (password sementara ditampilkan sekali) → mulai assessment.

> Lakukan langkah 3 **segera** setelah deploy pertama — siapa pun yang membuka halaman lebih dulu akan menjadi Super Admin.

---

## 5. Update Aplikasi

**Otomatis (disarankan):** di tab **General / Advanced**, aktifkan **Auto Deploy**. Setiap push ke branch `main` akan memicu build & deploy baru (via GitHub App atau webhook).

**Manual:** klik **Redeploy** di dashboard Coolify.

Saat container baru start, migrasi database baru diterapkan otomatis (`prisma migrate deploy`) dan seed framework dijalankan ulang secara idempotent — data assessment, user, dan evidence tidak tersentuh.

**Rollback:** tab **Deployments** → pilih deployment sebelumnya → **Rollback**.
> Rollback hanya mengembalikan kode/image. Migrasi database **tidak** di-rollback otomatis, jadi pastikan ada backup DB sebelum update besar.

---

## 6. Backup

### Database

1. Buka resource **eunomia-db** → tab **Backups**.
2. Aktifkan **Scheduled Backup**, contoh frekuensi `0 2 * * *` (setiap hari jam 02:00).
3. (Disarankan) Hubungkan **S3 Storage** (Settings → S3 Storages: AWS S3, Cloudflare R2, MinIO, Wasabi) agar backup tersimpan di luar VPS.

### File Evidence (volume `/app/uploads`)

Coolify tidak mem-backup volume aplikasi secara otomatis. Jalankan di VPS (bisa dijadwalkan dengan cron):

```bash
# Cari nama volume sebenarnya (Coolify menambahkan prefix UUID)
docker volume ls | grep eunomia-uploads

# Backup ke file tar.gz
docker run --rm \
  -v <nama-volume>:/data:ro \
  -v /root/backups:/backup \
  alpine tar czf /backup/eunomia-uploads-$(date +%F).tar.gz -C /data .
```

Restore:

```bash
docker run --rm -v <nama-volume>:/data -v /root/backups:/backup \
  alpine sh -c "tar xzf /backup/eunomia-uploads-YYYY-MM-DD.tar.gz -C /data && chown -R 1000:1000 /data"
```

> Backup DB dan backup evidence harus diambil berdekatan waktunya — tabel `Evidence` menyimpan path relatif ke file di volume.

---

## 7. Troubleshooting

| Gejala | Penyebab umum | Solusi |
|---|---|---|
| Log: `required environment variable X is not set` | Env wajib belum diisi | Lengkapi di tab Environment Variables, lalu Redeploy |
| Log: `NEXTAUTH_SECRET must be at least 32 characters` | Secret terlalu pendek | Generate ulang: `openssl rand -base64 48` |
| `P1001: Can't reach database server` | `DATABASE_URL` salah / DB beda project / DB belum running | Gunakan **internal URL** dari resource database, pastikan satu project & environment |
| `P1000: Authentication failed` | Password mengandung karakter khusus | *Percent-encode* password di URL |
| Setelah login diarahkan ke `localhost:3000` | `NEXTAUTH_URL` salah | Isi dengan domain `https://...` yang benar |
| **502 Bad Gateway** / *no available server* | Port salah atau container belum healthy | *Ports Exposes* = `3000`; cek log runtime; tunggu start period |
| Upload evidence gagal: `EACCES: permission denied` | Bind mount dimiliki root | Pakai volume, atau `chown -R 1000:1000` folder host |
| Evidence hilang setelah redeploy | Persistent storage belum dibuat | Ikuti Langkah 5 (file yang sudah hilang tidak bisa dikembalikan) |
| Aktivasi lisensi gagal | VPS tidak bisa akses Supabase / key salah / `is_active=false` / expired | Tes dari VPS: `curl -I https://xxxx.supabase.co`; cek baris di tabel `license_keys` |
| Build gagal / `Killed` / `JavaScript heap out of memory` | RAM VPS kurang saat build | Tambah swap 2–4 GB atau upgrade RAM |
| Sertifikat SSL tidak terbit | DNS belum mengarah ke VPS / port 80 tertutup | Cek A record (`dig +short domain`), buka port 80 & 443 |
| Seed lambat di setiap restart | Seed dijalankan setiap start | Setelah deploy pertama sukses, boleh set `RUN_SEED=false` (aktifkan lagi bila ada update data framework) |

Cek kesehatan dari VPS:

```bash
docker ps --filter "name=<uuid-app>"                         # status (healthy)
docker exec <container> curl -s http://127.0.0.1:3000/api/health
docker logs --tail 100 <container>
```

---

## 8. Checklist Keamanan Produksi

- [ ] Domain memakai **HTTPS** (aplikasi mengirim header HSTS di mode produksi)
- [ ] Database **tidak** di-expose publik
- [ ] Firewall VPS hanya membuka port 22, 80, 443
- [ ] `NEXTAUTH_SECRET` unik, ≥ 32 karakter, tidak dipakai di environment lain
- [ ] `SUPABASE_SERVICE_ROLE_KEY` hanya disimpan di env Coolify (tidak di repo)
- [ ] Super Admin dibuat segera setelah deploy pertama
- [ ] Scheduled backup database aktif (idealnya ke S3 eksternal) + backup volume evidence
- [ ] Dashboard Coolify diproteksi (domain + HTTPS, password kuat, 2FA bila tersedia)
- [ ] Hanya **1 instance** aplikasi yang berjalan
