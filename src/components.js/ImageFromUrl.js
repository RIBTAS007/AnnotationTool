import React, { useState, useEffect } from "react";
import { Image } from "react-konva";

const ImageFromUrl = ({
  imageUrl,
  setCanvasMeasures,
  onMouseDown,
  canvasMeasures,
  onMouseUp,
  onMouseMove,
}) => {
  // State to hold the loaded image
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Create a new image object
    const imageToLoad = new window.Image();
    // Set the source URL for the image
    imageToLoad.src = imageUrl;

    // Function to handle image loading
    const handleLoad = () => {
      // Calculate the aspect ratio of the image
      const aspectRatio = imageToLoad.width / imageToLoad.height;
      // Max width and height for the canvas
      const maxWidth = 800;
      const maxHeight = 450;

      let newWidth = imageToLoad.width;
      let newHeight = imageToLoad.height;

      // Adjust dimensions if image is larger than canvas
      if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = newWidth / aspectRatio;
      }

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }

      // Update the canvas dimensions using the provided callback
      setCanvasMeasures({
        width: newWidth,
        height: newHeight,
      });

      // Set the loaded image in the state
      setImage(imageToLoad);
    };

    // Listen for the "load" event of the image
    imageToLoad.addEventListener("load", handleLoad);

    // Clean up by removing the event listener when the component unmounts
    return () => {
      imageToLoad.removeEventListener("load", handleLoad);
    };
  }, [imageUrl, setCanvasMeasures]);

  // If the image is not loaded yet, return null
  if (!image) {
    return null;
  }

  // Render the loaded image using the Image component from react-konva
  return (
    <Image
      image={image}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      width={canvasMeasures.width}
      height={canvasMeasures.height}
    />
  );
};

export default ImageFromUrl;
