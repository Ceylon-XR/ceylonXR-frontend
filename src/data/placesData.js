const placesData = {
  tourism: {
    ella: {
      id: "ella",
      title: "Ella",
      description:
        "Nestled in the lush hills of Sri Lanka, Ella is a breathtaking escape filled with misty mountains, scenic tea plantations, and iconic landmarks like Nine Arches Bridge, Little Adam's Peak, and Ravana Falls. A land of adventure, history, and wonder, Ella invites you to explore its rich culture and natural beauty.",
      image: "img/tourism/ella.webp",
      location: "Uva Province, Sri Lanka",
      contact: "+94 11 2437437",
      website: "www.ella-srilanka.com",
      rating: 5,
      features: [
        "Scenic Views",
        "Tea Plantations",
        "Hiking Trails",
        "Cultural Heritage",
        "Adventure Activities",
      ],
      tours: [
        {
          id: "nine-arches",
          title: "Nine Arches Bridge",
          description: "Experience the iconic railway bridge",
          image: "img/tourism/ella.webp",
          viewType: "bird",
          tokensRequired: 2,
        },
        {
          id: "little-adams",
          title: "Little Adam's Peak",
          description: "Panoramic views from the summit",
          image: "img/tourism/ella.webp",
          viewType: "bird",
          tokensRequired: 3,
        },
      ],
      experienceUrl: "/playcanvas/ella/index.html",
    },
    sigiriya: {
      id: "sigiriya",
      title: "Sigiriya",
      description:
        "Perched on a towering rock, Sigiriya is an ancient fortress filled with stunning frescoes, landscaped gardens, and the iconic Lion's Paw entrance. This UNESCO World Heritage site, built by King Kashyapa in the 5th century, combines natural splendor with historical significance.",
      image: "img/sigiriya.webp",
      location: "Central Province, Sri Lanka",
      contact: "+94 66 2286000",
      website: "www.sigiriya.lk",
      rating: 4.9,
      features: [
        "UNESCO Heritage Site",
        "Ancient Frescoes",
        "Rock Fortress",
        "Water Gardens",
        "Lion's Paw Entrance",
      ],
      tours: [
        {
          id: "fortress-tour",
          title: "Fortress Tour",
          description: "Explore the ancient fortress and its architecture",
          image: "img/sigiriya.webp",
          viewType: "bird",
          tokensRequired: 3,
        },
        {
          id: "water-gardens",
          title: "Water Gardens",
          description: "Tour the symmetrical water gardens at the base",
          image: "img/sigiriya.webp",
          viewType: "bird",
          tokensRequired: 2,
        },
      ],
      comingSoon: true,
    },
    "colombo-museum": {
      id: "6",
      title: "Colombo National Museum",
      description:
        "Sri Lanka's primary cultural institution featuring artifacts showcasing the rich heritage and history of the island.",
      image: "img/tourism/National_Museum.jpg",
      location: "Colombo, Sri Lanka",
      contact: "+94 11 2446620",
      website: "www.museum.gov.lk",
      rating: 4.5,
      features: [
        "Historical Artifacts",
        "Cultural Exhibits",
        "Guided Tours",
        "Educational Programs",
        "Gift Shop",
      ],
      tours: [
        {
          id: "6",
          title: "Ground Floor Exhibition",
          description: "Archaeological artifacts and ancient art",
          image: "img/tourism/National_Museum.jpg",
          viewType: "surface",
          tokensRequired: 2,
        },
        {
          id: "6",
          title: "Upper Floor Exhibition",
          description: "Colonial period artifacts and paintings",
          image: "img/tourism/National_Museum.jpg",
          viewType: "surface",
          tokensRequired: 2,
        },
      ],
      experienceUrl: "/places/colombo-national-museum/index.html",
    },
    "nemuro-museum": {
      id: "6",
      title: "Nemuro City Museum",
      description:
        "Explore our experimental 3D space featuring real-time voice assistance and interactive elements.",
      image: "img/tourism/Nemuro_City_Museum.png",
      location: "Nemuro, Japan",
      contact: "+81 123-456-7890",
      website: "www.nemurocitymuseum.jp",
      rating: 4.8,
      features: [
        "3D Interactive Exhibits",
        "Voice Assistance",
        "Cultural Heritage",
        "Educational Programs",
        "Virtual Tours",
      ],

      tours: [
        {
          id: "6",
          title: "Main Exhibition Hall",
          description: "Explore the main exhibition space",
          image: "img/tourism/Nemuro_City_Museum.png",
          viewType: "surface",
          tokensRequired: 5,
        },
        {
          id: "6",
          title: "Interactive Zone",
          description: "Engage with interactive exhibits",
          image: "img/tourism/Nemuro_City_Museum.png",
          viewType: "surface",
          tokensRequired: 3,
        },
      ],
      experienceUrl: "/places/namuro-museum/index.html",
    },
    "campus-tour": {
      id: "campus-tour",
      title: "Campus Tour - FOE USJP",
      description:
        "Discover Sri Lanka's newest engineering complex at USJP, equipped with cutting-edge tech and modern labs.",
      image: "img/foe_usj.jpg",
      location: "Homagama, Sri Lanka",
      contact: "+94 11 2437437",
      website: "www.usjp.ac.lk",
      rating: 4.7,
      features: [
        "Modern Facilities",
        "State-of-the-Art Labs",
        "Research Opportunities",
        "Student-Centric Design",
        "Sustainable Architecture",
      ],

      tours: [
        {
          id: "6",
          title: "Engineering Complex",
          description: "Tour the main engineering building",
          image: "img/foe_usj.jpg",
          viewType: "bird",
          tokensRequired: 2,
        },
      ],
      experienceUrl: "/places/campus-tour/index.html",
    },
  },
  hotels: {
    "cinnamon-grand": {
      id: "cinnamon-grand",
      title: "Cinnamon Grand Hotel",
      description:
        "Experience luxury at this iconic 5-star hotel in the heart of Colombo, featuring elegant rooms, fine dining, and world-class amenities.",
      image: "img/hotels/cinnamon-grand.jpg",
      location: "Colombo, Sri Lanka",
      contact: "+94 11 2437437",
      website: "www.cinnamonhotels.com/cinnamongrandcolombo",
      rating: 5,
      features: [
        "Swimming Pool",
        "Spa",
        "Conference Rooms",
        "Multiple Restaurants",
        "Fitness Center",
      ],
      rooms: [
        {
          id: "deluxe-room",
          title: "Deluxe Room",
          description:
            "Spacious 40m² room with modern amenities and city views",
          image: "img/hotels/cinnamon-grand.jpg",
          viewType: "surface",
          tokensRequired: 2,
        },
        {
          id: "premium-room",
          title: "Premium Room",
          description:
            "Luxurious 50m² room with premium furnishings and services",
          image: "img/hotels/cinnamon-grand.jpg",
          viewType: "surface",
          tokensRequired: 3,
        },
        {
          id: "executive-suite",
          title: "Executive Suite",
          description:
            "Elegant 80m² suite with separate living area and executive benefits",
          image: "img/hotels/cinnamon-grand.jpg",
          viewType: "surface",
          tokensRequired: 4,
        },
      ],
      comingSoon: true,
    },
    "jetwing-blue": {
      id: "jetwing-blue",
      title: "Jetwing Blue",
      description:
        "Beachfront luxury in Negombo with stunning ocean views, contemporary design, and exceptional Sri Lankan hospitality.",
      image: "img/hotels/jetwing-blue.jpg",
      location: "Negombo, Sri Lanka",
      contact: "+94 31 2273500",
      website: "www.jetwinghotels.com/jetwingblue",
      rating: 4.5,
      features: [
        "Beachfront",
        "Swimming Pools",
        "Spa",
        "Water Sports",
        "Bars & Restaurants",
      ],
      rooms: [
        {
          id: "deluxe-room",
          title: "Deluxe Room",
          description:
            "Stylish room with modern amenities and partial sea views",
          image: "img/hotels/jetwing-blue.jpg",
          viewType: "surface",
          tokensRequired: 2,
        },
        {
          id: "super-deluxe",
          title: "Super Deluxe Room",
          description:
            "Spacious room with direct sea views and premium features",
          image: "img/hotels/jetwing-blue.jpg",
          viewType: "surface",
          tokensRequired: 3,
        },
      ],
      comingSoon: true,
    },
    "heritance-kandalama": {
      id: "heritance-kandalama",
      title: "Heritance Kandalama",
      description:
        "An architectural marvel embedded in nature, offering breathtaking views of Sigiriya Rock and Kandalama Lake.",
      image: "img/hotels/heritance.jpeg",
      location: "Dambulla, Sri Lanka",
      contact: "+94 66 5555000",
      website: "www.heritancehotels.com/kandalama",
      rating: 5,
      features: [
        "Infinity Pools",
        "Eco-Friendly Design",
        "Spa",
        "Organic Garden",
        "Nature Trails",
      ],
      rooms: [
        {
          id: "superior-room",
          title: "Superior Room",
          description: "Comfortable room with lake or forest views",
          image: "img/hotels/heritance.jpeg",
          viewType: "bird",
          tokensRequired: 2,
        },
        {
          id: "deluxe-room",
          title: "Deluxe Room",
          description:
            "Spacious room with panoramic views of the lake or Sigiriya Rock",
          image: "img/hotels/heritance.jpeg",
          viewType: "bird",
          tokensRequired: 3,
        },
      ],
      comingSoon: true,
    },
  },
  other: {
    "barista-colombo": {
      id: "barista-colombo",
      title: "Barista Colombo",
      description:
        "Experience the warm ambiance and rich coffee culture of Sri Lanka's premier coffee house chain.",
      image: "img/other/barista.jpg",
      location: "Colombo, Sri Lanka",
      contact: "+94 11 2556789",
      website: "www.baristacolombo.com",
      rating: 4.5,
      features: [
        "Premium Coffee",
        "Pastries",
        "Comfortable Seating",
        "Free Wi-Fi",
      ],
      spaces: [
        {
          id: "main-area",
          title: "Main Seating Area",
          description: "Comfortable main cafe area with window views",
          image: "img/other/barista.jpg",
          viewType: "surface",
          tokensRequired: 1,
        },
        {
          id: "counter",
          title: "Coffee Counter",
          description:
            "Explore the barista counter and coffee preparation area",
          image: "img/other/barista.jpg",
          viewType: "surface",
          tokensRequired: 1,
        },
      ],
      comingSoon: true,
    },
  },
};

export default placesData;
