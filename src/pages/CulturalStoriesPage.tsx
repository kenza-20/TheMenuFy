import CulturalFoodStory from "../components/CulturalFoodStory"

export default function CulturalStoriesPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat min-h-screen"
        style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Main content */}
      <div className="relative flex-grow flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-16">
        <div className="w-full max-w-6xl pt-15">
          <div className="bg-black/10 backdrop-blur-xl rounded-2xl p-6 w-full mx-auto">
            <div className="flex flex-col space-y-10 pb-10">
              {/* Header Section */}
              <div className="text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white">Culinary Cultural Stories</h2>
                <p className="mt-4 text-lg text-white">
                  Discover the rich history and cultural significance behind your favorite dishes
                </p>
                <div className="mt-5 mb-8 border-b-4 border-yellow-500 w-48 mx-auto rounded-full shadow-lg"></div>
              </div>

              {/* Cultural Story Component */}
              <CulturalFoodStory />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

