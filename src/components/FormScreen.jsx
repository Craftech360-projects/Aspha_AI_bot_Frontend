
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FormScreen() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', formData);
      //document.activeElement.blur(); // Close keyboard on submit
      navigate('/buttons');
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-start"
      style={{
        backgroundImage: "url('/images/background1.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-1/2 ml-20 justify-center">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="relative w-full p-[2px] rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
            <input
              type="text"
              placeholder="Enter your name"
              required
              onFocus={(e) => e.target.setAttribute('inputmode', 'text')}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-8 text-4xl border-none rounded-lg bg-[#001f3f] text-white placeholder-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="relative w-full p-[2px] mt-5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
            <input
              type="email"
              placeholder="Enter your email"
              required
              onFocus={(e) => e.target.setAttribute('inputmode', 'email')}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-8 text-4xl border-none rounded-lg bg-[#001f3f] text-white placeholder-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="w-full flex flex-row mt-5 justify-center items-center">
            <button
              type="submit"
              className="w-[187px] h-[187px] text-white rounded-lg transition duration-200 hover:opacity-80"
              style={{
                backgroundImage: "url('/images/Startbutton.png')",
                backgroundSize: "100% 100%", // Ensures the image fills the button
                backgroundRepeat: "no-repeat",
                backgroundPosition: "covert",
              }}
            >
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
