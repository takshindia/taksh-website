import Link from "next/link";

export default function Products() {
  const categories = [
    {
      icon: "🎁",
      title: "Personalized Gifts",
      description:
        "Necklace, Bracelet, Ring, Keychain, Photo Frame, Wallet, Pen, Phone Cover and many more.",
    },
    {
      icon: "🪵",
      title: "Laser Materials",
      description:
        "MDF, Plywood, Basswood, Acrylic, Leather, Slate, Cork, Bamboo and more.",
    },
    {
      icon: "🔩",
      title: "Accessories",
      description:
        "Magnets, Key Rings, Chains, Hooks, Glue, Gift Boxes and Packaging.",
    },
    {
      icon: "🏢",
      title: "Corporate Gifts",
      description:
        "Company Branding, Bulk Orders, Name Plates, QR Stands and Office Gifts.",
    },
    {
      icon: "❤️",
      title: "Wedding Gifts",
      description:
        "Wedding Name Boards, Couple Gifts, Invitation Gifts and Return Gifts.",
    },
    {
      icon: "🎂",
      title: "Birthday Gifts",
      description:
        "Custom Birthday Gifts, Photo Frames, Cake Toppers and Personalized Items.",
    },
  ];

  return (
    <section className="bg-[#0d0d0d] py-16 md:py-24 px-5">

      <div className="max-w-7xl mx-auto">

        <h2 className="text-center text-yellow-400 text-3xl sm:text-4xl md:text-5xl font-bold">
          Explore Our Categories
        </h2>

        <p className="text-center text-gray-300 max-w-3xl mx-auto mt-5 mb-12 text-base sm:text-lg leading-8">
          Discover premium laser engraved products crafted with precision for
          gifting, business branding and custom orders.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

          {categories.map((item) => (

            <div
              key={item.title}
              className="bg-[#171717] border border-yellow-500/20 rounded-2xl p-7 hover:border-yellow-500 transition duration-300 hover:-translate-y-2"
            >

              <div className="text-5xl mb-5">
                {item.icon}
              </div>

              <h3 className="text-yellow-400 text-2xl font-bold mb-4">
                {item.title}
              </h3>

              <p className="text-gray-300 leading-7 min-h-[120px]">
                {item.description}
              </p>

              <Link
                href="/products"
                className="inline-block mt-6 bg-yellow-500 text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition"
              >
                View Products →
              </Link>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}