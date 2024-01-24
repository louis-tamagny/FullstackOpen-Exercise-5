const ErrorMessage = ({message}) => {
  if (message !== '') {
    return <p>{message}</p>
  }  
}

export default ErrorMessage