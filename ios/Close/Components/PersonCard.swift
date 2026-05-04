import SwiftUI

struct PersonCard: View {
    let person: NearbyPerson
    @State private var waved: Bool = false
    @Binding var path: NavigationPath

    var body: some View {
        Button {
            path.append(Route.person(person.id))
        } label: {
            content
        }
        .buttonStyle(.plain)
        .padding(14)
        .background(Brand.card, in: RoundedRectangle(cornerRadius: 18))
        .brandShadow()
        .padding(.horizontal, 16)
    }

    var content: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 12) {
                AvatarBubble(
                    initials: initials(person.name),
                    color: person.photoColor,
                    size: 56,
                    live: person.isHere
                )
                VStack(alignment: .leading, spacing: 1) {
                    HStack(spacing: 4) {
                        Text(person.name)
                            .font(.system(size: 16, weight: .heavy))
                            .foregroundStyle(Brand.dark)
                        Text("· \(person.age)")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(Brand.textSecondary)
                    }
                    Text(person.role)
                        .font(.system(size: 13))
                        .foregroundStyle(Brand.textSecondary)
                        .lineLimit(1)
                    HStack(spacing: 4) {
                        Image(systemName: person.signal.symbol)
                            .font(.system(size: 10))
                            .foregroundStyle(Brand.blue)
                        Text(person.distanceLabel)
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundStyle(Brand.textSecondary)
                        if person.mutualConnections > 0 {
                            Circle().fill(Brand.border).frame(width: 3, height: 3)
                            Image(systemName: "person.2.fill")
                                .font(.system(size: 10))
                                .foregroundStyle(Brand.textSecondary)
                            Text("\(person.mutualConnections) mutual")
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundStyle(Brand.textSecondary)
                        }
                    }
                    .padding(.top, 2)
                }
                Spacer()
                Button {
                    withAnimation(.spring(duration: 0.3)) { waved.toggle() }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: waved ? "checkmark" : "hand.wave.fill")
                            .font(.system(size: 12, weight: .bold))
                        Text(waved ? "Sent" : "Wave")
                            .font(.system(size: 12, weight: .heavy))
                    }
                    .foregroundStyle(waved ? Brand.success : Brand.blue)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(
                        (waved ? Brand.success : Brand.blue).opacity(0.12),
                        in: RoundedRectangle(cornerRadius: 16)
                    )
                }
                .buttonStyle(.plain)
            }

            // Vibe tags
            if !person.vibeTagIds.isEmpty {
                HStack(spacing: 6) {
                    ForEach(person.vibeTagIds.prefix(3), id: \.self) { id in
                        if let tag = MockData.vibeTag(id) {
                            VibeChip(tag: tag, mini: true)
                        }
                    }
                }
            }

            Divider().background(Brand.border)

            HStack {
                StarVibe(rating: person.nightVibe, nights: person.nightsRated)
                Spacer()
                if person.isConnected {
                    HStack(spacing: 4) {
                        Image(systemName: "checkmark")
                            .font(.system(size: 9, weight: .bold))
                        Text("Connected")
                            .font(.system(size: 10, weight: .heavy))
                    }
                    .foregroundStyle(Brand.success)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Brand.success.opacity(0.1), in: RoundedRectangle(cornerRadius: 10))
                }
            }
        }
    }
}

func initials(_ name: String) -> String {
    name.split(separator: " ")
        .compactMap(\.first)
        .map(String.init)
        .joined()
}
