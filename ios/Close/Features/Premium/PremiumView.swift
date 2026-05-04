import SwiftUI

struct PremiumView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var selected: String = "annual"

    private struct Perk { let icon: String; let title: String; let desc: String }
    private let perks: [Perk] = [
        .init(icon: "eye.fill", title: "See who waved at you",
              desc: "Skip the guessing — see every wave you've ever received, ranked by mutual proximity."),
        .init(icon: "eye.slash.fill", title: "Go invisible",
              desc: "Be there but unseen. Browse the room without showing up on anyone's radar."),
        .init(icon: "globe", title: "Unlock other cities",
              desc: "Going to Berlin? Lisbon? Get full Close access in any city — including a 7-day \u{201C}arrived\u{201D} boost."),
        .init(icon: "clock.arrow.circlepath", title: "Replay your nights",
              desc: "See every encounter, plan, and pin from past nights. Re-discover who you crossed paths with."),
        .init(icon: "wand.and.stars", title: "Vibe rewind",
              desc: "Pin a vibe up to 30 days after a night, instead of 24 hours."),
        .init(icon: "rocket.fill", title: "Boost your plans",
              desc: "Pin your plan to the top of the city feed for 1 hour. Once a week, on the house.")
    ]

    private struct Plan { let id: String; let title: String; let price: String; let period: String; let cta: String; let badge: String? }
    private let plans: [Plan] = [
        .init(id: "monthly", title: "Monthly", price: "€8.99", period: "/month", cta: "Try free for 7 days", badge: nil),
        .init(id: "annual",  title: "Annual",  price: "€59.99", period: "/year",  cta: "Best value · save 44%", badge: "POPULAR"),
        .init(id: "lifetime",title: "Founder", price: "€199",   period: "one time · lifetime", cta: "Limited to first 1,000", badge: "RARE")
    ]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                hero
                    .padding(.horizontal, 24)
                    .padding(.top, 8)
                    .padding(.bottom, 32)

                VStack(spacing: 0) {
                    perksList

                    plansSection

                    Button { dismiss() } label: {
                        Text("Start free trial")
                            .font(.system(size: 16, weight: .black))
                            .foregroundStyle(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 18)
                            .background(Brand.orange, in: RoundedRectangle(cornerRadius: 18))
                            .shadow(color: Brand.orange.opacity(0.4), radius: 14, y: 8)
                    }
                    .buttonStyle(.plain)
                    .padding(.horizontal, 20)
                    .padding(.top, 12)

                    Text("Cancel anytime in Settings · Renews automatically · Privacy-first by design")
                        .font(.system(size: 11))
                        .foregroundStyle(Brand.textSecondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 20)
                        .padding(.top, 12)

                    VStack(alignment: .leading, spacing: 6) {
                        Text("Why we charge")
                            .font(.system(size: 14, weight: .heavy))
                            .foregroundStyle(Brand.dark)
                        Text("Close will never run ads. Your location, your pins, your photos — those aren't a product. Plus subscriptions are how we keep the lights on and the city vibe alive.")
                            .font(.system(size: 12))
                            .foregroundStyle(Brand.textSecondary)
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 18)
                    .padding(.bottom, 24)
                }
                .frame(maxWidth: .infinity)
                .background(
                    Brand.background,
                    in: UnevenRoundedRectangle(topLeadingRadius: 28, topTrailingRadius: 28)
                )
            }
        }
        .background(Brand.dark.ignoresSafeArea())
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button { dismiss() } label: {
                    Image(systemName: "xmark")
                        .foregroundStyle(.white)
                }
            }
        }
        .toolbarBackground(.hidden, for: .navigationBar)
    }

    private var hero: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: 10) {
                Text("CLOSE")
                    .font(.system(size: 28, weight: .black))
                    .tracking(3)
                    .foregroundStyle(.white)
                HStack(spacing: 4) {
                    Image(systemName: "bolt.fill")
                        .font(.system(size: 11, weight: .bold))
                    Text("PLUS")
                        .font(.system(size: 11, weight: .black))
                        .tracking(1)
                }
                .foregroundStyle(.white)
                .padding(.horizontal, 8)
                .padding(.vertical, 3)
                .background(Brand.orange, in: RoundedRectangle(cornerRadius: 8))
            }
            .padding(.bottom, 18)

            Text("Close, but more.")
                .font(.system(size: 38, weight: .black))
                .foregroundStyle(.white)
                .lineSpacing(-4)

            Text("Everything in Close, with the unfair advantages your social life deserves.")
                .font(.system(size: 15))
                .foregroundStyle(.white.opacity(0.7))
                .padding(.top, 10)
        }
    }

    private var perksList: some View {
        VStack(spacing: 0) {
            ForEach(Array(perks.enumerated()), id: \.offset) { i, perk in
                HStack(alignment: .top, spacing: 14) {
                    Image(systemName: perk.icon)
                        .font(.system(size: 16))
                        .foregroundStyle(Brand.orange)
                        .frame(width: 40, height: 40)
                        .background(Brand.orange.opacity(0.12), in: Circle())
                    VStack(alignment: .leading, spacing: 4) {
                        Text(perk.title)
                            .font(.system(size: 15, weight: .heavy))
                            .foregroundStyle(Brand.dark)
                        Text(perk.desc)
                            .font(.system(size: 13))
                            .foregroundStyle(Brand.textSecondary)
                    }
                    Spacer()
                }
                .padding(.vertical, 14)
                if i != perks.count - 1 {
                    Divider().background(Brand.border)
                }
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 24)
    }

    private var plansSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Pick your plan")
                .font(.system(size: 18, weight: .heavy))
                .foregroundStyle(Brand.dark)
                .padding(.top, 16)

            ForEach(plans, id: \.id) { p in
                planRow(p: p)
            }
        }
        .padding(.horizontal, 20)
    }

    private func planRow(p: Plan) -> some View {
        let active = selected == p.id
        return Button { selected = p.id } label: {
            HStack(spacing: 12) {
                ZStack {
                    Circle()
                        .stroke(active ? Brand.orange : Brand.border, lineWidth: 2)
                        .frame(width: 22, height: 22)
                    if active {
                        Circle().fill(Brand.orange).frame(width: 10, height: 10)
                    }
                }
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 8) {
                        Text(p.title)
                            .font(.system(size: 15, weight: .heavy))
                            .foregroundStyle(Brand.dark)
                        if let badge = p.badge {
                            Text(badge)
                                .font(.system(size: 9, weight: .black))
                                .tracking(1)
                                .foregroundStyle(.white)
                                .padding(.horizontal, 7)
                                .padding(.vertical, 2)
                                .background(
                                    badge == "RARE" ? Brand.purple : Brand.orange,
                                    in: RoundedRectangle(cornerRadius: 6)
                                )
                        }
                    }
                    HStack(alignment: .firstTextBaseline, spacing: 4) {
                        Text(p.price)
                            .font(.system(size: 22, weight: .black))
                            .foregroundStyle(Brand.dark)
                        Text(p.period)
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(Brand.textSecondary)
                    }
                    Text(p.cta)
                        .font(.system(size: 12, weight: .heavy))
                        .foregroundStyle(Brand.orange)
                }
                Spacer()
            }
            .padding(16)
            .background(
                active ? Brand.orange.opacity(0.05) : Brand.card,
                in: RoundedRectangle(cornerRadius: 16)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(active ? Brand.orange : Brand.border, lineWidth: 2)
            )
        }
        .buttonStyle(.plain)
    }
}
