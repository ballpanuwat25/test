import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
//import Plot from 'react-plotly.js';
import axios from 'axios';

function Jacobi() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [metrixSize, setMetrixSize] = useState(3);
    const [arrayA, setArrayA] = useState([]);
    const [arrayB, setArrayB] = useState([]);
    const [result, setResult] = useState([]);
    const [x, setX] = useState([]);  // Initial guess
    const tolerance = 1e-6;
    const maxIterations = 1000;
    const [outputData, setOutputData] = useState({ iteration: [], xM: [], error: [] });
    //const [plotData, setPlotData] = useState([]);
    const [tempMatrixA, setTempMatrixA] = useState([]);
    const [tempMatrixB, setTempMatrixB] = useState([]);
    const [tempX, setTempX] = useState([]);
    const [exercise, setExercise] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/get-exercise`, {
            params: {
                category: 'jacobigauss'
            }
        }).then(response => {
            console.log(response);
            setExercise(response.data);
        }).catch(error => {
        console.error('There was an error!', error);
        });
    }, []);

    useEffect(() => {
        setArrayA(Array(metrixSize).fill().map(() => Array(metrixSize).fill('')));
        setArrayB(Array(metrixSize).fill(''));
        setX(Array(metrixSize).fill(''));
    }, [metrixSize]);

    // useEffect(() => {
    //     updatePlotData();
    // }, [result]);

    const getExcercise = async () => {
        console.log("Exercise --> ", exercise);
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
        setTempMatrixA(matrixA);
        setTempMatrixB(matrixB);
        setTempX(x);
    }

    useEffect(() => {
        console.log("tempX --> ", tempX);
        if (metrixSize !== null && tempMatrixA.length > 0 && tempMatrixB.length > 0 && tempX.length > 0) {
            setArrayA(tempMatrixA);
            setArrayB(tempMatrixB);
            setX(tempX);
        }
    }, [metrixSize, tempMatrixA, tempMatrixB, tempX]);

    const calculateJacobi = () => {
        const rows = arrayA.length;
        const cols = arrayA[0].length;

        if (arrayA.length !== arrayB.length || arrayA.some(row => row.length !== cols)) {
            alert("Array size does not match matrix dimensions");
            return;
        }

        const matrixA = arrayA.map(row => row.map(Number));
        const matrixB = arrayB.map(Number);

        let iteration = 0;
        let xNew = [...x];

        let newOutputData = { iteration: [], xM: [], error: [] };
        let error = Number.MAX_VALUE;

        while (iteration < maxIterations && error > tolerance) {
            const previousX = [...xNew];

            for (let i = 0; i < rows; i++) {
                let sum = 0;
                for (let j = 0; j < cols; j++) {
                    if (j !== i) {
                        sum += matrixA[i][j] * previousX[j];
                    }
                }
                xNew[i] = (matrixB[i] - sum) / matrixA[i][i];
            }

            error = Math.max(...xNew.map((value, index) => Math.abs(value - previousX[index])));

            newOutputData.iteration.push(iteration + 1);
            newOutputData.xM.push([...xNew]);
            newOutputData.error.push(error);

            iteration++;
        }

        setResult(xNew);
        setOutputData(newOutputData);
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

    // const updatePlotData = () => {
    //     if (result.length >= metrixSize) {
    //         const xValues = Array.from({ length: 100 }, (_, i) => i - 50);
    //         const plotData = [];
    //         console.log("metrixSize --> ", metrixSize);
        
    //         for (let i = 0; i < metrixSize; i++) {
    //             const yValues = xValues.map(x => (arrayA[i][0] * x + arrayB[i]) / arrayA[i][1]);
        
    //             plotData.push({
    //                 x: xValues,
    //                 y: yValues,
    //                 type: 'scatter',
    //                 mode: 'lines',
    //                 name: `Equation ${i + 1}`,
    //             });
    //         }
        
    //         setPlotData(plotData);
    //     }
        
    // };

    return (
        <div className="flex min-h-screen">
            <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />
            <div className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <div className="flex-1 p-6">
                    <h1 className="text-3xl font-bold">Jacobi iteration</h1>
                    <p className="text-justify mt-2">
                        Jacobi iteration is an iterative method used to solve a system of linear equations. It is based on the idea of splitting the matrix A into a lower triangular matrix L, a diagonal matrix D, and an upper triangular matrix U. The method is iterative, and it requires an initial guess for the solution. The method is guaranteed to converge if the matrix A is diagonally dominant.
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
                                    <button className="btn btn-primary w-1/3" onClick={calculateJacobi}>Solve</button>
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
                {/* <div className='w-full flex justify-center bg-base-100'>
                    <Plot
                        data={plotData}
                        layout={{
                            width: '100%',
                            height: 400,
                            title: 'Graph of the equations',
                            paper_bgcolor: '#ffefcc',
                            plot_bgcolor: '#ffefcc',
                            xaxis: {
                                range: [-50, 50],
                                title: 'X values',
                            },
                            yaxis: {
                                range: [-100, 100],
                                title: 'Y values',
                            },
                            margin: {
                                l: 40,
                                r: 40,
                                t: 40,
                                b: 40,
                            },
                        }}
                    />
                </div> */}
            </div>
        </div>
    );
}

export default Jacobi;