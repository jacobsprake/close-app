import SwiftUI

struct RateView: View {
    let targetId: String
    @Environment(\.dismiss) private var dismiss

    @State private var stars: Int = 0
    @State private var pinned: String? = nil
    @State private var note: String = ""

    private var isMe: Bool { targetId == "me" }
    private var target: NearbyPerson? { isMe ? nil : MockData.person(targetId) }

    private var canSubmit: Bool { stars > 0 && pinned != nil }

    private var caption: String {
        switch stars {
        case 0: return "Tap to rate the vibe"
        case 1: return "Survived"
        case 2: return "Eh, it was fine"
        case 3: return "Good night, would repeat"
        case 4: return "Top 10 nights"
        default: return "Legendary"
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    // Target
                    VStack(spacing: 0) {
                        AvatarBubble(
                            initials: isMe ? MockData.me.initials : initials(target?.name ?? "?"),
                            color: isMe ? Brand.blue : (target?.photoColor ?? Brand.blue),
                            size: 64
                        )
                        Text(isMe ? MockData.me.name : (target?.name ?? "Someone"))
                            .font(.system(size: 20, weight: .heavy))
                            .foregroundStyle(Brand.dark)
                            .padding(.top, 12)
                        Text(isMe ? "Reflect on tonight" : "How was the night with them?")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(Brand.textSecondary)
                            .padding(.top, 2)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(22)
                    .background(Brand.card, in: RoundedRectangle(cornerRadius: 18))
                    .brandShadow()

                    sectionTitle("The night was…", topPad: 24)

                    HStack {
                        ForEach(1...5, id: \.self) { n in
                            Button { stars = n } label: {
                                Image(systemName: n <= stars ? "star.fill" : "star")
                                    .font(.system(size: 36))
                                    .foregroundStyle(n <= stars ? Brand.warning : Brand.border)
                                    .padding(4)
                            }
                            .buttonStyle(.plain)
                            if n != 5 { Spacer() }
                        }
                    }
                    .padding(.horizontal, 8)
                    .padding(.top, 6)

                    Text(caption)
                        .font(.system(size: 13, weight: .heavy))
                        .foregroundStyle(Brand.textSecondary)
                        .frame(maxWidth: .infinity)
                        .padding(.top, 4)

                    sectionTitle("Pin a vibe", topPad: 24)
                    Text("The single thing that captured them tonight. Stays on their profile.")
                        .font(.system(size: 13))
                        .foregroundStyle(Brand.textSecondary)
                        .padding(.bottom, 12)

                    FlowLayout(spacing: 8) {
                        ForEach(MockData.vibeTags) { tag in
                            Button { pinned = tag.id } label: {
                                let selected = pinned == tag.id
                                HStack(spacing: 6) {
                                    Image(systemName: tag.symbol)
                                        .font(.system(size: 14, weight: .semibold))
                                    Text(tag.label)
                                        .font(.system(size: 13, weight: selected ? .heavy : .semibold))
                                }
                                .foregroundStyle(selected ? tag.color : Brand.dark)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 8)
                                .background(
                                    selected ? tag.color.opacity(0.18) : Brand.card,
                                    in: RoundedRectangle(cornerRadius: 14)
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 14)
                                        .stroke(selected ? tag.color : Brand.border, lineWidth: 1)
                                )
                            }
                            .buttonStyle(.plain)
                        }
                    }

                    sectionTitle("One-line story (optional)", topPad: 24)

                    TextField("\u{201C}told the bouncer story 3 times. still funny.\u{201D}", text: $note, axis: .vertical)
                        .lineLimit(3...6)
                        .font(.system(size: 14))
                        .padding(14)
                        .background(Brand.card, in: RoundedRectangle(cornerRadius: 14))
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Brand.border, lineWidth: 1))
                        .onChange(of: note) { _, newValue in
                            if newValue.count > 140 {
                                note = String(newValue.prefix(140))
                            }
                        }
                    Text("\(note.count)/140")
                        .font(.system(size: 11))
                        .foregroundStyle(Brand.textSecondary)
                        .frame(maxWidth: .infinity, alignment: .trailing)
                        .padding(.top, 4)

                    HStack(alignment: .top, spacing: 10) {
                        Image(systemName: "shield.fill")
                            .foregroundStyle(Brand.textSecondary)
                        Text("Pins are public on their profile. Stars are aggregated — no one sees your individual rating. You can only pin people you've been physically near.")
                            .font(.system(size: 12))
                            .foregroundStyle(Brand.textSecondary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    .padding(14)
                    .background(Brand.blue.opacity(0.06), in: RoundedRectangle(cornerRadius: 12))
                    .padding(.top, 18)

                    Button { dismiss() } label: {
                        HStack(spacing: 8) {
                            Image(systemName: "bolt.fill")
                                .font(.system(size: 14, weight: .bold))
                            Text("Pin it")
                                .font(.system(size: 15, weight: .heavy))
                        }
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(Brand.orange, in: RoundedRectangle(cornerRadius: 16))
                        .shadow(color: Brand.orange.opacity(0.35), radius: 14, y: 6)
                    }
                    .buttonStyle(.plain)
                    .disabled(!canSubmit)
                    .opacity(canSubmit ? 1 : 0.4)
                    .padding(.top, 18)
                }
                .padding(20)
            }
            .background(Brand.background.ignoresSafeArea())
            .navigationTitle(isMe ? "Rate yourself" : "Pin a vibe")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Close") { dismiss() }
                }
            }
        }
    }

    private func sectionTitle(_ text: String, topPad: CGFloat) -> some View {
        Text(text)
            .font(.system(size: 16, weight: .heavy))
            .foregroundStyle(Brand.dark)
            .padding(.top, topPad)
            .padding(.bottom, 6)
    }
}
