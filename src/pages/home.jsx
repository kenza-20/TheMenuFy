import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { FingerPrintIcon } from "@heroicons/react/24/solid";
import { PageTitle, Footer } from "@/widgets/layout";
import { FeatureCard, TeamCard } from "@/widgets/cards";
import { featuresData, teamData, contactData } from "@/data";

export function Home() {
  return (
    <>
      {/* Hero Section with Background Video */}
      <div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 h-full w-full object-cover"
        >
          <source src="/img/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography variant="h1" color="white" className="mb-6 font-black">
                Your Journey to Healthy Eating Begins Here.
              </Typography>
              <Typography text-align="justify" variant="lead" color="white" className="opacity-80">
                Welcome to <strong>Menufy</strong> – your personalized meal guide that brings the best in taste and nutrition straight to you.
                Our platform uses smart recommendations to serve up meals that match your preferences, dietary needs, and wellness goals.
                Enjoy a curated selection of recipes and dishes designed to help you eat smarter and live healthier.
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="-mt-32 bg-white px-4 pb-20 pt-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map(({ color, title, icon, description }) =>
              icon ? (
                <FeatureCard
                  key={title}
                  color={color}
                  title={title}
                  icon={React.createElement(icon, {
                    className: "w-5 h-5 text-white",
                  })}
                  description={description}
                />
              ) : null
            )}
          </div>
          <div className="mt-32 flex flex-wrap items-center">
            <div className="mx-auto -mt-8 w-full px-4 md:w-5/12">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-gray-900 p-2 text-center shadow-lg">
                <FingerPrintIcon className="h-8 w-8 text-white " />
              </div>
              <Typography variant="h3" className="mb-3 font-bold" color="blue-gray">
                Experience the Art of Healthy Living
              </Typography>
              <Typography className="mb-8 font-normal text-blue-gray-500">
                At Menufy, we make healthy eating both effortless and exciting. Our easy-to-use platform ensures you never have to compromise on flavor or nutrition.
                Explore our pre-built pages to discover recipes, meal plans, and tips to enhance your culinary journey.
              </Typography>
              <Button variant="filled">Discover More</Button>
            </div>
            <div className="mx-auto mt-24 flex w-full justify-center px-4 md:w-4/12 lg:mt-0">
              <Card className="shadow-lg border border-gray-300 shadow-gray-500/10 rounded-lg">
                <CardHeader floated={false} className="relative h-56">
                  <img alt="Teamwork" src="/img/teamwork.png" className="h-full w-full object-cover" />
                </CardHeader>
                <CardBody>
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    Our Promise
                  </Typography>
                  <Typography variant="h5" color="blue-gray" className="mb-3 mt-2 font-bold">
                    Excellence in Every Bite
                  </Typography>
                  <Typography className="font-normal text-blue-gray-500">
                    We believe that every meal is an opportunity to nourish your body and inspire your palate. Discover top-notch services and innovative recipes that redefine healthy eating.
                  </Typography>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 pt-20 pb-48">
        <div className="container mx-auto">
          <PageTitle section="Our Team" heading="Meet the Culinary Innovators">
            Our passionate team is dedicated to crafting a platform that transforms your everyday meals into extraordinary experiences.
          </PageTitle>
          <div
  className="mt-24 grid grid-cols-1 gap-10 gap-x-24 md:grid-cols-2 xl:grid-cols-4"

>            {teamData.map(({ img, name, position, socials }) => (
              <TeamCard
                key={name}
                img={img}
                name={name}
                position={position}
                socials={
                  <div className="flex items-center gap-2">
                    {socials.map(({ color, name }) => (
                      <IconButton key={name} color={color} variant="text">
                        <i className={`fa-brands text-xl fa-${name}`} />
                      </IconButton>
                    ))}
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative bg-white py-24 px-4">
        <div className="container mx-auto">
          <PageTitle section="Co-Working" heading="Collaborate & Innovate">
            Join us in shaping a community where healthy living meets culinary creativity.
          </PageTitle>
          <div className="mx-auto mt-20 mb-48 grid max-w-5xl grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
            {contactData.map(({ title, icon, description }) =>
              icon ? (
                <Card key={title} color="transparent" shadow={false} className="text-center text-blue-gray-900">
                  <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-blue-gray-900 shadow-lg">
                    {React.createElement(icon, { className: "w-5 h-5 text-white" })}
                  </div>
                  <Typography variant="h5" color="blue-gray" className="mb-2">
                    {title}
                  </Typography>
                  <Typography className="font-normal text-blue-gray-500">
                    {description}
                  </Typography>
                </Card>
              ) : null
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
}

export default Home;
