export interface Site {
  id: string;
  name: string;
  domain: string;
  description?: string;
  databaseId?: string; // Optional: specify a custom Firestore database ID
  ga4PropertyId?: string; // Google Analytics 4 Property ID
  usePrefix?: boolean; // Default true: whether to use `${siteId}_` prefixes for collections
}

export const SITES: Site[] = [
  {
    id: 'nspc',
    name: 'NSPC',
    domain: 'niagarasuicidepreventioncoalition.ca',
    description: 'Niagara Suicide Prevention Coalition',
    ga4PropertyId: '509768055',
    usePrefix: true
  },
  {
    id: 'bweic',
    name: 'BWEIC',
    domain: 'bweic.netlify.app',
    description: 'Black Women Empowerment Initiative Canada',
    usePrefix: true
  },
  {
    id: 'kmfw',
    name: 'KMFW',
    domain: 'kmfw.org',
    description: 'Kind Minds Family Wellness',
    usePrefix: true
  },
  {
    id: 'elwg',
    name: 'ELWG',
    domain: 'elwg.ca',
    description: 'Elliot Lake Womens Group',
    databaseId: 'elwg-web', // The user specified this database name
    usePrefix: false // New sites should have clean collection names
  },
  {
    id: 'noel',
    name: 'Noel Construction',
    domain: 'noelconstruction.web.app',
    description: 'High-End Renovation & Woodworking',
    usePrefix: true
  },
  {
    id: 'dmlabs',
    name: 'Digital Maples Labs',
    domain: 'dmlabs.framer.website',
    description: 'Digital Innovation & AI Safety',
    databaseId: 'dmlabs-web',
    usePrefix: false
  },
  {
    id: 'phcg',
    name: 'Private Home Care Guru',
    domain: 'privatehomecareguru.ca',
    description: 'Compassionate Senior Care in Ontario',
    databaseId: 'phcg-web',
    usePrefix: false
  },
  {
    id: 'aitasol',
    name: 'Aitasol',
    domain: 'aitasol.com',
    description: 'Education Consultancy & Study Abroad',
    databaseId: 'aitahsol-web', // Matched with aitasol-web/.env PROJECT_ID
    usePrefix: false
  },
  {
    id: 'havens',
    name: "Haven's Social Work",
    domain: 'havenssocialwork.ca',
    description: 'Registered Social Work Services for Long-Term Care',
    databaseId: 'havens-web',
    usePrefix: false
  }
];

export const getSiteById = (id: string): Site | undefined => {
  return SITES.find(site => site.id === id);
};

export const getDefaultSite = (): Site => {
  return SITES[0];
};
