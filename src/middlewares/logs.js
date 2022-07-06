export default (req, res, next)=>{
    console.log(req);
    
    const body = req.body;
    const path = req.originalUrl;
    const method = req.method;
    const params = req.params;
    const headers = req.headers;
    const user_session = req.session.user;

    res.sql`
    
        INSERT INTO public.logs
        ( body, path, method, params, headers, user_session )
        VALUES (${body}, ${path}, ${method}, ${params}, ${headers}, ${user_session})
        RETURNING id_log;
    
    `
    next();
}




