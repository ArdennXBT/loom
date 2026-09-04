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
import Reveal from '../components/Reveal';
import './Landing.css';

function Landing() {
  return (
    <div className="landing">
      <Navbar />

      <Reveal direction="up">
        <Hero />
      </Reveal>

      <Reveal direction="up">
        <StatsBar />
      </Reveal>

      <Reveal direction="up">
        <HowItWorks />
      </Reveal>

      <Reveal direction="up">
        <FeaturesShowcase />
      </Reveal>

      <Reveal direction="up">
        <TelegramHighlight />
      </Reveal>

      <Reveal direction="up">
        <ProductPreview />
      </Reveal>

      <Reveal direction="up">
        <WhyRobinhoodChain />
      </Reveal>

      {/* Section FAQ : reste statique, pas d'animation au scroll */}
      <Faq />

      <Reveal direction="up">
        <CtaSection />
      </Reveal>

      <Footer />
    </div>
  );
}

export default Landing;