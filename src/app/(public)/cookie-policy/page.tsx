import { Separator } from "@/components/ui/separator";

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Cookie Policy
        </h1>
        <p className="text-muted-foreground mb-8">
          Last Updated: January 2, 2026
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small text files that are placed on your computer or
              mobile device by websites that you visit. They are widely used in
              order to make websites work, or work more efficiently, as well as
              to provide information to the owners of the site.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              2. How We Use Cookies
            </h2>
            <p className="mb-4">
              We use cookies for a variety of reasons detailed below.
              Unfortunately, in most cases, there are no industry standard
              options for disabling cookies without completely disabling the
              functionality and features they add to this site. It is
              recommended that you leave on all cookies if you are not sure
              whether you need them or not in case they are used to provide a
              service that you use.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              3. The Cookies We Set
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2 text-foreground">
                  Account related cookies
                </h3>
                <p>
                  If you create an account with us, we will use cookies for the
                  management of the signup process and general administration.
                  These will usually be deleted when you log out however in some
                  cases they may remain afterwards to remember your site
                  preferences when logged out.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-foreground">
                  Login related cookies
                </h3>
                <p>
                  We use cookies when you are logged in so that we can remember
                  this fact. This prevents you from having to log in every
                  single time you visit a new page. These cookies are typically
                  removed or cleared when you log out to ensure that you can
                  only access restricted features and areas when logged in.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-foreground">
                  Forms related cookies
                </h3>
                <p>
                  When you submit data to through a form such as those found on
                  contact pages or comment forms, cookies may be set to remember
                  your user details for future correspondence.
                </p>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              4. Third Party Cookies
            </h2>
            <p className="mb-4">
              In some special cases, we also use cookies provided by trusted
              third parties. The following section details which third party
              cookies you might encounter through this site.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Analytics:</strong> This site uses Google Analytics
                which is one of the most widespread and trusted analytics
                solutions on the web for helping us to understand how you use
                the site and ways that we can improve your experience. These
                cookies may track things such as how long you spend on the site
                and the pages that you visit so we can continue to produce
                engaging content.
              </li>
              <li>
                <strong>Authentication:</strong> We use third-party
                authentication services (like Google, GitHub) to allow you to
                log in easily. These services use cookies to verify your
                identity.
              </li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              5. Managing Cookies
            </h2>
            <p>
              You can prevent the setting of cookies by adjusting the settings
              on your browser (see your browser Help for how to do this). Be
              aware that disabling cookies will affect the functionality of this
              and many other websites that you visit. Disabling cookies will
              usually result in also disabling certain functionality and
              features of this site. Therefore, it is recommended that you do
              not disable cookies.
            </p>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              6. More Information
            </h2>
            <p>
              If you require more information about our cookie usage, please
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
