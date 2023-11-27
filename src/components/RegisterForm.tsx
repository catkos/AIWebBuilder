import { useState } from "react";
import { useUsers } from "../hooks/UserApiHooks";
import { useNotification } from "../contexts/NotificationContext";
import Loader from "./Loader";

const RegisterForm: React.FC = () => {
  const { setNotification } = useNotification();
  const { registerUser, loading } = useUsers();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (password !== confirmPassword) {
        setNotification("error", "Passwords do not match!");
        return;
      } else {
        registerUser(username, password);
      }
    } catch (error) {
      console.log("error in handleRegister: ", error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form className="space-y-4" onSubmit={handleRegister}>
        <div className="flex flex-col">
          <label htmlFor="username" className="mb-1 font-semibold">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1 font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="confirmPassword" className="mb-1 font-semibold">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300"
        >
          Register
        </button>
      </form>
      {loading && <Loader />}
    </div>
  );
};

export default RegisterForm;
