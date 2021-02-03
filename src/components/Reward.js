import React, { Component } from 'react'
import PropTypes from 'prop-types'
import posed from 'react-pose'

import confetti from './Confetti'
import emoji from './Emoji'

const transition = {
  type: 'spring',
  stiffness: 200,
  damping: 2
}

const SpringAnim = posed.div({
  confetti: {
    y: 5,
    transition
  },
  emoji: {
    y: 5,
    transition
  },
  punished: {
    x: 5,
    transition
  },
  resting: {
    y: 0,
    x: 0,
    scale: 1,
    transition
  }
})

export default class Reward extends Component {
  state = {
    state: 'resting'
  }

  rewardMe = () => {
    const { type, config } = this.props
    const props = [this.container, config]
    switch (type) {
      case 'confetti': {
        this.handleAnimation(type)
        confetti(...props)
        break
      }
      case 'emoji': {
        this.handleAnimation(type)
        emoji(...props)
        break
      }
      default: {
        break
      }
    }
  }

  punishMe = () => {
    this.handlePunishAnimation()
  }

  rest = () => {
    setTimeout(() => {
      this.setState({ state: 'resting' })
    }, 100)
  }

  handleAnimation = (type) => {
    this.setState({ state: type }, () => {
      this.rest()
    })
  }

  handlePunishAnimation = () => {
    this.setState({ state: 'punished' }, () => {
      this.rest()
    })
  }

  render() {
    const { config, children } = this.props
    const { springAnimation = true, containerStyle = {} } = config
    const { state } = this.state
    return (
      <React.Fragment>
        <div style={containerStyle} ref={(ref) => { this.container = ref }} />
        <div style={{...containerStyle, ...lottieContainerStyles}} ref={(ref) => { this.lottieContainer = ref }} />
        <SpringAnim pose={springAnimation && state}>
          {children}
        </SpringAnim>
      </React.Fragment>
    )
  }
}

const lottieContainerStyles = { position: 'relative' }

Reward.propTypes = {
  type: PropTypes.string.isRequired,
  config: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
}

Reward.defaultProps = {
  config: {}
}
