# APK Build Guide — Evrim Game

## Gereksinimler

- Node.js 20.19 veya üzeri
- npm
- Android Studio
- Android SDK
- JDK 17 veya Android Studio'nun önerdiği JDK

## 1. Bağımlılıkları kur

```bash
npm install
```

## 2. Web sürümünü test et

```bash
npm run dev
```

Telefonla aynı ağdaysan, bilgisayar IP adresini kullanarak test edebilirsin:

```text
http://BILGISAYAR_IP:5173
```

## 3. Production web build al

```bash
npm run build
```

Çıktı:

```text
dist/
```

## 4. Android projesini oluştur

İlk defa yapılacaksa:

```bash
npm run cap:add:android
```

## 5. Android'e web çıktısını senkronize et

```bash
npm run cap:sync
```

## 6. Android Studio'da aç

```bash
npm run cap:open
```

Android Studio içinde:

```text
Build > Build Bundle(s) / APK(s) > Build APK(s)
```

## 7. Komut satırından debug APK üret

macOS/Linux:

```bash
npm run android:debug-apk:mac-linux
```

Windows:

```powershell
npm run android:debug-apk:windows
```

Debug APK tipik olarak şu yolda oluşur:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Release notu

Google Play dağıtımı için APK yerine AAB tercih edilmelidir. Release imzalama, keystore yönetimi ve ProGuard/R8 ayarları sonraki fazda ayrı yapılacaktır.
