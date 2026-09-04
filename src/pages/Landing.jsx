import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import HowItWorks from '../components/HowItWorks';
import FeaturesShowcase from '../components/FeaturesShowcase';
import TelegramHighlight from '../components/TelegramHighlight';
import ProductPreview from '../components/ProductPreview';
import WhyRobinhoodChain from '../components/WhyRobinhoodChain';
import Faq from '../components/Faq';
import CtaSection from '../components/CtaSection';
import Footer from '../components/Footer';
import './Landing.css';

function Landing() {
  return (
    <div className="landing">
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <FeaturesShowcase />
      <TelegramHighlight />
      <ProductPreview />
      <WhyRobinhoodChain />
      <Faq />
      <CtaSection />
      <Footer />
    </div>
  );
}

export default Landing;