const CACHE_NAME = 'lira24-v1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './assets/icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 📌 التعديل يبدأ هنا

  // يجب استبدال 'your-supabase-domain.co' و 'currency_rates_api_host' بأسماء النطاقات الفعلية التي تجلب منها بيانات الأسعار.
  // عادةً ما يكون نطاق Supabase مشابهاً لـ xxxxx.supabase.co
  // يمكنك إضافة أي نطاق API آخر تستخدمه لجلب الذهب أو العملات.
  if (url.hostname.includes('supabase.co') || url.hostname.includes('currency_rates_api_host')) {
    // استراتيجية Network-Only: اذهب للشبكة مباشرةً لضمان جلب أحدث الأسعار
    // هذا يحل مشكلة تصفير النسبة المئوية في الـ PWA
    return event.respondWith(fetch(event.request));
  }
  
  // استراتيجية Cache-First: للأصول الثابتة (مثل index.html والملفات المحلية)
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
