
const mongoose=require('mongoose');
const passport=require('passport');
const googleAuth=require('passport-google-oauth20');
const time=require('./../libs/timeLib');


//models
const socialUser=mongoose.model('socialUser');



/**
 * serializeUser to store user id into session
 * it determines which part of object should store in session
 */

passport.serializeUser((user, done) => {
    done(null, user.id)
})

 /**
  * deserializeUser to retrieve whole user object using session userID
  */

 
passport.deserializeUser((id, done) => {
    socialUser.findById(id)
        .then(user => {
            done(null, user)
        })
})

 /**
  * google statregy and callback
  */

  passport.use(new googleAuth(
      {
          clientID:'1070596748541-163tbq4s1qn9gvofhe8vruitovlf1ema.apps.googleusercontent.com',
          clientSecret:'5SGPJ9tQAhgLMUREc3kFvOXe',
          callbackURL:'auth/google/callback'
      },
      (accessToken,refreshToken,profile,done)=>
      {
            for(let x of profile.emails)
            {
                var email=x.value;
            }
            var existingUser="";
            socialUser.findOne({userId:profile.id},(err,userdata)=>
            {
                existingUser=userdata;
            });

            if(existingUser)
            {
                done(null,existingUser);
            }
            else
            {
                let newUser=new socialUser(
                    {
                        userId:profile.id,
                        firstname:profile.name.givenName,
                        lastName:profile.name.familyName,
                        email:email,
                        cretedOn:time.now()
                    }
                )
                newUser.save();
                done(null,user);
                
            }

      }
  ))