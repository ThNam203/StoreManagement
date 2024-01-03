import Image from "next/image";
import SectionTitle from "../components/section-title";

const AboutSectionTwo = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="wow fadeInUp relative mx-auto mb-12 aspect-[25/24] max-w-[500px] text-center lg:m-0"
              data-wow-delay=".15s"
            >
              <Image
                src="/images/about/about-image-2.svg"
                alt="about image"
                fill
              />
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div className="wow fadeInUp max-w-[470px]" data-wow-delay=".2s">
              <SectionTitle title="Why choose MStore?" paragraph="" mb="44px" />
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Simplicity
                </h3>
                <p className="text-body-color text-base font-medium leading-relaxed sm:text-lg sm:leading-relaxed">
                  Intuitive interface designed for ease of use, reducing the
                  learning curve for you and your team.
                </p>
              </div>
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Reliability
                </h3>
                <p className="text-body-color text-base font-medium leading-relaxed sm:text-lg sm:leading-relaxed">
                  {`A robust platform built to handle your store's needs, ensuring smooth operations day in, day out.`}
                </p>
              </div>
              <div className="mb-1">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Support
                </h3>
                <p className="text-body-color text-base font-medium leading-relaxed sm:text-lg sm:leading-relaxed">
                  Our dedicated support team is here to assist you every step of
                  the way, ensuring you make the most of MStore.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
