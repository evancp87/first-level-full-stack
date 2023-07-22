import { Link } from "react-router-dom";
import {useState} from "react";

const Login = () => {

  const [login, setLogin] = useState("");

  // const inputs = [...inputs, {[e.target.id]: e.target.value}]
    return ( 
<div className="card w-96 bg-base-100 shadow-xl">
  <div className="card-body items-center text-center">
    <h2 className="card-title">Login</h2>
    <form action="">
        <label htmlFor="email">
        <input type="text" name="email" />
        </label>
        <label htmlFor="password">
        <input type="text" name="password"/>
        </label>
        <Link to="register">
      
      <p>Forgot password?</p>
      </Link>
    <div className="card-actions">
      <button className="btn btn-primary">Login</button>
      <Link to="register">
      
      <p>Don't have an account yet?</p>
      </Link>
    </div>
        </form>
  </div>
</div>
     );
}

export default Login