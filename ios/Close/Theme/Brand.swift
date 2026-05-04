import SwiftUI

extension Color {
    init(hex: UInt32, alpha: Double = 1.0) {
        let r = Double((hex >> 16) & 0xFF) / 255.0
        let g = Double((hex >> 8) & 0xFF) / 255.0
        let b = Double(hex & 0xFF) / 255.0
        self.init(.sRGB, red: r, green: g, blue: b, opacity: alpha)
    }
}

enum Brand {
    static let blue            = Color(hex: 0x4A7CFF)
    static let orange          = Color(hex: 0xFF6B35)
    static let background      = Color(hex: 0xF8F9FC)
    static let dark            = Color(hex: 0x0D1117)
    static let textSecondary   = Color(hex: 0x8B8FA3)
    static let card            = Color.white
    static let success         = Color(hex: 0x34C759)
    static let warning         = Color(hex: 0xFFB800)
    static let fading          = Color(hex: 0xFFB347)
    static let danger          = Color(hex: 0xFF3B30)
    static let border          = Color(hex: 0xE8EAF0)
    static let purple          = Color(hex: 0x7C5CFF)
    static let pink            = Color(hex: 0xFF66A1)
}

extension View {
    func brandShadow(strong: Bool = false) -> some View {
        shadow(
            color: .black.opacity(strong ? 0.10 : 0.06),
            radius: strong ? 14 : 8,
            x: 0,
            y: strong ? 4 : 2
        )
    }
}
