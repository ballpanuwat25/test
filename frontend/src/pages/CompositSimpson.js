import React, { useState,useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import * as math from 'mathjs';
import axios from 'axios';

function CompositSimpson() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [a, setA] = useState('');
    const [b, setB] = useState(''); 
    const [fx, setFx] = useState('');
    const [n, setN] = useState(''); 
    const [output, setOutput] = useState(null);
    const [h, setH] = useState(null);
    const [exercise, setExercise] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/get-exercise', {
            params: {
                category: 'composite'
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

        const B = randomExercise.exercise.b;
        const A = randomExercise.exercise.a;
        const FX = randomExercise.exercise.fx;
        const N = randomExercise.exercise.n;

        setA(A);
        setB(B);
        setFx(FX);
        setN(N);
    };

    const handleSolve = () => {
        const parsedA = parseFloat(a);
        const parsedB = parseFloat(b);
        let parsedN = parseInt(n);

        let modifiedFunc = fx.replace(/e/g, '2.71828');
        modifiedFunc = modifiedFunc.replace(/\*\*/g, '^');

        console.log("modifiedfx ", modifiedFunc);

        if (isNaN(parsedA) || isNaN(parsedB) || isNaN(parsedN) || parsedN <= 0) {
            alert("Invalid input for lower limit (a), upper limit (b), or number of subintervals (n). Please enter valid numbers.");
            setOutput(null);
            return;
        }

        try {
            const f = math.compile(modifiedFunc);

            // Check if n is even
            if (parsedN % 2 !== 0) {
                alert("N must be an even number for Simpson's Rule.");
                setOutput(null);
                return;
            }

            // Corrected h calculation
            const h = (parsedB - parsedA) /(2* parsedN);
            setH(h);
            console.log('h', h);

            // Simpson's Rule calculation
            let sum = f.evaluate({ x: parsedA }) + f.evaluate({ x: parsedB });
            console.log('Initial sum', sum);

            // Calculate the intermediate values
            for (let i = 1; i < parsedN; i++) {
                let xi = parsedA + i * h;
                let fxVal = f.evaluate({ x: xi });

                if (i % 2 === 0) {
                    sum += 2 * fxVal;
                    console.log(`Even index ${i}: 2 * f(${xi}) =`, 2 * fxVal);
                } else {
                    sum += 4 * fxVal;
                    console.log(`Odd index ${i}: 4 * f(${xi}) =`, 4 * fxVal);
                }
            }

            // Final result calculation
            const result = (h / 3) * sum;
            setOutput(result);

        } catch (e) {
            console.log(e);
            alert("There was an error evaluating the function. Please check your input function.");
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />
            <div className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <h1 className="text-3xl font-bold">Composite Simpson's rule</h1>
                <p className="text-justify mt-2">
                    The composite Simpson's rule is a technique used to approximate the definite integral of a function.
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
                                    value={a}
                                    onChange={(e) => setA(e.target.value)}
                                />
                            </div>
                            <div className="mt-2 w-full">
                                <label className="block">Upper limit (b)</label>
                                <input
                                    type="text"
                                    placeholder='b'
                                    className="input input-bordered w-full input-primary mt-2"
                                    value={b}
                                    onChange={(e) => setB(e.target.value)}
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
                            <div className="mt-2 w-full">
                                <label className="block">Number of subintervals (n)</label>
                                <input
                                    type="text"
                                    placeholder='n'
                                    className="input input-bordered w-full input-primary mt-2"
                                    value={n}
                                    onChange={(e) => setN(e.target.value)}
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

export default CompositSimpson;
