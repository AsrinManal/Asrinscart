import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../slices/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.user);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">Login</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={submitHandler} className="w-50 mx-auto">
        <div className="form-group my-3">
          <input type="email" placeholder="Email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group my-3">
          <input type="password" placeholder="Password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>Login</button>
      </form>
    </div>
  );
};

export default Login;
