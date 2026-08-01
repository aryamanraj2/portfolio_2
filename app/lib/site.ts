export const SITE_URL = "https://aryamanj.in";

export const NAME = "Aryaman Jaiswal";
export const HEADLINE = "iOS & Android Developer";
export const TITLE = `${NAME} — ${HEADLINE}`;
export const DESCRIPTION =
  "Aryaman Jaiswal is an undergrad and freelance developer in Delhi, building native iOS and Android apps in Swift, SwiftUI and Kotlin, the on-device AI pipelines that run inside them, and the backends behind them.";

export const GREETING = "Hi, I'm Aryaman";
export const PITCH =
  "I write native apps for iOS and Android, the AI pipelines that run inside them, and the backends behind them.";

export const EMAIL = "aryamanj250@gmail.com";
export const TWITTER_HANDLE = "@aryamaaaann";

export const SOCIALS = [
  "https://github.com/aryamanraj2",
  "https://www.linkedin.com/in/aryaman-jaiswal250",
  "https://x.com/aryamaaaann",
  "https://www.instagram.com/aryamanj_/",
];

const PERSON_ID = `${SITE_URL}/#person`;
const IMAGE_ID = `${SITE_URL}/#ogimage`;

const image = {
  "@type": "ImageObject",
  "@id": IMAGE_ID,
  url: `${SITE_URL}/opengraph-image`,
  contentUrl: `${SITE_URL}/opengraph-image`,
  width: 1200,
  height: 630,
  caption: `${NAME} — ${HEADLINE}`,
};

const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: NAME,
  url: SITE_URL,
  image: { "@id": IMAGE_ID },
  email: `mailto:${EMAIL}`,
  jobTitle: HEADLINE,
  description: DESCRIPTION,
  sameAs: SOCIALS,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Delhi",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Netaji Subhas University of Technology",
  },
  worksFor: [
    { "@type": "Organization", name: "Bharti Airtel" },
    { "@type": "Organization", name: "SmartoutMedia" },
  ],
  knowsAbout: [
    "iOS development",
    "Android development",
    "Swift",
    "SwiftUI",
    "Kotlin",
    "On-device machine learning",
    "Apple Foundation Models",
    "Backend engineering",
  ],
  award: [
    "Winner, Apple Swift Student Challenge 2026",
    "Best Overall Project, MLH Hackathon",
    "Best Use of Gemini, MLH Hackathon",
  ],
};

export const homeJsonLd = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": PERSON_ID },
      image: { "@id": IMAGE_ID },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: TITLE,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": PERSON_ID },
      mainEntity: { "@id": PERSON_ID },
      inLanguage: "en",
      primaryImageOfPage: { "@id": IMAGE_ID },
    },
    person,
    image,
  ],
});
