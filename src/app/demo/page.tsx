"use client";

import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";

export default function Demo() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="font-bold text-4xl tracking-tight">GT Abhishek</h1>
          <p className="text-muted-foreground text-xl">
            Developer, Designer, and Creative Professional
          </p>
        </div>

        <Separator />

        {/* Components Showcase */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Various button styles and sizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          {/* Form Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
              <CardDescription>Input fields and controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Enter your email" />
              <div className="flex items-center space-x-2">
                <Switch id="notifications" />
                <label htmlFor="notifications">Enable notifications</label>
              </div>
              <div className="flex gap-2">
                <Toggle>Toggle</Toggle>
                <Toggle pressed>Pressed</Toggle>
              </div>
            </CardContent>
          </Card>

          {/* Progress & Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Progress & Alerts</CardTitle>
              <CardDescription>
                Progress indicators and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Progress value={33} />
                <Progress value={66} />
                <Progress value={100} />
              </div>
              <Alert>
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your account has been created successfully.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Interactive elements and toasts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full"
                onClick={() => toast.success("Hello from Sonner!")}
              >
                Show Toast
              </Button>
              <Button
                className="w-full"
                onClick={() => toast.error("Something went wrong!")}
                variant="outline"
              >
                Error Toast
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Tech Stack</CardTitle>
            <CardDescription>
              Everything you need to build modern web applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Frontend</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Next.js 15</li>
                  <li>• React 19</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS v4</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">UI Components</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• shadcn/ui</li>
                  <li>• Radix UI</li>
                  <li>• Lucide Icons</li>
                  <li>• Sonner Toasts</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Backend</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Supabase</li>
                  <li>• PostgreSQL</li>
                  <li>• Real-time</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Tools</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Biome</li>
                  <li>• Ultracite</li>
                  <li>• Husky</li>
                  <li>• next-themes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
