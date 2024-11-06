import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useCursor } from "./cursor-context";

const AdaptiveImage = () => {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const isHovered = useRef<boolean>(false);
  const isGrabbed = useRef<boolean>(false);
  const initialPos = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  /**
   * Cursor context
   * */
  const { setMousePos, cursorRef, mousePos } = useCursor();

  /**
   * The default image size
   * */
  const defaultSize = {
    x: 400,
    y: 250,
  };

  /**
   * Handles the resize
   * */
  const handleMouseMove = () => {
    if (isGrabbed.current && imgRef.current && sliderRef.current) {
      const { width, height } = imgRef.current.getBoundingClientRect();

      // do not resize the 'image' beyond these boundaries
      const boundingLimit = {
        minWidth: 400,
        maxWidth: 800,
      };

      const deltaX = mousePos.x - initialPos.current.x;
      const newWidth = Math.min(
        Math.max(width + deltaX, boundingLimit.minWidth),
        boundingLimit.maxWidth,
      );
      const newHeight = (newWidth / width) * height;

      gsap.to(imgRef.current, {
        width: newWidth,
        height: newHeight,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  };

  /**
   * Handles the mouse release
   * */
  const handleMouseUp = () => {
    isGrabbed.current = false;
    // return the image back to default size
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        width: defaultSize.x,
        height: defaultSize.y,
        duration: 1,
        ease: "elastic.out(1, 1)",
      });
    }
  };

  /**
   * Handles the mouse click
   * */
  const handleGrab = () => {
    if (sliderRef.current && isHovered.current === true) {
      const hitBox = 30;
      const {
        x: sliderX,
        y: sliderY,
        width,
        height,
      } = sliderRef.current.getBoundingClientRect();
      const { x, y } = mousePos;
      if (
        x >= sliderX - hitBox &&
        x <= sliderX + width + hitBox &&
        y >= sliderY - hitBox &&
        y <= sliderY + height + hitBox
      ) {
        isGrabbed.current = true;
        initialPos.current.x = mousePos.x;
        initialPos.current.y = mousePos.y;
      } else {
        isGrabbed.current = false;
      }
    }
  };

  /**
   * The hover animation
   * */
  useEffect(() => {
    if (sliderRef.current) {
      const hitBox = 30;
      const {
        x: sliderX,
        y: sliderY,
        width,
        height,
      } = sliderRef.current.getBoundingClientRect();
      const { x, y } = mousePos;

      // check if the mouse position is within the sliders area
      if (
        x >= sliderX - hitBox &&
        x <= sliderX + width + hitBox &&
        y >= sliderY - hitBox &&
        y <= sliderY + height + hitBox
      ) {
        /**
         * Typeguard for the useEffect to prevent infinite rerenders
         * */
        const snappedPosition = { x: sliderX + 15, y: sliderY + 15 };
        if (x !== snappedPosition.x || y !== snappedPosition.y) {
          setMousePos(snappedPosition);
          isHovered.current = true;
        }
        /**
         * Animate to the sliderRef
         * */
        gsap.to(cursorRef.current, {
          height,
          width,
          borderRadius: "30px",
          backgroundColor: "#757575",
          duration: 0.3,
          ease: "power1.out",
        });
      } else if (isHovered.current && isGrabbed.current) {
        gsap.to(cursorRef.current, {
          opacity: 0,
          duration: 0.1,
          ease: "power1.out",
        });
        gsap.to(sliderRef.current, {
          backgroundColor: "#757575",
          duration: 0.1,
          ease: "power1.in",
        });
      } else {
        /**
         * Return to default
         * */
        gsap.to(cursorRef.current, {
          opacity: 1,
          height: 30,
          width: 30,
          borderRadius: "50%",
          backgroundColor: "#333333",
          duration: 0.1,
          ease: "power1.out",
        });
        gsap.to(sliderRef.current, {
          backgroundColor: "#212121",
          duration: 0.1,
          ease: "power1.out",
        });
      }
    }
  }, [mousePos]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleGrab);
    window.addEventListener("mouseup", handleMouseUp);

    return () => (
      window.removeEventListener("mousemove", handleMouseMove),
      window.removeEventListener("mousedown", handleGrab),
      window.removeEventListener("mouseup", handleMouseUp)
    );
  }, [mousePos]);

  return (
    <div className="flex items-center justify-center relative">
      {/* Image */}
      <div
        ref={imgRef}
        style={{
          width: defaultSize.x,
          height: defaultSize.y,
          backgroundColor: "#0E0E0E",
          border: "1px solid #3c3c3c",
          borderRadius: 10,
        }}
      />

      {/* Slider */}
      <div
        ref={sliderRef}
        className="transition-all"
        style={{
          width: 6,
          height: defaultSize.y / 3,
          backgroundColor: "#212121",
          borderRadius: 8,
          right: 0,
          transform: "translateX(300%)",
          position: "absolute",
          cursor: "none",
        }}
      />
    </div>
  );
};

export { AdaptiveImage };
