# KANCIL SAPA landing page

Situs statis `kancilsapa.com` (SvelteKit 3, Svelte 5, adapter-static). Semua halaman diprerender menjadi HTML, tanpa JavaScript di browser. Dashboard petugas tetap di `dashboard.kancilsapa.com` (proyek Laravel terpisah).

## Perintah

```sh
pnpm install
pnpm dev            # http://localhost:5173
pnpm build          # hasil statis di build/ (ada .br dan .gz)
pnpm preview        # uji hasil build
pnpm lint && pnpm check && pnpm test
```

## Sumber isi

| Apa                                         | Di mana                                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| Nomor WhatsApp, email, alamat, jam layanan  | `src/lib/site.ts` (satu tempat)                                                    |
| Jawaban FAQ (data bot, `pnpm faq:sync`)     | `src/lib/content/faqs.json`                                                        |
| Pengelompokan FAQ jadi halaman `/layanan/*` | `src/lib/faq.ts` (kelompok menurut awalan kode: PSP, ANK, AMB, BYR, TRF, LYK, WNA) |
| Teks beranda, pengaduan, tentang, privasi   | file `+page.svelte` masing-masing                                                  |
| Desain (token warna, font, ukuran)          | `src/lib/styles/tokens.css`, `src/routes/app.css`                                  |

### Memperbarui FAQ

Sumber utama adalah data FAQ bot di repo Laravel (`Project_Magang_KANCIL/database/data/faqs.php`), yang dikalibrasi ke Inventarisasi FAQ 3.1 dan feedback Imigrasi. Seluruh FAQ di produksi sudah terverifikasi + aktif (21 November 2026). Dengan kedua repo bersebelahan:

```sh
pnpm faq:sync        # tulis src/lib/content/faqs.json dari data bot (format WhatsApp diubah otomatis)
pnpm test            # termasuk cek bahwa faqs.json dan menu landing sama dengan bot (hanya bila repo bot ada)
```

Lalu `pnpm build` dan `pnpm test:build`. Bila isi FAQ diubah petugas lewat dashboard, salin dulu perubahannya ke `faqs.php` di repo bot agar kedua sisi tetap sama. Cadangan lama: `pnpm faq:doc` (dari dokumen Inventarisasi, sudah usang).

Menu bot (beranda dan contoh chat) ada di `botMenu` pada `src/lib/site.ts`. Test `src/lib/content.test.ts` membandingkannya dengan `BotScript::MENUS` di repo bot.

Bila ada kelompok FAQ baru, tambahkan di `groups` pada `src/lib/faq.ts` (slug, awalan kode, judul, deskripsi). Sitemap ikut otomatis.

### Chat bot di situs (pojok kanan bawah)

Versi web dari menu bot WhatsApp: menu, jawaban, pesan standar, dan jam layanan diekspor dari kode bot (`BotScript`, `MenuAnswerResolver`, `BusinessHours`) sehingga teksnya identik.

```sh
pnpm bot:sync        # tulis src/lib/chatbot/bot-script.json dari repo bot (butuh PHP + vendor Laravel)
```

- Logika: `src/lib/chatbot/engine.ts` (meniru `BotEngine` bagian menu). Hubungi petugas (menu 3, 88, "1" setelah jawaban, cek status) diarahkan ke WhatsApp resmi, karena situs statis tidak punya antrean petugas. Teks bebas tidak dijawab AI, diperlakukan sebagai salah input seperti bot tanpa AI.
- Situs tetap tanpa hidrasi (`csr = false`). Widget dibundel terpisah (`vite.chatbot.config.ts`) menjadi `/chatbot/widget.js?v=<hash>`; `pnpm build` menjalankannya otomatis. Gaya ada di `app.css` (`.chatbot*`).
- CSP harus `script-src 'self'` (lihat `deploy/kancilsapa-security-headers.conf`; salin ke `/etc/nginx/snippets/` di VPS lalu reload nginx). Tanpa itu, browser memblokir widget.
- Riwayat chat hanya di `sessionStorage` browser, tidak dikirim ke server.
- Test: `src/lib/chatbot/engine.test.ts` (setiap jalur menu, jam layanan dibandingkan dengan contoh dari `BusinessHours`), dan E2E `pnpm test:e2e` (Playwright, desktop + ponsel; jalankan `pnpm build` dulu).

### Pemeriksaan hasil build

`pnpm test:build` (dijalankan di CI setelah `pnpm build`) membaca HTML prerender di `build/` dan gagal bila halaman memuat informasi usang: menu lama, alur pengaduan swalayan, format `CEK#`, angka PNBP gabungan, atau tanda `**` mentah.

### Ikon dan gambar OG

`pnpm assets` membangkitkan favicon, ikon, dan `static/og/default.png` dari logo Imigrasi (`src/lib/assets/brand/logo-imigrasi.png`) dan `scripts/og-card.html`. Perlu Chromium milik Playwright (`npx playwright install chromium`).

## Deploy (VPS + Cloudflare)

1. Cloudflare DNS: `kancilsapa.com` dan `www` ke IP VPS, status Proxied. SSL/TLS mode Full (strict), pasang sertifikat Origin CA di `/etc/ssl/cloudflare/`.
2. VPS: salin `deploy/nginx.kancilsapa.com.conf` ke `/etc/nginx/conf.d/` dan `deploy/kancilsapa-security-headers.conf` ke `/etc/nginx/snippets/`. Buat folder `/var/www/kancilsapa.com`. `nginx -t && systemctl reload nginx`.
3. Rilis: `VPS=user@ip ./deploy/deploy.sh` (build, rsync ke folder rilis baru, pindah symlink `current`, simpan 5 rilis terakhir).

## Setelah tayang

- Google Search Console: tambah properti domain `kancilsapa.com` (verifikasi DNS TXT di Cloudflare), kirim `https://kancilsapa.com/sitemap.xml`.
- Bing Webmaster Tools: impor dari Search Console.
- Uji `https://search.google.com/test/rich-results` pada `/faq` dan `/layanan/tarif-pnbp`.
- Jalankan PageSpeed Insights (HP). Target: Performance ≥ 90, Accessibility, Best Practices, SEO ≥ 95.
- Cek berkala: tarif PNBP, nomor, jam layanan di `site.ts` dan `faqs.json`. Perbarui `lastVerified` setiap petugas memeriksa ulang.

## Desain

Tema Hallmark "Dose" (kertas hangat, kartu pastel berlapis plastik, satu warna hijau, sudut membulat). Aturan desain dicek dengan:

```sh
pnpm build && pnpm preview --port 4173 &
pnpm lint:design --url http://localhost:4173/
```

Berkas `src/routes/app.css` memuat cap Hallmark dan waiver di baris awal; jangan dihapus.
