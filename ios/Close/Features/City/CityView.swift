import SwiftUI

struct CityView: View {
    @Environment(AppRouter.self) private var router
    @State private var draft: String = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 0) {
                    header
                        .padding(.horizontal, 24)
                        .padding(.top, 8)
                        .padding(.bottom, 16)

                    SectionHeader("Trending vibes", meta: "this week in Milan")
                        .padding(.bottom, 12)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(MockData.vibeTags.prefix(6)) { tag in
                                trendingChip(tag: tag, count: Int.random(in: 20...100))
                            }
                        }
                        .padding(.horizontal, 16)
                    }
                    .padding(.bottom, 16)

                    SectionHeader(title: "Plans tonight", meta: nil) {
                        Button { router.present(.newPlan) } label: {
                            Text("+ Host one")
                                .font(.system(size: 13, weight: .heavy))
                                .foregroundStyle(Brand.blue)
                        }
                        .buttonStyle(.plain)
                    }
                    .padding(.bottom, 12)

                    ForEach(MockData.plans) { plan in
                        PlanCard(plan: plan)
                            .padding(.horizontal, 16)
                            .padding(.bottom, 12)
                    }

                    SectionHeader("City chat", meta: "fades in 24h")
                        .padding(.bottom, 12)

                    chatCard
                        .padding(.horizontal, 16)
                }
                .padding(.bottom, 32)
            }
            .background(Brand.background.ignoresSafeArea())
        }
    }

    private var header: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 4) {
                Text("Milano")
                    .font(.system(size: 32, weight: .heavy))
                    .foregroundStyle(Brand.dark)
                HStack(spacing: 6) {
                    Circle().fill(Brand.success).frame(width: 8, height: 8)
                    Text("234 active · 12 plans tonight")
                        .font(.system(size: 13))
                        .foregroundStyle(Brand.textSecondary)
                }
            }
            Spacer()
            Button { router.present(.newPlan) } label: {
                HStack(spacing: 6) {
                    Image(systemName: "plus")
                        .font(.system(size: 12, weight: .bold))
                    Text("Plan")
                        .font(.system(size: 13, weight: .heavy))
                }
                .foregroundStyle(.white)
                .padding(.horizontal, 14)
                .padding(.vertical, 10)
                .background(Brand.blue, in: Capsule())
                .shadow(color: Brand.blue.opacity(0.3), radius: 8, y: 4)
            }
            .buttonStyle(.plain)
        }
    }

    private func trendingChip(tag: VibeTag, count: Int) -> some View {
        HStack(spacing: 6) {
            Image(systemName: tag.symbol)
                .font(.system(size: 14, weight: .semibold))
            Text(tag.label)
                .font(.system(size: 13, weight: .bold))
            Text("\(count)")
                .font(.system(size: 11, weight: .heavy))
                .foregroundStyle(Brand.textSecondary)
                .padding(.horizontal, 6)
                .padding(.vertical, 1)
                .background(Color.black.opacity(0.05), in: RoundedRectangle(cornerRadius: 8))
        }
        .foregroundStyle(tag.color)
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(tag.color.opacity(0.13), in: Capsule())
        .overlay(Capsule().stroke(tag.color.opacity(0.4), lineWidth: 1))
    }

    private var chatCard: some View {
        VStack(spacing: 0) {
            ForEach(MockData.cityChat) { msg in
                ChatBubble(message: msg)
                    .padding(.vertical, 10)
                    .padding(.horizontal, 4)
                    .background(
                        msg.pinned ? Brand.orange.opacity(0.05) : .clear,
                        in: RoundedRectangle(cornerRadius: 12)
                    )
                if msg.id != MockData.cityChat.last?.id {
                    Divider().background(Brand.border)
                }
            }

            HStack(alignment: .bottom, spacing: 8) {
                TextField("Say something to Milan…", text: $draft, axis: .vertical)
                    .lineLimit(1...4)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .background(Brand.background, in: RoundedRectangle(cornerRadius: 18))
                    .font(.system(size: 14))

                Button {
                    draft = ""
                } label: {
                    Image(systemName: "paperplane.fill")
                        .font(.system(size: 14))
                        .foregroundStyle(.white)
                        .frame(width: 36, height: 36)
                        .background(Brand.blue, in: Circle())
                }
                .buttonStyle(.plain)
                .disabled(draft.trimmingCharacters(in: .whitespaces).isEmpty)
                .opacity(draft.trimmingCharacters(in: .whitespaces).isEmpty ? 0.4 : 1)
            }
            .padding(.top, 12)
        }
        .padding(12)
        .background(Brand.card, in: RoundedRectangle(cornerRadius: 18))
        .brandShadow()
    }
}
