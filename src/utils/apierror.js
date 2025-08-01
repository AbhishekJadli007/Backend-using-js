class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;
        
        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}

export {ApiError};

// class ApiError extends Error {
//     🔹 Yahaan ek class banayi gayi hai jo Error class ko extend karti hai.
//     ➡️ Matlab: Yeh class custom error banayegi jo normal JavaScript error se zyada information de sakti hai.
    
//     constructor(
//         statusCode,
//         message = "Something went wrong",
//         errors = [],
//         stack = ""
//     )
// constructor is a special method that is used to create and initialize an object created within a class.
//     🔹 Constructor ka matlab hota hai jab aap new ApiError(...) likhoge to kya initialize hoga.
//     ➡️ Isme 4 parameters liye gaye hain:

//     statusCode – HTTP status code jaise 404, 500, 401, etc.
    
//     message – Error message jo default hai "Something went wrong"
    
//     errors – Ek array jo multiple errors rakh sakta hai (agar ho).
    
//     stack – Stack trace (kaunsa function call hua, etc.)
    
//     super(message);
//     🔹 Yeh line parent class Error ko call karti hai, jisme message pass kiya gaya hai.
//     ➡️ Normal errors mein bhi yeh hota hai, lekin hum apna custom behavior add kar rahe hain.
    
  
//     this.statusCode = statusCode;
//     this.data = null;
//     this.message = message;
//     this.success = false;
//     this.errors = errors;
//     🔹 Yeh sab class ke andar variables set kiye gaye hain:
    
//     statusCode – error code
    
//     data – null, kyunki error hai toh data nahi bhej rahe
    
//     message – error ka message
    
//     success – false, kyunki error aaya hai
    
//     errors – jo array pass kiya gaya tha, usme errors honge
    

//     if (stack) {
//         this.stack = stack;
//     } else {
//         Error.captureStackTrace(this, this.constructor);
//     }
//     🔹 Agar stack diya gaya hai, toh usko use karo.
//     ➡️ Warna, Error.captureStackTrace ka use karke automatic stack trace generate karo.
    
//     🔸 Export:

//     export { ApiError };
//     ➡️ Is class ko baahar ke files mein use karne ke liye export kiya gaya hai.
    
//     🎯 Use Case Example (Kaise use hoga):
 
//     throw new ApiError(404, "User not found", []);
//     ➡️ Jab koi user nahi mila, toh 404 error throw karenge ApiError ke through.
    
//     Summary:
//     Yeh class help karti hai:
    
//     Consistent error format dene mein
    
//     Status code, message, errors, aur stack trace bhejne mein
    
//     Backend development mein especially REST APIs ke liye bahut useful hai.