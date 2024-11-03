import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

function Spline() {
    const [n, setN] = useState('');
    const [x, setX] = useState('');
    const [y, setY] = useState('');
    const [mode, setMode] = useState('');
    const [xValue, setXValue] = useState('');
    const [m, setM] = useState('');
    const [output, setOutput] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [exercise, setExercise] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/get-exercise`, {
          params: {
            category: 'spline'
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

    const handleSolve = () => {
        if (mode === '' || n === '' || x === '' || y === '' || xValue === '') {
            alert("Please fill all input fields.");
            return;
        }

        const xArray = x.split(',').map(Number);
        const yArray = y.split(',').map(Number);
        const xValueNumber = Number(xValue);
        const N = Number(n);

        if (xArray.length !== N || yArray.length !== N) {
            alert("Number of x and y values must be equal to n.");
            return;
        }

        const mArray = [];
        for (let i = 1; i < xArray.length; i++) {
            const m = (yArray[i] - yArray[i - 1]) / (xArray[i] - xArray[i - 1]);
            mArray.push(m);
        }
        setM(mArray);

        const findIntervalIndex = (xArray, xValue) => {
            for (let i = 0; i < N; i++) {
                if (xValue >= xArray[i] && xValue <= xArray[i + 1]) {
                    return i;
                }
            }
            return;
        };

        let intervalIndex = findIntervalIndex(xArray, xValue);
        if (intervalIndex === -1) {
            alert("xValue is out of bounds.");
            return;
        }

        let result = 0;
        if (mode === 'linear') {
            result = linearInterpolation(xArray, yArray, mArray, intervalIndex, xValue);
        } else if (mode === 'quadratic') {
            result = quadraticInterpolation(xArray, yArray, intervalIndex, xValue);
        } else if (mode === 'cubic') {
            result = cubicInterpolation(xArray, yArray, intervalIndex, xValue);
        }

        setOutput(result);
    };

    const handleSelect = (value) => {
        setMode(value);
        setDropdownOpen(false);  // Close the dropdown after selection
    };

    const linearInterpolation = (xArray, yArray, mArray, intervalIndex, xValue) => {
        const m = mArray[intervalIndex];
        const x0 = xArray[intervalIndex];
        const y0 = yArray[intervalIndex];
        return y0 + m * (xValue - x0);
    };

    const quadraticInterpolation = (x, y, intervalIndex, xValue) => {
        return (
            y[0] * ((xValue - x[1]) * (xValue - x[2])) / ((x[0] - x[1]) * (x[0] - x[2])) +
            y[1] * ((xValue - x[0]) * (xValue - x[2])) / ((x[1] - x[0]) * (x[1] - x[2])) +
            y[2] * ((xValue - x[0]) * (xValue - x[1])) / ((x[2] - x[0]) * (x[2] - x[1]))
        );
    };

    const cubicInterpolation = (x, y, intervalIndex, xValue) => {
        return (
            y[0] * ((xValue - x[1]) * (xValue - x[2]) * (xValue - x[3])) / ((x[0] - x[1]) * (x[0] - x[2]) * (x[0] - x[3])) +
            y[1] * ((xValue - x[0]) * (xValue - x[2]) * (xValue - x[3])) / ((x[1] - x[0]) * (x[1] - x[2]) * (x[1] - x[3])) +
            y[2] * ((xValue - x[0]) * (xValue - x[1]) * (xValue - x[3])) / ((x[2] - x[0]) * (x[2] - x[1]) * (x[2] - x[3])) +
            y[3] * ((xValue - x[0]) * (xValue - x[1]) * (xValue - x[2])) / ((x[3] - x[0]) * (x[3] - x[1]) * (x[3] - x[2]))
        );
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />
            <div className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <h1 className="text-3xl font-bold">Spline interpolation</h1>
                <p className="text-justify mt-2">
                    Spline interpolation is a form of interpolation where the interpolant is a piecewise-defined function called a spline. Spline interpolation is often preferred over polynomial interpolation because it produces a smoother curve that passes through all the given data points. The most common form of spline interpolation is cubic spline interpolation, which uses piecewise cubic polynomials to interpolate the data points.
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
                                            <li><button onClick={() => handleSelect('cubic')}>Cubic</button></li>
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
                                <p>m : {m ? m.join(', ') : 'No data'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Spline;
