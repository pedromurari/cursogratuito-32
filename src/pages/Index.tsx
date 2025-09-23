import HeroSection from '@/components/HeroSection';
import CourseSection from '@/components/CourseSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import InstituteSection from '@/components/InstituteSection';
import InstructorsSection from '@/components/InstructorsSection';
import FAQSection from '@/components/FAQSection';
import FinalCTASection from '@/components/FinalCTASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <CourseSection />
      <TestimonialsSection />
      <InstituteSection />
      <InstructorsSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default Index;
