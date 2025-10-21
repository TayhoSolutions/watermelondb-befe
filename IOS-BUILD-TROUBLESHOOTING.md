# iOS Build - Troubleshooting

## Problem: Xcode Build startet nicht automatisch

Der `npx expo run:ios` Befehl hängt manchmal nach der CocoaPods Installation.

## Lösung: Manueller Start

### Option 1: Metro Bundler + Xcode (Empfohlen)

```bash
# Terminal 1: Starte Metro Bundler
cd mobile
npx expo start --dev-client

# Terminal 2: Öffne Xcode und starte den Build
cd mobile/ios
open mobile.xcworkspace
```

Dann in Xcode:

1. Wähle ein Zielgerät: **Product > Destination > iPhone 16 (oder ein anderer Simulator)**
2. Drücke **⌘R** (Cmd+R) zum Bauen und Starten

### Option 2: Komplett über Xcode

```bash
cd mobile/ios
open mobile.xcworkspace
```

Dann in Xcode:

1. Wähle Scheme: **mobile**
2. Wähle Destination: **iPhone 16** (oder anderer Simulator)
3. **Product > Run** (oder **⌘R**)

### Option 3: Terminal Build

```bash
cd mobile

# Liste verfügbare Simulatoren
xcrun simctl list devices available

# Starte spezifischen Simulator
xcrun simctl boot "iPhone 16"

# Baue und installiere
xcodebuild -workspace ios/mobile.xcworkspace \
  -scheme mobile \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 16' \
  build

# Starte Metro Bundler
npx expo start --dev-client
```

## Nach erfolgreichem ersten Build

Danach können Sie normal entwickeln:

```bash
cd mobile
npm start

# Oder vom Root
npm run mobile
```

Dann im Metro Bundler:

-   Drücke **`i`** für iOS Simulator
-   Die App sollte automatisch starten

## Häufige Fehler

### 1. "node_modules not found"

**Problem**: CocoaPods sucht im falschen Verzeichnis

**Lösung**:

```bash
# Im Root installieren (für Workspaces)
cd /Users/renebedbur/Dev/watermelondb
npm install --legacy-peer-deps

# Im mobile installieren
cd mobile
npm install --legacy-peer-deps
```

### 2. "Unable to boot device"

**Problem**: Simulator läuft nicht

**Lösung**:

```bash
# Öffne Simulator App
open -a Simulator

# Oder starte spezifischen Simulator
xcrun simctl boot "iPhone 16"
```

### 3. "Build failed" wegen Privacy Bundles

**Problem**: React Native Privacy Dateien fehlen

**Lösung**:

```bash
cd mobile
rm -rf ios/build
rm -rf ios/Pods
pod install --project-directory=ios
```

## Aktueller Status

✅ CocoaPods installiert
✅ Xcode Workspace erstellt
✅ Dependencies installiert
⏳ Warte auf manuellen Xcode Build

## Nächster Schritt

**Empfehlung**: Öffnen Sie Xcode und starten Sie den Build manuell:

```bash
cd /Users/renebedbur/Dev/watermelondb/mobile/ios
open mobile.xcworkspace
```

Dann in Xcode: **⌘R** drücken
