import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Footer from "./components/Footer";
import WhatsApp from "./components/WhatsApp";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Products />
      <Footer />
      <WhatsApp />
    </>
  );
}