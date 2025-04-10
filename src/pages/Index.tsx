
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Users, Trophy, MessageSquare } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: <CalendarIcon className="h-10 w-10 text-clover-primary" />,
      title: "Sports Activities",
      description: "Join sports activities in your area or create your own events.",
      link: "/community",
    },
    {
      icon: <Users className="h-10 w-10 text-clover-primary" />,
      title: "Teams",
      description: "Create or join teams for your favorite sports.",
      link: "/teams",
    },
    {
      icon: <Trophy className="h-10 w-10 text-clover-primary" />,
      title: "Leaderboards",
      description: "Track your progress and compete with others.",
      link: "/leaderboards",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-clover-primary" />,
      title: "Community",
      description: "Connect with other sports enthusiasts in your area.",
      link: "/community",
    },
  ];

  const sportsImages = [
    {
      src: "public/lovable-uploads/14a6de4c-c2a9-405c-a3fc-257de4e2235f.png",
      alt: "Football player silhouette",
      title: "Football",
    },
    {
      src: "public/lovable-uploads/48c854d0-314c-4568-b614-598c35b6924e.png",
      alt: "Cricket player silhouette",
      title: "Cricket",
    },
    {
      src: "public/lovable-uploads/004e9bd7-67fa-4199-8bd4-765918b0fb03.png",
      alt: "Badminton player silhouette",
      title: "Badminton",
    },
    {
      src: "public/lovable-uploads/84dc2d84-fb98-45fe-bd5f-abb342699a62.png",
      alt: "Chess pieces silhouette",
      title: "Chess",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Sports Illustrations */}
      <section className="relative bg-black text-white py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Bringing Communities Together Through Sports
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Join Clover Sports to connect with local sports enthusiasts, join activities, 
                and build a healthier community together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/community">
                  <Button size="lg" className="bg-clover-primary text-white hover:bg-clover-dark">
                    Explore Activities
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Join Now
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {sportsImages.map((image, index) => (
                <div key={index} className="sports-illustration">
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-auto mx-auto max-h-64"
                  />
                  <p className="text-center text-white mt-2 font-medium">{image.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-clover-primary mb-4">Features</h2>
            <p className="text-white/80">
              Clover Sports provides all the tools you need to engage with your local sports community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow bg-black/40 border-white/10 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center text-center pt-8">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-white/70 mb-6">{feature.description}</p>
                  <Link to={feature.link} className="text-clover-primary hover:text-clover-light font-medium">
                    Learn more &rarr;
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-clover-primary mb-4">How It Works</h2>
            <p className="text-white/80">
              Get started with Clover Sports in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-clover-light flex items-center justify-center text-clover-primary text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Create an Account</h3>
              <p className="text-white/70">
                Sign up and create your personalized sports profile.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-clover-light flex items-center justify-center text-clover-primary text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Join or Create</h3>
              <p className="text-white/70">
                Find activities and teams or create your own.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-clover-light flex items-center justify-center text-clover-primary text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Connect & Play</h3>
              <p className="text-white/70">
                Meet fellow sports enthusiasts and start playing.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/auth">
              <Button size="lg" className="bg-clover-primary hover:bg-clover-dark">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-clover-primary mb-4">What Our Users Say</h2>
            <p className="text-white/80">
              Hear from the Clover Sports community members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow bg-black/40 border-white/10 backdrop-blur-sm">
              <CardContent className="pt-8">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 mb-4 overflow-hidden">
                    <img 
                      src="https://raw.githubusercontent.com/Tanmoy200405/CLOVER_CF38/main/images/profile1.jpg" 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-white">Rahul M.</h4>
                  <p className="text-sm text-gray-400">Cricket Enthusiast</p>
                </div>
                <p className="text-white/70 italic">
                  "Clover Sports has completely changed how I engage with cricket in my community. I've met amazing teammates and found regular matches."
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-black/40 border-white/10 backdrop-blur-sm">
              <CardContent className="pt-8">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 mb-4 overflow-hidden">
                    <img 
                      src="https://raw.githubusercontent.com/Tanmoy200405/CLOVER_CF38/main/images/profile2.jpg" 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-white">Priya K.</h4>
                  <p className="text-sm text-gray-400">Team Captain</p>
                </div>
                <p className="text-white/70 italic">
                  "As a team captain, I find the platform incredibly useful for organizing matches and keeping track of our team's performance."
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-black/40 border-white/10 backdrop-blur-sm">
              <CardContent className="pt-8">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 mb-4 overflow-hidden">
                    <img 
                      src="https://raw.githubusercontent.com/Tanmoy200405/CLOVER_CF38/main/images/profile3.jpg" 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-white">Amit S.</h4>
                  <p className="text-sm text-gray-400">Football Player</p>
                </div>
                <p className="text-white/70 italic">
                  "I've been playing football for years, but Clover Sports has connected me with players I would have never met otherwise. Highly recommend!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Join the Community?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Connect with local sports enthusiasts, participate in activities, and build lasting friendships.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-clover-primary text-white hover:bg-clover-dark">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
