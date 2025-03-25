import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer"; // Verify this path
import logo from "../../assets/Dinitha/logo3.png"; // Verify this path

// Import Swiper styles and components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

export default function IndividualBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState({});
  const [userRating, setUserRating] = useState(0); // User's selected rating
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false); // Track if rating is submitted
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Track the selected image index

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get(`http://localhost:8000/blog/get/${id}`)
      .then((res) => {
        console.log("Blog data fetched:", res.data);
        setBlog(res.data);
      })
      .catch((err) => {
        console.error("Error fetching blog:", err);
      });
  }, [id]);

  const handleRatingSubmit = async () => {
    if (!userRating) {
      alert("Please select a rating before submitting.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/blog/rate/${id}`, {
        rating: userRating,
      });
      setBlog(response.data.blog); // Update the blog with the new rating
      setIsRatingSubmitted(true); // Mark rating as submitted
      alert("Thank you for rating this blog!");
    } catch (err) {
      console.error("Failed to submit rating:", err);
      alert("Failed to submit rating. Please try again.");
    }
  };

  const loadImageAsBase64 = (url, maxRetries = 3, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      let retries = 0;
      const attemptLoad = () => {
        fetch(url, { mode: "cors" })
          .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.blob();
          })
          .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("Failed to read blob"));
            reader.readAsDataURL(blob);
          })
          .catch((error) => {
            console.error(`Image load attempt ${retries + 1} failed for ${url}:`, error);
            if (retries < maxRetries) {
              retries++;
              setTimeout(attemptLoad, 1000); // Retry after 1 second
            } else {
              reject(new Error(`Max retries (${maxRetries}) reached for ${url}`));
            }
          });
      };
      attemptLoad();
      setTimeout(() => reject(new Error(`Timeout after ${timeout}ms for ${url}`)), timeout);
    });
  };

  const downloadPDF = async () => {
    const doc = new jsPDF();

    try {
      // Load logo as base64
      console.log("Attempting to load logo from:", logo);
      const logoBase64 = await loadImageAsBase64(logo);
      console.log("Logo loaded successfully (first 50 chars):", logoBase64.slice(0, 50) + "...");
      doc.addImage(logoBase64, "PNG", 10, 10, 40, 20); // Reduced logo height to 20

      // Add blog metadata (removed author and date)
      doc.setFontSize(18); // Reduced title font size
      const title = blog.title || "Untitled";
      doc.text(title, 10, 40); // Moved title up

      // Load and add the selected blog image if available
      let yPosition = 50; // Adjusted yPosition since author and date are removed
      if (blog.images && blog.images.length > 0) {
        const selectedImage = blog.images[selectedImageIndex];
        const imageUrl = `http://localhost:8000/BlogImages/${selectedImage}`;
        console.log("Attempting to load selected blog image from:", imageUrl);
        try {
          const imageBase64 = await loadImageAsBase64(imageUrl);
          console.log("Selected blog image loaded successfully (first 50 chars):", imageBase64.slice(0, 50) + "...");
          const format = imageBase64.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
          doc.addImage(imageBase64, format, 10, yPosition, 150, 80); // Reduced image height to 80
          yPosition += 90; // Adjusted for 80px height + 10px margin
        } catch (error) {
          console.error("Failed to load selected blog image:", error);
        }
      }

      // Add content, limited to one page
      addContentToPDF(doc, blog.content || "No content available", title, yPosition);
    } catch (error) {
      console.error("PDF generation failed:", error);
      // Fallback if any image fails
      doc.setFontSize(18);
      doc.text(blog.title || "Untitled", 10, 40);
      addContentToPDF(doc, blog.content || "No content available", blog.title || "Untitled", 50);
    }
  };

  const addContentToPDF = (doc, content, title, startY) => {
    let yPosition = startY + 10;
    doc.setFontSize(8); // Reduced content font size to fit more lines
    doc.text("Content:", 10, yPosition);
    yPosition += 8; // Adjusted line height for smaller font

    const maxHeight = 280; // Maximum y-position for one page
    const contentLines = doc.splitTextToSize(content, 180); // Split content into lines

    // Check if all content can fit
    let totalHeightNeeded = yPosition;
    for (let line of contentLines) {
      totalHeightNeeded += 8; // 8 points per line with smaller font
      if (totalHeightNeeded > maxHeight) {
        // Calculate how many lines fit
        const availableHeight = maxHeight - yPosition;
        const maxLines = Math.floor(availableHeight / 8);
        const linesToShow = contentLines.slice(0, maxLines);

        // Add the limited content
        linesToShow.forEach((line, index) => {
          doc.text(line, 10, yPosition + index * 8);
        });

        // Add truncation note
        doc.text("(Content truncated due to single-page limit...)", 10, yPosition + maxLines * 8);
        console.log(`Truncated content: Only ${maxLines} of ${contentLines.length} lines fit.`);
        return; // Exit after adding truncated content
      }
    }

    // If all content fits, add it
    contentLines.forEach((line, index) => {
      doc.text(line, 10, yPosition + index * 8);
    });

    doc.save(`${title || "Blog"}.pdf`);
  };

  const StarRating = ({ rating, onRate }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, index) => (
          <span key={index} className="text-yellow-400">
            ★
          </span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">★</span>}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <span key={index} className="text-gray-300">
            ★
          </span>
        ))}
        {!isRatingSubmitted && (
          <div className="ml-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onRate(star)}
                className={`text-2xl ${
                  star <= userRating ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-500 transition duration-300`}
              >
                ★
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="pb-10">
        <Navbar />
      </div>
      <div className="max-w-3xl px-4 pt-20 mx-auto mt-6 md:mt-10">
        <h1 className="mb-8 text-4xl font-bold text-center">{blog.title}</h1>

        <div className="mb-8 text-center">
          <p className="text-lg text-gray-600">
            IN <span className="font-semibold">{blog.author}</span> |{" "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-4">
            <StarRating
              rating={blog.rating || 0}
              onRate={(rating) => setUserRating(rating)}
            />
          </div>
          {!isRatingSubmitted && (
            <button
              onClick={handleRatingSubmit}
              className="px-4 py-2 mt-4 font-bold text-white transition duration-300 ease-in-out transform bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105"
            >
              Submit Rating
            </button>
          )}
        </div>

        {blog.images && blog.images.length > 0 && (
          <div className="mb-8">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              loop={true}
              className="rounded-lg shadow-lg"
              onSlideChange={(swiper) => setSelectedImageIndex(swiper.realIndex)} // Update selected index on slide change
            >
              {blog.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`http://localhost:8000/BlogImages/${image}`}
                    alt={`Slide ${index + 1}`}
                    className="object-cover w-full h-auto rounded-lg cursor-pointer"
                    onClick={() => setSelectedImageIndex(index)} // Allow clicking to select image
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <p className="mt-2 text-center text-gray-600">
              Selected Image: {selectedImageIndex + 1} of {blog.images.length}
            </p>
          </div>
        )}

        <div className="p-6 mb-8 bg-gray-100 rounded-lg shadow-lg">
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{blog.content}</p>
        </div>

        <div className="mb-4 text-center">
          <button
            className="px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105"
            onClick={downloadPDF}
          >
            Download Blog as PDF
          </button>
        </div>
      </div>
      <div>
       

 <Footer />
      </div>
    </div>
  );
}