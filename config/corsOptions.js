
const whiteList = [
    'https://www.yourdomain.com', 
    'http://127.0.0.1.5500', 
    'http://localhost:4000',
];

const corsOptions = {
    origin:(origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error('Not Allowed by CORS'));
        }
    },
    optionsSucessStatus: 200,
}

module.exports = corsOptions;
//     console.log(`Server running on port ${PORT}`);