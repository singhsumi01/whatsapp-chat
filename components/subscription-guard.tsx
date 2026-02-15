"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertTriangle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SubscriptionGuardProps {
  children: ReactNode;
  /**
   * Pages that don't require active subscription
   * e.g., ["/protected/settings/billing", "/protected/setup"]
   */
  allowedPaths?: string[];
}

interface SubscriptionStatus {
  isActive: boolean;
  subscription: {
    status: string;
    currentPeriodEnd: string | null;
  } | null;
  daysRemaining: number | null;
}

/**
 * Subscription Guard Component
 * Wraps protected content and ensures user has an active subscription
 * Shows a paywall for users with inactive/expired subscriptions
 */
export function SubscriptionGuard({
  children,
  allowedPaths = [],
}: SubscriptionGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default allowed paths (always accessible without active subscription)
  const defaultAllowedPaths = [
    "/protected/settings/billing",
    "/protected/setup",
  ];

  const allAllowedPaths = [...defaultAllowedPaths, ...allowedPaths];

  // Check if current path is allowed without subscription
  const isAllowedPath = allAllowedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/subscription/status");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to check subscription");
        }

        setStatus(data);
      } catch (err: any) {
        console.error("Subscription check error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [pathname]);

  // Show loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If path is allowed or subscription is active, render children
  if (isAllowedPath || status?.isActive) {
    return <>{children}</>;
  }

  // Show paywall for inactive subscriptions
  return (
    <div className="h-full flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
          </div>
          <CardTitle>Subscription Required</CardTitle>
          <CardDescription>
            {status?.subscription?.status === "EXPIRED"
              ? "Your subscription has expired. Please renew to continue using WaChat."
              : status?.subscription?.status === "CANCELLED"
                ? "Your subscription was cancelled. Please resubscribe to regain access."
                : "You need an active subscription to access this feature."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">₹500</p>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>

          <Button className="w-full" asChild>
            <Link href="/protected/settings/billing">
              <CreditCard className="h-4 w-4 mr-2" />
              Go to Billing
            </Link>
          </Button>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/pricing">View Pricing Details</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Hook to check subscription status
 * Lightweight version for conditional UI rendering
 */
export function useSubscriptionStatus() {
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/subscription/status");
        const data = await res.json();
        setIsActive(data.isActive);
      } catch (err) {
        setIsActive(false);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, []);

  return { isActive, loading };
}
