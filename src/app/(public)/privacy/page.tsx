import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-8">
          Last Updated: January 2, 2026
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              1. Introduction
            </h2>
            <p>
              GAMDIX PRIVATE LIMITED ("we," "our," or "us") is committed to
              protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              visit our website and use our services. Please read this privacy
              policy carefully. If you do not agree with the terms of this
              privacy policy, please do not access the site.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              2. Information We Collect
            </h2>
            <p className="mb-4">
              We collect information that identifies, relates to, describes,
              references, is capable of being associated with, or could
              reasonably be linked, directly or indirectly, with a particular
              consumer or device ("personal information").
            </p>
            <h3 className="text-xl font-medium mb-2 text-foreground">
              A. Information You Provide to Us
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>
                <strong>Personal Identifiers:</strong> Name, email address,
                phone number, and postal address when you register.
              </li>
              <li>
                <strong>Account Credentials:</strong> Passwords and other
                security information for authentication and access.
              </li>
              <li>
                <strong>Payment Data:</strong> Credit card or other payment
                details if you purchase our services (processed securely by our
                payment processors).
              </li>
              <li>
                <strong>User Content:</strong> Information you post to our
                community forums, feedback, or survey responses.
              </li>
            </ul>

            <h3 className="text-xl font-medium mb-2 text-foreground">
              B. Information We Collect Automatically
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Usage Data:</strong> Information about how you use our
                website, pages visited, and time spent.
              </li>
              <li>
                <strong>Device Data:</strong> IP address, browser type,
                operating system, and device identifiers.
              </li>
              <li>
                <strong>Cookies and Tracking:</strong> We use cookies to enhance
                your experience. See our{" "}
                <Link
                  href="/cookie-policy"
                  className="text-primary hover:underline"
                >
                  Cookie Policy
                </Link>{" "}
                for more details.
              </li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              3. How We Use Your Information
            </h2>
            <p className="mb-4">
              We process your personal information for specific, legitimate
              reasons, including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide, operate, and maintain our Service.</li>
              <li>To improve, personalize, and expand our Service.</li>
              <li>To understand and analyze how you use our Service.</li>
              <li>
                To develop new products, services, features, and functionality.
              </li>
              <li>
                To communicate with you, either directly or through one of our
                partners, for customer service, to provide you with updates and
                other information relating to the Service, and for marketing and
                promotional purposes.
              </li>
              <li>To process your transactions and manage your orders.</li>
              <li>To find and prevent fraud.</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              4. Legal Basis for Processing (GDPR)
            </h2>
            <p>
              If you are from the European Economic Area (EEA), our legal basis
              for collecting and using the personal information described above
              will depend on the personal information concerned and the specific
              context in which we collect it. usage is typically based on:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Contractual Necessity:</strong> To perform a contract
                with you (e.g., providing the service).
              </li>
              <li>
                <strong>Legitimate Interests:</strong> For our legitimate
                business interests that are not overridden by your rights.
              </li>
              <li>
                <strong>Consent:</strong> Where you have given us permission to
                do so.
              </li>
              <li>
                <strong>Legal Obligation:</strong> To comply with the law.
              </li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              5. Your Privacy Rights
            </h2>
            <p className="mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Right to Access:</strong> You have the right to request
                copies of your personal data.
              </li>
              <li>
                <strong>Right to Rectification:</strong> You have the right to
                request that we correct any information you believe is
                inaccurate.
              </li>
              <li>
                <strong>Right to Erasure:</strong> You have the right to request
                that we erase your personal data, under certain conditions.
              </li>
              <li>
                <strong>Right to Restrict Processing:</strong> You have the
                right to request that we restrict the processing of your
                personal data.
              </li>
              <li>
                <strong>Right to Object to Processing:</strong> You have the
                right to object to our processing of your personal data.
              </li>
              <li>
                <strong>Right to Data Portability:</strong> You have the right
                to request that we transfer the data that we have collected to
                another organization, or directly to you.
              </li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at{" "}
              <a
                href="mailto:contact@intesters.com"
                className="text-primary hover:underline"
              >
                contact@intesters.com
              </a>
              . We will respond to your request within the applicable legal
              timeframe.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              6. Data Retention
            </h2>
            <p>
              We will retain your personal information only for as long as is
              necessary for the purposes set out in this Privacy Policy. We will
              retain and use your information to the extent necessary to comply
              with our legal obligations (for example, if we are required to
              retain your data to comply with applicable laws), resolve
              disputes, and enforce our legal agreements and policies.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              7. Security of Your Data
            </h2>
            <p>
              We use administrative, technical, and physical security measures
              to help protect your personal information. While we have taken
              reasonable steps to secure the personal information you provide to
              us, please be aware that no security measures are perfect or
              impenetrable, and no method of data transmission can be guaranteed
              against any interception or other type of misuse.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              8. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date at the top of this Privacy
              Policy. You are advised to review this Privacy Policy periodically
              for any changes.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              9. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
              <p className="font-semibold text-foreground">
                inTesters Privacy Team
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:contact@intesters.com"
                  className="text-primary hover:underline"
                >
                  contact@intesters.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
