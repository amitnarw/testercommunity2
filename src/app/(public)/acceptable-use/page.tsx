import { Separator } from "@/components/ui/separator";

export default function AcceptableUsePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Acceptable Use Policy
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
              This Acceptable Use Policy ("Policy") sets out the content
              standards and prohibited uses of our website and services. This
              Policy is part of our Terms of Service.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              2. Prohibited Uses
            </h2>
            <p className="mb-4">
              You may use our site only for lawful purposes. You may not use our
              site:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                In any way that breaches any applicable local, national, or
                international law or regulation.
              </li>
              <li>
                In any way that is unlawful or fraudulent, or has any unlawful
                or fraudulent purpose or effect.
              </li>
              <li>
                For the purpose of harming or attempting to harm minors in any
                way.
              </li>
              <li>
                To send, knowingly receive, upload, download, use, or re-use any
                material which does not comply with our content standards.
              </li>
              <li>
                To transmit, or procure the sending of, any unsolicited or
                unauthorized advertising or promotional material or any other
                form of similar solicitation (spam).
              </li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              3. Content Standards
            </h2>
            <p className="mb-4">
              These standards apply to any and all material which you contribute
              to our site (contributions), and to any interactive services
              associated with it. Contributions must:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be accurate (where they state facts).</li>
              <li>Be genuinely held (where they state opinions).</li>
              <li>
                Comply with applicable law in the US and in any country from
                which they are posted.
              </li>
            </ul>
            <p className="mt-4 mb-2">Contributions must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contain any material which is defamatory of any person.</li>
              <li>
                Contain any material which is obscene, offensive, hateful, or
                inflammatory.
              </li>
              <li>Promote sexually explicit material.</li>
              <li>Promote violence.</li>
              <li>
                Promote discrimination based on race, sex, religion,
                nationality, disability, sexual orientation, or age.
              </li>
              <li>
                Infringe any copyright, database right, or trademark of any
                other person.
              </li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              4. Enforcement
            </h2>
            <p>
              We will determine, in our discretion, whether there has been a
              breach of this acceptable use policy through your use of our site.
              When a breach of this policy has occurred, we may take such action
              as we deem appropriate, including:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                Immediate, temporary, or permanent withdrawal of your right to
                use our site.
              </li>
              <li>
                Immediate, temporary, or permanent removal of any posting or
                material uploaded by you to our site.
              </li>
              <li>Issue of a warning to you.</li>
              <li>
                Legal proceedings against you for reimbursement of all costs on
                an indemnity basis resulting from the breach.
              </li>
              <li>
                Disclosure of such information to law enforcement authorities as
                we reasonably feel is necessary.
              </li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              5. Contact Us
            </h2>
            <p>
              If you have any questions about this Acceptable Use Policy, please
              contact us at{" "}
              <a
                href="mailto:contact@intesters.com"
                className="text-primary hover:underline"
              >
                contact@intesters.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
