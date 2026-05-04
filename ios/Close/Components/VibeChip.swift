import SwiftUI

struct VibeChip: View {
    let tag: VibeTag
    var mini: Bool = false
    var count: Int? = nil

    var body: some View {
        HStack(spacing: mini ? 4 : 6) {
            Image(systemName: tag.symbol)
                .font(.system(size: mini ? 10 : 12, weight: .semibold))
            Text(tag.label)
                .font(.system(size: mini ? 11 : 12, weight: .bold))
            if let count {
                Text("\(count)")
                    .font(.system(size: 11, weight: .heavy))
                    .foregroundStyle(Brand.textSecondary)
                    .padding(.horizontal, 5)
                    .padding(.vertical, 1)
                    .background(Color.black.opacity(0.05), in: RoundedRectangle(cornerRadius: 6))
            }
        }
        .foregroundStyle(tag.color)
        .padding(.horizontal, mini ? 8 : 10)
        .padding(.vertical, mini ? 4 : 6)
        .background(tag.color.opacity(0.1), in: RoundedRectangle(cornerRadius: mini ? 10 : 12))
        .overlay(
            RoundedRectangle(cornerRadius: mini ? 10 : 12)
                .stroke(tag.color.opacity(0.35), lineWidth: 1)
        )
    }
}

struct AvatarBubble: View {
    let initials: String
    let color: Color
    var size: CGFloat = 56
    var live: Bool = false

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            Circle()
                .fill(color)
                .frame(width: size, height: size)
                .overlay(Circle().stroke(.white, lineWidth: 2))
                .overlay {
                    Text(initials)
                        .font(.system(size: size * 0.36, weight: .heavy))
                        .foregroundStyle(.white)
                }
                .shadow(color: color.opacity(0.3), radius: 6, y: 2)

            if live {
                Circle()
                    .fill(Brand.success)
                    .frame(width: size * 0.26, height: size * 0.26)
                    .overlay(Circle().stroke(.white, lineWidth: 2))
            }
        }
    }
}

struct StarVibe: View {
    let rating: Double
    let nights: Int

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "moon.fill")
                .foregroundStyle(Brand.warning)
                .font(.system(size: 11))
            Text(String(format: "%.1f", rating))
                .font(.system(size: 13, weight: .heavy))
                .foregroundStyle(Brand.dark)
            Text("· \(nights) nights")
                .font(.system(size: 12))
                .foregroundStyle(Brand.textSecondary)
        }
    }
}

struct StrengthBars: View {
    let bars: Int
    let color: Color
    var body: some View {
        HStack(alignment: .bottom, spacing: 2) {
            ForEach(1...4, id: \.self) { i in
                RoundedRectangle(cornerRadius: 2)
                    .fill(i <= bars ? color : Brand.border)
                    .frame(width: 5, height: CGFloat(6 + i * 4))
            }
        }
    }
}
