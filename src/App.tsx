import { useTheme } from "@heroui/use-theme";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Tabs, Tab } from "@heroui/react";
import { Icon } from '@iconify/react';
import { SocialLinksManager } from './components/social-links-manager';
import { ProjectsManager } from './components/projects-manager';
import { PricingManager } from './components/pricing-manager';
import { ParallaxManager } from './components/parallax-manager';
import { ContactManager } from './components/contact-manager';

export default function App() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className={`min-h-screen font-poppins ${isDark ? 'dark' : ''}`}>
      <Navbar 
        className="bg-beige dark:bg-[#1f1f1f]"
        maxWidth="xl"
        isBordered
      >
        <NavbarBrand>
          <p className="font-bold text-2xl text-woodBrown dark:text-lightWood">Visual Area</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              className="text-xl"
              onPress={toggleTheme}
            >
              <Icon 
                icon={isDark ? "lucide:sun" : "lucide:moon"} 
                className={`text-woodBrown dark:text-lightWood ${isDark ? 'spin' : ''}`}
              />
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-woodBrown dark:text-lightWood">
          Website Content Dashboard
        </h1>

        <Tabs 
          aria-label="Dashboard sections"
          color="primary"
          variant="underlined"
          classNames={{
            base: "w-full",
            tabList: "gap-0 md:gap-6 overflow-x-auto",
            cursor: "bg-gradient-wood dark:bg-gradient-wood",
            tab: "max-w-fit px-3 md:px-4 h-12 text-sm md:text-base relative",
          }}
        >
          <Tab
            key="social"
            title={
              <div className="flex items-center gap-1 md:gap-2">
                <Icon icon="lucide:share-2" className="text-sm md:text-base" />
                <span>Social</span>
              </div>
            }
            className="border-r sm:border-r-0 border-gray-300 dark:border-gray-600 last:border-r-0"
          >
            <SocialLinksManager />
          </Tab>
          <Tab
            key="projects"
            title={
              <div className="flex items-center gap-1 md:gap-2">
                <Icon icon="lucide:briefcase" className="text-sm md:text-base" />
                <span>Projects</span>
              </div>
            }
            className="border-r sm:border-r-0 border-gray-300 dark:border-gray-600 last:border-r-0"
          >
            <ProjectsManager />
          </Tab>
          <Tab
            key="pricing"
            title={
              <div className="flex items-center gap-1 md:gap-2">
                <Icon icon="lucide:tag" className="text-sm md:text-base" />
                <span>Pricing</span>
              </div>
            }
            className="border-r sm:border-r-0 border-gray-300 dark:border-gray-600 last:border-r-0"
          >
            <PricingManager />
          </Tab>
          <Tab
            key="parallax"
            title={
              <div className="flex items-center gap-1 md:gap-2">
                <Icon icon="lucide:layers" className="text-sm md:text-base" />
                <span>Parallax</span>
              </div>
            }
            className="border-r sm:border-r-0 border-gray-300 dark:border-gray-600 last:border-r-0"
          >
            <ParallaxManager />
          </Tab>
          <Tab
            key="contact"
            title={
              <div className="flex items-center gap-1 md:gap-2">
                <Icon icon="lucide:map-pin" className="text-sm md:text-base" />
                <span>Contact</span>
              </div>
            }
            className="border-r sm:border-r-0 border-gray-300 dark:border-gray-600 last:border-r-0"
          >
            <ContactManager />
          </Tab>
        </Tabs>
      </main>
    </div>
  );
}