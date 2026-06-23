import { Separator } from "@/components/ui/separator";
import { Clock, Video, Mail, CheckCircle2, AlertCircle, Ban, ShieldCheck } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Refund & Cancellation Policy
        </h1>
        <p className="text-muted-foreground mb-8">
          Last Updated: May 3, 2026
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              1. Introduction
            </h2>
            <p>
              At inTesters, we strive to provide the highest quality testing services for your applications. We understand that sometimes things might not go as planned. This Refund & Cancellation Policy outlines the specific conditions under which a refund may be requested and processed.
            </p>
            <p className="mt-2">
              By purchasing our testing services, you acknowledge that you have read, understood, and agree to be bound by this policy.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
              2. Professional Path Success Guarantee
            </h2>
            <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
              <p className="font-medium text-foreground mb-2">Guarantee Condition:</p>
              <p>
                If your application is rejected by Google for production access specifically due to inadequate testing data or testing track non-compliance after completing the 14-day testing period, you are eligible for a refund.
              </p>
            </div>
            <p className="mt-4">You may choose between the following options:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Full Refund</strong> - A complete refund of your package cost to your original payment method.</li>
              <li><strong>Free Re-testing</strong> - An additional 14-day testing cycle with a new set of testers at no extra cost.</li>
            </ul>
            <div className="flex gap-4 items-start bg-primary/5 p-4 rounded-lg border border-primary/10 mt-4">
              <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground my-0">Required Proof:</p>
                <p className="my-0">You must forward the official Google rejection email to <a href="mailto:intesters@nexmail.in" className="text-primary hover:underline font-medium">intesters@nexmail.in</a>. Requests submitted without this documentation will not qualify under this guarantee.</p>
              </div>
            </div>
            <p className="mt-2 text-sm">
              Note: This guarantee does not cover rejections based on app content (e.g., copyright violations, harmful content) or unrelated account suspensions.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              3. Tester Assignment Guarantee
            </h2>
            <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
              <p className="font-medium text-foreground mb-2">Guarantee Condition:</p>
              <p>
                A refund will be issued if testers are not assigned to your project within <strong>24 hours</strong> of a successful purchase.
              </p>
            </div>
            <p className="mt-4">
              The 24-hour window begins from the exact timestamp of the completed transaction as recorded in our system.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Video className="w-6 h-6 text-primary" />
              4. Verification & Proof Requirements
            </h2>
            <p className="mb-4">
              To maintain the integrity of our platform and ensure fair processing, we require specific proof depending on your refund claim type.
            </p>
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-2 text-foreground">For Tester Assignment Guarantee:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Video Recording:</strong> A clear screen recording showing your dashboard and the project status.
                </li>
                <li>
                  <strong>Date & Time:</strong> The recording must clearly show the current system date and time to verify the 24-hour non-assignment window.
                </li>
                <li>
                  <strong>Submission:</strong> The video must be sent to <a href="mailto:intesters@nexmail.in" className="text-primary hover:underline font-medium">intesters@nexmail.in</a>.
                </li>
              </ul>
              <div className="flex gap-4 items-start bg-primary/5 p-4 rounded-lg border border-primary/10 mt-4">
                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground my-0">Important Deadline:</p>
                  <p>You must email your refund request and proof within <strong>48 hours</strong> of the original purchase time. Requests made after this period will not be eligible for a refund under this guarantee.</p>
                </div>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              5. How to Request a Refund
            </h2>
            <p className="mb-4">
              To initiate a refund request, email our support team at <a href="mailto:intesters@nexmail.in" className="text-primary hover:underline font-medium">intesters@nexmail.in</a> with the following information:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your registered email address or account details.</li>
              <li>Proof of purchase or relevant transaction details.</li>
              <li>Any required proof based on your refund claim type (see Sections 2 and 3).</li>
            </ul>
            <p className="mt-2">
              We aim to respond to your request within <strong>3-5 business days</strong>.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              6. Refund Processing
            </h2>
            <p>
              Once your proof is received and verified by our team, we will notify you of the approval or rejection of your refund.
            </p>
            <p className="mt-2">
              If approved, your refund will be processed through Razorpay and a credit will automatically be applied to your original method of payment within <strong>5-7 business days</strong> from the date of approval.
            </p>
            <p className="mt-2">
              We do not offer partial refunds. All refunds are either the full amount or no refund at all.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              7. Non-Refundable Situations
            </h2>
            <p className="mb-4">
              Refunds will not be issued in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Change of mind after the service has been initiated.</li>
              <li>Testers assigned within the 24-hour window (for Tester Assignment Guarantee claims).</li>
              <li>Google rejection due to app content issues (e.g., copyright violations, harmful content) or unrelated account suspensions (for Professional Path Success Guarantee claims).</li>
              <li>Providing incorrect app details (URLs, access permissions) that prevent testers from starting.</li>
              <li>Failure to provide the required proof as specified in this policy.</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Ban className="w-6 h-6 text-primary" />
              8. Cancellation Policy
            </h2>
            <p>
              Once a paid service has started, it cannot be cancelled. By placing a paid order, you agree that the service is non-cancellable after it has been initiated.
            </p>
            <div className="bg-muted/30 p-6 rounded-xl border border-border/50 mt-4">
              <p className="font-medium text-foreground mb-2">Available Options:</p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary font-bold shrink-0">1.</span>
                  <span><strong>Delay the start</strong> - You can contact support to delay when your paid testing begins.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold shrink-0">2.</span>
                  <span><strong>Switch apps</strong> - You can use the same paid package to test a different app instead.</span>
                </li>
              </ul>
            </div>
            <p className="mt-4">
              Both options are only available <strong>before 1 hour of submitting your app for testing</strong>, or before any paid tester has been added to the testing, whichever comes first.
            </p>
            <p className="mt-2">
              To request either option, email our support team at <a href="mailto:intesters@nexmail.in" className="text-primary hover:underline font-medium">intesters@nexmail.in</a> before the cutoff time.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              9. Additional Terms
            </h2>
            <ul className="space-y-3">
              <li>
                <strong>Legitimate Requests Only:</strong> We reserve the right to deny any refund request that does not meet the conditions outlined in this policy or appears fraudulent or abusive.
              </li>
              <li>
                <strong>Company&apos;s Discretion:</strong> In exceptional cases not explicitly covered by this policy, please contact our support team. We will review the circumstances and decide at our sole discretion.
              </li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              10. Contact Us
            </h2>
            <p>
              For any questions regarding our refund policy or to submit a claim, please reach out to our support team:
            </p>
            <div className="mt-4 p-6 bg-muted/50 rounded-xl border border-border">
              <p className="font-bold text-foreground text-lg mb-1">
                inTesters Support Team
              </p>
              <div className="flex items-center gap-2 text-primary font-medium">
                <Mail className="w-4 h-4" />
                <a href="mailto:intesters@nexmail.in" className="hover:underline">
                  intesters@nexmail.in
                </a>
              </div>
              <p className="text-sm mt-4 italic">
                Please include your Order ID and Project Name in the subject line for faster processing.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
