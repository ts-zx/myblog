import { AboutContent } from "@/components/AboutContent";
import { siteConfig } from "@/app/site.config";

export const metadata = {
  title: "关于",
  description: `关于 ${siteConfig.author} · ${siteConfig.name}`,
};

export default function AboutPage() {
  return <AboutContent />;
}
