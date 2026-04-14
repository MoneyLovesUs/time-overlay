import { permanentRedirect } from "next/navigation";

export default function GeneratorRedirectPage() {
  permanentRedirect("/");
}
