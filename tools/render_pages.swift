// Render the first pages of a PDF side by side into one PNG (used to read title / credits pages). Offline, macOS PDFKit.
// Usage: swift tools/render_pages.swift <in.pdf> <out.png> [pages=3] [heightPx=700]
import Foundation
import PDFKit
import AppKit

let a = CommandLine.arguments
guard a.count >= 3, let doc = PDFDocument(url: URL(fileURLWithPath: a[1])) else { print("usage: in.pdf out.png [pages] [height]"); exit(1) }
let n = min(a.count > 3 ? Int(a[3]) ?? 3 : 3, doc.pageCount), H = CGFloat(a.count > 4 ? Double(a[4]) ?? 700 : 700)
var imgs: [NSImage] = []
for i in 0..<n {
  guard let p = doc.page(at: i) else { continue }
  let b = p.bounds(for: .mediaBox), w = H * b.width / b.height
  imgs.append(p.thumbnail(of: NSSize(width: w, height: H), for: .mediaBox))
}
let W = imgs.reduce(0) { $0 + $1.size.width } + CGFloat(max(0, imgs.count - 1)) * 8
let out = NSImage(size: NSSize(width: W, height: H))
out.lockFocus(); NSColor.white.setFill(); NSRect(x: 0, y: 0, width: W, height: H).fill()
var x: CGFloat = 0
for im in imgs { im.draw(in: NSRect(x: x, y: 0, width: im.size.width, height: H)); x += im.size.width + 8 }
out.unlockFocus()
guard let t = out.tiffRepresentation, let r = NSBitmapImageRep(data: t), let png = r.representation(using: .png, properties: [:]) else { exit(1) }
try png.write(to: URL(fileURLWithPath: a[2])); print("\(n) pages → \(a[2])")
