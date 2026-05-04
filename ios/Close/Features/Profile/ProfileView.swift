import SwiftUI

struct ProfileView: View {
    @Environment(AppRouter.self) private var router

    private let columns = [GridItem(.flexible(), spacing: 8),
                           GridItem(.flexible(), spacing: 8),
                           GridItem(.flexible(), spacing: 8)]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 0) {
                    headerRow
                        .padding(.horizontal, 24)
                        .padding(.top, 8)
                        .padding(.bottom, 16)

                    profileCard
                        .padding(.horizontal, 16)
                        .padding(.bottom, 16)

                    premiumCard
                        .padding(.horizontal, 16)
                        .padding(.bottom, 22)

                    SectionHeader(title: "Photos", meta: nil) {
                        Button {} label: {
                            Text("+ Add")
                                .font(.system(size: 13, weight: .heavy))
                                .foregroundStyle(Brand.blue)
                        }
                        .buttonStyle(.plain)
                    }
                    .padding(.bottom, 12)

                    LazyVGrid(columns: columns, spacing: 8) {
                        ForEach(Array(MockData.me.photoColors.enumerated()), id: \.offset) { i, color in
                            color
                                .aspectRatio(1, contentMode: .fill)
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
                    .padding(.bottom, 18)

                    SectionHeader("Pinned by others", meta: "\(MockData.pinsForMe.count) this month")
                        .padding(.bottom, 12)

                    ForEach(MockData.pinsForMe) { pin in
                        if let tag = MockData.vibeTag(pin.vibeTagId) {
                            pinCard(pin: pin, tag: tag)
                                .padding(.horizontal, 16)
                                .padding(.bottom, 8)
                        }
                    }

                    SectionHeader("Your top vibes")
                        .padding(.top, 12)
                        .padding(.bottom, 12)

                    HStack(spacing: 8) {
                        ForEach(MockData.me.topVibeIds, id: \.self) { vid in
                            if let tag = MockData.vibeTag(vid) {
                                topVibeCard(tag: tag, count: Int.random(in: 3...10))
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 22)

                    SectionHeader("Settings")
                        .padding(.bottom, 12)

                    settingsCard
                        .padding(.horizontal, 16)

                    Text("CLOSE v1.0 · made with espresso in Milan")
                        .font(.system(size: 11))
                        .foregroundStyle(Brand.textSecondary)
                        .padding(.top, 8)
                }
                .padding(.bottom, 32)
            }
            .background(Brand.background.ignoresSafeArea())
        }
    }

    private var headerRow: some View {
        HStack {
            Text("You")
                .font(.system(size: 32, weight: .heavy))
                .foregroundStyle(Brand.dark)
            Spacer()
            iconButton(systemName: "bolt.fill", color: Brand.orange) {
                router.present(.rate(targetId: "me"))
            }
            iconButton(systemName: "gearshape.fill", color: Brand.textSecondary) {}
        }
    }

    private func iconButton(systemName: String, color: Color, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: systemName)
                .font(.system(size: 16, weight: .semibold))
                .foregroundStyle(color)
                .frame(width: 38, height: 38)
                .background(Brand.card, in: Circle())
                .brandShadow()
        }
        .buttonStyle(.plain)
    }

    private var profileCard: some View {
        VStack(spacing: 0) {
            ZStack(alignment: .bottomTrailing) {
                Circle()
                    .fill(Brand.blue)
                    .frame(width: 88, height: 88)
                    .overlay(
                        Text(MockData.me.initials)
                            .font(.system(size: 30, weight: .heavy))
                            .foregroundStyle(.white)
                    )
                    .shadow(color: Brand.blue.opacity(0.35), radius: 14, y: 6)
                Circle().fill(Brand.success)
                    .frame(width: 18, height: 18)
                    .overlay(Circle().stroke(Brand.card, lineWidth: 3))
            }
            .padding(.bottom, 14)

            Text(MockData.me.name)
                .font(.system(size: 22, weight: .heavy))
                .foregroundStyle(Brand.dark)
            Text("\(MockData.me.age) · \(MockData.me.starSign) · \(MockData.me.city)")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(Brand.textSecondary)
                .padding(.top, 2)
            Text(MockData.me.bio)
                .font(.system(size: 14))
                .foregroundStyle(Brand.dark)
                .multilineTextAlignment(.center)
                .padding(.top, 12)
                .padding(.horizontal, 4)

            Divider().background(Brand.border).padding(.vertical, 18)

            HStack(spacing: 0) {
                stat(label: "People met", value: "\(MockData.me.peopleMet)", color: Brand.blue)
                divider
                stat(label: "Connections", value: "\(MockData.me.activeConnections)", color: Brand.success)
                divider
                stat(label: "Nights out", value: "\(MockData.me.nightsOut)", color: Brand.orange)
                divider
                stat(label: "Vibe", value: String(format: "%.1f", MockData.me.avgVibe), color: Brand.warning)
            }

            Button {} label: {
                HStack(spacing: 6) {
                    Image(systemName: "pencil")
                        .font(.system(size: 12, weight: .bold))
                    Text("Edit profile")
                        .font(.system(size: 13, weight: .heavy))
                }
                .foregroundStyle(Brand.dark)
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(Brand.background, in: Capsule())
            }
            .buttonStyle(.plain)
            .padding(.top, 18)
        }
        .padding(22)
        .background(Brand.card, in: RoundedRectangle(cornerRadius: 22))
        .brandShadow(strong: true)
    }

    private var divider: some View { Rectangle().fill(Brand.border).frame(width: 1) }

    private func stat(label: String, value: String, color: Color) -> some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.system(size: 18, weight: .heavy))
                .foregroundStyle(color)
            Text(label)
                .font(.system(size: 10, weight: .heavy))
                .foregroundStyle(Brand.textSecondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
    }

    private var premiumCard: some View {
        Button { router.present(.premium) } label: {
            HStack(spacing: 12) {
                Image(systemName: "bolt.fill")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundStyle(.white)
                    .frame(width: 44, height: 44)
                    .background(Color.white.opacity(0.2), in: Circle())
                VStack(alignment: .leading, spacing: 2) {
                    Text("Close Plus")
                        .font(.system(size: 16, weight: .black))
                        .foregroundStyle(.white)
                    Text("See who waved · go invisible · unlock other cities")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(.white.opacity(0.9))
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .foregroundStyle(.white.opacity(0.7))
            }
            .padding(16)
            .background(Brand.orange, in: RoundedRectangle(cornerRadius: 18))
            .shadow(color: Brand.orange.opacity(0.3), radius: 12, y: 6)
        }
        .buttonStyle(.plain)
    }

    private func pinCard(pin: RatingPin, tag: VibeTag) -> some View {
        let author = MockData.person(pin.authorId)
        return HStack(alignment: .top, spacing: 12) {
            Image(systemName: tag.symbol)
                .font(.system(size: 18))
                .foregroundStyle(tag.color)
                .frame(width: 40, height: 40)
                .background(tag.color.opacity(0.15), in: Circle())
            VStack(alignment: .leading, spacing: 2) {
                Text(tag.label)
                    .font(.system(size: 14, weight: .heavy))
                    .foregroundStyle(Brand.dark)
                Text("by \(author?.name ?? "Someone") · \(pin.date)")
                    .font(.system(size: 11, weight: .semibold))
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

    private func topVibeCard(tag: VibeTag, count: Int) -> some View {
        VStack(spacing: 4) {
            Image(systemName: tag.symbol)
                .font(.system(size: 20))
                .foregroundStyle(tag.color)
            Text(tag.label)
                .font(.system(size: 11, weight: .heavy))
                .foregroundStyle(tag.color)
                .multilineTextAlignment(.center)
                .lineLimit(2)
            Text("\(count) pins")
                .font(.system(size: 10, weight: .semibold))
                .foregroundStyle(Brand.textSecondary)
        }
        .padding(.vertical, 14)
        .padding(.horizontal, 4)
        .frame(maxWidth: .infinity)
        .background(tag.color.opacity(0.1), in: RoundedRectangle(cornerRadius: 14))
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(tag.color.opacity(0.3), lineWidth: 1)
        )
    }

    private var settingsCard: some View {
        VStack(spacing: 0) {
            row(icon: "dot.radiowaves.left.and.right", label: "Bluetooth discovery", trailing: "On")
            row(icon: "wave.3.right", label: "Nearby Interaction", trailing: "On")
            row(icon: "eye.slash.fill", label: "Go invisible", trailing: "Plus")
            row(icon: "bell.fill", label: "Notifications")
            row(icon: "shield.fill", label: "Who can see you", trailing: "Connections")
            row(icon: "nosign", label: "Blocked profiles")
            row(icon: "questionmark.circle", label: "Help & support")
            row(icon: "info.circle", label: "About Close", isLast: true)
        }
        .background(Brand.card, in: RoundedRectangle(cornerRadius: 16))
        .brandShadow()
    }

    private func row(icon: String, label: String, trailing: String? = nil, isLast: Bool = false) -> some View {
        VStack(spacing: 0) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 15))
                    .foregroundStyle(Brand.textSecondary)
                    .frame(width: 22)
                Text(label)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(Brand.dark)
                Spacer()
                if let trailing {
                    Text(trailing)
                        .font(.system(size: 12, weight: .heavy))
                        .foregroundStyle(Brand.textSecondary)
                }
                Image(systemName: "chevron.right")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundStyle(Brand.border)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            if !isLast {
                Divider().background(Brand.border)
            }
        }
    }
}
