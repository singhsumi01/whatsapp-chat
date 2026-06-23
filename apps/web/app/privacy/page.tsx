import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Shield, Lock, Eye, Database, FileText, Globe, Key, Bell, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - WaChat",
  description: "Learn how WaChat collects, uses, and secures your information when using our WhatsApp Cloud API SaaS platform.",
};

const sections = [
  {
    id: "info-collection",
    title: "1. Information We Collect",
    icon: Database,
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          We collect information to provide, secure, and improve our services. We organize this data into the following categories:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-border/60 bg-card/30 hover:bg-card/50 hover:border-primary/20 transition-all duration-200">
            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Account Information
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Name, email address, Clerk authentication ID, and profile picture provided during sign-up.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/60 bg-card/30 hover:bg-card/50 hover:border-primary/20 transition-all duration-200">
            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Meta API Credentials
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              WhatsApp Business API access tokens, Phone ID, and Business Account ID. Stored securely to authenticate requests to Meta.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/60 bg-card/30 hover:bg-card/50 hover:border-primary/20 transition-all duration-200">
            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Message & Contact Metadata
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Contact numbers, broadcast groups, template structures, and message delivery status. We do not permanently store message bodies.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/60 bg-card/30 hover:bg-card/50 hover:border-primary/20 transition-all duration-200">
            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Media Files
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Images, audio, videos, and PDF documents uploaded directly to S3 storage for attachment in broadcast messages.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 p-5 rounded-xl border border-border/60 bg-card/30 hover:bg-card/50 hover:border-primary/20 transition-all duration-200">
            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Billing & Subscriptions
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Subscription plans and transaction records. Payments are securely routed through Razorpay; card credentials never touch our databases.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "use-of-info",
    title: "2. How We Use Your Information",
    icon: Eye,
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          WaChat utilizes your system data and profile properties for the following core operations:
        </p>
        <div className="space-y-1">
          {[
            "To provision your user account and authenticate updates to settings dashboard.",
            "To interface with the Meta Cloud API to send your broadcast campaigns and deliver template structures.",
            "To display metrics on your dashboard (usage limit metrics, S3 media usage, contact list sizes).",
            "To process billing renewals, invoice subscription status, and handle secure subscription upgrades.",
            "To dispatch service notifications, limit warnings, and billing reminders.",
            "To audit API limits, prevent abuse, and verify compliance with Meta Developer Policies."
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-1 rounded-lg bg-muted/20 border border-transparent hover:border-border/30 transition-all duration-150">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "data-sharing",
    title: "3. Service Providers & Data Processors",
    icon: Globe,
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          We share your data only with verified service providers to ensure secure app delivery. We do not sell your data under any circumstances.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Clerk", purpose: "Identity Verification & Sessions", type: "Auth Platform" },
            { name: "NeonDB", purpose: "Relational Data & Config Storage", type: "Postgres Provider" },
            { name: "Amazon S3", purpose: "Media Attachment Hosting", type: "Storage Cloud" },
            { name: "Razorpay", purpose: "PCI-Compliant Subscriptions", type: "Payment Gateway" },
            { name: "Meta Cloud API", purpose: "WhatsApp Message Delivery", type: "API Platform" }
          ].map((provider, index) => (
            <div key={index} className="p-4 rounded-xl border border-border/50 bg-card/25 flex flex-col justify-between hover:border-primary/10 transition-colors">
              <div>
                <span className="text-xs font-semibold text-primary px-2.5 py-0.5 rounded-full bg-primary/5 border border-primary/15 inline-block mb-3">
                  {provider.type}
                </span>
                <h4 className="font-bold text-foreground text-base mb-1">{provider.name}</h4>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{provider.purpose}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "security",
    title: "4. Data Security & Encryption",
    icon: Lock,
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          We employ strict security policies to protect business configurations and access tokens from unauthorized access:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-4 p-4 rounded-xl bg-muted/10 border">
            <div className="p-2 rounded-lg bg-primary/5 text-primary h-fit">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-semibold text-foreground text-sm mb-1">Encrypted API Credentials</h5>
              <p className="text-muted-foreground text-xs leading-relaxed">WhatsApp access tokens are secured using database environment-level encryption protocols.</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-xl bg-muted/10 border">
            <div className="p-2 rounded-lg bg-primary/5 text-primary h-fit">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-semibold text-foreground text-sm mb-1">Enforced HTTPS/SSL</h5>
              <p className="text-muted-foreground text-xs leading-relaxed">All active data transmission between browser clients and servers is secure under TLS encryption.</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-xl bg-muted/10 border">
            <div className="p-2 rounded-lg bg-primary/5 text-primary h-fit">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-semibold text-foreground text-sm mb-1">Database Access Control</h5>
              <p className="text-muted-foreground text-xs leading-relaxed">Database connection visibility is restricted strictly to backend application workflow engines.</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-xl bg-muted/10 border">
            <div className="p-2 rounded-lg bg-primary/5 text-primary h-fit">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-semibold text-foreground text-sm mb-1">Razorpay PCI Isolation</h5>
              <p className="text-muted-foreground text-xs leading-relaxed">Credit card credentials never hit our servers and are processed securely by Razorpay.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "meta-compliance",
    title: "5. Meta Developer Compliance",
    icon: Shield,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          WaChat operates as an independent service wrapping Meta Cloud API endpoints. You are responsible for ensuring your business broadcasts comply with the WhatsApp Business Policy guidelines.
        </p>
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 flex gap-3.5 items-start">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 mr-2" />
          <div className="text-xs leading-relaxed">
            <strong>Important Spam Warnings:</strong> Meta limits messaging volume and suspends business numbers that generate high user report rates. You agree that WaChat holds no liability or responsibility for bans or losses associated with numbers disabled by Meta.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "your-rights",
    title: "6. Your Rights & Data Deletion",
    icon: FileText,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          You retain full control over your business details stored on WaChat. You may clear credentials or download templates directly from settings.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          To delete your account and wipe all database configurations and media attachments, send an request email to:
        </p>
        <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-bold text-foreground text-sm">Account Deletion Request</h5>
              <p className="text-muted-foreground text-xs">Purges S3 files and NeonDB configurations.</p>
            </div>
          </div>
          <a
            href="mailto:contact@wachat.tech"
            className="text-xs font-semibold text-primary px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all"
          >
            contact@wachat.tech
          </a>
        </div>
      </div>
    ),
  },
];

export default function PrivacyPolicyPage() {
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
            <Shield className="h-3.5 w-3.5" />
            Security & Trust
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Your trust is our priority. Learn how we handle your personal data and protect your business credentials on WaChat.
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
                <h2 className="text-2xl font-extrabold tracking-tight">Introduction</h2>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Welcome to WaChat. We are committed to protecting the privacy and security of your business communications and technical parameters. This Privacy Policy describes how we collect, process, and protect your information when you access or use WaChat (the &ldquo;Service&rdquo; or &ldquo;Platform&rdquo;), operated as an enterprise WhatsApp Cloud API gateway integration.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  By accessing or using WaChat, you agree to the collection and use of information in accordance with this Privacy Policy.
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

            {/* Questions Banner */}
            <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/5 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
              <div className="space-y-1.5">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Have questions about our data safety?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Our team is dedicated to transparent credentials storage. Drop us a line.
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
