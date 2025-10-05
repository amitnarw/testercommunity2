
export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <p>Please read these terms and conditions carefully before using Our Service.</p>

          <h2 className="text-2xl font-semibold text-foreground pt-4 mt-4 border-t">Interpretation and Definitions</h2>
          <h3 className="text-xl font-semibold text-foreground">Interpretation</h3>
          <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
          <h3 className="text-xl font-semibold text-foreground">Definitions</h3>
          <p>For the purposes of these Terms and Conditions:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Application</strong> means the software program provided by the Company downloaded by You on any electronic device, named inTesters.</li>
            <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to inTesters, Inc.</li>
            <li><strong>Country</strong> refers to: Delaware, United States</li>
            <li><strong>Service</strong> refers to the Application.</li>
            <li><strong>Terms and Conditions</strong> (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
            <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground pt-4 mt-4 border-t">Acknowledgment</h2>
          <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
          <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
          <p>By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p>
          <p>Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.</p>
          
          <h2 className="text-2xl font-semibold text-foreground pt-4 mt-4 border-t">Contact Us</h2>
          <p>If you have any questions about these Terms and Conditions, You can contact us by email at contact@inTesters.com.</p>
        </div>
      </div>
    </div>
  );
}
