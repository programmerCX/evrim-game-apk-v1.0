# Doğrudan Açma Notu

Bu paket iki farklı kullanım içerir:

## 1. Hızlı önizleme

Kök dizindeki `index.html` dosyasını açın.

Bu önizleme React, ReactDOM, lucide-react ve Tailwind'i CDN üzerinden yükler. Bu yüzden internet bağlantısı gerekir.

`index.htmp` yazım hatasına karşı aynı dosyanın kopyası olarak eklendi; yine de doğru dosya adı `index.html` olmalıdır.

## 2. Production / APK yolu

Gerçek APK/WebView paketi için doğrudan dosyaya çift tıklamayın. Komutlar:

```bash
npm install
npm run build
npm run cap:add:android
npm run cap:sync
npm run cap:open
```

Android Studio'da:

```text
Build > Build Bundle(s) / APK(s) > Build APK(s)
```

## Neden eski index.html boş ekran veriyordu?

Önceki `index.html`, Vite geliştirme girişiydi:

```html
<script type="module" src="/src/main.jsx"></script>
```

Tarayıcı bu JSX dosyasını doğrudan derleyemez. Vite sunucusu veya build çıktısı gerekir.
