import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

function Newton() {
  const [fx, setFx] = useState('');
  const [epsilon, setEpsilon] = useState('');
  const [x0, setX0] = useState('');
  const [outputData, setOutputData] = useState({ iteration: [], y: [], answer_x: null, error: [] });
  const [arr, setArr] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [exercise, setExercise] = useState([]);

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
    setX0(randomExercise.exercise.xStart);
    setFx(randomExercise.exercise.Function);
    setEpsilon(randomExercise.exercise.Epsilon);
  };

  const parseFx = (fx) => {
    const regex = /x\^(\d+)\s*-\s*(\d+)/;
    const match = fx.match(regex);
    if (match) {
      const roots = parseFloat(match[1]);
      const num = parseFloat(match[2]);
      return { roots, num };
    }
    return null;
  };

  const handleSolve = () => {
    let x = parseFloat(x0);
    let epsilonValue = parseFloat(epsilon);

    if (isNaN(x) || isNaN(epsilonValue) || !fx) {
      alert("Please input valid numbers for x0, epsilon, and a valid function.");
      return;
    }

    const parsedFx = parseFx(fx);
    if (!parsedFx) {
      alert("Invalid function format");
      return;
    }

    const { roots, num } = parsedFx;

    let y = 0;
    let error = 0;
    let i = 1;
    let fxdiff = 0;
    let fx1 = 0;

    const iterations = [];
    const yValues = [];
    const errors = [];

    do {
      try {
        fx1 = Math.pow(x, roots) - num;
        fxdiff = roots * Math.pow(x, roots - 1);
        y = x - (fx1 / fxdiff);
        error = Math.abs(y - x);
        x = y;

        if (!isFinite(y)) {
          alert("Error: The result is infinity. This might be due to division by zero or overflow.");
          return;
        }

        if (isNaN(y)) {
          alert("Error: The result is NaN (Not a Number). Please check your input function.");
          return;
        }

        iterations.push(i);
        yValues.push(y);
        errors.push(error);

      } catch (err) {
        alert("Error in function evaluation");
        return;
      }

      i++;
    } while (error > epsilonValue);

    setOutputData({
      iteration: iterations,
      y: yValues,
      answer_x: x,
      error: errors
    });
    setArr(yValues);
  };

  // const xRange = 100;
  // const calculateY = (x, fx) => {
  //   const sanitizedFx = fx.replace(/\^/g, '**');
  //   try {
  //     return eval(sanitizedFx.replace(/x/g, `(${x})`));
  //   } catch (error) {
  //     console.error("Error calculating y values:", error);
  //     return 0;
  //   }
  // };

  // const xValues = Array.from({ length: 201 }, (_, i) => i - xRange);
  // const yValues = xValues.map(x => calculateY(x, fx));

  return (
    <div className="flex min-h-screen">
      <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />
      <div className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold">Newton-Raphson method</h1>
          <p className="text-justify mt-2">
            The Newton-Raphson method is a root-finding algorithm that uses a succession of roots of secant lines combined with the bisection method to approximate a root of a function.
          </p>

          {/* Input & Table Section */}
          <div className="flex flex-col lg:flex-row mt-6 gap-6">
            <div className="flex flex-col w-full">
              <h2 className="text-xl font-semibold">Input</h2>

              <div className="flex gap-4 w-full">
                <div className="mt-2">
                  <label className="block">Function</label>
                  <input
                    type="text"
                    placeholder='f(x) (use ** to input powers)'
                    className="input input-bordered w-full input-primary mt-2"
                    value={fx}
                    onChange={(e) => setFx(e.target.value)}
                  />
                </div>

                <div className="mt-2">
                  <label className="block">Epsilon</label>
                  <input
                    type="text"
                    placeholder='0.00001'
                    className="input input-bordered w-full input-primary mt-2"
                    value={epsilon}
                    onChange={(e) => setEpsilon(e.target.value)}
                  />
                </div>

                <div className="mt-2">
                  <label className="block">x Start</label>
                  <input
                    type="text"
                    placeholder='x0'
                    className="input input-bordered w-full input-primary mt-2"
                    value={x0}
                    onChange={(e) => setX0(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <button className="btn btn-primary btn-block" onClick={handleSolve}>Solve</button>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-row justify-between">
                <h2 className="text-xl font-semibold">Output</h2>
                <button onClick={getExcercise} className="btn btn-primary w-1/8" >Exercise</button>
              </div>

              <div className="text-lg">
                <p>Answer : {outputData.answer_x ? outputData.answer_x.toFixed(6) : 'No data'}</p>
                <p>Iteration : {outputData.iteration ? outputData.iteration.length : 'No data'}</p>
              </div>
              <h2 className="text-xl font-semibold">Output Table</h2>

              <table className="table table-pin-rows rounded">
                <thead>
                  <tr>
                    <th className="bg-primary text-primary-content">Iteration</th>
                    <th className="bg-primary text-primary-content">Y Value</th>
                    <th className="bg-primary text-primary-content">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {outputData.iteration.length > 0 ? (
                    outputData.iteration.map((iteration, index) => (
                      <tr key={index}>
                        <td>{iteration}</td>
                        <td>{outputData.y[index].toFixed(6)}</td>
                        <td>{outputData.error[index].toFixed(6)}</td>
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
    </div>
  );
}

export default Newton;
