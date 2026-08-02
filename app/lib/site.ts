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
const WEBSITE_ID = `${SITE_URL}/#website`;
const PROFILE_ID = `${SITE_URL}/#profilepage`;
const RESUME_ID = `${SITE_URL}/resume#webpage`;

const AIRTEL = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#airtel`,
  name: "Bharti Airtel",
  url: "https://www.airtel.in",
  sameAs: ["https://en.wikipedia.org/wiki/Bharti_Airtel"],
};

const SMARTOUT = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#smartoutmedia`,
  name: "SmartoutMedia",
};

const NSUT = {
  "@type": "CollegeOrUniversity",
  "@id": `${SITE_URL}/#nsut`,
  name: "Netaji Subhas University of Technology",
  alternateName: "NSUT",
  url: "https://www.nsut.ac.in",
  sameAs: [
    "https://en.wikipedia.org/wiki/Netaji_Subhas_University_of_Technology",
  ],
};

const projects = [
  {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#wandr`,
    name: "Wandr",
    url: "https://github.com/aryamanraj2/Wandr",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS",
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    description:
      "An iOS app that turns a group chat into a decided night out. A seven-stage pipeline pulls intent from a Siri summary, researches live venues, and resolves conflicts down a constraint ladder. The model only ranks; deterministic code mints the plan, and the chat is never stored.",
    keywords: [
      "Swift",
      "SwiftUI",
      "Foundation Models",
      "App Intents",
      "Natural Language",
    ],
  },
  {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#saldo`,
    name: "Saldo",
    url: "https://github.com/aryamanraj2/Saldo",
    applicationCategory: "FinanceApplication",
    operatingSystem: "iOS",
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    description:
      "A student budgeting app for iOS that reacts to your balance: a theming engine maps what is left to a palette and repaints the interface as the number moves. Receipts are read off the camera and every insight is computed on device. Winner of Apple's Swift Student Challenge 2026.",
    award: "Winner, Apple Swift Student Challenge 2026",
    keywords: ["Swift", "SwiftUI", "Vision", "Natural Language", "Foundation Models"],
  },
  {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#aquasense`,
    name: "AquaSense",
    url: "https://devfolio.co/projects/aquacult-5794",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "iOS, Android",
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    description:
      "Aquarium care where a classifier owns the verdict and the language model only explains it. Three routable specialists split live telemetry, image diagnosis of the fish, and a remediation cart. Best Overall Project and Best Use of Gemini at an MLH hackathon.",
    award: [
      "Best Overall Project, MLH Hackathon",
      "Best Use of Gemini, MLH Hackathon",
    ],
    keywords: ["Swift", "Vision", "LangChain", "Flask", "Gemini API", "Kotlin"],
  },
];

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
  givenName: "Aryaman",
  familyName: "Jaiswal",
  alternateName: ["Aryaman", "aryamanraj2"],
  url: SITE_URL,
  mainEntityOfPage: { "@id": PROFILE_ID },
  image: { "@id": IMAGE_ID },
  email: `mailto:${EMAIL}`,
  jobTitle: HEADLINE,
  description: DESCRIPTION,
  sameAs: SOCIALS,
  nationality: { "@type": "Country", name: "India" },
  knowsLanguage: ["en", "hi"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Delhi",
    addressCountry: "IN",
  },
  homeLocation: {
    "@type": "Place",
    name: "Delhi, India",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Delhi",
      addressCountry: "IN",
    },
  },
  hasOccupation: {
    "@type": "Occupation",
    name: HEADLINE,
    occupationLocation: { "@type": "City", name: "Delhi" },
    skills:
      "Swift, SwiftUI, Kotlin, Jetpack Compose, on-device machine learning, Apple Foundation Models, Core ML, LangChain, retrieval-augmented generation, FastAPI, Flask, Next.js, Firebase, Supabase, PostgreSQL, Docker",
  },
  alumniOf: { "@id": NSUT["@id"] },
  worksFor: [{ "@id": AIRTEL["@id"] }, { "@id": SMARTOUT["@id"] }],
  subjectOf: { "@id": RESUME_ID },
  knowsAbout: [
    "iOS development",
    "Android development",
    "Swift",
    "SwiftUI",
    "UIKit",
    "Swift Concurrency",
    "App Intents",
    "Kotlin",
    "Jetpack Compose",
    "On-device machine learning",
    "Apple Foundation Models",
    "Core ML",
    "Retrieval-Augmented Generation",
    "LangChain",
    "Ollama",
    "Text-to-SQL",
    "Computer vision",
    "Gemini API",
    "Backend engineering",
    "FastAPI",
    "Flask",
    "Next.js",
    "Python",
    "PostgreSQL",
    "SQLite",
    "Firebase",
    "Supabase",
    "Docker",
    "Distributed systems",
    "System design",
  ],
  award: [
    "Winner, Apple Swift Student Challenge 2026",
    "Best Overall Project, MLH Hackathon",
    "Best Use of Gemini, MLH Hackathon",
  ],
};

const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: TITLE,
  alternateName: NAME,
  description: DESCRIPTION,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
  author: { "@id": PERSON_ID },
  copyrightHolder: { "@id": PERSON_ID },
  about: { "@id": PERSON_ID },
  image: { "@id": IMAGE_ID },
};

export const homeJsonLd = () => ({
  "@context": "https://schema.org",
  "@graph": [
    website,
    {
      "@type": "ProfilePage",
      "@id": PROFILE_ID,
      url: SITE_URL,
      name: TITLE,
      description: DESCRIPTION,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": PERSON_ID },
      mainEntity: { "@id": PERSON_ID },
      inLanguage: "en",
      primaryImageOfPage: { "@id": IMAGE_ID },
    },
    person,
    image,
    AIRTEL,
    SMARTOUT,
    NSUT,
    ...projects,
  ],
});

export const resumeJsonLd = (summary: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": RESUME_ID,
      url: `${SITE_URL}/resume`,
      name: `Résumé — ${NAME}`,
      description: summary,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": PERSON_ID },
      mainEntity: { "@id": PERSON_ID },
      inLanguage: "en",
      primaryImageOfPage: { "@id": IMAGE_ID },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Résumé" },
        ],
      },
      hasPart: {
        "@type": "DigitalDocument",
        "@id": `${SITE_URL}/resume.pdf`,
        name: `${NAME} — Résumé`,
        url: `${SITE_URL}/resume.pdf`,
        encodingFormat: "application/pdf",
        about: { "@id": PERSON_ID },
        author: { "@id": PERSON_ID },
        inLanguage: "en",
      },
    },
    person,
    image,
    AIRTEL,
    SMARTOUT,
    NSUT,
  ],
});
