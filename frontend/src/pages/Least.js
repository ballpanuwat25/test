import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Plot from 'react-plotly.js';
import * as math from 'mathjs';
import axios from 'axios';

function Least() {
    const [n, setN] = useState('');
    const [x, setX] = useState('');
    const [y, setY] = useState('');
    const [mode, setMode] = useState('');
    const [xValue, setXValue] = useState('');
    const [output, setOutput] = useState(null);
    const [xValues, setXValues] = useState([]);
    const [yValues, setYValues] = useState([]);
    const [coefficients, setCoefficients] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [exercise, setExercise] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/get-exercise`, {
            params: {
                category: 'leastlinearpoly'
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

        const N = randomExercise.exercise.n;
        const X = randomExercise.exercise.x;
        const Y = randomExercise.exercise.y;
        const Mode = randomExercise.exercise.type;
        const XValue = randomExercise.exercise.x_value;

        setN(N);
        setX(X);
        setY(Y);
        setMode(Mode);
        setXValue(XValue);

    };

    const handleSolve = async () => {
        const parsedN = parseInt(n);
        const xArray = x.replace(/\s+/g, '').split(',').map(Number);
        const yArray = y.replace(/\s+/g, '').split(',').map(Number);
        const xVal = Number(xValue);

        if (!mode || !n || !x || !y || !xValue) {
            alert("Please fill all input fields.");
            return;
        }

        if (xArray.some(isNaN) || yArray.some(isNaN) || parsedN !== xArray.length || parsedN !== yArray.length) {
            alert("Invalid number of x or y or invalid values.");
            return;
        }

        if (isNaN(xVal)) {
            alert("Invalid value for the input x.");
            return;
        }

        if (mode === 'linear') {
            let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
            for (let i = 0; i < parsedN; i++) {
                sumX += xArray[i];
                sumY += yArray[i];
                sumXY += xArray[i] * yArray[i];
                sumX2 += xArray[i] ** 2;
            }

            const a = (parsedN * sumXY - sumX * sumY) / (parsedN * sumX2 - sumX ** 2);
            const b = (sumY - a * sumX) / parsedN;
            const predictedY = a * xVal + b;
            setOutput(predictedY);
            setCoefficients([b, a]);

            // Generate values for the regression line
            const xVals = [...Array(100).keys()].map(i => i - 10); // Generate x values from -50 to 50
            const yVals = xVals.map(x => a * x + b);
            setXValues(xVals);
            setYValues(yVals);

        } else if (mode === 'polynomial') {
            const degree = parsedN - 1;
            const xMatrix = xArray.map((xi) => [...Array(degree + 1).keys()].map(j => xi ** j));
            const yMatrix = yArray.map(val => [val]);

            try {
                const xMatrixT = math.transpose(xMatrix);
                const xMatrixT_xMatrix = math.multiply(xMatrixT, xMatrix);
                const xMatrixT_yMatrix = math.multiply(xMatrixT, yMatrix);
                const inv_xMatrixT_xMatrix = math.inv(xMatrixT_xMatrix);
                const aMatrix = math.multiply(inv_xMatrixT_xMatrix, xMatrixT_yMatrix);

                let result = 0;
                for (let i = 0; i <= degree; i++) {
                    result += aMatrix[i][0] * (xVal ** i);
                }
                setOutput(result);

                const coefficientsArray = aMatrix.map((val) => val[0]);
                setCoefficients(coefficientsArray);

                // Generate values for the regression line
                const xVals = [...Array(100).keys()].map(i => i - 10);
                const yVals = xVals.map(x => coefficientsArray.reduce((sum, coef, index) => sum + coef * (x ** index), 0));

                setXValues(xVals);
                setYValues(yVals);

            } catch (error) {
                console.error("Error in polynomial regression calculation: ", error);
                alert("Cannot compute polynomial regression. Please check your input.");
            }
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />
            <div className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <h1 className="text-3xl font-bold">Least square regression</h1>
                <div className="flex flex-col lg:flex-row mt-6 gap-6">
                    <div className='flex flex-col w-full'>
                        <h2 className="text-xl font-semibold">Input</h2>
                        <div className="flex gap-4">
                            <div className="mt-2 w-full">
                                <label className="block">Select type</label>
                                <input
                                    type="text"
                                    placeholder='linear, polynomial'
                                    className="input input-bordered w-full input-primary mt-2"
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                />
                            </div>
                            <div className="mt-2 w-full">
                                <label className="block">Number of initial x,y value(n)</label>
                                <input
                                    type="text"
                                    placeholder='(n value)'
                                    className="input input-bordered w-full input-primary mt-2"
                                    value={n}
                                    onChange={(e) => setN(e.target.value)}
                                />
                            </div>
                            <div className="mt-2 w-full">
                                <label className="block">X</label>
                                <input
                                    type="text"
                                    placeholder='Input x value to find y value'
                                    className="input input-bordered w-full input-primary mt-2"
                                    value={xValue}
                                    onChange={(e) => setXValue(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 w-full">
                            <div className="mt-2 w-full">
                                <label className="block">X value</label>
                                <input
                                    type="text"
                                    placeholder='(n value)'
                                    className="input input-bordered w-full input-primary mt-2"
                                    value={x}
                                    onChange={(e) => setX(e.target.value)}
                                />
                            </div>
                            <div className="mt-2 w-full">
                                <label className="block">Y value</label>
                                <input
                                    type="text"
                                    placeholder='(n value)'
                                    className="input input-bordered w-full input-primary mt-2"
                                    value={y}
                                    onChange={(e) => setY(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row justify-center w-full gap-4 mt-6">
                            <button className="btn btn-primary  w-1/3" onClick={handleSolve}>
                                Solve
                            </button>

                            <button onClick={getExcercise} className="btn btn-primary w-1/8" >Exercise</button>
                        </div>

                        <div className='mt-4'>
                            <h2 className="text-xl font-semibold">Output</h2>
                            <div className="text-lg">
                                <p>Answer : {output ? output : 'No data'}</p>
                                <p>Coefficients: {coefficients.length > 0 ? coefficients.map((coef, i) => `a${i} = ${coef}`).join(', ') : 'No coefficients'}</p> {/* Show coefficients */}
                            </div>
                        </div>

                        <div className='w-full flex justify-center bg-base-100'>
                            <Plot
                                data={[
                                    {
                                        x: xValues,
                                        y: yValues,
                                        type: 'scatter',
                                        mode: 'lines',
                                        marker: { color: 'black', width: 1 },
                                        name: 'Regression Line'
                                    },
                                    {
                                        x: x.replace(/\s+/g, '').split(',').map(Number),
                                        y: y.replace(/\s+/g, '').split(',').map(Number),
                                        type: 'scatter',
                                        mode: 'markers',
                                        marker: { color: 'red', size: 5 },
                                        name: 'Data Points'
                                    },
                                ]}
                                layout={{
                                    width: '100%',
                                    height: 400,
                                    title: 'Least Squares Regression Line',
                                    paper_bgcolor: '#ffefcc',
                                    plot_bgcolor: '#ffefcc',
                                    xaxis: {
                                        title: 'X',
                                        titlefont: { size: 18 },
                                    },
                                    yaxis: {
                                        title: 'Y',
                                        titlefont: { size: 18 },
                                    },
                                    margin: { l: 40, r: 40, t: 40, b: 40 },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Least;
