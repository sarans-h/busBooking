import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import rb from '../../assets/1119840-200.png';
import busImage from '../../assets/ben-garratt-0IDGYSVn27U-unsplash.jpg';
import { loginUser, registerUser } from '../../slices/userSlice.js';
import { Toaster } from 'react-hot-toast';
import im from "../../assets/profile.webp"

const Login = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.user);
  
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated, redirect to the specified or home page
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phoneNo: ""
  });
  const [avatar, setAvatar] = useState(im);
  const [avatarPreview, setAvatarPreview] = useState(im);
  const { name, email, password, role, phoneNo } = user;

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const dataChange = (e) => {
    if(e.target.name==="avatar"){
      const reader=new FileReader();
      reader.onload=()=>{
        if(reader.readyState===2){
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0]);
    }
    else 
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("role", role);
    myForm.set("phoneNo", phoneNo);
    myForm.set("avatar", avatar);
    dispatch(registerUser(myForm));
  };

  return (
    <div
      className="min-h-screen pt-9 flex flex-col items-center justify-center bg-cover bg-center relative transition-all duration-500 ease-in-out"
      style={{ backgroundImage: `url(${busImage})` }}
    >
      <div className="absolute inset-0 bg-gray-800 bg-opacity-60"></div>

      <div
        className={`relative  w-11/12 sm:w-2/4 lg:w-1/3 p-8 rounded-lg shadow-xl bg-opacity-80 mt-10 border-1 border-white backdrop-blur-sm transition-all duration-500 ease-in-out ${
          isLogin ? 'bg-[#4444441c]' : 'bg-[#3333331c]'
        }`}
      >
        <div className="flex items-center mb-6 justify-center animate-fadeIn">
          <img src={rb} alt="RideVerse Logo" className="h-16" />
          <h1 className="text-4xl text-white font-bold">RideVerse</h1>
        </div>

        <form method="POST" className="space-y-4 animate-fadeIn" onSubmit={isLogin ? loginSubmit : registerSubmit} encType="multipart/form-data">
          
          {/* Grid Layout for Registration */}
          {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-[#4444441c] text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                value={name}
                onChange={dataChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={dataChange}
                className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-[#4444441c] text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={dataChange}
                className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-[#4444441c] text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />

              <input
                type="number"
                name="phoneNo"
                placeholder="Phone No."
                className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-[#4444441c] text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                value={phoneNo}
                onChange={dataChange}
                required
              />

              <select
                placeholder="Select Role"
                value={role}
                name="role"
                required
                onChange={dataChange}
                className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-[#4444441c] text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="" disabled selected className="bg-black text-white">
                  Select Role
                </option>
                <option value="user" className="bg-black text-white">
                  Regular User
                </option>
                <option value="travel" className="bg-black text-white">
                  Travel
                </option>
                <option value="admin" className="bg-black text-white">
                  Admin
                </option>
              </select>

              <div className="relative">
                <input
                  type="file"
                  id="file-input"
                  className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-[#4444441c] text-white"
                  accept="image/*"
                  name="avatar"
                  onChange={dataChange}
                />
                <label
                  htmlFor="file-input"
                  className="absolute right-4 top-4 bg-yellow-100 border border-yellow-400 rounded-full p-1 cursor-pointer"
                >
                  <img alt="Preview" src={avatarPreview} className="w-8 h-8 rounded-full object-cover" />
                </label>
              </div>
            </div>
          )}

          {/* Normal Layout for Login */}
          {isLogin && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={dataChange}
                className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-[#4444441c] text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={dataChange}
                className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-[#4444441c] text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
          </button>

          {error && (
            <p className="text-red-500 text-center mt-2">{error}</p>
          )}
        </form>

        {isLogin && (
          <p className="mt-4 text-yellow-300 hover:underline text-center">
            <Link to="/password/forgot">Forgot Password?</Link>
          </p>
        )}
        <p
          onClick={toggleMode}
          className="mt-4 text-yellow-300 cursor-pointer hover:underline text-center"
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
        </p>
      </div>
      <Toaster containerStyle={{ bottom: 0 }} toastOptions={{
    success: {
      style: {
        background: 'green',
      },
    }}}/>
    </div>
  );
};

export default Login;
