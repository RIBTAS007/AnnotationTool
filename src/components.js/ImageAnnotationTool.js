import React, { useState, useCallback, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { v1 as uuidv1 } from "uuid";
import ImageFromUrl from "./ImageFromUrl";
import image1 from "../images/Image 1.jpg";
import image2 from "../images/Image 2.jpg";
import image3 from "../images/Image 3.webp";
import image4 from "../images/Image 4.jpg";
import image5 from "../images/Image 5.jpg";
import Annotation from "./Annotation";
import styles from "../css/ImageAnnotation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faSave,
  faDownload,
  faTrash,
  faEdit,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const images = [image1, image2, image3, image4, image5];

function ImageAnnotationTool() {
  // State variables for managing annotations and annotation mode
  const [annotations, setAnnotations] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newAnnotation, setNewAnnotation] = useState([]);
  const [selectedId, selectAnnotation] = useState(null);
  const [annotationMode, setAnnotationMode] = useState(false);
  const [annotationsSaved, setAnnotationsSaved] = useState(false);
  const [annotationsToDraw, setAnnotationsToDraw] = useState([]);

  // Update annotations to draw when annotations or newAnnotation change
  useEffect(() => {
    const updatedAnnotationsToDraw = [...annotations, ...newAnnotation];
    setAnnotationsToDraw(updatedAnnotationsToDraw);
  }, [annotations, newAnnotation]);

  // Toggle annotation mode between enable and disable
  const handleAnnotationButtonClick = () => {
    setAnnotationMode((prevMode) => !prevMode);
  };

  const [canvasMeasures, setCanvasMeasures] = useState({
    width: 800, // Set canvas width
    height: 400, // Set canvas height
  });

  // Handle mouse down event for creating a new annotation
  const handleMouseDown = (event) => {
    if (annotationMode && selectedId === null && newAnnotation.length === 0) {
      const { x, y } = event.target.getStage().getPointerPosition();
      const id = uuidv1();
      setNewAnnotation([{ x, y, width: 0, height: 0, id }]);
    }
  };

  // Handle mouse move event for resizing the new annotation
  const handleMouseMove = (event) => {
    if (selectedId === null && newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      const id = uuidv1();
      setNewAnnotation([
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          id,
        },
      ]);
    }
  };

  // Handle mouse up event for finalizing the new annotation
  const handleMouseUp = () => {
    if (selectedId === null && newAnnotation.length === 1) {
      const newAnnotationData = newAnnotation[0];
      if (
        newAnnotationData.x !== newAnnotationData.x + newAnnotationData.width ||
        newAnnotationData.y !== newAnnotationData.y + newAnnotationData.height
      ) {
        annotations.push(...newAnnotation);
        setAnnotations(annotations);
      }
      setNewAnnotation([]);
    }
  };

  // Handle mouse enter event for changing cursor
  const handleMouseEnter = (event) => {
    event.target.getStage().container().style.cursor = "crosshair";
  };

  // Handle key down event for deleting selected annotation
  const handleKeyDown = (event) => {
    if (event.keyCode === 8 || event.keyCode === 46) {
      if (selectedId !== null) {
        const newAnnotations = annotations?.filter(
          (annotation) => annotation.id !== selectedId
        );
        setAnnotations(newAnnotations);
      }
    }
  };

  // function to go to previous image
  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      handleClearButtonClick();
    }
  };

  // function to go to next image
  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      handleClearButtonClick();
    }
  };

  // functions to generate annotation json data
  const generateAnnotationsJSON = useCallback(() => {
    const annotationsJSON = {};
    const currentImage = images[currentImageIndex];
    annotationsJSON[currentImage] = annotations.map((annotation) => ({
      x1: annotation.x,
      y1: annotation.y,
      x2: annotation.x + annotation.width,
      y2: annotation.y + annotation.height,
    }));
    return JSON.stringify(annotationsJSON);
  }, [annotations, currentImageIndex]);

  // function to save annotation json data
  const handleSaveButtonClick = () => {
    const annotationsString = generateAnnotationsJSON();
    console.log(annotationsString); // Display the JSON string
    setAnnotationsSaved(true);
  };

  // function to clear annotations
  const handleClearButtonClick = () => {
    setAnnotations([]); // Clear all annotations by setting the state to an empty array
    selectAnnotation(null); // Clear the selected annotation as well
    setNewAnnotation([]); // Clear the newAnnotation state
    setAnnotationsSaved(false);
  };

  // function to download annotation json data
  const handleDownloadAnnotations = () => {
    if (annotationsSaved) {
      if (annotations.length > 0) {
        const annotationsString = generateAnnotationsJSON();
        const blob = new Blob([annotationsString], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "annotations.json";
        a.click();

        URL.revokeObjectURL(url);
        setAnnotationsSaved(false);
      } else {
        alert("No annotations to submit.");
      }
    } else {
      alert("Please save before submitting annotations");
    }
  };

  return (
    <>
      <div className={styles.buttonContainer}>
        <button className={styles.btn} onClick={handlePreviousImage}>
          <span className={styles.icon}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </span>
          <span className={styles.text}>Previous</span>
        </button>
        <button className={styles.btn} onClick={handleAnnotationButtonClick}>
          {annotationMode ? (
            <>
              <span className={styles.icon}>
                <FontAwesomeIcon icon={faTimesCircle} />
              </span>{" "}
              <span className={styles.text}>Disable Annotation</span>
            </>
          ) : (
            <>
              <span className={styles.icon}>
                <FontAwesomeIcon icon={faEdit} />
              </span>
              <span className={styles.text}>Enable Annotation</span>
            </>
          )}
        </button>

        <button className={styles.btn} onClick={handleSaveButtonClick}>
          <span className={styles.icon}>
            <FontAwesomeIcon icon={faSave} />
          </span>
          <span className={styles.text}>Save</span>
        </button>
        <button className={styles.btn} onClick={handleDownloadAnnotations}>
          <span className={styles.icon}>
            <FontAwesomeIcon icon={faDownload} />
          </span>
          <span className={styles.text}>Submit</span>
        </button>
        <button className={styles.btn} onClick={handleClearButtonClick}>
          <span className={styles.icon}>
            <FontAwesomeIcon icon={faTrash} />
          </span>
          <span className={styles.text}>Clear</span>
        </button>
        <button className={styles.btn} onClick={handleNextImage}>
          <span className={styles.text}>Next</span>
          <span className={styles.icon}>
            <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </button>
      </div>

      <div
        className={styles.canvasContainer}
        tabIndex={1}
        onKeyDown={handleKeyDown}
      >
        <Stage
          width={canvasMeasures.width}
          height={canvasMeasures.height}
          onMouseEnter={handleMouseEnter}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ border: "2px solid #3054e5" }}
        >
          <Layer>
            <ImageFromUrl
              setCanvasMeasures={setCanvasMeasures}
              canvasMeasures={canvasMeasures}
              imageUrl={images[currentImageIndex]}
              onMouseDown={() => {
                selectAnnotation(null);
              }}
            />
            {annotationsToDraw.map((annotation, i) => {
              return (
                <Annotation
                  key={i}
                  shapeProps={annotation}
                  isSelected={annotation.id === selectedId}
                  onSelect={() => {
                    selectAnnotation(annotation.id);
                  }}
                  onChange={(newAttrs) => {
                    const rects = annotations.slice();
                    rects[i] = newAttrs;
                    setAnnotations(rects);
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    </>
  );
}

export default ImageAnnotationTool;
