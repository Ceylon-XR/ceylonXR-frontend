import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BentoTilt, Card } from "./Places";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // This data would typically come from an API or database
  const categoryData = {
    tourism: {
      title: "Tourism Destinations",
      description:
        "Explore stunning digital recreations of Sri Lanka's most iconic destinations and tourist attractions.",
      places: [
        {
          id: "ella",
          title: "Ella",
          description: "Nestled in the lush hills of Sri Lanka",
          image: "img/ella.webp",
          viewType: "bird",
        },
        {
          id: "sigiriya",
          title: "Sigiriya",
          description: "Ancient rock fortress and palace ruins",
          image: "img/sigiriya.webp",
          viewType: "bird",
        },
        {
          id: "campus-tour",
          title: "Campus Tour - FOE USJP",
          description: "Discover Sri Lanka's newest engineering complex",
          image: "img/foe_usj.jpg",
          viewType: "bird",
        },
        {
          id: "nemuro",
          title: "Nemuro City Museum",
          description: "Experimental 3D space with voice assistance",
          image: "img/image.png",
          viewType: "surface",
        },
      ],
    },
    hotels: {
      title: "Luxury Hotels & Accommodations",
      description:
        "Experience virtual tours of Sri Lanka's most luxurious and charming accommodations before booking your stay.",
      places: [
        {
          id: "cinnamon-grand",
          title: "Cinnamon Grand",
          description: "Luxurious 5-star hotel in Colombo",
          image: "img/hotels/cinnamon.jpg",
          viewType: "bird",
        },
        {
          id: "jetwing-blue",
          title: "Jetwing Blue",
          description: "Beachfront luxury in Negombo",
          image: "img/hotels/jetwing.jpg",
          viewType: "bird",
        },
        {
          id: "heritance-kandalama",
          title: "Heritance Kandalama",
          description: "Architectural marvel nestled in nature",
          image: "img/hotels/heritance.jpg",
          viewType: "bird",
        },
      ],
    },
    other: {
      title: "Other Experiences",
      description:
        "Discover unique venues, local businesses, and special locations through immersive virtual experiences.",
      places: [
        {
          id: "colombo-museum",
          title: "Colombo National Museum",
          description: "Sri Lanka's primary cultural institution",
          image: "img/other/museum.jpg",
          viewType: "surface",
        },
        {
          id: "gangaramaya",
          title: "Gangaramaya Temple",
          description: "Historic Buddhist temple in Colombo",
          image: "img/other/temple.jpg",
          viewType: "bird",
        },
        {
          id: "independence-square",
          title: "Independence Memorial Hall",
          description: "Monument commemorating independence",
          image: "img/other/independence.jpg",
          viewType: "bird",
        },
      ],
    },
  };

  const category = categoryData[categoryId] || {
    title: "Category Not Found",
    description: "The requested category does not exist.",
    places: [],
  };

  const navigateToPlace = (placeId) => {
    navigate(`/${categoryId}/${placeId}`);
  };

  return (
    <section className="bg-black pt-28 pb-52">
      <div className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-16">
          <h1 className="font-circular-web text-3xl text-blue-50 mb-3">
            {category.title}
          </h1>
          <p className="max-w-2xl font-circular-web text-lg text-blue-50 opacity-50">
            {category.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {category.places.map((place) => (
            <BentoTilt
              key={place.id}
              className="border-hsla relative h-96 w-full overflow-hidden rounded-md"
              onClick={() => navigateToPlace(place.id)}
            >
              <Card
                src={place.image}
                title={<>{place.title}</>}
                description={place.description}
                isComingSoon={false}
                viewType={place.viewType}
              />
            </BentoTilt>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryPage;
