import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Plot from 'react-plotly.js';
import axios from 'axios';

function Newtondivide() {
    const [n, setN] = useState('');
    const [x, setX] = useState('');
    const [y, setY] = useState('');
    const [mode, setMode] = useState('');
    const [xValue, setXValue] = useState('');
    const [c, setC] = useState([]);
    const [output, setOutput] = useState(null);
    const [graphData, setGraphData] = useState({ x: [], y: [] });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [exercise, setExercise] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [xValueNumber, setXValueNumber] = useState(null);
    const [xRange, setXRange] = useState([]);
    const [yRange, setYRange] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/get-exercise`, {
            params: {
                category: 'interpolation'
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
        setN(randomExercise.exercise.n);
        setX(randomExercise.exercise.x);
        setY(randomExercise.exercise.y);
        setMode(randomExercise.exercise.type);
        setXValue(randomExercise.exercise.x_value);
    };

    const handleSelect = (value) => {
        setMode(value);
        setDropdownOpen(false);  // Close the dropdown after selection
    };

    const handleSolve = () => {
        if (n === '' || x === '' || y === '' || xValue === '' || mode === '') {
            alert("Please fill all input fields.");
            return;
        }

        if (typeof x !== 'string' || typeof y !== 'string') {
            alert("Invalid input format. Please enter comma-separated values for x and y.");
            return;
        }

        const xValueNumberParsed = Number(xValue);
        setXValueNumber(xValueNumberParsed);

        const xArray = x.split(',').map(Number);
        const yArray = y.split(',').map(Number);
        const xValueNumber = Number(xValue);

        if (n != xArray.length || n != yArray.length) {
            alert("Invalid number of x or y values.");
            return;
        }

        let selectedX = [];
        let selectedY = [];

        if (mode === 'linear') {
            selectedX = xArray.slice(0, 2);
            selectedY = yArray.slice(0, 2);
        } else if (mode === 'quadratic') {
            selectedX = xArray.slice(0, 3);
            selectedY = yArray.slice(0, 3);
        } else if (mode === 'polynomial') {
            selectedX = xArray;
            selectedY = yArray;
        } else {
            alert("Invalid mode selected.");
            return;
        }

        const coefficients = calculateDividedDifferences(selectedX, selectedY);
        setC(coefficients);

        const result = evaluateNewtonPolynomial(coefficients, selectedX, xValueNumber);
        setOutput(result);

        console.log("x", xArray)
        console.log("y", yArray)

        //หาค่าที่น้อยสุดและมากสุดของ xArray
        let x_min = Math.min(...xArray);
        let x_max = Math.max(...xArray);

        setXRange([x_min, x_max]);

        //หา y range จาก array ของ yArray โดยให้มีค่า มีแค่ทศนิยมที่เป็น .5 และ 0
        let y_min = Math.min(...yArray);
        let y_max = Math.max(...yArray);

        y_min = roundToNearest(y_min);
        y_max = roundToNearest(y_max);

        setYRange([y_min, y_max]);

        const graphX = Array.from({ length: 1000 }, (_, i) => i * (x_max / 1000));
        const graphY = graphX.map(val => evaluateNewtonPolynomial(coefficients, selectedX, val));

        setGraphData({ x: graphX, y: graphY });
    };

    const calculateDividedDifferences = (xArray, yArray) => {
        const n = xArray.length;
        const arrayC = Array.from({ length: n }, () => Array(n).fill(0));

        for (let i = 0; i < n; i++) {
            arrayC[i][0] = yArray[i];
        }

        for (let j = 1; j < n; j++) {
            for (let i = 0; i < n - j; i++) {
                arrayC[i][j] = (arrayC[i + 1][j - 1] - arrayC[i][j - 1]) / (xArray[i + j] - xArray[i]);
            }
        }

        const coefficients = arrayC[0].slice(0, n);
        return coefficients;
    };

    const evaluateNewtonPolynomial = (coefficients, xArray, xValue) => {
        let result = coefficients[0];
        let product = 1;

        for (let i = 1; i < coefficients.length; i++) {
            product *= (xValue - xArray[i - 1]);
            result += coefficients[i] * product;
        }

        return result;
    };

    // ปัดเศษให้เป็นจำนวนเต็ม
    function roundToNearest(value) {
        const integerPart = Math.floor(value);
        const decimalPart = value - integerPart;

        if (decimalPart >= 0.75) {
            return integerPart + 1; // ปัดขึ้นเป็นจำนวนเต็ม
        } else if (decimalPart >= 0.5) {
            return integerPart + 0.5; // ปัดขึ้น0.5
        } else {
            return integerPart; // ปัดลงเป็นจำนวนเต็ม
        }
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />
            <div className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <h1 className="text-3xl font-bold">Newton's divided-differences</h1>
                <p className="text-justify mt-2">
                    Newton's divided-differences interpolation is a method of polynomial interpolation and numerical analysis. Given a set of data points (x0, y0), (x1, y1), ..., (xn, yn), the goal is to find a polynomial that passes through all the points. The polynomial is constructed using a divided-differences table, which is a triangular table of coefficients. The polynomial can then be evaluated at any point x to find the corresponding y value.
                </p>

                <div className="flex flex-col lg:flex-row mt-6 gap-6">
                    <div className='flex flex-col w-full'>
                        <h2 className="text-xl font-semibold">Input</h2>

                        <div className="flex gap-4">
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
                            {/* x value, y value(state x,y) รับเป็นarray อินพุทในช่องเดียว ใส่ลูกน้ำคั่น*/}
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
                        <div className="flex gap-4 w-full">
                            <div className="mt-2 w-full">
                                <label className="block">Select type</label>
                                <div className="relative">
                                    <button
                                        className="btn mt-2 w-full text-left"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                    >
                                        {mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : 'Select type'}
                                    </button>

                                    {dropdownOpen && (
                                        <ul className="menu absolute bg-base-100 rounded-box z-10 w-full p-2 shadow">
                                            <li><button onClick={() => handleSelect('linear')}>Linear</button></li>
                                            <li><button onClick={() => handleSelect('quadratic')}>Quadratic</button></li>
                                            <li><button onClick={() => handleSelect('polynomial')}>Polynomial</button></li>
                                        </ul>
                                    )}
                                </div>
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
                                <p>c : {c.length > 0 ? c.join(', ') : 'No data'}</p>
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
                                line: { color: 'black' },
                            },
                            {
                                x: [xValueNumber],
                                y: [output],
                                type: 'scatter',
                                mode: 'markers',
                                marker: { color: 'red', size: 10 }, // ขนาดและสีของจุดคำตอบ
                            }
                        ]}
                        layout={{
                            width: '100%',
                            height: 400,
                            title: 'Graph of Newton interpolation',
                            paper_bgcolor: '#ffefcc',
                            plot_bgcolor: '#ffefcc',
                            xaxis: {
                                range: xRange,  // หรือปรับเป็นช่วงที่สนใจ
                            },
                            yaxis: {
                                range: yRange,  // ปรับให้ครอบคลุมค่าช่วง y ของคุณ
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
    );
}

export default Newtondivide;