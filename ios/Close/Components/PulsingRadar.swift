import SwiftUI

struct PulsingRadar: View {
    let count: Int
    @State private var phase: Double = 0

    var body: some View {
        ZStack {
            ForEach(0..<3, id: \.self) { i in
                let p = (phase + Double(i) / 3.0).truncatingRemainder(dividingBy: 1.0)
                Circle()
                    .stroke(Brand.blue, lineWidth: 2)
                    .background(Circle().fill(Brand.blue.opacity(0.05)))
                    .scaleEffect(0.3 + p * 0.7)
                    .opacity(0.7 - p * 0.7)
            }

            Circle()
                .fill(Brand.blue)
                .frame(width: 88, height: 88)
                .shadow(color: Brand.blue.opacity(0.4), radius: 16, y: 6)
                .overlay {
                    VStack(spacing: -2) {
                        Text("\(count)")
                            .font(.system(size: 32, weight: .heavy))
                            .foregroundStyle(.white)
                        Text("HERE")
                            .font(.system(size: 10, weight: .heavy))
                            .tracking(1)
                            .foregroundStyle(.white.opacity(0.85))
                    }
                }
        }
        .frame(width: 220, height: 220)
        .onAppear {
            withAnimation(.linear(duration: 2.2).repeatForever(autoreverses: false)) {
                phase = 1
            }
        }
    }
}
