"use client";
import { Menu, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type NavbarProps = {
  children: React.ReactNode;
  className?: string;
};

type NavBodyProps = {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
};

type NavItemsProps = {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
};

type MobileNavProps = {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
};

type MobileNavHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

type MobileNavMenuProps = {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
};

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      className={cn("sticky inset-x-0 top-20 z-40 w-full", className)}
      // IMPORTANT: Change this to class of `fixed` if you want the navbar to be fixed
      ref={ref}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible }
            )
          : child
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => (
  <motion.div
    animate={{
      backdropFilter: visible ? "blur(10px)" : "none",
      boxShadow: visible ? "var(--shadow-lg)" : "none",
      width: visible ? "40%" : "100%",
      y: visible ? 20 : 0,
    }}
    className={cn(
      "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex dark:bg-transparent",
      visible && "bg-background/80 dark:bg-background/80",
      className
    )}
    style={{
      minWidth: "800px",
    }}
    transition={{
      type: "spring",
      stiffness: 200,
      damping: 50,
    }}
  >
    {children}
  </motion.div>
);

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const pathname = usePathname();

  const isActive = (link: string) => {
    if (link === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(link);
  };

  return (
    <motion.div
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 font-medium text-muted-foreground text-sm transition duration-200 hover:text-foreground lg:flex lg:space-x-2",
        className
      )}
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((item, idx) => {
        const active = isActive(item.link);
        const showPill = hovered === idx || (active && hovered === null);
        return (
          <Link
            className={cn(
              "relative px-4 py-2 transition-colors",
              active
                ? "font-medium text-accent-foreground"
                : "text-muted-foreground hover:text-accent-foreground"
            )}
            href={item.link}
            key={item.link}
            onClick={onItemClick}
            onMouseEnter={() => setHovered(idx)}
          >
            {showPill && (
              <motion.div
                className={cn(
                  "absolute inset-0 h-full w-full rounded-full",
                  active ? "bg-accent/80" : "bg-accent/40"
                )}
                layoutId="hovered"
              />
            )}
            <span className="relative z-20">{item.name}</span>
          </Link>
        );
      })}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => (
  <motion.div
    animate={{
      backdropFilter: visible ? "blur(10px)" : "none",
      boxShadow: visible ? "var(--shadow-lg)" : "none",
      width: visible ? "90%" : "100%",
      paddingRight: visible ? "12px" : "0px",
      paddingLeft: visible ? "12px" : "0px",
      borderRadius: visible ? "4px" : "2rem",
      y: visible ? 20 : 0,
    }}
    className={cn(
      "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
      visible && "bg-background/80 dark:bg-background/80",
      className
    )}
    transition={{
      type: "spring",
      stiffness: 200,
      damping: 50,
    }}
  >
    {children}
  </motion.div>
);

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => (
  <div
    className={cn(
      "flex w-full flex-row items-center justify-between",
      className
    )}
  >
    {children}
  </div>
);

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: MobileNavMenuProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        animate={{ opacity: 1 }}
        className={cn(
          "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-card px-4 py-8 shadow-lg dark:bg-card",
          className
        )}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) =>
  isOpen ? (
    <X className="text-foreground" onClick={onClick} />
  ) : (
    <Menu className="text-foreground" onClick={onClick} />
  );

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-4 py-2 rounded-md bg-card text-foreground text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

  const variantStyles = {
    primary: "bg-primary text-primary-foreground shadow-md hover:shadow-lg",
    secondary: "bg-transparent shadow-none text-foreground",
    dark: "bg-foreground text-background shadow-md hover:shadow-lg",
    gradient:
      "bg-gradient-to-b from-primary to-primary/80 text-primary-foreground shadow-md hover:shadow-lg",
  };

  return (
    <Tag
      className={cn(baseStyles, variantStyles[variant], className)}
      href={href || undefined}
      {...props}
    >
      {children}
    </Tag>
  );
};
