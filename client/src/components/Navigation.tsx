import * as React from "react";
import { cn } from "../lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

import { Link } from "react-router-dom";
const components: { title: string; href: string; description: string }[] = [
  {
    title: "Easy Editor",
    href: "/docs/features/easy-editor",
    description:
      "A user-friendly editor that simplifies content creation and formatting.",
  },
  {
    title: "SEO Tools",
    href: "/docs/features/seo-tools",
    description:
      "Built-in tools to optimize your blog posts for search engines.",
  },
  {
    title: "Custom Themes",
    href: "/docs/features/custom-themes",
    description: "A variety of customizable themes to match your unique style.",
  },
  {
    title: "Analytics",
    href: "/docs/features/analytics",
    description:
      "Detailed analytics to track your blog's performance and audience engagement.",
  },
  {
    title: "Social Sharing",
    href: "/docs/features/social-sharing",
    description:
      "Easily share your posts on social media platforms with integrated sharing tools.",
  },
  {
    title: "Mobile Friendly",
    href: "/docs/features/mobile-friendly",
    description:
      "Responsive design ensuring your blog looks great on all devices.",
  },
];

const Navigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-inherit">
            Getting started
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-gray-400/90 to-gray-500/90 p-6 no-underline outline-none hover:shadow-md"
                    to="/"
                  >
                    <img
                      src="https://logodix.com/logo/561404.png"
                      alt="quilllogo"
                    />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Quillfire
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Publish your voice: Transform ideas into impactful
                      stories, effortlessly online
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/" title="Introduction">
                Unleash your creativity: Publish compelling stories with our
                seamless platform.
              </ListItem>
              <ListItem href="/signin" title="Signin">
                Welcome back! Sign in to continue sharing your unique voice.
              </ListItem>
              <ListItem href="/signup" title="Signup">
                Join now and start turning your ideas into impactful stories.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-inherit">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/docs">
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-slate-100/50 data-[state=open]:bg-slate-100/50 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 dark:data-[active]:bg-slate-800/50 dark:data-[state=open]:bg-slate-800/50">
              Documentation
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-slate-200/90 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navigation;
