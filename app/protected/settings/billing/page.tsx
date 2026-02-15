"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  useSubscription,
  formatSubscriptionStatus,
  formatAmount,
  canMakePayment,
} from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  CreditCard,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BillingPage() {
  const router = useRouter();
  const {
    data,
    payments,
    loading,
    paymentsLoading,
    error,
    refresh,
    fetchPayments,
  } = useSubscription();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Fetch payments on mount
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Handle subscription renewal/new payment
  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      setActionError(null);

      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const orderData = await orderRes.json();

      if (orderData.error) {
        throw new Error(orderData.error);
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "WaChat",
        description: "Premium Subscription - ₹500/month",
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setActionSuccess("Payment successful! Subscription activated.");
              refresh();
              fetchPayments();
            } else {
              setActionError(verifyData.error || "Payment verification failed");
            }
          } catch (err: any) {
            setActionError(err.message || "Payment verification failed");
          }
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },
        theme: {
          color: "#10B981",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setActionError(err.message || "Failed to initiate payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "EXPIRED":
      case "PAST_DUE":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // Payment status badge
  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      CAPTURED: "default",
      PENDING: "secondary",
      FAILED: "destructive",
      REFUNDED: "outline",
      AUTHORIZED: "secondary",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const subscription = data?.subscription;
  const status = subscription?.status || "INACTIVE";
  const statusInfo = formatSubscriptionStatus(status);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="h-full overflow-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Billing & Subscription</h1>
              <p className="text-muted-foreground">
                Manage your subscription and view payment history
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Alerts */}
          {actionError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {actionError}
            </div>
          )}

          {actionSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-600 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              {actionSuccess}
            </div>
          )}

          {/* Current Plan Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status)}
                  <div>
                    <CardTitle className="text-lg">
                      {subscription?.plan?.name || "Premium"} Plan
                    </CardTitle>
                    <CardDescription>
                      {formatAmount(subscription?.plan?.price || 500)}/month
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Subscription Details */}
              {status === "ACTIVE" && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Started On
                    </p>
                    <p className="font-medium">
                      {formatDate(subscription?.startDate ?? null)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Expires On
                    </p>
                    <p className="font-medium">
                      {formatDate(subscription?.currentPeriodEnd ?? null)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Days Remaining
                    </p>
                    <p className="font-medium">
                      {data?.daysRemaining ?? 0} days
                    </p>
                  </div>
                </div>
              )}

              {/* Inactive/Expired State */}
              {canMakePayment(status) && (
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-muted-foreground mb-4">
                    {status === "EXPIRED"
                      ? "Your subscription has expired. Renew to continue using WaChat."
                      : "Subscribe to access all WaChat features."}
                  </p>
                </div>
              )}

              <Separator />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {canMakePayment(status) && (
                  <Button onClick={handlePayment} disabled={paymentLoading}>
                    {paymentLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    {status === "INACTIVE"
                      ? "Subscribe Now"
                      : "Renew Subscription"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment History Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Payment History</CardTitle>
                  <CardDescription>View your past transactions</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchPayments}
                  disabled={paymentsLoading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${paymentsLoading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {paymentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No payment history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {formatAmount(payment.amount, payment.currency)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(payment.createdAt)}
                            {payment.paymentMethod &&
                              ` • ${payment.paymentMethod}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getPaymentStatusBadge(payment.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Need help with billing?</p>
                  <p className="text-sm text-muted-foreground">
                    Contact our support team for assistance
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Contact Support
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
