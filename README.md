# SaaSassin Trust

**Free, open-source Vanta alternative.** Run compliance from customer-controlled controls, evidence, and connector history.

Compliance automation for security and operations teams preparing for audits without surrendering their evidence graph.

- **Try it:** [trust.saasassin.net](https://trust.saasassin.net)
- **Research brief and product decision:** [saasassin.net/targets/vanta](https://saasassin.net/targets/vanta)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Falibad%2Fsaasassin-trust&project-name=saasassin-trust&repository-name=saasassin-trust&env=NEXT_PUBLIC_FIREBASE_API_KEY%2CNEXT_PUBLIC_FIREBASE_AUTH_DOMAIN%2CNEXT_PUBLIC_FIREBASE_PROJECT_ID%2CNEXT_PUBLIC_FIREBASE_APP_ID%2CFIREBASE_PROJECT_ID%2CFIREBASE_CLIENT_EMAIL%2CFIREBASE_PRIVATE_KEY&envDescription=Firebase+web+app+config+and+service-account+credentials+%28see+the+README%29&envLink=https%3A%2F%2Fgithub.com%2Falibad%2Fsaasassin-trust%231-create-a-firebase-project)

Vanta is a trademark of its owner and is named here only to describe what this product
replaces. SaaSassin Trust is an independent, clean-room product and is not affiliated
with or endorsed by Vanta.

## What you can do today

| Area | Works end-to-end against Firestore |
|------|-------------------------------------|
| Workspaces | Create a workspace, switch between workspaces, invite members by email as admin, member, or viewer (read-only, suited to auditors), sign out |
| Frameworks | Pick SOC 2 common criteria (CC1–CC9, 33 controls) and/or an ISO 27001:2022 Annex A subset (15 controls) from a built-in library, versioned `2026.10.0`, with SaaSassin's own paraphrased wording |
| Controls | Assign owners; set status (not started, in progress, implemented, needs evidence, not applicable). Not applicable requires a written justification |
| Evidence | Attach a link or pasted text to one or more controls (also straight from a control), with collection date, review cadence, or explicit expiry. When evidence expires, its controls show **needs evidence** automatically; implemented controls with no current evidence do too. Owners and admins accept or reject evidence, and rejection needs a reason. Reviewer, time, and self-review are recorded, and rejected evidence never supports a control |
| Policies | Create from 8 templates (information security, access control, incident response, vendor management, change management, continuity/backup, acceptable use, data retention). Edits create new versions; approved text is never rewritten. Admins approve the latest version; people acknowledge it |
| Acknowledgements | Coverage is measured against members plus a list of employees in scope. Admins can record a signed acknowledgement on someone's behalf, and the record keeps who entered it |
| Risks | Likelihood × impact scoring (1–25, banded low/medium/high/critical), treatment (accepting a risk requires a written rationale), owner, linked controls, open/closed, plus a 5×5 heat map |
| Vendors | Inventory with risk tier, data access, owner, last review, and cadence. Overdue reviews are flagged |
| Readiness | Control coverage %, evidence freshness %, open and high risks, policies approved, and acknowledgement % — all computed live from tenant data, each with its definition shown |
| Gap tasks | Generated from real gaps (missing owner, missing or expiring evidence, unapproved or overdue policies, pending acknowledgements, untreated high risks, overdue vendors), ordered by priority, and linked to the right tab |
| Trust center | Public page at `/apps/trust/t/{tenantId}`, off by default. Admins choose: frameworks, readiness %, per-category counts, and which approved policies to list. Evidence, owners, risks, vendors, and policy text are never published |
| Export | Full workspace as versioned JSON (`net.saasassin.trust.*@1.0.0` plus the shared manifest), and an audit-ready **evidence package** per framework (requirement → controls → status/owner/justification → evidence with dates and freshness) |
| Audit periods | Admins create an audit window per framework and give an auditor (viewer) read-only access until a date. After that date, or on revoke, the server refuses that auditor's snapshot, actions, and exports with a 403 |
| Findings | Issues linked to controls and audit periods, with severity, owner, due date, and remediation status (open / in remediation / resolved / risk accepted, which needs a rationale). Overdue findings become high-priority tasks and appear in the evidence package |
| Library migration | Each program is pinned to the control ids it adopted. When the built-in library changes, admins see a diff (added / retired / unchanged), apply it explicitly, and the migration is audited. Stored control records are kept |
| Access reviews | List critical systems and their users, then sign off a review each quarter: mark who to remove, and Trust records the reviewer plus who was kept and removed. A quarter cannot be signed off twice, due reviews become tasks, and reviews are exported |
| Activity | Every change goes to the append-only audit log, which is visible in Team & activity |

Full status, verification and known gaps: [docs/STATUS.md](docs/STATUS.md).

## Self-host

SaaSassin Trust is a Next.js app backed by Firebase Authentication and Cloud Firestore.
You need Node.js 20.9 or newer, [pnpm](https://pnpm.io/installation) and a Firebase project of
your own.

### 1. Create a Firebase project

1. Create a project in the [Firebase console](https://console.firebase.google.com/).
2. **Firestore:** Build → Firestore Database → Create database.
3. **Authentication:** Build → Authentication → Get started. Trust signs people in with
   **Google** and **Email/Password**; step 2 below enables both, or enable them yourself under
   Authentication → Sign-in method.
4. **Web app config:** Project settings → General → Your apps → add a Web app. Copy its config
   into the `NEXT_PUBLIC_FIREBASE_*` variables.
5. **Service account:** Project settings → Service accounts → Generate new private key. From the
   downloaded JSON, set `FIREBASE_PROJECT_ID` (`project_id`), `FIREBASE_CLIENT_EMAIL`
   (`client_email`) and `FIREBASE_PRIVATE_KEY` (`private_key`). Never commit the key, and never
   give these variables a `NEXT_PUBLIC_` prefix.
6. Once you deploy, add your domain under Authentication → Settings → Authorized domains
   (`localhost` is already allowed).

### 2. Deploy the rules, indexes and sign-in providers

```bash
pnpm install
pnpm exec firebase login
pnpm exec firebase deploy --only firestore:rules,firestore:indexes,auth --project <your-project-id>
```

`firestore.rules` denies all browser access to product data: every read and write goes through the server routes, which check the session, tenant membership and role with the Firebase Admin SDK. `auth` enables the Google and email/password providers listed in `firebase.json`.

### 3. Run it

```bash
cp .env.example .env.local   # fill in the values from step 1
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). This repository serves SaaSassin
Trust at the root of every host: `next.config.ts` sets `STANDALONE_PRODUCT=trust`,
and `src/proxy.ts` maps `/` to the product (`/apps/trust`) and `/sign-in` to its sign-in page.

### 4. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Falibad%2Fsaasassin-trust&project-name=saasassin-trust&repository-name=saasassin-trust&env=NEXT_PUBLIC_FIREBASE_API_KEY%2CNEXT_PUBLIC_FIREBASE_AUTH_DOMAIN%2CNEXT_PUBLIC_FIREBASE_PROJECT_ID%2CNEXT_PUBLIC_FIREBASE_APP_ID%2CFIREBASE_PROJECT_ID%2CFIREBASE_CLIENT_EMAIL%2CFIREBASE_PRIVATE_KEY&envDescription=Firebase+web+app+config+and+service-account+credentials+%28see+the+README%29&envLink=https%3A%2F%2Fgithub.com%2Falibad%2Fsaasassin-trust%231-create-a-firebase-project)

The button copies this repository into your GitHub account, creates a Vercel project and asks for
the Firebase variables. To deploy an existing fork instead, import it in Vercel and add the
variables from `.env.example` under Project Settings → Environment Variables. Either way, add the
Vercel domain to your Firebase authorized domains afterwards.

## Tests

```bash
pnpm lint
pnpm typecheck
pnpm test        # unit tests
pnpm build
```

The Firestore suites run against the local Firestore emulator, which needs a Java 21+ JDK first on
your `PATH`:

```bash
export JAVA_HOME=/path/to/jdk-21   # macOS example: /Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
pnpm test:rules      # Firestore security rules
pnpm test:emulator   # the golden workflow against a real Firestore emulator
```

## Contributing

Development happens in the SaaSassin monorepo,
[github.com/alibad/saasassin](https://github.com/alibad/saasassin), the single source of truth for
all ten SaaSassin products. This repository is generated from it by the monorepo's
`scripts/export-product.mjs`, so accepted changes land in the monorepo first and are then synced
here. Open issues and pull requests there or here.

Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## Talk to us

Moving off Vanta, running Trust for your team, or want to help build it?
[Tell us on saasassin.net](https://saasassin.net/targets/vanta#interest).

## License

[GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0-only). Use it, self-host it and modify
it; if you run a modified version as a network service, publish your changes under the same
license.
