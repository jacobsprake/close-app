import SwiftUI

/// Type-safe navigation destinations pushed onto a `NavigationStack`.
enum Route: Hashable {
    case person(String)
}

/// Modal presentations.
enum Sheet: Identifiable {
    case newPlan
    case rate(targetId: String)
    case premium

    var id: String {
        switch self {
        case .newPlan: return "newPlan"
        case .rate(let id): return "rate-\(id)"
        case .premium: return "premium"
        }
    }
}

/// Lightweight, app-wide observable controller for the modal sheet stack.
/// Each tab manages its own NavigationStack via Route.
@Observable
final class AppRouter {
    var sheet: Sheet?

    func present(_ sheet: Sheet) { self.sheet = sheet }
    func dismiss() { sheet = nil }
}
