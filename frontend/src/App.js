import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//roots equation
import Graphical from './pages/Graphical';
import Bisection from './pages/Bisection';
import FalsePosition from './pages/FalsePosition';
import Onepoint from './pages/Onepoint';
import Newton from './pages/Newton';
import Secant from './pages/Secant';

//linear algebraic
import Cramer from './pages/Cramer';
import Gauss from './pages/Gauss';
import Gaussjordan from './pages/Gaussjordan';
import MatrixInversion from './pages/MatrixInversion';
import LU from './pages/LU';
import Cholesky from './pages/Cholesky';
import Jacobi from './pages/Jacobi';
import GaussSeidel from './pages/GaussSeidel';
import Conjugate from './pages/Conjugate';

//interpolation
import Newtondivide from './pages/Newtondivide';
import Lagrange from './pages/Lagrange';
import Spline from './pages/Spline';

//extrapolation
import Least from './pages/Least';
import Multiple from './pages/Multiple';

//integral
import Trapezoidal from './pages/Trapezoidal';
import CompositTrape from './pages/CompositTrape';
import Simpson from './pages/Simpson';
import CompositSimpson from './pages/CompositSimpson';

//diff
import Firstdividediff from './pages/Firstdividediff';
import Higher from './pages/Higher';
import MoreAcc from './pages/MoreAcc';

function App() {
  return (
    <div data-theme="cream">
      <Router>
          <Routes>
            {/* roots equation */}
            <Route path="/" element={<Graphical />} />
            <Route path="/Bisection" element={<Bisection />} />
            <Route path="/FalsePosition" element={<FalsePosition />} />
            <Route path="/Onepoint" element={<Onepoint />} />
            <Route path="/Newton" element={<Newton />} />
            <Route path="/Secant" element={<Secant />} />

            {/* linear algebraic */}
            <Route path="/Cramer" element={<Cramer />} />
            <Route path="/Gauss" element={<Gauss />} />
            <Route path="/Gaussjordan" element={<Gaussjordan />} />
            <Route path="/MatrixInversion" element={<MatrixInversion />} />
            <Route path="/LU" element={<LU />} />
            <Route path="/Cholesky" element={<Cholesky />} />
            <Route path="/Jacobi" element={<Jacobi />} />
            <Route path="/GaussSeidel" element={<GaussSeidel />} />
            <Route path="/Conjugate" element={<Conjugate />} />

            {/* interpolation */}
            <Route path="/Newtondivide" element={<Newtondivide />} />
            <Route path="/Lagrange" element={<Lagrange />} />
            <Route path="/Spline" element={<Spline />} />

            {/* extrapolation */}
            <Route path="/Least" element={<Least />} />
            <Route path="/Multiple" element={<Multiple />} />

            {/* integral */}
            <Route path="/Trapezoidal" element={<Trapezoidal />} />
            <Route path="/CompositTrape" element={<CompositTrape />} />
            <Route path="/Simpson" element={<Simpson />} />
            <Route path="/CompositSimpson" element={<CompositSimpson />} />

            {/* diff */}
            <Route path="/Firstdividediff" element={<Firstdividediff />} />
            <Route path="/Higher" element={<Higher />} />
            <Route path="/MoreAcc" element={<MoreAcc />} />

          </Routes>
      </Router>
    </div>
  );
}

export default App;
