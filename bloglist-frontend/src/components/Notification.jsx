import PropTypes from 'prop-types'

const Notification = ({ message, color }) => {
  if (message !== '') {
    return <p id='notification' style={{ color: color, borderColor: color }}>{message}</p>
  }
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
}

export default Notification