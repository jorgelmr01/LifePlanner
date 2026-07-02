# ADR-004: Authentication and Security

**Status:** Superseded by [ADR-006](ADR-006-pwa-pivot.md) (pivote a PWA, julio 2026)  
**Date:** January 2026  
**Decision Makers:** Development Team

---

## Context

Life Copilot stores highly sensitive personal data including:
- Private journal entries
- Relationship details
- Religious/spiritual content
- Health and mood tracking

Per DESIGN_DECISIONS.md and PRODUCT_SPEC.md:
- App should have PIN/biometric lock
- Multiple privacy levels for entries (normal, private, ultra-private)
- Areas can be hidden and require additional authentication
- No cloud account required in MVP/V1

## Decision

**We will implement local-only authentication using PIN + biometrics, with no cloud account required. Ultra-private content will have an additional encryption layer.**

## Options Considered

### Option A: Local PIN + Biometrics Only
**Pros:**
- No backend required
- Works offline
- Simple user experience
- Aligns with local-first philosophy
- No password to remember/forget

**Cons:**
- No account recovery
- No sync between devices
- Device-bound security

### Option B: Cloud Account + Local PIN
**Pros:**
- Account recovery possible
- Foundation for multi-device sync
- Familiar pattern for users

**Cons:**
- Requires backend infrastructure
- More complex implementation
- Privacy concerns with account data

### Option C: Local Only with Recovery Key
**Pros:**
- No backend needed
- Recovery option available
- Privacy preserved

**Cons:**
- Users must manage recovery key
- Complexity in explaining recovery process

## Rationale

Local PIN + Biometrics is chosen because:

1. **Local-First**: PRODUCT_SPEC.md Section 13.2 explicitly states "No requiere cuenta ni servidor"

2. **Privacy**: Users don't need to share any identifying information with our servers

3. **Simplicity**: One less barrier to adoption - no account creation

4. **Platform Integration**: Both iOS and Android have excellent biometric APIs

5. **Offline First**: Authentication works without internet

## Consequences

### Positive
- Zero backend authentication costs
- Complete user privacy
- Fast app launch with biometrics
- Works fully offline
- No password recovery support burden

### Negative
- No recovery if PIN forgotten AND biometrics fail
- Device-bound - new device means fresh start (until V2 sync)
- No remote wipe capability

### Risks
- User locks themselves out
- Device loss means data loss

### Mitigations
- Encourage regular exports (JSON backup)
- Clear warning during PIN setup
- Biometric fallback reduces PIN-only risk
- V2 sync will provide additional backup

## Implementation Notes

### Authentication Flow

```
App Launch
    │
    ▼
┌─────────────────────────────┐
│ Has PIN been set?           │
│                             │
│  NO ─────► Use app freely   │
│            (setup prompt)   │
│                             │
│  YES ──┐                    │
└────────┼────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Biometrics enabled?         │
│                             │
│  YES ──► Prompt biometric   │
│            │                │
│            ├─► Success ──► ✓│
│            │                │
│            └─► Fail ──┐     │
│                       │     │
│  NO ──────────────────┼     │
└───────────────────────┼─────┘
                        │
                        ▼
              ┌─────────────────┐
              │ Enter PIN       │
              │                 │
              │ Success ──► ✓   │
              │                 │
              │ 3 fails ──► Wait│
              └─────────────────┘
```

### Privacy Levels

```dart
enum PrivacyLevel {
  normal,    // Visible everywhere
  private,   // Hidden from previews/widgets
  ultraPrivate, // Requires additional PIN, separate encryption
}

class EntryPrivacy {
  // Normal: Standard database encryption
  // Private: Same encryption, but excluded from:
  //   - Dashboard previews
  //   - Widget displays
  //   - Quick search results
  // Ultra-private: Additional entry-level encryption
  //   - Stored with separate key
  //   - Requires PIN on each access
  //   - Excluded from all exports unless explicitly included
}
```

### Ultra-Private Encryption

```dart
class UltraPrivateService {
  static const _keyName = 'ultra_private_key';
  
  final FlutterSecureStorage _storage;
  
  // Derive key from user's ultra-private PIN
  Future<SecretKey> _deriveKey(String pin) async {
    final algorithm = Argon2id(
      memory: 65536,
      parallelism: 2,
      iterations: 3,
      hashLength: 32,
    );
    return algorithm.deriveKey(
      secretKey: SecretKey(utf8.encode(pin)),
      nonce: await _getSalt(),
    );
  }
  
  Future<String> encrypt(String plaintext, String pin) async {
    final key = await _deriveKey(pin);
    final algorithm = AesGcm.with256bits();
    final secretBox = await algorithm.encrypt(
      utf8.encode(plaintext),
      secretKey: key,
    );
    return base64Encode(secretBox.concatenation());
  }
  
  Future<String> decrypt(String ciphertext, String pin) async {
    final key = await _deriveKey(pin);
    final algorithm = AesGcm.with256bits();
    final bytes = base64Decode(ciphertext);
    final secretBox = SecretBox.fromConcatenation(
      bytes,
      nonceLength: algorithm.nonceLength,
      macLength: algorithm.macAlgorithm.macLength,
    );
    final decrypted = await algorithm.decrypt(secretBox, secretKey: key);
    return utf8.decode(decrypted);
  }
}
```

### Biometric Setup

```dart
class BiometricService {
  final LocalAuthentication _auth = LocalAuthentication();
  
  Future<bool> isAvailable() async {
    return await _auth.canCheckBiometrics ||
           await _auth.isDeviceSupported();
  }
  
  Future<List<BiometricType>> getAvailableTypes() async {
    return await _auth.getAvailableBiometrics();
  }
  
  Future<bool> authenticate({String? reason}) async {
    try {
      return await _auth.authenticate(
        localizedReason: reason ?? 'Desbloquea Life Copilot',
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: false, // Allow PIN fallback on device
        ),
      );
    } on PlatformException catch (e) {
      // Handle specific errors
      return false;
    }
  }
}
```

### PIN Storage

```dart
class PinService {
  final FlutterSecureStorage _storage;
  
  // Store hashed PIN, never plain text
  Future<void> setPin(String pin) async {
    final hash = sha256.convert(utf8.encode(pin + await _getSalt()));
    await _storage.write(key: 'pin_hash', value: hash.toString());
  }
  
  Future<bool> verifyPin(String pin) async {
    final storedHash = await _storage.read(key: 'pin_hash');
    if (storedHash == null) return false;
    
    final inputHash = sha256.convert(utf8.encode(pin + await _getSalt()));
    return storedHash == inputHash.toString();
  }
  
  Future<String> _getSalt() async {
    var salt = await _storage.read(key: 'pin_salt');
    if (salt == null) {
      salt = _generateRandomSalt();
      await _storage.write(key: 'pin_salt', value: salt);
    }
    return salt;
  }
}
```

### Auto-Lock Configuration

```dart
class AutoLockService {
  // Lock after X seconds of inactivity
  static const defaultTimeout = Duration(minutes: 5);
  
  Timer? _lockTimer;
  
  void resetTimer(Duration timeout) {
    _lockTimer?.cancel();
    _lockTimer = Timer(timeout, _lockApp);
  }
  
  void _lockApp() {
    // Navigate to lock screen
    // Clear sensitive data from memory
  }
}
```

### Key Packages
- `local_auth: ^2.x` - Biometric authentication
- `flutter_secure_storage: ^9.x` - Secure key/PIN storage
- `cryptography: ^2.x` - Encryption utilities
- `crypto: ^3.x` - Hashing utilities

## References

- [local_auth Package](https://pub.dev/packages/local_auth)
- [flutter_secure_storage Package](https://pub.dev/packages/flutter_secure_storage)
- iOS Keychain Documentation
- Android Keystore Documentation
- PRODUCT_SPEC.md Section 13.4 (Privacidad técnica)
- DESIGN_DECISIONS.md Section "Nivel de privacidad por defecto"
