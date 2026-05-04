import Foundation
import CoreBluetooth
import CoreLocation
#if canImport(NearbyInteraction)
import NearbyInteraction
#endif

/// Proximity discovery for Close.
///
/// In production this combines:
///   • CoreBluetooth — every running device advertises a Close service UUID
///     and scans for the same UUID. Manufacturer data carries the user's
///     anonymous rotating ID.
///   • Nearby Interaction (UWB) — for iPhone 11+ devices with U1/U2 chip,
///     we exchange tokens over BLE then range with centimetre accuracy.
///   • CoreLocation — coarse (city-level) location to scope the city chat.
///
/// This stub publishes mock data so the UI works in the simulator. Wire the
/// real implementation in `start()` before shipping.
@Observable
final class ProximityService: NSObject {
    /// Stable Close service UUID. Rotate user IDs, never device IDs.
    static let serviceUUID = CBUUID(string: "C10FE000-CD0F-4B7C-9F33-CC0FE000C10F")

    var nearbyPeerIds: Set<String> = []
    var bluetoothState: CBManagerState = .unknown
    var locationCity: String? = nil

    private var central: CBCentralManager?
    private var peripheral: CBPeripheralManager?
    private let location = CLLocationManager()

    override init() {
        super.init()
    }

    func start() {
        central = CBCentralManager(delegate: self, queue: .main, options: [
            CBCentralManagerOptionShowPowerAlertKey: false
        ])
        peripheral = CBPeripheralManager(delegate: self, queue: .main, options: [
            CBPeripheralManagerOptionShowPowerAlertKey: false
        ])
        location.delegate = self
        location.desiredAccuracy = kCLLocationAccuracyKilometer
        location.requestWhenInUseAuthorization()
    }

    func stop() {
        central?.stopScan()
        peripheral?.stopAdvertising()
    }
}

extension ProximityService: CBCentralManagerDelegate {
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        bluetoothState = central.state
        guard central.state == .poweredOn else { return }
        central.scanForPeripherals(
            withServices: [Self.serviceUUID],
            options: [CBCentralManagerScanOptionAllowDuplicatesKey: false]
        )
    }

    func centralManager(_ central: CBCentralManager,
                        didDiscover peripheral: CBPeripheral,
                        advertisementData: [String: Any],
                        rssi RSSI: NSNumber) {
        // In production: decode rotating user id from manufacturer data,
        // then resolve via your backend if mutually visible.
        if let data = advertisementData[CBAdvertisementDataManufacturerDataKey] as? Data,
           let id = String(data: data, encoding: .utf8) {
            nearbyPeerIds.insert(id)
        }
    }
}

extension ProximityService: CBPeripheralManagerDelegate {
    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        guard peripheral.state == .poweredOn else { return }
        peripheral.startAdvertising([
            CBAdvertisementDataServiceUUIDsKey: [Self.serviceUUID],
            CBAdvertisementDataLocalNameKey: "Close",
        ])
    }
}

extension ProximityService: CLLocationManagerDelegate {
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        if manager.authorizationStatus == .authorizedWhenInUse ||
           manager.authorizationStatus == .authorizedAlways {
            manager.requestLocation()
        }
    }

    func locationManager(_ manager: CLLocationManager,
                         didUpdateLocations locations: [CLLocation]) {
        guard let loc = locations.last else { return }
        CLGeocoder().reverseGeocodeLocation(loc) { [weak self] placemarks, _ in
            self?.locationCity = placemarks?.first?.locality
        }
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        // Silent — we'll fall back to user-selected city.
    }
}
