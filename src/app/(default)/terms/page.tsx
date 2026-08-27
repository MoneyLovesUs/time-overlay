import {
  createInfoPageMetadata,
  renderInfoPage,
} from "@/components/site/info-route";

export const metadata = createInfoPageMetadata("terms");

export default function TermsPage() {
  return renderInfoPage("terms");
}
