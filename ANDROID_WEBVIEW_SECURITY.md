# Android WebView Güvenlik Notları

## Bu fazdaki karar

Özel native JavaScript bridge açılmayacak. Bu nedenle `addJavascriptInterface` kullanılmayacak.

## Temel kurallar

1. Paketlenmiş local asset dışında HTML yükleme.
2. Harici URL gerekiyorsa WebView içinde değil, sistem tarayıcısında aç.
3. `allowMixedContent` kapalı kalmalı.
4. Cleartext HTTP trafiği kapalı olmalı.
5. Debug build dışında WebView debugging kapalı olmalı.
6. Kullanıcı tarafından sağlanan HTML/JS asla WebView içinde çalıştırılmamalı.

## Native WebView kullanılacaksa önerilen ayarlar

```kotlin
webView.settings.javaScriptEnabled = true
webView.settings.domStorageEnabled = true
webView.settings.allowFileAccess = false
webView.settings.allowContentAccess = false
webView.settings.allowFileAccessFromFileURLs = false
webView.settings.allowUniversalAccessFromFileURLs = false
WebView.setWebContentsDebuggingEnabled(false)
```

Bu ayarlar, uygulamanın kendi React bundle'ını çalıştırmak için JavaScript'i açık bırakır; ancak dosya erişimi ve debug yüzeyini sınırlar.
