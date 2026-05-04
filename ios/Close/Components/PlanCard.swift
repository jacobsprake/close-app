import SwiftUI

struct PlanCard: View {
    let plan: Plan

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .top, spacing: 10) {
                Text(plan.emoji).font(.system(size: 28))
                VStack(alignment: .leading, spacing: 2) {
                    Text(plan.title)
                        .font(.system(size: 16, weight: .heavy))
                        .foregroundStyle(Brand.dark)
                        .lineLimit(1)
                    Text("\(plan.startsAt) · \(plan.neighborhood)")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(Brand.textSecondary)
                }
                Spacer()
                Text(plan.vibe.label.uppercased())
                    .font(.system(size: 11, weight: .heavy))
                    .tracking(0.5)
                    .foregroundStyle(plan.vibe.color)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(plan.vibe.color.opacity(0.12), in: RoundedRectangle(cornerRadius: 10))
            }

            HStack(spacing: 6) {
                Image(systemName: "mappin")
                    .font(.system(size: 11))
                    .foregroundStyle(Brand.textSecondary)
                Text(plan.spot)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(Brand.dark)
                    .lineLimit(1)
            }
            .padding(.top, 12)

            Text(plan.description)
                .font(.system(size: 13))
                .foregroundStyle(Brand.textSecondary)
                .lineSpacing(2)
                .padding(.top, 6)
                .lineLimit(2)

            Divider().background(Brand.border).padding(.top, 12)

            HStack(spacing: 10) {
                avatarStack
                VStack(alignment: .leading, spacing: 4) {
                    GeometryReader { geo in
                        let pct = min(Double(plan.goingIds.count) / Double(plan.capacity), 1.0)
                        ZStack(alignment: .leading) {
                            RoundedRectangle(cornerRadius: 2)
                                .fill(Brand.border)
                                .frame(height: 4)
                            RoundedRectangle(cornerRadius: 2)
                                .fill(pct >= 1 ? Brand.danger : Brand.blue)
                                .frame(width: geo.size.width * pct, height: 4)
                        }
                    }
                    .frame(height: 4)
                    Text("\(plan.goingIds.count)/\(plan.capacity) going · hosted by \(host)")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(Brand.textSecondary)
                }
                Spacer()
                Button {} label: {
                    Text("Join")
                        .font(.system(size: 12, weight: .heavy))
                        .foregroundStyle(.white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(Brand.blue, in: RoundedRectangle(cornerRadius: 16))
                }
                .buttonStyle(.plain)
            }
            .padding(.top, 12)
        }
        .padding(16)
        .background(Brand.card, in: RoundedRectangle(cornerRadius: 18))
        .brandShadow()
    }

    private var host: String {
        MockData.person(plan.hostId)?.name.split(separator: " ").first.map(String.init) ?? "Someone"
    }

    private var avatarStack: some View {
        HStack(spacing: -10) {
            ForEach(Array(plan.goingIds.prefix(4).enumerated()), id: \.offset) { _, id in
                let p = MockData.person(id)
                let color = id == "me" ? Brand.blue : (p?.photoColor ?? Brand.blue)
                let init_ = id == "me" ? MockData.me.initials :
                    (p.map { initials($0.name) } ?? "?")
                Circle()
                    .fill(color)
                    .frame(width: 26, height: 26)
                    .overlay(Circle().stroke(.white, lineWidth: 2))
                    .overlay(
                        Text(init_)
                            .font(.system(size: 9, weight: .heavy))
                            .foregroundStyle(.white)
                    )
            }
        }
    }
}
