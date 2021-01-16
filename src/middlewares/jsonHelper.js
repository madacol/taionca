export default (req, res, next)=>{
    res.json = obj => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(obj));
    }
    next();
}