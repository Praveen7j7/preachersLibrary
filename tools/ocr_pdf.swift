// OCR a PDF whose text layer is unreadable (fonts without Unicode mapping), using macOS's built-in Vision framework.
// Local, offline, no tokens. Each page is rendered at 2x and read with the "accurate" recogniser.
//
// Usage: swift tools/ocr_pdf.swift <in.pdf> <out.txt> [first-page] [last-page]

import AppKit
import Foundation
import PDFKit
import Vision

let args = CommandLine.arguments
guard args.count >= 3, let doc = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
    print("usage: swift tools/ocr_pdf.swift <in.pdf> <out.txt> [first] [last]"); exit(1)
}
let first = args.count > 3 ? max(1, Int(args[3]) ?? 1) : 1
let last = args.count > 4 ? min(doc.pageCount, Int(args[4]) ?? doc.pageCount) : doc.pageCount
var out = "Source: \(URL(fileURLWithPath: args[1]).lastPathComponent) (OCR, macOS Vision)\n\n"

for i in (first - 1)..<last {
    autoreleasepool {
        guard let page = doc.page(at: i) else { return }
        let box = page.bounds(for: .mediaBox)
        let scale: CGFloat = 2
        let size = NSSize(width: box.width * scale, height: box.height * scale)
        let image = page.thumbnail(of: size, for: .mediaBox)
        guard let cg = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else { return }
        let request = VNRecognizeTextRequest()
        request.recognitionLevel = .accurate
        request.usesLanguageCorrection = true
        try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([request])
        let lines = (request.results ?? []).compactMap { $0.topCandidates(1).first?.string }
        out += "\n--- page \(i + 1) ---\n" + lines.joined(separator: "\n") + "\n"
    }
    if (i + 1) % 50 == 0 { FileHandle.standardError.write("page \(i + 1)/\(last)\n".data(using: .utf8)!) }
}
try! out.write(toFile: args[2], atomically: true, encoding: .utf8)
print("\(last - first + 1) pages → \(args[2]) (\(out.count) chars)")
