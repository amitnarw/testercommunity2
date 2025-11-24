import { Loader } from 'lucide-react';

const LoadingIcon = ({ py }: { py?: string }) => {
  return (
    <div className={`flex items-center justify-center ${py ? py : 'py-12'}`}>
      <Loader className='h-6 w-6 animate-spin' />
    </div>
  );
};

export default LoadingIcon;
