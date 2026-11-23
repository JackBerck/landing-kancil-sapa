<?php

/**
 * Ekspor "naskah" bot WhatsApp (menu, jawaban, pesan standar, jam layanan) dari repo Laravel untuk chat bot di landing.
 * Teks dirakit memakai kelas bot yang sama (BotScript, MenuAnswerResolver), jadi isinya identik dengan WhatsApp.
 *
 * Dipanggil oleh scripts/bot-from-laravel.mjs:  php scripts/bot-export.php <path-repo-laravel>
 * Database: SQLite in-memory + DatabaseSeeder (pengaturan jam = default seeder = nilai di produksi).
 */

use App\Models\Faq;
use App\Services\Bot\BotEngine;
use App\Services\Bot\BotScript;
use App\Services\Bot\BusinessHours;
use App\Services\Bot\MenuAnswerResolver;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;

$laravel = rtrim($argv[1] ?? '', '/\\');

if ($laravel === '' || ! is_file($laravel.'/artisan')) {
    fwrite(STDERR, "Pakai: php scripts/bot-export.php <path-repo-laravel>\n");
    exit(1);
}

chdir($laravel);
require $laravel.'/vendor/autoload.php';
$app = require $laravel.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

config([
    'database.default' => 'sqlite',
    'database.connections.sqlite.database' => ':memory:',
    'cache.default' => 'array',
]);
Artisan::call('migrate', ['--force' => true]);
Artisan::call('db:seed', ['--force' => true]);

$rows = collect(require $laravel.'/database/data/faqs.php')->keyBy('code');

// Jawaban menu persis seperti dikirim bot (semua FAQ terverifikasi di produksi sejak 21 Nov 2026).
$answers = [];
foreach (BotScript::ANSWERS as $path => $definition) {
    if ($definition['faq'] === null) {
        $body = BotScript::locationText();
    } else {
        $faqs = collect($definition['faq'])->map(fn (string $code) => new Faq([
            'question' => $rows[$code]['question'],
            'answer' => $rows[$code]['answer'],
        ]));
        $body = MenuAnswerResolver::compose($faqs);

        if (! empty($definition['pnbp'])) {
            $body .= "\n\n".BotScript::pnbpBlock($definition['pnbp']);
        }
    }

    // Menu WNA (jalur 1>...) memakai footer dwibahasa, sama dengan BotEngine::englishFooter().
    $answers[$path] = BotScript::answer($body, str_starts_with($path, '1>'));
}

$menus = [];
foreach (BotScript::MENUS as $code => $menu) {
    $menus[$code] = [
        'path' => $menu['path'],
        'parent' => $menu['parent'],
        'options' => array_map(fn ($option) => ['label' => $option[0], 'target' => $option[1]], $menu['options']),
        'text' => $code === 'M-00' ? null : BotScript::menu($code),
    ];
}

// Menu utama: sapaan (tergantung jam) dan status hari ini diisi di landing.
$mainMenu = BotScript::mainMenu(null, '{{STATUS}}');
$mainMenu = '{{GREETING}}'.substr($mainMenu, strpos($mainMenu, "\n"));

// Contoh status pada waktu tertentu, untuk menguji logika jam di landing terhadap BusinessHours.
$hours = app(BusinessHours::class);
$samples = [];
foreach (['2026-11-11 10:00', '2026-11-11 07:59', '2026-11-12 16:00', '2026-11-13 16:15', '2026-11-13 16:30', '2026-11-14 10:00', '2026-11-15 20:00', '2026-12-25 10:00', '2027-01-01 09:00'] as $at) {
    $moment = Carbon::parse($at, BusinessHours::TIMEZONE);
    $samples[] = [
        'at' => $moment->toIso8601String(),
        'status' => $hours->statusText($moment),
        'greeting' => BotScript::greeting(null, $moment),
        'open' => $hours->isOpen($moment),
    ];
}

$greetings = (new ReflectionClassConstant(BotEngine::class, 'GREETINGS'))->getValue();

echo json_encode([
    'source' => 'Project_Magang_KANCIL (BotScript, MenuAnswerResolver, BusinessHours)',
    'menus' => $menus,
    'answers' => $answers,
    'mainMenu' => $mainMenu,
    'answerFooter' => BotScript::answerFooter(),
    'answerFooterEn' => BotScript::answerFooter(english: true),
    'statusPrompt' => BotScript::statusPrompt(),
    'placePrompt' => BotScript::placePrompt('{{NOMOR}}'),
    'applicationPlaces' => config('kancil.application_places'),
    'messages' => [
        'MSG-01' => BotScript::msg('MSG-01'),
        'MSG-02' => BotScript::msg('MSG-02'),
        'MSG-03' => BotScript::msg('MSG-03'),
        'MSG-06' => BotScript::msg('MSG-06'),
    ],
    'hours' => [
        'start' => '08:00',
        'end' => '16:00',
        'endFriday' => $hours->closingTime(5),
        'workingDays' => $hours->workingDays(),
        'scheduleText' => $hours->scheduleText(),
    ],
    'holidays' => config('holidays.dates'),
    'greetings' => $greetings,
    'sessionTimeoutMinutes' => (int) config('kancil.session_timeout_minutes'),
    'samples' => $samples,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT).PHP_EOL;
