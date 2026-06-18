/* にこっと乗るだけ7 デジタルパンフレット — オフライン対応 Service Worker */
const CACHE='nikotto7-v2';
const ASSETS=[
  './',
  'index.html',
  'manifest.json',
  'assets/cover.png',
  'assets/logo.png',
  'assets/character1.png',
  'assets/president.jpg',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/apple-touch-icon.png',
  'assets/cars/teigaku1_car1.jpg',
  'assets/cars/teigaku1_car2.jpg',
  'assets/cars/teigaku1_car3.jpg',
  'assets/cars/teigaku1_car4.jpg',
  'assets/cars/teigaku1_car5.jpg',
  'assets/cars/teigaku1_car6.jpg',
  'assets/cars/teigaku2_car1.jpg',
  'assets/cars/teigaku2_car2.jpg',
  'assets/cars/teigaku2_car3.jpg',
  'assets/cars/teigaku2_car4.jpg',
  'assets/cars/teigaku2_car5.jpg',
  'assets/cars/teigaku2_car6.jpg',
  'assets/cars/teigaku3_car1.jpg',
  'assets/cars/teigaku3_car2.jpg',
  'assets/cars/teigaku3_car3.jpg',
  'assets/cars/teigaku3_car4.jpg',
  'assets/cars/teigaku3_car5.jpg',
  'assets/cars/teigaku3_car6.jpg'
];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==location.origin)return; // 外部リンク(店舗サイト等)はそのまま
  e.respondWith(
    caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req).then(res=>{
      const copy=res.clone();
      caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});
      return res;
    }).catch(()=>caches.match('index.html')))
  );
});
