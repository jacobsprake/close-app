import SwiftUI

struct NearbyView: View {
    @Environment(AppRouter.self) private var router
    @State private var path = NavigationPath()
    @State private var filter: NearbyFilter = .here

    enum NearbyFilter: String, CaseIterable { case here, today }

    var body: some View {
        NavigationStack(path: $path) {
            ScrollView {
                VStack(spacing: 0) {
                    header
                    PulsingRadar(count: hereCount)
                        .padding(.top, 18)
                    Text("Scanning Bluetooth + Nearby")
                        .font(.system(size: 13))
                        .foregroundStyle(Brand.textSecondary)
                        .padding(.top, 4)
                        .padding(.bottom, 20)

                    filterRow
                        .padding(.horizontal, 16)
                        .padding(.bottom, 12)

                    LazyVStack(spacing: 10) {
                        ForEach(filtered) { person in
                            PersonCard(person: person, path: $path)
                        }
                    }

                    privacyNote
                        .padding(.horizontal, 16)
                        .padding(.top, 12)
                }
                .padding(.bottom, 32)
            }
            .background(Brand.background.ignoresSafeArea())
            .navigationDestination(for: Route.self) { route in
                switch route {
                case .person(let id):
                    if let p = MockData.person(id) {
                        PersonDetailView(person: p, path: $path)
                    } else {
                        Text("Profile not found").foregroundStyle(Brand.textSecondary)
                    }
                }
            }
        }
    }

    private var hereCount: Int {
        MockData.nearbyPeople.filter(\.isHere).count
    }

    private var filtered: [NearbyPerson] {
        switch filter {
        case .here: return MockData.nearbyPeople.filter(\.isHere)
        case .today: return MockData.nearbyPeople
        }
    }

    private var header: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 2) {
                Text("CLOSE")
                    .font(.system(size: 32, weight: .heavy))
                    .tracking(2)
                    .foregroundStyle(Brand.dark)
                Text("Milano · who's near you right now")
                    .font(.system(size: 13))
                    .foregroundStyle(Brand.textSecondary)
            }
            Spacer()
            Button { router.present(.premium) } label: {
                HStack(spacing: 6) {
                    Image(systemName: "bolt.fill")
                        .font(.system(size: 11, weight: .bold))
                    Text("Plus")
                        .font(.system(size: 12, weight: .heavy))
                        .tracking(0.5)
                }
                .foregroundStyle(Brand.orange)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(Brand.orange.opacity(0.12), in: Capsule())
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 24)
        .padding(.top, 8)
    }

    private var filterRow: some View {
        HStack(spacing: 8) {
            filterChip(title: "Here now · \(hereCount)", value: .here, withDot: true)
            filterChip(title: "Today · \(MockData.nearbyPeople.count)", value: .today)
            Spacer()
        }
    }

    private func filterChip(title: String, value: NearbyFilter, withDot: Bool = false) -> some View {
        let active = filter == value
        return Button { filter = value } label: {
            HStack(spacing: 6) {
                if withDot {
                    Circle()
                        .fill(active ? Color.white : Brand.success)
                        .frame(width: 6, height: 6)
                }
                Text(title)
                    .font(.system(size: 13, weight: .heavy))
                    .foregroundStyle(active ? Color.white : Brand.textSecondary)
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(
                Group {
                    if active {
                        Capsule().fill(Brand.blue)
                    } else {
                        Capsule()
                            .fill(Brand.card)
                            .overlay(Capsule().stroke(Brand.border, lineWidth: 1))
                    }
                }
            )
        }
        .buttonStyle(.plain)
    }

    private var privacyNote: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: "shield.fill")
                .foregroundStyle(Brand.textSecondary)
            Text("Your profile is only visible to people physically near you. Walk away and you disappear.")
                .font(.system(size: 12))
                .foregroundStyle(Brand.textSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(14)
        .background(Brand.blue.opacity(0.06), in: RoundedRectangle(cornerRadius: 14))
    }
}
