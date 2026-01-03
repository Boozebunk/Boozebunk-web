export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10 text-gray-800">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">
          Last Updated: <span className="font-medium">27 Dec 2025</span>
        </p>
      </header>

      {/* Intro */}
      <section className="space-y-4">
        <p>
          This Privacy Policy explains how <strong>BoozeBunk.com</strong> collects, uses, and
          protects your information when you access or use our website (“Service”).
        </p>
        <p>By using the Service, you agree to the practices described in this Policy.</p>
      </section>

      {/* Sections */}
      <section className="mt-10 space-y-8">
        <div>
          <h2 className="text-xl font-semibold">1. Information We Collect</h2>

          <h3 className="mt-4 font-semibold">1.1 Email Address (Provided Once at First Login)</h3>
          <p className="mt-2">
            When you log in for the first time, we collect your email address. We use your email
            solely for:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Sending updates about new features</li>
            <li>Sending important announcements related to the website</li>
          </ul>

          <p className="mt-3">
            We do <strong>not</strong>:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Use your email for advertising</li>
            <li>Share or sell your email</li>
            <li>Send alcohol-related promotions</li>
          </ul>

          <p className="mt-3">You may opt out of feature-update emails at any time.</p>

          <h3 className="mt-6 font-semibold">1.2 Anonymous Usage Data (Google Analytics)</h3>
          <p className="mt-2">
            We use Google Analytics to understand general user interaction with the website and
            improve the Service.
          </p>
          <p className="mt-2">
            Google Analytics collects anonymous, non-personally identifiable usage data such as
            navigation patterns and website activity. This data:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Does not identify you personally</li>
            <li>Is not linked to your email</li>
            <li>Does not include sensitive personal details</li>
            <li>Is used only for analytics and performance improvement</li>
          </ul>
          <p className="mt-3">We do not merge analytics data with any personal information.</p>
          <p className="mt-2">
            For more details on Google’s data practices, please refer to Google’s Privacy Policy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
          <p className="mt-3">We use the information we collect only for the following purposes:</p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>To operate, maintain, and improve the Service</li>
            <li>To send feature updates (email)</li>
            <li>To monitor general website usage (analytics)</li>
            <li>To enhance user experience and stability</li>
          </ul>

          <p className="mt-3">
            We do <strong>not</strong> use your information for:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Alcohol marketing</li>
            <li>Third-party advertising</li>
            <li>Promotions or endorsements</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">3. No Alcohol Sales or Promotion</h2>
          <p className="mt-3">
            Our website is strictly an informational platform listing nearby alcohol shops and their
            stock. We do not:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Sell alcohol</li>
            <li>Deliver alcohol</li>
            <li>Promote alcohol brands</li>
            <li>Encourage alcohol consumption</li>
          </ul>
          <p className="mt-3">All displayed information is for general public reference only.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">4. Legal Drinking Age Requirement</h2>
          <p className="mt-3">
            The Service is intended only for users who are of legal drinking age according to local
            laws. We do not knowingly collect information from users below the legal drinking age.
          </p>
          <p className="mt-2">
            If you are not of legal drinking age, you must discontinue use immediately.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">5. How We Protect Your Information</h2>
          <p className="mt-3">
            We take reasonable technical and organizational measures to safeguard your information,
            including:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Encrypted communication (HTTPS)</li>
            <li>Secure storage of email addresses</li>
            <li>Restricted internal access</li>
          </ul>
          <p className="mt-3">
            However, no online system is entirely secure, and we cannot guarantee absolute
            protection.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">6. Third-Party Services</h2>
          <p className="mt-3">
            We may use third-party tools (such as Google Analytics) to improve the website. These
            services may process anonymous, non-personal usage data.
          </p>
          <p className="mt-2">
            We do not share your email or any personal information with these third-party services.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">7. Cookies</h2>
          <p className="mt-3">Our website may use cookies to support:</p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Basic site functionality</li>
            <li>Anonymous usage analytics</li>
            <li>Improving user experience</li>
          </ul>
          <p className="mt-3">
            You may disable cookies in your browser settings, but some features may not function
            correctly.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">8. Your Rights</h2>
          <p className="mt-3">You may:</p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Request deletion of your email</li>
            <li>Request a copy of the information we hold about you</li>
            <li>Opt out of feature-update emails at any time</li>
          </ul>
          <p className="mt-3">To exercise these rights, contact us at:</p>
          <p className="mt-1 font-medium">[Insert Contact Email]</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">9. Changes to This Privacy Policy</h2>
          <p className="mt-3">
            We may update this Privacy Policy from time to time. If significant changes are made, we
            will notify you via email or through a notice on the website.
          </p>
          <p className="mt-2">
            Continued use of the Service constitutes acceptance of the updated Policy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">10. Contact Us</h2>
          <p className="mt-3">
            If you have questions, concerns, or requests regarding this Privacy Policy, please
            contact:
          </p>
          <p className="mt-1 font-medium">bb@boozebunk.com</p>
        </div>
      </section>
    </main>
  );
}
