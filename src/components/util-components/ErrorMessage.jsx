function ErrorMessage({errorMessage}) {
    return (<div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-center text-sm">
        {errorMessage}
      </div>)
}

export default ErrorMessage;