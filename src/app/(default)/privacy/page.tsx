import {
  createInfoPageMetadata,
  renderInfoPage,
} from "@/components/site/info-route";

export const metadata = createInfoPageMetadata("privacy");

export default function PrivacyPage() {
  return renderInfoPage("privacy");
}
