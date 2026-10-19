import AppKit
import Foundation
import Vision

struct OCRLine: Encodable {
  let text: String
  let confidence: Float
  let x: CGFloat
  let y: CGFloat
}

guard CommandLine.arguments.count == 2 else {
  FileHandle.standardError.write(Data("Uso: vision-ocr <imagen.png>\n".utf8))
  exit(64)
}

let imagePath = CommandLine.arguments[1]
guard let image = NSImage(contentsOfFile: imagePath),
      let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
  FileHandle.standardError.write(Data("No se pudo abrir la imagen.\n".utf8))
  exit(65)
}

let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.usesLanguageCorrection = false
request.recognitionLanguages = ["es-ES"]

do {
  try VNImageRequestHandler(cgImage: cgImage, options: [:]).perform([request])
  let lines = (request.results ?? [])
    .compactMap { observation -> OCRLine? in
      guard let candidate = observation.topCandidates(1).first else { return nil }
      let box = observation.boundingBox
      return OCRLine(text: candidate.string, confidence: candidate.confidence, x: box.minX, y: box.minY)
    }
    .sorted { left, right in
      abs(left.y - right.y) > 0.015 ? left.y > right.y : left.x < right.x
    }
  let output = try JSONEncoder().encode(lines)
  FileHandle.standardOutput.write(output)
} catch {
  FileHandle.standardError.write(Data("OCR falló: \(error.localizedDescription)\n".utf8))
  exit(70)
}
