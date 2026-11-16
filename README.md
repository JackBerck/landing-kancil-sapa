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

| Apa                                            | Di mana                                                                            |
| ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| Nomor WhatsApp, email, alamat, jam layanan     | `src/lib/site.ts` (satu tempat)                                                    |
| Jawaban FAQ (hanya yang terverifikasi + aktif) | `src/lib/content/faqs.json`                                                        |
| Pengelompokan FAQ jadi halaman `/layanan/*`    | `src/lib/faq.ts` (kelompok menurut awalan kode: PSP, ANK, AMB, BYR, TRF, LYK, WNA) |
| Teks beranda, pengaduan, tentang, privasi      | file `+page.svelte` masing-masing                                                  |
| Desain (token warna, font, ukuran)             | `src/lib/styles/tokens.css`, `src/routes/app.css`                                  |

### Memperbarui FAQ

Sumber utama adalah Laravel. Di folder `Project_Magang_KANCIL`:

```sh
php artisan faq:activate      # sekali: tandai FAQ terverifikasi + aktif (setelah petugas memastikan)
php artisan faq:export        # tulis ../landing/src/lib/content/faqs.json (hanya FAQ aktif)
```

Lalu `pnpm build` dan deploy. Cadangan tanpa database: `pnpm faq:doc` membaca `Dokumen/Dokumen_Inventarisasi_FAQ.docx.md` dan menganggap semua FAQ terverifikasi.

Bila ada kelompok FAQ baru, tambahkan di `groups` pada `src/lib/faq.ts` (slug, awalan kode, judul, deskripsi). Sitemap ikut otomatis.

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
