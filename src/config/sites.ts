export interface Site {
  id: string;
  name: string;
  domain: string;
  description?: string;
}

export const SITES: Site[] = [
  {
    id: 'nspc',
    name: 'NSPC',
    domain: 'niagarasuicidepreventioncoalition.ca',
    description: 'Niagara Suicide Prevention Coalition'
  },
  {
    id: 'bweic',
    name: 'BWEIC',
    domain: 'bweic.netlify.app',
    description: 'Black Women Empowerment Initiative Canada'
  },
  {
    id: 'kmfw',
    name: 'KMFW',
    domain: 'kindmindsfamilywellness.org',
    description: 'Kind Minds Family Wellness'
  }
];

export const getSiteById = (id: string): Site | undefined => {
  return SITES.find(site => site.id === id);
};

export const getDefaultSite = (): Site => {
  return SITES[0];
};
