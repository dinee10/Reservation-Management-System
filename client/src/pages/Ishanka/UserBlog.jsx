import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronLeft, ChevronRight, Hotel, Dumbbell, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import local images for the slideshow
import slide1 from "../../assets/Dinitha/room1.jpg";
import slide2 from "../../assets/Dinitha/room2.jpg";
import slide3 from "../../assets/Dinitha/room3.jpg";
import slide4 from "../../assets/Dinitha/room4.jpg";
import adventure1 from "../../assets/Dinitha/task1.jpg";
import adventure2 from "../../assets/Dinitha/task2.jpg";
import adventure3 from "../../assets/Dinitha/task3.jpg";
import adventure4 from "../../assets/Dinitha/task4.jpg";
import general1 from "../../assets/Dinitha/general1.jpg";
import general2 from "../../assets/Dinitha/general2.jpg";
import general3 from "../../assets/Dinitha/general3.jpg";
import general4 from "../../assets/Dinitha/general4.jpg";

// Import videos for the header slideshow
import video1 from "../../assets/Dinitha/travel1.mp4";
import video2 from "../../assets/Dinitha/travel9.mp4";
import video3 from "../../assets/Dinitha/travel12.mp4";
import video4 from "../../assets/Dinitha/travel11.mp4";
import video5 from "../../assets/Dinitha/travel15.mp4";
import Spinner from "../../components/spinner/spinner";

// Base64 placeholder image
const placeholderImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/1h8KAAAAABJRU5ErkJggg==";

export default function TourismBlog() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const scrollContainerRefs = useRef({});

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/blog");
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch blogs. Please try again later.");
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filterBlogsByCategory = (category) => {
    return blogs.filter(
      (blog) =>
        (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
        blog.category === category
    );
  };

  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, index) => (
          <span key={`full-${index}`} className="text-yellow-400">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">☆</span>}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <span key={`empty-${index}`} className="text-gray-300">★</span>
        ))}
      </div>
    );
  };

  const BlogCard = ({ blog }) => {
    const images = Array.isArray(blog.images) && blog.images.length > 0 ? blog.images : [placeholderImage];
    const mainImage = images[0];
    const thumbnail1 = images[1] || placeholderImage;
    const thumbnail2 = images[2] || placeholderImage;

    return (
      <Link
        to={`/blog/${blog._id}`}
        className="flex-shrink-0 w-full mx-4 overflow-hidden transition duration-300 transform bg-white rounded-lg shadow-lg hover:shadow-2xl sm:w-64 md:w-72 lg:w-80"
      >
        <div className="relative">
          <img
            src={mainImage ? `http://localhost:8000/BlogImages/${mainImage}` : placeholderImage}
            alt={blog.title}
            className="object-cover w-full h-48"
            loading="lazy"
            onError={(e) => (e.target.src = placeholderImage)}
          />
          <div className="flex gap-2 p-2 bg-gray-100">
            <img
              src={thumbnail1 ? `http://localhost:8000/BlogImages/${thumbnail1}` : placeholderImage}
              alt="Thumbnail 1"
              className="object-cover w-1/2 h-16 rounded"
              loading="lazy"
              onError={(e) => (e.target.src = placeholderImage)}
            />
            <div className="relative w-1/2">
              <img
                src={thumbnail2 ? `http://localhost:8000/BlogImages/${thumbnail2}` : placeholderImage}
                alt="Thumbnail 2"
                className="object-cover w-full h-16 rounded"
                loading="lazy"
                onError={(e) => (e.target.src = placeholderImage)}
              />
              <button className="absolute px-2 py-1 text-xs text-white transform -translate-x-1/2 -translate-y-1/2 rounded top-1/2 left-1/2 bg-black/50">
                View All
              </button>
            </div>
          </div>
          <div className="p-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
              {blog.title}
              {blog.rating ? (
                <StarRating rating={blog.rating} />
              ) : (
                <span className="text-sm text-gray-500">No rating available</span>
              )}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{blog.author || "Unknown Author"}</p>
            {blog.category === "rooms" && (
              <div className="flex gap-3 my-2">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Hotel size={16} />
                  <span>Swimming Pool</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Dumbbell size={16} />
                  <span>Gym</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <ArrowUpDown size={16} />
                  <span>Elevator/Lift</span>
                </div>
              </div>
            )}
            {blog.category === "tasks" && (
              <div className="my-2">
                {/* Add task-specific amenities here if needed */}
              </div>
            )}
            {blog.category === "general" && (
              <div className="my-2">
                {/* Add general-specific amenities here if needed */}
              </div>
            )}
            {(blog.category === "rooms" || blog.category === "tasks") && (
              <div className="flex flex-col gap-1 my-2">
                <p className="text-sm text-green-600">✔ Free Cancellation</p>
                <p className="text-sm text-green-600">✔ Book with $0 Payment</p>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  };

  const categories = [
    { name: "rooms", description: "Discover the best hotels and accommodations for your stay." },
    { name: "tasks", description: "Explore thrilling adventures and outdoor activities." },
    { name: "general", description: "Read our latest travel blogs and stories." },
  ];

  const scrollLeft = (category) => {
    if (scrollContainerRefs.current[category]) {
      scrollContainerRefs.current[category].scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = (category) => {
    if (scrollContainerRefs.current[category]) {
      scrollContainerRefs.current[category].scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const headerSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  const verticalSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const categoryImages = {
    rooms: [slide1, slide2, slide3, slide4],
    tasks: [adventure1, adventure2, adventure3, adventure4],
    general: [general1, general2, general3, general4],
  };

  const headerVideos = [
    { src: video1, title: "Explore Sri Lanka" },
    { src: video2, title: "Discover the Beaches" },
    { src: video3, title: "Adventure in the Hills" },
    { src: video4, title: "Cultural Journey" },
    { src: video5, title: "Wildlife Safari" },
  ];

  const popularDestinations = [
    { city: "Kandy hotels", link: "/hotels/kandy" },
    { city: "Nuwara Eliya hotels", link: "/hotels/nuwara-eliya" },
    { city: "Colombo hotels", link: "/hotels/colombo" },
    { city: "Ella hotels", link: "/hotels/ella" },
    { city: "Galle hotels", link: "/hotels/galle" },
    { city: "Anuradhapura hotels", link: "/hotels/anuradhapura" },
    { city: "Negombo hotels", link: "/hotels/negombo" },
    { city: "Trincomalee hotels", link: "/hotels/trincomalee" },
    { city: "Sigiriya hotels", link: "/hotels/sigiriya" },
    { city: "Mirissa hotels", link: "/hotels/mirissa" },
    { city: "Kataragama hotels", link: "/hotels/kataragama" },
    { city: "Arugam Bay hotels", link: "/hotels/arugam-bay" },
    { city: "Jaffna hotels", link: "/hotels/jaffna" },
    { city: "Unawatuna hotels", link: "/hotels/unawatuna" },
    { city: "Hikkaduwa hotels", link: "/hotels/hikkaduwa" },
    { city: "Dambulla hotels", link: "/hotels/dambulla" },
    { city: "Haputale hotels", link: "/hotels/haputale" },
    { city: "Tangalle hotels", link: "/hotels/tangalle" },
    { city: "Uda Walawe hotels", link: "/hotels/uda-walawe" },
    { city: "Hiriketiya hotels", link: "/hotels/hiriketiya" },
    { city: "Weligama hotels", link: "/hotels/weligama" },
    { city: "Anhangama hotels", link: "/hotels/anhangama" },
    { city: "Badulla hotels", link: "/hotels/badulla" },
    { city: "Polonnaruwa hotels", link: "/hotels/polonnaruwa" },
    { city: "Bentota hotels", link: "/hotels/bentota" },
  ];

  const hotelBrands = [
    { name: "Minor Hotels", link: "/brands/minor-hotels" },
    { name: "Anantara", link: "/brands/anantara" },
    { name: "Avani Hotels & Resorts", link: "/brands/avani" },
    { name: "Elewana Collection", link: "/brands/elewana" },
    { name: "Oaks Hotels & Resorts", link: "/brands/oaks" },
    { name: "NH Hotels & Resorts", link: "/brands/nh-hotels" },
    { name: "NH Collection", link: "/brands/nh-collection" },
    { name: "Nhow Hotels", link: "/brands/nhow" },
    { name: "Tivoli Hotels & Resorts", link: "/brands/tivoli" },
  ];

  return (
    <div className="w-full bg-white">
      <Navbar />
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Header Video Slideshow Section */}
          <div className="relative w-full max-w-full min-h-screen">
            <Slider {...headerSliderSettings}>
              {headerVideos.map((video, index) => (
                <div key={index} className="relative min-h-screen">
                  <video
                    src={video.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full min-h-screen rounded-lg shadow-lg"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-10">
                    <h1 className="p-4 font-bold text-center text-white text-7xl md:text-4xl lg:text-5xl max-w-7xl">
                      Welcome to TravelBIRD!
                    </h1>
                    <p className="p-4 text-2xl text-center text-white rounded-lg max-w-7xl md:text-lg lg:text-xl bg-white/20 text-shadow-md">
                      Embark on unforgettable journeys and explore the world with us. Whether
                      you're seeking a serene getaway, an adventure-filled experience, or a
                      cultural tour, we offer a wide range of curated tours that cater to all
                      interests. Our goal is to make your travel experience seamless, exciting,
                      and memorable. Let us help you plan the perfect trip today!
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          <div className="mx-4 md:mx-10 lg:mx-40">
            {/* Search Section */}
            <div className="w-full px-4 py-4 mx-auto">
              <nav className="py-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-gray-800 to-gray-900">
                <div className="flex items-center justify-between px-6">
                  <h1 className="text-2xl font-bold text-white md:text-3xl">Discover World...</h1>
                  <div className="relative w-full max-w-xs">
                    <input
                      type="text"
                      placeholder="Search adventures..."
                      className="w-full px-4 py-2 pr-10 text-white bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder:text-gray-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search
                      className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2"
                      size={20}
                    />
                  </div>
                </div>
              </nav>
            </div>

            {/* Middle Section: Visit Sri Lanka + Vertical Slideshow */}
            <div className="flex flex-col w-full gap-6 px-4 py-6 mx-auto md:flex-row">
              <div className="w-full p-6 bg-gray-100 rounded-lg shadow-md md:w-1/2">
                <h2 className="mb-4 text-xl font-bold text-gray-800">Visit Sri Lanka</h2>
                <p className="mb-4 text-sm text-gray-600">
                  Experience the Glory of this beautiful Island
                </p>
                <p className="mb-4 text-sm text-gray-600">
                  Visit Sri Lanka to witness the outstanding beauty and hospitality. Sri
                  Lanka is known to be the "Paradise" of the Indian Ocean for its amazing
                  beauty and incomparable richness in natural resources. The country is
                  extremely famous for beautiful soothing tourist destinations and great
                  hospitality of the Sri Lankans. Checkout our Sri Lankan Map which is
                  completed with all known tourist destinations.
                </p>
                <p className="mb-4 text-sm text-gray-600">
                  Tourist destinations in Sri Lanka provide a great and unforgettable holiday
                  experience to all the people who visit Sri Lanka.
                </p>
                <div className="flex space-x-4">
                  <Link to="/user-blog" className="text-blue-600 hover:underline">
                    Visit Sri Lanka
                  </Link>
                  <Link to="https://www.google.lk/maps/@7.8417541,80.7728782,7z?entry=ttu&g_ep=EgoyMDI1MDMxOS4yIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D" className="text-blue-600 hover:underline">
                    Sri Lankan Map
                  </Link>
                </div>
              </div>
              <div className="w-full h-64 md:w-1/2">
                <Slider {...verticalSliderSettings}>
                  {filterBlogsByCategory("general")
                    .slice(0, 5)
                    .map((blog, index) => (
                      <Link key={index} to={`/blog/${blog._id}`} className="block w-full h-full">
                        <img
                          src={blog.images && blog.images.length > 0 ? `http://localhost:8000/BlogImages/${blog.images[0]}` : placeholderImage}
                          alt={blog.title}
                          className="object-cover w-full h-64 rounded-lg"
                          onError={(e) => (e.target.src = placeholderImage)}
                        />
                      </Link>
                    ))}
                </Slider>
              </div>
            </div>

            {/* Blog Sections */}
            {loading ? (
              <div className="w-full px-4 py-6 mx-auto text-center">
                <p className="text-lg text-gray-600">Loading blogs...</p>
              </div>
            ) : error ? (
              <div className="w-full px-4 py-6 mx-auto text-center">
                <p className="text-lg text-red-500">{error}</p>
              </div>
            ) : (
              categories.map((category) => {
                const filteredBlogs = filterBlogsByCategory(category.name);
                return (
                  <div key={category.name}>
                    <div className="w-full max-w-full px-4 py-6 mx-auto bg-gray-100 rounded-lg shadow-lg">
                      <h2 className="mb-2 text-3xl font-bold text-gray-800 capitalize">
                        {category.name}
                      </h2>
                      <p className="mb-5 text-gray-600">{category.description}</p>
                      <div className="relative">
                        {filteredBlogs.length > 0 && (
                          <>
                            <button
                              onClick={() => scrollLeft(category.name)}
                              className="absolute left-0 z-10 p-2 transition duration-300 transform -translate-y-1/2 bg-gray-200 rounded-full shadow-lg top-1/2 hover:bg-gray-300"
                            >
                              <ChevronLeft size={24} className="text-gray-600" />
                            </button>
                            <button
                              onClick={() => scrollRight(category.name)}
                              className="absolute right-0 z-10 p-2 transition duration-300 transform -translate-y-1/2 bg-gray-200 rounded-full shadow-lg top-1/2 hover:bg-gray-300"
                            >
                              <ChevronRight size={24} className="text-gray-600" />
                            </button>
                          </>
                        )}
                        <div
                          ref={(el) => (scrollContainerRefs.current[category.name] = el)}
                          className="flex max-w-full py-4 space-x-4 overflow-x-auto scrollbar-hide"
                        >
                          {filteredBlogs.length > 0 ? (
                            filteredBlogs.map((blog) => (
                              <BlogCard key={blog._id} blog={blog} />
                            ))
                          ) : (
                            <p className="text-gray-500">No blogs found in this category.</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full max-w-full px-4 py-6 mx-auto">
                      <Slider {...sliderSettings}>
                        {categoryImages[category.name].map((image, index) => (
                          <div key={index} className="px-2">
                            <img
                              src={image}
                              alt={`Slide ${index + 1}`}
                              className="object-cover w-full h-64 rounded-lg"
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </div>
                );
              })
            )}

            {/* Popular Destinations Section */}
            <div className="w-full px-4 py-6 mx-auto">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                Popular with travellers from Sri Lanka
              </h2>
              <div className="flex mb-6 space-x-4 border-b border-gray-200">
                <button className="px-4 pb-2 font-medium text-blue-600 border-b-2 border-blue-600">
                  Domestic
                </button>
                <button className="px-4 pb-2 font-medium text-gray-600 hover:text-blue-600">
                  International cities
                </button>
                <button className="px-4 pb-2 font-medium text-gray-600 hover:text-blue-600">
                  Regions
                </button>
                <button className="px-4 pb-2 font-medium text-gray-600 hover:text-blue-600">
                  Countries
                </button>
                <button className="px-4 pb-2 font-medium text-gray-600 hover:text-blue-600">
                  Places to stay
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {popularDestinations.map((destination, index) => (
                  <Link
                    key={index}
                    to={destination.link}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    {destination.city}
                  </Link>
                ))}
              </div>
              <button className="mt-4 font-medium text-blue-600 hover:underline">
                + Show more
              </button>
            </div>

            {/* Hotel Brands Section */}
            <div className="w-full px-4 py-4 mx-auto border-t border-gray-300">
              <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                {hotelBrands.map((brand, index) => (
                  <Link
                    key={index}
                    to={brand.link}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}