export interface Site {
  id: string;
  name: string;
  domain: string;
  description?: string;
  databaseId?: string; // Optional: specify a custom Firestore database ID
  usePrefix?: boolean; // Default true: whether to use `${siteId}_` prefixes for collections
}

export const SITES: Site[] = [
  {
    id: 'nspc',
    name: 'NSPC',
    domain: 'niagarasuicidepreventioncoalition.ca',
    description: 'Niagara Suicide Prevention Coalition',
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
    domain: 'kindmindsfamilywellness.org',
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
  }
];

export const getSiteById = (id: string): Site | undefined => {
  return SITES.find(site => site.id === id);
};

export const getDefaultSite = (): Site => {
  return SITES[0];
};
