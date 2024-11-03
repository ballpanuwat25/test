import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Plot from 'react-plotly.js';
import axios from 'axios';

function Graphical() {
  const [xStart, setXStart] = useState('');
  const [xEnd, setXEnd] = useState('');
  const [func, setFunc] = useState('');
  const [step, setStep] = useState('');
  const [outputData, setOutputData] = useState({ iteration: [], answer_y: [], answer_x: null, message: 'No Data' });
  const [arr, setArr] = useState([]);
  const [lengthTable, setLengthTable] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modifiedFunc, setModifiedFunc] = useState(''); // สร้าง state สำหรับเก็บ func ที่ถูกแทนที่ 'e' แล้ว
  const [exercise, setExercise] = useState([]);
  const [graphData, setGraphData] = useState({ x: '', y: '' });
  const [xRange, setXRange] = useState([]);
  const [yRange, setYRange] = useState([]);
  const [xIterValues, setXIterValues] = useState([]);
  const [yIterValues, setYIterValues] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/get-exercise`, {
      params: {
        category: 'graphical'
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
    setXStart(randomExercise.exercise.xStart);
    setXEnd(randomExercise.exercise.xEnd);
    setFunc(randomExercise.exercise.Function);
    setStep(randomExercise.exercise.Step);
  };

  const handleSolve = async () => {
    if (xStart === "" || xEnd === "" || func === "" || step === "") {
      alert("Please fill all input fields.");
      return;
    }

    const xStartNum = parseFloat(xStart);
    const xEndNum = parseFloat(xEnd);
    const stepNum = parseFloat(step);

    const e = 2.71828;

    let modifiedFunc2 = func.replace(/e/g, e);
    setModifiedFunc(modifiedFunc2);

    //สำหรับเส้นกราฟ
    const xValues = [];
    const yValues = [];

    setXRange([xStartNum, xEndNum]);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    setYRange([yMin - 1, yMax + 1]);

    const pattern = /([0-9.]+|\-?\d+)/g // ใช้ regex ในการแยกค่าตัวเลขและเครื่องหมายลบ
    const terms = modifiedFunc2.match(pattern);

    if (!terms || terms.length < 2) {
      alert("Invalid function format. Please enter a valid function.");
      return;
    }

    const num1 = parseFloat(terms[0]);
    const num2 = parseFloat(terms[1]);

    let y0 = 0;
    let y1 = 0;
    let y2 = 0;
    let found = false;
    let lower, upper;
    let epsilon = 0.0001;

    let iteration = [];
    let answer_y = [];
    let answer_x = null;

    let xIterValues = [];
    let yIterValues = [];
    
    // สำหรับกราฟ
    for (let i = xStartNum; i <= xEndNum; i++){
      y0 = num1 * i + num2;
      xValues.push(i);
      yValues.push(y0);
    }

    for (let i = xStartNum; i <= xEndNum; i++) {
      y0 = num1 * i + num2;
      y1 = num1 * (i + 1) + num2;
      
      xIterValues.push(i);
      yIterValues.push(y0);

      setGraphData({ x: xValues, y: yValues });

      setXIterValues(xIterValues);
      setYIterValues(yIterValues);

      if (y0 * y1 < 0) {
        found = true;
        lower = i;
        upper = i + 1;
        break;
      }
    }

    if (found) {
      for (let j = lower; j <= upper; j += stepNum) {
        y2 = num1 * (j + stepNum) + num2;

        iteration.push(j);
        answer_y.push(y2);

        if ((y2 < epsilon && y2 > 0) || y2 === 0) {
          answer_x = j;
          setOutputData({ iteration, answer_y, answer_x });

          let length_table = answer_y.length > 20 ? answer_y.length - 20 : 0;
          let slicedArr = answer_y.slice(length_table);

          setArr(slicedArr);
          setLengthTable(length_table);

          console.log(slicedArr);
          return;
        }
      }
      setOutputData({ message: "No root found with this position" });
      setArr([]);  // ถ้าไม่มี root ให้เคลียร์ arr

      setGraphData({ x: xIterValues, y: yIterValues });
      setXRange([xStartNum, xEndNum]);
      const yMin = Math.min(...yValues);
      const yMax = Math.max(...yValues);
      setYRange([yMin - 1, yMax + 1]);

    } else {
      setOutputData({ message: "No root found in this range" });
      setArr([]);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />
      <div className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="flex-1 p-6">

          <h1 className="text-3xl font-bold">Graphical Method</h1>
          <p className="text-justify mt-2">
            The graphical method is a simple method used to solve linear programming problems. It is used to represent the feasible region graphically and find the optimal solution.
          </p>

          <div className="flex flex-col lg:flex-row mt-6 gap-6">
            <div className='flex flex-col w-full'>
              <h2 className="text-xl font-semibold">Input</h2>

              <div className="flex gap-4">
                <div className="mt-2 w-full">
                  <label className="block">xStart</label>
                  <input
                    type="text"
                    placeholder='0'
                    className="input input-bordered w-full input-primary mt-2"
                    value={xStart}
                    onChange={(e) => setXStart(e.target.value)}
                  />
                </div>

                <div className="mt-2 w-full">
                  <label className="block">xEnd</label>
                  <input
                    type="text"
                    placeholder='10'
                    className="input input-bordered w-full input-primary mt-2"
                    value={xEnd}
                    onChange={(e) => setXEnd(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <div className="mt-2 w-full">
                  <label className="block">Function</label>
                  <input
                    type="text"
                    placeholder='f(x)'
                    className="input input-bordered w-full input-primary mt-2"
                    value={func}
                    onChange={(e) => setFunc(e.target.value)}
                  />
                </div>

                <div className="mt-2 w-full">
                  <label className="block">Step</label>
                  <input
                    type="text"
                    placeholder='0.00001'
                    className="input input-bordered w-full input-primary mt-2"
                    value={step}
                    onChange={(e) => setStep(e.target.value)}
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
                <p>Answer : {outputData.answer_x ? outputData.answer_x : outputData.message}</p>
              </div>
              <div className="flex flex-col gap-4 w-full">
                <h2 className="text-xl font-semibold">Output Table</h2>
                <div className="h-80 overflow-x-auto rounded mt-2">
                  <table className="table table-pin-rows rounded">
                    <thead>
                      <tr>
                        <th className="bg-primary text-primary-content">Iteration</th>
                        <th className="bg-primary text-primary-content">Y Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {arr.length > 0 ? (
                        arr.map((yValue, index) => (
                          <tr key={index}>
                            <td>{outputData.iteration[lengthTable + index]}</td>
                            <td>{yValue}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="text-center">No data</td>
                        </tr>
                      )}
                    </tbody>

                  </table>
                </div>
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
                x: [outputData.answer_x],
                y: [0],
                type: 'scatter',
                mode: 'markers',
                marker: { color: 'red', size: 10 },
              },
            ]}
            layout={{
              width: '100%',
              height: 400,
              title: 'Graph of the function',
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

export default Graphical;