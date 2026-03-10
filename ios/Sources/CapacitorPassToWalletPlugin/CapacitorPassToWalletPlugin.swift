import Foundation
import Capacitor
import PassKit

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(CapacitorPassToWalletPlugin)
public class CapacitorPassToWalletPlugin: CAPPlugin, CAPBridgedPlugin {
    private enum PluginError: LocalizedError {
        case invalidPassData
        case invalidBase64
        case missingInput
        case unsupportedUriScheme(String)
        case unableToPresent
        case noValidPasses
        case allPassesAlreadyExist

        var errorCode: String {
            switch self {
            case .invalidPassData:
                return "101"
            case .invalidBase64:
                return "102"
            case .noValidPasses:
                return "103"
            case .missingInput:
                return "104"
            case .unsupportedUriScheme:
                return "105"
            case .unableToPresent:
                return "106"
            case .allPassesAlreadyExist:
                return "107"
            }
        }

        var errorDescription: String? {
            switch self {
            case .invalidPassData:
                return "PKPASS file has invalid data"
            case .invalidBase64:
                return "Error with base64 data"
            case .missingInput:
                return "Either base64 or filePath is required"
            case .unsupportedUriScheme(let scheme):
                return "Unsupported URI scheme: \(scheme)"
            case .unableToPresent:
                return "Unable to present Apple Wallet view controller"
            case .noValidPasses:
                return "PKPASSES file has invalid data"
            case .allPassesAlreadyExist:
                return "All provided passes already exist in Apple Wallet"
            }
        }
    }

    public let identifier = "CapacitorPassToWalletPlugin"
    public let jsName = "CapacitorPassToWallet"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "addToWallet", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "addMultipleToWallet", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "passExists", returnType: CAPPluginReturnPromise),
    ]
    private let implementation = CapacitorPassToWallet()

    private func reject(_ call: CAPPluginCall, _ error: PluginError) {
        call.reject(error.localizedDescription, error.errorCode)
    }

    private func reject(_ call: CAPPluginCall, _ error: Error) {
        if let pluginError = error as? PluginError {
            reject(call, pluginError)
            return
        }
        call.reject(error.localizedDescription)
    }

    private func resolveAdded(_ call: CAPPluginCall) {
        call.resolve([
            "value": implementation.echo("added")
        ])
    }

    private func readPassData(base64: String?, filePath: String?) throws -> Data {
        let encoded = base64?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
        if !encoded.isEmpty {
            if let dataPass = Data(base64Encoded: encoded, options: .ignoreUnknownCharacters) {
                return dataPass
            }
            throw PluginError.invalidBase64
        }

        let rawPath = filePath?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
        if rawPath.isEmpty {
            throw PluginError.missingInput
        }

        let url: URL
        if let parsedUrl = URL(string: rawPath), let scheme = parsedUrl.scheme {
            if scheme != "file" {
                throw PluginError.unsupportedUriScheme(scheme)
            }
            url = parsedUrl
        } else {
            url = URL(fileURLWithPath: rawPath)
        }

        return try Data(contentsOf: url)
    }

    private func parsePass(from data: Data) throws -> PKPass {
        guard let pass = try? PKPass(data: data) else {
            throw PluginError.invalidPassData
        }
        return pass
    }

    @objc func addToWallet(_ call: CAPPluginCall) {
        do {
            let dataPass = try readPassData(base64: call.getString("base64"), filePath: call.getString("filePath"))
            let pass = try parsePass(from: dataPass)
            guard let vc = PKAddPassesViewController(pass: pass),
                  let bridgeViewController = self.bridge?.viewController else {
                reject(call, PluginError.unableToPresent)
                return
            }
            resolveAdded(call)
            bridgeViewController.present(vc, animated: true, completion: nil)
        } catch {
            reject(call, error)
        }
    }

    @objc func addMultipleToWallet(_ call: CAPPluginCall) {
        let base64Values = call.getArray("base64", String.self) ?? []
        let filePathValues = call.getArray("filePaths", String.self) ?? []

        if base64Values.isEmpty && filePathValues.isEmpty {
            reject(call, PluginError.missingInput)
            return
        }

        var pkPasses = [PKPass]()
        var seenIdentifiers = Set<String>()
        var existingPassesCount = 0
        var invalidPassesCount = 0

        for base64 in base64Values {
            do {
                let dataPass = try readPassData(base64: base64, filePath: nil)
                let pass = try parsePass(from: dataPass)
                let identifier = "\(pass.passTypeIdentifier)|\(pass.serialNumber)"
                if PKPassLibrary().containsPass(pass) {
                    existingPassesCount += 1
                } else if !seenIdentifiers.contains(identifier) {
                    pkPasses.append(pass)
                    seenIdentifiers.insert(identifier)
                }
            } catch {
                invalidPassesCount += 1
            }
        }

        for filePath in filePathValues {
            do {
                let dataPass = try readPassData(base64: nil, filePath: filePath)
                let pass = try parsePass(from: dataPass)
                let identifier = "\(pass.passTypeIdentifier)|\(pass.serialNumber)"
                if PKPassLibrary().containsPass(pass) {
                    existingPassesCount += 1
                } else if !seenIdentifiers.contains(identifier) {
                    pkPasses.append(pass)
                    seenIdentifiers.insert(identifier)
                }
            } catch {
                invalidPassesCount += 1
            }
        }

        if pkPasses.isEmpty {
            if existingPassesCount > 0 && invalidPassesCount == 0 {
                reject(call, PluginError.allPassesAlreadyExist)
                return
            }
            reject(call, PluginError.noValidPasses)
            return
        }

        guard let vc = PKAddPassesViewController(passes: pkPasses),
              let bridgeViewController = self.bridge?.viewController else {
            reject(call, PluginError.unableToPresent)
            return
        }

        resolveAdded(call)
        bridgeViewController.present(vc, animated: true, completion: nil)
    }

    @objc func passExists(_ call: CAPPluginCall) {
        do {
            let dataPass = try readPassData(base64: call.getString("base64"), filePath: call.getString("filePath"))
            let pass = try parsePass(from: dataPass)
            call.resolve([
                "passExists": PKPassLibrary().containsPass(pass)
            ])
        } catch {
            reject(call, error)
        }
    }
}
