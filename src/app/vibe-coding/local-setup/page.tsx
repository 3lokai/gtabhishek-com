"use client";

import { CloudVsLocal } from "@/components/local-setup/sections/cloud-vs-local";
import { CoreServices } from "@/components/local-setup/sections/core-services";
import { LocalSetupHero } from "@/components/local-setup/sections/hero";
import { LabOrganization } from "@/components/local-setup/sections/lab-organization";
import { LocalModelStack } from "@/components/local-setup/sections/local-model-stack";
import { RequestFlow } from "@/components/local-setup/sections/request-flow";
import { SlackChannels } from "@/components/local-setup/sections/slack-channels";
import { UnderTheHood } from "@/components/local-setup/sections/under-the-hood";
import { PageShell } from "@/components/page-shell";

export default function LocalSetupPage() {
  return (
    <PageShell fullScreen>
      <LocalSetupHero />
      <LabOrganization />
      <CoreServices />
      <LocalModelStack />
      <RequestFlow />
      <SlackChannels />
      <CloudVsLocal />
      <UnderTheHood />
    </PageShell>
  );
}
