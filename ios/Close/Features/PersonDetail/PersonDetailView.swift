import SwiftUI

struct PersonDetailView: View {
    let person: NearbyPerson
    @Binding var path: NavigationPath
    @Environment(AppRouter.self) private var router
    @State private var waved: Bool = false

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                hero
                identityCard
                    .padding(.horizontal, 16)
                    .padding(.top, -28)

                SectionHeader("How others see them")
                    .padding(.top, 24)
                    .padding(.bottom, 12)

                FlowLayout(spacing: 8) {
                    ForEach(Array(person.vibeTagIds.enumerated()), id: \.offset) { i, vid in
                        if let tag = MockData.vibeTag(vid) {
                            VibeChip(tag: tag, count: 3 + ((person.id.hashValue + i) % 9 + 9) % 9)
                        }
                    }
                }
                .padding(.horizontal, 16)

                SectionHeader("Photos")
                    .padding(.top, 24)
                    .padding(.bottom, 12)

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(Array(person.photoColors.enumerated()), id: \.offset) { i, color in
                            color
                                .frame(width: 130, height: 170)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                                .overlay(alignment: .bottomLeading) {
                                    Text("\(i + 1)")
                                        .font(.system(size: 11, weight: .heavy))
                                        .foregroundStyle(.white.opacity(0.85))
                                        .padding(10)
                                }
                        }
                    }
                    .padding(.horizontal, 16)
                }

                SectionHeader("Recent pins")
                    .padding(.top, 24)
                    .padding(.bottom, 12)

                ForEach(MockData.pinsForMe.prefix(2)) { pin in
                    if let tag = MockData.vibeTag(pin.vibeTagId) {
                        recentPin(pin: pin, tag: tag)
                            .padding(.horizontal, 16)
                            .padding(.bottom, 8)
                    }
                }

                HStack(spacing: 16) {
                    dangerLink(icon: "flag", label: "Report")
                    dangerLink(icon: "nosign", label: "Block")
                }
                .padding(.top, 24)
            }
            .padding(.bottom, 32)
        }
        .background(Brand.background.ignoresSafeArea())
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {} label: {
                    Image(systemName: "ellipsis")
                        .foregroundStyle(.white)
                }
            }
        }
        .toolbarBackground(.hidden, for: .navigationBar)
        .navigationBarTitleDisplayMode(.inline)
    }

    private var hero: some View {
        ZStack {
            person.photoColor
            Color.black.opacity(0.18)
            Text(initials(person.name))
                .font(.system(size: 96, weight: .heavy))
                .foregroundStyle(.white.opacity(0.85))
                .tracking(4)

            VStack {
                Spacer()
                if person.isHere {
                    HStack(spacing: 6) {
                        Circle().fill(Brand.success).frame(width: 7, height: 7)
                        Text("HERE NOW · \(person.distanceLabel.uppercased())")
                            .font(.system(size: 10, weight: .heavy))
                            .tracking(1)
                            .foregroundStyle(.white)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color.black.opacity(0.45), in: Capsule())
                    .padding(.bottom, 18)
                }
            }
        }
        .frame(height: 320)
    }

    private var identityCard: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(person.name), \(person.age)")
                        .font(.system(size: 22, weight: .heavy))
                        .foregroundStyle(Brand.dark)
                    Text(person.role)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(Brand.dark)
                    Text(metaLine)
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(Brand.textSecondary)
                        .padding(.top, 4)
                }
                Spacer()
                VStack(spacing: 0) {
                    Text(String(format: "%.1f", person.nightVibe))
                        .font(.system(size: 16, weight: .black))
                        .foregroundStyle(Brand.warning)
                    Text("VIBE")
                        .font(.system(size: 9, weight: .heavy))
                        .tracking(1)
                        .foregroundStyle(Brand.warning)
                }
                .frame(width: 56, height: 56)
                .background(Brand.warning.opacity(0.12), in: Circle())
                .overlay(Circle().stroke(Brand.warning.opacity(0.4), lineWidth: 2))
            }

            Text(person.bio)
                .font(.system(size: 14))
                .foregroundStyle(Brand.dark)
                .padding(.top, 14)

            HStack(spacing: 8) {
                Button {
                    waved = true
                } label: {
                    HStack(spacing: 8) {
                        Image(systemName: waved ? "checkmark" : "hand.wave.fill")
                            .font(.system(size: 14, weight: .bold))
                        Text(waved ? "Wave sent" : "Send a wave")
                            .font(.system(size: 14, weight: .heavy))
                    }
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(waved ? Brand.success : Brand.blue, in: RoundedRectangle(cornerRadius: 14))
                    .shadow(color: (waved ? Brand.success : Brand.blue).opacity(0.3), radius: 8, y: 4)
                }
                .buttonStyle(.plain)

                Button { router.present(.newPlan) } label: {
                    Image(systemName: "calendar.badge.plus")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundStyle(Brand.blue)
                        .frame(width: 46, height: 46)
                        .background(Brand.background, in: RoundedRectangle(cornerRadius: 14))
                }
                .buttonStyle(.plain)

                Button { router.present(.rate(targetId: person.id)) } label: {
                    Image(systemName: "bolt.fill")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundStyle(Brand.orange)
                        .frame(width: 46, height: 46)
                        .background(Brand.background, in: RoundedRectangle(cornerRadius: 14))
                }
                .buttonStyle(.plain)
            }
            .padding(.top, 16)
        }
        .padding(18)
        .background(Brand.card, in: RoundedRectangle(cornerRadius: 22))
        .brandShadow(strong: true)
    }

    private var metaLine: String {
        var parts: [String] = []
        if let s = person.starSign { parts.append(s) }
        parts.append(person.city)
        if person.mutualConnections > 0 {
            parts.append("\(person.mutualConnections) mutual")
        }
        return parts.joined(separator: " · ")
    }

    private func recentPin(pin: RatingPin, tag: VibeTag) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: tag.symbol)
                .font(.system(size: 16))
                .foregroundStyle(tag.color)
                .frame(width: 36, height: 36)
                .background(tag.color.opacity(0.18), in: Circle())
            VStack(alignment: .leading, spacing: 2) {
                Text(tag.label)
                    .font(.system(size: 14, weight: .heavy))
                    .foregroundStyle(Brand.dark)
                Text("pinned at a recent night out")
                    .font(.system(size: 11))
                    .foregroundStyle(Brand.textSecondary)
                if let note = pin.note {
                    Text("\u{201C}\(note)\u{201D}")
                        .font(.system(size: 13))
                        .italic()
                        .foregroundStyle(Brand.dark)
                        .padding(.top, 6)
                }
            }
            Spacer()
        }
        .padding(14)
        .background(Brand.card, in: RoundedRectangle(cornerRadius: 14))
        .brandShadow()
    }

    private func dangerLink(icon: String, label: String) -> some View {
        Button {} label: {
            HStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 11))
                Text(label)
                    .font(.system(size: 12, weight: .heavy))
            }
            .foregroundStyle(Brand.textSecondary)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
        }
        .buttonStyle(.plain)
    }
}

// Simple wrap-flow layout for variable-width chips.
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxWidth = proposal.width ?? .infinity
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rowHeight: CGFloat = 0

        for s in subviews {
            let sz = s.sizeThatFits(.unspecified)
            if x + sz.width > maxWidth {
                x = 0
                y += rowHeight + spacing
                rowHeight = 0
            }
            x += sz.width + spacing
            rowHeight = max(rowHeight, sz.height)
        }
        return CGSize(width: maxWidth, height: y + rowHeight)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX
        var y = bounds.minY
        var rowHeight: CGFloat = 0

        for s in subviews {
            let sz = s.sizeThatFits(.unspecified)
            if x + sz.width > bounds.maxX {
                x = bounds.minX
                y += rowHeight + spacing
                rowHeight = 0
            }
            s.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(sz))
            x += sz.width + spacing
            rowHeight = max(rowHeight, sz.height)
        }
    }
}
