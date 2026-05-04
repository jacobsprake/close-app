import SwiftUI

struct ChatBubble: View {
    let message: ChatMessage

    var body: some View {
        let author = MockData.person(message.authorId)
        HStack(alignment: .top, spacing: 10) {
            Circle()
                .fill(author?.photoColor ?? Brand.blue)
                .frame(width: 34, height: 34)
                .overlay(
                    Text(initials(author?.name ?? "?"))
                        .font(.system(size: 12, weight: .heavy))
                        .foregroundStyle(.white)
                )

            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 8) {
                    Text(author?.name ?? "Someone")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundStyle(Brand.dark)
                    if message.pinned {
                        HStack(spacing: 3) {
                            Image(systemName: "pin.fill")
                                .font(.system(size: 9))
                            Text("Pinned")
                                .font(.system(size: 9, weight: .heavy))
                        }
                        .foregroundStyle(Brand.orange)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 1)
                        .background(Brand.orange.opacity(0.15), in: RoundedRectangle(cornerRadius: 6))
                    }
                    Spacer()
                    Text(message.timeAgo)
                        .font(.system(size: 11))
                        .foregroundStyle(Brand.textSecondary)
                }
                Text(message.text)
                    .font(.system(size: 14))
                    .foregroundStyle(Brand.dark)
                    .fixedSize(horizontal: false, vertical: true)

                if !message.reactions.isEmpty {
                    HStack(spacing: 6) {
                        ForEach(Array(message.reactions.enumerated()), id: \.offset) { _, r in
                            HStack(spacing: 4) {
                                Text(r.emoji).font(.system(size: 12))
                                Text("\(r.count)")
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundStyle(Brand.dark)
                            }
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(Brand.background, in: RoundedRectangle(cornerRadius: 12))
                        }
                        Button {} label: {
                            Image(systemName: "plus")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundStyle(Brand.textSecondary)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Brand.background, in: RoundedRectangle(cornerRadius: 12))
                        }
                        .buttonStyle(.plain)
                    }
                    .padding(.top, 2)
                }
            }
        }
    }
}
