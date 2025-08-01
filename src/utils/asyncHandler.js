// why are we creating a asyncHandler function?
// because we want to handle errors in a better way and also we will use this function multiple times like to access
//  the database or to access the file system or to access the api 
// so instead of writing try catch block multiple times we will use this function

// what are higher order functions?
// higher order functions are functions that take other functions as arguments or return functions as their results
//const somefunction = (functionasargument) => {// yaha callback hota h : but in higher order functions we pass another arrow function / function in call back}
//example : const asyncHandler = (function1) =>{()=>{}}
// we can also write this as const asyncHandler = (function1) =>()=>{}
// now how to make it as async function ? -> const asyncHandler = (fn) => async(req,res,next)=>{}

// try catch block 
// const asyncHandler = (fn) => async(req,res,next)=>{
//     try{
//         await fn(req,res,next)
//     }catch(error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message,
//         })
//     }
// }

// use promises 

const asyncHandler = (requestHandler) =>{
    (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=> {next(err)});
    }
}

export default asyncHandler;  // export {asyncHandler} 