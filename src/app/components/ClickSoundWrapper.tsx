import { type ReactElement, cloneElement, type MouseEvent, type JSXElementConstructor } from "react"

interface ClickSoundWrapperProps {
  children: ReactElement<any, string | JSXElementConstructor<any>>
}

const ClickSoundWrapper = ({ children }: ClickSoundWrapperProps) => {
  if (!children) {
    return null
  }

  const handleClick = (e: MouseEvent) => {
    const clickSound = new Audio("/click.mp3")
    clickSound.play()

    // Call child's original onClick if it exists
    if (children.props.onClick) {
      children.props.onClick(e)
    }
  }

  return cloneElement(children, {
    onClick: handleClick,
  } as any)
}

export default ClickSoundWrapper
