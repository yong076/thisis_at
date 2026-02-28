/**
 * Banned handle words by category.
 * - EXACT: blocked if the handle matches exactly
 * - SUBSTRING: blocked if the handle contains the word anywhere
 */

// ── Sexual / Inappropriate (substring match) ──────────────────────────
const SEXUAL: string[] = [
  'sex', 'porn', 'xxx', 'hentai', 'fuck', 'shit', 'dick', 'cock', 'pussy',
  'bitch', 'whore', 'slut', 'nude', 'naked', 'erotic', 'orgasm', 'fetish',
  'milf', 'dildo', 'vibrator', 'blowjob', 'handjob', 'anal', 'boob', 'tits',
  'penis', 'vagina', 'masturbat', 'cumshot', 'creampie', 'gangbang', 'rape',
  'molest', 'pedophil', 'incest', 'bestiality', 'necrophil',
  'onlyfans', 'chaturbate', 'pornhub', 'xvideos', 'xhamster', 'xnxx',
  // Korean romanization
  'yadong', 'ssib', 'shibal', 'ssibal', 'jaji', 'boji', 'gaesaekki',
  'gaeseki', 'nyeon', 'ssang', 'jot', 'byungshin', 'byeongsin',
  'michin', 'tlqkf', 'sibal', 'ㅅㅂ', 'ㅂㅅ', 'ㅈㄹ',
];

// ── Trademarks / Famous Brands (exact match) ──────────────────────────
const TRADEMARKS: string[] = [
  // Tech
  'google', 'apple', 'microsoft', 'amazon', 'meta', 'facebook', 'instagram',
  'twitter', 'tiktok', 'snapchat', 'whatsapp', 'telegram', 'discord',
  'youtube', 'netflix', 'spotify', 'twitch', 'reddit', 'pinterest',
  'linkedin', 'github', 'openai', 'chatgpt', 'anthropic', 'claude',
  'samsung', 'lg', 'sony', 'nintendo', 'playstation', 'xbox',
  'nvidia', 'intel', 'amd', 'qualcomm', 'huawei', 'xiaomi',
  'uber', 'airbnb', 'paypal', 'stripe', 'shopify', 'zoom',
  'slack', 'notion', 'figma', 'adobe', 'canva', 'dropbox',
  // Fashion / Luxury
  'gucci', 'prada', 'chanel', 'hermes', 'dior', 'louisvuitton',
  'burberry', 'versace', 'balenciaga', 'fendi', 'cartier', 'rolex',
  'tiffany', 'valentino', 'givenchy', 'ysl', 'saintlaurent', 'celine',
  'bottegaveneta', 'loewe', 'moncler', 'offwhite',
  // Sportswear
  'nike', 'adidas', 'puma', 'reebok', 'newbalance', 'underarmour',
  'jordan', 'converse', 'vans', 'northface', 'patagonia', 'arcteryx',
  // Food & Beverage
  'cocacola', 'pepsi', 'starbucks', 'mcdonalds', 'burgerking', 'subway',
  'dominos', 'kfc', 'chipotle',
  // Auto
  'tesla', 'bmw', 'mercedes', 'porsche', 'ferrari', 'lamborghini',
  'bentley', 'rollsroyce', 'audi', 'volkswagen',
  'toyota', 'honda', 'hyundai', 'kia', 'genesis',
  // Korean brands
  'kakao', 'kakaotalk', 'naver', 'coupang', 'baemin', 'toss',
  'line', 'bandai', 'lotte', 'shinsegae', 'emart', 'olive.young',
];

// ── K-pop Groups & Members (exact match) ──────────────────────────────
const KPOP: string[] = [
  // Groups
  'bts', 'blackpink', 'twice', 'newjeans', 'aespa', 'ive', 'exo',
  'nct', 'nct127', 'nctdream', 'wayv', 'redvelvet', 'itzy', 'gidle',
  'seventeen', 'txt', 'enhypen', 'lesserafim', 'babymonster',
  'straykids', 'ateez', 'theboyz', 'treasure', 'riize', 'zerobaseone',
  'boysnextdoor', 'illit', 'kiss.of.life', 'nmixx', 'viviz',
  'mamamoo', 'bigbang', '2ne1', 'shinee', 'superjunior', 'tvxq',
  'snsd', 'girlsgeneration', 'wonder.girls', 'sistar', '4minute',
  'got7', 'monsta.x', 'day6', 'btob', 'winner', 'ikon',
  'fromis9', 'dreamcatcher', 'loona', 'clc', 'everglow', 'stayc',
  'weeekly', 'purple.kiss', 'lightsum', 'billlie', 'kep1er', 'xikers',
  // BTS members
  'rm', 'jin', 'suga', 'jhope', 'jimin', 'taehyung', 'jungkook',
  'namjoon', 'seokjin', 'yoongi', 'hoseok',
  // BLACKPINK members
  'jennie', 'jisoo', 'lisa', 'rose', 'roseanne', 'lalisa',
  // TWICE members
  'nayeon', 'jeongyeon', 'momo', 'sana', 'jihyo', 'mina',
  'dahyun', 'chaeyoung', 'tzuyu',
  // NewJeans members
  'minji', 'hanni', 'danielle', 'haerin', 'hyein',
  // aespa members
  'karina', 'giselle', 'winter', 'ningning',
  // IVE members
  'yujin', 'gaeul', 'rei', 'wonyoung', 'liz', 'leeseo',
  // LE SSERAFIM members
  'sakura', 'chaewon', 'yunjin', 'kazuha', 'eunchae',
  // Solo artists
  'iu', 'psy', 'zico', 'sunmi', 'hyuna', 'chungha', 'taeyeon',
  'baekhyun', 'kai', 'taemin', 'dean', 'crush', 'heize',
  'bibi', 'leehi', 'akmu', 'jessi', 'hwasa',
];

// ── International Celebrities (exact match) ───────────────────────────
const CELEBRITIES: string[] = [
  'taylorswift', 'beyonce', 'rihanna', 'drake', 'kanyewest', 'ye',
  'justinbieber', 'arianagrande', 'selenagomez', 'theweeknd',
  'billieeilish', 'oliviarodrigo', 'duaLipa', 'harrystyles',
  'edsheeran', 'brunomars', 'ladygaga', 'shakira', 'adele',
  'elonmusk', 'markzuckerberg', 'jeffbezos', 'billgates', 'timcook',
  'tomholland', 'zendaya', 'timothee', 'chrishemsworth', 'tomcruise',
  'leonardodicaprio', 'bradpitt', 'angelinajolie', 'margotrobbie',
  'emmawatson', 'robertdowneyjr', 'keanuReeves',
  'cristiano', 'ronaldo', 'messi', 'mbappe', 'neymar', 'haaland',
  'lebron', 'lebronjames', 'stephcurry', 'michaeljordan',
  'sonheungmin', 'heungminson',
  'trump', 'biden', 'obama',
];

// ── System / Reserved (exact match) ──────────────────────────────────
const SYSTEM: string[] = [
  'admin', 'administrator', 'root', 'superuser', 'moderator', 'mod',
  'analytics', 'api', 'support', 'terms', 'privacy', 'login', 'logout',
  'dashboard', 'editor', 'settings', 'account', 'accounts',
  'home', 'explore', 'search', 'profile', 'profiles',
  'help', 'about', 'contact', 'blog', 'news', 'press',
  'official', 'verified', 'verify', 'verification',
  'signup', 'signin', 'register', 'auth', 'oauth',
  'billing', 'payment', 'subscribe', 'premium', 'pro', 'plus',
  'null', 'undefined', 'test', 'demo', 'example', 'sample',
  'thisis', 'thisis.at', 'thisisat',
  'status', 'docs', 'documentation', 'legal', 'copyright',
  'feedback', 'report', 'abuse', 'spam', 'block', 'unblock',
  'follow', 'unfollow', 'like', 'share', 'comment',
  'notification', 'notifications', 'message', 'messages', 'chat',
  'create', 'delete', 'update', 'edit', 'remove',
  'user', 'users', 'member', 'members', 'staff', 'team',
  'app', 'application', 'download', 'install',
  'www', 'mail', 'email', 'ftp', 'ssh', 'ssl',
];

// Build lookup sets
const EXACT_BANNED = new Set<string>([
  ...TRADEMARKS,
  ...KPOP,
  ...CELEBRITIES,
  ...SYSTEM,
].map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')));

const SUBSTRING_BANNED = SEXUAL.map(w => w.toLowerCase());

/**
 * Check if a handle is banned.
 * Returns the reason category if banned, or null if allowed.
 */
export function checkBannedHandle(handle: string): string | null {
  const normalized = handle.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Exact match
  if (EXACT_BANNED.has(normalized)) {
    return '이 핸들은 사용할 수 없습니다.';
  }

  // Substring match for sexual/inappropriate words
  for (const word of SUBSTRING_BANNED) {
    if (normalized.includes(word)) {
      return '이 핸들은 사용할 수 없습니다.';
    }
  }

  return null;
}
