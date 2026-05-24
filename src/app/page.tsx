import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BrandsSection from '@/components/BrandsSection';
import ServicesSection from '@/components/ServicesSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

export default function Home() {
  return (
    <main className="min-h-screen bg-dark">
      <Navbar />
      <Hero />
      <BrandsSection />
      <ServicesSection />
      <AboutSection />
      <Footer />
      <FloatingButtons />
    </main>
  );
}
