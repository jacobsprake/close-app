import SwiftUI

struct NewPlanView: View {
    @Environment(\.dismiss) private var dismiss

    @State private var emoji: String = "🍸"
    @State private var title: String = ""
    @State private var spot: String = ""
    @State private var time: String = "Tonight, 8pm"
    @State private var capacity: Int = 8
    @State private var vibe: PlanVibe = .classy
    @State private var invited: Set<String> = []

    private let templates: [(emoji: String, title: String)] = [
        ("🍸", "Aperitivo at…"),
        ("🍝", "Dinner at…"),
        ("🎧", "Going out to…"),
        ("🏃", "Run around…"),
        ("☕", "Coffee at…"),
        ("🎨", "Walk through…")
    ]

    private let timeSlots = ["Tonight, 7pm", "Tonight, 9pm", "Friday, 8pm", "Saturday, 11pm"]
    private let caps = [2, 4, 6, 8, 12, 20]

    private var canCreate: Bool {
        !title.trimmingCharacters(in: .whitespaces).isEmpty &&
        !spot.trimmingCharacters(in: .whitespaces).isEmpty
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    Text("Host something tonight")
                        .font(.system(size: 24, weight: .heavy))
                        .foregroundStyle(Brand.dark)
                    Text("People nearby see your plan first. Be specific — a real time and place wins.")
                        .font(.system(size: 13))
                        .foregroundStyle(Brand.textSecondary)
                        .padding(.top, 4)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(templates, id: \.title) { t in
                                templateChip(t.emoji, t.title)
                            }
                        }
                    }
                    .padding(.vertical, 16)

                    field("WHAT IS IT?") {
                        HStack(spacing: 8) {
                            Text(emoji).font(.system(size: 28)).frame(width: 44)
                            TextField("Spritz crawl through Brera", text: $title)
                                .textFieldStyle(.plain)
                                .font(.system(size: 15))
                                .padding(.horizontal, 14)
                                .padding(.vertical, 14)
                                .background(Brand.card, in: RoundedRectangle(cornerRadius: 14))
                                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Brand.border, lineWidth: 1))
                        }
                    }

                    field("WHERE") {
                        TextField("Bar Basso, Via Plinio 39", text: $spot)
                            .textFieldStyle(.plain)
                            .font(.system(size: 15))
                            .padding(.horizontal, 14)
                            .padding(.vertical, 14)
                            .background(Brand.card, in: RoundedRectangle(cornerRadius: 14))
                            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Brand.border, lineWidth: 1))
                    }

                    field("WHEN") {
                        FlowLayout(spacing: 8) {
                            ForEach(timeSlots, id: \.self) { slot in
                                Button { time = slot } label: {
                                    Text(slot)
                                        .font(.system(size: 13, weight: .heavy))
                                        .foregroundStyle(time == slot ? .white : Brand.dark)
                                        .padding(.horizontal, 14)
                                        .padding(.vertical, 10)
                                        .background(
                                            time == slot ? Brand.blue : Brand.card,
                                            in: RoundedRectangle(cornerRadius: 14)
                                        )
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 14)
                                                .stroke(time == slot ? Brand.blue : Brand.border, lineWidth: 1)
                                        )
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }

                    field("VIBE") {
                        HStack(spacing: 8) {
                            ForEach(PlanVibe.allCases, id: \.self) { v in
                                Button { vibe = v } label: {
                                    VStack(spacing: 4) {
                                        Text(v.emoji).font(.system(size: 22))
                                        Text(v.label)
                                            .font(.system(size: 12, weight: vibe == v ? .heavy : .bold))
                                            .foregroundStyle(vibe == v ? v.color : Brand.dark)
                                    }
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 14)
                                    .background(
                                        (vibe == v ? v.color.opacity(0.15) : Brand.card),
                                        in: RoundedRectangle(cornerRadius: 14)
                                    )
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 14)
                                            .stroke(vibe == v ? v.color : Brand.border, lineWidth: 1)
                                    )
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }

                    field("CAPACITY · \(capacity) PEOPLE") {
                        HStack(spacing: 8) {
                            ForEach(caps, id: \.self) { n in
                                Button { capacity = n } label: {
                                    Text("\(n)")
                                        .font(.system(size: 14, weight: .heavy))
                                        .foregroundStyle(capacity == n ? .white : Brand.dark)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .background(
                                            capacity == n ? Brand.blue : Brand.card,
                                            in: RoundedRectangle(cornerRadius: 14)
                                        )
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 14)
                                                .stroke(capacity == n ? Brand.blue : Brand.border, lineWidth: 1)
                                        )
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }

                    field("INVITE FROM YOUR CIRCLE · \(invited.count) SELECTED") {
                        VStack(spacing: 0) {
                            ForEach(MockData.nearbyPeople) { p in
                                inviteRow(person: p)
                                if p.id != MockData.nearbyPeople.last?.id {
                                    Divider().background(Brand.border)
                                }
                            }
                        }
                        .background(Brand.card, in: RoundedRectangle(cornerRadius: 14))
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Brand.border, lineWidth: 1))
                    }

                    Button { dismiss() } label: {
                        HStack(spacing: 8) {
                            Image(systemName: "bolt.fill")
                                .font(.system(size: 14, weight: .bold))
                            Text("Post plan to Milan")
                                .font(.system(size: 15, weight: .heavy))
                        }
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(Brand.blue, in: RoundedRectangle(cornerRadius: 16))
                        .shadow(color: Brand.blue.opacity(0.35), radius: 14, y: 6)
                    }
                    .buttonStyle(.plain)
                    .opacity(canCreate ? 1 : 0.4)
                    .disabled(!canCreate)
                    .padding(.top, 8)

                    Text("Plans auto-expire 1 hour after start. People who join unlock the address.")
                        .font(.system(size: 11))
                        .foregroundStyle(Brand.textSecondary)
                        .multilineTextAlignment(.center)
                        .frame(maxWidth: .infinity)
                        .padding(.top, 14)
                }
                .padding(20)
            }
            .background(Brand.background.ignoresSafeArea())
            .navigationTitle("New plan")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Close") { dismiss() }
                }
            }
        }
    }

    private func templateChip(_ emoji: String, _ title: String) -> some View {
        let active = self.emoji == emoji
        return Button {
            self.emoji = emoji
            self.title = title
        } label: {
            HStack(spacing: 6) {
                Text(emoji).font(.system(size: 16))
                Text(title)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundStyle(active ? .white : Brand.dark)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(
                active ? Brand.blue : Brand.card,
                in: RoundedRectangle(cornerRadius: 16)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(active ? Brand.blue : Brand.border, lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
    }

    private func field<Content: View>(_ label: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(.system(size: 12, weight: .heavy))
                .tracking(1)
                .foregroundStyle(Brand.textSecondary)
            content()
        }
        .padding(.bottom, 14)
    }

    private func inviteRow(person: NearbyPerson) -> some View {
        let isInvited = invited.contains(person.id)
        return Button {
            if isInvited { invited.remove(person.id) }
            else { invited.insert(person.id) }
        } label: {
            HStack(spacing: 12) {
                AvatarBubble(initials: initials(person.name), color: person.photoColor, size: 38)
                VStack(alignment: .leading, spacing: 1) {
                    Text(person.name)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundStyle(Brand.dark)
                    Text(person.role)
                        .font(.system(size: 11))
                        .foregroundStyle(Brand.textSecondary)
                        .lineLimit(1)
                }
                Spacer()
                ZStack {
                    Circle()
                        .stroke(isInvited ? Brand.blue : Brand.border, lineWidth: 2)
                        .background(Circle().fill(isInvited ? Brand.blue : .clear))
                        .frame(width: 22, height: 22)
                    if isInvited {
                        Image(systemName: "checkmark")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundStyle(.white)
                    }
                }
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 12)
            .background(isInvited ? Brand.blue.opacity(0.06) : .clear)
        }
        .buttonStyle(.plain)
    }
}
