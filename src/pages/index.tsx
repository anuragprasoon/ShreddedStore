import Image from "next/image";
import DesktopNavbar from "@/components/topnav";
import Recommendation from "@/components/recommendation";
import ShreddedCarousel from "@/components/carousel";
import Footer from "@/components/footer";

export default function Home() {
  return (<>
    <DesktopNavbar />
    <ShreddedCarousel/>
    <Recommendation title="Recommended for You" products={[]} />
    <Recommendation title="Best Sellers" products={[]} />
    <Recommendation title="New Arrivals" products={[]} />
    <Footer/>
    
  </>
  );
}
