import React, { useState,useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import * as math from 'mathjs';
import axios from 'axios';

function Trapezoidal() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [x0, setX0] = useState(''); // Lower limit (a)
    const [x1, setX1] = useState(''); // Upper limit (b)
    const [fx, setFx] = useState(''); 
    const [output, setOutput] = useState(null);
    const [h, setH] = useState(null);
    const [exercise, setExercise] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/get-exercise', {
            params: {
                category: 'trapesimp'
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

        const X1 = randomExercise.exercise.b;
        const X0 = randomExercise.exercise.a;
        const FX = randomExercise.exercise.fx;

        setX0(X0);
        setX1(X1);
        setFx(FX);
    };

    const handleSolve = () => {
        const parsedX0 = parseFloat(x0);
        const parsedX1 = parseFloat(x1);

        let modifiedFunc = fx.replace(/e/g, '2.71828');
        modifiedFunc = modifiedFunc.replace(/\*\*/g, '^');

        console.log("modifiedfx ", modifiedFunc);

        if (isNaN(parsedX0) || isNaN(parsedX1)) {
            alert("Invalid input for lower limit (a) or upper limit (b). Please enter valid numbers.");
            setOutput(null);
            return;
        }

        try {
            const f = math.compile(modifiedFunc);
            const h = parsedX1 - parsedX0;
            setH(h);
            const sum = f.evaluate({ x: parsedX0 }) + f.evaluate({ x: parsedX1 }); //f(x) = f(x0) + f(x1)

            const result = (h / 2) * sum;
            setOutput(result);

        } catch (e) {
            alert("There was an error evaluating the function. Please check your input function.");
            setOutput(null);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />
            <div className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <h1 className="text-3xl font-bold">Trapezoidal rule</h1>
                <p className="text-justify mt-2">
                    The trapezoidal rule is a technique used to approximate the definite integral of a function with 2 subintervals.
                </p>

                <div className="flex flex-col lg:flex-row mt-6 gap-6">
                    <div className='flex flex-col w-full'>
                        <h2 className="text-xl font-semibold">Input</h2>

                        <div className="flex gap-4">
                            <div className="mt-2 w-full">
                                <label className="block">Lower limit (a)</label>
                                <input
                                    type="text"
                                    placeholder='a'
                                    className="input input-bordered w-full input-primary mt-2"
                                    value={x0}
                                    onChange={(e) => setX0(e.target.value)}
                                />
                            </div>
                            <div className="mt-2 w-full">
                                <label className="block">Upper limit (b)</label>
                                <input
                                    type="text"
                                    placeholder='b'
                                    className="input input-bordered w-full input-primary mt-2"
                                    value={x1}
                                    onChange={(e) => setX1(e.target.value)}
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
                                    value={fx}
                                    onChange={(e) => setFx(e.target.value)}
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
                                <p>h : {h !== null ? h : 'No data'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Trapezoidal;
