import SwiftUI

struct SectionHeader<Trailing: View>: View {
    let title: String
    var meta: String? = nil
    @ViewBuilder var trailing: () -> Trailing

    var body: some View {
        HStack {
            Text(title)
                .font(.system(size: 18, weight: .heavy))
                .foregroundStyle(Brand.dark)
            Spacer()
            if let meta {
                Text(meta)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(Brand.textSecondary)
            }
            trailing()
        }
        .padding(.horizontal, 24)
    }
}

extension SectionHeader where Trailing == EmptyView {
    init(_ title: String, meta: String? = nil) {
        self.init(title: title, meta: meta, trailing: { EmptyView() })
    }
}
