import SwiftUI

@main
struct CloseApp: App {
    @State private var router = AppRouter()
    @State private var proximity = ProximityService()

    var body: some Scene {
        WindowGroup {
            ContentRoot()
                .environment(router)
                .environment(proximity)
                .tint(Brand.blue)
                .preferredColorScheme(.light)
                .onAppear { proximity.start() }
        }
    }
}

private struct ContentRoot: View {
    @Environment(AppRouter.self) private var router

    var body: some View {
        @Bindable var router = router
        RootTabView()
            .sheet(item: $router.sheet) { sheet in
                switch sheet {
                case .newPlan:
                    NewPlanView()
                case .rate(let id):
                    RateView(targetId: id)
                case .premium:
                    NavigationStack { PremiumView() }
                }
            }
    }
}
