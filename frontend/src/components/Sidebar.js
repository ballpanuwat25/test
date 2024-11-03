import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faG, faB, faF, faO, faN, faS, faC, faL, faJ, faT, faM, faH } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom'; // Import NavLink for routing

const Sidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onToggle(newCollapsed); // ส่งสถานะไปยัง App
  };

  return (
    <div className={`h-screen fixed bg-base-200 text-base-content p-2 overflow-y-scroll transition-transform duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 text-center text-2xl font-semibold flex justify-between items-center">
        {!isCollapsed &&
          <div>
            <span className='text-2xl text-left'>Numerical</span>
            <p className='text-2xl text-left'>Method</p>
          </div>
        }
        <button
          onClick={handleToggle}
          className="text-base-content hover:text-base-content focus:outline-none">
          {isCollapsed ? '»' : '«'}
        </button>
      </div>
      <ul className="menu w-full p-0">
        <h1 className={`text-xl text-left p-4 ${isCollapsed ? 'hidden' : 'inline'}`}>Root equations</h1>
        <li>
          <NavLink to="/" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faG} className="mr-2" />
            {!isCollapsed && <span>Graphical Method</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/Bisection" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faB} className="mr-2" />
            {!isCollapsed && <span>Bisection Method</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/FalsePosition" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faF} className="mr-2" />
            {!isCollapsed && <span>False-position Method</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/Onepoint" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faO} className="mr-2" />
            {!isCollapsed && <span>One-point Iteration</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/Newton" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faN} className="mr-2" />
            {!isCollapsed && <span>Newton-raphson Method</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/Secant" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faS} className="mr-2" />
            {!isCollapsed && <span>Secant Method</span>}
          </NavLink>
        </li>
        <h1 className={`text-xl text-left p-4 ${isCollapsed ? 'hidden' : 'inline'}`}>Linear algebraic equations</h1>
        <li>
          <NavLink to="/Cramer" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faC} className="mr-2" />
            {!isCollapsed && <span>Cramer's Rule</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/Gauss" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faG} className="mr-2" />
            {!isCollapsed && <span>Gaussian elimination</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/Gaussjordan" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faG} className="mr-2" />
            {!isCollapsed && <span>Gauss-Jordan elimination</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/MatrixInversion" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faM} className="mr-2" />
            {!isCollapsed && <span>Matrix inversion</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/LU" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faL} className="mr-2" />
            {!isCollapsed && <span>LU decomposition</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/Cholesky" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faC} className="mr-2" />
            {!isCollapsed && <span>Cholesky decomposition</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/Jacobi" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faJ} className="mr-2" />
            {!isCollapsed && <span>Jacobi iteration</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/GaussSeidel" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faG} className="mr-2" />
            {!isCollapsed && <span>Gauss-seidel iteration</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/Conjugate" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faC} className="mr-2" />
            {!isCollapsed && <span>Conjugate gradient method</span>}
          </NavLink>
        </li>
        <h1 className={`text-xl text-left p-4 ${isCollapsed ? 'hidden' : 'inline'}`}>Interpolation</h1>
        <li>
          <NavLink to="/Newtondivide" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faN} className="mr-2" />
            {!isCollapsed && <span>Newton's divided-differences</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/Lagrange" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faL} className="mr-2" />
            {!isCollapsed && <span>Lagrange interpolation</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/Spline" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faS} className="mr-2" />
            {!isCollapsed && <span>Spline interpolation</span>}
          </NavLink>
        </li>
        <h1 className={`text-xl text-left p-4 ${isCollapsed ? 'hidden' : 'inline'}`}>Extrapolation</h1>
        <li>
          <NavLink to="/Least" className={`hover:bg-base-300 flex items-center p-4${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faL} className="mr-2" />
            {!isCollapsed && <span>Least-squares reqression</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/Multiple" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faM} className="mr-2" />
            {!isCollapsed && <span>Multiple linear reqression</span>}
          </NavLink>
        </li>
        <h1 className={`text-xl text-left p-4 ${isCollapsed ? 'hidden' : 'inline'}`}>Integration</h1>
        <li>
          <NavLink to="/Trapezoidal" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faT} className="mr-2" />
            {!isCollapsed && <span>Trapezoidal rule</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/CompositTrape" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faC} className="mr-2" />
            {!isCollapsed && <span>Composit trapezoidal rule</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/Simpson" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faS} className="mr-2" />
            {!isCollapsed && <span>Simpson's rule</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/CompositSimpson" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faC} className="mr-2" />
            {!isCollapsed && <span>Composit Simpson's rule</span>}
          </NavLink>
        </li>
        <h1 className={`text-xl text-left p-4 ${isCollapsed ? 'hidden' : 'inline'}`}>Differentiation</h1>
        <li>
          <NavLink to="/Firstdividediff" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faF} className="mr-2" />
            {!isCollapsed && <span>First divided-difference</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/Higher" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faH} className="mr-2" />
            {!isCollapsed && <span>Higher derivatives</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/MoreAcc" className={`hover:bg-base-300 flex items-center p-4 ${isCollapsed ? 'w-12' : ''}`}>
            <FontAwesomeIcon icon={faM} className="mr-2" />
            {!isCollapsed && <span>More accurate derivatives</span>}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
