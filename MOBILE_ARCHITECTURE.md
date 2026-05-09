# Evrim Game — Mobil WebView/APK Mimari Notu

## Karar

İlk mobil paketleme hattı Capacitor + Android olarak seçildi.

Gerekçe:

- Mevcut React/Vite oyun kodu korunur.
- Android WebView native kabuğu Capacitor tarafından yönetilir.
- İleride status bar, splash screen, haptics, filesystem gibi native yetenekler plugin tabanlı eklenebilir.
- `dist` üretimi Android projesine kopyalanarak APK/AAB üretim hattı kurulabilir.

## Katmanlar

```text
React App.jsx
  ↓
Vite production build /dist
  ↓
Capacitor Android native shell
  ↓
Android WebView
  ↓
Debug APK / Release AAB
```

## Güvenlik kararı

İlk sürümde özel JavaScript bridge açılmayacak. Böylece `addJavascriptInterface` kaynaklı saldırı yüzeyi oluşmaz.

WebView yalnızca uygulamanın paketlenmiş yerel web assetlerini çalıştıracaktır. Harici URL yükleme, reklam SDK, uzaktan HTML veya kullanıcı tarafından sağlanan HTML bu fazda yoktur.

## Performans kararı

- DOM/CSS animasyonları korunur.
- Canvas/Pixi.js geçişi şimdilik yapılmaz.
- Combo/tap sistemi React state yerine mümkün olduğunca ref/eşik mantığıyla sınırlandırılır.
- Android tarafında ilk test hedefi 60 FPS hissiyatı, gecikmesiz tap ve dikey ekran stabilitesidir.

## Sonraki mühendislik adımları

1. `src/App.jsx` daha küçük modüllere ayrılacak.
2. Oyun verisi `/src/data` altına taşınacak.
3. Validator servisleri `/src/engine` altına alınacak.
4. Save sistemi IndexedDB hazırlığına taşınacak.
5. Android release signing ve AAB pipeline kurulacak.
