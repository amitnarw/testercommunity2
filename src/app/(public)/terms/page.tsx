import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-8">
          Last Updated: January 2, 2026
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              1. Agreement to Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service ("Terms") constitute a legally binding
              agreement made between you, whether personally or on behalf of an
              entity ("you") and inTesters ("Company," "we," "us," or "our"),
              concerning your access to and use of the inTesters website as well
              as any other media form, media channel, mobile website, or mobile
              application related, linked, or otherwise connected thereto
              (collectively, the "Service").
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              By accessing or using the Service, you agree that you have read,
              understood, and agree to be bound by all of these Terms. If you do
              not agree with all of these Terms, then you are expressly
              prohibited from using the Service and you must discontinue use
              immediately.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              2. Intellectual Property Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Unless otherwise indicated, the Service is our proprietary
              property and all source code, databases, functionality, software,
              website designs, audio, video, text, photographs, and graphics on
              the Service (collectively, the "Content") and the trademarks,
              service marks, and logos contained therein (the "Marks") are owned
              or controlled by us or licensed to us, and are protected by
              copyright and trademark laws.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The Content and the Marks are provided on the Service "AS IS" for
              your information and personal use only. Except as expressly
              provided in these Terms, no part of the Service and no Content or
              Marks may be copied, reproduced, aggregated, republished,
              uploaded, posted, publicly displayed, encoded, translated,
              transmitted, distributed, sold, licensed, or otherwise exploited
              for any commercial purpose whatsoever, without our express prior
              written permission.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              3. User Representations
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By using the Service, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
              <li>
                All registration information you submit will be true, accurate,
                current, and complete.
              </li>
              <li>
                You will maintain the accuracy of such information and promptly
                update such registration information as necessary.
              </li>
              <li>
                You have the legal capacity and you agree to comply with these
                Terms.
              </li>
              <li>
                You are not a minor in the jurisdiction in which you reside, or
                if a minor, you have received parental permission to use the
                Service.
              </li>
              <li>
                You will not access the Service through automated or non-human
                means, whether through a bot, script, or otherwise.
              </li>
              <li>
                You will not use the Service for any illegal or unauthorized
                purpose.
              </li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              4. User Registration
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You may be required to register with the Service. You agree to
              keep your password confidential and will be responsible for all
              use of your account and password. We reserve the right to remove,
              reclaim, or change a username you select if we determine, in our
              sole discretion, that such username is inappropriate, obscene, or
              otherwise objectionable.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              5. Prohibited Activities
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You may not access or use the Service for any purpose other than
              that for which we make the Service available. The Service may not
              be used in connection with any commercial endeavors except those
              that are specifically endorsed or approved by us.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              As a user of the Service, you agree not to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
              <li>
                Systematically retrieve data or other content from the Service
                to create or compile, directly or indirectly, a collection,
                compilation, database, or directory without written permission
                from us.
              </li>
              <li>
                Trick, defraud, or mislead us and other users, especially in any
                attempt to learn sensitive account information such as user
                passwords.
              </li>
              <li>
                Circumvent, disable, or otherwise interfere with
                security-related features of the Service.
              </li>
              <li>
                Disparage, tarnish, or otherwise harm, in our opinion, us and/or
                the Service.
              </li>
              <li>
                Use the Service in a manner inconsistent with any applicable
                laws or regulations.
              </li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              6. Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event will we or our directors, employees, or agents be
              liable to you or any third party for any direct, indirect,
              consequential, exemplary, incidental, special, or punitive
              damages, including lost profit, lost revenue, loss of data, or
              other damages arising from your use of the service, even if we
              have been advised of the possibility of such damages.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              7. Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              In order to resolve a complaint regarding the Service or to
              receive further information regarding use of the Service, please
              contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
              <p className="font-semibold text-foreground">inTesters Support</p>
              <p className="text-muted-foreground">
                Email: contact@intesters.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
