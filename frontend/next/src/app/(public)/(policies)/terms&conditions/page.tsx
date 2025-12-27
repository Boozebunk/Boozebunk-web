export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10 text-gray-800">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
        <p className="mt-2 text-sm text-gray-500">
          Last Updated: <span className="font-medium">27 Dec 2025</span>
        </p>
      </header>

      {/* Intro */}
      <section className="space-y-4">
        <p>
          Welcome to <strong>BoozeBunk.com</strong>, By accessing or using this website (“Service”),
          you agree to be bound by the following Terms and Conditions. If you do not agree, please
          discontinue use immediately.
        </p>
      </section>

      {/* Sections */}
      <section className="mt-10 space-y-8">
        <div>
          <h2 className="text-xl font-semibold">1. Purpose of the Service</h2>
          <p className="mt-3">
            Our website provides informational listings of nearby alcohol shops, including available
            stock, operating hours, and other store-provided details.
          </p>
          <p className="mt-2">
            We do <strong>not</strong> sell, promote, advertise, deliver, facilitate purchases, or
            encourage the consumption of alcohol.
          </p>
          <p className="mt-2">
            This platform is strictly for informational and convenience purposes only.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">2. Legal Drinking Age</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              You are of legal drinking age as defined by the laws of your country, state, or
              region.
            </li>
            <li>
              You will not allow access to the Service to anyone under the legal drinking age.
            </li>
            <li>
              If you are not of legal drinking age, you must immediately stop using the Service.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">3. No Sales, No Delivery, No Recommendations</h2>
          <p className="mt-3">We do not:</p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Sell or supply alcoholic beverages.</li>
            <li>Deliver alcohol or facilitate delivery in any manner.</li>
            <li>Promote specific brands, shops, or products.</li>
            <li>Provide recommendations or encourage alcohol consumption.</li>
          </ul>
          <p className="mt-3">
            All information shown is non-promotional and is either user-submitted, shop-provided, or
            publicly available data.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">4. Accuracy of Information</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>Product availability, pricing, and shop details may change at any time.</li>
            <li>We do not guarantee accuracy, completeness, or reliability.</li>
            <li>Shops are solely responsible for the information they provide.</li>
            <li>You agree that use of any information is at your own risk.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">5. User Responsibilities</h2>
          <p className="mt-3">You agree not to use the Service:</p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>For illegal activities or regulatory violations.</li>
            <li>To harass, defame, or harm shops or individuals.</li>
            <li>To scrape, modify, or misuse platform data.</li>
            <li>To impersonate others or submit false information.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">6. External Shop Links</h2>
          <p className="mt-3">
            Some listings may include links to third-party websites. We are not responsible for
            their content, policies, accuracy, or any interactions or transactions you have with
            them.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
          <p className="mt-3">
            To the maximum extent permitted by law, we are not liable for any direct, indirect,
            incidental, or consequential damages arising from use of the Service.
          </p>
          <p className="mt-2">
            This includes decisions made based on information shown and issues related to alcohol
            purchases, consumption, or health effects.
          </p>
          <p className="mt-2">The Service is provided “as-is” without warranties of any kind.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">8. Health & Safety Disclaimer</h2>
          <p className="mt-3">
            Consumption of alcohol is associated with health risks. This website does not provide
            medical advice, does not endorse alcohol consumption, and assumes no responsibility for
            individual choices.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">9. Changes to Terms</h2>
          <p className="mt-3">
            We may update these Terms at any time. Continued use of the Service after changes means
            you accept the updated Terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">10. Contact Information</h2>
          <p className="mt-3">
            If you have questions about these Terms & Conditions, contact us at:
          </p>
          <p className="mt-1 font-medium">bb@boozebunk.com</p>
        </div>
      </section>
    </main>
  );
}
