import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

function Secant() {
  const [fx, setFx] = useState('');
  const [epsilon, setEpsilon] = useState('');
  const [x0, setX0] = useState('');
  const [x1, setX1] = useState('');
  const [outputData, setOutputData] = useState({ iteration: [], y: [], answer_x: null, error: [] });
  const [exercise, setExercise] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/get-exercise`, {
      params: {
        category: 'secant'
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
    setX0(randomExercise.exercise.x0);
    setX1(randomExercise.exercise.x1);
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
    let x0Val = parseFloat(x0);
    let x1Val = parseFloat(x1);
    let epsilonValue = parseFloat(epsilon);

    if (isNaN(x0Val) || isNaN(x1Val) || isNaN(epsilonValue) || !fx) {
      alert('Please input valid numbers for x0, x1, epsilon, and a valid function.');
      return;
    }

    const parsedFx = parseFx(fx);
    if (!parsedFx) {
      alert('Invalid function format');
      return;
    }

    const { roots, num } = parsedFx;

    let iteration = [];
    let y = [];
    let errorArr = [];
    let i = 0;
    let x2 = 0;
    let error = 1;

    do {
      const fx0 = Math.pow(x0Val, roots) - num;
      const fx1 = Math.pow(x1Val, roots) - num;
      x2 = x1Val - (fx1 * (x0Val - x1Val)) / (fx0 - fx1);
      error = Math.abs(x2 - x1Val);

      iteration.push(i + 1);
      y.push(x2);
      errorArr.push(error);

      x0Val = x1Val;
      x1Val = x2;
      i++;
    } while (error > epsilonValue && i < 100);

    setOutputData({ iteration, y, answer_x: x2, error: errorArr });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />
      <div className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold">Secant method</h1>
          <p className="text-justify mt-2">
            The secant method is a root-finding algorithm that uses a succession of roots of secant lines combined with bisection method to approximate a root of a function f. The method is also known as regula falsi, the Latin for false
          </p>

          {/* Input section */}
          <div className="flex flex-col lg:flex-row mt-6 gap-6">
            <div className='flex flex-col w-full'>
              <h2 className="text-xl font-semibold">Input</h2>

              <div className="flex gap-4">
                <div className="mt-2 w-full">

                  <label className="block">Function</label>
                  <input
                    type="text"
                    placeholder="f(x) (use ** to input powers)"
                    className="input input-bordered w-full input-primary mt-2"
                    value={fx}
                    onChange={(e) => setFx(e.target.value)}
                  />
                </div>

                <div className="mt-2 w-full">
                  <label className="block">Epsilon</label>
                  <input
                    type="text"
                    placeholder="0.00001"
                    className="input input-bordered w-full input-primary mt-2"
                    value={epsilon}
                    onChange={(e) => setEpsilon(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <div className="mt-2 w-full">
                  <label className="block">x0</label>
                  <input
                    type="text"
                    placeholder="x0"
                    className="input input-bordered w-full input-primary mt-2"
                    value={x0}
                    onChange={(e) => setX0(e.target.value)}
                  />
                </div>

                <div className="mt-2 w-full">
                  <label className="block">x1</label>
                  <input
                    type="text"
                    placeholder="x1"
                    className="input input-bordered w-full input-primary mt-2"
                    value={x1}
                    onChange={(e) => setX1(e.target.value)}
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
                <p>Iteration : {outputData.iteration.length > 0 ? outputData.iteration.length : 'No data'}</p>
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

export default Secant;
