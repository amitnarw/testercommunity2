import { SiteLogo } from './icons';

const LoadingIcon = () => {
  return (
    <div className="flex items-center justify-center py-12">
        <div className="relative flex items-center justify-center">
            <div className="absolute h-24 w-24 rounded-full bg-primary/20 animate-ping"></div>
            <SiteLogo className="h-16 w-16" />
        </div>
    </div>
  );
};

export default LoadingIcon;
