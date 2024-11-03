import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import Plot from 'react-plotly.js';

function Bisection() {
  const [xL, setXL] = useState('');
  const [xR, setXR] = useState('');
  const [fx, setFx] = useState('');
  const [epsilon, setEpsilon] = useState('');
  const [outputData, setOutputData] = useState({
    error: [],
    iteration: [],
    xM: [],
    answer_xM: null,
    i_found: null
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [exercise, setExercise] = useState([]);
  const [graphData, setGraphData] = useState({ x: '', y: '' });
  const [xRange, setXRange] = useState([]);
  const [yRange, setYRange] = useState([]);
  const [xIterValues, setXIterValues] = useState([]);
  const [yIterValues, setYIterValues] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/get-exercise`, {
      params: {
        category: 'bifalse'
      }
    }).then(response => {
      setExercise(response.data);
    }).catch(error => {
      console.error('There was an error!', error);
    });
  }, []);

  const getExcercise = async () => {
    if (exercise.length === 0) {
      alert("No exercise data");
      return;
    }
    const randomIndex = Math.floor(Math.random() * exercise.length);
    const randomExercise = exercise[randomIndex];
    setXL(randomExercise.exercise.xL);
    setXR(randomExercise.exercise.xR);
    setFx(randomExercise.exercise.Function);
    setEpsilon(randomExercise.exercise.Epsilon);
  };

  const handleSolve = async () => {
    let xLNum = parseFloat(xL);
    let xRNum = parseFloat(xR);
    let epsilonNum = parseFloat(epsilon);
    let i = 1;
    let xM = 0;
    let xm_new = 0;
    let error = 0;
    let xIterValues = [];
    let yIterValues = [];
    let iteration = [];
    let xMArray = [];
    let errorArray = [];
    const xValues = [];
    const yValues = [];

    const evaluateFx = (x) => {
      try {
        const sanitizedFx = fx.replace(/\^/g, '**');
        return eval(sanitizedFx.replace(/x/g, `(${x})`));
      } catch (error) {
        console.error("Error evaluating the function:", error);
        return null;
      }
    };

    let fxL = evaluateFx(xLNum);
    let fxR = evaluateFx(xRNum);

    if (fxL * fxR > 0) {
      setOutputData({
        iteration,
        xM: xMArray,
        error: errorArray,
        answer_xM: "No root found: The function does not cross the x-axis in the specified interval.",
        i_found: null
      });
      return;
    }

    for (let i = xL; i <= xR; i++) {
      let fxm = evaluateFx(xM);
      xValues.push(xM);
      yValues.push(fxm);
    }

    do {
      xM = (xLNum + xRNum) / 2;
      let fxm = evaluateFx(xM);

      if (fxm * fxR < 0) {
        xLNum = xM;
      } else if (fxm * fxL < 0) {
        xRNum = xM;
      }

      error = Math.abs(xm_new - xM);
      xm_new = xM;

      iteration.push(i);
      xMArray.push(xM);
      errorArray.push(error);

      xIterValues.push(xM);
      yIterValues.push(fxm);

      setGraphData({ x: xValues, y: yValues });

      setXIterValues(xIterValues);
      setYIterValues(yIterValues);

      i++;
    } while (error > epsilonNum && i < 1000);

    setGraphData({ x: xIterValues, y: yIterValues });
    setXRange([xL, xR]);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    setYRange([yMin - 1, yMax + 1]);

    setOutputData({
      iteration,
      xM: xMArray,
      error: errorArray,
      answer_xM: xM,
      i_found: i - 1
    });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />
      <div className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold">Bisection Method</h1>
          <p className="text-justify mt-2">
            The bisection method is a root-finding method that applies to any continuous function for which one knows two values with opposite signs.
          </p>

          <div className="flex flex-col lg:flex-row mt-6 gap-6">
            <div className='flex flex-col w-full'>
              <h2 className="text-xl font-semibold">Input</h2>

              <div className="flex gap-4">
                <div className="mt-2 w-full">
                  <label className="block">xL</label>
                  <input
                    type="text"
                    placeholder='0'
                    className="input input-bordered w-full input-primary mt-2"
                    value={xL}
                    onChange={(e) => setXL(e.target.value)}
                  />
                </div>
                <div className="mt-2 w-full">
                  <label className="block">xR</label>
                  <input
                    type="text"
                    placeholder='10'
                    className="input input-bordered w-full input-primary mt-2"
                    value={xR}
                    onChange={(e) => setXR(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <div className="mt-2 w-full">
                  <label className="block">Function</label>
                  <input
                    type="text"
                    placeholder='f(x) (use ** to input powers)'
                    className="input input-bordered w-full input-primary mt-2"
                    value={fx}
                    onChange={(e) => setFx(e.target.value)}
                  />
                </div>
                <div className="mt-2 w-full">
                  <label className="block">Epsilon</label>
                  <input
                    type="text"
                    placeholder='0.00001'
                    className="input input-bordered w-full input-primary mt-2"
                    value={epsilon}
                    onChange={(e) => setEpsilon(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <button className="btn btn-primary btn-block" onClick={handleSolve}>
                  Solve
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-row justify-between">
                <h2 className="text-xl font-semibold">Output</h2>
                <button onClick={getExcercise} className="btn btn-primary w-1/8" >Exercise</button>
              </div>
              <div className="text-lg">
                <p>Answer : {outputData.answer_xM ? outputData.answer_xM : 'No data'}</p>
              </div>
              <h2 className="text-xl font-semibold">Output Table</h2>

              <div className="h-80 overflow-x-auto rounded mt-2">
                <table className="table table-pin-rows rounded">
                  <thead>
                    <tr>
                      <th className="bg-primary text-primary-content">Iteration</th>
                      <th className="bg-primary text-primary-content">X Value (xM)</th>
                      <th className="bg-primary text-primary-content">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outputData.iteration.length > 0 ? (
                      outputData.iteration.map((iteration, index) => (
                        <tr key={index}>
                          <td>{iteration}</td>
                          <td>{outputData.xM[index]}</td>
                          <td>{outputData.error[index]}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center">No data</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full flex justify-center bg-base-100'>
          <Plot
            data={[
              {
                x: graphData.x,
                y: graphData.y,
                type: 'scatter',
                mode: 'lines',
                line: { color: 'black', width: 1 },
              },
              {
                x: xIterValues,
                y: yIterValues,
                type: 'scatter',
                mode: 'markers',
                marker: { color: 'blue', size: 5 },
              },
              {
                x: [outputData.answer_xM],
                y: [0],
                type: 'scatter',
                mode: 'markers',
                marker: { color: 'red', size: 10 },
              },
            ]}
            layout={{
              width: '100%',
              height: 400,
              title: 'Graph',
              paper_bgcolor: '#ffefcc',
              plot_bgcolor: '#ffefcc',
              xaxis: { range: xRange },
              yaxis: { range: yRange },
              margin: { l: 40, r: 40, t: 40, b: 40 },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Bisection;
