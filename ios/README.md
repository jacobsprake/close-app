# Close (iOS)

Native SwiftUI app for Close — proximity-based social. Targets iOS 17+.

## Generate the Xcode project

The project is described in `project.yml` and generated with [XcodeGen](https://github.com/yonaskolb/XcodeGen).

```bash
brew install xcodegen
cd ios
xcodegen generate
open Close.xcodeproj
```

Then set your `DEVELOPMENT_TEAM` in the target's Signing & Capabilities tab.

## Architecture

- **SwiftUI** for all views, `NavigationStack` + `.sheet` for modals.
- **Mock data layer** in `Close/Data/MockData.swift` — swap for a real backend (Supabase / your own) when ready.
- **`ProximityService`** (`Close/Services/ProximityService.swift`) is the integration point for:
  - `CoreBluetooth` — peer discovery via BLE advertising + scanning
  - `NearbyInteraction` — UWB ranging on iPhone 11+ with U1/U2 chip
  - `MultipeerConnectivity` — fallback peer mesh
  - `CoreLocation` — coarse city detection for the city chat
- All viral mechanics (vibe tags, plan hosting, post-night rating) work locally; they need a server for cross-device persistence.

## Folder layout

```
Close/
├── CloseApp.swift               # @main entry
├── RootTabView.swift            # the 5 tabs
├── Theme/Brand.swift            # color system
├── Models/                      # data models
├── Data/MockData.swift          # demo data
├── Components/                  # shared UI bits
├── Features/
│   ├── Nearby/                  # proximity radar + nearby people
│   ├── City/                    # city chat, plans, trending vibes
│   ├── Hotspots/                # heatmap of where users gather
│   ├── Connections/             # your circle + night-out vibes
│   ├── Profile/                 # you
│   ├── PersonDetail/            # someone else's profile
│   ├── Plan/                    # host a plan
│   ├── Rate/                    # post-night vibe pin
│   └── Premium/                 # Close Plus paywall
├── Services/ProximityService.swift
└── Resources/
    ├── Info.plist
    ├── PrivacyInfo.xcprivacy
    └── Assets.xcassets
```

## App Store readiness checklist

- [x] Permission strings in `Info.plist` for Bluetooth, Location, Camera, Photos, Nearby Interaction
- [x] `PrivacyInfo.xcprivacy` declares data collection categories
- [x] `ITSAppUsesNonExemptEncryption = false` to skip export compliance
- [x] iOS 17+ deployment target
- [ ] Real signing team set
- [ ] Real app icon (placeholder asset only)
- [ ] App Store Connect listing + screenshots
- [ ] Server-side: Supabase / custom backend for persistence
- [ ] Real proximity wiring (the service is stubbed)
