import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FileText, ShieldAlert, BadgeCent, Scale, Layers, AlertCircle, CheckCircle2, HelpCircle, ShieldAlert as BanIcon } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions - WaChat",
  description: "Review the WaChat terms of service, subscription policies, WhatsApp Cloud API fair usage, and liability limitations.",
};

const sections = [
  {
    id: "account-registration",
    title: "1. User Accounts & Access",
    icon: Layers,
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          To access the WaChat dashboard, you must register for an account using our secure authentication provider (Clerk).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-border/60 bg-card/30 hover:bg-card/50 transition-all">
            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Registration Accuracy
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              You agree to provide true, current, and complete details during sign-up to prevent billing verification errors.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/60 bg-card/30 hover:bg-card/50 transition-all">
            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Access Security
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              You are responsible for keeping your password, API keys, and database tokens private and confidential.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/60 bg-card/30 hover:bg-card/50 transition-all">
            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Account Activity
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              You assume full liability for any broadcasts sent or API keys provisioned under your registered account.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/60 bg-card/30 hover:bg-card/50 transition-all">
            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Breach Notification
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              You must report any security leaks or unauthorized access to our support inbox immediately.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "whatsapp-policy",
    title: "2. WhatsApp & Meta API Compliance",
    icon: ShieldAlert,
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          WaChat connects you directly to Meta&apos;s Cloud API. Since WhatsApp Business requires strict quality checks, you acknowledge the following constraints:
        </p>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border bg-muted/10 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Meta Setup Requirement:</strong> You must maintain your own Meta Business Developer configuration, verify your WhatsApp phone number, and adhere to Meta&apos;s terms of service.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-3 text-red-600 dark:text-red-400">
            <BanIcon className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
            <div className="text-xs leading-relaxed">
              <strong className="text-foreground dark:text-red-400">Spam Prohibition (No Unsolicited Messages):</strong> You shall not send spam, automated bulk blasts to cold contacts, or content violating Meta&apos;s rules. Explicit user opt-in is mandatory.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 flex items-start gap-3 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500" />
            <div className="text-xs leading-relaxed">
              <strong className="text-foreground dark:text-amber-400">No Liability for Meta Account Bans:</strong> Meta flags numbers based on customer spam reports. If Meta suspends your number or disables your account, <strong className="text-foreground dark:text-amber-400">WaChat is not liable</strong> for lost profits or business interruptions.
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "billing-refunds",
    title: "3. Subscriptions & Refund Policy",
    icon: BadgeCent,
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Payments and subscription features are handled securely via Razorpay under the following rules:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border bg-muted/10 flex flex-col justify-between">
            <div>
              <h5 className="font-bold text-foreground text-sm mb-1.5">Recurring Billing</h5>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Subscriptions renew every 30 days automatically. You can cancel your tier from the Billing panel at any time.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col justify-between">
            <div>
              <h5 className="font-bold text-foreground text-sm mb-1.5">7-Day Refund Policy</h5>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We offer a 7-day money-back guarantee. Request cancellation via email within 7 days of your initial purchase for a full refund.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-muted/10 flex flex-col justify-between">
            <div>
              <h5 className="font-bold text-foreground text-sm mb-1.5">Refund Restrictions</h5>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Refunds are not granted if your account is terminated or your phone number is banned by Meta for spam violations.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "api-keys-limits",
    title: "4. API Usage & Limits",
    icon: AlertCircle,
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          We rate-limit access to protect system stability and enforce plan limits.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-4 p-4 rounded-xl bg-card border">
            <div className="p-2 rounded-lg bg-primary/5 text-primary h-fit">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-semibold text-foreground text-sm mb-1">Plan Limitations</h5>
              <p className="text-muted-foreground text-xs leading-relaxed">Broadcast volumes, group size limits, and media storage capacity are bound by your subscription tier.</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-xl bg-card border">
            <div className="p-2 rounded-lg bg-primary/5 text-primary h-fit">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-semibold text-foreground text-sm mb-1">Stability Rate Limiting</h5>
              <p className="text-muted-foreground text-xs leading-relaxed">Accounts generating excessive API requests that impact platform availability may be temporarily throttled.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "liability-governing-law",
    title: "5. Limitation of Liability & Governing Law",
    icon: Scale,
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT ANY WARRANTY. WACHAT DISCLAIMS ALL LIABILITY FOR CONSEQUENTIAL LOSSES:
        </p>
        <div className="p-5 rounded-xl border bg-muted/10 space-y-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            In no event shall the creators or developers of WaChat be liable for damages, lost revenue, metadata database corruption, or business disruptions arising out of or related to using this platform or Meta Cloud API suspensions.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground border-t pt-3">
            These Terms & Conditions are governed by the laws of <strong className="text-foreground">India</strong>. Any legal action or dispute arising under this agreement shall be handled exclusively in courts located in that jurisdiction.
          </p>
        </div>
      </div>
    ),
  },
];

export default function TermsConditionsPage() {
  const lastUpdated = "June 23, 2026";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 pb-24 relative overflow-hidden mt-10 mb-10">
        {/* Ambient Top Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-primary/5 via-transparent to-transparent blur-3xl pointer-events-none" />

        {/* Page Header */}
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-4">
            <FileText className="h-3.5 w-3.5" />
            Legal Agreement
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Please read these Terms carefully. They govern your use of our platform and outline responsibilities regarding the WhatsApp Cloud API.
          </p>
          <p className="text-xs text-muted-foreground mt-5">
            Last updated: <span className="font-semibold text-foreground">{lastUpdated}</span>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-4 gap-10 mt-6 relative z-10">
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 rounded-2xl border bg-card/45 backdrop-blur-md p-4 space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-3 mb-3">
                Sections
              </h3>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150"
                >
                  <section.icon className="h-4 w-4 shrink-0 text-muted-foreground/75" />
                  <span className="truncate">{section.title.split(". ")[1]}</span>
                </a>
              ))}
            </div>
          </aside>

          {/* Main Legal Text Container */}
          <div className="lg:col-span-3 w-full max-w-4xl mx-auto space-y-10">
            <div className="rounded-2xl border bg-card/30 backdrop-blur-md p-6 sm:p-10 space-y-12 shadow-sm">
              {/* Introduction */}
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold tracking-tight">Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  By creating an account, accessing, or using WaChat (the &ldquo;Service&rdquo; or &ldquo;Platform&rdquo;), you agree to comply with and be bound by these Terms & Conditions (the &ldquo;Terms&rdquo;). If you do not agree with any part of these Terms, you must immediately cease accessing or using our Service.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  These Terms apply to all visitors, users, and business owners who register an account or interact with the WaChat API gateway dashboard.
                </p>
              </div>

              {/* Dynamic Sections */}
              {sections.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="space-y-6 scroll-mt-24 mt-8"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 text-primary mr-4">
                      <section.icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  <div className="text-sm leading-relaxed text-muted-foreground">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Support Contact Banner */}
            <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/5 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
              <div className="space-y-1.5">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Need clarification on these terms?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Our compliance team is here to assist with usage and refund requests.
                </p>
              </div>
              <a
                href="mailto:contact@wachat.tech"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/10"
              >
                contact@wachat.tech
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
