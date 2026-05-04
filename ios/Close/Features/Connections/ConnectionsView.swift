import SwiftUI

struct ConnectionsView: View {
    @Environment(AppRouter.self) private var router
    @State private var path = NavigationPath()

    private var connections: [NearbyPerson] {
        MockData.nearbyPeople.filter { $0.isConnected || $0.nightsRated >= 3 }
    }

    private var totalNights: Int { connections.reduce(0) { $0 + $1.nightsRated } }
    private var avgVibe: Double {
        guard !connections.isEmpty else { return 0 }
        return connections.reduce(0) { $0 + $1.nightVibe } / Double(connections.count)
    }

    var body: some View {
        NavigationStack(path: $path) {
            ScrollView {
                VStack(spacing: 0) {
                    header

                    HStack(spacing: 8) {
                        statCard(value: "\(connections.count)", label: "Connections", color: Brand.blue)
                        statCard(value: String(format: "%.1f", avgVibe), label: "Avg vibe", color: Brand.warning)
                        statCard(value: "\(totalNights)", label: "Nights out", color: Brand.success)
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 20)

                    LazyVStack(spacing: 10) {
                        ForEach(connections) { person in
                            ConnectionRow(person: person, path: $path)
                                .padding(.horizontal, 16)
                        }
                    }

                    HStack(alignment: .top, spacing: 8) {
                        Image(systemName: "info.circle")
                            .foregroundStyle(Brand.textSecondary)
                        Text("Connections fade after 30 days without an encounter or shared night out. Real life keeps them alive.")
                            .font(.system(size: 12))
                            .foregroundStyle(Brand.textSecondary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    .padding(14)
                    .background(Brand.blue.opacity(0.06), in: RoundedRectangle(cornerRadius: 12))
                    .padding(.horizontal, 16)
                    .padding(.top, 8)
                }
                .padding(.bottom, 32)
            }
            .background(Brand.background.ignoresSafeArea())
            .navigationDestination(for: Route.self) { route in
                switch route {
                case .person(let id):
                    if let p = MockData.person(id) {
                        PersonDetailView(person: p, path: $path)
                    }
                }
            }
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text("Your circle")
                .font(.system(size: 32, weight: .heavy))
                .foregroundStyle(Brand.dark)
            Text("People you've actually been around")
                .font(.system(size: 13))
                .foregroundStyle(Brand.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 24)
        .padding(.top, 8)
        .padding(.bottom, 16)
    }

    private func statCard(value: String, label: String, color: Color) -> some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.system(size: 24, weight: .heavy))
                .foregroundStyle(color)
            Text(label)
                .font(.system(size: 11, weight: .heavy))
                .foregroundStyle(Brand.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 14)
        .background(Brand.card, in: RoundedRectangle(cornerRadius: 14))
        .brandShadow()
    }
}

private struct ConnectionRow: View {
    let person: NearbyPerson
    @Binding var path: NavigationPath
    @Environment(AppRouter.self) private var router

    private var encounters: Int { person.nightsRated * 2 + person.mutualConnections }

    private var strength: (label: String, color: Color, bars: Int) {
        if encounters >= 10 { return ("Strong", Brand.blue, 4) }
        if encounters >= 6  { return ("Growing", Brand.success, 3) }
        if encounters >= 3  { return ("Building", Brand.warning, 2) }
        return ("New", Brand.textSecondary, 1)
    }

    var body: some View {
        Button { path.append(Route.person(person.id)) } label: {
            VStack(alignment: .leading, spacing: 0) {
                HStack(spacing: 12) {
                    AvatarBubble(initials: initials(person.name), color: person.photoColor, size: 48)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(person.name)
                            .font(.system(size: 16, weight: .heavy))
                            .foregroundStyle(Brand.dark)
                        Text(person.role)
                            .font(.system(size: 12))
                            .foregroundStyle(Brand.textSecondary)
                            .lineLimit(1)
                        StarVibe(rating: person.nightVibe, nights: person.nightsRated)
                            .padding(.top, 4)
                    }
                    Spacer()
                    VStack(spacing: 3) {
                        StrengthBars(bars: strength.bars, color: strength.color)
                        Text(strength.label)
                            .font(.system(size: 10, weight: .heavy))
                            .foregroundStyle(strength.color)
                    }
                }

                if !person.vibeTagIds.isEmpty {
                    HStack(spacing: 6) {
                        ForEach(person.vibeTagIds.prefix(3), id: \.self) { vid in
                            if let tag = MockData.vibeTag(vid) {
                                VibeChip(tag: tag, mini: true)
                            }
                        }
                    }
                    .padding(.top, 12)
                }

                Divider().background(Brand.border).padding(.top, 12)

                HStack(spacing: 8) {
                    actionButton(icon: "bolt.fill", label: "Pin a vibe", color: Brand.orange) {
                        router.present(.rate(targetId: person.id))
                    }
                    actionButton(icon: "bubble.left", label: "Message", color: Brand.blue) { }
                    actionButton(icon: "calendar.badge.plus", label: "Invite out", color: Brand.success) {
                        router.present(.newPlan)
                    }
                }
                .padding(.top, 12)
            }
            .padding(16)
            .background(Brand.card, in: RoundedRectangle(cornerRadius: 16))
            .brandShadow()
        }
        .buttonStyle(.plain)
    }

    private func actionButton(icon: String, label: String, color: Color, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 5) {
                Image(systemName: icon)
                    .font(.system(size: 11))
                Text(label)
                    .font(.system(size: 11, weight: .heavy))
            }
            .foregroundStyle(color)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
            .background(Brand.background, in: RoundedRectangle(cornerRadius: 12))
        }
        .buttonStyle(.plain)
    }
}
