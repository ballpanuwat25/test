import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

function Lagrange() {
    const [n, setN] = useState('');
    const [x, setX] = useState('');
    const [y, setY] = useState('');
    const [mode, setMode] = useState('');
    const [xValue, setXValue] = useState('');
    const [l, setL] = useState([]);
    const [output, setOutput] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [exercise, setExercise] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);

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

        const xArray = x.split(',').map(Number);
        const yArray = y.split(',').map(Number);
        const xValueNumber = Number(xValue);
        const N = Number(n);

        if (n != xArray.length || n != yArray.length) {
            alert("Invalid number of x or y values.");
            return;
        }

        let selectedX = [];
        let selectedY = [];

        if (mode === 'linear') {
            selectedX = [xArray[0], xArray[xArray.length - 1]];
            selectedY = [yArray[0], yArray[yArray.length - 1]];

            console.log("linear select x ",selectedX);
            console.log("linear select y ",selectedY);
        } else if (mode === 'quadratic') {
            var NQ = 0;
            if(N % 2 === 0){
                alert("Invalid number of x or y values.");
                return;
            } else {
                //find middle index
                NQ = (N-1)/2;
            }
            selectedX = [xArray[0], xArray[NQ], xArray[N-1]];
            selectedY = [yArray[0], yArray[NQ], yArray[N-1]];

            console.log("quadratic select x ",selectedX);
            console.log("quadratic select y ",selectedY);
        } else if (mode === 'polynomial') {
            selectedX = xArray;
            selectedY = yArray;

            console.log("polynomial select x ",selectedX);
            console.log("polynomial select y ",selectedY);
        } else {
            alert("Invalid mode selected.");
            return;
        }

        const { result, coefficients } = lagrangeInterpolation(selectedX, selectedY, xValueNumber,mode);
        setOutput(result);
        setL(coefficients);

    };

    const lagrangeInterpolation = (xArray, yArray, xValue,mode) => {
        const n = xArray.length;
        let result = 0;
        const coefficients = Array(n).fill(0);

        for (let i = 0; i < n; i++) {
            let term = yArray[i]; // L(x) = y0 * L0(x) + y1 * L1(x) + ...
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    term *= (xValue - xArray[j]) / (xArray[i] - xArray[j]);
                }
            }
            result += term;
        }

        if(mode == 'linear'){
            coefficients[0] = (xValue - xArray[1]) / (xArray[0] - xArray[1]);
            coefficients[1] = (xValue - xArray[0]) / (xArray[1] - xArray[0]);
        } else if(mode == 'quadratic'){
            coefficients[0] = ((xValue - xArray[1]) * (xValue - xArray[2])) / ((xArray[0] - xArray[1]) * (xArray[0] - xArray[2]));
            coefficients[1] = ((xValue - xArray[0]) * (xValue - xArray[2])) / ((xArray[1] - xArray[0]) * (xArray[1] - xArray[2]));
            coefficients[2] = ((xValue - xArray[0]) * (xValue - xArray[1])) / ((xArray[2] - xArray[0]) * (xArray[2] - xArray[1]));
        } else if (mode === 'polynomial') {
            for (let i = 0; i < n; i++) {
                let term = 1; // กำหนดให้ term เริ่มต้นที่ 1
                for (let j = 0; j < n; j++) {
                    if (j !== i) {
                        term *= (xValue - xArray[j]) / (xArray[i] - xArray[j]);
                    }
                }
                coefficients[i] = term;
            }
        }

        return { result, coefficients };
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />
            <div className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <h1 className="text-3xl font-bold">Lagrange interpolation</h1>
                <p className="text-justify mt-2">
                    Lagrange interpolation is a method of finding a polynomial that passes through a set of points.
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
                                <p>L : {l.length > 0 ? l.join(', ') : 'No data'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lagrange;