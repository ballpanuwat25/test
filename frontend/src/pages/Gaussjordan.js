import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
//import Plot from 'react-plotly.js';
import axios from 'axios';

function Gaussjordan() {
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
                category: 'cramer'
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

        console.log("randomExercise --> ", randomExercise);
        console.log("metrixSize --> ", metrixSize);
        console.log("matrixA --> ", matrixA);
        console.log("matrixB --> ", matrixB);

        setMetrixSize(metrixSize);
        setTempMatrixA(matrixA);
        setTempMatrixB(matrixB);
    }

    // useEffect to update arrayA and arrayB once metrixSize is set
    useEffect(() => {
        if (metrixSize !== null && tempMatrixA.length > 0 && tempMatrixB.length > 0) {
            setArrayA(tempMatrixA);
            setArrayB(tempMatrixB);
        }
    }, [metrixSize, tempMatrixA, tempMatrixB]);

    const calculateGaussJordan = () => {
        const rows = arrayA.length;
        const cols = arrayA[0].length;

        // Convert string inputs to numbers for calculations
        const matrixA = arrayA.map(row => row.map(value => parseFloat(value)));
        const matrixB = arrayB.map(value => parseFloat(value));

        // Validate if any input is not a valid number
        if (matrixA.some(row => row.includes(NaN)) || matrixB.includes(NaN)) {
            alert("Please enter valid numbers in the matrices.");
            return;
        }

        // Check for valid matrix dimensions
        if (rows !== cols || matrixA.length !== matrixB.length) {
            alert("Array size does not match matrix dimensions.");
            return;
        }

        // Augment matrix A with vector B (matrixA | matrixB)
        let augmentedMatrix = matrixA.map((row, i) => [...row, matrixB[i]]);

        // Perform Gauss-Jordan elimination
        for (let i = 0; i < rows; i++) {
            // Make the diagonal element 1 by dividing the row by the diagonal element
            let diagonalElement = augmentedMatrix[i][i];
            if (diagonalElement === 0) {
                alert('Cannot proceed, division by zero encountered.');
                return;
            }
            for (let j = 0; j < cols + 1; j++) {
                augmentedMatrix[i][j] /= diagonalElement;
            }

            // Make all elements in the current column, except the pivot, zero
            for (let k = 0; k < rows; k++) {
                if (k !== i) {
                    let factor = augmentedMatrix[k][i];
                    for (let j = 0; j < cols + 1; j++) {
                        augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
                    }
                }
            }
        }

        // Extract the solution vector from the last column of the augmented matrix
        const solution = augmentedMatrix.map(row => row[cols]);

        // Update the result state
        setResult(solution);
    };


    const increaseMetrixSize = () => {
        if (metrixSize < 5) {
            const newSize = metrixSize + 1;
            setMetrixSize(newSize);
        }
    };

    const decreaseMetrixSize = () => {
        if (metrixSize > 2) {
            const newSize = metrixSize - 1;
            setMetrixSize(newSize);
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
                    <h1 className="text-3xl font-bold">Gauss-Jordan elimination</h1>
                    <p className="text-justify mt-2">
                        Gauss-Jordan elimination is an algorithm used to solve systems of linear equations. It is an extension of the Gaussian elimination algorithm, and it reduces a matrix to its reduced row-echelon form. The reduced row-echelon form of a matrix is a matrix where the leading coefficient of each row is 1, and the leading coefficient is the only non-zero entry in its column. The Gauss-Jordan elimination algorithm is used to find the inverse of a matrix, to solve systems of linear equations, and to find the rank of a matrix.
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
                                <div className="flex gap-2 justify-center">
                                    <button onClick={increaseMetrixSize} className="btn btn-ghost btn-sm">+</button>
                                    <button onClick={decreaseMetrixSize} className="btn btn-ghost btn-sm">-</button>
                                </div>
                            </div>

                            <div className="flex flex-row justify-center w-full gap-4">
                                <button className="btn btn-primary w-1/3" onClick={calculateGaussJordan}>Solve</button>
                                <button onClick={getExcercise} className="btn btn-primary w-1/8" >Exercise</button>
                            </div>

                            <div className="flex flex-col gap-4 mt-4">
                                <h2 className="text-xl font-semibold">Output</h2>
                                <div className="flex justify-center gap-4">
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

export default Gaussjordan;
