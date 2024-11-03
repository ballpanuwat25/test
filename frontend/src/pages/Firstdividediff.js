import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import * as math from 'mathjs';

function Firstdividediff() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [fx, setFx] = useState('');
    const [h, setH] = useState('');
    const [x, setX] = useState('');
    const [mode, setMode] = useState('');
    const [output, setOutput] = useState(null);
    const [exercise, setExercise] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/get-exercise`, {
          params: {
            category: 'firstdivided'
          }
        }).then(response => {
            setExercise(response.data);
        }).catch(error => {
            console.error('There was an error!', error);
        });
    }, []);

    const handleSelect = (value) => {
        setMode(value);
        setDropdownOpen(false);
    };

    const getExcercise = async () => {
        if (exercise.length === 0) {
            alert("No exercise data");
            return;
        }
        const randomIndex = Math.floor(Math.random() * exercise.length);
        const randomExercise = exercise[randomIndex];

        const H = randomExercise.exercise.h;
        const X = randomExercise.exercise.x;
        const FX = randomExercise.exercise.fx;
        const MODE = randomExercise.exercise.type;

        setH(H);
        setX(X);
        setFx(FX);
        setMode(MODE);
    };

    const handleSolve = () => {
        const parsedH = parseFloat(h);
        const parsedX = parseFloat(x);

        //in case user input 'e' in the function
        let modifiedFunc = fx.replace(/e/g, '2.71828');
        modifiedFunc = modifiedFunc.replace(/\*\*/g, '^');

        console.log("modifiedfx ", modifiedFunc);

        if (isNaN(parsedH) || isNaN(parsedX)) {
            alert("Please enter a valid number for h and x.");
            return;
        }

        try {
            const f = math.compile(modifiedFunc);
            const h = parsedH;
            const x = parsedX;

            console.log("f ", f);

            if (mode === 'forward') {
                const result = (f.evaluate({ x: x + h }) - f.evaluate({ x: x })) / h;
                setOutput(result);
            } else if (mode === 'backward') {
                const result = (f.evaluate({ x: x }) - f.evaluate({ x: x - h })) / h;
                setOutput(result);
            } else if (mode === 'central') {
                const result = (f.evaluate({ x: x + h }) - f.evaluate({ x: x - h })) / (2 * h);
                setOutput(result);
            }

        } catch (error) {
            console.error('Error details:', error);
            alert("There was an error evaluating the function. Please check your input function.");
            setOutput(null);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />
            <div className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <h1 className="text-3xl font-bold">First divided-differences</h1>
                <p className="text-justify mt-2">
                    In numerical analysis, the divided differences are useful for constructing interpolating polynomials. The first divided differences are defined as follows
                </p>

                <div className="flex flex-col lg:flex-row mt-6 gap-6">
                    <div className='flex flex-col w-full'>
                        <h2 className="text-xl font-semibold">Input</h2>

                        <div className="flex gap-4">
                            <div className="mt-2 w-full">
                                <label className="block">Function</label>
                                <input
                                    type="text"
                                    placeholder='f(x)'
                                    className="input input-bordered w-full input-primary mt-2"
                                    value={fx}
                                    onChange={(e) => setFx(e.target.value)}
                                />
                            </div>
                            <div className="mt-2 w-full">
                                <label className="block">select type</label>
                                <div className="relative">
                                    <button
                                        className="btn mt-2 w-full text-left"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                    >
                                        {mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : 'Select type'}
                                    </button>

                                    {dropdownOpen && (
                                        <ul className="menu absolute bg-base-100 rounded-box z-10 w-full p-2 shadow">
                                            <li><button onClick={() => handleSelect('forward')}>Forward</button></li>
                                            <li><button onClick={() => handleSelect('backward')}>Backward</button></li>
                                            <li><button onClick={() => handleSelect('central')}>Central</button></li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">

                            <div className="mt-2 w-full">
                                <label className="block">x value</label>
                                <input
                                    type="text"
                                    placeholder='x'
                                    className="input input-bordered w-full input-primary mt-2"
                                    value={x}
                                    onChange={(e) => setX(e.target.value)}
                                />
                            </div>
                            <div className="mt-2 w-full">
                                <label className="block">h</label>
                                <input
                                    type="text"
                                    placeholder='h'
                                    className="input input-bordered w-full input-primary mt-2"
                                    value={h}
                                    onChange={(e) => setH(e.target.value)}
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
                                <p>Answer : {output !== null ? output : 'No data'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Firstdividediff;
