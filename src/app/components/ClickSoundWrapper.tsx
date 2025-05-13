import React, { ReactElement, cloneElement } from "react";

interface ClickSoundWrapperProps {
  children: ReactElement;
}

const ClickSoundWrapper = ({ children }: ClickSoundWrapperProps) => {
  const handleClick = (e: React.MouseEvent) => {
    const clickSound = new Audio("/click.mp3");
    clickSound.play();

    // @ts-expect-error
    if (children.props.onClick) {
      // @ts-expect-error
      children.props.onClick(e);
    }

  };

  return cloneElement(children, {
    onClick: handleClick,
  });
};

export default ClickSoundWrapper;
