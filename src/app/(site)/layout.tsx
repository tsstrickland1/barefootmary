import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { StickyPlayer } from "@/components/audio/StickyPlayer";
import { AudioSpacer } from "@/components/audio/AudioSpacer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AudioProvider>
      <Nav />
      <main>{children}</main>
      <Footer />
      <AudioSpacer />
      <StickyPlayer />
    </AudioProvider>
  );
}
