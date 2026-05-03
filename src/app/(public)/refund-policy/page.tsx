import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Clock, Video, Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Refund Policy
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
              At inTesters, we strive to provide the highest quality testing services for your applications. We understand that sometimes things might not go as planned. This Refund Policy outlines the specific conditions under which a refund may be requested and processed.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              2. Eligibility for Refund
            </h2>
            <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
              <p className="font-medium text-foreground mb-2">Primary Refund Condition:</p>
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
              3. Verification & Proof Requirements
            </h2>
            <p className="mb-4">
              To maintain the integrity of our platform and ensure fair processing, we require specific proof for any refund claim.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 items-start bg-primary/5 p-4 rounded-lg border border-primary/10">
                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground italic my-0">Important Deadline:</p>
                  <p>You must email your refund request and proof within <strong>48 hours</strong> of the original purchase time. Requests made after this period will not be eligible for a refund.</p>
                </div>
              </div>

              <h3 className="text-xl font-medium mb-2 text-foreground">Required Proof Content:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Video Recording:</strong> A clear screen recording showing your dashboard and the project status.
                </li>
                <li>
                  <strong>Date & Time:</strong> The recording must clearly show the current system date and time to verify the 24-hour non-assignment window.
                </li>
                <li>
                  <strong>Submission:</strong> The video must be sent to <a href="mailto:support@intesters.com" className="text-primary hover:underline font-medium">support@intesters.com</a>.
                </li>
              </ul>
            </div>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              4. Non-Refundable Situations
            </h2>
            <p className="mb-4">
              Refunds will not be issued in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Change of mind after the service has been initiated.</li>
              <li>Testers assigned within the 24-hour window.</li>
              <li>Providing incorrect app details (URLs, access permissions) that prevent testers from starting.</li>
              <li>Failure to provide the required video proof within the 48-hour deadline.</li>
              <li>Issues related to the Google Play Store's review process which are outside of our control.</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              5. Refund Processing
            </h2>
            <p>
              Once your proof is received and verified by our team, we will notify you of the approval or rejection of your refund.
            </p>
            <p className="mt-2">
              If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within <strong>5-7 business days</strong>.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              6. Contact Us
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
                <a href="mailto:support@intesters.com" className="hover:underline">
                  support@intesters.com
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
