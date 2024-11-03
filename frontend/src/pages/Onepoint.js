import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Plot from 'react-plotly.js';
import axios from 'axios';

function Onepoint() {
  const [xStart, setXstart] = useState('');
  const [fx, setFx] = useState('');
  const [epsilon, setEpsilon] = useState('');
  const [outputData, setOutputData] = useState({ iteration: [], y: [], answer_x: null, error: [] });
  const [arr, setArr] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [exercise, setExercise] = useState([]);
  const [modifiedFunc, setModifiedFunc] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/get-exercise`, {
      params: {
        category: 'onenewton'
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
    setXstart(randomExercise.exercise.xStart);
    setFx(randomExercise.exercise.Function);
    setEpsilon(randomExercise.exercise.Epsilon);
  };

  const parseFx = (fx) => {
    const regex = /x\**(\d+)\s*-\s*(\d+)/;
    const match = fx.match(regex);
    if (match) {
      const roots = parseFloat(match[1]);
      const num = parseFloat(match[2]);
      return { roots, num };
    }
    return null;
  };

  const calculateY = (x, roots, num) => {
    return (1 / 2) * ((num / Math.pow(x, roots - 1)) + x);
  };

  const handleSolve = async () => {
    let x = parseFloat(xStart);
    let epsilonValue = parseFloat(epsilon);

    const e = 2.71828;

    let modifiedFunc2 = fx.replace(/e/g, e);
    setModifiedFunc(modifiedFunc2);

    const pattern = /([0-9.]+|\-?\d+)/g // ใช้ regex ในการแยกค่าตัวเลขและเครื่องหมายลบ
    const terms = modifiedFunc2.match(pattern);

    if (isNaN(x) || isNaN(epsilonValue) || !fx) {
      alert("Please input valid numbers for xStart, epsilon, and a valid function.");
      return;
    }

    const parsedFx = parseFx(modifiedFunc2);
    if (!parsedFx) {
      alert("Invalid function format. Please input a function in the form 'x^n - num'.");
      return;
    }

    const { roots, num } = parsedFx; // roots = n, num = num

    let y = 0;
    let error = 0;
    let i = 1;
    const newYValues = [];
    const newIteration = [];
    const newErrors = [];

    do {
      try {
        y = (1 / 2) * ((num / Math.pow(x, roots - 1)) + x);

        if (!isFinite(y)) {
          alert("Error: The result is infinity. This might be due to division by zero or overflow.");
          return;
        }

        if (isNaN(y)) {
          alert("Error: The result is NaN (Not a Number). Please check your input function.");
          return;
        }

        error = Math.abs(y - x);

        if (newYValues.length >= 10000) {
          alert("Error: Too many iterations. Check function inputs.");
          return;
        }

        newYValues.push(y);
        newIteration.push(i);
        newErrors.push(error);

        x = y;
        i++;

      } catch (err) {
        alert("Error in function evaluation");
        return;
      }

    } while (error > epsilonValue);

    setOutputData({ iteration: newIteration, y: newYValues, answer_x: y, error: newErrors });
    setArr(newYValues);
    setErrors(newErrors);
  };

  const xRange = 10;
  const xValues = Array.from({ length: 201 }, (_, i) => i - xRange);

  const parsedFx = parseFx(fx);
  const yValues = parsedFx ? xValues.map(x => calculateY(x, parsedFx.roots, parsedFx.num)) : [];

  return (
    <div className="flex min-h-screen">
      <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />
      <div className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold">One-point iteration</h1>
          <p className="text-justify mt-2">
            The one-point iteration method is a root-finding algorithm that uses the Newton-Raphson method to find the root of a function. The algorithm starts with an initial guess x0</p>
          {/* Input & Table Section */}
          <div className="flex flex-col lg:flex-row mt-6 gap-6">
            <div className='flex flex-col w-full'>
              <h2 className="text-xl font-semibold">Input</h2>

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

                <div className="mt-2 w-full">
                  <label className="block">x Start</label>
                  <input
                    type="text"
                    placeholder='x0'
                    className="input input-bordered w-full input-primary mt-2"
                    value={xStart}
                    onChange={(e) => setXstart(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <button className="btn btn-primary btn-block" onClick={handleSolve}>Solve</button>
              </div>

              <div className="text-lg mt-4">
                <p>Answer : {outputData.answer_x ? outputData.answer_x.toFixed(6) : 'No data'}</p>
                <p>Iteration : {outputData.iteration ? outputData.iteration.length : 'No data'}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-row justify-between">
                <h2 className="text-xl font-semibold">Output</h2>
                <button onClick={getExcercise} className="btn btn-primary w-1/8" >Exercise</button>
              </div>

              {/* <h2 className="text-xl font-semibold">Output Table</h2> */}
              <div className='h-72 overflow-y-auto mt-1'>
                <table className="table table-pin-rows rounded">
                  <thead>
                    <tr>
                      <th className="bg-primary text-primary-content">Iteration</th>
                      <th className="bg-primary text-primary-content">Y Value</th>
                      <th className="bg-primary text-primary-content">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arr.length > 0 ? (
                      arr
                        .slice(-20)
                        .map((yValue, index) => (
                          <tr key={index}>
                            <td>{outputData.iteration.slice(-20)[index]}</td>
                            <td>{yValue.toFixed(6)}</td>
                            <td>{errors.slice(-20)[index] ? errors.slice(-20)[index].toFixed(6) : 'No data'}</td>
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

          <div className='w-full flex justify-center bg-base-100 mt-8'>
            <div className='w-full flex justify-center bg-base-100 mt-8'>
              <Plot
                data={[
                  {
                    x: xValues,
                    y: yValues,
                    type: 'scatter',
                    mode: 'lines',
                    marker: { color: 'black', width: 1 },
                    name: 'f(x)',
                  },
                  {
                    x: xValues,
                    y: xValues,
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: 'blue' },
                    name: 'y = x',
                  },
                  {
                    x: outputData.iteration.map((_, index) => outputData.iteration[index] ? parseFloat(outputData.y[index - 1] || xStart) : null).filter(val => val !== null),
                    y: outputData.y,
                    type: 'scatter',
                    mode: 'markers',
                    marker: { color: 'red', size: 3 },
                    name: 'Calculated Points',
                  },
                  {
                    x: [outputData.answer_x],
                    y: [calculateY(outputData.answer_x, fx)],
                    type: 'scatter',
                    mode: 'markers',
                    marker: { color: 'green', size: 10 },
                    name: 'Answer Point',
                  },
                ]}
                layout={{
                  width: '100%',
                  height: 400,
                  title: fx ? `Graph of ${fx}` : 'Graph',
                  paper_bgcolor: '#ffefcc',
                  plot_bgcolor: '#ffefcc',
                  xaxis: {
                    range: [0, 100],
                  },
                  yaxis: {
                    range: [0, 100],
                  },
                  margin: {
                    l: 40,
                    r: 40,
                    t: 40,
                    b: 40,
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onepoint;
