import Image from "next/image";
import DesktopNavbar from "@/components/topnav";
import Recommendation from "@/components/recommendation";
import ShreddedCarousel from "@/components/carousel";
import Footer from "@/components/footer";
import productData from '@/data/products.json';
import { Product, ProductWithSingleImage } from "@/types/product";

export default function Home() {
  return (<>
    <DesktopNavbar />
    <ShreddedCarousel/>
    <Recommendation title="Recommended for You" products={[]} />
    <Recommendation
      title="Best Sellers"
      products={productData.products.map((p: Product): ProductWithSingleImage => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        image: p.images[0]
      }))}
    />
    <Recommendation
      title="New Arrivals"
      products={productData.products.map((p: Product): ProductWithSingleImage => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        image: p.images[0]
      }))}
    />
    <Footer/>
    
  </>
  );
}
