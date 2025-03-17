import React from "react";

const Hero = () => {
  return (
    <section className="h-screen border bg-blue-900">
      <div className="h-full">
        <div className="mt-20 mb-9">
          <h1 className=" text-center text-8xl mb-6 text-white font-bold">
            Stay Informed <br />
            Stay Empowered
          </h1>
        </div>
        <div className="w-[100%] max-w-[800px] mx-auto mb-11">
          <p className="text-center text-white text-xl">
            Unlock a world of tech innovation with our real-time news, detailed
            gadget reviews, and visionary insights. Our content combines expert
            analysis and compelling storytelling to empower you with the
            knowledge to lead in the digital era.
          </p>
        </div>

        <div className="text-center mb-6">
          <button className="btn btn-wide rounded-full h-[50px] font-bold">
            See Latest News
          </button>
        </div>

        <div>
          <p className="text-center text-white text-[13px]">
            Would you like a more niche-focused tagline, such as for tech,
            politics, or global news? 🚀
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
