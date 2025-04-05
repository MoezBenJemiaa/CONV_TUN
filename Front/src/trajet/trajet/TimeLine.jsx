import React, { useState, useEffect, useRef } from "react";
import { MapIcon, ChevronDown, ChevronUp } from "lucide-react";
import styles from "./TimeLine.module.css"; // Import the CSS module

export default function Timeline({ className, trip }) {
  const [showStop, setShowStop] = useState(false);

  // Destructure trip data
  const { departure, arrival, stops, departureTime, arrivalTime, duration, description } = trip;

  const timelineContainerRef = useRef(null);

  const extractLocationName = (fullAddress) => {
    if (!fullAddress) return "Unknown";
    const parts = fullAddress.split(",");
    return parts.length > 2
      ? `${parts[0].trim()}, ${parts[1].trim()}, ${parts[2].trim()}`
      : fullAddress;
  };
  const extractLocationName1 = (fullAddress) => {
    if (!fullAddress) return "Unknown";
    const parts = fullAddress.split(",");
    return parts.length > 3
      ? parts[3].trim()
      : fullAddress;
  };

  // Calculate the number of circles to display
  const numberOfCircles =
    (stops.length > 0 ? 1 : 0) +
    (showStop ? stops.length : 0) +
    2; // 2 is for the static middle circles (departure and arrival)

  // Dynamically calculate the height of bars based on container height
  const [barHeight, setBarHeight] = useState(0);

  useEffect(() => {
    if (timelineContainerRef.current) {
      const containerHeight = timelineContainerRef.current.offsetHeight;
      const calculatedHeight = containerHeight / numberOfCircles;
      setBarHeight(calculatedHeight); // Update bar height based on container height
    }
  }, [numberOfCircles]); // Recalculate if the number of circles changes

  return (
    <div className={styles.timelineContainer} ref={timelineContainerRef}>
      <div className={styles.bar}>
        {/* First Circle and Bar (departure) */}
        <div className={styles.circle}></div>
        <div className={styles.firstVerticalBar} style={{ height: barHeight }}></div>

        {/* Middle Circles */}
        {stops.length > 0 && (
          <>
            {!showStop && <div className={styles.circle}></div>}
            {showStop && stops.map((_, index) => <div key={index} className={styles.circle}></div>)}
          </>
        )}

        <div className={styles.circle}></div>

        {/* Last Circle and Bar (arrival) */}
        <div className={styles.secondVerticalBar} style={{ height: barHeight }}></div>
        <div className={styles.circle}></div>
      </div>

      <div className={styles.timeline}>
        {/* Departure */}
        <button className={styles.timelineItem} onClick={() => {}}>
          <div>
            <div className={styles.time}>{departureTime}</div>
            <div className={styles.duration}>{duration}</div>
          </div>
          <div className={styles.timelineContent}>
            <div className={styles.title}>
              {extractLocationName1(departure.name)}
              <MapIcon className={styles.icon} />
            </div>
            <div className={styles.address}>{extractLocationName(departure.name)}</div>
          </div>
        </button>

        {/* Stop Details */}
        {stops.length > 0 && (
          <div className={styles.stopWrapper}>
            <button className={styles.stopButton} onClick={() => setShowStop(!showStop)}>
              {stops.length} arrêt{" "}
              {showStop ? <ChevronUp className={styles.chevronIcon} /> : <ChevronDown className={styles.chevronIcon} />}
            </button>

            {showStop && (
              <div className={`${styles.stopDetailsContainer} ${showStop ? styles.show : ""}`}>
                {stops.map((stop, index) => (
                  <div key={index} className={styles.stopDetail}>
                    {extractLocationName(stop.name)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Arrival */}
        <button className={styles.timelineItem} onClick={() => {}}>
          <div>
            <div className={styles.time}>{arrivalTime}</div>
          </div>
          <div className={styles.timelineContent}>
            <div className={styles.title}>
              {extractLocationName1(arrival.name)}
              <MapIcon className={styles.icon} />
            </div>
            <div className={styles.address}>{extractLocationName(arrival.name)}</div>
          </div>
        </button>
      </div>
    </div>
  );
}
