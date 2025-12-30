import { ReactNode } from "react";
import Link from "next/link";
import { ExternalLinkIcon, GitBranchIcon } from "lucide-react";
import OnboardingLayout from "@/components/layout/onboarding-layout";
import { Text } from "@/components/ui/text";
import { demo_url, github_repo } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const features = [
  {
    heading: "All Page Views",
    description: "Track every page load across your entire site automatically.",
    points: ["Identify top pages", "Track user navigation"],
  },
  {
    heading: "Browser Tracking",
    description: "Understand what browsers and devices your visitors use.",
    points: ["Browser detection", "OS tracking"],
  },
  {
    heading: "Unique Visitors",
    description: "Know exactly how many individual people visited your site.",
    points: ["Unique visitor count", "Session tracking"],
  },
  {
    heading: "Total Visitors",
    description: "See your complete visitor traffic across all time periods.",
    points: ["Total visitor count", "Growth metrics"],
  },
];

const Home = () => (
  <div className="min-h-[calc(100vh-50px)] w-full">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="py-10 md:py-20 max-w-md space-y-2">
        <Text semibold lg className="text-orange-600">
          StatsLog
        </Text>
        <Text render={<h1 />} semibold xxl>
          Track every visitor
        </Text>
        <Text className="text-muted-foreground">
          Lightweight analytics for your website. Monitor page views, browser
          data, and visitor patterns with a simple script. No complexity, just
          insights.
        </Text>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href={github_repo}>
              <GitBranchIcon />
              GitHub
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={demo_url}>
              Demo <ExternalLinkIcon />
            </Link>
          </Button>
        </div>
      </div>

      <div className="py-10 md:py-20">
        <div>
          {features.map((feature) => (
            <div key={feature.heading} className="mb-6">
              <Text medium className="uppercase font-mono">
                {feature.heading}
              </Text>
              <Text sm className="text-muted-foreground">
                {feature.description}
              </Text>

              <div>
                {feature.points.map((point) => (
                  <div key={point} className="flex items-center space-x-2">
                    <div className="size-1 bg-primary rounded-full" />
                    <Text className="text-muted-foreground text-sm">
                      {point}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="space-y-4 mb-10 max-w-lg">
      <Text medium className="uppercase tracking-wider">
        Tech Stack
      </Text>
      <Text>
        <Text sm medium render={<span />} className="font-mono uppercase">
          Backend:
        </Text>
        <Text sm render={<span />} className="text-muted-foreground">
          Express.js server with Prisma ORM and PostgreSQL database for reliable
          data storage and querying.
        </Text>
      </Text>

      <Text>
        <Text sm medium render={<span />} className="font-mono uppercase">
          Frontend:
        </Text>
        <Text sm render={<span />} className="text-muted-foreground">
          Next.js with shadcn UI components for a fast, responsive dashboard.
        </Text>
      </Text>
    </div>
  </div>
);

Home.getLayout = (page: ReactNode) => (
  <OnboardingLayout>{page}</OnboardingLayout>
);

export default Home;
