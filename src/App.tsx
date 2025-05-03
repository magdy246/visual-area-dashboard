import React from 'react';
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
            tabList: "gap-6",
            cursor: "bg-gradient-wood dark:bg-gradient-wood",
            tab: "max-w-fit px-0 h-12",
          }}
        >
          <Tab
            key="social"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:share-2" />
                <span>Social Links</span>
              </div>
            }
          >
            <SocialLinksManager />
          </Tab>
          <Tab
            key="projects"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:briefcase" />
                <span>Projects</span>
              </div>
            }
          >
            <ProjectsManager />
          </Tab>
          <Tab
            key="pricing"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:tag" />
                <span>Pricing</span>
              </div>
            }
          >
            <PricingManager />
          </Tab>
          <Tab
            key="parallax"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:layers" />
                <span>Parallax Section</span>
              </div>
            }
          >
            <ParallaxManager />
          </Tab>
          <Tab
            key="contact"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:map-pin" />
                <span>Contact Us</span>
              </div>
            }
          >
            <ContactManager />
          </Tab>
        </Tabs>
      </main>
    </div>
  );
}