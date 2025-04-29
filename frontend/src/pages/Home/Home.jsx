import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../Context/ThemeContext';
import HeroSection from '../../components/HeroSection/HeroSection';
import HeroBG from '../../assets/hero.jpg'
import HeroBGDark from '../../assets/herobgdark.jpg'
import FeatureSection from '../../components/FeatureSection/FeatureSection';
import LatestJobs from '../../components/LatestJobs/LatestJobs';
import MotivationBanner from '../../components/MotivationBanner/MotivationBanner';
import RecommendedJobs from '../../components/RecommendedJobs/RecommendedJobs';
import { useSelector } from 'react-redux';
import RecruiterJobStatus from '../../components/RecruiterJobsStatus/RecruiterJobStatus';
import Loading from '../../components/Loading/Loading';
import { useUser } from '@clerk/clerk-react';

const Home = () => {
  const { darkMode } = useContext(ThemeContext);
  const user = useSelector((state) => state.auth.user)
  const {isSignedIn} = useUser()
  const isRecruiter = user?.role === "recruiter";

  const role = user?.role
  if(isSignedIn && !role)return <Loading/>

  return (
    <div
      className={`flex flex-col items-center justify-center transition duration-300 ${darkMode ? "text-white" : "text-black"
        }`}
    >
      <div className='w-screen' style={{
        backgroundImage: `${darkMode ? `url(${HeroBGDark})` : `url(${HeroBG})`}`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "1rem",
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
      }}>

        <HeroSection />
      </div>
      <div>
        <FeatureSection />
      </div>
      <div>
        <LatestJobs />
      </div>
      <div>
        <MotivationBanner />
      </div>
      <div>
        {!isRecruiter && <RecommendedJobs />}
      </div>
      <div>
      {isRecruiter && <RecruiterJobStatus />}
      </div>
    </div>
  );
};

export default Home