"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  UserCircleIcon,
} from "@/icons";
import { useSidebar } from "@/context/SidebarContext";
import { useSite } from "@/context/SiteContext";
import { useAuth } from "@/context/AuthContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  pro?: boolean;
  new?: boolean;
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { currentSite } = useSite();
  const { profile } = useAuth();
  const location = usePathname();

  const navItems = useMemo(() => {
    const commonItems: NavItem[] = [
      {
        icon: <GridIcon />,
        name: "Dashboard",
        path: "/",
      },
      {
        icon: <PageIcon />,
        name: "Pages Manager",
        path: "/cms/pages",
        new: true,
      },
      {
        icon: <PageIcon />,
        name: "Forms Manager",
        path: "/cms/forms",
        new: true,
      }
    ];

    if (currentSite.id === 'bweic') {
      return [
        ...commonItems,
        {
          icon: <BoxCubeIcon />,
          name: "Hero Slider",
          path: "/cms/hero",
        },
        {
          name: "Home Page Settings",
          icon: <PageIcon />,
          path: "/cms/home-settings",
        },
        {
          name: "Who We Are",
          icon: <UserCircleIcon />,
          subItems: [
            { name: "Our Story", path: "/cms/our-story" },
            { name: "Leadership", path: "/cms/leadership" },
            { name: "Board Members", path: "/cms/board-members" },
            { name: "Careers", path: "/cms/careers" },
          ]
        },
        {
          name: "Our Work",
          icon: <PageIcon />,
          subItems: [
            { name: "Healing & Wellness", path: "/cms/healing-wellness" },
            { name: "Empowerment", path: "/cms/empowerment" },
            { name: "Community", path: "/cms/community-belonging" },
            { name: "Sovereignty Circle", path: "/cms/sovereignty-circle" },
          ]
        },
        {
          name: "Media Center",
          icon: <BoxCubeIcon />,
          subItems: [
            { name: "Videos", path: "/cms/videos" },
            { name: "Partners", path: "/cms/partners" },
            { name: "Media Library", path: "/cms/media" },
          ]
        },
        {
          name: "Events",
          icon: <PageIcon />,
          path: "/cms/upcoming-events",
        },
        {
          icon: <PageIcon />,
          name: "Take Action",
          path: "/cms/take-action",
        },
        {
          icon: <GridIcon />,
          name: "Blog",
          path: "/cms/blog",
        },
        {
          icon: <BoxCubeIcon />,
          name: "Shop",
          path: "/cms/shop",
        },
        {
          icon: <PageIcon />,
          name: "Footer Details",
          path: "/cms/footer",
        },
      ];
    }

    if (currentSite.id === 'kmfw') {
      return [
        ...commonItems,
        {
          icon: <BoxCubeIcon />,
          name: "Hero Slider",
          path: "/cms/hero",
        },
        {
          icon: <BoxCubeIcon />,
          name: "Event Hero (Homepage)",
          path: "/cms/event-hero",
        },
        {
          name: "Home Page Settings",
          icon: <PageIcon />,
          path: "/cms/home-settings",
        },
        {
          icon: <PlugInIcon />,
          name: "Page Visibility",
          path: "/cms/page-visibility",
        },
        {
          name: "About KMFW",
          icon: <UserCircleIcon />,
          subItems: [
            { name: "About Us", path: "/cms/about" },
            { name: "Our Story", path: "/cms/our-story" },
            { name: "Meet Our Team", path: "/cms/meet-our-team" },
            { name: "Strategic Plan", path: "/cms/strategic-plan" },
            { name: "Founder's Message", path: "/cms/founders-message" },
            { name: "Celebrating 5 Years", path: "/cms/celebrating-5-years" },
            { name: "Contact Us", path: "/cms/contact" },
            { name: "Inbound Messages", path: "/cms/messages" },
          ],
        },
        {
          name: "Services & Programs",
          icon: <PageIcon />,
          subItems: [
            { name: "Services Gateway", path: "/cms/services" },
            { name: "Grounded Counseling", path: "/cms/grounded-counseling" },
            { name: "Educational Programs", path: "/cms/educational-programs" },
            { name: "Advocacy & Education", path: "/cms/advocacy-education" },
            { name: "Community Support", path: "/cms/community-support" },
            { name: "System Navigation", path: "/cms/system-navigation" },
          ],
        },
        {
          name: "Research",
          icon: <PageIcon />,
          subItems: [
            { name: "Research Gateway", path: "/cms/research" },
            { name: "Black Wellness", path: "/cms/project-black-wellness" },
            { name: "PHAC Welfare", path: "/cms/project-phac-child-welfare" },
            { name: "Umoja Program", path: "/cms/project-umoja-neurodivergent" },
          ]
        },
        {
          name: "Impact",
          icon: <PageIcon />,
          subItems: [
            { name: "Impact Gateway", path: "/cms/impact" },
            { name: "Upcoming Events", path: "/cms/upcoming-events" },
            { name: "Black Excellence Gala", path: "/cms/black-excellence-gala" },
            { name: "Newsletters", path: "/cms/newsletters" },
            { name: "Success Stories", path: "/cms/success-stories" },
            { name: "Gallery", path: "/cms/gallery" },
          ]
        },
        {
          name: "Join Us",
          icon: <BoxCubeIcon />,
          subItems: [
            { name: "Join Us Gateway", path: "/cms/join-us" },
            { name: "Funders & Sponsors", path: "/cms/funders" },
            { name: "Partners", path: "/cms/partners" },
            { name: "Careers", path: "/cms/careers" },
            { name: "Volunteering", path: "/cms/volunteer" },
          ]
        },
        {
          name: "News & Blog",
          icon: <GridIcon />,
          path: "/cms/blog"
        },
        {
          icon: <BoxCubeIcon />,
          name: "Media Library",
          path: "/cms/media",
        },
        {
          icon: <PageIcon />,
          name: "Footer Details",
          path: "/cms/footer",
        },
      ];
    }

    if (currentSite.id === 'elwg') {
      return [
        ...commonItems,
        {
          icon: <BoxCubeIcon />,
          name: "Hero Slider",
          path: "/cms/hero",
        },
        {
          name: "Home Page",
          icon: <PageIcon />,
          subItems: [
            { name: "About ELWG", path: "/cms/about" },
            { name: "Key Causes", path: "/cms/causes" },
            { name: "Volunteers", path: "/cms/volunteers" },
            { name: "Why Choose Us", path: "/cms/why-us" },
            { name: "Impact Quotes", path: "/cms/quotes" },
          ],
        },
        {
          name: "Programs",
          icon: <PageIcon />,
          path: "/cms/programs",
        },
        {
          name: "Interactions",
          icon: <HorizontaLDots />,
          subItems: [
            { name: "Donations", path: "/cms/donations" },
            { name: "Newsletter", path: "/cms/newsletter" },
            { name: "Contact Messages", path: "/cms/messages" },
          ]
        },
        {
          icon: <BoxCubeIcon />,
          name: "Media Library",
          path: "/cms/media",
        },
        {
          icon: <PageIcon />,
          name: "Footer Details",
          path: "/cms/footer",
        },
      ];
    }

    if (currentSite.id === 'dmlabs') {
      return [
        ...commonItems,
        {
          name: 'Home Page',
          icon: <PageIcon />,
          path: '/cms/home-settings',
        },
        {
          name: 'About Page',
          icon: <PageIcon />,
          path: '/cms/about',
        },
        {
          name: 'Portfolio / Projects',
          icon: <PageIcon />,
          path: '/cms/portfolio',
        },
        {
          name: 'Services',
          icon: <PageIcon />,
          path: '/cms/services',
        },
        {
          name: 'Just Opinions (Blog)',
          icon: <GridIcon />,
          path: '/cms/blog',
        },
        {
          name: 'Contact Page',
          icon: <PageIcon />,
          path: '/cms/contact',
        },
        {
          name: 'Inbound Messages',
          icon: <HorizontaLDots />,
          path: '/cms/messages',
        },
        {
          icon: <BoxCubeIcon />,
          name: 'Media Library',
          path: '/cms/media',
        },
        {
          icon: <PageIcon />,
          name: 'Footer Details',
          path: '/cms/footer',
        },
        {
          icon: <GridIcon />,
          name: 'Page SEO Manager',
          path: '/settings/seo',
        },
        {
          icon: <PlugInIcon />,
          name: 'Site Settings',
          path: '/settings/site',
        },
      ];
    }

    if (currentSite.id === 'noel') {
      return [
        ...commonItems,
        {
          icon: <BoxCubeIcon />,
          name: "Hero Slider",
          path: "/cms/hero",
        },
        {
          name: "Page Sections",
          icon: <PageIcon />,
          subItems: [
            { name: "Home Details", path: "/cms/home-settings" },
            { name: "Services", path: "/cms/noel-services" },
            { name: "Portfolio / Projects", path: "/cms/portfolio" },
            { name: "Reviews", path: "/cms/reviews" },
            { name: "Before & After", path: "/cms/gallery" },
            { name: "Footer Details", path: "/cms/footer" },
          ],
        },
        {
          name: "Media Center",
          icon: <BoxCubeIcon />,
          subItems: [
            { name: "Videos", path: "/cms/videos" },
            { name: "Partners", path: "/cms/partners" },
            { name: "Media Library", path: "/cms/media" },
          ]
        },
        {
          icon: <BoxCubeIcon />,
          name: "Media Library",
          path: "/cms/media",
        },
      ];
    }

    if (currentSite.id === 'aitasol') {
      return [
        ...commonItems,
        {
          name: "Application Manager",
          icon: <PageIcon />,
          subItems: [
            { name: "Student Applications", path: "/cms/aitasol-applications" },
          ]
        },
        {
          name: "Site Content",
          icon: <BoxCubeIcon />,
          subItems: [
            { name: "Home Page", path: "/cms/home-settings" },
            { name: "About Page", path: "/cms/about" },
            { name: "Services", path: "/cms/services" },
            { name: "Destinations", path: "/cms/destinations" },
            { name: "Universities", path: "/cms/universities" },
            { name: "Blog / News", path: "/cms/blog" },
            { name: "Contact Page", path: "/cms/contact" },
          ]
        },
        {
          name: "Media & Footer",
          icon: <PageIcon />,
          subItems: [
            { name: "Hero Slider", path: "/cms/hero" },
            { name: "Media Library", path: "/cms/media" },
            { name: "Footer Details", path: "/cms/footer" },
          ]
        },
      ];
    }

    if (currentSite.id === 'phcg') {
      return [
        ...commonItems,
        {
          icon: <BoxCubeIcon />,
          name: "Hero Slider",
          path: "/cms/hero",
        },
        {
          name: "Page Sections",
          icon: <PageIcon />,
          subItems: [
            { name: "Home", path: "/cms/home-settings" },
            { name: "About Us", path: "/cms/about" },
            { name: "Home Care Solutions", path: "/cms/services" },
            { name: "Careers", path: "/cms/careers" },
            { name: "Blog", path: "/cms/blog" },
            { name: "FAQ", path: "/cms/faq" },
            { name: "Contact Us", path: "/cms/contact" },
            { name: "Testimonials", path: "/cms/reviews" },
            { name: "Footer Details", path: "/cms/footer" },
          ],
        },
        {
          name: "Inbound Messages",
          icon: <HorizontaLDots />,
          subItems: [
            { name: "Contacts", path: "/cms/messages" },
            { name: "Appointments", path: "/cms/appointments" },
            { name: "Job Applications", path: "/cms/applications" },
          ]
        },
        {
          icon: <BoxCubeIcon />,
          name: "Media Library",
          path: "/cms/media",
        },
      ];
    }

    // Default NSPC Menu
    return [
      ...commonItems,
      {
        icon: <BoxCubeIcon />,
        name: "Hero Slider",
        path: "/cms/hero",
      },
      {
        name: "Page Sections",
        icon: <PageIcon />,
        subItems: [
          { name: "About Section", path: "/cms/about" },
          { name: "Understanding", path: "/cms/understanding" },
          { name: "Coping Section", path: "/cms/coping" },
          { name: "24/7 Crisis Support", path: "/cms/crisis-support" },
          { name: "Programs", path: "/cms/programs" },
          { name: "Resources", path: "/cms/resources" },
          { name: "Suicide Facts", path: "/cms/suicide-facts" },
          { name: "Footer Details", path: "/cms/footer" },
        ],
      },
      {
        name: "Media Center",
        icon: <BoxCubeIcon />,
        subItems: [
          { name: "Videos", path: "/cms/videos" },
          { name: "Partners", path: "/cms/partners" },
        ]
      },
      {
        icon: <BoxCubeIcon />,
        name: "Media Library",
        path: "/cms/media",
      },
    ];
  }, [currentSite.id]);



  const othersItems = useMemo(() => {
    const isSuperAdmin = profile?.role === 'super_admin';
    const hasAllowedSites = (profile?.allowedSites?.length || 0) > 0;
    
    const items: NavItem[] = [
      {
        icon: <UserCircleIcon />,
        name: "User Profile",
        path: "/profile",
      }
    ];

    // Show Analytics to Super Admins OR Editors with at least one site
    if (isSuperAdmin || hasAllowedSites) {
      items.unshift({
        icon: <PieChartIcon />,
        name: "Internal Analytics",
        path: "/analytics",
      });
    }

    if (isSuperAdmin) {
      items.unshift({
        icon: <UserCircleIcon />,
        name: "Users",
        path: "/users",
      });
      
      items.push(
        {
          icon: <PlugInIcon />,
          name: "Global Site Settings",
          path: "/settings/site",
        },
        {
          icon: <GridIcon />,
          name: "Page SEO Manager",
          path: "/settings/seo",
        },
        {
          icon: <PlugInIcon />,
          name: "System Settings",
          path: "/settings",
        }
      );
    }
    return items;
  }, [profile]);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location === path;
  const isActive = useCallback(
    (path: string) => location === path,
    [location]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // Only auto-close if we navigated to a route that isn't in a submenu?? 
    // Actually, simply removing the else block might be safer for UX: if I'm on a page that isn't in a submenu, keep the last one open? 
    // Or, if I navigate away, I probably expect it to update.
    // But if 'submenuMatched' is false, it means I'm on a top level page or somewhere else.
    // The issue was definitely the constant re-running. Now that navItems is memoized, this effect runs only when location or currentSite changes.
    // This is correct behavior now.
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, navItems, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`] || 0}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/digital-maples-logo.png"
                alt="Digital Maples Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/digital-maples-logo-white.png"
                alt="Digital Maples Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? null : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
