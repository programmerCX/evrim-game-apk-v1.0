# Mobile QA Checklist

## Samsung S24 Ultra / Android testleri

- [ ] Uygulama dikey modda açılıyor.
- [ ] Safe-area / kamera deliği / status bar içerik üstüne binmiyor.
- [ ] Tap alanında gecikme hissedilmiyor.
- [ ] Çift dokunma keşif sistemi çalışıyor.
- [ ] GP yeterli değilken doğru uyarı veriliyor.
- [ ] Combo x10, x50, x100 davranışı stabil.
- [ ] Arka plana atıp geri dönünce kayıt korunuyor.
- [ ] Ekran kapalı/açık döngüsünde oyun state'i bozulmuyor.
- [ ] Uygulama yeniden başlatılınca save yükleniyor.
- [ ] Uzun oynanışta aşırı ısınma veya frame drop gözlenmiyor.
- [ ] Android geri tuşu yanlışlıkla oyundan çıkarmıyor veya beklenen davranışı veriyor.

## Build kontrolleri

- [ ] `npm run validate:source` başarılı.
- [ ] `npm run build` başarılı.
- [ ] `npm run cap:sync` başarılı.
- [ ] Android Studio Gradle sync başarılı.
- [ ] Debug APK cihazda kuruluyor.
