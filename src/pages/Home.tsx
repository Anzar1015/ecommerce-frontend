import { HeroSection } from '@/components/features/home/HeroSection';
import { CategoriesSection } from '@/components/features/home/CategoriesSection';
import { FeaturedProductsSection } from '@/components/features/home/FeaturedProductsSection';
import { PromoBanner } from '@/components/features/home/PromoBanner';
import { BestSellersSection } from '@/components/features/home/BestSellersSection';
import { WhyChooseUsSection } from '@/components/features/home/WhyChooseUsSection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <PromoBanner />
      <BestSellersSection />
      <WhyChooseUsSection />
    </div>
  );
}
