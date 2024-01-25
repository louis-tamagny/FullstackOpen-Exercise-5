const Notification = ({message, color}) => {
  if (message !== '') {
    return <p id='notification' style={{color:color, 'border-color':color}}>{message}</p>
  }  
}

export default Notification