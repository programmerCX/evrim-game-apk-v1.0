# Evrim Game Mobile WebView Package

Bu paket, `evrim-game.v2-stable.jsx` sürümünün mobil WebView/APK hazırlık projesidir.

## İçerik

```text
src/App.jsx                         Ana oyun dosyası
src/main.jsx                        React mount dosyası
src/styles.css                      Mobil WebView CSS izolasyonu
vite.config.js                      Vite production build ayarı
capacitor.config.ts                 Android Capacitor ayarı
docs/APK_BUILD_GUIDE.md             APK üretim komutları
docs/MOBILE_ARCHITECTURE.md         Mimari karar notu
docs/ANDROID_WEBVIEW_SECURITY.md    WebView güvenlik notları
docs/MOBILE_QA_CHECKLIST.md         Test kontrol listesi
```

## İlk çalışma

```bash
npm install
npm run validate:source
npm run dev
```

## APK hazırlığı

```bash
npm run build
npm run cap:add:android
npm run cap:sync
npm run cap:open
```

Android Studio açıldıktan sonra:

```text
Build > Build Bundle(s) / APK(s) > Build APK(s)
```

## Not

Bu paket henüz release imzalı APK üretmez. İlk hedef debug APK ve cihaz testidir. Release keystore, AAB ve mağaza hazırlığı sonraki fazdır.
