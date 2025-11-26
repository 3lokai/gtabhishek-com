import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const logoVariants = cva("inline-block shrink-0", {
  variants: {
    size: {
      sm: "size-8",
      md: "size-12",
      lg: "size-16",
      xl: "size-24",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type LogoColorVariant = "default" | "monochrome" | "inverted";

interface LogoProps
  extends Omit<React.SVGProps<SVGSVGElement>, "viewBox" | "xmlns">,
    VariantProps<typeof logoVariants> {
  /**
   * Color variant of the logo
   * - default: Uses brand colors (secondary for circle, accent for GT)
   * - monochrome: Single color (uses currentColor)
   * - inverted: Inverted colors (accent for circle, secondary for GT)
   */
  colorVariant?: LogoColorVariant;
  /**
   * Custom color for the circle
   * Overrides colorVariant when provided
   */
  primaryColor?: string;
  /**
   * Custom color for the GT/coffee bean shape
   * Overrides colorVariant when provided
   */
  secondaryColor?: string;
  /**
   * Custom width (overrides size variant)
   */
  width?: number | string;
  /**
   * Custom height (overrides size variant)
   */
  height?: number | string;
}

function Logo({
  className,
  size,
  colorVariant = "default",
  primaryColor,
  secondaryColor,
  width,
  height,
  ...props
}: LogoProps) {
  const getColors = (): { circle: string; gt: string } => {
    // Custom colors override everything
    if (primaryColor && secondaryColor) {
      return { circle: primaryColor, gt: secondaryColor };
    }

    // Color variants
    switch (colorVariant) {
      case "monochrome":
        return { circle: "currentColor", gt: "currentColor" };
      case "inverted":
        return {
          circle: "var(--accent)",
          gt: "var(--secondary)",
        };
      default:
        return {
          circle: "var(--secondary)",
          gt: "var(--accent)",
        };
    }
  };

  const colors = getColors();

  // Only apply size class if custom width/height are not provided
  const hasCustomDimensions = width !== undefined || height !== undefined;
  const sizeClass = hasCustomDimensions
    ? undefined
    : logoVariants({ size, className });

  // Calculate dimensions - use custom if provided, otherwise let CSS handle it via size class
  const svgWidth = width;
  const svgHeight = height;

  return (
    <svg
      aria-label="GT Logo"
      className={cn(sizeClass, className)}
      height={svgHeight}
      role="img"
      version="1.1"
      viewBox="0 0 587 706"
      width={svgWidth}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <title>GT Logo</title>
      <g transform="matrix(1,0,0,1,-749.961945,-290.264465)">
        <g transform="matrix(4.166667,0,0,4.166667,0,0)">
          <g transform="matrix(1.540532,0,0,1.540532,-134.784247,-62.704613)">
            <path
              d="M205.151,140.882C205.151,116.112 225.231,96.033 250,96.033C274.769,96.033 294.849,116.112 294.849,140.882C294.849,165.651 274.769,185.73 250,185.73C225.231,185.73 205.151,165.651 205.151,140.882Z"
              fill={colors.circle}
              fillRule="nonzero"
            />
          </g>
          <g transform="matrix(1.540532,0,0,1.540532,-134.784247,-62.704613)">
            <path
              d="M253.859,120.513C253.008,123.326 252.248,126.167 251.617,129.037C249.045,131.403 246.426,133.714 243.791,136.01C244.145,132.168 245.838,127.78 243.972,124.154C240.835,120.277 237.376,125.092 235.656,127.817C230.472,134.326 223.603,140.849 215.143,142.335C207.28,140.868 216.925,128.827 219.909,126.067C228.437,117.184 240.927,114.363 252.896,114.363C253.917,114.363 254.935,114.384 255.946,114.423C255.186,116.431 254.481,118.457 253.859,120.513ZM212.043,189.922C204.12,180.874 227.765,158.896 234.163,152.515C231.329,164.324 225.231,186.459 212.043,189.922ZM260.325,119.815C260.931,118.016 261.601,116.239 262.302,114.475C263.557,114.472 264.811,114.459 266.066,114.435C264.092,116.661 262.03,118.813 259.954,120.941C260.075,120.565 260.199,120.19 260.325,119.815ZM277.679,92.004C278.105,97.99 274.256,103.531 271.04,108.305C268.986,108.43 266.927,108.485 264.867,108.516C268.013,102.388 271.655,95.687 277.679,92.004ZM268.003,121.13C270.14,118.839 272.228,116.488 274.169,114.025C278.219,113.615 295.483,110.875 295.669,106.277C295.77,103.083 292.13,102.46 289.948,104.079C286.371,105.584 282.605,106.64 278.797,107.371C281.442,102.877 283.726,97.878 283.746,92.572C283.884,87.492 278.638,84.021 274.259,87.06C266.694,92.036 262.009,100.42 258.346,108.489C248.498,108.258 238.308,108.646 229.18,112.724C218.847,117.471 208.456,126.316 206.344,137.975C205.597,142.969 209.322,148.341 214.606,148.271C223.991,147.756 231.95,140.94 238.05,134.3C237.617,136.893 237.09,139.472 236.542,142.04C236.516,142.159 236.492,142.276 236.465,142.395C226.37,151.503 190.827,183.059 209.826,195.487C210.662,195.729 211.487,195.84 212.299,195.84C216.97,195.84 221.217,192.179 224.338,188.945C235.064,177.02 238.403,160.753 241.865,145.568C242.445,145.06 243.027,144.554 243.608,144.048C245.682,142.246 247.761,140.448 249.826,138.633C248.988,145.29 248.738,152.404 251.453,158.681C254.46,166.657 264.241,168.153 270.514,162.999C273.903,160.452 276.505,156.997 278.527,153.298C279.683,150.233 284.828,143.341 280.132,141.442C276.908,140.425 276.082,144.091 275.232,146.353C273.72,150.038 271.752,153.595 268.968,156.474C262.654,163.079 256.458,160.168 255.55,151.454C254.644,144.981 255.716,138.453 257.045,132.114C260.821,128.579 264.475,124.909 268.003,121.13Z"
              fill={colors.gt}
              fillRule="nonzero"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

export { Logo, logoVariants, type LogoProps, type LogoColorVariant };
