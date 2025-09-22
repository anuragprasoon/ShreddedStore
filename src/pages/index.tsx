import Image from "next/image";
import DesktopNavbar from "@/components/topnav";
import Recommendation from "@/components/recommendation";
import ShreddedCarousel from "@/components/carousel";
import Footer from "@/components/footer";
import productData from '@/data/products.json';

export default function Home() {
  return (<>
    <DesktopNavbar />
    <ShreddedCarousel/>
    <Recommendation title="Recommended for You" products={[]} />
    <Recommendation
      title="Best Sellers"
      products={productData.products.map((p: any) => ({
        ...p,
        image: p.images && p.images.length > 0 ? p.images[0] : "",
      }))}
    />
    <Recommendation
      title="New Arrivals"
      products={productData.products.map((p: any) => ({
        ...p,
        image: p.images && p.images.length > 0 ? p.images[0] : "",
      }))}
    />
    <Footer/>
    
  </>
  );
}
