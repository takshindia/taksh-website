import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const features = [
    "Laser Engraving",
    "Personalized Gifts",
    "Wood Craft",
    "Acrylic",
    "Corporate Gifts",
    "Custom Orders",
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-[#111111] to-black flex items-center justify-center px-5 py-20">
      <div className="max-w-6xl mx-auto text-center">

        <Image
          src="/taksh-logo.png"
          alt="तक्ष Logo"
          width={420}
          height={320}
          priority
          className="w-56 sm:w-64 md:w-80 lg:w-[420px] h-auto mx-auto mb-8"
        />

        <h1 className="text-white font-bold leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          Premium Laser
          <br />
          Engraving &
          <br />
          Personalized Gifts
        </h1>

        <p className="text-gray-300 mt-6 max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-8">
          Luxury laser engraved gifts, personalized jewellery, wooden crafts,
          acrylic products, corporate gifting and custom creations made with
          precision and premium finishing.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/products"
            className="bg-yellow-500 text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition"
          >
            Explore Collection
          </Link>

          <Link
            href="/contact"
            className="border-2 border-yellow-500 text-yellow-500 px-8 py-4 rounded-full font-bold hover:bg-yellow-500 hover:text-black transition"
          >
            Contact Us
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {features.map((item) => (
            <span
              key={item}
              className="px-4 py-2 rounded-full border border-yellow-500/20 bg-[#171717] text-yellow-400 text-sm"
            >
              {item}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}