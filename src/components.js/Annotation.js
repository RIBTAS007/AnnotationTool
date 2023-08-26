import React, { useEffect, useRef } from "react";
import { Rect, Transformer } from "react-konva";

const Annotation = ({ shapeProps, isSelected, onSelect, onChange }) => {

  // Refs to hold references to the shape and transformer components
  const shapeRef = useRef();
  const transformRef = useRef();

  useEffect(() => {
     // When the selection state changes, update the transformer's target node
     if (isSelected) {
      transformRef.current.setNode(shapeRef.current); // Set the shapeRef as the target for the transformer
      transformRef.current.getLayer().batchDraw(); // Batch draw to refresh the canvas
    }
  }, [isSelected]);

  const onMouseEnter = (event) => {
    // Change cursor to "move" when hovering over the shape
    event.target.getStage().container().style.cursor = "move";
  };

  const onMouseLeave = (event) => {
    // Change cursor back to "crosshair" when leaving the shape
    event.target.getStage().container().style.cursor = "crosshair";
  };

  return (
    <>
      <Rect
        fill="transparent"
        stroke="blue"
        onMouseDown={onSelect}
        ref={shapeRef}
        {...{
          ...shapeProps,
        }}
        draggable
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDragEnd={(event) => {
          onChange({
            ...shapeProps,
          });
        }}
        onTransformEnd={(event) => {
          const node = shapeRef.current;
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
          });
        }}
      />
      {isSelected && <Transformer ref={transformRef} />}
    </>
  );
};

export default Annotation;
