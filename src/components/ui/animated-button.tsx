
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  animation?: 'scale' | 'slide' | 'bounce' | 'pulse';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  className, 
  animation = 'scale',
  ...props 
}) => {
  const animationClasses = {
    scale: 'transition-transform duration-200 hover:scale-105 active:scale-95',
    slide: 'relative overflow-hidden transition-all duration-300 hover:shadow-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
    bounce: 'transition-all duration-200 hover:animate-bounce',
    pulse: 'transition-all duration-200 hover:animate-pulse'
  };

  return (
    <Button 
      className={cn(animationClasses[animation], className)} 
      {...props}
    >
      {children}
    </Button>
  );
};

export default AnimatedButton;
