import express from 'express';
import axios from 'axios'
import pg from 'pg';


const app = express();

const PORT = 3000;
const GIT = 'https://api.github.com'

const DBURL = 'postgres://vsulndeb:Z-7862R8_TIXn6Kbe5g3PQGXELxsOLz_@queenie.db.elephantsql.com:5432/vsulndeb'; //db connection url
const db = new pg.Pool({ //DB initialization
    connectionString:DBURL
})

/**
 * No route ID for server
 */
app.get('/',(req,res)=>{
    res.send('Connected to github api')
});

db.on('connect',(client)=>{
 console.log('connected to db');
    createTable(client)
});

/**
 * Used to create table on initialization if no table exists
 * @param {db ref} client 
 * Returns void
 */
async function createTable(client){
    try{

        const TABLE = `CREATE TABLE IF NOT EXISTS repos (
            id serial PRIMARY KEY, 
            owner text NOT NULL, 
            repo text NOT NULL
            )`;

        const {rows} = await client.query(TABLE);
        console.log(rows);
        const QUERY = `SELECT owner,repo from public.repos WHERE id = 1`
        const dat = await client.query(QUERY);
        if(dat.length == 0){
            const INSERT = `INSERT INTO public.repos (id,owner,repo) VALUES (DEFAULT,'${owner}','${repo}')
            `
           await client.query(INSERT)
        }
    }catch(error){
        console.log(error)
    }finally{
        client.release();
    }
}

/**
 * 
 * @param {db ref} db 
 * @param {repo owner ID} owner 
 * @param {repo name} repo 
 * Returns void
 */
async function insertRepo(db,owner,repo){
    try{
    
        const INSERT = `UPDATE public.repos 
        SET owner = '${owner}',repo = '${repo}'
        where id = 1 
        `
        const client = await db.connect()
       await client.query(INSERT)
       client.release();
       
    }catch(error){
        console.log(error);
    }
}

/**
 * gets saved repo infor from database.
 * @param {reference to DB} db 
 * Returns map of form {owner: string, repo: string}
 */
async function getRepo(db){
    try{
        const client = await db.connect();

        const QUERY = `SELECT owner,repo from public.repos WHERE id = 1`
        const dat = await client.query(QUERY);
        return dat.rows[0];
    }catch(error){
        console.log(error)
    }   
}

/**
 * example of endpoint
 * localhost:3000/repoStats?owner=exampleOwner&repo=exampleRepo
 * Returns object of form {week: String,commits: int,additions: int,deletions: int}.
 */
app.get('/repoStats',async (req,res)=>{

    try{
        let owner = '';
        let repo = '' ;

        if(req.query.owner != null && req.query.repo != null){
            owner = req.query.owner;
            repo = req.query.repo;
        } else{
          const dbData =  await getRepo(db)
          owner = dbData.owner;
          repo = dbData.repo;
     
   
    }
    const data = await axios.get(`${GIT}/repos/${owner}/${repo}/stats/contributors`);
        
    const weeklyStats = data.data[0].weeks;
    const lastWeek = weeklyStats[weeklyStats.length-1] //weeky stats ordered in cronological order
    const dataFinal = {
        week: new Date(lastWeek.w * 1000).toLocaleDateString(),
        commits: lastWeek.c,
        additions: lastWeek.a,
        deletions: lastWeek.d
    }
        res.send(dataFinal)
    }catch(error){
        console.log(error)
        res.send(null)
    }
 
})

/**
 * Adds row of repo record
 * Example endpoints:
 * localhost:3000/addRepo?owner=exampleOwner&repo=exampleRepo
 * sends response with ID number
 */
app.get('/addRepo',async (req,res)=>{
    //Function replaces db reference for current repo being tracked
    //DB always contains one repo account
    //
    try{
        if(req.query.owner == null || req.query.repo === null)
            res.send('Invalid parameters',400);
        else if(req.query.owner.length > 0 && req.query.repo.length > 0){
            const owner = req.query.owner;
            const repo = req.query.repo;

           const id =  await insertRepo(db,owner,repo);
           res.send(`${id}`);

        }


    }catch(error){
        console.log(error)
        res.send(400).send('Invalid url');
    }
})

app.listen(PORT,()=>
console.log(`Listening on Port ${PORT}`));

