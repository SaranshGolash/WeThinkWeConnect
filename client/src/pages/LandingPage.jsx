import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ROUTES } from '../routes';

const LandingPage = () => {
  return (
    <div className="w-full flex flex-col gap-32">
      
      {/* Hero Section */}
      <section className="text-center flex flex-col items-center justify-center gap-8 pt-10 animate-fade-in">
        <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono tracking-widest text-primary uppercase mb-4">
          v1.0 Live
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">
          Half-Baked Thoughts<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary">
            Unsettled Disputes
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-text-muted max-w-2xl leading-relaxed">
          The anti-social network. No likes. No conclusions. <br/>
          Just a chain of raw thoughts, radical empathy and cold wars in form of discussions.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Button to={ROUTES.UNFINISHED} variant="gradient">
            Start a Thought
          </Button>
          <Button to={ROUTES.LOGIN} variant="secondary">
            Join the Network
          </Button>
        </div>
      </section>

      {/* The Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        
        {/* UseCase 1 */}
        <Card className="h-full">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6 text-2xl">
            ☁️
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Unfinished</h3>
          <p className="text-text-muted mb-8 leading-relaxed">
            Post thoughts without conclusions. Users can only extend your logic, not end it.
          </p>
          <Link to={ROUTES.UNFINISHED} className="text-sm font-bold text-primary hover:text-white transition-colors flex items-center gap-2">
            Enter the Fog <span aria-hidden="true">&rarr;</span>
          </Link>
        </Card>

        {/* UseCase 2 */}
        <Card className="h-full">
          <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-6 text-2xl">
            🔄
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">EchoSwap</h3>
          <p className="text-text-muted mb-8 leading-relaxed">
            Borrow a mind. You must argue from your opponent's perspective for 5 minutes.
          </p>
          <Link to={ROUTES.ECHOSWAP} className="text-sm font-bold text-secondary hover:text-white transition-colors flex items-center gap-2">
            Start Swapping <span aria-hidden="true">&rarr;</span>
          </Link>
        </Card>

        {/* UseCase 3 */}
        <Card className="h-full">
          <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-6 text-2xl">
            ⚖️
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Conflict</h3>
          <p className="text-text-muted mb-8 leading-relaxed">
            A chat room locked by distance. You can only speak if you move closer to agreement.
          </p>
          <Link to={ROUTES.CONFLICT} className="text-sm font-bold text-accent hover:text-white transition-colors flex items-center gap-2">
            Resolve Now <span aria-hidden="true">&rarr;</span>
          </Link>
        </Card>
      </section>
    </div>
  );
};

export default LandingPage;