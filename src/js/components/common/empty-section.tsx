import React, {ComponentType} from "react"
import styled from "styled-components"

const EmptyWrapper = styled.div`
  display: flex;
  min-width: 100%;
  flex-direction: column;
  align-items: center;
  margin: 26px 0;
  user-select: none;

  svg {
    fill: var(--cloudy);
  }

  p {
    ${(props) => props.theme.typography.labelSmall};
    color: var(--slate);
    text-align: center;
    margin: 16px 14px 0;
  }
` as ComponentType<any>

type EmptySectionProps = {
  icon?: any
  message: string
}

const EmptySection = ({icon, message}: EmptySectionProps) => {
  return (
    <EmptyWrapper>
      {icon || null}
      <p>{message}</p>
    </EmptyWrapper>
  )
}

export default EmptySection
