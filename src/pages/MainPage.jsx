import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import discoverImg from '../assets/images/Discover_routine_home.jpg';
import buildImg from '../assets/images/Create_routine_home.jpg';
import saveImg from '../assets/images/Save_routine_home.jpg';
import './MainPage.css';

/* Welcome to the homepage of Holu. 
  Guest users can only view this page (navBar.jsx, app.jsx handles that)
  Inspired by my previous projects and also Dribbble designs
  I wanted to make this homepage more engaging and show all the cool features
  the this app has to offer. I also spent time how I can set this up. 
  So my idea is to seperate them by sections. So I started with a hero (intro),
  feature that display texts about each feature (I want to keep it simple)
  Lastly a CTA (call to action) to encourage users to sign up once they made it to the end.
  I also fiddle around with color and font combinations to fit the theme 
  I also like to thank Zuri and Jeremiah to make this magic happen for our project! 
                  - Jason */

/* Credits - 
    Wireframing Design: Jason Garcia
    Assets/Images: Jason Garcia (Photoshop)
    Coding: Zuri Fleurinord, Jeremiah Webb */

const FeatureSection = ({ title, description, image, reverse = false, index = 0 }) => (
  <div
    className={`feature reveal ${reverse ? 'feature--reverse' : ''}`}
    style={{ animationDelay: `${index * 0.15}s` }}
  >
    <div className="feature-content">
      <h2 className="feature-title">{title}</h2>
      <p className="feature-description">{description}</p>
    </div>
    <div className="feature-image-wrapper">
      <img src={image} alt={title} className="feature-image" />
    </div>
  </div>
);

// Instead of making a seperate component for each section, I decided
// to put them here so I can easily adjust it without scrolling up and down
// Such as changing the description or image. Which I constantly do when I feel 
// like it. I also think this makes the DOM cleaner
const FEATURES = [
  {
    title: 'Discover Routines',
    description:
      'Browse a growing library of workout routines built by real people. Filter by muscle group, difficulty, or days per week to find one that fits your life.',
    image: discoverImg,
  },
  {
    title: 'Build Your Own',
    description:
      'Create fully customized routines day by day. Add exercises, set your reps and sets, and publish when you\'re ready to share with the community.',
    image: buildImg,
    reverse: true,
  },
  {
    title: 'Save & Come Back',
    description:
      'Bookmark routines you love and come back to them anytime. Build a personal library of workouts that inspire you.',
    image: saveImg,
  },
];

function MainPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="main-page">
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-content">
          <p className="hero-uppertext">Build Your Perfect Workout Plan</p>
          <h1 className="hero-heading">Achieve Your Fitness Goals <br />
            <span className="hero-heading-accent">With Holu</span>
          </h1>
          <p className="hero-subheading">
            Create, customize, and share workout routines tailored to your goals.
            Whether you're bulking up, slimming down, or just staying active, Holu has you covered.
          </p>
          <div className="hero-actions">
            <button
              className="btn btn-explore btn--large"
              onClick={() => navigate('/routines')}
            >
              Explore
            </button>
            <button
              className="btn btn-register btn--large"
              onClick={() => navigate('/register-account')}
            >
              Get Started
            </button>
          </div>
        </div>
      </section>


      <section className="features">
        <div className="features-inner">
          {FEATURES.map((feature, i) => (
            <FeatureSection
              key={feature.title}
              {...feature}
              index={i}
            />
          ))}
        </div>
      </section>


      <section className="cta reveal">
        <div className="cta-inner">
          <h2 className="cta-title">Ready to Transform Your Fitness Journey?</h2>
          <p className="cta-description">
            Join Holu today and start crafting your personalized workout plans.
            Whether you're a beginner or a seasoned athlete, our tools and community support will help you reach your goals faster.
          </p>
          <button
            className="btn btn-cta btn--large"
            onClick={() => navigate('/register-account')}
          >
            Join Now
          </button>
        </div>
      </section>
    </div>
  );
};


export default MainPage;
