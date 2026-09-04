import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import FeaturesShowcase from '../components/FeaturesShowcase';
import TelegramHighlight from '../components/TelegramHighlight';
import WhyRobinhoodChain from '../components/WhyRobinhoodChain';
import CtaSection from '../components/CtaSection';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import './Landing.css';

function Landing() {
  return (
    <div className="landing">
      <Navbar />

      <Hero />

      <Reveal direction="up" delay={40}>
        <HowItWorks />
      </Reveal>

      <Reveal direction="scale" delay={40}>
        <FeaturesShowcase />
      </Reveal>

      <Reveal direction="left" delay={40}>
        <TelegramHighlight />
      </Reveal>

      <Reveal direction="up" delay={40}>
        <WhyRobinhoodChain />
      </Reveal>

      <Reveal direction="scale" delay={20}>
        <CtaSection />
      </Reveal>

      <Footer />
    </div>
  );
}

export default Landing;