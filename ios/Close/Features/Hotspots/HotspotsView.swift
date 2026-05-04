import SwiftUI

struct HotspotsView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 0) {
                    header

                    StylizedHeatmap(spots: MockData.hotspots)
                        .padding(.horizontal, 16)
                        .padding(.bottom, 24)

                    SectionHeader("Top spots this week", meta: "Milan")
                        .padding(.bottom, 12)

                    let sorted = MockData.hotspots.sorted { $0.encounters > $1.encounters }
                    ForEach(Array(sorted.enumerated()), id: \.element.id) { index, spot in
                        HotspotRow(spot: spot, rank: index + 1)
                            .padding(.horizontal, 16)
                            .padding(.bottom, 8)
                    }

                    HStack(alignment: .top, spacing: 8) {
                        Image(systemName: "lock.fill")
                            .foregroundStyle(Brand.textSecondary)
                        Text("Hotspots are aggregated and anonymized. We never show one person's location.")
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
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text("Hotspots")
                .font(.system(size: 32, weight: .heavy))
                .foregroundStyle(Brand.dark)
            Text("Where Close people gather")
                .font(.system(size: 13))
                .foregroundStyle(Brand.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 24)
        .padding(.top, 8)
        .padding(.bottom, 16)
    }
}

private struct HotspotRow: View {
    let spot: Hotspot
    let rank: Int

    private var trendSymbol: String {
        switch spot.trend {
        case .up: return "arrow.up"
        case .down: return "arrow.down"
        case .same: return "minus"
        }
    }
    private var trendColor: Color {
        switch spot.trend {
        case .up: return Brand.success
        case .down: return Brand.danger
        case .same: return Brand.textSecondary
        }
    }

    var body: some View {
        HStack(spacing: 12) {
            Text("\(rank)")
                .font(.system(size: 13, weight: .heavy))
                .foregroundStyle(Brand.blue)
                .frame(width: 28, height: 28)
                .background(Brand.blue.opacity(0.1), in: Circle())
            VStack(alignment: .leading, spacing: 2) {
                Text(spot.name)
                    .font(.system(size: 15, weight: .bold))
                    .foregroundStyle(Brand.dark)
                Text("\(spot.encounters) encounters this week")
                    .font(.system(size: 12))
                    .foregroundStyle(Brand.textSecondary)
            }
            Spacer()
            Image(systemName: trendSymbol)
                .font(.system(size: 11, weight: .bold))
                .foregroundStyle(trendColor)
                .frame(width: 28, height: 28)
                .background(Brand.background, in: Circle())
        }
        .padding(14)
        .background(Brand.card, in: RoundedRectangle(cornerRadius: 14))
        .brandShadow()
    }
}

private struct StylizedHeatmap: View {
    let spots: [Hotspot]

    var body: some View {
        GeometryReader { geo in
            let w = geo.size.width
            let h = geo.size.height
            ZStack {
                Color(hex: 0x0F1322)

                // grid
                ForEach(0..<4, id: \.self) { i in
                    let v = CGFloat(i + 1) * 0.2
                    Rectangle()
                        .fill(Color.white.opacity(0.05))
                        .frame(height: 1)
                        .position(x: w / 2, y: h * v)
                    Rectangle()
                        .fill(Color.white.opacity(0.05))
                        .frame(width: 1)
                        .position(x: w * v, y: h / 2)
                }

                // heat zones + dots
                ForEach(spots) { spot in
                    Circle()
                        .fill(Brand.blue.opacity(0.28 * spot.intensity))
                        .frame(width: spot.radius * 2, height: spot.radius * 2)
                        .overlay(Circle().stroke(Brand.blue.opacity(0.5 * spot.intensity), lineWidth: 1))
                        .position(x: w * spot.x, y: h * spot.y)

                    Circle()
                        .fill(Color.white.opacity(0.5 + 0.5 * spot.intensity))
                        .frame(
                            width: 10 + spot.intensity * 8,
                            height: 10 + spot.intensity * 8
                        )
                        .shadow(color: .white.opacity(0.8), radius: 8)
                        .position(x: w * spot.x, y: h * spot.y)
                }

                // you
                ZStack {
                    Circle()
                        .fill(Brand.orange.opacity(0.25))
                        .frame(width: 22, height: 22)
                    Circle()
                        .fill(Brand.orange)
                        .frame(width: 10, height: 10)
                        .overlay(Circle().stroke(.white, lineWidth: 2))
                }
                .position(x: w * 0.5, y: h * 0.5)
            }
            .clipShape(RoundedRectangle(cornerRadius: 22))
            .overlay(alignment: .bottom) {
                HStack(spacing: 8) {
                    Image(systemName: "map")
                        .font(.system(size: 12))
                        .foregroundStyle(.white.opacity(0.65))
                    Text("CLOSE Hotspots · Milano")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(.white.opacity(0.65))
                    Rectangle().fill(.white.opacity(0.2)).frame(width: 1, height: 12)
                    Circle().fill(Brand.orange).frame(width: 8, height: 8)
                    Text("You")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(.white.opacity(0.65))
                }
                .padding(.vertical, 10)
                .frame(maxWidth: .infinity)
                .background(Color.black.opacity(0.35))
            }
        }
        .aspectRatio(1.28, contentMode: .fit)
    }
}
