
const { error } = require('console')
const fs = require('fs')

// fs.writeFile(
//     'textdata.txt',
//     'hello this is a text file',
//     (error) =>{}
// )
// fs.writeFileSync("text.txt","hello this is sync file text")


// const text =  fs.readFileSync("./text.txt","utf-8")
// // Async readfile does not return anything ie the result or text is void 
// const text =  fs.readFile("./text.txt","utf-8",(err,result)=> {
//     if(err){ console.log("error",err)}
//     console.log(result)
// })
// console.log(text)


//// append fs 

// fs.appendFileSync('./text.txt',new Date().getMinutes().toLocaleString()) // append file 

// fs.cpSync("./text.txt","./copy.txt") // copy file 

// fs.unlinkSync("./copy.txt") // delete file 
 
// console.log(fs.statSync("./text.txt"))  // Gives the stats of the file 


// const os = require('os') // to

// console.log(os.cpus().length)