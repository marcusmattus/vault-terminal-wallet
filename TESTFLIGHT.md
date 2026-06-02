# TestFlight Submission Runbook

Step-by-step for pushing Vault Terminal Wallet to TestFlight. Steps marked
**(local)** must be run from your own machine — they need credentials this
repo's CI does not (and should not) hold.

---

## 0. One-time prerequisites

1. Active **Apple Developer Program** membership.
2. **App Store Connect** app record created:
   - Bundle ID: `com.marcusmattus.vaultterminalwallet` (matches `app.json`).
   - Platform: iOS.
   - Note the **ASC App ID** (numeric, from the App Store Connect URL) and your
     **Apple Team ID** (10-char alphanumeric, from `developer.apple.com` →
     Membership).
3. **Expo account** (free tier is fine): https://expo.dev/signup.

---

## 1. Fill in submit credentials

Edit `eas.json` and replace the three placeholders under `submit.production.ios`:

```json
"appleId": "your-apple-id@example.com",
"ascAppId": "1234567890",
"appleTeamId": "ABCDE12345"
```

Commit and push. (These are not secrets — they're identifiers.) The actual
Apple password / ASC API key is supplied at submit-time, not stored in the repo.

---

## 2. **(local)** Install + log in

```bash
npm install
npx eas login                  # Expo account
npx eas whoami                 # confirm
```

---

## 3. **(local)** Initialise the EAS project

```bash
npx eas init                   # creates extra.eas.projectId in app.json
npx eas credentials            # let EAS manage your iOS distribution cert
                               # + provisioning profile (recommended)
```

When prompted, sign in with your Apple ID. EAS will create the certificate
and provisioning profile in your developer account automatically.

---

## 4. **(local)** Build for TestFlight

```bash
npm run build:ios:production
```

This kicks off a cloud build on EAS. Takes ~15–25 min. Watch progress at the
URL printed in the terminal, or `https://expo.dev/accounts/<you>/projects/vault-terminal-wallet/builds`.

When it finishes you get a signed `.ipa` artefact.

---

## 5. **(local)** Submit to App Store Connect → TestFlight

```bash
npm run submit:ios
```

EAS uploads the latest production build to App Store Connect. When prompted,
provide an **App-Specific Password** (Apple ID → Sign-In and Security →
App-Specific Passwords) or an **ASC API Key** (recommended for repeat use).

Processing on Apple's side takes 5–30 min. Once "Ready to Test" appears in
App Store Connect → TestFlight, add internal testers (instant) or submit for
Beta App Review for external testing (~24h review).

---

## 6. Subsequent builds

Bump the build number (EAS does this automatically with `autoIncrement: true`
in `production` profile) and re-run:

```bash
npm run build:ios:production
npm run submit:ios
```

`version` (e.g. `1.0.0`) bumps only when shipping a new public release;
TestFlight cares about `buildNumber`.

---

## Known review risks for this app

Apple guidelines that apply:

- **§3.1.5(b) Cryptocurrencies** — self-custodial wallets are allowed but
  reviewed carefully. Be prepared to explain custody model (keys stored in
  Secure Enclave / `expo-secure-store`, never on a server).
- **§1.4.2 Physical Harm** — financial app must be accurate; risk scores
  must be substantiated.
- **§5.1.1 Data Collection** — KYC means a privacy policy URL is mandatory.
  Add it to the App Store Connect app record before submitting for review.
- **Encryption export compliance** — `app.json` declares
  `ITSAppUsesNonExemptEncryption: false` on the assumption that the app uses
  only standard cryptography (ECDSA signing via ethers/viem, HTTPS) that is
  exempt under EAR 740.17(b). If you add proprietary crypto, flip this to
  `true` and provide an export compliance code.

Internal TestFlight (up to 100 internal testers from your team) does **not**
require Beta App Review, so you can iterate freely before exposing to
external testers.
