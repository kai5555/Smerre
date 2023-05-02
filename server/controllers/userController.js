const { Router } = require("express"); // import router from express
const User = require("../modals/userModal"); // import user model
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const Token = require("../modals/tokenModal");
const crypto = require("crypto");
const sendEmail = require("../utils/emails/sendEmail");
const {registrationValidation, loginValidation }  = require("../utils/validation");

// Check if user is currently logged in
exports.isUserAuth = (req, res) => {
  return res.json({ isLoggedIn: true, username: req.user.username });
};

// Post the login form
exports.login = async (req, res) => {
  try {
  
      // Validate input
      const data = req.body;
      if (!data) return res.json({message: "Server Error"})
  
      const validationError = loginValidation(data).error
      if (validationError) {
          return res.json({message: validationError.details[0].message})
      }
      
      // Check if the user exists, if not so prompt user with error message
      const user = await User.findOne({ username: req.body.username });
      if(!user){
        res.json({message: "User doens't exist"});
        return;
      }
        
      // Check if password matches, if not so prompt user with error message
      const result = await bcrypt.compare(req.body.password, user.password);
      if (!result) {
        res.json({message: "Password and email don't match"});
        return;    
      } 
  
      // Check if the user is already verified
      if (!user.verified){
  
        //Check if there is already a token, if not create a new one and send a new mail
        let token = await Token.findOne({ userId: user._id});
        if(!token){
          const token = await Token.create({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
          });
          const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;
          await sendEmail(user.email, "Bevestig Email","verifyEmailTemplate", {url: url, username: user.username});
  
          res.json({message: "An email has been sent, please verify"});
        }
        else{
          res.json({message: "Your account hasn't been verified yet, please check your emails"});
        }
        return;
      }
  
      // Sign token and send it in response
      const token = await jwt.sign({ username: user.username }, process.env.PASSWORDSECRET, {expiresIn: '1h'});
      res.json({message: "Success", token: "Bearer " + token});
      
    } catch (error) {
      console.log("Error on login: " + error);
      res.status(400).json({ error });
    }
  }
  

// Post signup form
exports.register = async (req, res) => {
  try {

    // Validate input
    const data = req.body;
    if (!data) return res.json({message: "Server Error"})

    const validationError = registrationValidation(data).error
    if (validationError) {
      console.log(validationError);
      return res.json({message: validationError.details[0].message})
    }

    // Check if this user already exists with username, if so prompt with error message
    let user = await User.findOne({ username: data.username });
    if (user){
      res.json({message: "Username has already been taken"});
      return;
    }

    // Check if this user already exists with email adres, if so prompt with error message
    user = await User.findOne({ email: data.email });
    if (user){
      res.json({message: "Email has already been taken"});
      return;
    }

    // Hash the password
    data.password = await bcrypt.hash(data.password, 10);

    // Create a new user
    user = await User.create({
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      email: data.email,
    });
    
    // Create a token for mail verification
    const token = await Token.create({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex')
    });

    // Create a url and send it via mail
    const url = `${process.env.BASE_URL}verify/${user._id}/${token.token}`;
    await sendEmail(user.email, "Bevestig Email","verifyEmailTemplate", {url: url, username: user.username});
    console.log("Verification email has been sent");
    
    // Redirect to login page and prompt user with succes
    res.json({message: "Success"});

  }catch (error) {
    console.log("Error on register: " + error)
      res.status(400).json({ error });
  }
}

// Get the user update profile
// router.get("/:id/update", async (req, res) =>{
//   if(!req.user) {
//     res.redirect("/login");
//     return;
//   }
//   var user = await User.findById(req.params.id);
//   if(user){
//     if(req.user.username != user.username) {
//       res.status(400).json("Access denied");
//       return;
//     }
//     const successes = req.flash('successes') || [];
//     const errors = req.flash('errors') || [];
//     const stored = req.flash('stored') || [];
//     res.render("user/user_update", {user: user, title: 'Insapi | Settings', successes, errors, stored});
//   }
//   else{
//     res.status(400).json("User not found");
//   }

// });

// Post the update form
exports.updateUser = async (req, res) => {
  try {

    //Get input
    var input = {
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      _id: req.params.id,
    };

    // Get the user, if no user is found something went wrong
    var user = await User.findById(req.params.id);
    if(!user){
      req.flash("errors","Oops something went wrong, user not found!");
      req.flash("stored", input);
      res.redirect("/signup");
      return;
    }
    
    // Update the user 
    await User.updateOne({ _id: req.params.id}, input);
    req.flash("successes","Your profile got updated succesfully");
    res.redirect(user.url + "/update");    
      
  }catch (error) {
      res.status(400).json({ error });
  }
}

// Get the user update profile
// router.get("/:id/delete", async (req, res) =>{
//   if(!req.user) {
//     res.redirect("/login");
//     return;
//   }
//   var user = await User.findById(req.params.id);
//   if(user){
//     if(req.user.username != user.username) {
//       res.status(400).json("Access denied");
//       return;
//     }
//     const successes = req.flash('successes') || [];
//     const errors = req.flash('errors') || [];
//     res.render("user/user_delete", {user: user, title: 'Insapi | Delete', successes, errors});
//   }
//   else{
//     res.status(400).json("User not found");
//   }

// });

// Post the update form
exports.deleteUser = async (req, res) => {
  try {

    // Get the user 
    var user = await User.findById(req.params.id);
    if(!user){
      req.flash("errors","Oops something went wrong, user not found!");
      req.flash("stored", input);
      res.redirect("/signup");
      return;
    }
    
    // Delete your profile picture
    await Image.findByIdAndRemove(user.profilePicture);
    
    // Delete the user 
    await User.findByIdAndRemove(req.params.id);
    req.flash("successes","Your profile has succesfully been deleted");
    res.redirect("/signup");    
      
  }catch (error) {
      res.status(400).json({ error });
  }
}


// When opening mail verification link
exports.verifyEmailUser = async (req, res) => {
	try {

    //Check if the user exists, if not so this is a invalid link and redirect to invalid page
		const user = await User.findOne({ _id: req.body.user });
		if (!user){ 
      return res.status(400).json({message: "Email has already been taken"});
    }

    //Check if the token exists, if not so this is a invalid link and redirect to invalid page
		const token = await Token.findOne({
			userId: user._id,
			token: req.body.token,
		});
		if (!token){
      return res.status(400).json({message: "Token has already been taken"});
    }

    // Update the user to verified and remove the token
		await User.updateOne({ _id: user._id}, {verified: true });
		await Token.deleteOne({ _id: token._id });

    // Open the verified page to let the user know
		console.log("Email verified successfully");
    res.json({message: "Success"});
	} catch (error) {
    console.log(error);
		console.log("Internal Server Error");
	}
}

exports.resend = async (req, res) => {
  //Check if the user exists, if not so this is a invalid link and redirect to invalid page
  const user = await User.findOne({ username: req.body.username });
  if (!user){ 
    req.flash("errors","User not found while resending email");
    req.flash("stored", { username: req.body.username} );
    res.redirect("/login")
    return;
  }

  // Get the users token for mail verification
  let token = await Token.findOne({
    userId: user._id,
  });
  if(!token){
    // Create a new token for mail verification
    token = await Token.create({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex')
    });
  }

  // Create a url and send it via mail
  const url = `${process.env.BASE_URL}verify/${user._id}/${token.token}`;
  await sendEmail(user.email, "Bevestig Email","verifyEmailTemplate", {url: url, username: user.username});
  console.log("Verification email has been sent");

  req.flash("successes","Succesfully resend email");
  req.flash("stored", { username: req.body.username} );
  res.redirect("/login")

}

// When we post a recovey request form
exports.sendPasswordRecovery = async (req, res) => {
  try {
      
      // Check if the user exists using the provided email, if not so prompt with error
      const user = await User.findOne({ email: req.body.email});
      if(!user) {
        return res.json({message: "No user found with email"});
      } 

      //Check if the token exists, if not so make a new token
      let token = await Token.findOne({userId: user._id});
      if (!token){
          token = await Token.create({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
          });
      } 

      //Use the token and user to create an url, then sent this via a mail
      const url = `${process.env.BASE_URL}recovery/${user._id}/${token.token}/`;
      await sendEmail(user.email, "Password Reset","recoveryEmailTemplate", {url: url, username: user.username});   
      console.log("Recovery email has been sent");
      
      // Redirect user to recovery request page and prompt with succes
      return res.json({message: "Success"});
  } catch (error) {
      res.status(400).json({ error });
  }
}


// When we open a recovery link
exports.verifyPasswordRecovery = async (req, res) => {
  try {

    //Check if the user exists, if not so this is a invalid link and redirect to invalid page
    const user = await User.findOne({ _id: req.body.user });
    if (!user){ 
      return res.status(400).json({message: "Invalid recovery link provided"});
    }

    //Check if the token exists, if not so this is a invalid link and redirect to invalid page
    const token = await Token.findOne({
        userId: user._id,
        token: req.body.token,
    });
    if (!token){
      return res.status(400).json({message: "Invalid recovery link provided"});
    }

    //Render to the recovery page 
    return res.json({message: "Success"});
  } catch (error) {
    console.log("Internal Server Error");
    return res.status(400).json({message: "Internal Server Error"});
  }
}

// Post the new password for recovery
exports.passwordRecovery = async (req, res) => {
  try {

    //Check if the user exists, if not so something went very wrong
  const user = await User.findOne({ _id: req.body.user });
  if (!user){ 
      return res.json({message: "User not found"});
    }

    //Check if the token exists, if not so something went very wrong
    const token = await Token.findOne({
        userId: user._id,
        token: req.body.token,
    });
    if (!token){
      return res.json({message: "Token for recovery not found"});
    }

    // Since these tokens are also opened via mail and are the same for recovery and verification,
    // the user also opened this via mail so we set him as verified. We also adjust the new password.
    // After that remove the token 
    const password = await bcrypt.hash(req.body.password, 10);
    await User.updateOne({ _id: user._id}, {verified: true, password: password});
		await Token.deleteOne({ _id: token._id });

    // Everything went well, redirect to login page and prompt with succes alert
    console.log("Password succesfully recovered");
    return res.json({message: "Success"});
  } catch (error) {
    console.log("Internal Server Error");
  }
}

