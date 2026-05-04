import SwiftUI

struct RootTabView: View {
    @State private var selection: Tab = .nearby

    enum Tab: Hashable { case nearby, city, hotspots, circle, profile }

    var body: some View {
        TabView(selection: $selection) {
            NearbyView()
                .tabItem { Label("Nearby", systemImage: "dot.radiowaves.left.and.right") }
                .tag(Tab.nearby)

            CityView()
                .tabItem { Label("City", systemImage: "bubble.left.and.bubble.right.fill") }
                .tag(Tab.city)

            HotspotsView()
                .tabItem { Label("Map", systemImage: "map.fill") }
                .tag(Tab.hotspots)

            ConnectionsView()
                .tabItem { Label("Circle", systemImage: "person.2.fill") }
                .tag(Tab.circle)

            ProfileView()
                .tabItem { Label("You", systemImage: "person.fill") }
                .tag(Tab.profile)
        }
    }
}
