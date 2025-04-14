import React, { useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { ThemeContext } from '../../Context/ThemeContext';
import axios from 'axios';
import HeroSection from '../../components/HeroSection/HeroSection';
import HeroBG from '../../assets/hero.jpg'
import HeroBGDark from '../../assets/herobgdark.jpg'
import FeatureSection from '../../components/FeatureSection/FeatureSection';
import LatestJobs from '../../components/LatestJobs/LatestJobs';

const Home = () => {
  const { isSignedIn } = useUser();
  const { darkMode } = useContext(ThemeContext);
  const [jobs, setJobs] = useState([])

  // useEffect(() => {
  //   const fetchJobData = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:4000/api/job")
  //       console.log(response.data)
  //       setJobs(response.data.jobs);
  //     } catch (error) {
  //       console.log("Error Fetching Jobs")
  //     }
  //   }
  //   fetchJobData()
  // }, [])

  return (
    <div
      className={`flex flex-col items-center justify-center transition duration-300 ${darkMode ? "text-white" : "text-black"
        }`}
    >
      <div className='w-screen' style={{
        backgroundImage: `${darkMode ? `url(${HeroBGDark})`: `url(${HeroBG})`}`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "1rem",
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
      }}>

        <HeroSection />
      </div>
      <div>
        <FeatureSection/>
      </div>
      <div>
        <LatestJobs/>
      </div>
    </div>
  );
};

export default Home