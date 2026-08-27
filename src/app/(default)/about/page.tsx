import {
  createInfoPageMetadata,
  renderInfoPage,
} from "@/components/site/info-route";

export const metadata = createInfoPageMetadata("about");

export default function AboutPage() {
  return renderInfoPage("about");
}
