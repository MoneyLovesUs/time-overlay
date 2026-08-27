import {
  createInfoPageMetadata,
  renderInfoPage,
} from "@/components/site/info-route";

export const metadata = createInfoPageMetadata("contact");

export default function ContactPage() {
  return renderInfoPage("contact");
}
