import React from "react";
import { EventSlider, YearSlider } from "./shared/components";
import "./shared/styles/components/App.scss";

function App() {
  const [activePeriodIndex, setActivePeriodIndex] = React.useState(0);
  return (
    <>
      <main className="timeline">
        <div className="container timeline__container">
          <h1 className="timeline__title">Исторические даты</h1>
          <YearSlider setActivePeriodIndex={setActivePeriodIndex} />
          <EventSlider ActivePeriodIndex={activePeriodIndex} />
        </div>
      </main>
    </>
  );
}

export default App;
