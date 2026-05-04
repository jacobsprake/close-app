import SwiftUI

// MARK: - Vibe tags

struct VibeTag: Identifiable, Hashable, Sendable {
    let id: String
    let label: String
    let symbol: String   // SF Symbol name
    let color: Color
}

// MARK: - People

enum ProximitySignal: String, Sendable {
    case bluetooth, nearby, gps
    var symbol: String {
        switch self {
        case .bluetooth: return "dot.radiowaves.left.and.right"
        case .nearby:    return "wave.3.right"
        case .gps:       return "location.fill"
        }
    }
}

struct NearbyPerson: Identifiable, Hashable, Sendable {
    let id: String
    var name: String
    var age: Int
    var role: String
    var bio: String
    var distanceLabel: String
    var signal: ProximitySignal
    var photoColor: Color
    var photoColors: [Color]
    var vibeTagIds: [String]
    var topVibeId: String?
    var starSign: String?
    var city: String
    var mutualConnections: Int
    var nightVibe: Double          // 1–5
    var nightsRated: Int
    var isHere: Bool
    var appearedMinsAgo: Int
    var isConnected: Bool
}

// MARK: - Plans

enum PlanVibe: String, CaseIterable, Sendable {
    case chill, classy, rowdy, random
    var label: String {
        switch self {
        case .chill: return "Chill"
        case .classy: return "Classy"
        case .rowdy: return "Rowdy"
        case .random: return "Random"
        }
    }
    var emoji: String {
        switch self {
        case .chill: return "🌿"
        case .classy: return "🍷"
        case .rowdy: return "🔥"
        case .random: return "🎲"
        }
    }
    var color: Color {
        switch self {
        case .chill: return Brand.success
        case .classy: return Brand.purple
        case .rowdy: return Brand.danger
        case .random: return Brand.warning
        }
    }
}

struct Plan: Identifiable, Hashable, Sendable {
    let id: String
    var emoji: String
    var title: String
    var spot: String
    var neighborhood: String
    var startsAt: String
    var hostId: String
    var goingIds: [String]
    var maybeIds: [String]
    var capacity: Int
    var vibe: PlanVibe
    var description: String
}

// MARK: - Chat / pins / hotspots

struct ChatReaction: Hashable, Sendable {
    let emoji: String
    let count: Int
}

struct ChatMessage: Identifiable, Hashable, Sendable {
    let id: String
    let authorId: String
    let text: String
    let timeAgo: String
    var reactions: [ChatReaction]
    var pinned: Bool
}

struct RatingPin: Identifiable, Hashable, Sendable {
    let id: String
    let authorId: String
    let targetId: String
    let vibeTagId: String
    var note: String?
    let date: String
}

struct Hotspot: Identifiable, Hashable, Sendable {
    enum Trend: Sendable { case up, down, same }
    let id: String
    let name: String
    let encounters: Int
    let trend: Trend
    let x: CGFloat   // 0…1
    let y: CGFloat   // 0…1
    let radius: CGFloat
    let intensity: Double
}

// MARK: - Me

struct Me: Sendable {
    let id: String
    let name: String
    let initials: String
    let age: Int
    let role: String
    let bio: String
    let city: String
    let starSign: String
    let photoColors: [Color]
    let topVibeIds: [String]
    let peopleMet: Int
    let activeConnections: Int
    let nightsOut: Int
    let avgVibe: Double
}
