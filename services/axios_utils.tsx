const axiosUIErrorHandler = (error: any, toast: any) => { // toast is gotten from useToast()
  if (error.message) {
    toast({
      description: error.message,
      variant: "destructive",
    });
  } else if (error.request) {
    toast({
      description:
        "Something has gone wrong with the server, please try again!",
      variant: "destructive",
    });
  } else {
    toast({
      description: "Something has gone wrong!",
      variant: "destructive",
    });
  }
};

export {
    axiosUIErrorHandler
}