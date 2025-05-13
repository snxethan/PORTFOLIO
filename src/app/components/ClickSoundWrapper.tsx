import {
  ReactElement,
  cloneElement,
  MouseEvent,
  isValidElement,
} from "react";

interface ClickSoundWrapperProps {
  children: ReactElement<{ onClick?: (e: MouseEvent) => void }>;
}

const ClickSoundWrapper = ({ children }: ClickSoundWrapperProps) => {
  const handleClick = (e: MouseEvent) => {
    const clickSound = new Audio("/click.mp3");
    clickSound.play();

    // Call child’s original onClick if it exists
    children.props.onClick?.(e);
  };

  return cloneElement(children, {
    onClick: handleClick,
  });
};

export default ClickSoundWrapper;
