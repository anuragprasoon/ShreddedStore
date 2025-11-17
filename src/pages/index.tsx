import Image from "next/image";
import DesktopNavbar from "@/components/topnav";
import Recommendation from "@/components/recommendation";
import ShreddedCarousel from "@/components/carousel";
import Footer from "@/components/footer";
import productData from '@/data/products.json';
import { Product, ProductWithSingleImage } from "@/types/product";
import mixpanel from "mixpanel-browser";



export default function Home() {
  mixpanel.init('edae966047b0acb149ae12f73980fd65', {
    autocapture: true,
    record_sessions_percent: 100,
  })

  return (<>
    <DesktopNavbar />
    <ShreddedCarousel/>
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
    <div className="fixed absolute bottom-2 right-2">
        <a href="https://api.whatsapp.com/send/?phone=917003634432&text=Hi">
          <img src="https://res.cloudinary.com/dibrmj6nh/image/upload/v1747946474/Frame_1597884222_xnchxt.png" className="w-[50px]"/>
        </a>
    </div>
    <Footer/>
    
  </>
  );
}
