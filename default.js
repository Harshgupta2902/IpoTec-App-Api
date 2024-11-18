const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const menuItems = [
      {
        key: "IPO GMP",
        path: "/gmp",
      },
      {
        key: "IPO Subscription",
        path: "/subs",
      },
      {
        key: "Upcoming IPO",
        path: "/mainBoard",
      },
      {
        key: "SME IPO",
        path: "/sme",
      },
      {
        key: "BuyBack IPO",
        path: "/buyBack",
      },
      {
        key: "IPO Forms",
        path: "/forms",
      },
      {
        key: "Privacy Policy",
        path: "/policyView",
      },
      {
        key: "Terms & Conditions",
        path: "/policyView",
      },
      {
        key: "Contact Us",
        path: "/contact-us"
      }
    ];

    const terms = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset='utf-8'>
      <meta name='viewport' content='width=device-width'>
      <title>Terms &amp; Conditions</title>
      <style> body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding:1em; } </style>
    </head>
    <body>
    <strong>Terms &amp; Conditions</strong><br><p>These terms and conditions applies to the Ipo Live Gmp app (hereby referred to as "Application") for mobile devices that was created by IpoTec (hereby referred to as "Service Provider") as a Free service.</p><br><p>Upon downloading or utilizing the Application, you are automatically agreeing to the following terms. It is strongly advised that you thoroughly read and understand these terms prior to using the Application. Unauthorized copying, modification of the Application, any part of the Application, or our trademarks is strictly prohibited. Any attempts to extract the source code of the Application, translate the Application into other languages, or create derivative versions are not permitted. All trademarks, copyrights, database rights, and other intellectual property rights related to the Application remain the property of the Service Provider.</p><br><p>The Service Provider is dedicated to ensuring that the Application is as beneficial and efficient as possible. As such, they reserve the right to modify the Application or charge for their services at any time and for any reason. The Service Provider assures you that any charges for the Application or its services will be clearly communicated to you.</p><br><p>The Application stores and processes personal data that you have provided to the Service Provider in order to provide the Service. It is your responsibility to maintain the security of your phone and access to the Application. The Service Provider strongly advise against jailbreaking or rooting your phone, which involves removing software restrictions and limitations imposed by the official operating system of your device. Such actions could expose your phone to malware, viruses, malicious programs, compromise your phone's security features, and may result in the Application not functioning correctly or at all.</p><div><p>Please note that the Application utilizes third-party services that have their own Terms and Conditions. Below are the links to the Terms and Conditions of the third-party service providers used by the Application:</p><ul><!----><!----><li><a href="https://www.google.com/analytics/terms/" target="_blank" rel="noopener noreferrer" previewlistener="true">Google Analytics for Firebase</a></li><li><a href="https://firebase.google.com/terms/crashlytics" target="_blank" rel="noopener noreferrer" previewlistener="true">Firebase Crashlytics</a></li><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></ul></div><br><p>Please be aware that the Service Provider does not assume responsibility for certain aspects. Some functions of the Application require an active internet connection, which can be Wi-Fi or provided by your mobile network provider. The Service Provider cannot be held responsible if the Application does not function at full capacity due to lack of access to Wi-Fi or if you have exhausted your data allowance.</p><br><p>If you are using the application outside of a Wi-Fi area, please be aware that your mobile network provider's agreement terms still apply. Consequently, you may incur charges from your mobile provider for data usage during the connection to the application, or other third-party charges. By using the application, you accept responsibility for any such charges, including roaming data charges if you use the application outside of your home territory (i.e., region or country) without disabling data roaming. If you are not the bill payer for the device on which you are using the application, they assume that you have obtained permission from the bill payer.</p><br><p>Similarly, the Service Provider cannot always assume responsibility for your usage of the application. For instance, it is your responsibility to ensure that your device remains charged. If your device runs out of battery and you are unable to access the Service, the Service Provider cannot be held responsible.</p><br><p>In terms of the Service Provider's responsibility for your use of the application, it is important to note that while they strive to ensure that it is updated and accurate at all times, they do rely on third parties to provide information to them so that they can make it available to you. The Service Provider accepts no liability for any loss, direct or indirect, that you experience as a result of relying entirely on this functionality of the application.</p><br><p>The Service Provider may wish to update the application at some point. The application is currently available as per the requirements for the operating system (and for any additional systems they decide to extend the availability of the application to) may change, and you will need to download the updates if you want to continue using the application. The Service Provider does not guarantee that it will always update the application so that it is relevant to you and/or compatible with the particular operating system version installed on your device. However, you agree to always accept updates to the application when offered to you. The Service Provider may also wish to cease providing the application and may terminate its use at any time without providing termination notice to you. Unless they inform you otherwise, upon any termination, (a) the rights and licenses granted to you in these terms will end; (b) you must cease using the application, and (if necessary) delete it from your device.</p><br><strong>Changes to These Terms and Conditions</strong><p>The Service Provider may periodically update their Terms and Conditions. Therefore, you are advised to review this page regularly for any changes. The Service Provider will notify you of any changes by posting the new Terms and Conditions on this page.</p><br><p>These terms and conditions are effective as of 2024-09-01</p><br><strong>Contact Us</strong><p>If you have any questions or suggestions about the Terms and Conditions, please do not hesitate to contact the Service Provider at harsh1248gupta@gmail.com.</p>
    </body>
    </html>
      
      `;

    const privacy = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset='utf-8'>
      <meta name='viewport' content='width=device-width'>
      <title>Privacy Policy</title>
      <style> body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding:1em; } </style>
    </head>
    <body>
    <strong>Privacy Policy</strong><p>This privacy policy applies to the Ipo Live Gmp app (hereby referred to as "Application") for mobile devices that was created by IpoTec (hereby referred to as "Service Provider") as a Free service. This service is intended for use "AS IS".</p><br><strong>Information Collection and Use</strong><p>The Application collects information when you download and use it. This information may include information such as </p><ul><li>Your device's Internet Protocol address (e.g. IP address)</li><li>The pages of the Application that you visit, the time and date of your visit, the time spent on those pages</li><li>The time spent on the Application</li><li>The operating system you use on your mobile device</li></ul><p></p><br><p style="">The Application does not gather precise information about the location of your mobile device.</p><div style="display: none;"><p>The Application collects your device's location, which helps the Service Provider determine your approximate geographical location and make use of in below ways:</p><ul><li>Geolocation Services: The Service Provider utilizes location data to provide features such as personalized content, relevant recommendations, and location-based services.</li><li>Analytics and Improvements: Aggregated and anonymized location data helps the Service Provider to analyze user behavior, identify trends, and improve the overall performance and functionality of the Application.</li><li>Third-Party Services: Periodically, the Service Provider may transmit anonymized location data to external services. These services assist them in enhancing the Application and optimizing their offerings.</li></ul></div><br><p>The Service Provider may use the information you provided to contact you from time to time to provide you with important information, required notices and marketing promotions.</p><br><p>For a better experience, while using the Application, the Service Provider may require you to provide us with certain personally identifiable information, including but not limited to Name, Email, Photo. The information that the Service Provider request will be retained by them and used as described in this privacy policy.</p><br><strong>Third Party Access</strong><p>Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement.</p><div><br><p>Please note that the Application utilizes third-party services that have their own Privacy Policy about handling data. Below are the links to the Privacy Policy of the third-party service providers used by the Application:</p><ul><!----><!----><li><a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" previewlistener="true">Google Analytics for Firebase</a></li><li><a href="https://firebase.google.com/support/privacy/" target="_blank" rel="noopener noreferrer" previewlistener="true">Firebase Crashlytics</a></li><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></ul></div><br><p>The Service Provider may disclose User Provided and Automatically Collected Information:</p><ul><li>as required by law, such as to comply with a subpoena, or similar legal process;</li><li>when they believe in good faith that disclosure is necessary to protect their rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;</li><li>with their trusted services providers who work on their behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement.</li></ul><p></p><br><strong>Opt-Out Rights</strong><p>You can stop all collection of information by the Application easily by uninstalling it. You may use the standard uninstall processes as may be available as part of your mobile device or via the mobile application marketplace or network.</p><br><strong>Data Retention Policy</strong><p>The Service Provider will retain User Provided data for as long as you use the Application and for a reasonable time thereafter. If you'd like them to delete User Provided Data that you have provided via the Application, please contact them at harsh1248gupta@gmail.com and they will respond in a reasonable time.</p><br><strong>Children</strong><p>The Service Provider does not use the Application to knowingly solicit data from or market to children under the age of 13.</p><div><br><p>The Application does not address anyone under the age of 13.
The Service Provider does not knowingly collect personally
identifiable information from children under 13 years of age. In the case
the Service Provider discover that a child under 13 has provided
personal information, the Service Provider will immediately
delete this from their servers. If you are a parent or guardian
and you are aware that your child has provided us with
personal information, please contact the Service Provider (harsh1248gupta@gmail.com) so that
they will be able to take the necessary actions.</p></div><!----><br><strong>Security</strong><p>The Service Provider is concerned about safeguarding the confidentiality of your information. The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains.</p><br><strong>Changes</strong><p>This Privacy Policy may be updated from time to time for any reason. The Service Provider will notify you of any changes to the Privacy Policy by updating this page with the new Privacy Policy. You are advised to consult this Privacy Policy regularly for any changes, as continued use is deemed approval of all changes.</p><br><p>This privacy policy is effective as of 2024-09-01</p><br><strong>Your Consent</strong><p>By using the Application, you are consenting to the processing of your information as set forth in this Privacy Policy now and as amended by us.</p><br><strong>Contact Us</strong><p>If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at harsh1248gupta@gmail.com.</p>
    </body>
    </html>
      `;

    const response = {
      force_update: 1,
      soft_update: 1,
      build_no: 7,
      ios_build_no: 1,
      title: "Update",
      message: "A New Version of App is available",
      show_ad: false,
      menu_items: menuItems,
      terms: terms,
      privacy: privacy,
      allotment: "https://ipostatus.kfintech.com/",
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
