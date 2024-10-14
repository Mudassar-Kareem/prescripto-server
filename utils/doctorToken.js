const doctorToken = (doctor, statusCode, res,message) => {
    const doctorToken = doctor.getJwtToken();
  
    // Options for cookie
    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };
  
    // Setting cookie and sending response
    res.status(statusCode).cookie("doctor_token", doctorToken, options).json({
      success: true,
      doctor,
      doctorToken,
      message
    });
  };
  
  module.exports = doctorToken;
  