"use client";

import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  type TargetAndTransition,
  useMotionValue,
  useSpring,
} from "motion/react";
import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";

const springConfig = { stiffness: 200, damping: 20, bounce: 0.2 };

type ExpandableContextType = {
  isExpanded: boolean; // Indicates whether the component is expanded
  toggleExpand: () => void; // Function to toggle the expanded state
  expandDirection: "vertical" | "horizontal" | "both"; // Direction of expansion
  expandBehavior: "replace" | "push"; // How the expansion affects surrounding content
  transitionDuration: number; // Duration of the expansion/collapse animation
  easeType:
    | "easeInOut"
    | "easeIn"
    | "easeOut"
    | "linear"
    | [number, number, number, number]; // Easing function for the animation
  initialDelay: number; // Delay before the animation starts
  onExpandEnd?: () => void; // Callback function when expansion ends
  onCollapseEnd?: () => void; // Callback function when collapse ends
};

// Create a context with default values
const ExpandableContext = createContext<ExpandableContextType>({
  isExpanded: false,
  toggleExpand: () => {
    // Default no-op function
  },
  expandDirection: "vertical", // 'vertical' | 'horizontal' | 'both' // Direction of expansion
  expandBehavior: "replace", // How the expansion affects surrounding content
  transitionDuration: 0.3, // Duration of the expansion/collapse animation
  easeType: "easeInOut" as const, // Easing function for the animation
  initialDelay: 0,
});

// Custom hook to use the ExpandableContext
const useExpandable = () => useContext(ExpandableContext);

type ExpandablePropsBase = Omit<HTMLMotionProps<"div">, "children">;

interface ExpandableProps extends ExpandablePropsBase {
  children: ReactNode | ((props: { isExpanded: boolean }) => ReactNode);
  expanded?: boolean;
  onToggle?: () => void;
  transitionDuration?: number;
  easeType?:
    | "easeInOut"
    | "easeIn"
    | "easeOut"
    | "linear"
    | [number, number, number, number];
  expandDirection?: "vertical" | "horizontal" | "both";
  expandBehavior?: "replace" | "push";
  initialDelay?: number;
  onExpandStart?: () => void;
  onExpandEnd?: () => void;
  onCollapseStart?: () => void;
  onCollapseEnd?: () => void;
}
// ROOT Expand component
const Expandable = ({
  children,
  expanded,
  onToggle,
  transitionDuration = 0.3,
  easeType = "easeInOut" as const,
  expandDirection = "vertical",
  expandBehavior = "replace",
  initialDelay = 0,
  onExpandStart,
  onExpandEnd,
  onCollapseStart,
  onCollapseEnd,
  ref,
  ...props
}: ExpandableProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  // Internal state for expansion when the component is uncontrolled
  const [isExpandedInternal, setIsExpandedInternal] = useState(false);

  // Use the provided expanded prop if available, otherwise use internal state
  const isExpanded = expanded !== undefined ? expanded : isExpandedInternal;

  // Use the provided onToggle function if available, otherwise use internal toggle function
  const toggleExpand =
    onToggle || (() => setIsExpandedInternal((prev) => !prev));

  // Effect to call onExpandStart or onCollapseStart when isExpanded changes
  useEffect(() => {
    if (isExpanded) {
      onExpandStart?.();
    } else {
      onCollapseStart?.();
    }
  }, [isExpanded, onExpandStart, onCollapseStart]);

  // Create the context value to be provided to child components
  const contextValue: ExpandableContextType = {
    isExpanded,
    toggleExpand,
    expandDirection,
    expandBehavior,
    transitionDuration,
    easeType,
    initialDelay,
    onExpandEnd,
    onCollapseEnd,
  };

  return (
    <ExpandableContext.Provider value={contextValue}>
      <motion.div
        initial={false}
        ref={ref}
        transition={{
          duration: transitionDuration,
          ease: easeType,
          delay: initialDelay,
        }}
        {...props}
      >
        {/* Render children as a function if provided, otherwise render as is */}
        {typeof children === "function" ? children({ isExpanded }) : children}
      </motion.div>
    </ExpandableContext.Provider>
  );
};

// Simplify animation types
type AnimationPreset = {
  initial: { [key: string]: any };
  animate: { [key: string]: any };
  exit: { [key: string]: any };
};

// Update ANIMATION_PRESETS type
const ANIMATION_PRESETS: Record<string, AnimationPreset> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  "slide-left": {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  "slide-right": {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  rotate: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: -10 },
  },
  "blur-sm": {
    initial: { opacity: 0, filter: "blur(4px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(4px)" },
  },
  "blur-md": {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(8px)" },
  },
  "blur-lg": {
    initial: { opacity: 0, filter: "blur(16px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(16px)" },
  },
};

// Props for defining custom animations
type AnimationProps = {
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  exit?: TargetAndTransition;
  transition?: any;
};

// Inside ExpandableContent component
const getAnimationProps = (
  preset: keyof typeof ANIMATION_PRESETS | undefined,
  _animateIn?: AnimationProps,
  animateOut?: AnimationProps
) => {
  const defaultAnimation = {
    initial: {},
    animate: {},
    exit: {},
  };

  const presetAnimation = preset ? ANIMATION_PRESETS[preset] : defaultAnimation;

  return {
    initial: presetAnimation.initial,
    animate: presetAnimation.animate,
    exit: animateOut?.exit || presetAnimation.exit,
  };
};

// Wrap this around items in the card that you want to be hidden then animated in on expansion
const ExpandableContent = ({
  children,
  preset,
  animateIn,
  animateOut,
  stagger = false,
  staggerChildren = 0.1,
  keepMounted = false,
  ref,
  ...props
}: Omit<HTMLMotionProps<"div">, "ref"> & {
  preset?: keyof typeof ANIMATION_PRESETS;
  animateIn?: AnimationProps;
  animateOut?: AnimationProps;
  stagger?: boolean;
  staggerChildren?: number;
  keepMounted?: boolean;
} & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const { isExpanded, transitionDuration, easeType } = useExpandable();
  // useMeasure is used to measure the height of the content
  const [measureRef, { height: measuredHeight }] = useMeasure();
  // useMotionValue creates a value that can be animated smoothly
  const animatedHeight = useMotionValue(0);
  // useSpring applies a spring animation to the height value
  const smoothHeight = useSpring(animatedHeight, springConfig);

  useEffect(() => {
    // Animate the height based on whether the content is expanded or collapsed
    if (isExpanded) {
      animatedHeight.set(measuredHeight);
    } else {
      animatedHeight.set(0);
    }
  }, [isExpanded, measuredHeight, animatedHeight]);

  const animationProps = getAnimationProps(preset, animateIn, animateOut);

  return (
    // This motion.div animates the height of the content
    <motion.div
      ref={ref}
      style={{
        height: smoothHeight,
        overflow: "hidden",
      }}
      transition={{ duration: transitionDuration, ease: easeType }}
      {...props}
    >
      {/* AnimatePresence handles the entering and exiting of components */}
      <AnimatePresence initial={false}>
        {(isExpanded || keepMounted) && (
          // This motion.div handles the animation of the content itself
          <motion.div
            animate={animationProps.animate}
            exit={animationProps.exit}
            initial={animationProps.initial}
            ref={measureRef}
            transition={{ duration: transitionDuration, ease: easeType }}
          >
            {stagger ? (
              // If stagger is true, we apply a staggered animation to the children
              <motion.div
                animate="visible"
                initial="hidden"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren,
                    },
                  },
                }}
              >
                {React.Children.map(
                  children as React.ReactNode,
                  (child, index) => (
                    <motion.div
                      key={`${child?.toLocaleString}-${index}`}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      {child}
                    </motion.div>
                  )
                )}
              </motion.div>
            ) : (
              children
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

type ExpandableCardProps = {
  children: ReactNode;
  className?: string;
  collapsedSize?: { width?: number; height?: number }; // Size when collapsed
  expandedSize?: { width?: number; height?: number }; // Size when expanded
  hoverToExpand?: boolean; // Whether to expand on hover
  expandDelay?: number; // Delay before expanding
  collapseDelay?: number; // Delay before collapsing
};

const ExpandableCard = ({
  children,
  className = "",
  collapsedSize = { width: 320, height: 211 },
  expandedSize = { width: 480, height: undefined },
  hoverToExpand = false,
  expandDelay = 0,
  collapseDelay = 0,
  ref,
  ...props
}: ExpandableCardProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  // Get the expansion state and toggle function from the ExpandableContext
  const { isExpanded, toggleExpand, expandDirection } = useExpandable();

  // Use useMeasure hook to get the dimensions of the content
  const [measureRef, { width, height }] = useMeasure();

  // Create motion values for width and height
  const animatedWidth = useMotionValue(collapsedSize.width || 0);
  const animatedHeight = useMotionValue(collapsedSize.height || 0);

  // Apply spring animation to the motion values
  const smoothWidth = useSpring(animatedWidth, springConfig);
  const _smoothHeight = useSpring(animatedHeight, springConfig);

  // Refs to track timeout IDs for proper cleanup
  const expandTimeoutRef = useRef<number | null>(null);
  const collapseTimeoutRef = useRef<number | null>(null);

  // Effect to update the animated dimensions when expansion state changes
  useEffect(() => {
    if (isExpanded) {
      animatedWidth.set(expandedSize.width || width);
      animatedHeight.set(expandedSize.height || height);
    } else {
      animatedWidth.set(collapsedSize.width || width);
      animatedHeight.set(collapsedSize.height || height);
    }
  }, [
    isExpanded,
    collapsedSize,
    expandedSize,
    width,
    height,
    animatedWidth,
    animatedHeight,
  ]);

  // Cleanup timeouts on unmount
  useEffect(
    () => () => {
      if (expandTimeoutRef.current !== null) {
        clearTimeout(expandTimeoutRef.current);
      }
      if (collapseTimeoutRef.current !== null) {
        clearTimeout(collapseTimeoutRef.current);
      }
    },
    []
  );

  // Handler for hover start event
  const handleHover = () => {
    // Clear any pending collapse timeout
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }

    if (hoverToExpand && !isExpanded) {
      expandTimeoutRef.current = window.setTimeout(() => {
        toggleExpand();
        expandTimeoutRef.current = null;
      }, expandDelay);
    }
  };

  // Handler for hover end event
  const handleHoverEnd = () => {
    // Clear any pending expand timeout
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
      expandTimeoutRef.current = null;
    }

    if (hoverToExpand && isExpanded) {
      collapseTimeoutRef.current = window.setTimeout(() => {
        toggleExpand();
        collapseTimeoutRef.current = null;
      }, collapseDelay);
    }
  };

  return (
    <motion.div
      className={cn("cursor-pointer", className)}
      onHoverEnd={handleHoverEnd}
      onHoverStart={handleHover}
      ref={ref}
      style={{
        // Set width and height based on expansion direction
        width:
          expandDirection === "vertical"
            ? (collapsedSize.width ?? "100%")
            : smoothWidth,
        height:
          expandDirection === "horizontal"
            ? (collapsedSize.height ?? "auto")
            : undefined, // Let ExpandableContent handle vertical expansion
        minHeight:
          expandDirection === "vertical" && collapsedSize.height
            ? collapsedSize.height
            : undefined,
      }}
      transition={springConfig}
      {...props}
    >
      {/* Ref for measuring content dimensions (so we can let framer know to animate into the dimensions) */}
      <div className="flex h-full flex-col" ref={measureRef}>
        {children}
      </div>
    </motion.div>
  );
};

ExpandableCard.displayName = "ExpandableCard";

// I'm telling you we just have to expand 🤌💵
const ExpandableTrigger = ({
  children,
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & {
  ref?: React.RefObject<HTMLButtonElement | null>;
}) => {
  const { toggleExpand } = useExpandable();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleExpand();
    }
  };

  return (
    <button
      aria-label="Toggle expand"
      className={cn("cursor-pointer", className)}
      onClick={toggleExpand}
      onKeyDown={handleKeyDown}
      ref={ref}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

ExpandableTrigger.displayName = "ExpandableTrigger";

const ExpandableCardHeader = ({
  className,
  children,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    ref={ref}
    {...props}
  >
    <motion.div className="flex items-start justify-between" layout>
      {children}
    </motion.div>
  </div>
);

ExpandableCardHeader.displayName = "ExpandableCardHeader";

const ExpandableCardContent = ({
  className,
  children,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => (
  <div
    className={cn("flex-grow overflow-hidden p-6 px-4 pt-0", className)}
    ref={ref}
    {...props}
  >
    <motion.div layout>{children}</motion.div>
  </div>
);
ExpandableCardContent.displayName = "ExpandableCardContent";

const ExpandableCardFooter = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => (
  <div
    className={cn("flex items-center p-4 pt-0", className)}
    ref={ref}
    {...props}
  />
);
ExpandableCardFooter.displayName = "ExpandableCardFooter";

export {
  Expandable,
  useExpandable,
  ExpandableCard,
  ExpandableContent,
  ExpandableContext,
  ExpandableTrigger,
  ExpandableCardHeader,
  ExpandableCardContent,
  ExpandableCardFooter,
};
