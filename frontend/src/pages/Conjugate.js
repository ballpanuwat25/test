import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import * as math from 'mathjs';
import Plot from 'react-plotly.js';
import axios from 'axios';

function Conjugate() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [metrixSize, setMetrixSize] = useState(3);
    const [arrayA, setArrayA] = useState(Array(metrixSize).fill().map(() => Array(metrixSize).fill('')));
    const [arrayB, setArrayB] = useState(Array(metrixSize).fill(''));
    const [result, setResult] = useState([]);
    const [plotData, setPlotData] = useState([]);
    const [x, setX] = useState(Array(metrixSize).fill(''));  // Initial guess
    const [outputData, setOutputData] = useState({ iteration: [], xM: [], error: [] });
    const [tempMatrixA, setTempMatrixA] = useState([]);
    const [tempMatrixB, setTempMatrixB] = useState([]);
    const [tempX, setTempX] = useState([]);
    const [exercise, setExercise] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/get-exercise`, {
            params: {
                category: 'conjugate'
            }
        }).then(response => {
            console.log("res -> ",response);
            setExercise(response.data);
        }).catch(error => {
            console.error('There was an error!', error);
        });
    }, []);

    useEffect(() => {
        if(arrayA.length > 0 && arrayB.length > 0 && x.length > 0){
            setTempMatrixA(arrayA);
            setTempMatrixB(arrayB);
            setTempX(x);
        } else {
            setTempMatrixA(Array(metrixSize).fill().map(() => Array(metrixSize).fill('')));
            setTempMatrixB(Array(metrixSize).fill(''));
            setTempX(Array(metrixSize).fill(''));
        }
    }, [metrixSize]);

    useEffect(() => {
        updatePlotData();
    }, [result]);

    const getExcercise = async () => {
        if (exercise.length === 0) {
            alert("No exercise data");
            return;
        }

        const randomIndex = Math.floor(Math.random() * exercise.length);
        const randomExercise = exercise[randomIndex];

        const metrixSize = randomExercise.exercise.metrix_size;
        const matrixA = randomExercise.exercise.array_a;
        const matrixB = randomExercise.exercise.array_b;
        const x = randomExercise.exercise.initial_guess;

        setMetrixSize(metrixSize);
        setArrayA(matrixA);
        setArrayB(matrixB);
        setX(x);
    }

    useEffect(() => {
        if (metrixSize !== null && tempMatrixA.length > 0 && tempMatrixB.length > 0 && tempX.length > 0) {
            setArrayA(tempMatrixA);
            setArrayB(tempMatrixB);
            setX(tempX);
        }
    }, [metrixSize, tempMatrixA, tempMatrixB, tempX]);

    const calculateConjugate = () => {
        const rows = arrayA.length;
        const cols = arrayA[0].length;

        // Convert inputs to numbers
        const matrixA = arrayA.map(row => row.map(value => parseFloat(value)));
        const matrixB = arrayB.map(value => parseFloat(value));
        let initialX = x.map(value => parseFloat(value));

        // Check for NaN values
        if (matrixA.some(row => row.some(value => isNaN(value))) || matrixB.some(value => isNaN(value)) || initialX.some(value => isNaN(value))) {
            alert("Please enter valid numbers in the matrices.");
            return;
        }

        // Check matrix dimensions
        if (rows !== cols || matrixA.length !== matrixB.length) {
            alert("Matrix dimensions and vector size do not match.");
            return;
        }

        // Check if matrixA is symmetric
        const isSymmetric = matrixA.every((row, i) => row.every((value, j) => value === matrixA[j][i]));
        if (!isSymmetric) {
            alert("Matrix A must be symmetric for the conjugate gradient method.");
            return;
        }

        let r = math.subtract(matrixB, math.multiply(matrixA, initialX));
        let p = [...r];  // Initial search direction
        let rsOld = math.dot(r, r);
        const tolerance = 1e-6;
        const maxIterations = 1000;
        let newOutputData = { iteration: [], xM: [], error: [] };

        for (let i = 0; i < maxIterations; i++) {
            const Ap = math.multiply(matrixA, p);
            const alpha = rsOld / math.dot(p, Ap);
            initialX = math.add(initialX, math.multiply(alpha, p));
            r = math.subtract(r, math.multiply(alpha, Ap));

            const rsNew = math.dot(r, r);
            const error = Math.sqrt(rsNew);

            newOutputData.iteration.push(i + 1);  // Store the iteration number
            newOutputData.xM.push([...initialX]); // Store the current x values
            newOutputData.error.push(error);      // Store the current error

            if (error < tolerance) {
                break;
            }

            const beta = rsNew / rsOld;
            p = math.add(r, math.multiply(beta, p));
            rsOld = rsNew;
        }

        setResult(initialX);
        setOutputData(newOutputData);
        updatePlotData();
    };

    const handleArrayAChange = (e, i, j) => {
        const value = e.target.value;
        const newArrayA = [...arrayA];
        newArrayA[i][j] = value;
        setArrayA(newArrayA);
    };

    const handleArrayBChange = (e, i) => {
        const value = e.target.value;
        const newArrayB = [...arrayB];
        newArrayB[i] = value;
        setArrayB(newArrayB);
    };

    const handleArrayXChange = (e, i) => {
        const value = e.target.value;
        const newX = [...x];
        newX[i] = value;
        setX(newX);
    };

    const increaseMetrixSize = () => {
        if (metrixSize < 5) {
            setMetrixSize(metrixSize + 1);
        }
    };

    const decreaseMetrixSize = () => {
        if (metrixSize > 2) {
            setMetrixSize(metrixSize - 1);
        }
    };

    const updatePlotData = () => {
        const n = arrayA.length; // ขนาดของเมทริกซ์ A
        const xValues = Array.from({ length: 100 }, (_, i) => i / 10 - 5); // -5 ถึง 5
        const yValues = Array.from({ length: 100 }, (_, i) => i / 10 - 5);
        const zValues = [];
    
        for (let x of xValues) {
            const zRow = [];
            for (let y of yValues) {
                const vector = Array(n).fill(0).map((_, idx) => (idx === 0 ? x : idx === 1 ? y : 0));
                if (vector.length === n) {
                    const z = 0.5 * math.dot(math.multiply(vector, arrayA), vector) - math.dot(arrayB, vector);
                    zRow.push(z);
                } else {
                    zRow.push(null);
                }
            }
            zValues.push(zRow);
        }
    
        // พล็อตจุดคำตอบ
        const answerPoint = {
            x: [result[0]],  // x-coordinates ของจุดคำตอบ
            y: [result[1]],  // y-coordinates ของจุดคำตอบ
            mode: 'markers',
            type: 'scatter',
            marker: { color: 'red', size: 10 },
            name: 'Solution'
        };
    
        setPlotData([
            {
                x: xValues,
                y: yValues,
                z: zValues,
                type: 'contour',
                colorscale: 'Viridis',
                colorbar: { title: 'Z Value' },
            },
            answerPoint // เพิ่มจุดคำตอบเข้าไปใน plotData
        ]);
    }; 

    return (
        <div className="flex min-h-screen">
            <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />
            <div className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <div className="flex-1 p-6">
                    <h1 className="text-3xl font-bold">Conjugate-gradient method</h1>
                    <p className="text-justify mt-2">
                        The conjugate gradient method is an algorithm for the numerical solution of particular systems of linear equations, namely those whose matrix is symmetric and positive-definite. The conjugate gradient method is often implemented as an iterative algorithm, applicable to sparse systems that are too large to be handled by a direct implementation or other direct methods such as the Cholesky decomposition.
                    </p>

                    <div className="flex flex-col lg:flex-row mt-6 gap-6">
                        <div className="flex flex-col w-full">
                            <h2 className="text-xl font-semibold">Input</h2>

                            <div className="">
                                <div className="mt-2 flex flex-row gap-4 justify-center">
                                    <div>
                                        <label className="block">Matrix A</label>
                                        {arrayA.map((_, i) => (
                                            <div key={i} className="flex gap-1">
                                                {arrayA[i].map((_, j) => (
                                                    <input
                                                        key={j}
                                                        type="text"
                                                        placeholder={j + 1}
                                                        className="input input-bordered w-12 input-primary mt-2"
                                                        onChange={(e) => handleArrayAChange(e, i, j)}
                                                        value={arrayA[i][j]}
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block">Matrix B</label>
                                        <div className="flex flex-col">
                                            {arrayB.map((_, i) => (
                                                <input
                                                    key={i}
                                                    type="text"
                                                    placeholder={i + 1}
                                                    className="input input-bordered w-12 input-primary mt-2"
                                                    onChange={(e) => handleArrayBChange(e, i)}
                                                    value={arrayB[i]}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                </div>

                                <div className="flex flex-row justify-center gap-4 mt-2">
                                    {x.map((_, i) => (
                                        <div key={i} className="mt-2">
                                            <label className="block">x{i + 1}</label>
                                            <input type="text" className="input input-bordered w-20 input-primary mt-2" onChange={(e) => handleArrayXChange(e, i)} value={x[i]} />
                                        </div>
                                    ))}
                                </div>

                                <div className="my-4">
                                    <div className="flex gap-2 flex flex-row justify-center">
                                        <button onClick={increaseMetrixSize} className="btn btn-ghost btn-sm">+</button>
                                        <button onClick={decreaseMetrixSize} className="btn btn-ghost btn-sm">-</button>
                                    </div>
                                </div>

                                <div className='flex flex-row justify-center w-full gap-4'>
                                    <button className="btn btn-primary w-1/3" onClick={calculateConjugate}>Solve</button>
                                    <button onClick={getExcercise} className="btn btn-primary w-1/8" >Exercise</button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 mt-4">
                                <h2 className="text-xl font-semibold">Output</h2>
                                <div className="flex flex-row justify-center gap-4">
                                    {result.length === 0 ? (
                                        metrixSize === 3 ? (
                                            <>
                                                <div className="mt-2">
                                                    <label className="block">x1</label>
                                                    <input type="text" readOnly className="input input-bordered w-20 input-primary mt-2" />
                                                </div>

                                                <div className="mt-2">
                                                    <label className="block">x2</label>
                                                    <input type="text" readOnly className="input input-bordered w-20 input-primary mt-2" />
                                                </div>

                                                <div className="mt-2">
                                                    <label className="block">x3</label>
                                                    <input type="text" readOnly className="input input-bordered w-20 input-primary mt-2" />
                                                </div>
                                            </>
                                        ) : (
                                            Array.from({ length: metrixSize }).map((_, i) => (
                                                <div key={i} className="mt-2">
                                                    <label className="block">x{i + 1}</label>
                                                    <input type="text" readOnly className="input input-bordered w-20 input-primary mt-2" />
                                                </div>
                                            ))
                                        )
                                    ) : (
                                        result.map((res, index) => (
                                            <div key={index} className="mt-2">
                                                <label className="block">x{index + 1}</label>
                                                <input type="text" value={res} readOnly className="input input-bordered w-20 input-primary mt-2" />
                                            </div>
                                        ))
                                    )}
                                </div>
                                <h2 className="text-xl font-semibold">Output Table</h2>
                                <div className="h-80 overflow-x-auto rounded mt-2">
                                    <table className="table table-pin-rows rounded">
                                        <thead>
                                            <tr>
                                                <th className="bg-primary text-primary-content">Iteration</th>
                                                <th className="bg-primary text-primary-content">X Value</th>
                                                <th className="bg-primary text-primary-content">Error</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {outputData.iteration.length > 0 ? (
                                                outputData.iteration.slice(0, 100).map((iteration, index) => (
                                                    <tr key={index}>
                                                        <td>{iteration}</td>
                                                        <td>{outputData.xM[index].join(', ')}</td>
                                                        <td>{outputData.error[index]}</td>
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
                <div className='w-full flex justify-center bg-base-100'>
                    <Plot
                        data={plotData}
                        layout={{
                            width: '100%',
                            height: 400,
                            paper_bgcolor: '#ffefcc',
                            plot_bgcolor: '#ffefcc',
                            title: 'Contour Plot',
                            xaxis: { title: 'X values' },
                            yaxis: { title: 'Y values' },
                            margin: { l: 40, r: 40, t: 40, b: 40 },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Conjugate;