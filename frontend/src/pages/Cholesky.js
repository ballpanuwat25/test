import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
//import Plot from 'react-plotly.js';
import axios from 'axios';

function Cholesky() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [metrixSize, setMetrixSize] = useState(3);
    const [arrayA, setArrayA] = useState([]);
    const [arrayB, setArrayB] = useState([]);
    const [result, setResult] = useState([]);
    //const [plotData, setPlotData] = useState([]);
    const [tempMatrixA, setTempMatrixA] = useState([]);
    const [tempMatrixB, setTempMatrixB] = useState([]);
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

        console.log("newArrayA --> ", newArrayA);
        setArrayA(newArrayA);
    };

    const handleArrayBChange = (e, i) => {
        const value = e.target.value;
        const newArrayB = [...arrayB];
        newArrayB[i] = value;

        console.log("newArrayB --> ", newArrayB);
        setArrayB(newArrayB);
    };

    const isSymmetric = (arrayA) => {
        const n = arrayA.length;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < i; j++) {
                if (parseFloat(arrayA[i][j]) !== parseFloat(arrayA[j][i])) {
                    return false;
                }
            }
        }
        return true;
    };

    const isPositiveDefinite = (matrix) => {
        const n = matrix.length;
        for (let i = 0; i < n; i++) {
            if (matrix[i][i] <= 0) {
                return false;
            }
        }
        return true;
    };

    const CholeskyDecomposition = () => {
        const A = arrayA.map(row => row.map(val => parseFloat(val)));
        const B = arrayB.map(val => parseFloat(val));
    
        if (!isSymmetric(A)) {
            alert("Matrix A is not symmetric. Please enter a symmetric matrix.");
            return;
        }
    
        const n = A.length;
        const L = Array(n).fill().map(() => Array(n).fill(0)); // Lower triangular matrix
        const Y = Array(n).fill(0); // Y values
        const X = Array(n).fill(0); // X values
    
        for (let i = 0; i < n; i++) {
            for (let j = 0; j <= i; j++) {
                let sum = 0;
                for (let k = 0; k < j; k++) {
                    sum += L[i][k] * L[j][k];
                }
                if (i === j) {
                    L[i][j] = Math.sqrt(A[i][i] - sum);
                    if (isNaN(L[i][j])) {
                        console.error(`NaN encountered at L[${i}][${j}]. A[i][i]: ${A[i][i]}, sum: ${sum}`);
                        alert("Matrix A is not positive definite. Please enter a positive definite matrix.");
                        return;
                    }
                } else {
                    L[i][j] = (A[i][j] - sum) / L[j][j];
                    if (isNaN(L[i][j])) {
                        console.error(`NaN encountered at L[${i}][${j}]. A[i][j]: ${A[i][j]}, sum: ${sum}, L[j][j]: ${L[j][j]}`);
                        alert("Matrix A is not positive definite. Please enter a positive definite matrix.");
                        return;
                    }
                }
            }
        }
    
        if (!isPositiveDefinite(L)) {
            alert("Matrix A is not positive definite. Please enter a positive definite matrix.");
            return;
        }
    
        // Forward substitution to solve LY = B
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < i; j++) {
                sum += L[i][j] * Y[j];
            }
            Y[i] = (B[i] - sum) / L[i][i];
        }
    
        // Backward substitution to solve L^T X = Y
        for (let i = n - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < n; j++) {
                sum += L[j][i] * X[j];
            }
            X[i] = (Y[i] - sum) / L[i][i];
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
                    <h1 className="text-3xl font-bold">Cholesky decomposition</h1>
                    <p className="text-justify mt-2">
                        Cholesky decomposition is a method for solving symmetric positive definite systems of linear equations. It is mainly used in numerical analysis. The Cholesky decomposition is roughly twice as efficient as the LU decomposition for solving systems of linear equations.
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
                                <button className="btn btn-primary w-1/3" onClick={CholeskyDecomposition}>Solve</button>
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

export default Cholesky;
