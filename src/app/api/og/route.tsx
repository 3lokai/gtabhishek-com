import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters from URL
    const title = searchParams.get("title") || "Next.js Starter";
    const description =
      searchParams.get("description") ||
      "A modern Next.js starter with TypeScript, Tailwind CSS, shadcn/ui, and Supabase";
    const theme = searchParams.get("theme") || "light";

    // Determine colors based on theme (matching design system oklch colors)
    // Dark: background oklch(0.22 0.015 260), foreground oklch(0.92 0.015 260), primary oklch(0.72 0.08 260)
    // Light: background oklch(0.99 0.00 260), foreground oklch(0.24 0.015 260), primary oklch(0.65 0.08 260)
    const bgColor = theme === "dark" ? "#383A4A" : "#FCFCFC";
    const textColor = theme === "dark" ? "#EBEBF0" : "#3D3F4A";
    const accentColor = theme === "dark" ? "#5B8FD9" : "#4A7BC4"; // Primary color from design system

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bgColor,
          backgroundImage:
            theme === "dark"
              ? "linear-gradient(45deg, #4D4F5C 25%, transparent 25%), linear-gradient(-45deg, #4D4F5C 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #4D4F5C 75%), linear-gradient(-45deg, transparent 75%, #4D4F5C 75%)"
              : "linear-gradient(45deg, #E1E2E5 25%, transparent 25%), linear-gradient(-45deg, #E1E2E5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #E1E2E5 75%), linear-gradient(-45deg, transparent 75%, #E1E2E5 75%)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          opacity: theme === "dark" ? 0.1 : 0.05,
        }}
      >
        {/* Main content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            maxWidth: "800px",
            padding: "40px",
            backgroundColor: bgColor,
            borderRadius: "20px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", // Using shadow-2xl equivalent
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: accentColor,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "20px",
              }}
            >
              <span
                style={{
                  color: "#FFFFFF", // Primary foreground color equivalent
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                N
              </span>
            </div>
            <span
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: textColor,
              }}
            >
              Next.js Starter
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: textColor,
              textAlign: "center",
              margin: "0 0 20px 0",
              lineHeight: "1.2",
              maxWidth: "700px",
            }}
          >
            {title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "24px",
              color: textColor,
              textAlign: "center",
              margin: "0 0 30px 0",
              opacity: 0.8,
              maxWidth: "600px",
              lineHeight: "1.4",
            }}
          >
            {description}
          </p>

          {/* Tech stack badges */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            {[
              "Next.js 15",
              "React 19",
              "TypeScript",
              "Tailwind CSS",
              "Supabase",
            ].map((tech) => (
              <div
                key={tech}
                style={{
                  backgroundColor: accentColor,
                  color: "#FFFFFF", // Primary foreground color equivalent
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
