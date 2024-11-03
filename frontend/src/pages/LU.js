import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
//import Plot from 'react-plotly.js';
import axios from 'axios';

function LU() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [metrixSize, setMetrixSize] = useState(3);
    const [arrayA, setArrayA] = useState([]);
    const [arrayB, setArrayB] = useState([]);
    const [tempMatrixA, setTempMatrixA] = useState([]);
    const [tempMatrixB, setTempMatrixB] = useState([]);
    const [result, setResult] = useState([]);
    //const [plotData, setPlotData] = useState([]);
    const [exercise, setExercise] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/get-exercise`, {
            params: {
                category: 'conjugate'
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

        setMetrixSize(metrixSize);
        setTempMatrixA(matrixA);
        setTempMatrixB(matrixB);
    }

    useEffect(() => {
        if (metrixSize !== null && tempMatrixA.length > 0 && tempMatrixB.length > 0) {
            setArrayA(tempMatrixA);
            setArrayB(tempMatrixB);
        }
    }, [metrixSize, tempMatrixA, tempMatrixB]);

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

        console.log("newArrayB --> ", newArrayB);
        setArrayB(newArrayB);
    };

    const LUdecomposition = () => {
        const A = arrayA.map(row => row.map(val => parseFloat(val)));
        const B = arrayB.map(val => parseFloat(val));
        const n = A.length;

        if (A.some(row => row.some(val => isNaN(val))) || B.some(val => isNaN(val))) {
            alert("Invalid input. Please enter valid numbers.");
            return;
        }

        const L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? 1 : 0));
        const U = Array.from({ length: n }, () => Array.from({ length: n }, () => 0));
        const X = Array.from({ length: n }, () => 0);

        for (let i = 0; i < n; i++) {
            for (let j = i; j < n; j++) {
                let sum = 0;
                for (let k = 0; k < i; k++) {
                    sum += L[i][k] * U[k][j];
                }
                U[i][j] = A[i][j] - sum;
            }

            for (let j = i; j < n; j++) {
                if (i === j) {
                    L[i][i] = 1;
                } else {
                    let sum = 0;
                    for (let k = 0; k < i; k++) {
                        sum += L[j][k] * U[k][i];
                    }
                    L[j][i] = (A[j][i] - sum) / U[i][i];
                }
            }
        }

        const Y = Array.from({ length: n }, () => 0);

        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < i; j++) {
                sum += L[i][j] * Y[j];
            }
            Y[i] = (B[i] - sum) / L[i][i];
        }

        for (let i = n - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = n - 1; j > i; j--) {
                sum += U[i][j] * X[j];
            }
            X[i] = (Y[i] - sum) / U[i][i];
        }

        setResult(X);

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
                    <h1 className="text-3xl font-bold">LU decomposition</h1>
                    <p className="text-justify mt-2">
                        LU decomposition is a method to factorize a matrix into a lower triangular matrix and an upper triangular matrix. It is used to solve systems of linear equations, such as Ax = b, where A is a square matrix and x, b are vectors.
                    </p>
                    <div className="flex flex-col lg:flex-row mt-6 gap-6">
                        <div className="flex flex-col w-full">
                            <h2 className="text-xl font-semibold">Input</h2>
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
                            <div className="my-4">
                                <div className="flex gap-2 flex flex-row justify-center">
                                    <button onClick={increaseMetrixSize} className="btn btn-ghost btn-sm">+</button>
                                    <button onClick={decreaseMetrixSize} className="btn btn-ghost btn-sm">-</button>
                                </div>
                            </div>
                            <div className='flex flex-row justify-center w-full gap-4'>
                                <button className="btn btn-primary w-1/3" onClick={LUdecomposition}>Solve</button>
                                <button onClick={getExcercise} className="btn btn-primary w-1/8" >Exercise</button>
                            </div>
                            <div className="flex flex-col gap-4 mt-4">
                                <h2 className="text-xl font-semibold">Output</h2>
                                <div className="flex flex-row justify-center gap-4">
                                    {result.length === 0 ? (
                                        Array.from({ length: metrixSize }).map((_, i) => (
                                            <div key={i} className="mt-2">
                                                <label className="block">x{i + 1}</label>
                                                <input type="text" readOnly className="input input-bordered w-20 input-primary mt-2" />
                                            </div>
                                        ))
                                    ) : (
                                        result.map((res, index) => (
                                            <div key={index} className="mt-2">
                                                <label className="block">x{index + 1}</label>
                                                <input type="text" value={res} readOnly className="input input-bordered w-20 input-primary mt-2" />
                                            </div>
                                        ))
                                    )}
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
        </div>
    );
}

export default LU;