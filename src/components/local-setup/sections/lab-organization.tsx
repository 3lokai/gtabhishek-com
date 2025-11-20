"use client";

export function LabOrganization() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 py-20 md:py-32"
      id="lab-organization"
    >
      <div className="mb-12 text-center md:mb-16">
        <h2 className="font-extrabold text-3xl tracking-tight md:text-5xl lg:text-6xl">
          How the lab is organized
        </h2>
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="space-y-4 text-lg text-muted-foreground">
          <p>I split my local projects into four lanes:</p>
          <ul className="space-y-3 pl-6">
            <li>
              <span className="font-semibold text-foreground">ai-labs</span> –
              for raw prototypes and tests.
            </li>
            <li>
              <span className="font-semibold text-foreground">ai-stack</span> –
              reusable components that graduate from the lab.
            </li>
            <li>
              <span className="font-semibold text-foreground">
                ai-assistant
              </span>{" "}
              – automation and personal agent layer.
            </li>
            <li>
              <span className="font-semibold text-foreground">
                ai-dashboard
              </span>{" "}
              – visualization and control panel.
            </li>
          </ul>
          <p className="pt-4">
            The idea: prototype in <em>labs</em>, harden it in <em>stack</em>,
            then let <em>assistant</em> and <em>dashboards</em> drive it.
          </p>
        </div>
      </div>
    </section>
  );
}
