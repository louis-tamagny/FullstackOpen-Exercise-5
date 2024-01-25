const Notification = ({ message, color }) => {
  if (message !== '') {
    return <p id='notification' style={{ color: color, borderColor: color }}>{message}</p>
  }
}

export default Notification