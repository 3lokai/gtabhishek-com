"use client";

import { Calendar, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { submitContactForm } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const MotionCard = motion.create(Card);

// Email validation regex - defined at top level for performance
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactSection() {
  const [formState, setFormState] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ status: "idle" });

  const [emailValue, setEmailValue] = useState<string>("");
  const [nameValue, setNameValue] = useState<string>("");

  function validateName(name: string): boolean {
    if (!name || name.trim().length < 1) {
      return false;
    }
    if (name.length > 100) {
      return false;
    }
    return true;
  }

  function validateEmail(email: string): boolean {
    if (!email) {
      return false;
    }
    if (!emailRegex.test(email)) {
      return false;
    }
    return true;
  }

  function validateForm(name: string, email: string): string[] {
    const errors: string[] = [];
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);

    if (!isNameValid) {
      errors.push("Name is required");
    }
    if (!isEmailValid) {
      errors.push("Please enter a valid email address");
    }
    return errors;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    // Client-side validation before submission
    const validationErrors = validateForm(name, email);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    setFormState({ status: "loading" });

    const result = await submitContactForm(formData);

    if (result.success) {
      setFormState({ status: "idle" });
      toast.success(result.message ?? "Message sent successfully!");
      // Reset form and all state
      const form = document.getElementById("contact-form") as HTMLFormElement;
      form?.reset();
      setEmailValue("");
      setNameValue("");
    } else {
      setFormState({ status: "idle" });
      toast.error(result.error ?? "Failed to send message. Please try again.");
    }
  }

  return (
    <div className="space-y-8">
      {/* Tabs section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          delay: 0.1,
        }}
      >
        <Tabs className="w-full" defaultValue="calendar">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Schedule a Call</TabsTrigger>
            <TabsTrigger value="email">Send Email</TabsTrigger>
          </TabsList>

          <TabsContent className="mt-6" value="calendar">
            <MotionCard
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="group relative overflow-hidden rounded-[1.25rem] border border-border/50 bg-gradient-to-b from-card/40 to-card/20 backdrop-blur-sm transition-all hover:border-accent hover:bg-accent/5 hover:shadow-lg"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              {/* Glow effect on hover */}
              <motion.div
                animate={{ opacity: 0, scale: 0.8 }}
                aria-hidden
                className="pointer-events-none absolute inset-0 blur-2xl"
                style={{
                  background:
                    "radial-gradient(600px 200px at 20% -20%, color-mix(in oklch, var(--accent) 15%, transparent), transparent 60%)",
                }}
                whileHover={{ opacity: 1, scale: 1.1 }}
              />

              <CardHeader className="relative z-20">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 font-semibold text-xl md:text-2xl">
                      <Calendar className="h-5 w-5" />
                      Book a Call
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm md:text-base">
                      Book a time that works for you. I&apos;ll send you a
                      confirmation email.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-20">
                <div className="relative h-[600px] w-full overflow-hidden rounded-lg border border-border/50">
                  <iframe
                    className="h-full w-full bg-background [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    scrolling="no"
                    src="https://cal.com/gt-abhishek/30min"
                    style={{ overflow: "hidden" }}
                    title="Schedule a call with GT Abhishek"
                  />
                </div>
              </CardContent>
            </MotionCard>
          </TabsContent>

          <TabsContent className="mt-6" value="email">
            <MotionCard
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="group relative overflow-hidden rounded-[1.25rem] border border-border/50 bg-gradient-to-b from-card/40 to-card/20 backdrop-blur-sm transition-all hover:border-accent hover:bg-accent/5 hover:shadow-lg"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              {/* Glow effect on hover */}
              <motion.div
                animate={{ opacity: 0, scale: 0.8 }}
                aria-hidden
                className="pointer-events-none absolute inset-0 blur-2xl"
                style={{
                  background:
                    "radial-gradient(600px 200px at 20% -20%, color-mix(in oklch, var(--accent) 15%, transparent), transparent 60%)",
                }}
                whileHover={{ opacity: 1, scale: 1.1 }}
              />

              <CardHeader className="relative z-20">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 font-semibold text-xl md:text-2xl">
                      <Mail className="h-5 w-5" />
                      Send a Message
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm md:text-base">
                      Send me a message and I&apos;ll get back to you as soon as
                      possible.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-20">
                <form
                  className="space-y-4"
                  id="contact-form"
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <motion.div
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-2"
                    initial={{ opacity: 0, x: -10 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      delay: 0.1,
                    }}
                  >
                    <label
                      className="font-medium text-foreground text-sm"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      onBlur={(e) => {
                        if (e.target.value && !validateName(e.target.value)) {
                          toast.error("Name is required");
                        }
                      }}
                      onChange={(e) => {
                        setNameValue(e.target.value);
                      }}
                      placeholder="Your name"
                      required
                      type="text"
                      value={nameValue}
                    />
                  </motion.div>
                  <motion.div
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-2"
                    initial={{ opacity: 0, x: -10 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      delay: 0.15,
                    }}
                  >
                    <label
                      className="font-medium text-foreground text-sm"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      onBlur={(e) => {
                        if (e.target.value && !validateEmail(e.target.value)) {
                          toast.error("Please enter a valid email address");
                        }
                      }}
                      onChange={(e) => {
                        setEmailValue(e.target.value);
                      }}
                      placeholder="your.email@example.com"
                      required
                      type="email"
                      value={emailValue}
                    />
                  </motion.div>
                  <motion.div
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-2"
                    initial={{ opacity: 0, x: -10 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      delay: 0.2,
                    }}
                  >
                    <label
                      className="font-medium text-foreground text-sm"
                      htmlFor="message"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message..."
                      required
                      rows={6}
                    />
                  </motion.div>
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 10 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      delay: 0.25,
                    }}
                  >
                    <Button
                      className="w-full"
                      disabled={formState.status === "loading"}
                      type="submit"
                    >
                      {formState.status === "loading"
                        ? "Sending..."
                        : "Send Message"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </MotionCard>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
